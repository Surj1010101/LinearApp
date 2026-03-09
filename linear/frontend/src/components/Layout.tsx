import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import { useTwemoji } from '../hooks/useTwemoji';

const Layout: React.FC = () => {
  const { pathname } = useLocation();
  // Reparse emojis whenever we navigate to a different page
  const wrapperRef = useTwemoji<HTMLDivElement>([pathname]);

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
