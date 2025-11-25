'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Reveal } from '@/components/ui/Reveal';
import { CheckCircle2, ArrowRight, Wrench, Sprout, GraduationCap } from 'lucide-react';

// Tipe data dari Backend
interface ServiceFromDB {
  id: number;
  name: string;
  description: string | null;
  price: number;
  categoryId: number;
}

// Mapper Style (Sama seperti sebelumnya)
const getServiceStyle = (id: number, name: string) => {
  let style = {
    image: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?q=80&w=1000&auto=format&fit=crop",
    icon: <Sprout size={20} className="text-white" />,
    iconBg: "bg-green-500",
    features: ["Konsultasi Gratis", "Pelayanan Terbaik", "Harga Terjangkau"],
    link: `/jasa/${id}`
  };

  const lowerName = name.toLowerCase();

  if (lowerName.includes('instalasi') || lowerName.includes('greenhouse')) {
    style = {
      image: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?q=80&w=1000&auto=format&fit=crop",
      icon: <Wrench size={20} className="text-white" />,
      iconBg: "bg-blue-500",
      features: ["Gratis Survei Lokasi", "Desain Custom", "Garansi Instalasi 3 Bulan"],
      link: `/jasa/${id}`
    };
  } else if (lowerName.includes('konsultasi') || lowerName.includes('ahli')) {
    style = {
      image: "https://images.unsplash.com/photo-1591857177580-dc82b9bf4e1d?q=80&w=1000&auto=format&fit=crop",
      icon: <Sprout size={20} className="text-white" />,
      iconBg: "bg-green-500",
      features: ["Analisis Air & Nutrisi", "Penanganan Hama", "Rekomendasi Tanaman"],
      link: `/jasa/${id}`
    };
  } else if (lowerName.includes('pelatihan') || lowerName.includes('workshop')) {
    style = {
      image: "https://images.unsplash.com/photo-1524486361537-8ad15938f1a3?q=80&w=1000&auto=format&fit=crop",
      icon: <GraduationCap size={20} className="text-white" />,
      iconBg: "bg-purple-500",
      features: ["Modul Lengkap", "Praktek Langsung", "Sertifikat"],
      link: `/jasa/${id}`
    };
  }
  return style;
};

const Services = () => {
  const [services, setServices] = useState<ServiceFromDB[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch Data dari Backend
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch('http://localhost:3000/services');
        const data = await res.json();
        if (Array.isArray(data)) {
          setServices(data);
        }
      } catch (error) {
        console.error("Gagal mengambil data jasa:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  if (loading) return null;
  if (services.length === 0) return null;

  return (
    <section className="py-24 px-6 bg-[#F4FFF8] relative overflow-hidden">
      
      <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-30"></div>
      <div className="absolute top-20 right-0 w-64 h-64 bg-[#70B398]/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-0 w-64 h-64 bg-[#3E8467]/10 rounded-full blur-3xl"></div>

      <div className="container mx-auto max-w-7xl relative z-10">
        
        <Reveal>
          {/* --- BAGIAN HEADER DENGAN TOMBOL --- */}
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            
            <div className="max-w-2xl">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                Layanan <span className="text-[#3E8467]">Profesional</span> Kami
              </h2>
              <p className="text-gray-500">
                Solusi lengkap untuk membangun ekosistem pertanian modern Anda.
              </p>
            </div>

            {/* Tombol Lihat Semua Jasa */}
            <Link 
              href="/jasa" 
              className="group flex items-center space-x-2 text-gray-600 font-semibold hover:text-[#70B398] transition-colors duration-300 whitespace-nowrap"
            >
              <span>Lihat Semua Jasa</span>
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:bg-[#70B398] group-hover:text-white transition-all duration-300">
                <svg className="w-4 h-4 group-hover:-rotate-45 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </div>
            </Link>

          </div>
        </Reveal>

        {/* Grid Layanan */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.slice(0, 3).map((service, index) => {
            const style = getServiceStyle(service.id, service.name);

            return (
              <Reveal key={service.id} delay={index * 200}>
                <div className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-[#3E8467]/10 flex flex-col h-full hover:-translate-y-2">
                  
                  {/* Image Header */}
                  <div className="relative h-48 overflow-hidden">
                    <Image 
                      src={style.image} 
                      alt={service.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all"></div>
                    
                    <div className={`absolute -bottom-6 right-6 w-12 h-12 ${style.iconBg} rounded-xl flex items-center justify-center shadow-lg transform group-hover:rotate-12 transition-all duration-300 border-4 border-white`}>
                      {style.icon}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-8 pt-10 flex-grow flex flex-col">
                    <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-[#3E8467] transition-colors">
                      {service.name}
                    </h3>
                    <p className="text-sm text-gray-500 leading-relaxed mb-6 line-clamp-3">
                      {service.description || "Hubungi kami untuk detail lebih lanjut."}
                    </p>

                    <ul className="space-y-2 mb-8">
                      {style.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                          <CheckCircle2 size={16} className="text-[#3E8467] mt-0.5 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-auto flex items-center justify-between">
                      <div className="flex flex-col">
                         <span className="text-xs text-gray-400">Mulai dari</span>
                         <span className="font-bold text-[#3E8467]">
                           Rp {new Intl.NumberFormat('id-ID').format(service.price)}
                         </span>
                      </div>
                      <Link 
                        href={style.link} 
                        className="flex items-center gap-2 py-2 px-4 rounded-lg bg-gray-50 text-[#3E8467] font-semibold hover:bg-[#3E8467] hover:text-white transition-all duration-300 text-sm"
                      >
                        Detail <ArrowRight size={16} />
                      </Link>
                    </div>
                  </div>

                </div>
              </Reveal>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default Services;