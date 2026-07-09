import { useState } from 'react'
import { categoriesService, eventsService } from '../api'
import { useApi, useAsyncAction } from '../hooks/useApi'
import { Button } from '../components/ui/Button'
import { ActiveBadge } from '../components/ui/Badge'
import { EmptyState, ErrorState, LoadingState } from '../components/ui/States'
import { Modal } from '../components/ui/Modal'
import { ConfirmDialog } from '../components/ui/ConfirmDialog'
import { EventForm } from '../components/events/EventForm'
import { eventStatusBadgeClasses, formatDateTime } from '../utils/formatters'
import type { EventDetails, EventFormValues, EventListItem } from '../types/event'

interface EventsPageProps {
  onViewEvent?: (eventId: number) => void
}

export function EventsPage({ onViewEvent }: EventsPageProps) {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [categoryId, setCategoryId] = useState<number | ''>('')
  const [isActive, setIsActive] = useState<'all' | 'true' | 'false'>('all')

  const { data: categories } = useApi(() => categoriesService.getAll(true), [])

  const {
    data: eventsResult,
    loading,
    error,
    refetch,
  } = useApi(
    () =>
      eventsService.getAll({
        page,
        pageSize: 10,
        search: search || undefined,
        categoryId: categoryId === '' ? undefined : categoryId,
        isActive: isActive === 'all' ? undefined : isActive === 'true',
      }),
    [page, search, categoryId, isActive],
  )

  const [editing, setEditing] = useState<EventDetails | null | 'new'>(null)
  const [deleting, setDeleting] = useState<EventListItem | null>(null)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  // لجلب EventDetails كاملة قبل فتح فورم التعديل (لأنه القائمة ما فيها كل الحقول)
  const [loadingDetails, setLoadingDetails] = useState(false)

  const saveAction = useAsyncAction(async (values: EventFormValues) => {
    if (editing && editing !== 'new') {
      return eventsService.update(editing.id, values)
    }
    return eventsService.create(values)
  })

  const deleteAction = useAsyncAction((id: number) => eventsService.remove(id))

  async function handleEditClick(item: EventListItem) {
    setLoadingDetails(true)
    try {
      const details = await eventsService.getById(item.id)
      setEditing(details)
    } catch {
      setDeleteError('Unable to load event details.')
    } finally {
      setLoadingDetails(false)
    }
  }

  async function handleSave(values: EventFormValues) {
    try {
      await saveAction.run(values)
      setEditing(null)
      refetch()
    } catch {
      // الخطأ ظاهر جوا الفورم
    }
  }

  async function handleDelete() {
    if (!deleting) return
    try {
      await deleteAction.run(deleting.id)
      setDeleting(null)
      setDeleteError(null)
      refetch()
    } catch {
      setDeleteError(deleteAction.error ?? 'Unable to delete this event.')
      setDeleting(null)
    }
  }

  const totalPages = eventsResult ? Math.ceil(eventsResult.totalCount / eventsResult.pageSize) : 1

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white p-6 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Events</h1>
          <p className="mt-1 text-sm text-gray-500">Manage events, schedules and capacity.</p>
        </div>
        <Button onClick={() => setEditing('new')}>+ New Event</Button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 gap-3 rounded-2xl bg-white p-4 shadow-sm sm:grid-cols-4">
        <input
          type="text"
          placeholder="Search by name or location..."
          className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          value={search}
          onChange={(e) => {
            setPage(1)
            setSearch(e.target.value)
          }}
        />

        <select
          className="rounded-md border border-gray-300 px-3 py-2 text-sm"
          value={categoryId}
          onChange={(e) => {
            setPage(1)
            setCategoryId(e.target.value === '' ? '' : Number(e.target.value))
          }}
        >
          <option value="">All categories</option>
          {categories?.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <select
          className="rounded-md border border-gray-300 px-3 py-2 text-sm"
          value={isActive}
          onChange={(e) => {
            setPage(1)
            setIsActive(e.target.value as 'all' | 'true' | 'false')
          }}
        >
          <option value="all">All statuses</option>
          <option value="true">Active only</option>
          <option value="false">Inactive only</option>
        </select>
      </div>

      {deleteError && <ErrorState message={deleteError} />}

      {loading && <LoadingState label="Loading events..." />}
      {error && <ErrorState message={error} onRetry={refetch} />}

      {!loading && !error && eventsResult && eventsResult.items.length === 0 && (
        <EmptyState message="No events match your filters." />
      )}

      {!loading && !error && eventsResult && eventsResult.items.length > 0 && (
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Start</th>
                  <th className="px-6 py-4">Location</th>
                  <th className="px-6 py-4">Seats</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Active</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {eventsResult.items.map((event) => (
                  <tr key={event.id} className="transition hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">{event.name}</td>
                    <td className="px-6 py-4 text-gray-600">{event.categoryName}</td>
                    <td className="px-6 py-4 text-gray-600">{formatDateTime(event.startAt)}</td>
                    <td className="px-6 py-4 text-gray-600">{event.location}</td>
                    <td className="px-6 py-4 text-gray-600">
                      {event.availableSeats !== undefined ? `${event.availableSeats} / ${event.capacity}` : '—'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${eventStatusBadgeClasses(event.eventStatus)}`}>
                        {event.eventStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <ActiveBadge isActive={event.isActive} />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        {onViewEvent && (
                          <Button variant="secondary" onClick={() => onViewEvent(event.id)}>
                            View
                          </Button>
                        )}
                        <Button variant="secondary" onClick={() => handleEditClick(event)}>
                          Edit
                        </Button>
                        <Button variant="danger" onClick={() => setDeleting(event)}>
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between border-t border-gray-100 px-6 py-3 text-sm text-gray-600">
            <span>
              Page {page} of {totalPages || 1} ({eventsResult.totalCount} total)
            </span>
            <div className="flex gap-2">
              <Button variant="secondary" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                Previous
              </Button>
              <Button variant="secondary" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>
                Next
              </Button>
            </div>
          </div>
        </div>
      )}

      <Modal
        open={editing !== null}
        title={editing === 'new' ? 'New Event' : 'Edit Event'}
        onClose={() => setEditing(null)}
      >
        {loadingDetails ? (
          <LoadingState label="Loading event..." />
        ) : (
          <EventForm
            categories={categories ?? []}
            initial={editing && editing !== 'new' ? editing : null}
            submitting={saveAction.submitting}
            fieldErrors={saveAction.fieldErrors}
            onSubmit={handleSave}
            onCancel={() => setEditing(null)}
          />
        )}
      </Modal>

      <ConfirmDialog
        open={deleting !== null}
        title="Delete Event"
        message={`Are you sure you want to delete "${deleting?.name}"? Events with registrations cannot be deleted.`}
        confirmLabel="Delete"
        loading={deleteAction.submitting}
        onConfirm={handleDelete}
        onCancel={() => setDeleting(null)}
      />
    </div>
  )
}