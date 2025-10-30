import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import { StrictMode, Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { Text } from '../shared/components/Typography'
import { AppRoutes } from './routes/AppRoutes'

const queryClient = new QueryClient()

export function App() {
  return (
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <Suspense fallback={<Text>Loading...</Text>}>
          <ErrorBoundary
            fallback={<Text>Error</Text>}
            onError={error => {
              if (!isAxiosError(error)) return

              if (!error.response) return

              if (error.response.status !== 401) return
            }}
          >
            <AppRoutes />
          </ErrorBoundary>
        </Suspense>
      </QueryClientProvider>
    </StrictMode>
  )
}
