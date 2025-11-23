'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation'; // 1. Untuk Redirect
import { useCartStore } from '@/app/lib/useCartStore';

// --- Komponen Kartu Produk ---
const ProductCard = ({ product }: { product: any }) => {
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);
  
  // State untuk efek animasi tombol saat diklik
  const [isAdding, setIsAdding] = useState(false);

  // Fungsi Handle Click
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Mencegah perilaku default jika dibungkus Link

    // --- 1. CEK LOGIN (AUTH GUARD) ---
    const token = localStorage.getItem('access_token'); // Sesuaikan key dengan login page Anda
    if (!token) {
      // Jika tidak ada token, lempar ke login
      router.push('/login');
      return;
    }

    // --- 2. ANIMASI BUTTON (FEEDBACK) ---
    setIsAdding(true); // Ubah state jadi "sedang menambahkan"
    
    // Masukkan ke Store (Tanpa Alert)
    addItem({
      id: product.id,
      name: product.name,
      price: Number(product.price),
      imageUrl: product.imageUrl,
    });

    // Reset tombol setelah 0.5 detik
    setTimeout(() => {
      setIsAdding(false);
    }, 500);
  };

  return (
    <div className="group bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 hover:border-[#70B398]">
      {/* Image Section */}
      <div className="relative h-56 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-50">
        <img 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
          src={product.imageUrl} 
          alt={product.name} 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Badge Unggulan (Tetap di sini) */}
        <div className="absolute top-3 left-3 bg-[#70B398] text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transform -translate-x-4 group-hover:translate-x-0 transition-all duration-500">
          Unggulan
        </div>
      </div>
      
      <div className="p-5">
        <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-[#3E8467] transition-colors duration-300">
          {product.name}
        </h3>
        <p className="text-sm text-gray-500 mb-4 line-clamp-2 h-10 leading-relaxed">
          {product.description}
        </p>
        <div className="w-0 h-0.5 bg-gradient-to-r from-[#70B398] to-[#3E8467] group-hover:w-full transition-all duration-500 mb-4" />
        
        {/* --- BAGIAN HARGA & TOMBOL --- */}
        <div className="flex justify-between items-center pt-2">
          <div className="flex flex-col">
            <span className="text-xs text-gray-400 font-medium mb-0.5">Harga</span>
            <span className="text-xl font-bold text-[#3E8467] group-hover:scale-105 transition-transform duration-300 inline-block">
              Rp {new Intl.NumberFormat('id-ID').format(Number(product.price))}
            </span>
          </div>
          
          {/* CONTAINER DUA TOMBOL (Keranjang & Order) */}
          <div className="flex items-center gap-2">
            
            {/* 1. TOMBOL KERANJANG (ICON SAJA) */}
            <button 
              onClick={handleAddToCart}
              disabled={isAdding}
              className={`
                relative w-10 h-10 flex items-center justify-center rounded-lg border-2 transition-all duration-300
                ${isAdding 
                  ? "bg-[#3E8467] border-[#3E8467] text-white scale-95" // Style saat sukses
                  : "border-[#70B398] text-[#70B398] hover:bg-[#70B398] hover:text-white" // Style normal
                }
              `}
              title="Tambah ke Keranjang"
            >
               {isAdding ? (
                 // Ikon Centang (Saat berhasil)
                 <svg className="w-5 h-5 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
               ) : (
                 // Ikon Keranjang (Normal)
                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
               )}
            </button>

            {/* 2. TOMBOL ORDER (TEXT) */}
            <button 
              onClick={handleAddToCart} // Logic sama, cek login dulu
              className="bg-[#70B398] text-white text-sm font-semibold px-4 py-2.5 rounded-lg hover:bg-[#5fa085] hover:shadow-lg transition-all duration-300 active:scale-95"
            >
              Order
            </button>

          </div>
        </div>
      </div>
    </div>
  );
};

// --- Komponen Utama Client (Tidak Berubah Banyak) ---
const ProductListClient = ({ initialProducts }: { initialProducts: any[] }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('default');
  
  const filteredProducts = useMemo(() => {
    let filtered = Array.isArray(initialProducts) ? initialProducts : [];
    
    if (searchQuery.trim()) {
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (sortBy === 'price-low') {
      filtered = [...filtered].sort((a, b) => Number(a.price) - Number(b.price));
    } else if (sortBy === 'price-high') {
      filtered = [...filtered].sort((a, b) => Number(b.price) - Number(a.price));
    } else if (sortBy === 'name') {
      filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name));
    }
    
    return filtered;
  }, [initialProducts, searchQuery, sortBy]);

  return (
    <section className="relative bg-[#F4FFF8] py-20 px-6 overflow-hidden">
      {/* Dekorasi Background */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#70B398]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#3E8467]/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
      
      <div className="container mx-auto max-w-7xl relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="space-y-2">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 flex items-center gap-3">
              <span className="animate-bounce inline-block">🌾</span>
              <span className="bg-gradient-to-r from-[#3E8467] to-[#70B398] bg-clip-text text-transparent">
                Semua Produk
              </span>
            </h2>
            <p className="text-gray-500 text-sm md:text-base">Temukan kebutuhan hidroponik terbaik Anda di sini</p>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="mb-8 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
             <input
              type="text"
              placeholder="Cari produk..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-4 pr-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-[#70B398] outline-none"
            />
          </div>
          <select
             value={sortBy}
             onChange={(e) => setSortBy(e.target.value)}
             className="appearance-none w-full md:w-64 px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-[#70B398] outline-none"
           >
             <option value="default">Urutkan: Default</option>
             <option value="name">Urutkan: Nama (A-Z)</option>
             <option value="price-low">Urutkan: Harga Terendah</option>
             <option value="price-high">Urutkan: Harga Tertinggi</option>
           </select>
        </div>

        {/* Grid Produk */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredProducts.map((product: any) => (
              <ProductCard 
                key={product.id}
                product={product} 
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-gray-50 rounded-2xl">
            <h3 className="text-xl font-semibold text-gray-700">Produk tidak ditemukan</h3>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductListClient;