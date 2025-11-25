'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { CheckCircle2, ArrowRight, Wrench, Sprout, GraduationCap, Tag } from 'lucide-react';

// Helper Style (Hanya untuk Icon & Background Badge & Fallback Image)
const getServiceStyle = (name: string = "") => {
  const lowerName = name.toLowerCase();
  
  // Default Style
  let style = {
    fallbackImage: "https://images.unsplash.com/photo-1591857177580-dc82b9bf4e1d?q=80&w=1000&auto=format&fit=crop",
    icon: <Sprout size={20} className="text-white" />,
    iconBg: "bg-green-500",
    features: ["Konsultasi Gratis", "Analisis Nutrisi", "Rekomendasi Tanaman"],
  };

  if (lowerName.includes('instalasi') || lowerName.includes('greenhouse')) {
    style = {
      fallbackImage: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?q=80&w=1000&auto=format&fit=crop",
      icon: <Wrench size={20} className="text-white" />,
      iconBg: "bg-blue-500",
      features: ["Gratis Survei Lokasi", "Desain Custom", "Garansi Instalasi 3 Bulan"],
    };
  } else if (lowerName.includes('pelatihan') || lowerName.includes('workshop')) {
    style = {
      fallbackImage: "https://images.unsplash.com/photo-1524486361537-8ad15938f1a3?q=80&w=1000&auto=format&fit=crop",
      icon: <GraduationCap size={20} className="text-white" />,
      iconBg: "bg-purple-500",
      features: ["Modul Lengkap", "Praktek Langsung", "Sertifikat Resmi"],
    };
  }
  return style;
};

const ServiceCard = ({ service }: { service: any }) => {
  if (!service) return null;

  const style = getServiceStyle(service.name);
  const categoryName = service.category?.name || "Layanan Profesional";

  // --- PERBAIKAN UTAMA DISINI ---
  // Prioritaskan gambar dari DB (service.imageUrl). Jika null/kosong, baru pakai fallback.
  const displayImage = service.imageUrl ? service.imageUrl : style.fallbackImage;

  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-[#3E8467]/10 flex flex-col h-full hover:-translate-y-2">
      
      {/* Image Header */}
      <div className="relative h-52 overflow-hidden bg-gray-100">
        <Image 
          src={displayImage} 
          alt={service.name || "Layanan"}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all"></div>
        
        {/* Icon Badge */}
        <div className={`absolute -bottom-6 right-6 w-12 h-12 ${style.iconBg} rounded-xl flex items-center justify-center shadow-lg transform group-hover:rotate-12 transition-all duration-300 border-4 border-white`}>
          {style.icon}
        </div>

        {/* Category Label */}
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-gray-600 flex items-center gap-1 shadow-sm">
          <Tag size={12} /> {categoryName}
        </div>
      </div>

      {/* Content */}
      <div className="p-8 pt-10 flex-grow flex flex-col">
        <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-[#3E8467] transition-colors line-clamp-2">
          {service.name}
        </h3>
        <p className="text-sm text-gray-500 leading-relaxed mb-6 line-clamp-3">
          {service.description || "Hubungi kami untuk informasi detail layanan ini."}
        </p>

        {/* Features List */}
        <ul className="space-y-2 mb-8">
          {style.features.map((feature, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
              <CheckCircle2 size={16} className="text-[#3E8467] mt-0.5 flex-shrink-0" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>

        {/* Footer */}
        <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
          <div className="flex flex-col">
             <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Mulai Dari</span>
             <span className="text-lg font-bold text-[#3E8467]">
               Rp {new Intl.NumberFormat('id-ID').format(Number(service.price))}
             </span>
          </div>
          
          <Link 
            href={`/jasa/${service.id}`} 
            className="flex items-center gap-2 py-2 px-4 rounded-lg bg-[#F4FFF8] text-[#3E8467] font-semibold hover:bg-[#3E8467] hover:text-white transition-all duration-300 text-sm group-hover:shadow-md"
          >
            Detail <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;