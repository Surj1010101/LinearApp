import { useEffect, useState } from 'react';
import { checkinService } from '../services/checkinService';
import type { CheckIn } from '../types';

type Period = 'all' | 'week' | 'month';

const moodEmoji = (mood: number) => ['😢', '😕', '😐', '🙂', '😄'][mood - 1] ?? '😐';

const sentimentBadge = (s?: string) => {
  if (!s) return null;
  const colors: Record<string, string> = {
    positive: '#22c55e',
    neutral: '#6b7280',
    negative: '#ef4444',
  };
  return (
    <span className="badge" style={{ background: colors[s] ?? '#6b7280', color: '#fff', fontSize: '0.75rem' }}>
      {s}
    </span>
  );
};

/** Returns ISO date strings for the start of the given period */
const periodRange = (period: Period): { from?: string; to?: string } => {
  if (period === 'all') return {};
  const now = new Date();
  const to = now.toISOString().split('T')[0];
  if (period === 'week') {
    const from = new Date(now.setDate(now.getDate() - 7)).toISOString().split('T')[0];
    return { from, to };
  }
  // month
  const from = new Date(now.setDate(now.getDate() - 30)).toISOString().split('T')[0];
  return { from, to };
};

/** History page US-08 (date filterable check-ins list with sentiment tags) */
const History: React.FC = () => {
  const [checkins, setCheckins] = useState<CheckIn[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [period, setPeriod] = useState<Period>('all');

  const loadCheckins = (p: Period) => {
    setLoading(true);
    setError('');
    const { from, to } = periodRange(p);
    checkinService
      .getAll(from, to)
      .then(({ data }) => setCheckins(data.data))
      .catch(() => setError('Could not load check-ins. Please try again.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadCheckins('all');
  }, []);

  const handlePeriodChange = (p: Period) => {
    setPeriod(p);
    loadCheckins(p);
  };

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="gap-16" style={{ paddingTop: '20px' }}>
      <h1>History</h1>

      {/* Period filter */}
      <div style={{ display: 'flex', gap: '8px' }}>
        {(['all', 'week', 'month'] as Period[]).map((p) => (
          <button
            key={p}
            onClick={() => handlePeriodChange(p)}
            style={{
              flex: 1,
              padding: '8px 0',
              borderRadius: '8px',
              border: '1.5px solid',
              borderColor: period === p ? 'var(--color-primary)' : 'var(--color-border)',
              background: period === p ? 'var(--color-primary)' : 'transparent',
              color: period === p ? '#fff' : 'var(--color-text-secondary)',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: 'pointer',
            }}
          >
            {p === 'all' ? 'All Time' : p === 'week' ? 'This Week' : 'This Month'}
          </button>
        ))}
      </div>

      {error && <p className="error-text">{error}</p>}

      {loading ? (
        <div className="card">
          <p>Loading your check-ins...</p>
        </div>
      ) : checkins.length === 0 ? (
        <div className="card">
          <h2>Check-in Log</h2>
          <p className="mt-8">No check-ins found for this period. Try a different filter or complete your first daily check-in.</p>
        </div>
      ) : (
        <div className="gap-12">
          {checkins.map((c) => {
            const date = new Date(c.createdAt);
            const dateStr = date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
            const isExpanded = expandedId === c.id;

            return (
              <div
                key={c.id}
                className="card history-row"
                onClick={() => toggleExpand(c.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && toggleExpand(c.id)}
              >
                <div className="history-row__header">
                  <span className="history-row__emoji">{moodEmoji(c.mood)}</span>
                  <div className="history-row__meta">
                    <span className="history-row__date">{dateStr}</span>
                    <div className="history-row__badges">
                      {sentimentBadge(c.sentiment)}
                      <span className="badge" style={{ background: c.setting === 'home' ? '#5B9BD5' : '#FF9800', color: '#fff', fontSize: '0.75rem' }}>
                        {c.setting === 'home' ? '🏠 Home' : '🏢 Office'}
                      </span>
                    </div>
                  </div>
                  <span style={{ marginLeft: 'auto', color: 'var(--color-text-secondary)' }}>
                    {isExpanded ? '▲' : '▼'}
                  </span>
                </div>

                {isExpanded && (
                  <div className="history-row__details mt-8">
                    <div className="history-row__scores">
                      <span>Mood: {c.mood}/5</span>
                      <span>Energy: {c.energy}/5</span>
                      <span>Stress: {c.stress}/5</span>
                      <span>Hours: {c.hoursWorked}h</span>
                    </div>
                    {c.freeText && (
                      <p className="mt-8" style={{ fontStyle: 'italic', color: 'var(--color-text-secondary)' }}>
                        "{c.freeText}"
                      </p>
                    )}
                    {c.keywords && c.keywords.length > 0 && (
                      <div className="mt-8" style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        {c.keywords.map((kw) => (
                          <span key={kw} className="badge" style={{ background: 'var(--color-bg)', color: 'var(--color-text-secondary)', fontSize: '0.7rem' }}>
                            {kw}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default History;
