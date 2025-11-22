/* eslint-disable @next/next/no-img-element */
import React from 'react';
import Link from 'next/link';
// Import komponen Reveal yang baru kita buat
import { Reveal } from '@/components/ui/Reveal'; // Sesuaikan path-nya jika beda

// ... (Kode ProductCard TETAP SAMA seperti sebelumnya, tidak perlu diubah) ...
const ProductCard = ({ name, description, price, imageUrl }: { name: string, description: string, price: string, imageUrl: string }) => (
  <div className="group bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 hover:border-[#70B398]">
     {/* ... Isi ProductCard sama persis ... */}
     <div className="relative h-56 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-50">
      <img 
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
        src={imageUrl} 
        alt={name} 
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="absolute top-3 right-3 bg-[#70B398] text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-500">
        Unggulan
      </div>
    </div>
    <div className="p-5">
      <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-[#3E8467] transition-colors duration-300">
        {name}
      </h3>
      <p className="text-sm text-gray-500 mb-4 line-clamp-2 h-10 leading-relaxed">
        {description}
      </p>
      <div className="w-0 h-0.5 bg-gradient-to-r from-[#70B398] to-[#3E8467] group-hover:w-full transition-all duration-500 mb-4" />
      <div className="flex justify-between items-center pt-2">
        <div className="flex flex-col">
          <span className="text-xs text-gray-400 font-medium mb-0.5">Harga</span>
          <span className="text-xl font-bold text-[#3E8467] group-hover:scale-105 transition-transform duration-300 inline-block">
            Rp {new Intl.NumberFormat('id-ID').format(Number(price))}
          </span>
        </div>
        <button className="relative bg-[#70B398] text-white text-sm font-semibold px-6 py-2.5 rounded-lg overflow-hidden transition-all duration-300 hover:bg-[#5fa085] hover:shadow-lg hover:scale-105 active:scale-95">
          <span className="relative z-10">Order</span>
          <div className="absolute inset-0 bg-white/20 transform -skew-x-12 translate-x-full group-hover:translate-x-0 transition-transform duration-700" />
        </button>
      </div>
    </div>
  </div>
);

// ... (Fungsi getProducts TETAP SAMA) ...
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
  const featured = products.slice(0, 4);

  return (
    <section className="relative bg-[#F4FFF8] py-20 px-6 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/40 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
      
      <div className="container mx-auto max-w-7xl relative z-10">
        
        {/* Header Section Wrapped in Reveal */}
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
              href="/kategori" 
              className="group relative bg-[#70B398] text-white text-sm font-semibold px-6 py-3 rounded-lg overflow-hidden transition-all duration-300 hover:bg-[#5fa085] hover:shadow-xl hover:scale-105 active:scale-95"
            >
              <span className="relative z-10 flex items-center gap-2">
                Kategori
                <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">›</span>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            </Link>
          </div>
        </Reveal>
        
        {/* Products Grid with Staggered Reveal Animation */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {featured.map((product: any, index: number) => (
            // PERUBAHAN DISINI:
            // Kita bungkus ProductCard dengan komponen <Reveal>
            // Kita kirim props 'delay' agar muncul bergantian (staggered)
            <Reveal key={product.id} delay={index * 150}>
              <ProductCard 
                name={product.name}
                description={product.description}
                price={product.price}
                imageUrl={product.imageUrl}
              />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;