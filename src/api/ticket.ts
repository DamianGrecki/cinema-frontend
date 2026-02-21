import { apiClient } from './client';
import type { CreateTicketRequest, SuccessResponse } from './types';

export const createTickets = async (tickets: CreateTicketRequest[]): Promise<SuccessResponse> => {
  const { data } = await apiClient.post<SuccessResponse>('/api/ticket', tickets);
  return data;
};
