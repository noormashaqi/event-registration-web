/**
 * Participant domain types
 * Used throughout the frontend for type safety
 */

/**
 * Participant list item - returned from paginated list endpoint
 */
export interface ParticipantListItem {
    id: number;
    fullName: string;
    email: string;
    phone: string;
    dateOfBirth: string | null; // ISO 8601 date
    isActive: boolean;
    createdAt: string; // ISO 8601 datetime
  }
  
  /**
   * Participant detail response - returned from single participant endpoint
   */
  export interface ParticipantDetail {
    id: number;
    fullName: string;
    email: string;
    phone: string;
    dateOfBirth: string | null;
    isActive: boolean;
    createdAt: string;
    updatedAt: string | null;
  }
  
  /**
   * Participant creation/update request
   */
  export interface ParticipantRequest {
    fullName: string;
    email: string;
    phone: string;
    dateOfBirth?: string | null;
    isActive: boolean;
  }
  
  /**
   * Participant response - returned after create/update
   */
  export interface ParticipantResponse {
    id: number;
    fullName: string;
    email: string;
    phone: string;
    dateOfBirth: string | null;
    isActive: boolean;
    createdAt: string;
    updatedAt: string | null;
  }
  
  /**
   * Paginated participants response
   */
  export interface PaginatedParticipants {
    items: ParticipantListItem[];
    page: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
  }
  
  /**
   * Query parameters for listing participants
   */
  export interface ParticipantListQueryParams {
    page?: number;
    pageSize?: number;
    search?: string;
    isActive?: boolean;
  }