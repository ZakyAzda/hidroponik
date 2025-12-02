'use client';

import React, { useState } from 'react';
import { Reveal } from '@/components/ui/Reveal';
// Sesuaikan path import ProductCard dan QuickBuyModal
import ProductCard from '@/app/components/products/ProductCard'; 
import QuickBuyModal from '@/components/products/QuickBuyModal';

export default function FeaturedProductsList({ products }: { products: any[] }) {
  // State untuk Modal
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isQuickBuyOpen, setIsQuickBuyOpen] = useState(false);

  // Handler buka modal
  const handleOpenQuickBuy = (product: any) => {
    setSelectedProduct(product);
    setIsQuickBuyOpen(true);
  };

  return (
    <>
      {/* GRID PRODUK */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {products.map((product: any, index: number) => (
          <Reveal key={product.id} delay={index * 150}>
            
            {/* KITA PASANG onOrderClick DISINI */}
            <ProductCard 
              product={product} 
              onOrderClick={handleOpenQuickBuy} // <--- Ini kuncinya!
            />

          </Reveal>
        ))}
      </div>

      {/* POPUP MODAL (Hanya muncul jika dipanggil) */}
      <QuickBuyModal 
        product={selectedProduct}
        isOpen={isQuickBuyOpen}
        onClose={() => setIsQuickBuyOpen(false)}
      />
    </>
  );
}