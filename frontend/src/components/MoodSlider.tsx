import { useState } from 'react';

interface MoodSliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  lowEmoji: string;
  highEmoji: string;
  lowLabel: string;
  highLabel: string;
}

/** Reusable 1-5 scale slider with emoji anchors  */
const MoodSlider: React.FC<MoodSliderProps> = ({
  label,
  value,
  onChange,
  lowEmoji,
  highEmoji,
  lowLabel,
  highLabel,
}) => {
  const [hoveredValue, setHoveredValue] = useState<number | null>(null);
  const displayValue = hoveredValue ?? value;

  return (
    <div className="mood-slider">
      <div className="mood-slider__header">
        <span className="mood-slider__label">{label}</span>
        <span className="mood-slider__value">{displayValue}/5</span>
      </div>

      <div className="mood-slider__track">
        <span className="mood-slider__anchor">{lowEmoji}</span>
        <input
          type="range"
          min={1}
          max={5}
          step={1}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          onMouseOver={() => {}}
          onPointerMove={(e) => {
            const target = e.currentTarget;
            const rect = target.getBoundingClientRect();
            const pct = (e.clientX - rect.left) / rect.width;
            const v = Math.round(pct * 4 + 1);
            setHoveredValue(Math.max(1, Math.min(5, v)));
          }}
          onPointerLeave={() => setHoveredValue(null)}
          className="mood-slider__input"
          aria-label={label}
        />
        <span className="mood-slider__anchor">{highEmoji}</span>
      </div>

      <div className="mood-slider__labels">
        <span>{lowLabel}</span>
        <span>{highLabel}</span>
      </div>
    </div>
  );
};

export default MoodSlider;
