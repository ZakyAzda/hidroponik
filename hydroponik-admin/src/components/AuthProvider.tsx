'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import api from '@/app/lib/api';

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { token, user, setUser, logout } = useAuthStore();

  useEffect(() => {
    const checkUser = async () => {
      // Hanya jalankan jika ada token tapi tidak ada data user
      if (token && !user) {
        try {
          const response = await api.get('/auth/profile');
          setUser(response.data);
        } catch (error) {
          // Jika token tidak valid, logout
          console.error('Sesi tidak valid, melakukan logout.');
          logout();
        }
      }
    };

    checkUser();
  }, [token, user, setUser, logout]);

  return <>{children}</>;
};

export default AuthProvider;
