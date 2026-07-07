export interface Category {
  id: number
  name: string
  description: string | null
  isActive: boolean
  createdAt: string
  updatedAt: string | null
}

export interface CategoryFormValues {
  name: string
  description: string
  isActive: boolean
}