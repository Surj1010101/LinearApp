import { useEffect, useState } from 'react';
import ExerciseCard from '../components/ExerciseCard';
import NutritionTip from '../components/NutritionTip';
import ConfidenceBadge from '../components/ConfidenceBadge';
import DisclaimerBanner from '../components/DisclaimerBanner';
import { recommendationService } from '../services/recommendationService';
import type { Recommendation } from '../types';

/** Today's recommendation page US-05, US-06, US-11, US-12 */
const Recommendations: React.FC = () => {
  const [rec, setRec] = useState<Recommendation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchRecommendation = async (alternative = false) => {
    setLoading(true);
    setError('');
    try {
      const { data } = alternative
        ? await recommendationService.getAlternative()
        : await recommendationService.getToday();
      setRec(data.data);
    } catch {
      setError('Could not load your recommendation. Complete a check-in first or try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendation();
  }, []);

  return (
    <div className="gap-16" style={{ paddingTop: '20px' }}>
      <div className="text-center">
        <h1>Your Plan for Today</h1>
        <p className="mt-8">Personalised just for you</p>
      </div>

      <DisclaimerBanner />

      {loading && (
        <div className="card text-center">
          <p>Generating your personalised plan...</p>
        </div>
      )}

      {error && (
        <div className="card text-center">
          <p style={{ color: 'var(--color-text-secondary)' }}>{error}</p>
        </div>
      )}

      {rec && !loading && (
        <>
          {/* Confidence badge */}
          <ConfidenceBadge confidence={rec.confidence} />

          {/* Exercise recommendation card */}
          <ExerciseCard recommendation={rec} />

          {/* Nutrition tip */}
          <NutritionTip tip={rec.nutritionTip} />

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: '12px' }}>
            <button className="btn btn-primary" style={{ flex: 1 }}>
              Let's do it 💪
            </button>
            <button
              className="btn btn-secondary"
              style={{ flex: 1 }}
              onClick={() => fetchRecommendation(true)}
            >
              Show me something else
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Recommendations;
