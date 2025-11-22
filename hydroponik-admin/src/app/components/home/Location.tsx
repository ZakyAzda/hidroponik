/* eslint-disable @next/next/no-img-element */
import React from 'react';
import Link from 'next/link';
import { Reveal } from '@/components/ui/Reveal';

const Location = () => {
  return (
    <section className="bg-[#F4FFF8] py-24 px-6">
      <div className="container mx-auto max-w-6xl">

        {/* Header Section */}
        <Reveal>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block py-1 px-3 rounded-full bg-[#E8F5E9] text-xs font-bold text-[#3E8467] uppercase tracking-wider mb-4 border border-[#C8E6C9]">
              Lokasi Kami
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-gray-800 leading-tight">
              Temukan Kami di <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3E8467] to-[#70B398]">
                 Kota Padang
              </span>
            </h2>
          </div>
        </Reveal>

        {/* Main Card Container */}
        <Reveal delay={200}>
          <div className="bg-white rounded-[2.5rem] shadow-xl overflow-hidden border border-gray-100">
            <div className="grid lg:grid-cols-12 min-h-[500px]">

              {/* Left Column: Detail Info (Mengambil 5 dari 12 kolom) */}
              <div className="lg:col-span-5 p-8 md:p-12 flex flex-col justify-center relative overflow-hidden">
                {/* Dekorasi Background tipis */}
                <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-[#70B398]/10 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-48 h-48 rounded-full bg-[#3E8467]/10 blur-3xl"></div>

                <div className="relative z-10">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="p-3 bg-[#E8F5E9] rounded-2xl text-[#3E8467]">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800">Alamat Studio</h3>
                  </div>

                  <div className="space-y-4 text-gray-600 leading-relaxed pl-2 border-l-2 border-[#70B398]/30">
                    <p className="font-medium text-gray-900">Jln Bawah Buluh,</p>
                    <p>Kecamatan Pauh, Kota Padang,</p>
                    <p>Sumatera Barat, Indonesia 25147</p>
                  </div>

                  <div className="mt-10">
                     <Link
                      href="https://maps.google.com" 
                      target="_blank"
                      className="group flex items-center justify-center gap-3 bg-[#3E8467] hover:bg-[#2d634d] text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-[#3E8467]/40 hover:-translate-y-1"
                    >
                      <span>Buka Google Maps</span>
                      <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                    </Link>
                    <p className="text-center text-gray-400 text-xs mt-4">
                      Klik tombol untuk navigasi langsung
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column: Map (Mengambil 7 dari 12 kolom) */}
              <div className="lg:col-span-7 relative h-80 lg:h-auto">
                 {/* PENTING: 
                    1. Hapus width="600" dan height="450"
                    2. Gunakan className w-full h-full
                    3. Tambahkan grayscale-0 atau filter lain jika ingin estetik
                 */}
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d997.3200081204709!2d100.39498104170617!3d-0.9411812055791651!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2fd4b90036dd9f07%3A0xfd4303582809c3d3!2sArif%20Hidroponik!5e0!3m2!1sid!2sid!4v1763816441341!5m2!1sid!2sid"
                  className="absolute inset-0 w-full h-full object-cover"
                  style={{ border: 0 }}
                  allowFullScreen 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
                
                {/* Overlay Gradient agar transisi peta ke border halus */}
                <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_40px_rgba(0,0,0,0.1)]"></div>
              </div>

            </div>
          </div>
        </Reveal>

      </div>
    </section>
  );
};

export default Location;