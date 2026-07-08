interface EmptyStateProps {
    message: string
  }
  
  export default function EmptyState({ message }: EmptyStateProps) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-gray-500 text-lg">{message}</p>
      </div>
    )
  }