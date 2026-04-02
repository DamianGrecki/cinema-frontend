import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  token: string | null;
  email: string | null;
  setAuth: (token: string, email: string) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      email: null,

      setAuth: (token, email) => {
        localStorage.setItem('cinema_token', token);
        set({ token, email });
      },

      logout: () => {
        localStorage.removeItem('cinema_token');
        set({ token: null, email: null });
      },

      isAuthenticated: () => get().token !== null,
    }),
    {
      name: 'cinema-auth',
      partialize: (state) => ({ token: state.token, email: state.email }),
      onRehydrateStorage: () => {
        return (rehydratedState: AuthState | undefined) => {
          if (rehydratedState?.token) {
            localStorage.setItem('cinema_token', rehydratedState.token);
          }
        };
      },
    },
  ),
);
