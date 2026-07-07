export function Navbar() {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <span className="text-lg font-semibold text-gray-900">
          {import.meta.env.VITE_APP_NAME ?? 'Event Registration System'}
        </span>
        <nav className="flex gap-1">
          <span className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white">Categories</span>
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