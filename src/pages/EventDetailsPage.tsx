import { eventsService } from '../api'
import { getEventRegistrations } from '../api/services/registrations'
import { useApi } from '../hooks/useApi'
import { Button } from '../components/ui/Button'
import { ActiveBadge } from '../components/ui/Badge'
import { ErrorState, LoadingState } from '../components/ui/States'
import RegistrationsSection from '../components/RegistrationsSection'
import type { EventStatus } from '../types/event'

function formatDateTime(isoString: string | null | undefined): string {
  if (!isoString) return 'Not set'
  const date = new Date(isoString)
  if (Number.isNaN(date.getTime())) return 'Not set'
  return date.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const statusClasses: Record<EventStatus, string> = {
  Upcoming: 'bg-blue-100 text-blue-800',
  Ongoing: 'bg-green-100 text-green-800',
  Completed: 'bg-gray-100 text-gray-600',
}

interface EventDetailsPageProps {
  eventId: number
  onBack: () => void
}

export function EventDetailsPage({ eventId, onBack }: EventDetailsPageProps) {
  const { data: event, loading, error, refetch } = useApi(() => eventsService.getById(eventId), [eventId])

  const { data: activeRegistrations } = useApi(
    () => getEventRegistrations(eventId, { status: 1, pageSize: 1 }),
    [eventId],
  )

  if (loading) {
    return <LoadingState label="Loading event details..." />
  }

  if (error) {
    return <ErrorState message={error} onRetry={refetch} />
  }

  if (!event) {
    return <ErrorState message="Event not found." />
  }

  const activeCount = activeRegistrations?.totalCount ?? 0
  const availableSeats = Math.max(event.capacity - activeCount, 0)

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
          <div className="flex flex-col items-end gap-2">
            <ActiveBadge isActive={event.isActive} />
            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusClasses[event.eventStatus]}`}>
              {event.eventStatus}
            </span>
          </div>
        </div>

        <dl className="mt-6 grid gap-4 border-t border-gray-100 pt-6 sm:grid-cols-2">
          <DetailItem label="Category" value={event.categoryName} />
          <DetailItem label="Location" value={event.location} />
          <DetailItem label="Capacity" value={`${event.capacity ?? 'N/A'} people`} />
          <DetailItem label="Start" value={formatDateTime(event.startAt)} />
          <DetailItem label="End" value={formatDateTime(event.endAt)} />
          <DetailItem label="Registration deadline" value={event.registrationDeadline ? formatDateTime(event.registrationDeadline) : 'Not set'} />
          <DetailItem label="Category ID" value={String(event.categoryId)} />
        </dl>
      </div>

      {/* Registrations Section */}
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <RegistrationsSection
          eventId={event.id}
          eventStartTime={new Date(event.startAt)}
          registrationDeadline={event.registrationDeadline ? new Date(event.registrationDeadline) : new Date()}
          capacity={event.capacity ?? 0}
          eventIsActive={event.isActive}
        />
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
