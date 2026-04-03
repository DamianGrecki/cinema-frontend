import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { format, startOfDay, addDays, isWithinInterval } from 'date-fns';
import { pl } from 'date-fns/locale';
import { getScreenings } from '@/api/screenings';
import ScreeningCard from '@/components/ScreeningCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import type { ScreeningResponse } from '@/api/types';

function buildDayTabs() {
  const today = startOfDay(new Date());
  return Array.from({ length: 5 }, (_, i) => {
    const date = addDays(today, i);
    return {
      key: format(date, 'yyyy-MM-dd'),
      label: i === 0 ? 'Dziś' : i === 1 ? 'Jutro' : format(date, 'EEE, d MMM', { locale: pl }),
      start: date,
      end: addDays(date, 1),
    };
  });
}

interface GroupedMovie {
  movieTitle: string;
  posterUrl: string;
  screenings: ScreeningResponse[];
}

function groupByMovie(screenings: ScreeningResponse[]): GroupedMovie[] {
  const map = new Map<string, GroupedMovie>();
  for (const s of screenings) {
    let group = map.get(s.movieTitle);
    if (!group) {
      group = { movieTitle: s.movieTitle, posterUrl: s.moviePosterUrl, screenings: [] };
      map.set(s.movieTitle, group);
    }
    group.screenings.push(s);
  }
  // sort screenings within each group by start time
  for (const group of map.values()) {
    group.screenings.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
  }
  return [...map.values()];
}

export default function ScreeningsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const movieFilter = searchParams.get('movie');
  const dayFilter = searchParams.get('day');

  const dayTabs = useMemo(() => buildDayTabs(), []);
  const activeDay = dayTabs.find((d) => d.key === dayFilter) ?? dayTabs[0];

  const { data, isLoading, isError } = useQuery({
    queryKey: ['screenings'],
    queryFn: getScreenings,
  });

  const grouped = useMemo(() => {
    const screenings = data?.screenings ?? [];

    const filtered = screenings.filter((s) => {
      const start = new Date(s.startTime);
      const inDay = isWithinInterval(start, { start: activeDay.start, end: activeDay.end });
      if (!inDay) return false;
      if (movieFilter && s.movieTitle !== movieFilter) return false;
      return true;
    });

    return groupByMovie(filtered);
  }, [data, activeDay, movieFilter]);

  const setDay = (key: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('day', key);
    setSearchParams(params);
  };

  if (isLoading) {
    return (
      <div>
        <h1 className="text-3xl font-bold mb-8">Repertuar</h1>
        <div className="flex flex-col gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-36 rounded-lg" />
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
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <h1 className="text-3xl font-bold">
          {movieFilter ? `Seanse: ${movieFilter}` : 'Repertuar'}
        </h1>
        {movieFilter && (
          <Button variant="outline" onClick={() => {
            const params = new URLSearchParams(searchParams);
            params.delete('movie');
            setSearchParams(params);
          }}>
            Pokaż wszystkie
          </Button>
        )}
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {dayTabs.map((tab) => (
          <Button
            key={tab.key}
            variant={activeDay.key === tab.key ? 'default' : 'outline'}
            size="sm"
            onClick={() => setDay(tab.key)}
            className="shrink-0"
          >
            {tab.label}
          </Button>
        ))}
      </div>

      {grouped.length === 0 ? (
        <p className="text-muted-foreground text-center py-16">
          Brak dostępnych seansów{movieFilter ? ` dla "${movieFilter}"` : ''} w wybranym dniu.
        </p>
      ) : (
        <div className="flex flex-col gap-4">
          {grouped.map((group) => (
            <ScreeningCard
              key={group.movieTitle}
              movieTitle={group.movieTitle}
              posterUrl={group.posterUrl}
              screenings={group.screenings}
            />
          ))}
        </div>
      )}
    </div>
  );
}
