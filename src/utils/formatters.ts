/**
 * Shared date/time formatting helpers.
 *
 * Centralizes the date formatting that used to be copy-pasted (slightly
 * differently each time) across EventsPage, EventDetailsPage, DashboardPage,
 * etc. All helpers guard against invalid/missing input instead of throwing
 * or rendering "Invalid Date".
 */

const FALLBACK = 'Not set'

function toDate(value: string | null | undefined): Date | null {
  if (!value) return null
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}

/** e.g. "Jul 14, 2026" */
export function formatDate(isoString: string | null | undefined, fallback = FALLBACK): string {
  const date = toDate(isoString)
  if (!date) return fallback
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

/** e.g. "Jul 14, 2026, 10:00 AM" */
export function formatDateTime(isoString: string | null | undefined, fallback = FALLBACK): string {
  const date = toDate(isoString)
  if (!date) return fallback
  return date.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

/**
 * Convert an ISO datetime string from the API into the value shape expected
 * by an `<input type="datetime-local">` (local time, no seconds/timezone,
 * e.g. "2026-07-14T10:00"). Returns an empty string when the input is
 * missing/invalid so the input renders blank instead of crashing.
 */
export function toDateTimeLocalInput(isoString: string | null | undefined): string {
  const date = toDate(isoString)
  if (!date) return ''
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

/**
 * Convert a `<input type="datetime-local">` value (local time, no timezone)
 * back into an ISO string suitable for sending to the API.
 */
export function fromDateTimeLocalInput(value: string): string {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return date.toISOString()
}
