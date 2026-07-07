import { createRoot } from 'react-dom/client'
import 'lenis/dist/lenis.css'
import './index.css'
import { SmoothScrollProvider } from './lib/SmoothScrollProvider'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <SmoothScrollProvider>
    <App />
  </SmoothScrollProvider>,
)
