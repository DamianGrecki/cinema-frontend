import { useNavigate } from 'react-router-dom';
import { Film, Calendar, Ticket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="space-y-16">
      <section className="text-center py-16 space-y-6">
        <h1 className="text-5xl font-bold tracking-tight">
          Witaj w <span className="text-primary">CinemaApp</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-lg mx-auto">
          Zarezerwuj miejsca na ulubione filmy i ciesz się wyjątkowym doświadczeniem kinowym.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Button size="lg" onClick={() => navigate('/movies')}>
            <Film className="mr-2 h-5 w-5" />
            Przeglądaj filmy
          </Button>
          <Button size="lg" variant="outline" onClick={() => navigate('/screenings')}>
            <Calendar className="mr-2 h-5 w-5" />
            Repertuar
          </Button>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="pt-6 text-center space-y-3">
            <Film className="h-10 w-10 mx-auto text-primary" />
            <h3 className="font-semibold text-lg">Wybierz film</h3>
            <p className="text-muted-foreground text-sm">
              Przeglądaj naszą bibliotekę filmową i wybierz tytuł dla siebie.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center space-y-3">
            <Calendar className="h-10 w-10 mx-auto text-primary" />
            <h3 className="font-semibold text-lg">Wybierz seans</h3>
            <p className="text-muted-foreground text-sm">
              Znajdź odpowiedni termin i salę. Seanse dostępne każdego dnia.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center space-y-3">
            <Ticket className="h-10 w-10 mx-auto text-primary" />
            <h3 className="font-semibold text-lg">Kup bilet</h3>
            <p className="text-muted-foreground text-sm">
              Zapłać wygodnie online i odbierz bilet. Szybko i bezpiecznie.
            </p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
