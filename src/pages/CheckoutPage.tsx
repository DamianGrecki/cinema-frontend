import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { useBasketStore } from '@/store/basketStore';
import { useAuthStore } from '@/store/authStore';
import { updateReservationPricingType } from '@/api/reservation';
import { getBasketPricing } from '@/api/basket';
import { createPayment } from '@/api/payment';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import type { PaymentProvider, PricingType, ReservationPricingDto } from '@/api/types';

const PROVIDERS: { value: PaymentProvider; label: string }[] = [
  { value: 'PAYU', label: 'PayU' },
  { value: 'PAYPAL', label: 'PayPal' },
  { value: 'STRIPE', label: 'Stripe' },
  { value: 'SANDBOX', label: 'Sandbox (testowy)' },
];

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { baskets, updatePricingType, clearScreeningBasket } = useBasketStore();
  const authenticated = useAuthStore((s) => s.isAuthenticated());
  const screeningId: string | null = state?.screeningId ?? null;
  const currentBasket = screeningId ? baskets[screeningId] : undefined;
  const basketId = currentBasket?.basketId ?? null;
  const reservations = currentBasket?.reservations ?? [];
  const [provider, setProvider] = useState<PaymentProvider>('SANDBOX');
  const [guestFirstName, setGuestFirstName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pricing, setPricing] = useState<Record<string, ReservationPricingDto>>({});
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [pricingLoading, setPricingLoading] = useState(false);

  const fetchPricing = useCallback(async () => {
    if (!basketId) return;
    setPricingLoading(true);
    try {
      const data = await getBasketPricing(basketId);
      const map: Record<string, ReservationPricingDto> = {};
      for (const r of data.reservations) {
        map[r.reservationId] = r;
      }
      setPricing(map);
      setTotalPrice(data.totalPrice);
    } catch {
      setError('Nie udało się pobrać cen. Spróbuj odświeżyć stronę.');
    } finally {
      setPricingLoading(false);
    }
  }, [basketId]);

  useEffect(() => {
    fetchPricing();
  }, [fetchPricing]);

  if (reservations.length === 0) {
    return (
      <div className="text-center py-16 space-y-4">
        <ShoppingCart className="h-16 w-16 mx-auto text-muted-foreground" />
        <h2 className="text-2xl font-bold">Koszyk jest pusty</h2>
        <p className="text-muted-foreground">Dodaj bilety, aby kontynuować.</p>
        <Button onClick={() => navigate('/screenings')}>Przeglądaj repertuar</Button>
      </div>
    );
  }

  const handlePricingChange = async (reservationId: string, pricingType: PricingType) => {
    try {
      await updateReservationPricingType(reservationId, { pricingType });
      updatePricingType(reservationId, pricingType);
      await fetchPricing();
    } catch {
      // cena przywrócona przez brak aktualizacji store
    }
  };

  const handlePayment = async () => {
    if (!basketId) return;
    setIsLoading(true);
    setError(null);

    try {
      const paymentData = await createPayment({
        basketId,
        provider,
        ...(!authenticated && {
          guestFirstName: guestFirstName || undefined,
          guestEmail: guestEmail || undefined,
        }),
      });

      if (screeningId) clearScreeningBasket(screeningId);
      navigate('/confirmation', { state: { paymentData } });
    } catch {
      setError('Nie udało się przetworzyć płatności. Sprawdź dane i spróbuj ponownie.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Zamówienie</h1>

      {/* Wybrane miejsca */}
      <Card>
        <CardHeader>
          <CardTitle>Wybrane miejsca</CardTitle>
        </CardHeader>
        <CardContent className="divide-y">
          {reservations.map((res) => (
            <div key={res.reservationId} className="flex items-center justify-between gap-4 py-3">
              <div className="min-w-0">
                <p className="font-medium truncate">{res.screeningTitle}</p>
                <p className="text-sm text-muted-foreground">{res.seatLabel}</p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <Select
                  value={res.pricingType}
                  onValueChange={(v) => handlePricingChange(res.reservationId, v as PricingType)}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NORMAL">Normalny</SelectItem>
                    <SelectItem value="REDUCED">Ulgowy</SelectItem>
                  </SelectContent>
                </Select>
                <span className="text-sm font-medium w-16 text-right">
                  {pricing[res.reservationId]
                    ? `${pricing[res.reservationId].price.toFixed(2)} zł`
                    : '—'}
                </span>
              </div>
            </div>
          ))}

          <div className="flex items-center justify-between pt-4">
            <div className="flex items-center gap-2">
              <span className="font-semibold">Razem</span>
              <Badge variant="secondary">{reservations.length} bilety</Badge>
            </div>
            <span className="text-xl font-bold">{totalPrice.toFixed(2)} zł</span>
          </div>
        </CardContent>
      </Card>

      {/* Płatność */}
      <Card>
        <CardHeader>
          <CardTitle>Płatność</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="provider">Metoda płatności</Label>
            <div className="grid grid-cols-2 gap-2">
              {PROVIDERS.map((p) => (
                <button
                  key={p.value}
                  type="button"
                  onClick={() => setProvider(p.value)}
                  className={`rounded-md border px-4 py-3 text-sm font-medium transition-colors text-left ${
                    provider === p.value
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-border hover:bg-accent'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {!authenticated && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Imię</Label>
                  <Input
                    id="firstName"
                    type="text"
                    placeholder="Jan"
                    value={guestFirstName}
                    onChange={(e) => setGuestFirstName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="twoj@email.com"
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                  />
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Na ten adres wyślemy potwierdzenie i bilety.
              </p>
            </>
          )}

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button className="w-full" size="lg" onClick={handlePayment} disabled={isLoading || pricingLoading}>
            {isLoading ? 'Przetwarzanie...' : `Zapłać ${totalPrice.toFixed(2)} zł`}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
