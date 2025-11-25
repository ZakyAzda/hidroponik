'use client';

import React, { useEffect, useState } from 'react';
import { useCartStore } from '@/app/lib/useCartStore';
import { useAuthStore } from '@/store/authStore';
import { MapPin, Truck, CreditCard, Banknote, Loader2, Plus, CheckCircle2, ShoppingBag } from 'lucide-react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

declare global {
  interface Window {
    snap: any;
  }
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, clearCart, removeItem, directCheckoutItem, clearDirectCheckoutItem } = useCartStore();
  const { openLogin } = useAuthStore();
  
  // LOGIC ITEM
  const isDirectBuy = !!directCheckoutItem;
  const checkoutItems = isDirectBuy ? [directCheckoutItem!] : items.filter(item => item.selected);
  const selectedTotal = checkoutItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'BANK_TRANSFER'>('BANK_TRANSFER');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const [newAddress, setNewAddress] = useState({ label: '', recipientName: '', phoneNumber: '', fullAddress: '' });

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) { openLogin(); router.push('/cart'); } 
    else fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const res = await axios.get('http://localhost:3000/users/addresses', { headers: { Authorization: `Bearer ${token}` } });
      setAddresses(res.data);
      if (res.data.length > 0 && !selectedAddressId) setSelectedAddressId(res.data[0].id);
      if (res.data.length === 0) setShowAddressForm(true);
    } catch (err) { console.error(err); }
  };

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('access_token');
      await axios.post('http://localhost:3000/users/addresses', newAddress, { headers: { Authorization: `Bearer ${token}` } });
      await fetchAddresses(); setShowAddressForm(false); setNewAddress({ label: '', recipientName: '', phoneNumber: '', fullAddress: '' });
    } catch (err) { alert("Gagal menyimpan alamat"); }
  };

  // --- HELPER: BERSIHKAN CART & SHOW SUCCESS ---
  const finishOrder = () => {
    if (isDirectBuy) {
      clearDirectCheckoutItem();
    } else {
      checkoutItems.forEach(item => removeItem(item.id));
    }
    setShowSuccess(true);
  };

  // --- PROSES ORDER UTAMA ---
  const handlePlaceOrder = async () => {
    if (!selectedAddressId) return alert("Pilih alamat pengiriman dulu!");
    if (checkoutItems.length === 0) return alert("Tidak ada barang yang dipilih!");

    setIsProcessing(true);
    try {
      const token = localStorage.getItem('access_token');
      const orderPayload = {
        items: checkoutItems.map(item => ({ productId: item.id, quantity: item.quantity })),
        paymentMethod: paymentMethod, 
        addressId: selectedAddressId 
      };

      // 1. Kirim ke Backend
      const response = await axios.post('http://localhost:3000/orders', orderPayload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log("DEBUG RESPONSE BACKEND:", response.data); // <--- CEK INI DI CONSOLE BROWSER

      // 2. LOGIKA PEMISAH (INI YANG PENTING!)
      if (paymentMethod === 'BANK_TRANSFER' && response.data.midtransToken) {
        
        // === JALUR MIDTRANS ===
        console.log("Membuka Snap...", response.data.midtransToken);
        
        if (window.snap) {
          window.snap.pay(response.data.midtransToken, {
            onSuccess: function(result: any) {
              console.log("Payment Success", result);
              finishOrder(); // Baru jalankan sukses di sini
            },
            onPending: function(result: any) {
              console.log("Payment Pending", result);
              finishOrder(); // Atau di sini
            },
            onError: function(result: any) {
              console.error("Payment Error", result);
              alert("Pembayaran Gagal!");
            },
            onClose: function() {
              console.log("Customer closed the popup without finishing the payment");
              alert('Pembayaran belum selesai. Silakan cek Riwayat Pesanan.');
              router.push('/profile');
            }
          });
        } else {
          alert("Gagal memuat sistem pembayaran. Coba refresh halaman.");
        }

      } else {
        // === JALUR COD ===
        // Jika TIDAK ada token midtrans, atau metode COD, baru langsung sukses
        finishOrder();
      }

    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || "Gagal membuat pesanan.");
    } finally {
      // Matikan loading HANYA jika COD atau Error. 
      // Jika Midtrans, biarkan loading sampai Popup muncul agar user tidak klik 2x
      if (paymentMethod === 'COD') {
         setIsProcessing(false);
      }
    }
  };

  if (checkoutItems.length === 0 && !showSuccess) {
    return (
      <div className="min-h-screen bg-[#F4FFF8] pt-32 pb-20 px-6 flex flex-col items-center justify-center text-center">
        <ShoppingBag className="w-16 h-16 text-gray-300 mb-4" />
        <h2 className="text-xl font-bold text-gray-700">Tidak ada barang</h2>
        <button onClick={() => router.push('/produk')} className="mt-4 text-[#3E8467] font-bold hover:underline">Kembali ke Produk</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4FFF8] pt-28 pb-20 px-4 relative">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8">Checkout Pengiriman</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* KIRI */}
          <div className="lg:col-span-2 space-y-6">
            {/* ALAMAT */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#3E8467]/10">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-bold text-gray-800 flex items-center gap-2"><MapPin className="text-[#3E8467]" size={20} /> Alamat Pengiriman</h2>
                <button onClick={() => setShowAddressForm(!showAddressForm)} className="text-xs flex items-center gap-1 bg-green-50 text-[#3E8467] px-3 py-1.5 rounded-full font-bold hover:bg-[#3E8467] hover:text-white transition-all"><Plus size={14} /> Tambah Alamat</button>
              </div>
              {showAddressForm && (
                <form onSubmit={handleSaveAddress} className="bg-gray-50 p-5 rounded-xl border border-gray-200 space-y-3 mb-6 animate-in fade-in">
                   <div className="grid grid-cols-2 gap-3">
                     <input placeholder="Label" className="w-full p-3 bg-white rounded-lg border text-sm" value={newAddress.label} onChange={e => setNewAddress({...newAddress, label: e.target.value})} required />
                     <input placeholder="Penerima" className="w-full p-3 bg-white rounded-lg border text-sm" value={newAddress.recipientName} onChange={e => setNewAddress({...newAddress, recipientName: e.target.value})} required />
                   </div>
                   <input placeholder="No. HP" className="w-full p-3 bg-white rounded-lg border text-sm" value={newAddress.phoneNumber} onChange={e => setNewAddress({...newAddress, phoneNumber: e.target.value})} required />
                   <textarea placeholder="Alamat Lengkap" className="w-full p-3 bg-white rounded-lg border text-sm h-24" value={newAddress.fullAddress} onChange={e => setNewAddress({...newAddress, fullAddress: e.target.value})} required />
                   <div className="flex gap-2 justify-end">
                      <button type="button" onClick={() => setShowAddressForm(false)} className="px-4 py-2 text-gray-500 text-sm">Batal</button>
                      <button type="submit" className="px-6 py-2 bg-[#3E8467] text-white rounded-lg text-sm font-bold">Simpan</button>
                   </div>
                </form>
              )}
              <div className="space-y-3">
                {addresses.length > 0 ? addresses.map((addr) => (
                  <label key={addr.id} className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedAddressId === addr.id ? 'border-[#3E8467] bg-green-50' : 'border-gray-100 hover:border-green-100'}`}>
                    <div className="mt-1"><div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedAddressId === addr.id ? 'border-[#3E8467]' : 'border-gray-300'}`}>{selectedAddressId === addr.id && <div className="w-2.5 h-2.5 bg-[#3E8467] rounded-full" />}</div><input type="radio" name="address" className="hidden" checked={selectedAddressId === addr.id} onChange={() => setSelectedAddressId(addr.id)} /></div>
                    <div><p className="font-bold text-gray-800 text-sm">{addr.recipientName} <span className="text-gray-500 font-normal">({addr.label})</span></p><p className="text-xs text-gray-600 mt-1">{addr.fullAddress}</p><p className="text-xs text-gray-500 mt-1">{addr.phoneNumber}</p></div>
                  </label>
                )) : <p className="text-sm text-gray-500 text-center py-4">Belum ada alamat tersimpan.</p>}
              </div>
            </div>

            {/* RINCIAN BARANG */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#3E8467]/10">
              <h2 className="font-bold text-gray-800 mb-4 flex items-center gap-2"><Truck className="text-[#3E8467]" size={20} /> Rincian Barang</h2>
              <div className="space-y-4">
                {checkoutItems.map((item) => (
                  <div key={item.id} className="flex gap-4 items-center pb-4 border-b border-dashed border-gray-100 last:border-0 last:pb-0">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden relative flex-shrink-0">
                       {item.imageUrl && <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-bold text-gray-800 line-clamp-1">{item.name}</h4>
                      <p className="text-xs text-gray-500">{item.quantity} x Rp {new Intl.NumberFormat('id-ID').format(item.price)}</p>
                    </div>
                    <p className="text-sm font-bold text-[#3E8467]">Rp {new Intl.NumberFormat('id-ID').format(item.price * item.quantity)}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* KANAN */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-[#3E8467]/20 sticky top-28">
              <h3 className="font-bold text-gray-800 mb-4">Metode Pembayaran</h3>
              <div className="space-y-3 mb-6">
                <label className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === 'BANK_TRANSFER' ? 'border-[#3E8467] bg-green-50' : 'border-gray-100 hover:border-green-100'}`}>
                  <input type="radio" name="payment" className="hidden" checked={paymentMethod === 'BANK_TRANSFER'} onChange={() => setPaymentMethod('BANK_TRANSFER')} />
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'BANK_TRANSFER' ? 'border-[#3E8467]' : 'border-gray-300'}`}>{paymentMethod === 'BANK_TRANSFER' && <div className="w-2.5 h-2.5 bg-[#3E8467] rounded-full" />}</div>
                  <div className="flex-1"><div className="flex items-center gap-2 font-bold text-sm text-gray-700"><CreditCard size={16}/> Transfer Bank</div><p className="text-[10px] text-gray-500">Otomatis Midtrans</p></div>
                </label>
                <label className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === 'COD' ? 'border-[#3E8467] bg-green-50' : 'border-gray-100 hover:border-green-100'}`}>
                  <input type="radio" name="payment" className="hidden" checked={paymentMethod === 'COD'} onChange={() => setPaymentMethod('COD')} />
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'COD' ? 'border-[#3E8467]' : 'border-gray-300'}`}>{paymentMethod === 'COD' && <div className="w-2.5 h-2.5 bg-[#3E8467] rounded-full" />}</div>
                  <div className="flex-1"><div className="flex items-center gap-2 font-bold text-sm text-gray-700"><Banknote size={16}/> Bayar di Tempat</div><p className="text-[10px] text-gray-500">Bayar tunai</p></div>
                </label>
              </div>

              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-medium">Total Tagihan</span>
                  <span className="text-xl font-bold text-[#3E8467]">Rp {new Intl.NumberFormat('id-ID').format(selectedTotal)}</span>
                </div>
              </div>

              <button onClick={handlePlaceOrder} disabled={isProcessing || !selectedAddressId} className="w-full py-3.5 bg-[#3E8467] hover:bg-[#2F5E4D] text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95">
                {isProcessing ? <Loader2 className="animate-spin" /> : 'Buat Pesanan'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* POPUP SUKSES */}
      {showSuccess && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
          <div className="bg-white rounded-[30px] p-8 md:p-10 max-w-md w-full text-center relative z-10 shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"><CheckCircle2 className="w-12 h-12 text-[#3E8467] animate-bounce" /></div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Pesanan Berhasil!</h2>
            <p className="text-gray-500 mb-8 leading-relaxed">Terima kasih telah berbelanja di Arif Hidrofarm. Pesanan Anda sedang kami proses.</p>
            <div className="space-y-3">
              <button onClick={() => router.push('/profile')} className="w-full py-3.5 bg-[#3E8467] text-white font-bold rounded-xl hover:bg-[#2F5E4D] transition-all shadow-lg hover:shadow-xl">Lihat Pesanan</button>
              <button onClick={() => router.push('/')} className="w-full py-3.5 bg-white text-gray-600 font-bold rounded-xl border-2 border-gray-100 hover:bg-gray-50 transition-all">Kembali ke Beranda</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}