// Enums
export type PricingType = 'NORMAL' | 'REDUCED';
export type PresentationType = 'ORIGINAL' | 'ORIGINAL_WITH_SUBTITLES' | 'DUBBED';
export type AudioLanguage = 'Angielski' | 'Polski';
export type PaymentProvider = 'PAYU' | 'PAYPAL' | 'STRIPE' | 'SANDBOX';

// Requests
export interface UpdateReservationPricingTypeRequest {
  pricingType: PricingType;
}

export interface CreateTicketRequest {
  reservationId: string;
  pricingType: PricingType;
}

export interface AddReservationRequest {
  basketId: string;
  screeningId: string;
  seatId: string;
}

export interface CreatePaymentRequest {
  basketId: string;
  provider: PaymentProvider;
  customerId?: string;
  guestFirstName?: string;
  guestEmail?: string;
}

// Responses
export interface SuccessResponse {
  success: boolean;
}

export interface ReservationResponse {
  basketId: string;
  reservationId: string;
}

export interface BasketResponse {
  basketId: string;
}

export interface MovieResponse {
  id: string;
  title: string;
  description: string;
}

export interface MovieListResponse {
  movies: MovieResponse[];
}

export interface ScreeningResponse {
  id: string;
  cinemaHallName: string;
  movieTitle: string;
  movieFormat: string;
  presentationType: PresentationType;
  audioLanguage: AudioLanguage;
  startTime: string;
  endTime: string;
}

export interface ScreeningListResponse {
  screenings: ScreeningResponse[];
}

export interface SeatStatusDto {
  seatNumber: number;
  seatId: string;
  reserved: boolean;
}

export interface RowSeatsMapResponse {
  rowNumber: number;
  seats: SeatStatusDto[];
}
