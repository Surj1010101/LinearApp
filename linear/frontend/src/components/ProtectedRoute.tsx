import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context';

/**wraps routes that require authentication bascally good for nothing (JK)*/
const ProtectedRoute: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <p>Loading…</p>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return <Outlet />;
};

export default ProtectedRoute;
