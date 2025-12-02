'use client';

import React, { useState } from 'react';
import { X, Star, Loader2, Send } from 'lucide-react';
import axios from 'axios';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: { id: number; name: string; imageUrl: string | null };
  onSuccess?: () => void; // <-- Tambahan Baru
}

export default function ReviewModal({ isOpen, onClose, product, onSuccess }: ReviewModalProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return alert("Silakan beri bintang dulu!");
    
    setIsLoading(true);
    try {
      const token = localStorage.getItem('access_token');
      await axios.post('http://localhost:3000/reviews', {
        productId: product.id,
        rating,
        comment
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert("Terima kasih! Ulasan berhasil dikirim.");
      if (onSuccess) onSuccess();
      onClose();
      setRating(0);
      setComment('');
    } catch (error: any) {
      alert(error.response?.data?.message || "Gagal mengirim ulasan.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4 animate-in fade-in duration-200">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>

      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative z-10 overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-100 bg-[#F4FFF8]">
          <h3 className="font-bold text-gray-800">Beri Ulasan Produk</h3>
          <button onClick={onClose} className="p-1 hover:bg-red-100 hover:text-red-500 rounded-full transition-all">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <div className="flex gap-4 mb-6 items-center bg-gray-50 p-3 rounded-xl border border-gray-100">
             <div className="w-16 h-16 bg-white rounded-lg overflow-hidden relative border flex-shrink-0">
               {/* eslint-disable-next-line @next/next/no-img-element */}
               <img src={product.imageUrl || 'https://placehold.co/100'} alt={product.name} className="w-full h-full object-cover" />
             </div>
             <p className="font-bold text-gray-700 text-sm line-clamp-2">{product.name}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Bintang Rating */}
            <div className="flex flex-col items-center justify-center mb-2">
              <p className="text-sm text-gray-500 mb-2">Bagaimana kualitas produk ini?</p>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(star)}
                    className="transition-transform hover:scale-110 focus:outline-none"
                  >
                    <Star 
                      size={32} 
                      className={`${(hoverRating || rating) >= star ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Komentar */}
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Ulasan Anda</label>
              <textarea 
                required
                rows={4}
                placeholder="Ceritakan kepuasanmu tentang produk ini..." 
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:border-[#3E8467] outline-none resize-none"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-[#3E8467] hover:bg-[#2F5E4D] text-white font-bold rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              {isLoading ? <Loader2 className="animate-spin" /> : <>Kirim Ulasan <Send size={16}/></>}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}