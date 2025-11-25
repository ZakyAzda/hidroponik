'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, Wrench, Sprout, GraduationCap, MessageCircle, ShieldCheck, Clock, Star } from 'lucide-react';
import BookingModal from './BookingModal';

// Helper Style (Hanya untuk Fitur & Warna, Gambar cuma buat fallback)
const getServiceStyle = (name: string) => {
  const lowerName = name.toLowerCase();
  
  // Default: Konsultasi
  let style = { 
      fallbackImage: "https://images.unsplash.com/photo-1591857177580-dc82b9bf4e1d?q=80&w=1200&auto=format&fit=crop",
      features: ["Analisis Mendalam", "Rekomendasi Nutrisi", "Penanganan Hama", "Monitoring Berkala"] 
  };

  if (lowerName.includes('instalasi') || lowerName.includes('greenhouse')) {
    style = { 
        fallbackImage: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?q=80&w=1200&auto=format&fit=crop",
        features: ["Survey Lokasi Gratis", "Desain Custom 3D", "Garansi Konstruksi 6 Bulan", "Free Bibit Awal", "Instalasi Irigasi Otomatis"] 
    };
  } else if (lowerName.includes('pelatihan') || lowerName.includes('workshop')) {
    style = { 
        fallbackImage: "https://images.unsplash.com/photo-1524486361537-8ad15938f1a3?q=80&w=1200&auto=format&fit=crop",
        features: ["Modul Materi Lengkap", "Sertifikat Resmi", "Makan Siang & Snack", "Praktek Langsung di Kebun", "Grup Diskusi Alumni"] 
    };
  }

  return style;
};

export default function ServiceDetailClient({ service }: { service: any }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const style = getServiceStyle(service.name);

  // --- PERBAIKAN UTAMA DI SINI ---
  // Prioritaskan gambar dari database. Jika null, pakai fallback.
  const displayImage = service.imageUrl ? service.imageUrl : style.fallbackImage;

  return (
    <div className="min-h-screen bg-white pb-20">
      
      {/* --- HERO IMAGE (FULL WIDTH) --- */}
      <div className="relative h-[50vh] w-full bg-gray-100">
        <Image 
          src={displayImage} // <--- Pakai variable displayImage
          alt={service.name}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
        
        {/* Tombol Back */}
        <Link href="/jasa" className="absolute top-28 left-6 md:left-10 z-20 flex items-center gap-2 text-white/90 hover:text-white bg-black/20 hover:bg-black/40 backdrop-blur-sm px-4 py-2 rounded-full transition-all border border-white/10">
           <ArrowLeft size={18} /> Kembali
        </Link>

        {/* Title */}
        <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 text-white z-10 container mx-auto max-w-6xl">
          <span className={`px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider mb-4 inline-block bg-white/20 backdrop-blur-md`}>
            Layanan Profesional
          </span>
          <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-2 drop-shadow-md">{service.name}</h1>
          <div className="flex items-center gap-6 text-sm md:text-base text-gray-200">
             <div className="flex items-center gap-2"><ShieldCheck size={18} className="text-green-400"/> Garansi Layanan</div>
             <div className="flex items-center gap-2"><Star size={18} className="text-yellow-400"/> 4.9/5 Rating</div>
          </div>
        </div>
      </div>

      {/* --- CONTENT --- */}
      <div className="container mx-auto max-w-6xl px-6 py-12 -mt-10 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Kiri: Deskripsi */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Tentang Layanan Ini</h2>
              <p className="text-gray-600 leading-loose whitespace-pre-line text-lg">
                {service.description || "Deskripsi lengkap mengenai layanan ini belum tersedia. Silakan hubungi admin untuk informasi lebih lanjut."}
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold text-gray-800 mb-6">Apa yang Anda Dapatkan?</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {style.features.map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-4 rounded-xl bg-[#F4FFF8] border border-green-100">
                    <CheckCircle2 className="text-[#3E8467] mt-0.5 flex-shrink-0" size={20} />
                    <span className="text-gray-700 font-medium">{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Kanan: Pricing Card */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-200 rounded-2xl shadow-xl p-6 sticky top-28">
              <p className="text-gray-500 text-sm mb-1 font-medium uppercase tracking-wider">Estimasi Biaya</p>
              <div className="flex items-end gap-2 mb-6">
                <h3 className="text-3xl font-extrabold text-[#3E8467]">
                  Rp {new Intl.NumberFormat('id-ID').format(service.price)}
                </h3>
                <span className="text-gray-400 text-sm mb-1">/ paket</span>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                   <Clock size={18} className="text-blue-500" />
                   <span>Respon cepat (08:00 - 17:00 WIB)</span>
                </div>

                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="w-full py-4 bg-gradient-to-r from-[#3E8467] to-[#2F5E4D] hover:from-[#2F5E4D] hover:to-[#1e3d32] text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 active:scale-95 transform"
                >
                  <MessageCircle size={20} /> Booking Sekarang
                </button>
                
                <p className="text-[11px] text-gray-400 text-center leading-relaxed px-2">
                  *Harga dapat disesuaikan tergantung luas lahan, lokasi, dan kebutuhan spesifik Anda saat diskusi.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Modal */}
      <BookingModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        serviceName={service.name}
        price={service.price}
      />

    </div>
  );
}