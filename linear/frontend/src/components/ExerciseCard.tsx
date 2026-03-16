import type { Recommendation } from '../types';

interface ExerciseCardProps {
  recommendation: Recommendation;
}

/** this Displays a recommended exercise with duration, intensity badge, and description good for personal stuff */
const ExerciseCard: React.FC<ExerciseCardProps> = ({ recommendation }) => {
  const intensityColor: Record<string, string> = {
    low: '#22c55e',
    moderate: '#f59e0b',
    high: '#ef4444',
  };

  const categoryLabel: Record<string, string> = {
    stretching: 'Stretching',
    light_cardio: 'Light Cardio',
    moderate: 'Moderate Workout',
    strength: 'Strength Training',
    yoga_mindfulness: 'Yoga & Mindfulness',
    rest: 'Rest Day',
  };

  return (
    <div className="exercise-card card">
      {/* Image placeholder */}
      <div className="exercise-card__image">
        <span style={{ fontSize: '2.5rem' }}>
          {recommendation.exerciseCategory === 'rest' ? '😴' : '🏋️'}
        </span>
      </div>

      <div className="exercise-card__body">
        <h3>{recommendation.exerciseName}</h3>
        <p className="exercise-card__category">
          {categoryLabel[recommendation.exerciseCategory] ?? recommendation.exerciseCategory}
        </p>

        {recommendation.exerciseDescription && (
          <p className="exercise-card__desc">{recommendation.exerciseDescription}</p>
        )}

        <div className="exercise-card__badges">
          <span className="badge badge--duration">
            ⏱ {recommendation.durationMins} min
          </span>
          <span
            className="badge badge--intensity"
            style={{ background: intensityColor[recommendation.intensity] ?? '#6b7280' }}
          >
            {recommendation.intensity.charAt(0).toUpperCase() + recommendation.intensity.slice(1)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ExerciseCard;
