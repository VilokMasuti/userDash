import { ErrorBoundary } from '@/components/ui/ErrorBoundary'
import UsersPage from '../src/Pages/UsersPage'

const App = () => {
  return (
    <main className="min-h-screen">
      <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <header className="mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
            Admin • Users
          </h1>
        </header>

        <ErrorBoundary>
          <UsersPage />
        </ErrorBoundary>
      </div>
    </main>
  )
}

export default App
