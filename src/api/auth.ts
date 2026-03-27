import { apiClient } from './client';
import type { LoginRequest, LoginResponse } from './types';

export const login = async (body: LoginRequest): Promise<LoginResponse> => {
  const { data } = await apiClient.post<LoginResponse>('/api/user/login', body, {
    withCredentials: true,
  });
  return data;
};

export const refreshAccessToken = async (): Promise<LoginResponse> => {
  const { data } = await apiClient.post<LoginResponse>('/api/token/refresh', null, {
    withCredentials: true,
  });
  return data;
};
