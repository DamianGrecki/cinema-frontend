import { apiClient } from './client';
import type { BasketResponse } from './types';

export const createBasket = async (): Promise<BasketResponse> => {
  const { data } = await apiClient.post<BasketResponse>('/api/basket');
  return data;
};
