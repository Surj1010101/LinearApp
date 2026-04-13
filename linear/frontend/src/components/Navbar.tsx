import { NavLink } from 'react-router-dom';

/**
 * Bottom tab navigation — Dashboard | Plan | FAB(Check-in) | History | Profile
 * The centre FAB is the primary daily action (check-in).
 * "Plan" shows today's AI recommendations.
 */
const Navbar: React.FC = () => {
  return (
    <nav className="bottom-nav" role="navigation" aria-label="Main navigation">
      <NavLink to="/dashboard" className={({ isActive }) => (isActive ? 'active' : '')} aria-label="Dashboard">
        <span className="nav-icon">🏠</span>
        Dashboard
      </NavLink>

      <NavLink to="/recommendations" className={({ isActive }) => (isActive ? 'active' : '')} aria-label="Today's plan">
        <span className="nav-icon">🎯</span>
        Plan
      </NavLink>

      <NavLink to="/checkin" className="fab-link" aria-label="Start daily check-in">
        <span className="fab">＋</span>
      </NavLink>

      <NavLink to="/history" className={({ isActive }) => (isActive ? 'active' : '')} aria-label="Check-in history">
        <span className="nav-icon">📋</span>
        History
      </NavLink>

      <NavLink to="/profile" className={({ isActive }) => (isActive ? 'active' : '')} aria-label="Your profile">
        <span className="nav-icon">👤</span>
        Profile
      </NavLink>
    </nav>
  );
};

export default Navbar;
