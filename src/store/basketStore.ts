import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { PricingType } from '@/api/types';

export interface ReservationItem {
  reservationId: string;
  screeningId: string;
  seatId: string;
  pricingType: PricingType;
  screeningTitle: string;
  seatLabel: string;
}

export interface ScreeningBasket {
  basketId: string;
  reservations: ReservationItem[];
}

interface BasketState {
  baskets: Record<string, ScreeningBasket>;
  setBasket: (screeningId: string, basketId: string) => void;
  clearScreeningBasket: (screeningId: string) => void;
  addReservation: (reservation: ReservationItem) => void;
  updatePricingType: (reservationId: string, pricingType: PricingType) => void;
}

export const useBasketStore = create<BasketState>()(
  persist(
    (set) => ({
      baskets: {},

      setBasket: (screeningId, basketId) =>
        set((state) => ({
          baskets: {
            ...state.baskets,
            [screeningId]: {
              basketId,
              reservations: [],
            },
          },
        })),

      clearScreeningBasket: (screeningId) =>
        set((state) => {
          const { [screeningId]: _removed, ...rest } = state.baskets;
          return { baskets: rest };
        }),

      addReservation: (reservation) =>
        set((state) => {
          const existing = state.baskets[reservation.screeningId];
          if (!existing) return state;
          return {
            baskets: {
              ...state.baskets,
              [reservation.screeningId]: {
                ...existing,
                reservations: [...existing.reservations, reservation],
              },
            },
          };
        }),

      updatePricingType: (reservationId, pricingType) =>
        set((state) => {
          const baskets = { ...state.baskets };
          for (const sid in baskets) {
            const basket = baskets[sid];
            if (basket.reservations.some((r) => r.reservationId === reservationId)) {
              baskets[sid] = {
                ...basket,
                reservations: basket.reservations.map((r) =>
                  r.reservationId === reservationId ? { ...r, pricingType } : r,
                ),
              };
              break;
            }
          }
          return { baskets };
        }),
    }),
    { name: 'cinema-basket' },
  ),
);
