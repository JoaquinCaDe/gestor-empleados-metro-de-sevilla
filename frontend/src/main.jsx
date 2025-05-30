import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

// Force dark theme globally
if (typeof document !== 'undefined') {
  document.documentElement.classList.add('dark')
}

import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
