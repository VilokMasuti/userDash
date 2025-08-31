import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { Toaster } from './components/ui/sonner.tsx'
import './index.css'
// Start MSW in development so /api/* requests hit the mock server.
async function enableMocking() {
  if (import.meta.env.DEV) {
    const { worker } = await import('./mocks/browser')
    await worker.start({
      serviceWorker: {
        url: '/mockServiceWorker.js'
      }
    })
  }
}

enableMocking().finally(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
      <Toaster />
    </StrictMode>
  )
})
