import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import { useTwemoji } from '../hooks/useTwemoji';

const Layout: React.FC = () => {
  useLocation();
  // MutationObserver inside useTwemoji auto-reparses on DOM changes
  const wrapperRef = useTwemoji<HTMLDivElement>();

  return (
    <div ref={wrapperRef}>
      <main className="page">
        <Outlet />
      </main>
      <Navbar />
    </div>
  );
};

export default Layout;
