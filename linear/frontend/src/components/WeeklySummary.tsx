import type { DashboardSummary } from '../types';

interface WeeklySummaryProps {
  summary: DashboardSummary | null;
  loading?: boolean;
}

const moodEmoji = (avg: number) => {
  if (avg >= 4.5) return '😄';
  if (avg >= 3.5) return '🙂';
  if (avg >= 2.5) return '😐';
  if (avg >= 1.5) return '😕';
  return '😢';
};

/** Weekly summary card showing aggregate stats (US-07, FR-08) */
const WeeklySummary: React.FC<WeeklySummaryProps> = ({ summary, loading }) => {
  if (loading) {
    return (
      <div className="card weekly-summary">
        <h2>Weekly Summary</h2>
        <p className="mt-8">Loading...</p>
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="card weekly-summary">
        <h2>Weekly Summary</h2>
        <p className="mt-8">No data yet. Complete check-ins to see your weekly summary.</p>
      </div>
    );
  }

  return (
    <div className="card weekly-summary">
      <h2>Weekly Summary</h2>
      <div className="weekly-summary__grid">
        <div className="weekly-summary__stat">
          <span className="weekly-summary__stat-icon">{moodEmoji(summary.moodAvg)}</span>
          <span className="weekly-summary__stat-value">{summary.moodAvg.toFixed(1)}</span>
          <span className="weekly-summary__stat-label">Avg Mood</span>
        </div>
        <div className="weekly-summary__stat">
          <span className="weekly-summary__stat-icon">⚡</span>
          <span className="weekly-summary__stat-value">{summary.energyAvg.toFixed(1)}</span>
          <span className="weekly-summary__stat-label">Avg Energy</span>
        </div>
        <div className="weekly-summary__stat">
          <span className="weekly-summary__stat-icon">🏋️</span>
          <span className="weekly-summary__stat-value">{summary.exerciseCount}</span>
          <span className="weekly-summary__stat-label">Exercises</span>
        </div>
        <div className="weekly-summary__stat">
          <span className="weekly-summary__stat-icon">🔥</span>
          <span className="weekly-summary__stat-value">{summary.streak}</span>
          <span className="weekly-summary__stat-label">Day Streak</span>
        </div>
      </div>
    </div>
  );
};

export default WeeklySummary;
