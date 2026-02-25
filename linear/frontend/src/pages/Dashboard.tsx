import { useAuth } from '../context';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="gap-16">
      <div>
        <p style={{ color: 'var(--color-text-secondary)' }}>Good to see you,</p>
        <h1>{user?.name ?? 'User'} 👋</h1>
      </div>

      {/* Daily check-in */}
      <div className="card gap-12">
        <h2>Daily Check-in</h2>
        <p>How are you feeling today?</p>
        <div style={{ display: 'flex', justifyContent: 'space-around', fontSize: '2rem' }}>
          {['😢', '😕', '😐', '🙂', '😄'].map((emoji, i) => (
            <button
              key={i}
              style={{ background: 'none', border: 'none', fontSize: '2rem', cursor: 'pointer', padding: '8px' }}
              aria-label={`Mood ${i + 1}`}
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>

      {/* Work setting */}
      <div className="card gap-12">
        <h2>Work Setting</h2>
        <p>Where are you working today?</p>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn btn-secondary" style={{ flex: 1 }}>🏠 Home</button>
          <button className="btn btn-secondary" style={{ flex: 1 }}>🏢 Office</button>
        </div>
      </div>

      {/* Mood trend chart placeholder */}
      <div className="card">
        <h2>Mood Trends</h2>
        <p className="mt-8">Your mood graph will appear here once you start logging daily check-ins.</p>
      </div>

      {/* AI Recommendations */}
      <div className="card">
        <h2>AI Recommendations</h2>
        <p className="mt-8">Personalised exercise, stress management, and nutrition tips based on your data will show up here.</p>
      </div>
    </div>
  );
};

export default Dashboard;
