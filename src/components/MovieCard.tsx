import { useNavigate } from 'react-router-dom';
import { Film } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { MovieResponse } from '@/api/types';

interface MovieCardProps {
  movie: MovieResponse;
}

export default function MovieCard({ movie }: MovieCardProps) {
  const navigate = useNavigate();

  return (
    <Card className="h-full flex flex-col hover:shadow-md transition-shadow">
      <div className="aspect-[2/3] bg-muted rounded-t-lg flex items-center justify-center overflow-hidden">
        <div className="text-muted-foreground text-center p-4">
          <Film className="h-12 w-12 mx-auto mb-2 opacity-40" />
          <div className="text-xs opacity-60">{movie.title}</div>
        </div>
      </div>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg line-clamp-2">{movie.title}</CardTitle>
        <CardDescription className="line-clamp-3">{movie.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1" />
      <CardFooter>
        <Button
          className="w-full"
          onClick={() => navigate(`/screenings?movie=${encodeURIComponent(movie.title)}`)}
        >
          Zobacz seanse
        </Button>
      </CardFooter>
    </Card>
  );
}
