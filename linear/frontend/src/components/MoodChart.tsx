import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { TrendPoint } from '../types';

type Metric = 'mood' | 'energy' | 'stress';

interface MoodChartProps {
  data: TrendPoint[];
  loading?: boolean;
  /** Called when the user changes period (days) or metric */
  onPeriodChange?: (days: number, metric: Metric) => void;
}

const periodOptions = [7, 14, 30] as const;

const metricConfig: Record<Metric, { label: string; color: string; icon: string }> = {
  mood:   { label: 'Mood',   color: '#4f46e5', icon: '😊' },
  energy: { label: 'Energy', color: '#f59e0b', icon: '⚡' },
  stress: { label: 'Stress', color: '#ef4444', icon: '😰' },
};

/** Line chart for mood / energy / stress trends with period + metric toggles */
const MoodChart: React.FC<MoodChartProps> = ({ data, loading, onPeriodChange }) => {
  const [activePeriod, setActivePeriod] = useState<number>(7);
  const [activeMetric, setActiveMetric] = useState<Metric>('mood');

  const handlePeriodChange = (days: number) => {
    setActivePeriod(days);
    onPeriodChange?.(days, activeMetric);
  };

  const handleMetricChange = (metric: Metric) => {
    setActiveMetric(metric);
    onPeriodChange?.(activePeriod, metric);
  };

  const { label, color } = metricConfig[activeMetric];

  return (
    <div className="card mood-chart">
      {/* Header row: title + period toggles */}
      <div className="mood-chart__header">
        <h2>Trends</h2>
        <div className="mood-chart__toggles">
          {periodOptions.map((d) => (
            <button
              key={d}
              className={`mood-chart__toggle ${activePeriod === d ? 'mood-chart__toggle--active' : ''}`}
              onClick={() => handlePeriodChange(d)}
              aria-pressed={activePeriod === d}
              aria-label={`Show ${d} days`}
            >
              {d}d
            </button>
          ))}
        </div>
      </div>

      {/* Metric selector: mood / energy / stress */}
      <div className="mood-chart__metrics" role="group" aria-label="Select metric">
        {(Object.keys(metricConfig) as Metric[]).map((m) => (
          <button
            key={m}
            className={`mood-chart__metric-btn ${activeMetric === m ? 'mood-chart__metric-btn--active' : ''}`}
            onClick={() => handleMetricChange(m)}
            aria-pressed={activeMetric === m}
            style={activeMetric === m ? { borderColor: metricConfig[m].color, color: metricConfig[m].color } : undefined}
          >
            <span>{metricConfig[m].icon}</span>
            {metricConfig[m].label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="mood-chart__placeholder">Loading chart...</div>
      ) : data.length === 0 ? (
        <div className="mood-chart__placeholder">
          No data yet. Complete a few check-ins to see your {label.toLowerCase()} trends here.
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11, fill: 'var(--color-text-secondary)' }}
              tickFormatter={(d: string) => {
                const date = new Date(d);
                return `${date.getDate()}/${date.getMonth() + 1}`;
              }}
            />
            <YAxis
              domain={[1, 5]}
              ticks={[1, 2, 3, 4, 5]}
              tick={{ fontSize: 11, fill: 'var(--color-text-secondary)' }}
            />
            <Tooltip
              formatter={(value) => [`${value}/5`, label]}
              labelFormatter={(lbl) => {
                const d = typeof lbl === 'string' ? lbl : String(lbl);
                return new Date(d).toLocaleDateString('en-GB');
              }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={2}
              dot={{ r: 4, fill: color }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default MoodChart;
