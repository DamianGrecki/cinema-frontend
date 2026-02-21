import { useNavigate } from 'react-router-dom';
import { CheckCircle, Film } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function ConfirmationPage() {
  const navigate = useNavigate();

  return (
    <div className="max-w-md mx-auto text-center py-16 space-y-6">
      <CheckCircle className="h-20 w-20 mx-auto text-green-500" />
      <h1 className="text-3xl font-bold">Dziękujemy!</h1>
      <p className="text-muted-foreground">
        Twoje zamówienie zostało pomyślnie złożone. Bilety zostaną wysłane na podany adres email.
      </p>
      <Card>
        <CardContent className="pt-6 space-y-2">
          <Film className="h-8 w-8 mx-auto text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Miłego seansu! W razie pytań skontaktuj się z obsługą kina.
          </p>
        </CardContent>
      </Card>
      <div className="flex gap-3 justify-center">
        <Button variant="outline" onClick={() => navigate('/screenings')}>
          Kup kolejny bilet
        </Button>
        <Button onClick={() => navigate('/')}>Strona główna</Button>
      </div>
    </div>
  );
}
