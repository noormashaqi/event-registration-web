export type EventStatus = 'Upcoming' | 'Ongoing' | 'Completed'

export interface EventListItem {
  id: number
  name: string
  categoryId: number
  categoryName: string
  location: string
  startAt: string
  endAt: string
  isActive: boolean
  eventStatus: EventStatus
  // الحقول التالية غير موجودة بعد بالباك إند (ناقصة من GetEvents.ResultItem)
  capacity?: number
  activeRegistrationCount?: number
  availableSeats?: number
}

export interface EventDetails {
  id: number
  name: string
  description: string | null
  categoryId: number
  categoryName: string
  location: string
  startAt: string
  endAt: string
  isActive: boolean
  eventStatus: EventStatus
  // نفس الملاحظة - ناقصة من GetEventById.Result
  registrationDeadline?: string
  capacity?: number
  activeRegistrationCount?: number
  availableSeats?: number
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

export interface EventListParams {
  page?: number
  pageSize?: number
  search?: string
  categoryId?: number
  fromDate?: string
  toDate?: string
  isActive?: boolean
}

export interface PaginatedResult<T> {
  totalCount: number
  page: number
  pageSize: number
  items: T[]
}