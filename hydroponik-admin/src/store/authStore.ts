import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface AuthState {
  token: string | null;
  user: { id: number; email: string; role: string } | null;
  setToken: (token: string | null) => void;
  setUser: (user: { id: number; email: string; role: string } | null) => void;
  logout: () => void;
}

export const useAuthStore = create(
  persist<AuthState>(
    (set) => ({
      token: null,
      user: null,
      setToken: (token) => set({ token }),
      setUser: (user) => set({ user }),
      logout: () => set({ token: null, user: null }),
    }),
    {
      name: 'auth-storage', // Nama item di localStorage
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ token: state.token }), // Hanya simpan 'token' ke localStorage
    }
  )
);
