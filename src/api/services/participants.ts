import { apiClient } from '../client';
import type {
  ParticipantDetail,
  ParticipantRequest,
  ParticipantResponse,
  PaginatedParticipants,
  ParticipantListQueryParams,
} from '../../types/participant';

/**
 * Participants API service.
 *
 * Named to match the object-shaped services (categoriesService,
 * eventsService, dashboardService) so every feature is imported from the
 * `api` barrel the same way instead of some pages reaching into
 * `api/services/*` directly.
 */
export const participantsService = {
  /** Get paginated list of participants with search and filtering */
  getAll: (params?: ParticipantListQueryParams): Promise<PaginatedParticipants> =>
    apiClient.get<PaginatedParticipants>('/participants', {
      page: params?.page,
      pageSize: params?.pageSize,
      search: params?.search,
      isActive: params?.isActive,
    }),

  /** Get a single participant by ID */
  getById: (id: number): Promise<ParticipantDetail> => apiClient.get<ParticipantDetail>(`/participants/${id}`),

  /** Create a new participant */
  create: (data: ParticipantRequest): Promise<ParticipantResponse> => apiClient.post<ParticipantResponse>('/participants', data),

  /** Update an existing participant */
  update: (id: number, data: ParticipantRequest): Promise<ParticipantResponse> =>
    apiClient.put<ParticipantResponse>(`/participants/${id}`, data),

  /** Delete a participant */
  remove: (id: number): Promise<void> => apiClient.delete<void>(`/participants/${id}`),
};
