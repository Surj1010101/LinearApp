import { NavLink } from 'react-router-dom';

const Navbar: React.FC = () => {
  return (
    <nav className="bottom-nav">
      <NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : '')}>
        <span className="nav-icon">🏠</span>
        Home
      </NavLink>

      <NavLink to="/inbox" className={({ isActive }) => (isActive ? 'active' : '')}>
        <span className="nav-icon">📬</span>
        Inbox
      </NavLink>

      <NavLink to="/tools" className="fab-link">
        <span className="fab">＋</span>
      </NavLink>

      <NavLink to="/history" className={({ isActive }) => (isActive ? 'active' : '')}>
        <span className="nav-icon">📋</span>
        History
      </NavLink>

      <NavLink to="/insights" className={({ isActive }) => (isActive ? 'active' : '')}>
        <span className="nav-icon">📊</span>
        Insights
      </NavLink>
    </nav>
  );
};

export default Navbar;
