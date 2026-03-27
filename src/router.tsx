import { createBrowserRouter } from 'react-router-dom';
import Layout from '@/components/Layout';
import HomePage from '@/pages/HomePage';
import MoviesPage from '@/pages/MoviesPage';
import ScreeningsPage from '@/pages/ScreeningsPage';
import SeatSelectionPage from '@/pages/SeatSelectionPage';
import CheckoutPage from '@/pages/CheckoutPage';
import ConfirmationPage from '@/pages/ConfirmationPage';
import LoginPage from '@/pages/LoginPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'movies', element: <MoviesPage /> },
      { path: 'screenings', element: <ScreeningsPage /> },
      { path: 'screening/:screeningId', element: <SeatSelectionPage /> },
      { path: 'checkout', element: <CheckoutPage /> },
      { path: 'confirmation', element: <ConfirmationPage /> },
      { path: 'login', element: <LoginPage /> },
    ],
  },
]);
