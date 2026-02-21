import { apiClient } from './client';
import type { ScreeningListResponse, RowSeatsMapResponse } from './types';

export const getScreenings = async (): Promise<ScreeningListResponse> => {
  const { data } = await apiClient.get<ScreeningListResponse>('/api/screenings');
  return data;
};

export const getScreeningSeats = async (screeningId: string): Promise<RowSeatsMapResponse[]> => {
  const { data } = await apiClient.get<RowSeatsMapResponse[]>(
    `/api/screenings/${screeningId}/seats`,
  );
  return data;
};
