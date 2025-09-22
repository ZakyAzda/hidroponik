// src/components/withAuth.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const withAuth = (WrappedComponent: React.ComponentType) => {
  const Wrapper = (props: any) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      const token = localStorage.getItem('access_token');
      if (!token) {
        router.replace('/'); // Redirect ke halaman login jika tidak ada token
      } else {
        setIsLoading(false); // Token ada, tampilkan halaman
      }
    }, [router]);

    if (isLoading) {
      return <p>Loading...</p>; // Tampilkan loading saat pengecekan
    }

    return <WrappedComponent {...props} />;
  };

  return Wrapper;
};

export default withAuth;