import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { Film as FilmIcon } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { ScreeningResponse } from '@/api/types';

const presentationLabels: Record<string, string> = {
  ORIGINAL: 'Oryginał',
  ORIGINAL_WITH_SUBTITLES: 'Oryginał z napisami',
  DUBBED: 'Dubbing',
};


interface ScreeningCardProps {
  movieTitle: string;
  posterUrl: string;
  screenings: ScreeningResponse[];
}

export default function ScreeningCard({ movieTitle, posterUrl, screenings }: ScreeningCardProps) {
  const navigate = useNavigate();
  const [imgError, setImgError] = useState(false);

  return (
    <Card className="hover:shadow-md transition-shadow flex flex-row overflow-hidden">
      <div className="w-32 sm:w-40 shrink-0 bg-muted flex items-center justify-center">
        {posterUrl && !imgError ? (
          <img
            src={posterUrl}
            alt={movieTitle}
            className="w-full h-full object-contain"
            onError={() => setImgError(true)}
          />
        ) : (
          <FilmIcon className="h-10 w-10 text-muted-foreground opacity-40" />
        )}
      </div>

      <div className="flex flex-col flex-1 p-4 gap-3">
        <h3 className="font-semibold text-lg">{movieTitle}</h3>

        <div className="flex flex-wrap gap-2">
          {screenings.map((s) => {
            const start = new Date(s.startTime);
            return (
              <Button
                key={s.id}
                variant="outline"
                size="sm"
                className="flex flex-col h-auto py-1.5 px-3 leading-tight"
                onClick={() => navigate(`/screening/${s.id}`)}
              >
                <span className="font-semibold">{format(start, 'HH:mm')}</span>
                <span className="text-[11px] text-muted-foreground">
                  {s.movieFormat} · {presentationLabels[s.presentationType]}
                </span>
              </Button>
            );
          })}
        </div>

      </div>
    </Card>
  );
}
