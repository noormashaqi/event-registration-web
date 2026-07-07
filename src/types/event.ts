export interface Event {
  id: number
  categoryId: number
  name: string
  description: string | null
  location: string
  startAt: string
  endAt: string
  registrationDeadline: string
  capacity: number
  isActive: boolean
  createdAt: string
  updatedAt: string | null
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
