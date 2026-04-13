import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context';
import { authService } from '../services/authService';

type FitnessLevel = 'beginner' | 'intermediate' | 'advanced';
type WorkPattern = 'remote' | 'hybrid' | 'office';
const goalOptions = ['Reduce stress', 'Get fitter', 'Eat better', 'Manage burnout', 'Improve sleep', 'Work-life balance'];

/** User profile view and edit page (US-09, FR-12) */
const Profile: React.FC = () => {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name ?? '');
  const [age, setAge] = useState(user?.age?.toString() ?? '');
  const [fitnessLevel, setFitnessLevel] = useState<FitnessLevel>(user?.fitnessLevel ?? 'beginner');
  const [workPattern, setWorkPattern] = useState<WorkPattern>(user?.workPattern ?? 'hybrid');
  const [goals, setGoals] = useState<string[]>(user?.goals ?? []);

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  const toggleGoal = (g: string) =>
    setGoals((prev) => (prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g]));

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    setError('');
    try {
      const { data } = await authService.updateProfile({
        name: name.trim() || undefined,
        age: age ? parseInt(age, 10) : undefined,
        fitnessLevel,
        workPattern,
        goals,
      });
      updateUser(data.data);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch {
      setError('Failed to save profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="gap-16" style={{ paddingTop: '20px' }}>
      {/* Header */}
      <div className="text-center">
        <div style={{ fontSize: '3rem', marginBottom: '8px' }}>👤</div>
        <h1>{user?.name ?? 'Your Profile'}</h1>
        <p className="mt-8">{user?.email}</p>
      </div>

      {/* Personal info */}
      <div className="card gap-12">
        <h2>Personal Info</h2>
        <div className="input-group">
          <label htmlFor="profile-name">Name</label>
          <input
            id="profile-name"
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="input-group">
          <label htmlFor="profile-age">Age</label>
          <input
            id="profile-age"
            type="number"
            placeholder="Your age"
            min={13}
            max={120}
            value={age}
            onChange={(e) => setAge(e.target.value)}
          />
        </div>
      </div>

      {/* Fitness level */}
      <div className="card gap-12">
        <h2>Fitness Level</h2>
        <p className="mt-8" style={{ marginBottom: '8px' }}>This helps us personalise exercise intensity</p>
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
      </div>

      {/* Work pattern */}
      <div className="card gap-12">
        <h2>Work Pattern</h2>
        <p className="mt-8" style={{ marginBottom: '8px' }}>Tell us about your work environment</p>
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
      </div>

      {/* Goals */}
      <div className="card gap-12">
        <h2>Your Goals</h2>
        <p className="mt-8" style={{ marginBottom: '8px' }}>What do you want to achieve?</p>
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
      </div>

      {/* Feedback messages */}
      {error && <p className="error-text">{error}</p>}
      {saved && (
        <p style={{ color: 'var(--color-success)', textAlign: 'center', fontWeight: 600 }}>
          ✓ Profile saved successfully
        </p>
      )}

      {/* Save button */}
      <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
        {saving ? 'Saving...' : 'Save Changes'}
      </button>

      {/* Account section */}
      <div className="card gap-12">
        <h2>Account</h2>
        <p style={{ fontSize: '0.85rem' }}>
          Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' }) : '—'}
        </p>
        <button className="btn btn-secondary" onClick={handleLogout}>
          Log Out
        </button>
      </div>

      {/* Ethics / about */}
      <p className="text-center" style={{ fontSize: '0.8rem', paddingBottom: '8px' }}>
        Linear is not a medical service. All recommendations are for general wellness only.
      </p>
    </div>
  );
};

export default Profile;
