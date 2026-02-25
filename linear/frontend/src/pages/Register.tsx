import { useState } from 'react';
import { useAuth } from '../context';
import { useNavigate, Link } from 'react-router-dom';

const Register: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await register(name, email, password);
      navigate('/dashboard');
    } catch {
      setError('Registration failed. Please try again.');
    }
  };

  return (
    <div className="gap-16" style={{ paddingTop: '32px' }}>
      <div className="text-center">
        <h1>Create Account</h1>
        <p className="mt-8">Start your wellness journey</p>
      </div>

      {error && <p className="error-text">{error}</p>}

      <form onSubmit={handleSubmit} className="gap-12">
        <div className="input-group">
          <label htmlFor="name">Name</label>
          <input id="name" type="text" placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div className="input-group">
          <label htmlFor="email">Email</label>
          <input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button type="submit" className="btn btn-primary mt-8">Create Account</button>
      </form>

      <p className="text-center" style={{ fontSize: '0.9rem' }}>
        Already have an account? <Link to="/login">Sign in</Link>
      </p>
    </div>
  );
};

export default Register;
