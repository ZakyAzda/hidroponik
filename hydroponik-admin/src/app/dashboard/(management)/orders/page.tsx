// src/app/dashboard/(management)/orders/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function OrdersRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    // Arahkan otomatis ke halaman pertama, yaitu pesanan alat
    router.replace('/dashboard/orders/alat');
  }, [router]);

  // Tampilkan pesan loading sementara redirect terjadi
  return (
    <div className="flex h-full items-center justify-center">
      <p className="text-gray-600">Mengalihkan ke halaman pesanan...</p>
    </div>
  );
}