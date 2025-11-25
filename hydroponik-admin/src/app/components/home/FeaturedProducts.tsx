import React from 'react';
import Link from 'next/link';
import { Reveal } from '@/components/ui/Reveal';
// IMPOR PRODUCT CARD BARU YANG KITA BUAT
import ProductCard from '@/app/components/products/ProductCard';

async function getProducts() {
  try {
    const res = await fetch('http://localhost:3000/products', { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch products');
    return res.json();
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

const FeaturedProducts = async () => {
  const products = await getProducts();
  const featured = products.slice(0, 4); // Ambil 4 produk terbaru

  return (
    <section className="relative bg-[#F4FFF8] py-20 px-6 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/40 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
      
      <div className="container mx-auto max-w-7xl relative z-10">
        
        {/* Header */}
        <Reveal>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
            <div className="space-y-2">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800 flex items-center gap-3">
                <span className="animate-bounce inline-block">🌾</span>
                <span className="bg-gradient-to-r from-[#3E8467] to-[#70B398] bg-clip-text text-transparent">
                  Produk Unggulan
                </span>
              </h2>
              <p className="text-gray-500 text-sm md:text-base">Pilihan terbaik untuk kebutuhan pertanian Anda</p>
            </div>
            
            <Link 
              href="/produk" 
              className="group flex items-center space-x-2 text-gray-600 font-semibold hover:text-[#70B398] transition-colors duration-300"
            >
              <span>Lihat Semua Produk</span>
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:bg-[#70B398] group-hover:text-white transition-all duration-300">
                <svg className="w-4 h-4 group-hover:-rotate-45 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </div>
            </Link>
          </div>
        </Reveal>
        
        {/* Grid Produk */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {featured.map((product: any, index: number) => (
            <Reveal key={product.id} delay={index * 150}>
              {/* PANGGIL PRODUCT CARD BARU DISINI */}
              {/* Kita kirim object product utuh */}
              <ProductCard product={product} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;