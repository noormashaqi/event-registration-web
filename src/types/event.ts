export type EventStatus = 'Upcoming' | 'Ongoing' | 'Completed'

/** Shape returned by GET /events (list) and GET /events/:id (detail). */
export interface EventSummary {
  id: number
  categoryId: number
  categoryName: string
  name: string
  location: string
  startAt: string
  endAt: string
  registrationDeadline: string
  capacity: number
  /** Number of registrations with status "Active" for this event. */
  activeRegistrationCount: number
  /** capacity - activeRegistrationCount, computed by the API. */
  availableSeats: number
  isActive: boolean
  eventStatus: EventStatus
}

/** GET /events/:id additionally includes the description. */
export interface EventDetail extends EventSummary {
  description: string | null
}

export interface EventFormValues {
  categoryId: number
  name: string
  description: string
  location: string
  startAt: string
  endAt: string
  registrationDeadline: string
  capacity: number
  isActive: boolean
}
