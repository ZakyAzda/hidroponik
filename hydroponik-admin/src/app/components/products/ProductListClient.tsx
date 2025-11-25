'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useCartStore } from '@/app/lib/useCartStore';
import { useAuthStore } from '@/store/authStore';
import { Search, Filter, ArrowUpDown } from 'lucide-react';
// Pastikan path ini benar sesuai file yang kamu buat sebelumnya
import QuickBuyModal from '@/components/products/QuickBuyModal'; 

// Tipe Data Kategori
interface Category {
  id: number;
  name: string;
}

// --- KOMPONEN PRODUCT CARD ---
// Kita tambahkan props 'onOrderClick' agar bisa komunikasi dengan Modal
const ProductCard = ({ product, onOrderClick }: { product: any, onOrderClick: (p: any) => void }) => {
  const addItem = useCartStore((state) => state.addItem);
  const openLogin = useAuthStore((state) => state.openLogin);
  const [isAdding, setIsAdding] = useState(false);

  // 1. Fungsi untuk Icon Keranjang (Tetap Masuk Keranjang)
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('access_token');
    if (!token) { openLogin(); return; }

    setIsAdding(true);
    // Tambah ke keranjang tanpa dicentang (false)
    addItem({
      id: product.id,
      name: product.name,
      price: Number(product.price),
      imageUrl: product.imageUrl,
    }, false);

    setTimeout(() => setIsAdding(false), 500);
  };

  // 2. Fungsi Tombol Order (Buka Popup Quick Buy)
  const handleOrderClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('access_token');
    if (!token) { openLogin(); return; }

    // Panggil fungsi pembuka modal dari parent
    onOrderClick(product);
  };

  return (
    <div className="group bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 hover:border-[#70B398]">
      <div className="relative h-56 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-50">
        <img 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
          src={product.imageUrl || "https://placehold.co/400x400?text=No+Image"} 
          alt={product.name} 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Badge Kategori */}
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-[#3E8467] text-[10px] font-bold px-2 py-1 rounded-md shadow-sm">
          {product.category?.name || 'Umum'}
        </div>
      </div>
      
      <div className="p-5">
        <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-[#3E8467] transition-colors duration-300 line-clamp-1">
          {product.name}
        </h3>
        <p className="text-sm text-gray-500 mb-4 line-clamp-2 h-10 leading-relaxed">
          {product.description}
        </p>
        <div className="w-0 h-0.5 bg-gradient-to-r from-[#70B398] to-[#3E8467] group-hover:w-full transition-all duration-500 mb-4" />
        
        <div className="flex justify-between items-center pt-2">
          <div className="flex flex-col">
            <span className="text-xs text-gray-400 font-medium mb-0.5">Harga</span>
            <span className="text-xl font-bold text-[#3E8467] group-hover:scale-105 transition-transform duration-300 inline-block">
              Rp {new Intl.NumberFormat('id-ID').format(Number(product.price))}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            
            {/* Tombol Icon Keranjang (Add to Cart) */}
            <button 
              onClick={handleAddToCart}
              disabled={isAdding}
              className={`relative w-10 h-10 flex items-center justify-center rounded-lg border-2 transition-all duration-300 ${isAdding ? "bg-[#3E8467] border-[#3E8467] text-white scale-95" : "border-[#70B398] text-[#70B398] hover:bg-[#70B398] hover:text-white"}`}
            >
               {isAdding ? (
                 <svg className="w-5 h-5 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
               ) : (
                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
               )}
            </button>

            {/* Tombol Order (Buka Popup Quick Buy) */}
            <button 
              onClick={handleOrderClick} // <-- Menggunakan handler baru
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

// --- MAIN COMPONENT ---
const ProductListClient = ({ initialProducts }: { initialProducts: any[] }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('default');
  const [categories, setCategories] = useState<Category[]>([]);

  // STATE UNTUK MODAL QUICK BUY
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isQuickBuyOpen, setIsQuickBuyOpen] = useState(false);

  // Fetch Categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('http://localhost:3000/product-categories');
        if (res.ok) {
          const data = await res.json();
          setCategories(data);
        }
      } catch (error) { console.error("Gagal ambil kategori:", error); }
    };
    fetchCategories();
  }, []);

  // Filter Logic
  const filteredProducts = useMemo(() => {
    let filtered = Array.isArray(initialProducts) ? initialProducts : [];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(q) || product.description?.toLowerCase().includes(q)
      );
    }
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category?.name === selectedCategory);
    }
    if (sortBy === 'price-low') filtered.sort((a, b) => Number(a.price) - Number(b.price));
    else if (sortBy === 'price-high') filtered.sort((a, b) => Number(b.price) - Number(a.price));
    else if (sortBy === 'name') filtered.sort((a, b) => a.name.localeCompare(b.name));
    return filtered;
  }, [initialProducts, searchQuery, selectedCategory, sortBy]);

  // HANDLER MEMBUKA MODAL
  const handleOpenQuickBuy = (product: any) => {
    setSelectedProduct(product);
    setIsQuickBuyOpen(true);
  };

  return (
    <section className="relative bg-[#F4FFF8] py-20 px-6 min-h-screen overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#70B398]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#3E8467]/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
      
      <div className="container mx-auto max-w-7xl relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="space-y-2">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 flex items-center gap-3">
              <span className="animate-bounce inline-block">🌾</span>
              <span className="bg-gradient-to-r from-[#3E8467] to-[#70B398] bg-clip-text text-transparent">Semua Produk</span>
            </h2>
            <p className="text-gray-500 text-sm md:text-base">Temukan kebutuhan hidroponik terbaik Anda di sini</p>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-10 flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full group">
             <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><Search className="h-5 w-5 text-gray-400 group-focus-within:text-[#70B398] transition-colors" /></div>
             <input type="text" placeholder="Cari produk..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-12 pr-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-[#70B398] focus:ring-4 focus:ring-[#70B398]/10 outline-none transition-all text-gray-700 placeholder-gray-400 shadow-sm"/>
          </div>
          <div className="relative w-full md:w-auto min-w-[200px]">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Filter className="h-4 w-4 text-gray-500" /></div>
            <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="w-full pl-10 pr-8 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-[#70B398] outline-none appearance-none cursor-pointer text-sm font-medium text-gray-700 shadow-sm">
              <option value="all">Semua Kategori</option>
              {categories.map((cat) => (<option key={cat.id} value={cat.name}>{cat.name}</option>))}
            </select>
          </div>
          <div className="relative w-full md:w-auto min-w-[200px]">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><ArrowUpDown className="h-4 w-4 text-gray-500" /></div>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="w-full pl-10 pr-8 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-[#70B398] outline-none appearance-none cursor-pointer text-sm font-medium text-gray-700 shadow-sm">
              <option value="default">Urutkan: Default</option>
              <option value="price-low">Harga: Terendah</option>
              <option value="price-high">Harga: Tertinggi</option>
              <option value="name">Nama: A - Z</option>
            </select>
          </div>
        </div>

        {/* Grid Produk */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredProducts.map((product: any, index: number) => (
              <div key={product.id} className="animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-forwards" style={{ animationDelay: `${index * 100}ms` }}>
                
                {/* PASANG PRODUCT CARD DENGAN HANDLER */}
                <ProductCard 
                  product={product} 
                  onOrderClick={handleOpenQuickBuy} 
                />

              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-white/60 backdrop-blur-sm rounded-3xl border-2 border-dashed border-gray-200">
            <Search className="text-gray-400 w-16 h-16 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700">Produk tidak ditemukan</h3>
            <button onClick={() => {setSearchQuery(''); setSelectedCategory('all');}} className="mt-6 text-[#3E8467] font-semibold hover:underline">Reset Filter</button>
          </div>
        )}
      </div>

      {/* MODAL QUICK BUY */}
      <QuickBuyModal 
        product={selectedProduct}
        isOpen={isQuickBuyOpen}
        onClose={() => setIsQuickBuyOpen(false)}
      />
    </section>
  );
};

export default ProductListClient;