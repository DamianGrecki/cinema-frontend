import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { isAxiosError } from 'axios';
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';
import { ArrowLeft, Clock, MapPin, ShoppingCart } from 'lucide-react';
import { getScreenings, getScreeningSeats } from '@/api/screenings';
import { createBasket } from '@/api/basket';
import { addReservation, cancelReservations, cancelReservationsAsync } from '@/api/reservation';
import { useBasketStore } from '@/store/basketStore';
import SeatMap, { type Seat } from '@/components/SeatMap';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import type { RowSeatsMapResponse } from '@/api/types';

const audioLanguageLabels: Record<string, string> = {
  ENGLISH: 'Angielski',
  POLISH: 'Polski',
};

const presentationLabels: Record<string, string> = {
  ORIGINAL: 'Oryginał',
  ORIGINAL_WITH_SUBTITLES: 'Oryginał z napisami',
  DUBBED: 'Dubbing',
};

function rowToSeats(rows: RowSeatsMapResponse[], reservedByUserIds: Set<string>): Seat[] {
  return rows.flatMap((row) =>
    row.seats.map((seat) => ({
      id: seat.seatId,
      row: String.fromCharCode(64 + row.rowNumber),
      number: seat.seatNumber,
      isOccupied: seat.reserved && !reservedByUserIds.has(seat.seatId),
    })),
  );
}

