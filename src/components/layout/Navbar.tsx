import type { AppPage } from '../../utils/navigation'

interface NavbarProps {
  currentPage: AppPage | null
  onNavigate: (page: AppPage) => void
}

export function Navbar({ currentPage, onNavigate }: NavbarProps) {
  const links: { page: AppPage; label: string }[] = [
    { page: 'dashboard', label: 'Dashboard' },
    { page: 'categories', label: 'Categories' },
    { page: 'events', label: 'Events' },
    { page: 'participants', label: 'Participants' },
  ]

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <span className="text-lg font-semibold text-gray-900">
          {import.meta.env.VITE_APP_NAME ?? 'Event Registration System'}
        </span>
        <nav className="flex gap-1">
          {links.map(({ page, label }) => (
            <button
              key={page}
              onClick={() => onNavigate(page)}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                currentPage === page ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  )
}
