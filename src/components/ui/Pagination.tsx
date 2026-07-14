interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

/**
 * Shared page-number pagination control. Previously this exact markup was
 * duplicated (with minor drift) in ParticipantsPage, RegistrationsSection,
 * and now EventsPage.
 */
export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null

  return (
    <div className="flex items-center justify-center gap-2">
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
            page === currentPage
              ? 'bg-blue-600 text-white'
              : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          {page}
        </button>
      ))}
    </div>
  )
}
