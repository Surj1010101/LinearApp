import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context';

const Home: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  /* Redirect authenticated users straight to their dashboard */
  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, loading, navigate]);

  if (loading) return null;

  return (
    <div className="gap-16" style={{ paddingTop: '40px' }}>
      <div className="text-center">
        <div style={{ fontSize: '3rem' }}>🧠</div>
        <h1 style={{ marginTop: '12px' }}>Linear</h1>
        <p style={{ marginTop: '8px' }}>AI-powered wellbeing support for hybrid workers.</p>
      </div>

      <div className="card gap-12">
        <h2>What Linear does</h2>
        <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px', color: 'var(--color-text-secondary)' }}>
          <li>Daily check-ins to track your mood &amp; wellbeing</li>
          <li>AI-personalised recommendations adapting to your work patterns</li>
          <li>Stress management &amp; mental wellbeing tools</li>
          <li>Diet &amp; nutrition guidance for mood regulation</li>
          <li>Dashboard with trends &amp; insights over time</li>
        </ul>
      </div>

      <div className="gap-12">
        <Link to="/register" className="btn btn-primary text-center">Get Started</Link>
        <Link to="/login" className="btn btn-secondary text-center">I already have an account</Link>
      </div>

      <p className="text-center" style={{ fontSize: '0.78rem', color: 'var(--color-text-secondary)' }}>
        Inspired by the PROSPERH initiative · Not a medical service
      </p>
    </div>
  );
};

export default Home;
