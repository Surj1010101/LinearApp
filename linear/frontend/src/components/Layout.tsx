import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const Layout: React.FC = () => (
  <>
    <main className="page">
      <Outlet />
    </main>
    <Navbar />
  </>
);

export default Layout;