export default function SeatSelectionPage() {
  const { screeningId } = useParams<{ screeningId: string }>();
  const navigate = useNavigate();
  const [loadingSeatId, setLoadingSeatId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const queryClient = useQueryClient();
  const { baskets, setBasket, clearScreeningBasket, addReservation: storeAddReservation, removeReservation } =
    useBasketStore();

  const currentBasket = screeningId ? baskets[screeningId] : undefined;
  const basketId = currentBasket?.basketId ?? null;
  const reservations = currentBasket?.reservations ?? [];

  const sessionReservationIds = useRef<string[]>([]);
  const navigatingToCheckout = useRef(false);

  useEffect(() => {
    const navType = (performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming)?.type;
    if (navType === 'reload') return;

    clearScreeningBasket(screeningId!);
  }, []);

  useEffect(() => {
    const handleBeforeUnload = () => {
      cancelReservations(sessionReservationIds.current);
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      if (!navigatingToCheckout.current) {
        cancelReservations(sessionReservationIds.current);
        clearScreeningBasket(screeningId!);
      }
    };
  }, []);


  const { data: screeningsData } = useQuery({
    queryKey: ['screenings'],
    queryFn: getScreenings,
  });

  const {
    data: seatsData,
    isLoading: seatsLoading,
    isError: seatsError,
  } = useQuery({
    queryKey: ['seats', screeningId],
    queryFn: () => getScreeningSeats(screeningId!),
    enabled: !!screeningId,
    staleTime: 0,
    refetchOnMount: 'always',
    refetchOnWindowFocus: false,
  });

  const screening = screeningsData?.screenings.find((s) => s.id === screeningId);

  const reservedSeatIds = new Set(reservations.map((r) => r.seatId));

  const seats: Seat[] = seatsData ? rowToSeats(seatsData, reservedSeatIds) : [];

  const handleSeatClick = async (seatId: string) => {
    if (loadingSeatId || !screeningId) return;

    setLoadingSeatId(seatId);
    setError(null);

    if (reservedSeatIds.has(seatId)) {
      const reservation = reservations.find((r) => r.seatId === seatId);
      if (reservation) {
        try {
          await cancelReservationsAsync([reservation.reservationId]);
          removeReservation(screeningId, reservation.reservationId);
          sessionReservationIds.current = sessionReservationIds.current.filter(
            (id) => id !== reservation.reservationId,
          );
          await queryClient.invalidateQueries({ queryKey: ['seats', screeningId] });
        } catch {
          setError('Nie udało się anulować rezerwacji. Spróbuj ponownie.');
        } finally {
          setLoadingSeatId(null);
        }
      }
      return;
    }

    try {
      let currentBasketId = basketId;
      if (!currentBasketId) {
        const basketRes = await createBasket();
        currentBasketId = basketRes.basketId;
        setBasket(screeningId, currentBasketId);
      }

      const reservation = await addReservation({
        basketId: currentBasketId,
        screeningId,
        seatId,
      });

      const seat = seats.find((s) => s.id === seatId);
      storeAddReservation({
        reservationId: reservation.reservationId,
        screeningId,
        seatId,
        pricingType: 'NORMAL',
        screeningTitle: screening?.movieTitle ?? 'Seans',
        seatLabel: seat ? `Rząd ${seat.row}, miejsce ${seat.number}` : seatId,
      });
      sessionReservationIds.current.push(reservation.reservationId);
    } catch (err) {
      if (isAxiosError(err) && err.response?.status === 409) {
        setError('To miejsce zostało właśnie zajęte przez inną osobę. Wybierz inne miejsce.');
        await queryClient.invalidateQueries({ queryKey: ['seats', screeningId] });
      } else {
        setError('Nie udało się zarezerwować miejsca. Spróbuj ponownie.');
      }
    } finally {
      setLoadingSeatId(null);
    }
  };

  if (!screeningId) return null;

  const reservedCount = reservedSeatIds.size;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Button variant="ghost" onClick={() => navigate(-1)}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Wróć
      </Button>

      {screening ? (
        <Card>
          <CardHeader>
            <CardTitle>{screening.movieTitle}</CardTitle>
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mt-1">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {format(new Date(screening.startTime), 'EEEE, d MMMM · HH:mm', { locale: pl })}
                {' – '}
                {format(new Date(screening.endTime), 'HH:mm')}
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {screening.cinemaHallName}
              </div>
            </div>
            <div className="flex gap-2 flex-wrap mt-2">
              <Badge variant="secondary">{presentationLabels[screening.presentationType]}</Badge>
              <Badge variant="outline">{audioLanguageLabels[screening.audioLanguage] ?? screening.audioLanguage}</Badge>
              <Badge variant="outline">{screening.movieFormat}</Badge>
            </div>
          </CardHeader>
        </Card>
      ) : (
        <Skeleton className="h-36 rounded-lg" />
      )}

      <Card>
        <CardContent className="pt-6">
          <h2 className="text-lg font-semibold mb-2 text-center">Wybierz miejsca</h2>
          <p className="text-sm text-muted-foreground text-center mb-6">
            Kliknij miejsce, aby je natychmiast zarezerwować
          </p>

          {seatsLoading && (
            <div className="space-y-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-8 w-full rounded" />
              ))}
            </div>
          )}

          {seatsError && (
            <p className="text-center text-destructive text-sm">
              Nie udało się załadować miejsc. Spróbuj odświeżyć stronę.
            </p>
          )}

          {!seatsLoading && !seatsError && seats.length === 0 && (
            <p className="text-center text-muted-foreground text-sm">
              Brak wolnych miejsc na ten seans.
            </p>
          )}

          {!seatsLoading && !seatsError && seats.length > 0 && (
            <SeatMap
              seats={seats}
              reservedSeatIds={reservedSeatIds}
              loadingSeatId={loadingSeatId}
              onSeatSelect={handleSeatClick}
            />
          )}
        </CardContent>
      </Card>

      {error && <p className="text-sm text-destructive text-center">{error}</p>}

      <div className="flex items-center justify-between flex-wrap gap-4">
        <p className="text-sm text-muted-foreground">
          {reservedCount === 0
            ? 'Nie wybrano jeszcze żadnego miejsca'
            : `Zarezerwowano ${reservedCount} ${reservedCount === 1 ? 'miejsce' : 'miejsc'}`}
        </p>
        {reservedCount > 0 && (
          <Button
            size="lg"
            onClick={() => {
              navigatingToCheckout.current = true;
              navigate('/checkout', { state: { screeningId } });
            }}
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            Przejdź do zamówienia
          </Button>
        )}
      </div>
    </div>
  );
}
