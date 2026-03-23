import { Link } from 'react-router-dom';

const NotFound: React.FC = () => (
  <div className="gap-16 text-center" style={{ paddingTop: '60px' }}>
    <div style={{ fontSize: '4rem' }}>😵</div>
    <h1>404</h1>
    <p>This page doesn't exist.</p>
    <Link to="/" className="btn btn-primary" style={{ maxWidth: '200px', margin: '0 auto' }}>Go Home</Link>
  </div>
);

export default NotFound;
