'use client';

import React, { useState } from 'react';
// Import ProductCard & Modal
import ProductCard from '@/app/components/products/ProductCard'; 
import QuickBuyModal from '@/components/products/QuickBuyModal';

export default function ProductCarousel({ products }: { products: any[] }) {
  // State untuk Modal
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isQuickBuyOpen, setIsQuickBuyOpen] = useState(false);
  const [isPaused, setIsPaused] = useState(false); // Biar bisa pause saat di-hover

  const handleOpenQuickBuy = (product: any) => {
    setSelectedProduct(product);
    setIsQuickBuyOpen(true);
    setIsPaused(true); // Pause slider saat modal buka
  };

  const handleCloseModal = () => {
    setIsQuickBuyOpen(false);
    setIsPaused(false); // Resume slider
  };

  // Gandakan produk biar loop-nya mulus (teknik Marquee)
  // Kita duplikat list produknya jadi [A,B,C,D, ..., A,B,C,D]
  const carouselItems = [...products, ...products];

  return (
    <>
      <div 
        className="relative w-full overflow-hidden py-4"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Gradient Masking Kiri Kanan (Biar efek fade in/out) */}
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#F4FFF8] to-transparent z-10 pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#F4FFF8] to-transparent z-10 pointer-events-none"></div>

        {/* Track yang bergerak */}
        <div 
          className="flex gap-6 w-max animate-scroll hover:cursor-grab active:cursor-grabbing"
          style={{ 
            animationPlayState: isPaused ? 'paused' : 'running',
            // Kecepatan animasi: makin besar angkanya makin pelan (40s is good)
            animationDuration: `${products.length * 5}s` 
          }}
        >
          {carouselItems.map((product, index) => (
            <div 
              key={`${product.id}-${index}`} 
              className="w-[280px] flex-shrink-0 transform transition-transform hover:scale-105 duration-300"
            >
              {/* Panggil ProductCard Asli */}
              <ProductCard 
                product={product} 
                onOrderClick={handleOpenQuickBuy} 
              />
            </div>
          ))}
        </div>
      </div>

      {/* Popup Modal (Tetap Ada) */}
      <QuickBuyModal 
        product={selectedProduct}
        isOpen={isQuickBuyOpen}
        onClose={handleCloseModal}
      />

      {/* CSS Animasi Langsung Disini */}
      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            /* Geser sejauh 50% (karena kita duplikat itemnya 2x) */
            transform: translateX(-50%);
          }
        }
        .animate-scroll {
          animation: scroll linear infinite;
        }
      `}</style>
    </>
  );
}