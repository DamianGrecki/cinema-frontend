import { apiClient } from './client';
import type { MovieListResponse } from './types';

export const getMovies = async (): Promise<MovieListResponse> => {
  const { data } = await apiClient.get<MovieListResponse>('/api/movies');
  return data;
};
