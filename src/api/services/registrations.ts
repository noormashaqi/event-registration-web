/**
 * Registrations API service
 * Handles all registration-related API calls
 */

import { apiClient } from '../client';
import type {
  RegistrationDetail,
  RegisterParticipantRequest,
  RegistrationResponse,
  PaginatedRegistrations,
  RegistrationListQueryParams,
} from '../../types/registration';

function buildQueryString(params?: RegistrationListQueryParams): string {
  if (!params || Object.keys(params).length === 0) {
    return '';
  }

  const queryParams = new URLSearchParams();

  if (params.page !== undefined) {
    queryParams.append('page', params.page.toString());
  }
  if (params.pageSize !== undefined) {
    queryParams.append('pageSize', params.pageSize.toString());
  }
  if (params.search) {
    queryParams.append('search', params.search);
  }
  if (params.status !== undefined) {
    queryParams.append('status', params.status.toString());
  }

  const queryString = queryParams.toString();
  return queryString ? `?${queryString}` : '';
}

/**
 * Named to match the other object-shaped services (categoriesService,
 * eventsService, participantsService) so every feature is imported from the
 * `api` barrel the same way.
 */
export const registrationsService = {
  /** Get paginated list of registrations for an event */
  getForEvent: (eventId: number, params?: RegistrationListQueryParams): Promise<PaginatedRegistrations> => {
    const queryParams = buildQueryString(params);
    return apiClient.get<PaginatedRegistrations>(`/events/${eventId}/registrations${queryParams}`);
  },

  /** Get a single registration by ID */
  getById: (registrationId: number): Promise<RegistrationDetail> =>
    apiClient.get<RegistrationDetail>(`/registrations/${registrationId}`),

  /** Register a participant in an event (or reactivate if cancelled) */
  register: (eventId: number, data: RegisterParticipantRequest): Promise<RegistrationResponse> =>
    apiClient.post<RegistrationResponse>(`/events/${eventId}/registrations`, data),

  /** Cancel a registration */
  cancel: (registrationId: number): Promise<RegistrationResponse> =>
    apiClient.patch<RegistrationResponse>(`/registrations/${registrationId}/cancel`, {}),
}
