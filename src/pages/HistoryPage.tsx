import { useQuery } from '@tanstack/react-query';
import { Navigate } from 'react-router-dom';
import { Calendar, MapPin, Ticket } from 'lucide-react';
import { getOrderHistory } from '@/api/orders';
import { useAuthStore } from '@/store/authStore';
import { Skeleton } from '@/components/ui/skeleton';
import type { OrderHistoryResponse, OrderHistoryTicketResponse } from '@/api/types';

const dateTimeFormatter = new Intl.DateTimeFormat('pl-PL', {
  dateStyle: 'medium',
  timeStyle: 'short',
});

const formatPrice = (amount: number, currency: string) =>
  new Intl.NumberFormat('pl-PL', { style: 'currency', currency }).format(amount);

export default function HistoryPage() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  const { data, isLoading, isError } = useQuery({
    queryKey: ['order-history'],
    queryFn: getOrderHistory,
  });

  if (isLoading) {
    return (
      <div>
        <h1 className="text-3xl font-bold mb-8">Historia zakupów</h1>
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="border rounded-lg p-6 space-y-3">
              <Skeleton className="h-5 w-1/3" />
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-20 w-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-16">
        <p className="text-destructive">Nie udało się załadować historii. Spróbuj ponownie.</p>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div>
        <h1 className="text-3xl font-bold mb-8">Historia zakupów</h1>
        <p className="text-muted-foreground text-center py-16">Brak zakupionych biletów.</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Historia zakupów</h1>
      <div className="space-y-4">
        {data.map((order) => (
          <OrderCard key={order.orderId} order={order} />
        ))}
      </div>
    </div>
  );
}

function OrderCard({ order }: { order: OrderHistoryResponse }) {
  return (
    <div className="border rounded-lg p-6 bg-card">
      <div className="flex flex-wrap items-start justify-between gap-2 mb-4">
        <div>
          <p className="text-sm text-muted-foreground">
            Zamówienie z {dateTimeFormatter.format(new Date(order.createdAt))}
          </p>
          <p className="font-semibold text-lg">{formatPrice(order.totalPrice, order.currency)}</p>
        </div>
        {order.refunded && (
          <span className="px-2 py-1 text-xs font-medium rounded bg-destructive/10 text-destructive">
            Zwrócono
          </span>
        )}
      </div>
      <div className="space-y-3">
        {order.tickets.map((ticket) => (
          <TicketRow key={ticket.ticketId} ticket={ticket} currency={order.currency} />
        ))}
      </div>
    </div>
  );
}

function TicketRow({
  ticket,
  currency,
}: {
  ticket: OrderHistoryTicketResponse;
  currency: string;
}) {
  return (
    <div className="border-t pt-3 flex flex-wrap items-start justify-between gap-2">
      <div className="space-y-1">
        <p className="font-medium">{ticket.movieTitle}</p>
        <p className="text-sm text-muted-foreground flex items-center gap-1">
          <Calendar className="h-3.5 w-3.5" />
          {dateTimeFormatter.format(new Date(ticket.screeningStart))}
        </p>
        <p className="text-sm text-muted-foreground flex items-center gap-1">
          <MapPin className="h-3.5 w-3.5" />
          {ticket.cinemaName} — {ticket.hallName}
        </p>
        <p className="text-sm text-muted-foreground flex items-center gap-1">
          <Ticket className="h-3.5 w-3.5" />
          Rząd {ticket.seatRow}, miejsce {ticket.seatNumber}
        </p>
      </div>
      <span className="text-sm font-medium whitespace-nowrap">
        {formatPrice(ticket.price, currency)}
      </span>
    </div>
  );
}
