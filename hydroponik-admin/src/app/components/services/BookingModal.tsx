'use client';

import React, { useState, useEffect } from 'react';
import { X, Send, User, Phone, MapPin, Calendar, FileText, Loader2 } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

interface BookingModalProps {
  serviceName: string;
  price: number;
  isOpen: boolean;
  onClose: () => void;
}

export default function BookingModal({ serviceName, price, isOpen, onClose }: BookingModalProps) {
  const { user } = useAuthStore();
  
  const [formData, setFormData] = useState({
    name: '', phone: '', address: '', date: '', notes: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  // Auto-fill nama kalau user sudah login
  useEffect(() => {
    if (isOpen && user) {
      setFormData(prev => ({ ...prev, name: user.name }));
    }
  }, [isOpen, user]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // GANTI NOMOR WA ADMIN DISINI (Format: 628...)
    const phoneNumber = "6281234567890"; 
    
    const message = `Halo Admin Arif Hidrofarm! 🌱%0A%0ASaya tertarik dengan jasa:%0A🛠️ *${serviceName}*%0A💰 Mulai dari: Rp ${new Intl.NumberFormat('id-ID').format(price)}%0A%0A📋 *Data Diri Saya:*%0ANama: ${formData.name}%0ANo WA: ${formData.phone}%0AAlamat: ${formData.address}%0ARencana Tanggal: ${formData.date}%0ACatatan: ${formData.notes || '-'}`;

    const waUrl = `https://wa.me/${phoneNumber}?text=${message}`;

    setTimeout(() => {
      window.open(waUrl, '_blank');
      setIsLoading(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4 animate-in fade-in duration-200">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative z-10 overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-[#F4FFF8]">
          <div>
            <h3 className="font-bold text-gray-800 text-lg">Form Booking</h3>
            <p className="text-xs text-[#3E8467] font-medium">{serviceName}</p>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-red-100 hover:text-red-500 rounded-full transition-all">
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <div className="p-6 overflow-y-auto">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase">Nama Lengkap</label>
              <div className="flex items-center border rounded-xl px-3 py-3 bg-gray-50 focus-within:border-[#3E8467] focus-within:bg-white transition-all">
                <User size={18} className="text-gray-400 mr-3" />
                <input required type="text" placeholder="Nama Anda" className="bg-transparent w-full outline-none text-sm" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase">No. WhatsApp</label>
              <div className="flex items-center border rounded-xl px-3 py-3 bg-gray-50 focus-within:border-[#3E8467] focus-within:bg-white transition-all">
                <Phone size={18} className="text-gray-400 mr-3" />
                <input required type="tel" placeholder="08xxx" className="bg-transparent w-full outline-none text-sm" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase">Lokasi Pengerjaan</label>
              <div className="flex items-start border rounded-xl px-3 py-3 bg-gray-50 focus-within:border-[#3E8467] focus-within:bg-white transition-all">
                <MapPin size={18} className="text-gray-400 mr-3 mt-0.5" />
                <textarea required placeholder="Alamat lengkap..." className="bg-transparent w-full outline-none text-sm resize-none h-16" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase">Rencana Tanggal</label>
              <div className="flex items-center border rounded-xl px-3 py-3 bg-gray-50 focus-within:border-[#3E8467] focus-within:bg-white transition-all">
                <Calendar size={18} className="text-gray-400 mr-3" />
                <input required type="date" className="bg-transparent w-full outline-none text-sm text-gray-600" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-500 uppercase">Catatan (Opsional)</label>
              <div className="flex items-start border rounded-xl px-3 py-3 bg-gray-50 focus-within:border-[#3E8467] focus-within:bg-white transition-all">
                <FileText size={18} className="text-gray-400 mr-3 mt-0.5" />
                <textarea placeholder="Ukuran lahan, jenis tanaman, dll..." className="bg-transparent w-full outline-none text-sm resize-none h-20" value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} />
              </div>
            </div>

            <button type="submit" disabled={isLoading} className="w-full py-3.5 bg-[#25D366] hover:bg-[#128C7E] text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95 mt-4">
              {isLoading ? <Loader2 className="animate-spin" /> : <>Lanjut ke WhatsApp <Send size={18}/></>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}