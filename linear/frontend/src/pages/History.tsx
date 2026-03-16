import { useEffect, useState } from 'react';
import { checkinService } from '../services/checkinService';
import type { CheckIn } from '../types';

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

/** History page US-08 (date which the user can filter check-ins with sentiment tags) */
const History: React.FC = () => {
  const [checkins, setCheckins] = useState<CheckIn[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    checkinService
      .getAll()
      .then(({ data }) => setCheckins(data.data))
      .catch(() => { /* BE not ready yet */ })
      .finally(() => setLoading(false));
  }, []);

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="gap-16" style={{ paddingTop: '20px' }}>
      <h1>History</h1>

      {loading ? (
        <div className="card">
          <p>Loading your check-ins...</p>
        </div>
      ) : checkins.length === 0 ? (
        <div className="card">
          <h2>Check-in Log</h2>
          <p className="mt-8">No check-ins yet. Complete your first daily check-in to see your history here.</p>
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
