import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { TooltipProvider } from './components/ui/tooltip'
import { Toaster } from 'react-hot-toast'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TooltipProvider delayDuration={150}>
      <Toaster
        position="top-center"
        reverseOrder={false}
      />
      <App />
    </TooltipProvider>
  </StrictMode>,
)
