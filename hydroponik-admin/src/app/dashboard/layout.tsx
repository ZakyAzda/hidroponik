'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const userDataString = localStorage.getItem('user_data');

    // 1. Cek Login
    if (!token || !userDataString) {
      router.push('/login'); // Tendang ke login
      return;
    }

    // 2. Cek Role
    const user = JSON.parse(userDataString);
    if (user.role !== 'ADMIN') {
      // Kalau login tapi bukan Admin
      alert("Akses Ditolak. Halaman ini khusus Admin.");
      router.push('/'); // Tendang ke Home
      return;
    }

    // 3. Lolos Seleksi
    setIsAuthorized(true);
  }, [router]);

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="w-10 h-10 text-[#70B398] animate-spin" />
          <p className="text-gray-500 text-sm">Memverifikasi akses admin...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
       {/* Sidebar Admin Anda (Jika ada) */}
       {/* ... <Sidebar /> ... */}
       
       <main className="flex-1 overflow-y-auto">
         {children}
       </main>
    </div>
  );
}