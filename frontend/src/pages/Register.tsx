import { useState } from 'react';
import { useAuth } from '../context';
import { useNavigate, Link } from 'react-router-dom';

type FitnessLevel = 'beginner' | 'intermediate' | 'advanced';
type WorkPattern = 'remote' | 'hybrid' | 'office';
const goalOptions = ['Reduce stress', 'Get fitter', 'Eat better', 'Manage burnout', 'Improve sleep', 'Work-life balance'];

/** Multistep registration: account → fitness level → work pattern → goals (FR-01, US-01) */
const Register: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  /* Step tracking: 0=account, 1=fitness, 2=work pattern, 3=goals */
  const [step, setStep] = useState(0);

  /* Step 0 — account fields */
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  /* Step 1 — fitness level */
  const [fitnessLevel, setFitnessLevel] = useState<FitnessLevel>('beginner');

  /* Step 2 — work pattern */
  const [workPattern, setWorkPattern] = useState<WorkPattern>('hybrid');

  /* Step 3 — goals */
  const [goals, setGoals] = useState<string[]>([]);

  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const toggleGoal = (g: string) =>
    setGoals((prev) => (prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g]));

  const handleAccountNext = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setStep(1);
  };

  const handleFinalSubmit = async () => {
    setSubmitting(true);
    setError('');
    try {
      await register(name, email, password);
      /* TODO: this for krithen after backend has profile endpoint, PATCH profile with fitnessLevel, workPattern, goals */
      navigate('/checkin');
    } catch {
      setError('Registration failed. Email may already be in use.');
      setStep(0);
    } finally {
      setSubmitting(false);
    }
  };

  const stepIndicator = (
    <div className="wizard-steps">
      {['Account', 'Fitness', 'Work', 'Goals'].map((label, i) => (
        <div key={label} className={`wizard-step ${i <= step ? 'wizard-step--active' : ''}`}>
          <div className="wizard-step__dot">{i < step ? '✓' : i + 1}</div>
          <span className="wizard-step__label">{label}</span>
        </div>
      ))}
    </div>
  );

  return (
    <div className="gap-16" style={{ paddingTop: '24px' }}>
      <div className="text-center">
        <h1>{step === 0 ? 'Create Account' : step === 1 ? 'Fitness Level' : step === 2 ? 'Work Pattern' : 'Your Goals'}</h1>
        <p className="mt-8">
          {step === 0 && 'Start your wellness journey'}
          {step === 1 && 'This helps us personalise exercise intensity'}
          {step === 2 && 'Tell us about your work environment'}
          {step === 3 && 'What do you want to achieve?'}
        </p>
      </div>

      {stepIndicator}

      {error && <p className="error-text">{error}</p>}

      {/* Step 0 — Account details */}
      {step === 0 && (
        <form onSubmit={handleAccountNext} className="gap-12">
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
            <input id="password" type="password" placeholder="Min 6 characters" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <div className="input-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input id="confirmPassword" type="password" placeholder="Re-enter password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
          </div>
          <button type="submit" className="btn btn-primary mt-8">Next →</button>
        </form>
      )}

      {/* Step 1 — Fitness level */}
      {step === 1 && (
        <div className="gap-12">
          {(['beginner', 'intermediate', 'advanced'] as FitnessLevel[]).map((lvl) => (
            <button
              key={lvl}
              className={`btn ${fitnessLevel === lvl ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setFitnessLevel(lvl)}
            >
              {lvl === 'beginner' && '🌱 Beginner — Just starting out'}
              {lvl === 'intermediate' && '💪 Intermediate — Somewhat active'}
              {lvl === 'advanced' && '🏆 Advanced — Regularly active'}
            </button>
          ))}
          <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
            <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setStep(0)}>← Back</button>
            <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => setStep(2)}>Next →</button>
          </div>
        </div>
      )}

      {/* Step 2 — Work pattern */}
      {step === 2 && (
        <div className="gap-12">
          {(['remote', 'hybrid', 'office'] as WorkPattern[]).map((wp) => (
            <button
              key={wp}
              className={`btn ${workPattern === wp ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setWorkPattern(wp)}
            >
              {wp === 'remote' && '🏠 Fully Remote'}
              {wp === 'hybrid' && '🔄 Hybrid (Home + Office)'}
              {wp === 'office' && '🏢 Fully in Office'}
            </button>
          ))}
          <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
            <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setStep(1)}>← Back</button>
            <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => setStep(3)}>Next →</button>
          </div>
        </div>
      )}

      {/* Step 3 — Goals */}
      {step === 3 && (
        <div className="gap-12">
          <div className="goals-grid">
            {goalOptions.map((g) => (
              <button
                key={g}
                className={`btn ${goals.includes(g) ? 'btn-primary' : 'btn-secondary'}`}
                style={{ fontSize: '0.9rem', padding: '10px' }}
                onClick={() => toggleGoal(g)}
              >
                {goals.includes(g) ? '✓ ' : ''}{g}
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
            <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setStep(2)}>← Back</button>
            <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleFinalSubmit} disabled={submitting}>
              {submitting ? 'Creating...' : 'Finish Setup ✓'}
            </button>
          </div>
        </div>
      )}

      {step === 0 && (
        <p className="text-center" style={{ fontSize: '0.9rem' }}>
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      )}
    </div>
  );
};

export default Register;
