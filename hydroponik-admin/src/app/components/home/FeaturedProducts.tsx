import React from 'react';
import Link from 'next/link';
import { Reveal } from '@/components/ui/Reveal';
import { ArrowRight, AlertCircle } from 'lucide-react';
// Import Komponen Client Baru Kita
import FeaturedProductsList from './FeaturedProductsList';
import ProductCarousel from '@/app/components/home/ProductCarousel';

// Fungsi Fetch Data (Server Side)
async function getProducts() {
  try {
    const res = await fetch('http://localhost:3000/products', { 
      cache: 'no-store',
      next: { revalidate: 0 }
    });

    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    return [];
  }
}

const FeaturedProducts = async () => {
  const products = await getProducts();
  
  // Ambil 15 produk terbaru
  const featured = Array.isArray(products) ? products: [];

  return (
     <section className="relative bg-transparent py-20 px-6 overflow-hidden">
      
      {/* Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#70B398]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#3E8467]/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
      
      <div className="container mx-auto max-w-7xl relative z-10">
        
        {/* Header Section */}
        <Reveal>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
            <div className="space-y-2">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800 flex items-center gap-3">
                <span className="animate-bounce inline-block">🌾</span>
                <span className="bg-gradient-to-r from-[#3E8467] to-[#70B398] bg-clip-text text-transparent">
                  Produk Unggulan
                </span>
              </h2>
              <p className="text-gray-500 text-sm md:text-base">Pilih sayuran, buah, dan kebutuhan untuk budidaya hidroponik Anda</p>
            </div>
            
            <Link 
              href="/produk" 
              className="group flex items-center gap-2 text-gray-600 font-semibold hover:text-[#70B398] transition-colors duration-300"
            >
              <span>Lihat Semua</span>
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:bg-[#70B398] group-hover:text-white transition-all duration-300">
                <ArrowRight size={16} className="group-hover:-rotate-45 transition-transform" />
              </div>
            </Link>
          </div>
        </Reveal>
        
        {/* CONTENT GRID (Panggil Komponen Client) */}
        {featured.length > 0 ? (
          // Kita kirim data produk ke komponen Client agar bisa di-klik
          <ProductCarousel products={featured} />
        ) : (
          <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-2xl bg-white/50">
            <AlertCircle className="w-10 h-10 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500">Belum ada produk unggulan.</p>
          </div>
        )}
        
      </div>
    </section>
  );
};

export default FeaturedProducts;