// src/components/withAuth.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';

const withAuth = (WrappedComponent: React.ComponentType) => {
  const Wrapper = (props: any) => {
    const router = useRouter();
    const { token, user, logout } = useAuthStore();
    
    // Tampilkan loading jika ada token tapi data user belum terisi
    const isLoading = !user && !!token;

    useEffect(() => {
      // Jika tidak ada token sama sekali, tendang ke login
      if (!token) {
        router.replace('/');
        return;
      }

      // Jika data user sudah ada, periksa perannya
      if (user && user.role !== 'ADMIN') {
        alert('Akses ditolak. Anda bukan admin.');
        logout(); // Hapus sesi yang tidak valid
        router.replace('/'); // Tendang ke login
      }
    }, [token, user, router, logout]);

    // Selama proses fetch user, tampilkan loading
    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="w-8 h-8 border-4 border-gray-300 border-t-gray-800 rounded-full animate-spin"></div>
        </div>
      );
    }

    // Jika semua pemeriksaan lolos (ada user dan rolenya ADMIN), tampilkan halaman
    if (user && user.role === 'ADMIN') {
      return <WrappedComponent {...props} />;
    }

    // Fallback jika terjadi kondisi aneh (misal: tidak ada token)
    return null;
  };

  return Wrapper;
};

export default withAuth;