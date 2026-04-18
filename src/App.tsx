import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Layout/Navbar';
import Home from './pages/Home';
import Explore from './pages/Explore';
import ParkDetail from './pages/ParkDetail';
import Log from './pages/Log';
import Dashboard from './pages/Dashboard';

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/park/:parkCode" element={<ParkDetail />} />
        <Route path="/log" element={<Log />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="topo-bg" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Navbar />
        <main className="page-content" style={{ flex: 1 }}>
          <AnimatedRoutes />
        </main>
      </div>
    </BrowserRouter>
  );
}
