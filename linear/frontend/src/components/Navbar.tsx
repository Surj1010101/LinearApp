import { NavLink } from 'react-router-dom';

const Navbar: React.FC = () => {
  return (
    <nav className="bottom-nav">
      <NavLink to="/dashboard" className={({ isActive }) => (isActive ? 'active' : '')}>
        <span className="nav-icon">🏠</span>
        Dashboard
      </NavLink>

      <NavLink to="/checkin" className={({ isActive }) => (isActive ? 'active' : '')}>
        <span className="nav-icon">✅</span>
        Check-in
      </NavLink>

      <NavLink to="/checkin" className="fab-link" tabIndex={-1} aria-hidden="true">
        <span className="fab">＋</span>
      </NavLink>

      <NavLink to="/history" className={({ isActive }) => (isActive ? 'active' : '')}>
        <span className="nav-icon">📋</span>
        History
      </NavLink>

      <NavLink to="/profile" className={({ isActive }) => (isActive ? 'active' : '')}>
        <span className="nav-icon">👤</span>
        Profile
      </NavLink>
    </nav>
  );
};

export default Navbar;
