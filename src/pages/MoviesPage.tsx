import { useQuery } from '@tanstack/react-query';
import { getMovies } from '@/api/movies';
import MovieCard from '@/components/MovieCard';
import { Skeleton } from '@/components/ui/skeleton';

export default function MoviesPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['movies'],
    queryFn: getMovies,
  });

  if (isLoading) {
    return (
      <div>
        <h1 className="text-3xl font-bold mb-8">Filmy</h1>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="aspect-[2/3] w-full rounded-lg" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-2/3" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-16">
        <p className="text-destructive">Nie udało się załadować filmów. Spróbuj ponownie.</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Filmy</h1>
      {data?.movies.length === 0 ? (
        <p className="text-muted-foreground text-center py-16">Brak dostępnych filmów.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {data?.movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      )}
    </div>
  );
}
