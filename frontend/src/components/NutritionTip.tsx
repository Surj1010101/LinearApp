/** Displays a daily nutrition tip alongside the exercise recommendation (US-11, FR-07) */
const NutritionTip: React.FC<{ tip: string }> = ({ tip }) => (
  <div className="nutrition-tip card">
    <div className="nutrition-tip__header">
      <span style={{ fontSize: '1.5rem' }}>🥗</span>
      <h3>Nutrition Tip</h3>
    </div>
    <p>{tip}</p>
  </div>
);

export default NutritionTip;
