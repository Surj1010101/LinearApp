import { useState } from 'react';
import { useAuth } from '../context';
import { useNavigate, Link } from 'react-router-dom';

const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch {
      setError('Invalid email or password');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="gap-16" style={{ paddingTop: '32px' }}>
      <div className="text-center">
        <h1>Welcome Back</h1>
        <p className="mt-8">Sign in to continue</p>
      </div>

      {error && <p className="error-text">{error}</p>}

      <form onSubmit={handleSubmit} className="gap-12">
        <div className="input-group">
          <label htmlFor="email">Email</label>
          <input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button type="submit" className="btn btn-primary mt-8" disabled={submitting}>
          {submitting ? 'Signing in...' : 'Sign In'}
        </button>
      </form>

      <p className="text-center" style={{ fontSize: '0.9rem' }}>
        Don't have an account? <Link to="/register">Register</Link>
      </p>
    </div>
  );
};

export default Login;
