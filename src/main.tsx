import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/globals.css';
import './styles/topo-bg.css';
import './styles/animations.css';
import 'leaflet/dist/leaflet.css';
import App from './App.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
