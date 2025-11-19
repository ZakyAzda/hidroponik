import Link from 'next/link';
import React from 'react';

const Navbar = () => {
  return (
    <header className="bg-[#F4FFF8] py-4 px-6">
      <div className="container mx-auto bg-[#CDEEDA] rounded-[20px] p-2 flex justify-between items-center">
        <div className="text-black text-lg font-bold font-['Alkatra']">
          <Link href="/">🌿 arifhidrofarm</Link>
        </div>
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/" className="text-black text-sm font-semibold bg-[#F4FFF8] px-3 py-1 rounded-full">
            Beranda
          </Link>
          <Link href="/produk" className="text-black text-sm font-semibold">
            Produk
          </Link>
          <Link href="/tentang-kami" className="text-black text-sm font-semibold">
            Tentang Kami
          </Link>
          <Link href="/artikel" className="text-black text-sm font-semibold">
            Artikel&Tips
          </Link>
          <Link href="/review" className="text-black text-sm font-semibold">
            Review
          </Link>
        </nav>
        <div className="flex items-center space-x-4">
          {/* Placeholder for icons */}
          <div className="w-5 h-5 bg-black"></div>
          <div className="w-5 h-5 bg-black"></div>
          <Link href="/login" className="bg-[#70B398] text-white text-sm font-medium px-4 py-2 rounded-lg">
            Masuk
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
