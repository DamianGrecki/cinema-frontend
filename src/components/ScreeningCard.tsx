import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';
import { Clock, MapPin, Film } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { ScreeningResponse } from '@/api/types';

const presentationLabels: Record<string, string> = {
  ORIGINAL: 'Oryginał',
  ORIGINAL_WITH_SUBTITLES: 'Oryginał z napisami',
  DUBBED: 'Dubbing',
};

interface ScreeningCardProps {
  screening: ScreeningResponse;
}

export default function ScreeningCard({ screening }: ScreeningCardProps) {
  const navigate = useNavigate();
  const start = new Date(screening.startTime);
  const end = new Date(screening.endTime);

  return (
    <Card className="hover:shadow-md transition-shadow flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base">{screening.movieTitle}</CardTitle>
          <Badge variant="secondary" className="shrink-0">
            {presentationLabels[screening.presentationType]}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-2 text-sm text-muted-foreground flex-1">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 shrink-0" />
          <span>
            {format(start, 'EEEE, d MMM', { locale: pl })}
            {' · '}
            {format(start, 'HH:mm')} – {format(end, 'HH:mm')}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 shrink-0" />
          <span>{screening.cinemaHallName}</span>
        </div>
        <div className="flex items-center gap-2">
          <Film className="h-4 w-4 shrink-0" />
          <span>
            {screening.movieFormat} · {screening.audioLanguage}
          </span>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={() => navigate(`/screening/${screening.id}`)}>
          Wybierz miejsce
        </Button>
      </CardFooter>
    </Card>
  );
}
