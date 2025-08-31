import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { Toaster } from './components/ui/sonner.tsx'
import './index.css'

async function bootstrap() {
  if (typeof window !== 'undefined') {
    try {
      const { worker } = await import('./mocks/browser')
      await worker.start({
        onUnhandledRequest: 'bypass'
      })
      console.log('MSW worker started ✅')
    } catch (err) {
      console.warn('MSW failed to start:', err)
    }
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
})
