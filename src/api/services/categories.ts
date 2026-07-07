import { apiClient } from '../client'
import type { Category, CategoryFormValues } from '../../types/category'

export const categoriesService = {
  getAll: (includeInactive = false) =>
    apiClient.get<Category[]>('/categories', { includeInactive }),

  getById: (id: number) => apiClient.get<Category>(`/categories/${id}`),

  create: (data: CategoryFormValues) => apiClient.post<Category>('/categories', data),

  update: (id: number, data: CategoryFormValues) => apiClient.put<Category>(`/categories/${id}`, data),

  remove: (id: number) => apiClient.delete<void>(`/categories/${id}`),
}