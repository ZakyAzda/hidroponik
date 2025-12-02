'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useCartStore } from '@/app/lib/useCartStore'; 
import { useAuthStore } from '@/store/authStore'; 
import { useRouter } from 'next/navigation';

interface ProductCardProps {
  product: any;
  // --- PERBAIKAN: TANDA TANYA (?) AGAR OPTIONAL ---
  onOrderClick?: (product: any) => void; 
}

const ProductCard = ({ product, onOrderClick }: ProductCardProps) => {
  const router = useRouter();
  // Sekarang buyNow sudah ada di store, jadi tidak akan error lagi
  const { addItem, buyNow } = useCartStore(); 
  const openLogin = useAuthStore((state) => state.openLogin);
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('access_token');
    if (!token) { openLogin(); return; }

    setIsAdding(true);
    addItem({
      id: product.id,
      name: product.name,
      price: Number(product.price),
      imageUrl: product.imageUrl,
    }, false);

    setTimeout(() => setIsAdding(false), 500);
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('access_token');
    if (!token) { openLogin(); return; }

    // Cek apakah parent memberikan fungsi buka popup?
    if (onOrderClick) {
      onOrderClick(product); // Buka Popup (Hanya di Halaman Produk)
    } else {
      // Jika di Landing Page (tidak ada popup), langsung beli 1 biji
      buyNow({
        id: product.id,
        name: product.name,
        price: Number(product.price),
        imageUrl: product.imageUrl,
      }, 1);
      router.push('/checkout');
    }
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
            <button 
              onClick={handleBuyNow} 
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

export default ProductCard;