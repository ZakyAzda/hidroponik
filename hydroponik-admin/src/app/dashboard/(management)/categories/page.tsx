'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CategoriesRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    // Otomatis alihkan ke tab pertama (Kategori Produk)
    router.replace('/dashboard/categories/products');
  }, [router]);

  // Tampilan sementara saat proses redirect
  return (
    <div className="flex h-full items-center justify-center min-h-[50vh]">
      <p className="text-gray-500 text-sm">Mengarahkan ke kategori produk...</p>
    </div>
  );
}