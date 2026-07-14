import { useState } from 'react'
import { categoriesService, eventsService } from '../api'
import { useApi, useAsyncAction } from '../hooks/useApi'
import { Button } from '../components/ui/Button'
import { ActiveBadge } from '../components/ui/Badge'
import { EmptyState, ErrorState, LoadingState } from '../components/ui/States'
import { Modal } from '../components/ui/Modal'
import { ConfirmDialog } from '../components/ui/ConfirmDialog'
import { Pagination } from '../components/ui/Pagination'
import { SelectField, TextField } from '../components/ui/FormFields'
import { EventForm } from '../components/events/EventForm'
import { formatDateTime } from '../utils/formatters'
import type { EventDetail, EventFormValues, EventStatus, EventSummary } from '../types/event'

const statusClasses: Record<EventStatus, string> = {
  Upcoming: 'bg-blue-100 text-blue-800',
  Ongoing: 'bg-green-100 text-green-800',
  Completed: 'bg-gray-100 text-gray-600',
}

interface EventsPageProps {
  onViewEvent: (id: number) => void
}

export function EventsPage({ onViewEvent }: EventsPageProps) {
  const [search, setSearch] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [isActive, setIsActive] = useState<'' | 'true' | 'false'>('')
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [page, setPage] = useState(1)
  const pageSize = 10

  const {
    data: result,
    loading,
    error,
    refetch,
  } = useApi(
    () =>
      eventsService.getAll({
        page,
        pageSize,
        search: search || undefined,
        categoryId: categoryId ? Number(categoryId) : undefined,
        isActive: isActive === '' ? undefined : isActive === 'true',
        fromDate: fromDate || undefined,
        toDate: toDate || undefined,
      }),
    [page, pageSize, search, categoryId, isActive, fromDate, toDate],
  )

  const { data: categories } = useApi(() => categoriesService.getAll(true), [])
  const activeCategories = categories?.filter((c) => c.isActive) ?? []

  const [editing, setEditing] = useState<'new' | EventDetail | null>(null)
  const [editLoading, setEditLoading] = useState(false)
  const [editLoadError, setEditLoadError] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<EventSummary | null>(null)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  const saveAction = useAsyncAction(async (values: EventFormValues) => {
    if (editing && editing !== 'new') {
      return eventsService.update(editing.id, values)
    }
    return eventsService.create(values)
  })

  const deleteAction = useAsyncAction((id: number) => eventsService.remove(id))

  function resetToFirstPage() {
    setPage(1)
  }

  async function openEditForm(event: EventSummary) {
    setEditLoadError(null)
    setEditLoading(true)
    try {
      const detail = await eventsService.getById(event.id)
      setEditing(detail)
    } catch {
      setEditLoadError('Could not load event details. Please try again.')
    } finally {
      setEditLoading(false)
    }
  }

  async function handleSave(values: EventFormValues) {
    try {
      await saveAction.run(values)
      setEditing(null)
      refetch()
    } catch {
      // saveAction surfaces the error in the form UI
    }
  }

  async function handleDelete() {
    if (!deleting) return
    try {
      await deleteAction.run(deleting.id)
      setDeleting(null)
      setDeleteError(null)
      resetToFirstPage()
      refetch()
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : 'Unable to delete event.')
    }
  }

  const events = result?.items ?? null
  const totalPages = result?.totalPages ?? 1

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-2xl bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Events</h1>
          <p className="mt-1 text-sm text-gray-500">Browse, create, and manage events.</p>
        </div>
        <Button onClick={() => setEditing('new')}>+ New Event</Button>
      </div>

      <div className="rounded-2xl bg-white p-4 shadow-sm">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <TextField
            label="Search"
            placeholder="Name or location…"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              resetToFirstPage()
            }}
          />
          <SelectField
            label="Category"
            value={categoryId}
            onChange={(e) => {
              setCategoryId(e.target.value)
              resetToFirstPage()
            }}
          >
            <option value="">All categories</option>
            {categories?.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </SelectField>
          <SelectField
            label="Status"
            value={isActive}
            onChange={(e) => {
              setIsActive(e.target.value as '' | 'true' | 'false')
              resetToFirstPage()
            }}
          >
            <option value="">All statuses</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </SelectField>
          <TextField
            label="From date"
            type="date"
            value={fromDate}
            max={toDate || undefined}
            onChange={(e) => {
              setFromDate(e.target.value)
              resetToFirstPage()
            }}
          />
          <TextField
            label="To date"
            type="date"
            value={toDate}
            min={fromDate || undefined}
            onChange={(e) => {
              setToDate(e.target.value)
              resetToFirstPage()
            }}
          />
        </div>
      </div>

      {editLoadError && <ErrorState message={editLoadError} onDismiss={() => setEditLoadError(null)} />}
      {deleteError && <ErrorState message={deleteError} onDismiss={() => setDeleteError(null)} />}

      {loading && <LoadingState label="Loading events..." />}

      {error && <ErrorState message={error} onRetry={refetch} />}

      {!loading && !error && events && events.length === 0 && (
        <EmptyState message="No events found." action={<Button onClick={() => setEditing('new')}>Create Event</Button>} />
      )}

      {!loading && !error && events && events.length > 0 && (
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Location</th>
                  <th className="px-6 py-4">Start</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Seats</th>
                  <th className="px-6 py-4">Active</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {events.map((event) => (
                  <tr key={event.id} className="transition hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">{event.name}</td>
                    <td className="px-6 py-4 text-gray-600">{event.categoryName}</td>
                    <td className="px-6 py-4 text-gray-600">{event.location}</td>
                    <td className="px-6 py-4 text-gray-600">{formatDateTime(event.startAt)}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusClasses[event.eventStatus]}`}>
                        {event.eventStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {event.availableSeats} / {event.capacity}
                    </td>
                    <td className="px-6 py-4">
                      <ActiveBadge isActive={event.isActive} />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <Button variant="secondary" onClick={() => onViewEvent(event.id)}>
                          View
                        </Button>
                        <Button variant="secondary" onClick={() => openEditForm(event)} disabled={editLoading}>
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
        </div>
      )}

      {events && events.length > 0 && <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />}

      <Modal open={editing !== null} title={editing === 'new' ? 'Create Event' : 'Edit Event'} onClose={() => setEditing(null)}>
        <EventForm
          initial={editing && editing !== 'new' ? editing : null}
          categories={activeCategories}
          submitting={saveAction.submitting}
          fieldErrors={saveAction.fieldErrors}
          onSubmit={handleSave}
          onCancel={() => setEditing(null)}
        />
      </Modal>

      <ConfirmDialog
        open={deleting !== null}
        title="Delete Event"
        message={`Are you sure you want to delete "${deleting?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        loading={deleteAction.submitting}
        onConfirm={handleDelete}
        onCancel={() => setDeleting(null)}
      />
    </div>
  )
}
