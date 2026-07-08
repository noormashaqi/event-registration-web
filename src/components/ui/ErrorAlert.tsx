
import { ApiError } from '../../api/client';

interface ErrorAlertProps {
  error: ApiError;
  onRetry?: () => void;
  onDismiss?: () => void;
}

export default function ErrorAlert({ error, onRetry, onDismiss }: ErrorAlertProps) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
      <h3 className="text-red-800 font-bold mb-2">Error</h3>
      <p className="text-red-700 mb-3">{error.message}</p>
      {error.errors && error.errors.length > 0 && (
        <ul className="text-red-700 text-sm ml-4 mb-3">
          {error.errors.map((err, i) => (
            <li key={i}>• {err}</li>
          ))}
        </ul>
      )}
      <div className="flex gap-2">
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
          >
            Retry
          </button>
        )}
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="px-3 py-1 bg-gray-400 text-white rounded text-sm hover:bg-gray-500"
          >
            Dismiss
          </button>
        )}
      </div>
    </div>
  );
}