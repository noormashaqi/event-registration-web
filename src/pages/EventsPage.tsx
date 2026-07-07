import { eventsService } from '../api'
import { useApi } from '../hooks/useApi'
import { Button } from '../components/ui/Button'
import { ActiveBadge } from '../components/ui/Badge'
import { EmptyState, ErrorState, LoadingState } from '../components/ui/States'

function formatDate(isoString: string): string {
  return new Date(isoString).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

interface EventsPageProps {
  onViewEvent: (id: number) => void
}

export function EventsPage({ onViewEvent }: EventsPageProps) {
  const { data: events, loading, error, refetch } = useApi(() => eventsService.getAll(), [])

  if (loading) {
    return <LoadingState label="Loading events..." />
  }

  if (error) {
    return <ErrorState message={error} onRetry={refetch} />
  }

  if (!events?.length) {
    return (
      <div className="space-y-6">
        <PageHeader />
        <EmptyState message="No events found." />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {events.map((event) => (
          <div key={event.id} className="rounded-2xl bg-white p-5 shadow-sm">
            <div className="mb-3 flex items-start justify-between gap-2">
              <h2 className="text-lg font-semibold text-gray-900">{event.name}</h2>
              <ActiveBadge isActive={event.isActive} />
            </div>
            <p className="text-sm text-gray-600">{event.location}</p>
            <p className="mt-1 text-sm text-gray-500">Starts {formatDate(event.startAt)}</p>
            <p className="mt-1 text-sm text-gray-500">Capacity: {event.capacity}</p>
            <Button className="mt-4 w-full" onClick={() => onViewEvent(event.id)}>
              View details
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}

function PageHeader() {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-bold text-gray-900">Events</h1>
      <p className="mt-1 text-sm text-gray-500">Browse and manage registered events.</p>
    </div>
  )
}
