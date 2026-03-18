import { useEffect, useState } from 'react';
import { insightService } from '../services/insightService';
import type { Insight } from '../types';

/** Formats an ISO date string into a friendly "15 Jan 2026 at 14:32" */
const formatDate = (iso: string) =>
  new Date(iso).toLocaleString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

/** AI-generated wellbeing insights page */
const Insights: React.FC = () => {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');

  const loadInsights = () => {
    setLoading(true);
    setError('');
    insightService
      .getAll()
      .then(({ data }) => setInsights(data.data))
      .catch(() => setError('Could not load insights. Please try again later.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadInsights();
  }, []);

  const handleGenerate = async () => {
    setGenerating(true);
    setError('');
    try {
      const { data } = await insightService.generate();
      setInsights((prev) => [data.data, ...prev]);
    } catch {
      setError('Could not generate insight. Complete a few check-ins first, then try again.');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="gap-16" style={{ paddingTop: '20px' }}>
      {/* Header */}
      <div>
        <h1>Wellbeing Insights</h1>
        <p className="mt-8">AI analysis of your mood, energy, and stress patterns</p>
      </div>

      {/* Generate button */}
      <button
        className="btn btn-primary"
        onClick={handleGenerate}
        disabled={generating}
      >
        {generating ? 'Analysing your data...' : '✨ Generate New Insight'}
      </button>

      {error && <p className="error-text">{error}</p>}

      {/* Loading state */}
      {loading && (
        <div className="card">
          <p>Loading your insights...</p>
        </div>
      )}

      {/* Empty state */}
      {!loading && insights.length === 0 && !error && (
        <div className="card gap-12">
          <h2>No insights yet</h2>
          <p>Complete a few daily check-ins and then tap "Generate New Insight" to receive personalised wellbeing analysis.</p>
        </div>
      )}

      {/* Insights list */}
      {!loading && insights.length > 0 && (
        <div className="gap-12">
          {insights.map((insight) => (
            <div key={insight.id} className="card gap-12">
              {/* Date */}
              <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>
                {formatDate(insight.generatedAt)}
              </p>

              {/* Summary */}
              <p style={{ color: 'var(--color-text)', lineHeight: 1.6, fontStyle: 'italic' }}>
                "{insight.summary}"
              </p>

              {/* Suggestions */}
              {insight.suggestions && insight.suggestions.length > 0 && (
                <div className="gap-12" style={{ marginTop: '4px' }}>
                  <h3>Suggestions</h3>
                  <ul style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingLeft: '0', listStyle: 'none' }}>
                    {insight.suggestions.map((s, i) => (
                      <li
                        key={i}
                        style={{
                          display: 'flex',
                          gap: '10px',
                          alignItems: 'flex-start',
                          fontSize: '0.9rem',
                          color: 'var(--color-text-secondary)',
                        }}
                      >
                        <span style={{ color: 'var(--color-primary)', fontWeight: 700, flexShrink: 0 }}>
                          {i + 1}.
                        </span>
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Ethics note */}
      <p
        style={{
          fontSize: '0.78rem',
          textAlign: 'center',
          color: 'var(--color-text-secondary)',
          paddingBottom: '8px',
        }}
      >
        Insights are generated from your check-in data and are for general guidance only — not clinical advice.
      </p>
    </div>
  );
};

export default Insights;
