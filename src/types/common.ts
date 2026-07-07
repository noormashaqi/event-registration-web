export interface PagedResult<T> {
  items: T[]
  page: number
  pageSize: number
  totalCount: number
  totalPages: number
}

export interface ApiErrorResponse {
  success: false
  timestamp: string
  message: string
  errors: string[]
}