import { create } from 'zustand';

interface User {
  name: string;
  email: string;
  role: string;
}

// 1. KITA DEFINISIKAN TIPE DATANYA DISINI
interface AuthState {
  token: string | null;
  user: User | null;
  isLoginOpen: boolean;
  
  setToken: (token: string | null) => void;
  setUser: (user: User | null) => void;
  openLogin: () => void;
  closeLogin: () => void;
  
  // --- TAMBAHAN PENTING: Definisikan tipe logout ---
  logout: () => void; 
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  isLoginOpen: false,

  setToken: (token) => set({ token }),
  setUser: (user) => set({ user }),
  
  openLogin: () => set({ isLoginOpen: true }),
  closeLogin: () => set({ isLoginOpen: false }),

  // 2. KITA BUAT LOGIKA LOGOUT DISINI
  logout: () => {
    // Hapus data dari penyimpanan browser
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_data');
    
    // Kosongkan state di aplikasi
    set({ token: null, user: null });
    
    // Refresh halaman agar bersih total
    window.location.reload();
  }
}));