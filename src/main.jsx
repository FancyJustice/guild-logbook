import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'rpg-awesome/css/rpg-awesome.min.css'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
