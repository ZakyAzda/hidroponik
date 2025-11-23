import { create } from 'zustand';

interface User {
  name: string;
  email: string;
  role: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  isLoginOpen: boolean; // <--- STATE BARU (Saklar Popup)
  setToken: (token: string | null) => void;
  setUser: (user: User | null) => void;
  openLogin: () => void; // <--- FUNGSI BUKA
  closeLogin: () => void; // <--- FUNGSI TUTUP
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  isLoginOpen: false, // Default tertutup

  setToken: (token) => set({ token }),
  setUser: (user) => set({ user }),
  
  openLogin: () => set({ isLoginOpen: true }),
  closeLogin: () => set({ isLoginOpen: false }),
}));