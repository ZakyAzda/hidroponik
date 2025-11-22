'use client';

import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

const Navbar = () => {
  const [isSticky, setSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setSticky(true);
      } else {
        setSticky(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    // Outer Wrapper: Posisi Fixed agar melayang, tapi layout tetap diam
    <header className="fixed top-0 left-0 right-0 z-50 py-4 px-4 md:px-6">
      
      {/* Navbar Container (Si Kapsul Hijau) */}
      <div className={cn(
        // 1. BASE STYLE (Selalu Aktif):
        // - Gradient Hijau Solid (from-[#CDEEDA] to-[#D5F2E3])
        // - Tidak ada opacity, tidak ada blur.
        "mx-auto container bg-gradient-to-r from-[#CDEEDA] to-[#D5F2E3] rounded-full p-4 flex justify-between items-center border border-[#70B398]/20",
        
        // 2. ANIMASI TRANSISI:
        "transition-all duration-500 ease-in-out",

        // 3. LOGIKA SCROLL:
        
      
        isSticky 
          ? "shadow-2xl shadow-[#70B398]/30"  // Saat scroll: Shadow lebih tebal
          : "shadow-lg hover:shadow-xl"       // Saat diam: Shadow biasa
      )}>
        
        {/* Logo Section */}
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="relative">
            <div className="absolute inset-0 bg-[#70B398]/20 rounded-full blur-md group-hover:blur-lg transition-all duration-300"></div>
            <Image 
              src="/images/logo.png" 
              alt="Logo" 
              width={56} 
              height={56} 
            />
          </div>
          <div className="flex flex-col">
            <span className="text-gray-900 text-xl font-bold tracking-tight leading-none group-hover:text-[#70B398] transition-colors duration-300" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Arif Hidrofarm
            </span>
            <span className="text-xs text-gray-600 font-medium tracking-wide" style={{ fontFamily: "'Inter', sans-serif" }}>
              Hidroponik Berkualitas
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center space-x-2">
          <Link 
            href="/" 
            className="relative text-gray-900 text-sm font-semibold px-5 py-2.5 rounded-full bg-white shadow-sm hover:shadow-md hover:bg-[#70B398] hover:text-white transition-all duration-300 group"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            <span className="relative z-10">Beranda</span>
          </Link>
          <Link 
            href="/produk" 
            className="text-gray-800 text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-white/60 hover:text-[#70B398] transition-all duration-300"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Produk
          </Link>
          <Link 
            href="/tentang-kami" 
            className="text-gray-800 text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-white/60 hover:text-[#70B398] transition-all duration-300"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Tentang Kami
          </Link>
          <Link 
            href="/artikel" 
            className="text-gray-800 text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-white/60 hover:text-[#70B398] transition-all duration-300"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Artikel & Tips
          </Link>
          <Link 
            href="/review" 
            className="text-gray-800 text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-white/60 hover:text-[#70B398] transition-all duration-300"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Review
          </Link>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center space-x-3">
          {/* Search Icon */}
          <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-[#70B398] hover:text-white transition-all duration-300 shadow-sm hover:shadow-md group">
            <svg className="w-5 h-5 text-gray-700 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
          
          {/* Notification Icon */}
          <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-[#70B398] hover:text-white transition-all duration-300 shadow-sm hover:shadow-md group relative">
            <svg className="w-5 h-5 text-gray-700 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
          </button>
          
          {/* Login Button */}
          <Link 
            href="/login" 
            className="bg-gradient-to-r from-[#70B398] to-[#5fa085] text-white text-sm font-semibold px-6 py-2.5 rounded-full hover:shadow-lg hover:scale-105 transition-all duration-300 shadow-md"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Masuk
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;