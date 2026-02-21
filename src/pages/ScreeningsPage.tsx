import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { getScreenings } from '@/api/screenings';
import ScreeningCard from '@/components/ScreeningCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';

export default function ScreeningsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const movieFilter = searchParams.get('movie');

  const { data, isLoading, isError } = useQuery({
    queryKey: ['screenings'],
    queryFn: getScreenings,
  });

  const screenings = data?.screenings ?? [];
  const filtered = movieFilter
    ? screenings.filter((s) => s.movieTitle === movieFilter)
    : screenings;

  if (isLoading) {
    return (
      <div>
        <h1 className="text-3xl font-bold mb-8">Repertuar</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-52 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-16">
        <p className="text-destructive">Nie udało się załadować repertuaru. Spróbuj ponownie.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <h1 className="text-3xl font-bold">
          {movieFilter ? `Seanse: ${movieFilter}` : 'Repertuar'}
        </h1>
        {movieFilter && (
          <Button variant="outline" onClick={() => setSearchParams({})}>
            Pokaż wszystkie
          </Button>
        )}
      </div>

      {filtered.length === 0 ? (
        <p className="text-muted-foreground text-center py-16">
          Brak dostępnych seansów{movieFilter ? ` dla "${movieFilter}"` : ''}.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((screening) => (
            <ScreeningCard key={screening.id} screening={screening} />
          ))}
        </div>
      )}
    </div>
  );
}
