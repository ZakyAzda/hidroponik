// src/components/withAuth.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuthStore } from '../../store/authStore';

const withAuth = (WrappedComponent: React.ComponentType) => {
  const Wrapper = (props: any) => {
    const router = useRouter();
    const { token, user, logout } = useAuthStore();
    const [isClient, setIsClient] = useState(false);

    // Set isClient menjadi true setelah komponen di-mount di browser.
    useEffect(() => {
      setIsClient(true);
    }, []);

    useEffect(() => {
      // Jangan jalankan logika apa pun jika kita belum di klien.
      if (!isClient) {
        return;
      }

      // Jika tidak ada token setelah di klien, arahkan ke login.
      if (!token) {
        router.replace('/');
        return;
      }

      // Jika user sudah ada tapi bukan admin, tolak akses.
      if (user && user.role !== 'ADMIN') {
        alert('Akses ditolak. Anda bukan admin.');
        logout();
        router.replace('/');
      }
    }, [isClient, token, user, router, logout]);

    // Di server, atau di klien sebelum useEffect berjalan, render null.
    // Ini memastikan render server dan render klien awal identik.
    if (!isClient) {
      return null;
    }

    // Setelah di klien, tentukan apakah perlu menampilkan loading.
    const isLoading = !user && !!token;

    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="w-8 h-8 border-4 border-gray-300 border-t-gray-800 rounded-full animate-spin"></div>
        </div>
      );
    }

    // Jika semua pemeriksaan lolos, tampilkan komponen yang sebenarnya.
    if (user && user.role === 'ADMIN') {
      return <WrappedComponent {...props} />;
    }

    // Fallback jika terjadi redirect atau kondisi lain.
    return null;
  };

  return Wrapper;
};

export default withAuth;