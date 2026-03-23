/** disclaimer banner"not medical advice" (US-06, FR-10) */
const DisclaimerBanner: React.FC<{ compact?: boolean }> = ({ compact = false }) => (
  <div className={`disclaimer-banner ${compact ? 'disclaimer-banner--compact' : ''}`}>
    <span className="disclaimer-banner__icon">⚠️</span>
    <p>
      {compact
        ? 'This is not medical advice.'
        : 'This is general guidance, not medical advice. Consult a professional before starting new exercise or making dietary changes.'}
    </p>
  </div>
);

export default DisclaimerBanner;
