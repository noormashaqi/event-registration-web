import { dashboardService } from '../api'
import { useApi } from '../hooks/useApi'
import { EmptyState, ErrorState, LoadingState } from '../components/ui/States'

function formatDateTime(isoString: string): string {
  return new Date(isoString).toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
    </div>
  )
}

export function DashboardPage() {
  const { data, loading, error, refetch } = useApi(() => dashboardService.getSummary(), [])

  if (loading) {
    return <LoadingState label="Loading dashboard..." />
  }

  if (error) {
    return <ErrorState message={error} onRetry={refetch} />
  }

  if (!data) {
    return null
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          An overview of categories, events, participants and registrations.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Active Categories" value={data.totalActiveCategories} />
        <StatCard label="Active Participants" value={data.totalActiveParticipants} />
        <StatCard label="Upcoming Events" value={data.totalUpcomingActiveEvents} />
        <StatCard label="Active Registrations" value={data.totalActiveRegistrations} />
      </div>

      {/* Upcoming events */}
      <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
        <div className="border-b border-gray-100 px-6 py-4">
          <h2 className="text-base font-semibold text-gray-900">Next 5 Upcoming Events</h2>
        </div>

        {data.upcomingEvents.length === 0 ? (
          <div className="p-6">
            <EmptyState message="There are no upcoming events right now." />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-6 py-4">Event</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Start</th>
                  <th className="px-6 py-4">Location</th>
                  <th className="px-6 py-4">Seats</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data.upcomingEvents.map((event) => (
                  <tr key={event.id} className="transition hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">{event.name}</td>
                    <td className="px-6 py-4 text-gray-600">{event.categoryName}</td>
                    <td className="px-6 py-4 text-gray-600">{formatDateTime(event.startAt)}</td>
                    <td className="px-6 py-4 text-gray-600">{event.location}</td>
                    <td className="px-6 py-4 text-gray-600">
                      {event.availableSeats} / {event.capacity}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  )
}