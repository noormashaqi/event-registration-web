import { eventsService } from '../api'
import { useApi } from '../hooks/useApi'
import { Button } from '../components/ui/Button'
import { ActiveBadge } from '../components/ui/Badge'
import { ErrorState, LoadingState } from '../components/ui/States'

function formatDateTime(isoString: string): string {
  return new Date(isoString).toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

interface EventDetailsPageProps {
  eventId: number
  onBack: () => void
}

export function EventDetailsPage({ eventId, onBack }: EventDetailsPageProps) {
  const { data: event, loading, error, refetch } = useApi(() => eventsService.getById(eventId), [eventId])

  if (loading) {
    return <LoadingState label="Loading event details..." />
  }

  if (error) {
    return <ErrorState message={error} onRetry={refetch} />
  }

  if (!event) {
    return <ErrorState message="Event not found." />
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <Button variant="secondary" onClick={onBack} className="mb-4">
          Back to events
        </Button>

        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{event.name}</h1>
            <p className="mt-2 text-gray-600">{event.description || 'No description provided.'}</p>
          </div>
          <ActiveBadge isActive={event.isActive} />
        </div>

        <dl className="mt-6 grid gap-4 border-t border-gray-100 pt-6 sm:grid-cols-2">
          <DetailItem label="Location" value={event.location} />
          <DetailItem label="Capacity" value={`${event.capacity ?? 'N/A'} people`} />
          <DetailItem label="Start" value={formatDateTime(event.startAt)} />
          <DetailItem label="End" value={formatDateTime(event.endAt)} />
          <DetailItem label="Registration deadline" value={event.registrationDeadline ? formatDateTime(event.registrationDeadline) : 'Not set'} />
          <DetailItem label="Category ID" value={String(event.categoryId)} />
        </dl>
      </div>
    </div>
  )
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-sm font-medium text-gray-500">{label}</dt>
      <dd className="mt-1 text-sm text-gray-900">{value}</dd>
    </div>
  )
}
