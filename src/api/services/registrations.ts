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

/**
 * Get paginated list of registrations for an event
 */
export async function getEventRegistrations(
  eventId: number,
  params?: RegistrationListQueryParams
): Promise<PaginatedRegistrations> {
  const queryParams = buildQueryString(params);
  return apiClient.get<PaginatedRegistrations>(
    `/events/${eventId}/registrations${queryParams}`
  );
}

/**
 * Get a single registration by ID
 */
export async function getRegistrationById(
  registrationId: number
): Promise<RegistrationDetail> {
  return apiClient.get<RegistrationDetail>(`/registrations/${registrationId}`);
}

/**
 * Register a participant in an event (or reactivate if cancelled)
 */
export async function registerParticipant(
  eventId: number,
  data: RegisterParticipantRequest
): Promise<RegistrationResponse> {
  return apiClient.post<RegistrationResponse>(
    `/events/${eventId}/registrations`,
    data
  );
}

/**
 * Cancel a registration
 */
export async function cancelRegistration(
  registrationId: number
): Promise<RegistrationResponse> {
  return apiClient.patch<RegistrationResponse>(
    `/registrations/${registrationId}/cancel`,
    {}
  );
}

/**
 * Build query string from parameters
 */
function buildQueryString(
  params?: RegistrationListQueryParams
): string {
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