import { ErrorBoundary } from '@/components/error/ErrorBoundary'
import UsersPage from '../src/Pages/UsersPage'

const App = () => {
  return (
    <main className="min-h-screen">
      <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <ErrorBoundary>
          <UsersPage />
        </ErrorBoundary>
      </div>
    </main>
  )
}

export default App
