import { apiClient } from '../client'
import type { Event, EventFormValues } from '../../types/event'

export const eventsService = {
  getAll: (includeInactive = false) =>
    apiClient.get<Event[]>('/events', { includeInactive }),

  getById: (id: number) => apiClient.get<Event>(`/events/${id}`),

  create: (data: EventFormValues) => apiClient.post<Event>('/events', data),

  update: (id: number, data: EventFormValues) => apiClient.put<Event>(`/events/${id}`, data),

  remove: (id: number) => apiClient.delete<void>(`/events/${id}`),
}
