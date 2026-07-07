interface NavbarProps {
  currentPage: 'dashboard' | 'categories'
  onNavigate: (page: 'dashboard' | 'categories') => void
}

export function Navbar({ currentPage, onNavigate }: NavbarProps) {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <span className="text-lg font-semibold text-gray-900">
          {import.meta.env.VITE_APP_NAME ?? 'Event Registration System'}
        </span>
        <nav className="flex gap-1">
          <button
            onClick={() => onNavigate('dashboard')}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              currentPage === 'dashboard' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => onNavigate('categories')}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              currentPage === 'categories' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Categories
          </button>
          <span className="rounded-md px-3 py-1.5 text-sm font-medium text-gray-300" title="Coming soon">
            Events
          </span>
          <span className="rounded-md px-3 py-1.5 text-sm font-medium text-gray-300" title="Coming soon">
            Participants
          </span>
        </nav>
      </div>
    </header>
  )
}