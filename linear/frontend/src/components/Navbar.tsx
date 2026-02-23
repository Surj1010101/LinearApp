import { Link } from 'react-router-dom';
import { useAuth } from '../context';

const Navbar: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();

  return (
    <nav style={{ display: 'flex', gap: '1rem', padding: '1rem', borderBottom: '1px solid #ddd' }}>
      <Link to="/">Linear</Link>
      <div style={{ marginLeft: 'auto', display: 'flex', gap: '1rem' }}>
        {isAuthenticated ? (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <button onClick={logout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
