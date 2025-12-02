'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Package, ShoppingBag, Loader2, CheckCircle, Star } from 'lucide-react';
import Image from 'next/image';
// IMPORT REVIEW MODAL
import ReviewModal from '@/app/components/reviews/ReviewModal'; 

declare global {
  interface Window { snap: any; }
}

interface Order {
  id: number;
  status: string;
  totalAmount: number;
  createdAt: string;
  items: {
    id: number;
    quantity: number;
    price: number;
    // Update: Kita butuh ID produk untuk cek review
    product: { id: number; name: string; imageUrl: string | null; };
  }[];
}

export default function ProfileOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [orderTab, setOrderTab] = useState('ALL');
  const [isLoading, setIsLoading] = useState(false);
  const [isPaying, setIsPaying] = useState<number | null>(null);

  // STATE UNTUK MODAL REVIEW
  const [reviewProduct, setReviewProduct] = useState<any>(null);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  
  // STATE UNTUK MELACAK PRODUK YG SUDAH DI-REVIEW (LOKAL)
  // Format: orderId-productId
  const [reviewedItems, setReviewedItems] = useState<string[]>([]);

  useEffect(() => { fetchOrders(); }, []);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('access_token');
      const res = await axios.get('http://localhost:3000/orders', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(res.data);
    } catch (err) { console.error(err); } 
    finally { setIsLoading(false); }
  };

  const handleRepay = async (orderId: number) => {
    setIsPaying(orderId);
    try {
      const token = localStorage.getItem('access_token');
      const res = await axios.post(`http://localhost:3000/orders/${orderId}/pay`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const midtransToken = res.data.midtransToken;

      if (window.snap && midtransToken) {
        window.snap.pay(midtransToken, {
          onSuccess: () => { alert("Pembayaran Berhasil!"); fetchOrders(); },
          onPending: () => { alert("Menunggu pembayaran..."); fetchOrders(); },
          onError: () => alert("Pembayaran Gagal!"),
        });
      } else {
        alert("Gagal memuat sistem pembayaran.");
      }
    } catch (error: any) {
      alert(error.response?.data?.message || "Gagal memproses pembayaran.");
    } finally {
      setIsPaying(null);
    }
  };

  // Handler Buka Modal Review
  const handleOpenReview = (product: any, orderId: number) => {
    // Kita tambahkan orderId ke object product sementara biar tau ini review utk order yg mana
    setReviewProduct({ ...product, orderId });
    setIsReviewOpen(true);
  };

  // Handler Saat Review Sukses Dikirim
  const handleReviewSuccess = () => {
    if (reviewProduct) {
        const key = `${reviewProduct.orderId}-${reviewProduct.id}`;
        setReviewedItems(prev => [...prev, key]); // Tandai sudah direview
        setIsReviewOpen(false);
    }
  };

  const filteredOrders = orders.filter((order) => orderTab === 'ALL' || order.status === orderTab);
  
  const orderTabs = [
    { id: 'ALL', label: 'Semua' },
    { id: 'PENDING', label: 'Belum Bayar' },
    { id: 'PROCESSING', label: 'Dikemas' },
    { id: 'SHIPPED', label: 'Dikirim' },
    { id: 'COMPLETED', label: 'Selesai' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'PROCESSING': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'SHIPPED': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'COMPLETED': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
      {/* Tab Navigasi */}
      <div className="flex border-b border-gray-100 overflow-x-auto mb-6 scrollbar-hide">
        {orderTabs.map((tab) => (
          <button 
            key={tab.id} 
            onClick={() => setOrderTab(tab.id)} 
            className={`flex-1 py-4 text-sm font-medium px-4 transition-colors relative whitespace-nowrap ${orderTab === tab.id ? 'text-[#3E8467]' : 'text-gray-500 hover:text-[#3E8467]'}`}
          >
            {tab.label}
            {orderTab === tab.id && <div className="absolute bottom-0 left-0 w-full h-1 bg-[#3E8467] rounded-t-full"></div>}
          </button>
        ))}
      </div>

      {/* List Order */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center py-10 text-gray-400 flex flex-col items-center">
            <Loader2 className="animate-spin mb-2" /> Memuat...
          </div>
        ) : filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <div key={order.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                
                {/* Header Order */}
                <div className="flex flex-wrap justify-between items-center p-4 border-b border-gray-50 bg-[#F4FFF8]/50 gap-2">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <ShoppingBag size={14} /> 
                    <span className="font-bold text-gray-700">Order #{order.id}</span>
                    <span className="hidden sm:inline">•</span> 
                    <span className="hidden sm:inline">{new Date(order.createdAt).toLocaleDateString('id-ID')}</span>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold border uppercase ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>

                {/* Body Order (Items) */}
                <div className="p-4 space-y-4">
                  {order.items.map((item) => {
                    // Cek apakah item ini sudah direview (secara lokal)
                    const isReviewed = reviewedItems.includes(`${order.id}-${item.product.id}`);

                    return (
                      <div key={item.id} className="flex gap-4 relative items-start">
                        {/* Gambar */}
                        <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 relative border border-gray-100">
                          {item.product.imageUrl && <Image src={item.product.imageUrl} alt={item.product.name} fill className="object-cover" />}
                        </div>
                        
                        {/* Detail */}
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-bold text-gray-800 line-clamp-1">{item.product.name}</h4>
                          <div className="flex justify-between mt-1">
                            <p className="text-xs text-gray-500">x{item.quantity}</p>
                            <p className="text-sm text-gray-600">Rp {new Intl.NumberFormat('id-ID').format(item.price)}</p>
                          </div>
                        </div>

                        {/* Tombol Nilai (HANYA JIKA COMPLETED & BELUM REVIEW) */}
                        {order.status === 'COMPLETED' && !isReviewed && (
                          <div className="self-center sm:self-end">
                             <button 
                               onClick={() => handleOpenReview(item.product, order.id)}
                               className="text-xs flex items-center gap-1 bg-yellow-50 text-yellow-700 border border-yellow-200 px-3 py-1.5 rounded-full font-bold hover:bg-yellow-100 transition-all shadow-sm"
                             >
                               <Star size={12} fill="currentColor" /> Nilai
                             </button>
                          </div>
                        )}
                        
                        {/* Tanda Sudah Review */}
                        {order.status === 'COMPLETED' && isReviewed && (
                           <div className="self-center sm:self-end">
                             <span className="text-xs text-green-600 font-medium flex items-center gap-1">
                               <CheckCircle size={12} /> Dinilai
                             </span>
                           </div>
                        )}

                      </div>
                    );
                  })}
                </div>
                
                {/* Footer Order */}
                <div className="p-4 border-t border-gray-50 flex justify-between items-center bg-gray-50/30">
                    <div className="text-xs text-gray-400 hidden sm:block">
                      Total Pembayaran
                    </div>
                    <div className="text-right">
                        <p className="text-lg font-bold text-[#3E8467]">Rp {new Intl.NumberFormat('id-ID').format(order.totalAmount)}</p>
                    </div>
                </div>
                
                {/* Tombol Bayar (Pending Only) */}
                {order.status === 'PENDING' && (
                  <div className="px-4 pb-4 flex justify-end gap-2">
                    <button 
                      onClick={() => handleRepay(order.id)}
                      disabled={isPaying === order.id}
                      className="px-4 py-2 bg-[#3E8467] text-white text-xs font-bold rounded-lg hover:bg-[#2F5E4D] transition-all flex items-center gap-2"
                    >
                      {isPaying === order.id ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Bayar Sekarang'}
                    </button>
                  </div>
                )}
            </div>
          ))
        ) : (
            // Empty State
            <div className="flex flex-col items-center justify-center py-16 text-center bg-white rounded-xl border border-gray-100">
                <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-4"><Package size={40} className="text-gray-300" /></div>
                <h3 className="text-gray-800 font-bold">Belum ada pesanan</h3>
                <p className="text-gray-500 text-xs mt-1">Di tab ini kosong.</p>
            </div>
        )}
      </div>

      {/* --- MODAL REVIEW --- */}
      {reviewProduct && (
         <ReviewModal 
           isOpen={isReviewOpen}
           onClose={() => setIsReviewOpen(false)}
           product={reviewProduct}
           onSuccess={handleReviewSuccess} // <-- Callback Sukses
         />
       )}

    </div>
  );
}