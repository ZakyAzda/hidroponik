'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore'; // Pastikan path ini benar
import { Loader2 } from 'lucide-react';

const withAuth = (WrappedComponent: React.ComponentType<any>) => {
  const AuthenticatedComponent = (props: any) => {
    const router = useRouter();
    const [isVerified, setIsVerified] = useState(false);
    
    // Ambil data dari Store
    const token = useAuthStore((state) => state.token);
    const user = useAuthStore((state) => state.user);
    const setToken = useAuthStore((state) => state.setToken);
    const setUser = useAuthStore((state) => state.setUser);

    useEffect(() => {
      const checkAuth = () => {
        // 1. Cek State (Zustand) - Jika sudah ada di memori
        if (token && user) {
          if (user.role !== 'ADMIN') {
            router.replace('/'); // Bukan Admin? Tendang ke Home
          } else {
            setIsVerified(true); // Lolos
          }
          return;
        }

        // 2. Cek LocalStorage (Jika user me-refresh halaman)
        const storedToken = localStorage.getItem('access_token');
        const storedUser = localStorage.getItem('user_data');

        if (!storedToken || !storedUser) {
          router.replace('/login'); // Tidak ada data login? Ke halaman login
          return;
        }

        try {
          // Coba parsing data user
          const parsedUser = JSON.parse(storedUser);
          
          if (parsedUser.role !== 'ADMIN') {
            router.replace('/');
          } else {
            // Restore data ke Zustand Store agar aplikasi tahu user sedang login
            setToken(storedToken);
            setUser(parsedUser);
            setIsVerified(true);
          }
        } catch (error) {
          // Jika data di localStorage rusak (JSON error), bersihkan dan suruh login ulang
          console.error("Data login korup:", error);
          localStorage.removeItem('access_token');
          localStorage.removeItem('user_data');
          router.replace('/login');
        }
      };

      checkAuth();
    }, [token, user, router, setToken, setUser]);

    // Tampilan Loading saat verifikasi
    if (!isVerified) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="w-10 h-10 text-gray-400 animate-spin" />
            <p className="text-gray-500 text-sm">Memverifikasi akses...</p>
          </div>
        </div>
      );
    }

    // Jika lolos verifikasi, render halaman aslinya
    return <WrappedComponent {...props} />;
  };

  return AuthenticatedComponent;
};

export default withAuth;