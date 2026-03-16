/** Shows AI confidence percentage on recommendations (US-12) */
const ConfidenceBadge: React.FC<{ confidence: number }> = ({ confidence }) => {
  const pct = Math.round(confidence * 100);

  let color = '#22c55e';
  if (pct < 50) color = '#ef4444';
  else if (pct < 70) color = '#f59e0b';

  return (
    <div className="confidence-badge" style={{ borderColor: color }}>
      <span className="confidence-badge__icon">🤖</span>
      <span className="confidence-badge__text">
        We are <strong style={{ color }}>{pct}%</strong> confident this suits you
      </span>
    </div>
  );
};

export default ConfidenceBadge;
