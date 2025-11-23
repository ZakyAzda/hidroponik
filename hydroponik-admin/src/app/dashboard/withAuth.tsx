'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore'; // Pastikan path ini benar
import { Loader2 } from 'lucide-react';

// Definisi HOC (Higher-Order Component)
const withAuth = (WrappedComponent: React.ComponentType<any>) => {
  const AuthenticatedComponent = (props: any) => {
    const router = useRouter();
    const [isVerified, setIsVerified] = useState(false);
    
    // Ambil data dari Store
    const token = useAuthStore((state) => state.token);
    const user = useAuthStore((state) => state.user);
    
    // Ambil fungsi setToken/setUser untuk re-hydrate jika perlu
    const setToken = useAuthStore((state) => state.setToken);
    const setUser = useAuthStore((state) => state.setUser);

    useEffect(() => {
      // 1. Cek State Zustand dulu
      if (token && user) {
        if (user.role !== 'ADMIN') {
          router.push('/'); // Login tapi bukan admin
        } else {
          setIsVerified(true); // Sukses
        }
        return;
      }

      // 2. Jika State kosong (misal di-refresh), cek LocalStorage
      const storedToken = localStorage.getItem('access_token');
      const storedUser = localStorage.getItem('user_data');

      if (!storedToken || !storedUser) {
        router.push('/login'); // Tidak ada data login
      } else {
        // Restore data ke Zustand
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser.role !== 'ADMIN') {
          router.push('/'); // Bukan admin
        } else {
          setToken(storedToken);
          setUser(parsedUser);
          setIsVerified(true);
        }
      }
    }, [token, user, router, setToken, setUser]);

    // Tampilkan Loading selama verifikasi
    if (!isVerified) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="w-10 h-10 text-gray-400 animate-spin" />
            <p className="text-gray-500 text-sm">Memverifikasi akses...</p>
          </div>
        </div>
      );
    }

    // Jika lolos, tampilkan komponen asli
    return <WrappedComponent {...props} />;
  };

  return AuthenticatedComponent;
};

// --- INI YANG TADI KURANG (EXPORT DEFAULT) ---
export default withAuth;