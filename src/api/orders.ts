import { apiClient } from './client';
import type { OrderHistoryResponse } from './types';

export const getOrderHistory = async (): Promise<OrderHistoryResponse[]> => {
  const { data } = await apiClient.get<OrderHistoryResponse[]>('/api/orders/history');
  return data;
};
