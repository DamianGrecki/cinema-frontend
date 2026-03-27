import { apiClient } from './client';
import type { BasketResponse, BasketPricingResponse } from './types';

export const createBasket = async (): Promise<BasketResponse> => {
  const { data } = await apiClient.post<BasketResponse>('/api/basket');
  return data;
};

export const getBasketPricing = async (basketId: string): Promise<BasketPricingResponse> => {
  const { data } = await apiClient.get<BasketPricingResponse>(`/api/basket/${basketId}/pricing`);
  return data;
};
