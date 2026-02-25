import { Link } from 'react-router-dom';

interface Tool {
  name: string;
  icon: string;
  color: string;
  path: string;
  wide?: boolean;
}

/** this will app will have daily check-ins,ai recommendations,
 *stress management, diet & nutrition, work pattern adaption */
const tools: Tool[] = [
  { name: 'Daily Check-in',         icon: '😊', color: '#5B9BD5', path: '/tools/checkin',       wide: true },
  { name: 'AI Recommendations',     icon: '🤖', color: '#7B68EE', path: '/tools/ai',            wide: true },
  { name: 'Stress Management',      icon: '🧘', color: '#26A69A', path: '/tools/stress' },
  { name: 'Diet & Nutrition',       icon: '🥗', color: '#8BC34A', path: '/tools/diet' },
  { name: 'Work Patterns',          icon: '💻', color: '#FF9800', path: '/tools/work-patterns' },
  { name: 'Screen Time',            icon: '📱', color: '#64B5F6', path: '/tools/screen-time' },
];

const Tools: React.FC = () => (
  <div className="tools-page">
    <h1 className="tools-title">Tools</h1>
    <div className="tools-grid">
      {tools.map((tool) => (
        <Link
          key={tool.name}
          to={tool.path}
          className={`tool-card ${tool.wide ? 'tool-card--wide' : ''}`}
          style={{ background: tool.color }}
        >
          <span className="tool-card__icon">{tool.icon}</span>
          <span className="tool-card__name">{tool.name}</span>
        </Link>
      ))}
    </div>
  </div>
);

export default Tools;
