import { Link } from 'react-router-dom';

interface Tool {
  name: string;
  icon: string;
  color: string;
  path: string;
  wide?: boolean;
  comingSoon?: boolean;
}

/**
 * Quick-launch grid for the main app features.
 * MVP tools link to real routes; post-MVP features show a "Coming soon" badge.
 */
const tools: Tool[] = [
  { name: 'Daily Check-in',      icon: '😊', color: '#5B9BD5', path: '/checkin',         wide: true },
  { name: 'AI Recommendations',  icon: '🎯', color: '#7B68EE', path: '/recommendations',  wide: true },
  { name: 'Wellbeing Insights',  icon: '✨', color: '#26A69A', path: '/insights' },
  { name: 'My History',          icon: '📋', color: '#64B5F6', path: '/history' },
  { name: 'My Profile',          icon: '👤', color: '#FF9800', path: '/profile' },
  { name: 'Screen Time',         icon: '📱', color: '#8BC34A', path: '#',               comingSoon: true },
];

const Tools: React.FC = () => (
  <div className="tools-page">
    <h1 className="tools-title">Tools</h1>
    <div className="tools-grid">
      {tools.map((tool) => {
        const content = (
          <>
            <span className="tool-card__icon">{tool.icon}</span>
            <span className="tool-card__name">{tool.name}</span>
            {tool.comingSoon && (
              <span
                style={{
                  position: 'absolute',
                  top: '8px',
                  right: '8px',
                  background: 'rgba(0,0,0,0.35)',
                  color: '#fff',
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  padding: '2px 7px',
                  borderRadius: '10px',
                  letterSpacing: '0.03em',
                }}
              >
                Soon
              </span>
            )}
          </>
        );

        if (tool.comingSoon) {
          return (
            <div
              key={tool.name}
              className={`tool-card ${tool.wide ? 'tool-card--wide' : ''}`}
              style={{ background: tool.color, opacity: 0.65, position: 'relative', cursor: 'default' }}
            >
              {content}
            </div>
          );
        }

        return (
          <Link
            key={tool.name}
            to={tool.path}
            className={`tool-card ${tool.wide ? 'tool-card--wide' : ''}`}
            style={{ background: tool.color, position: 'relative' }}
          >
            {content}
          </Link>
        );
      })}
    </div>
  </div>
);

export default Tools;
