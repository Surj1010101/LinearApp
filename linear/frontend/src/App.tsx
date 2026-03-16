import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context';
import { Layout, ProtectedRoute } from './components';
import { Home, Login, Register, Dashboard, CheckIn, Recommendations, Tools, Inbox, History, Insights, NotFound } from './pages';

const App: React.FC = () => (
  <AuthProvider>
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          {/* Public tabs */}
          <Route path="/" element={<Home />} />
          <Route path="/tools" element={<Tools />} />
          <Route path="/inbox" element={<Inbox />} />
          <Route path="/history" element={<History />} />
          <Route path="/insights" element={<Insights />} />

          {/* Auth */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected routes (require login) */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/checkin" element={<CheckIn />} />
            <Route path="/recommendations" element={<Recommendations />} />
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </AuthProvider>
);

export default App;
