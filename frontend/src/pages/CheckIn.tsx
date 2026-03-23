import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MoodSlider from '../components/MoodSlider';
import DisclaimerBanner from '../components/DisclaimerBanner';
import { checkinService } from '../services/checkinService';

/** Daily Check-in page US-03 (mood, energy, stress sliders + free text + setting) */
const CheckIn: React.FC = () => {
  const navigate = useNavigate();

  const [mood, setMood] = useState(3);
  const [energy, setEnergy] = useState(3);
  const [stress, setStress] = useState(3);
  const [hoursWorked, setHoursWorked] = useState<number>(8);
  const [setting, setSetting] = useState<'home' | 'office'>('home');
  const [freeText, setFreeText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [sentimentResult, setSentimentResult] = useState<{
    sentiment: string;
    score: number;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    setSentimentResult(null);

    try {
      const { data } = await checkinService.create({
        mood,
        energy,
        stress,
        hoursWorked,
        setting,
        freeText: freeText.trim() || undefined,
      });

      /* Show sentiment before redirecting */
      if (data.data.sentiment) {
        setSentimentResult({
          sentiment: data.data.sentiment,
          score: data.data.sentimentScore ?? 0,
        });

        /* Brief pause so user can see the result */
        setTimeout(() => navigate('/recommendations'), 2000);
      } else {
        navigate('/recommendations');
      }
    } catch {
      setError('Failed to submit check-in. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const sentimentEmoji: Record<string, string> = {
    positive: '😊',
    neutral: '😐',
    negative: '😟',
  };

  return (
    <div className="gap-16" style={{ paddingTop: '20px' }}>
      <div className="text-center">
        <h1>How are you today?</h1>
        <p className="mt-8">Your daily wellbeing check-in</p>
      </div>

      {/* Sentiment result overlay */}
      {sentimentResult && (
        <div className="card text-center gap-12" style={{ background: '#f0f9ff', border: '1.5px solid var(--color-primary)' }}>
          <p style={{ fontSize: '2rem' }}>{sentimentEmoji[sentimentResult.sentiment] ?? '😐'}</p>
          <p>
            <strong>Sentiment:</strong>{' '}
            {sentimentResult.sentiment.charAt(0).toUpperCase() + sentimentResult.sentiment.slice(1)}
          </p>
          <p style={{ fontSize: '0.85rem' }}>Redirecting to your personalised plan...</p>
        </div>
      )}

      {error && <p className="error-text">{error}</p>}

      <form onSubmit={handleSubmit} className="gap-16">
        {/* Mood / Energy / Stress sliders */}
        <MoodSlider
          label="Mood"
          value={mood}
          onChange={setMood}
          lowEmoji="😢"
          highEmoji="😄"
          lowLabel="Sad"
          highLabel="Happy"
        />
        <MoodSlider
          label="Energy"
          value={energy}
          onChange={setEnergy}
          lowEmoji="🪫"
          highEmoji="⚡"
          lowLabel="Low"
          highLabel="High"
        />
        <MoodSlider
          label="Stress"
          value={stress}
          onChange={setStress}
          lowEmoji="😌"
          highEmoji="😰"
          lowLabel="Calm"
          highLabel="Stressed"
        />

        {/* Hours worked */}
        <div className="input-group">
          <label htmlFor="hoursWorked">Hours worked today</label>
          <input
            id="hoursWorked"
            type="number"
            min={0}
            max={24}
            step={0.5}
            value={hoursWorked}
            onChange={(e) => setHoursWorked(Number(e.target.value))}
          />
        </div>

        {/* Home / Office toggle */}
        <div className="input-group">
          <label>Work setting</label>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              type="button"
              className={`btn ${setting === 'home' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ flex: 1 }}
              onClick={() => setSetting('home')}
            >
              🏠 Home
            </button>
            <button
              type="button"
              className={`btn ${setting === 'office' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ flex: 1 }}
              onClick={() => setSetting('office')}
            >
              🏢 Office
            </button>
          </div>
        </div>

        {/* (optional text good for more insig) */}
        <div className="input-group">
          <label htmlFor="freeText">Anything else you'd like to share? (optional)</label>
          <textarea
            id="freeText"
            rows={3}
            placeholder="How are you feeling today..."
            value={freeText}
            onChange={(e) => setFreeText(e.target.value)}
            className="checkin-textarea"
          />
        </div>

        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? 'Submitting...' : 'Submit Check-in'}
        </button>
      </form>

      <DisclaimerBanner compact />
    </div>
  );
};

export default CheckIn;
