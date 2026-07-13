import { Button } from '../components/ui/Button'

interface NotFoundPageProps {
  onGoHome: () => void
}

export function NotFoundPage({ onGoHome }: NotFoundPageProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl bg-white p-12 text-center shadow-sm">
      <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">404</p>
      <h1 className="text-2xl font-bold text-gray-900">Page not found</h1>
      <p className="max-w-sm text-sm text-gray-500">
        The page you're looking for doesn't exist or may have been moved.
      </p>
      <Button onClick={onGoHome} className="mt-2">
        Back to dashboard
      </Button>
    </div>
  )
}
