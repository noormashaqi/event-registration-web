/**
 * Registration domain types
 * Used throughout the frontend for type safety
 */

export interface RegistrationListItem {
    id: number;
    eventId: number;
    eventName: string;
    participantId: number;
    participantName: string;
    participantEmail: string;
    participantPhone: string;
    status: number;
    statusName: string;
    notes: string | null;
    registeredAt: string;
    cancelledAt: string | null;
  }
  
  export interface RegistrationDetail {
    id: number;
    eventId: number;
    eventName: string;
    participantId: number;
    participantName: string;
    participantEmail: string;
    participantPhone: string;
    status: number;
    statusName: string;
    notes: string | null;
    registeredAt: string;
    cancelledAt: string | null;
  }
  
  export interface RegisterParticipantRequest {
    participantId: number;
    notes?: string | null;
  }
  
  export interface RegistrationResponse {
    id: number;
    eventId: number;
    eventName: string;
    participantId: number;
    participantName: string;
    participantEmail: string;
    participantPhone: string;
    status: number;
    statusName: string;
    notes: string | null;
    registeredAt: string;
    cancelledAt: string | null;
  }
  
  export interface PaginatedRegistrations {
    items: RegistrationListItem[];
    page: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
  }
  
  export interface RegistrationListQueryParams {
    page?: number;
    pageSize?: number;
    search?: string;
    status?: number;
  }