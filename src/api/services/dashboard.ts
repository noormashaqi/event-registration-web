import { apiClient } from '../client'

export interface UpcomingEvent {
  id: number
  name: string
  categoryName: string
  startAt: string
  location: string
  capacity: number
  activeRegistrationCount: number
  availableSeats: number
}

export interface DashboardSummary {
  totalActiveCategories: number
  totalActiveParticipants: number
  totalUpcomingActiveEvents: number
  totalActiveRegistrations: number
  upcomingEvents: UpcomingEvent[]
}

export const dashboardService = {
  getSummary: () => apiClient.get<DashboardSummary>('/dashboard/summary'),
}