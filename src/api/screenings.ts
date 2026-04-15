import { apiClient } from './client';
import type { ScreeningListResponse, ScreeningResponse, RowSeatsMapResponse } from './types';

export const getScreenings = async (date?: string): Promise<ScreeningListResponse> => {
  const { data } = await apiClient.get<ScreeningListResponse>('/api/screenings', {
    params: date ? { date } : undefined,
  });
  return data;
};

export const getScreening = async (screeningId: string): Promise<ScreeningResponse> => {
  const { data } = await apiClient.get<ScreeningResponse>(`/api/screenings/${screeningId}`);
  return data;
};

export const getScreeningSeats = async (screeningId: string): Promise<RowSeatsMapResponse[]> => {
  const { data } = await apiClient.get<RowSeatsMapResponse[]>(
    `/api/screenings/${screeningId}/seats`,
  );
  return data;
};
