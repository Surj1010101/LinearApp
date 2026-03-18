import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context';
import MoodChart from '../components/MoodChart';
import WeeklySummary from '../components/WeeklySummary';
import DisclaimerBanner from '../components/DisclaimerBanner';
import { dashboardService } from '../services/dashboardService';
import { checkinService } from '../services/checkinService';
import type { DashboardSummary, TrendPoint } from '../types';

/** Dashboard page — US-07 (summary cards, mood chart, greeting) */
const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [trendData, setTrendData] = useState<TrendPoint[]>([]);
  const [loadingSummary, setLoadingSummary] = useState(true);
  const [loadingTrend, setLoadingTrend] = useState(true);
  const [checkedInToday, setCheckedInToday] = useState(false);

  /* Greeting based on time of day */
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  const todayStr = new Date().toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  /* Check if the user has already checked in today */
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    checkinService
      .getAll(today, today)
      .then(({ data }) => setCheckedInToday(data.data.length > 0))
      .catch(() => { /* non-critical */ });
  }, []);

  /* Fetch summary on mount */
  useEffect(() => {
    dashboardService
      .getSummary()
      .then(({ data }) => setSummary(data.data))
      .catch(() => { /* BE not ready yet */ })
      .finally(() => setLoadingSummary(false));
  }, []);

  /* Fetch trend data */
  const fetchTrend = (days: number = 7) => {
    setLoadingTrend(true);
    dashboardService
      .getTrends('mood', days)
      .then(({ data }) => setTrendData(data.data))
      .catch(() => { /* BE not ready yet */ })
      .finally(() => setLoadingTrend(false));
  };

  useEffect(() => {
    fetchTrend(7);
  }, []);

  return (
    <div className="gap-16">
      {/* Greeting with date */}
      <div>
        <p style={{ color: 'var(--color-text-secondary)' }}>{greeting},</p>
        <h1>{user?.name ?? 'User'} 👋</h1>
        <p style={{ fontSize: '0.85rem', marginTop: '4px' }}>{todayStr}</p>
      </div>

      {/* Today's check-in */}
      <Link to="/checkin" className="card gap-12" style={{ textDecoration: 'none', color: 'inherit' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2>Daily Check-in</h2>
            <p className="mt-8">
              {checkedInToday ? 'Done for today — great job!' : 'How are you feeling today?'}
            </p>
          </div>
          <span style={{ fontSize: '2rem' }}>{checkedInToday ? '✅' : '📝'}</span>
        </div>
        {checkedInToday ? (
          <span
            className="text-center"
            style={{
              marginTop: '8px',
              padding: '10px',
              borderRadius: 'var(--radius)',
              background: '#f0fdf4',
              color: 'var(--color-success)',
              fontWeight: 600,
              fontSize: '0.9rem',
            }}
          >
            ✓ Checked in today
          </span>
        ) : (
          <span className="btn btn-primary text-center" style={{ marginTop: '8px' }}>Start Check-in</span>
        )}
      </Link>

      {/* Weekly summary stats */}
      <WeeklySummary summary={summary} loading={loadingSummary} />

      {/* Mood trend chart with 7/14/30 day toggle */}
      <MoodChart data={trendData} loading={loadingTrend} onPeriodChange={fetchTrend} />

      {/* AI Recommendations teaser */}
      <Link to="/recommendations" className="card gap-12" style={{ textDecoration: 'none', color: 'inherit' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2>AI Recommendations</h2>
            <p className="mt-8">View your personalised exercise and nutrition plan.</p>
          </div>
          <span style={{ fontSize: '2rem' }}>🤖</span>
        </div>
      </Link>

      <DisclaimerBanner compact />
    </div>
  );
};

export default Dashboard;
