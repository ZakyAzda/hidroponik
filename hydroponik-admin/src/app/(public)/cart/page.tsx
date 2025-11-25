'use client';

import React, { useEffect, useState } from 'react';
import { useCartStore } from '@/app/lib/useCartStore';
import { useAuthStore } from '@/store/authStore';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, CheckSquare, Square } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function CartPage() {
  const router = useRouter();
  
  // Ambil fungsi deselectAllItems
  const { items, removeItem, addItem, decreaseItem, toggleItem, totalPrice, deselectAllItems } = useCartStore();
  const { user, openLogin } = useAuthStore();
  
  const [mounted, setMounted] = useState(false);

  // --- PERUBAHAN UTAMA DI SINI ---
  useEffect(() => {
    setMounted(true);
    
    // Reset semua centang saat halaman keranjang dibuka
    // Jadi barang sisa 'Buy Now' yang gagal checkout tidak akan otomatis tercentang
    deselectAllItems(); 
    
  }, []); // Array kosong = Jalan sekali saat halaman dimuat

  const handleToCheckout = () => {
    if (!user) {
      openLogin();
      return;
    }

    const selectedItems = items.filter(i => i.selected);
    if (selectedItems.length === 0) {
      alert("Pilih minimal 1 barang untuk lanjut.");
      return;
    }

    router.push('/checkout');
  };

  if (!mounted) return <div className="min-h-screen bg-[#F4FFF8]"></div>;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#F4FFF8] pt-32 pb-20 px-6 flex flex-col items-center justify-center text-center">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 animate-bounce">
           <ShoppingBag size={40} className="text-[#3E8467] opacity-50" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Keranjang Belanja Kosong</h2>
        <p className="text-gray-500 mb-8">Wah, sepertinya kamu belum memilih produk apapun.</p>
        <Link href="/produk" className="bg-[#3E8467] text-white px-8 py-3 rounded-full font-bold hover:bg-[#2F5E4D] transition-all shadow-lg hover:shadow-xl hover:-translate-y-1">
          Mulai Belanja
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4FFF8] pt-32 pb-20 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-3">
          <ShoppingBag className="text-[#3E8467]" /> Keranjang Belanja
        </h1>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* --- KIRI: LIST ITEM --- */}
          <div className="flex-1 space-y-4">
            {items.map((item) => (
              <div 
                key={item.id} 
                className={`p-4 rounded-2xl shadow-sm border flex gap-4 items-center transition-all duration-300 ${item.selected ? 'bg-white border-green-200 shadow-md' : 'bg-gray-50 border-gray-100 opacity-70'}`}
              >
                
                {/* Checkbox */}
                <button onClick={() => toggleItem(item.id)} className="text-[#3E8467] hover:scale-110 transition-transform">
                  {item.selected ? <CheckSquare size={24} fill="#3E8467" className="text-white" /> : <Square size={24} className="text-gray-400" />}
                </button>

                {/* Gambar */}
                <div className="w-20 h-20 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0 relative border border-gray-100">
                  {item.imageUrl && <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />}
                </div>
                
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-800 line-clamp-1">{item.name}</h3>
                  <p className="text-[#3E8467] font-semibold text-sm mt-1">
                    Rp {new Intl.NumberFormat('id-ID').format(item.price)}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex flex-col md:flex-row items-center gap-3">
                  <div className="flex items-center bg-gray-50 rounded-lg border border-gray-200 shadow-sm">
                    <button onClick={() => decreaseItem(item.id)} className="p-2 text-gray-500 hover:text-red-500 hover:bg-gray-100 rounded-l-lg transition-colors"><Minus size={14} /></button>
                    <span className="w-8 text-center text-sm font-bold text-gray-700">{item.quantity}</span>
                    <button onClick={() => addItem(item)} className="p-2 text-gray-500 hover:text-[#3E8467] hover:bg-gray-100 rounded-r-lg transition-colors"><Plus size={14} /></button>
                  </div>
                  <button onClick={() => removeItem(item.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all" title="Hapus Barang">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* --- KANAN: RINGKASAN --- */}
          <div className="w-full lg:w-[380px]">
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-[#3E8467]/10 sticky top-28">
              <h3 className="text-lg font-bold text-gray-800 mb-4 pb-4 border-b border-gray-100">Ringkasan Belanja</h3>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Total Barang ({items.filter(i => i.selected).length} terpilih)</span>
                  <span className="font-medium">Rp {new Intl.NumberFormat('id-ID').format(totalPrice())}</span>
                </div>
              </div>

              <div className="border-t border-dashed border-gray-200 pt-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-gray-800">Total Harga</span>
                  <span className="font-extrabold text-xl text-[#3E8467]">
                    Rp {new Intl.NumberFormat('id-ID').format(totalPrice())}
                  </span>
                </div>
              </div>

              <button 
                onClick={handleToCheckout}
                disabled={items.filter(i => i.selected).length === 0} 
                className="w-full py-3.5 bg-gradient-to-r from-[#3E8467] to-[#2F5E4D] text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
              >
                Lanjut ke Pembayaran <ArrowRight size={18} />
              </button>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}