import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import '/node_modules/leaflet/dist/leaflet.css';
import 'react-toastify/dist/ReactToastify.css';
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
