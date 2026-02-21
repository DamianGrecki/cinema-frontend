import { apiClient } from './client';
import type {
  AddReservationRequest,
  ReservationResponse,
  UpdateReservationPricingTypeRequest,
  SuccessResponse,
} from './types';

const API_BASE = import.meta.env.VITE_API_URL ?? '';

export const cancelReservations = (reservationIds: string[]): void => {
  if (reservationIds.length === 0) return;
  const token = localStorage.getItem('cinema_token');
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  fetch(`${API_BASE}/api/reservations/cancel`, {
    method: 'POST',
    keepalive: true,
    headers,
    body: JSON.stringify({ reservationsIds: reservationIds }),
  });
};

export const cancelReservationsAsync = async (reservationIds: string[]): Promise<void> => {
  await apiClient.post('/api/reservations/cancel', { reservationsIds: reservationIds });
};

export const addReservation = async (body: AddReservationRequest): Promise<ReservationResponse> => {
  const { data } = await apiClient.post<ReservationResponse>('/api/reservation', body);
  return data;
};

export const updateReservationPricingType = async (
  id: string,
  body: UpdateReservationPricingTypeRequest,
): Promise<SuccessResponse> => {
  const { data } = await apiClient.patch<SuccessResponse>(
    `/api/reservation/${id}/pricing-type`,
    body,
  );
  return data;
};
