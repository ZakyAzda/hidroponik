'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ProductsRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    // Langsung arahkan ke halaman 'alat' saat komponen ini dimuat
    router.replace('/dashboard/products/alat');
  }, [router]);

  // Tampilkan pesan loading sementara proses redirect berjalan
  return <p>Mengarahkan ke manajemen produk...</p>;
}
