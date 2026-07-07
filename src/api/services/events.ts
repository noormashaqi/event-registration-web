import { client } from '../client';
import { Event, CreateEventDto, UpdateEventDto } from '../../types/event';

export const eventService = {
  getAll: async (params?: any): Promise<Event[]> => {
    const response = await client.get<Event[]>('/api/events', { params });
    return response.data;
  },

  getById: async (id: number): Promise<Event> => {
    const response = await client.get<Event>(`/api/events/${id}`);
    return response.data;
  },

  create: async (data: CreateEventDto): Promise<number> => {
    const response = await client.post<number>('/api/events', data);
    return response.data;
  },

  update: async (id: number, data: UpdateEventDto): Promise<void> => {
    await client.put(`/api/events/${id}`, data);
  },

  delete: async (id: number): Promise<void> => {
    await client.delete(`/api/events/${id}`);
  }
};