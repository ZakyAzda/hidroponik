'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function BookingsRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    // Arahkan otomatis ke halaman pertama, yaitu booking instalasi
    router.replace('/dashboard/services/training');
  }, [router]);

  // Tampilkan pesan loading sementara redirect terjadi
  return <p>Mengalihkan ke halaman booking...</p>;
}