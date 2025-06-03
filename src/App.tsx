import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Layout from './components/Layout';
import PortfolioLayout from './components/PortfolioLayout';
import Projects from './pages/Projects';
import Saved from './pages/Saved';
import Shared from './pages/Shared';
import Achievement from './pages/Achievement';
import Dashboard from './pages/Dashboard';
import Inputs from './pages/Inputs';
import Profile from './pages/Profile';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/portfolio/projects" replace />} />
            <Route path="portfolio" element={<PortfolioLayout />}>
              <Route path="projects" element={<Projects />} />
              <Route path="saved" element={<Saved />} />
              <Route path="shared" element={<Shared />} />
              <Route path="achievement" element={<Achievement />} />
            </Route>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="inputs" element={<Inputs />} />
            <Route path="profile" element={<Profile />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;