export function formatDateTime(isoString: string | null | undefined): string {
  if (!isoString) return '—'
  return new Date(isoString).toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

/** يحول قيمة <input type="datetime-local"> المحلية إلى ISO UTC عشان نبعتها للباك إند */
export function localDateTimeToIsoUtc(localValue: string): string {
  return new Date(localValue).toISOString()
}

/** يحول ISO UTC القادم من الباك إند إلى قيمة تصلح لـ <input type="datetime-local"> */
export function isoUtcToLocalDateTimeInput(isoString: string): string {
  const date = new Date(isoString)
  const offsetMs = date.getTimezoneOffset() * 60_000
  const localDate = new Date(date.getTime() - offsetMs)
  return localDate.toISOString().slice(0, 16)
}

export function eventStatusBadgeClasses(status: string): string {
  switch (status) {
    case 'Upcoming':
      return 'bg-blue-100 text-blue-800'
    case 'Ongoing':
      return 'bg-green-100 text-green-800'
    case 'Completed':
      return 'bg-gray-100 text-gray-600'
    default:
      return 'bg-gray-100 text-gray-600'
  }
}
