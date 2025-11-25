import React from 'react';
import ServiceListClient from '@/app/components/services/ServiceListClient'; // Pastikan path ini benar

// Fungsi Fetch Data dari Backend
async function getServices() {
  try {
    // Pastikan backend NestJS jalan di port ini
    const res = await fetch('http://localhost:3000/services', { 
      cache: 'no-store' // Agar data selalu update
    });
    
    if (!res.ok) {
      console.error(`[FETCH ERROR] Status: ${res.status}`);
      throw new Error('Failed to fetch services');
    }
    
    const data = await res.json();
    
    // DIAGNOSIS: Cek di Terminal VS Code apakah data muncul
    console.log("✅ Data Services fetched:", data); 
    
    return data;
  } catch (error) {
    console.error('Error fetching services:', error);
    return []; // Kembalikan array kosong jika error, jangan crash
  }
}

export const metadata = {
  title: 'Layanan & Jasa - Arif Hidrofarm',
  description: 'Jasa instalasi greenhouse, konsultasi hidroponik, dan pelatihan pertanian modern.',
};

export default async function ServicesPage() {
  const services = await getServices();
  
  return (
    <div className="pt-20"> {/* Padding top agar tidak tertutup Navbar */}
      <ServiceListClient initialServices={services} />
    </div>
  );
}