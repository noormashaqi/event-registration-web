import type { ReactNode } from 'react'

export function LoadingState({ label = 'Loading...' }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-3 py-12 text-gray-500">
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
      <span>{label}</span>
    </div>
  )
}

interface ErrorStateProps {
  message: string
  /** Optional field-level validation errors (e.g. from an ApiError) shown as a bulleted list. */
  errors?: string[]
  onRetry?: () => void
  onDismiss?: () => void
}

export function ErrorState({ message, errors, onRetry, onDismiss }: ErrorStateProps) {
  return (
    <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-800">
      <p>{message}</p>
      {errors && errors.length > 0 && (
        <ul className="mt-2 list-inside list-disc text-red-700">
          {errors.map((err, i) => (
            <li key={i}>{err}</li>
          ))}
        </ul>
      )}
      {(onRetry || onDismiss) && (
        <div className="mt-2 flex gap-4">
          {onRetry && (
            <button onClick={onRetry} className="font-medium underline hover:no-underline">
              Try again
            </button>
          )}
          {onDismiss && (
            <button onClick={onDismiss} className="font-medium underline hover:no-underline">
              Dismiss
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export function EmptyState({ message, action }: { message: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-md border border-dashed border-gray-300 py-12 text-center text-gray-500">
      <p>{message}</p>
      {action}
    </div>
  )
}
