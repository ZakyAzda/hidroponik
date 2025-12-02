'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Star, User, ShoppingBag } from 'lucide-react';

// Helper Bintang
const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star 
          key={star} 
          size={14} 
          className={`${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
        />
      ))}
    </div>
  );
};

const ReviewCard = ({ review }: { review: any }) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all h-full flex flex-col">
      
      {/* Header: User Info */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-[#3E8467] font-bold border border-green-200 shadow-sm">
               {review.user?.name?.charAt(0).toUpperCase() || <User size={18} />}
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-800">{review.user?.name || 'Pengguna'}</h4>
              <div className="flex items-center gap-2 mt-0.5">
                 <StarRating rating={review.rating} />
              </div>
            </div>
        </div>
        <p className="text-[10px] text-gray-400 bg-gray-50 px-2 py-1 rounded-full">
          {new Date(review.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
        </p>
      </div>

      {/* Komentar */}
      <div className="mb-6 flex-grow">
        <p className="text-gray-600 text-sm leading-relaxed italic relative pl-3 border-l-2 border-gray-200">
          "{review.comment}"
        </p>
      </div>

      {/* --- PRODUK YANG DI-REVIEW (BARU) --- */}
      {review.product && (
        <Link 
          href={`/produk/${review.product.id}`} 
          className="mt-auto flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100 hover:border-[#3E8467]/30 hover:bg-green-50/50 transition-all group"
        >
           <div className="w-10 h-10 bg-white rounded-lg overflow-hidden flex-shrink-0 border border-gray-200 relative">
              {/* Gambar Produk */}
              {review.product.imageUrl ? (
                <Image 
                    src={review.product.imageUrl} 
                    alt={review.product.name} 
                    fill 
                    className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-300">
                    <ShoppingBag size={16} />
                </div>
              )}
           </div>
           <div className="flex-1 min-w-0">
              <p className="text-[10px] text-gray-400 mb-0.5 uppercase tracking-wider font-bold">Produk</p>
              <p className="text-xs font-bold text-gray-700 truncate group-hover:text-[#3E8467] transition-colors">
                {review.product.name}
              </p>
           </div>
        </Link>
      )}

    </div>
  );
};

export default ReviewCard;