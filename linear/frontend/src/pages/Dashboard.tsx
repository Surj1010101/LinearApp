import { useAuth } from '../context';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome back, {user?.name ?? 'User'}!</p>
      {/*i need to adddd mood chart, insights panel, quick check-in */}
    </div>
  );
};

export default Dashboard;
