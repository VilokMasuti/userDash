import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { Toaster } from './components/ui/sonner.tsx'
import './index.css'

async function bootstrap() {
  if (import.meta.env.DEV) {
    const { worker } = await import('./mocks/browser')
    // If app is served at the root, omit serviceWorker.url to use '/mockServiceWorker.js'
    await worker.start({
      onUnhandledRequest: 'bypass', // optional, reduces console noise during dev
      // serviceWorker: { url: '/mockServiceWorker.js' }, // keep only if customized location/scope is required
    })
    console.log('MSW worker started ✅')
  }

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
      <Toaster />
    </StrictMode>,
  )
}

bootstrap().catch((err) => {
  console.error('Bootstrap failed:', err)
  // Render anyway to avoid a blank screen in dev if MSW fails to start
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
      <Toaster />
    </StrictMode>,
  )
})
