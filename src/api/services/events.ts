import { apiClient } from '../client'
import type { EventDetail, EventFormValues, EventSummary } from '../../types/event'
import type { PagedResult } from '../../types/common'

export interface EventListParams {
  page?: number
  pageSize?: number
  search?: string
  categoryId?: number
  fromDate?: string
  toDate?: string
  isActive?: boolean
}

// The API returns { totalCount, page, pageSize, items } without a
// totalPages field, unlike the other paginated list endpoints.
interface RawEventListResult {
  totalCount: number
  page: number
  pageSize: number
  items: EventSummary[]
}

export const eventsService = {
  getAll: async (params: EventListParams = {}): Promise<PagedResult<EventSummary>> => {
    const pageSize = params.pageSize ?? 100
    const raw = await apiClient.get<RawEventListResult>('/events', {
      page: params.page ?? 1,
      pageSize,
      search: params.search,
      categoryId: params.categoryId,
      fromDate: params.fromDate,
      toDate: params.toDate,
      isActive: params.isActive,
    })
    return {
      items: raw.items,
      page: raw.page,
      pageSize: raw.pageSize,
      totalCount: raw.totalCount,
      totalPages: Math.max(1, Math.ceil(raw.totalCount / raw.pageSize)),
    }
  },

  getById: (id: number) => apiClient.get<EventDetail>(`/events/${id}`),

  create: (data: EventFormValues) => apiClient.post<{ id: number }>('/events', data),

  update: (id: number, data: EventFormValues) => apiClient.put<void>(`/events/${id}`, data),

  remove: (id: number) => apiClient.delete<void>(`/events/${id}`),
}
