import { apiClient } from './client';
import type {
  AddReservationRequest,
  ReservationResponse,
  UpdateReservationPricingTypeRequest,
  SuccessResponse,
} from './types';

const API_BASE = import.meta.env.VITE_API_URL ?? '';

export const expireReservations = (reservationIds: string[]): void => {
  if (reservationIds.length === 0) return;
  const token = localStorage.getItem('cinema_token');
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  reservationIds.forEach((id) => {
    fetch(`${API_BASE}/api/reservation/${id}/expire`, {
      method: 'POST',
      keepalive: true,
      headers,
    });
  });
};

export const addReservation = async (body: AddReservationRequest): Promise<ReservationResponse> => {
  const { data } = await apiClient.post<ReservationResponse>('/api/reservation', body);
  return data;
};

export const updateReservationPricingType = async (
  id: string,
  body: UpdateReservationPricingTypeRequest,
): Promise<SuccessResponse> => {
  const { data } = await apiClient.put<SuccessResponse>(
    `/api/reservation/${id}/pricing-type`,
    body,
  );
  return data;
};
