export interface Event {
  id: number;
  categoryId: number;
  name: string;
  description?: string;
  location: string;
  startAt: string;
  endAt: string;
  registrationDeadline: string;
  capacity: number;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateEventDto {
  categoryId: number;
  name: string;
  description?: string;
  location: string;
  startAt: string;
  endAt: string;
  registrationDeadline: string;
  capacity: number;
}

export interface UpdateEventDto extends CreateEventDto {}