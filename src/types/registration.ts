/**
 * Registration domain types
 * Used throughout the frontend for type safety
 */

/** 1 = Active, 2 = Cancelled (matches the API's Registrations.Status column). */
export type RegistrationStatus = 1 | 2;

/**
 * A single registration as returned by the API. The list, detail, and
 * register/cancel-response endpoints all return this exact same shape, so
 * they share one interface instead of three copy-pasted near-duplicates.
 */
export interface Registration {
  id: number;
  eventId: number;
  eventName: string;
  participantId: number;
  participantName: string;
  participantEmail: string;
  participantPhone: string;
  status: RegistrationStatus;
  statusName: string;
  notes: string | null;
  registeredAt: string;
  cancelledAt: string | null;
}

/** @deprecated use {@link Registration} */
export type RegistrationListItem = Registration;

/** @deprecated use {@link Registration} */
export type RegistrationDetail = Registration;

/** @deprecated use {@link Registration} */
export type RegistrationResponse = Registration;

export interface RegisterParticipantRequest {
  participantId: number;
  notes?: string | null;
}

export interface PaginatedRegistrations {
  items: Registration[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export interface RegistrationListQueryParams {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: RegistrationStatus;
}
