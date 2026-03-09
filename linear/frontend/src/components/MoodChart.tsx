import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { TrendPoint } from '../types';

interface MoodChartProps {
  data: TrendPoint[];
  loading?: boolean;
}

const periodOptions = [7, 14, 30] as const;

/**Line chart for mood trends over time */
const MoodChart: React.FC<MoodChartProps & { onPeriodChange?: (days: number) => void }> = ({
  data,
  loading,
  onPeriodChange,
}) => {
  const [activePeriod, setActivePeriod] = useState<number>(7);

  const handlePeriodChange = (days: number) => {
    setActivePeriod(days);
    onPeriodChange?.(days);
  };

  return (
    <div className="card mood-chart">
      <div className="mood-chart__header">
        <h2>Mood Trends</h2>
        <div className="mood-chart__toggles">
          {periodOptions.map((d) => (
            <button
              key={d}
              className={`mood-chart__toggle ${activePeriod === d ? 'mood-chart__toggle--active' : ''}`}
              onClick={() => handlePeriodChange(d)}
            >
              {d}d
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="mood-chart__placeholder">Loading chart...</div>
      ) : data.length === 0 ? (
        <div className="mood-chart__placeholder">
          No data yet. Complete a few check-ins to see your mood trends here.
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
            <YAxis domain={[1, 5]} ticks={[1, 2, 3, 4, 5]} tick={{ fontSize: 11, fill: 'var(--color-text-secondary)' }} />
            <Tooltip
              formatter={(value) => [`${value}/5`, 'Mood']}
              labelFormatter={(label) => {
                const d = typeof label === 'string' ? label : String(label);
                return new Date(d).toLocaleDateString('en-GB');
              }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="var(--color-primary)"
              strokeWidth={2}
              dot={{ r: 4, fill: 'var(--color-primary)' }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default MoodChart;
