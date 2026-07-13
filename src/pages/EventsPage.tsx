import { useState } from 'react'
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
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')

  const {
    data: result,
    loading,
    error,
    refetch,
  } = useApi(
    () =>
      eventsService.getAll({
        fromDate: fromDate || undefined,
        toDate: toDate || undefined,
      }),
    [fromDate, toDate],
  )

  const events = result?.items ?? null

  if (loading) {
    return <LoadingState label="Loading events..." />
  }

  if (error) {
    return <ErrorState message={error} onRetry={refetch} />
  }

  return (
    <div className="space-y-6">
      <PageHeader />

      <div className="rounded-2xl bg-white p-4 shadow-sm">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">From date</label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              max={toDate || undefined}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">To date</label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              min={fromDate || undefined}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {!events?.length ? (
        <EmptyState message="No events found." />
      ) : (
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
      )}
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
