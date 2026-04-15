import { useQuery } from '@tanstack/react-query';
import { getScreenings } from '@/api/screenings';

export function useScreenings() {
  return useQuery({
    queryKey: ['screenings'],
    queryFn: () => getScreenings(),
  });
}
