import { apiClient } from '../client';
import type {
  ParticipantDetail,
  ParticipantRequest,
  ParticipantResponse,
  PaginatedParticipants,
  ParticipantListQueryParams,
} from '../../types/participant';

/**
 * Get paginated list of participants with search and filtering
 */
export async function getParticipants(params?: ParticipantListQueryParams): Promise<PaginatedParticipants> {
  return apiClient.get<PaginatedParticipants>('/participants', {
    page: params?.page,
    pageSize: params?.pageSize,
    search: params?.search,
    isActive: params?.isActive,
  });
}

/**
 * Get a single participant by ID
 */
export async function getParticipantById(id: number): Promise<ParticipantDetail> {
  return apiClient.get<ParticipantDetail>(`/participants/${id}`);
}

/**
 * Create a new participant
 */
export async function createParticipant(data: ParticipantRequest): Promise<ParticipantResponse> {
  return apiClient.post<ParticipantResponse>('/participants', data);
}

/**
 * Update an existing participant
 */
export async function updateParticipant(id: number, data: ParticipantRequest): Promise<ParticipantResponse> {
  return apiClient.put<ParticipantResponse>(`/participants/${id}`, data);
}

/**
 * Delete a participant
 */
export async function deleteParticipant(id: number): Promise<void> {
  return apiClient.delete<void>(`/participants/${id}`);
}