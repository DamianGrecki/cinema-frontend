import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface Seat {
  id: string;
  row: string;
  number: number;
  isOccupied: boolean;
}

interface SeatMapProps {
  seats: Seat[];
  reservedSeatIds: Set<string>;
  loadingSeatId: string | null;
  onSeatSelect: (seatId: string) => void;
}

export default function SeatMap({
  seats,
  reservedSeatIds,
  loadingSeatId,
  onSeatSelect,
}: SeatMapProps) {
  const rows = Array.from(new Set(seats.map((s) => s.row))).sort();

  return (
    <div className="space-y-4 overflow-x-auto">
      <div className="text-center min-w-max mx-auto">
        <div className="inline-block bg-muted text-muted-foreground text-xs px-16 py-1.5 rounded-t-lg mb-6 tracking-widest uppercase">
          Ekran
        </div>

        <div className="space-y-2">
          {rows.map((row) => (
            <div key={row} className="flex items-center gap-2 justify-center">
              <span className="text-xs text-muted-foreground w-4 text-right">{row}</span>
              <div className="flex gap-1">
                {seats
                  .filter((s) => s.row === row)
                  .sort((a, b) => a.number - b.number)
                  .map((seat) => {
                    const isReserved = reservedSeatIds.has(seat.id);
                    const isLoading = loadingSeatId === seat.id;
                    const isDisabled = seat.isOccupied || !!loadingSeatId;

                    return (
                      <button
                        key={seat.id}
                        disabled={isDisabled}
                        onClick={() => onSeatSelect(seat.id)}
                        title={
                          isReserved
                            ? `Rząd ${seat.row}, miejsce ${seat.number} — kliknij aby anulować`
                            : seat.isOccupied
                              ? `Rząd ${seat.row}, miejsce ${seat.number} — zajęte`
                              : `Rząd ${seat.row}, miejsce ${seat.number}`
                        }
                        className={cn(
                          'w-7 h-7 text-[10px] rounded-t-md border transition-colors flex items-center justify-center',
                          isLoading &&
                            'bg-primary/50 border-primary/50 cursor-wait animate-pulse',
                          isReserved &&
                            !isLoading &&
                            'bg-green-500 text-white border-green-600 cursor-pointer hover:bg-green-600',
                          seat.isOccupied &&
                            'bg-muted cursor-not-allowed border-muted-foreground/20 text-muted-foreground/40',
                          !isLoading &&
                            !isReserved &&
                            !seat.isOccupied &&
                            'bg-card border-border hover:bg-accent cursor-pointer',
                        )}
                      >
                        {isLoading ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          seat.number
                        )}
                      </button>
                    );
                  })}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-6 justify-center text-xs text-muted-foreground pt-4 flex-wrap">
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded-t bg-card border border-border" />
          <span>Wolne</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded-t bg-green-500" />
          <span>Twoje</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded-t bg-muted border border-muted-foreground/20" />
          <span>Zajęte</span>
        </div>
      </div>
    </div>
  );
}
