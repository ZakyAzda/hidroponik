import React from 'react';
import { notFound } from 'next/navigation';
import ServiceDetailClient from '@/app/components/services/ServiceDetailClient'; // Pastikan path ini benar

// Fungsi untuk mengambil detail jasa berdasarkan ID dari Backend
async function getService(id: string) {
  try {
    const res = await fetch(`http://localhost:3000/services/${id}`, { 
      cache: 'no-store' // Agar data selalu fresh
    });
    
    if (!res.ok) return null;
    
    return res.json();
  } catch (error) {
    console.error("Gagal ambil detail jasa:", error);
    return null;
  }
}

// Halaman Server Component
export default async function ServiceDetailPage({ params }: { params: { id: string } }) {
  // Ambil data service
  const service = await getService(params.id);

  // Jika jasa tidak ditemukan di database, tampilkan 404
  if (!service) {
    return notFound();
  }

  // Render komponen Client (yang ada gambar besar & tombol bookingnya)
  return (
    <div className="pt-20"> {/* Padding agar tidak ketutup navbar */}
      <ServiceDetailClient service={service} />
    </div>
  );
}