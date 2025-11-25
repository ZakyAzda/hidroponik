'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/app/lib/useCartStore';
import { X, Minus, Plus, ArrowRight, Loader2 } from 'lucide-react';

interface QuickBuyModalProps {
  product: any;
  isOpen: boolean;
  onClose: () => void;
}

export default function QuickBuyModal({ product, isOpen, onClose }: QuickBuyModalProps) {
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen || !product) return null;

  const handleQuantity = (type: 'inc' | 'dec') => {
    if (type === 'dec' && quantity > 1) setQuantity(q => q - 1);
    if (type === 'inc') setQuantity(q => q + 1);
  };

  const handleConfirmOrder = () => {
    setIsLoading(true);
    
    // 1. Masukkan barang ke keranjang (Dengan jumlah yang dipilih)
    // Kita loop addItem karena fungsi addItem store kamu logic-nya nambah 1 per 1
    // Atau kita bisa update store kamu biar support quantity langsung (tapi ini cara aman tanpa ubah store):
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: product.id,
        name: product.name,
        price: Number(product.price),
        imageUrl: product.imageUrl,
      });
    }

    // 2. Delay dikit biar kerasa loading, lalu lempar ke Checkout
    setTimeout(() => {
      setIsLoading(false);
      onClose(); // Tutup modal
      router.push('/checkout'); // Langsung gas ke checkout
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>

      {/* Modal Content */}
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative z-10 overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-100 bg-[#F4FFF8]">
          <h3 className="font-bold text-gray-800">Pembelian Langsung</h3>
          <button onClick={onClose} className="p-1 hover:bg-red-100 hover:text-red-500 rounded-full transition-all">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <div className="flex gap-4 mb-6">
            <div className="w-20 h-20 bg-gray-100 rounded-xl overflow-hidden relative border flex-shrink-0">
               {product.imageUrl && <Image src={product.imageUrl} alt={product.name} fill className="object-cover" />}
            </div>
            <div>
               <h4 className="font-bold text-gray-800 line-clamp-2">{product.name}</h4>
               <p className="text-[#3E8467] font-bold mt-1">
                 Rp {new Intl.NumberFormat('id-ID').format(product.price)}
               </p>
            </div>
          </div>

          {/* Atur Jumlah */}
          <div className="flex justify-between items-center mb-6 p-4 bg-gray-50 rounded-xl border border-gray-100">
             <span className="text-sm font-semibold text-gray-600">Jumlah Beli</span>
             <div className="flex items-center bg-white rounded-lg border border-gray-200 shadow-sm">
                <button onClick={() => handleQuantity('dec')} className="p-2 hover:bg-gray-100 text-gray-600 rounded-l-lg"><Minus size={16}/></button>
                <span className="w-10 text-center font-bold text-gray-800">{quantity}</span>
                <button onClick={() => handleQuantity('inc')} className="p-2 hover:bg-gray-100 text-gray-600 rounded-r-lg"><Plus size={16}/></button>
             </div>
          </div>

          {/* Total Preview */}
          <div className="flex justify-between items-center mb-6 text-sm">
             <span className="text-gray-500">Subtotal:</span>
             <span className="font-bold text-lg text-[#3E8467]">
               Rp {new Intl.NumberFormat('id-ID').format(product.price * quantity)}
             </span>
          </div>

          {/* Tombol Aksi */}
          <button 
            onClick={handleConfirmOrder}
            disabled={isLoading}
            className="w-full py-3.5 bg-[#3E8467] hover:bg-[#2F5E4D] text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95"
          >
            {isLoading ? <Loader2 className="animate-spin" /> : (
              <>Lanjut ke Pembayaran <ArrowRight size={18}/></>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}