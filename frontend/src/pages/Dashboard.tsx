import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context';
import MoodChart from '../components/MoodChart';
import WeeklySummary from '../components/WeeklySummary';
import DisclaimerBanner from '../components/DisclaimerBanner';
import { dashboardService } from '../services/dashboardService';
import type { DashboardSummary, TrendPoint } from '../types';

/** Dashboard page — US-07 (summary cards, mood chart, greeting) */
const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [trendData, setTrendData] = useState<TrendPoint[]>([]);
  const [loadingSummary, setLoadingSummary] = useState(true);
  const [loadingTrend, setLoadingTrend] = useState(true);

  /* Greeting based on time of day */
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  const todayStr = new Date().toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

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
            <p className="mt-8">How are you feeling today?</p>
          </div>
          <span style={{ fontSize: '2rem' }}>📝</span>
        </div>
        <span className="btn btn-primary text-center" style={{ marginTop: '8px' }}>Start Check-in</span>
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
