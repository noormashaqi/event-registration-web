import { apiClient } from '../client'
import type {
  EventDetails,
  EventFormValues,
  EventListItem,
  EventListParams,
  PaginatedResult,
} from '../../types/event'

export const eventsService = {
  getAll: (params: EventListParams = {}) =>
    apiClient.get<PaginatedResult<EventListItem>>('/events', { ...params }),

  getById: (id: number) => apiClient.get<EventDetails>(`/events/${id}`),

  create: (data: EventFormValues) => apiClient.post<{ id: number }>('/events', data),

  update: (id: number, data: EventFormValues) => apiClient.put<void>(`/events/${id}`, data),

  remove: (id: number) => apiClient.delete<void>(`/events/${id}`),
}
