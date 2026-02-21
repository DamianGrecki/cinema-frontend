import { apiClient } from './client';
import type { CreatePaymentRequest } from './types';

export const createPayment = async (body: CreatePaymentRequest): Promise<unknown> => {
  const { data } = await apiClient.post('/api/payment', body);
  return data;
};
