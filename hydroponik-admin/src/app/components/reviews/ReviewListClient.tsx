'use client';

import React, { useState, useMemo } from 'react';
import ReviewCard from './ReviewCard';
import { Search, Filter, Star } from 'lucide-react';

const ReviewListClient = ({ initialReviews }: { initialReviews: any[] }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRating, setFilterRating] = useState<number | 'all'>('all');

  // Logic Filter
  const filteredReviews = useMemo(() => {
    let filtered = Array.isArray(initialReviews) ? initialReviews : [];

    // 1. Filter Search (Isi Komentar / Nama User / Nama Produk)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(review => 
        review.comment.toLowerCase().includes(q) ||
        review.user?.name.toLowerCase().includes(q) ||
        review.product?.name.toLowerCase().includes(q)
      );
    }

    // 2. Filter Rating
    if (filterRating !== 'all') {
      filtered = filtered.filter(review => review.rating === filterRating);
    }

    return filtered;
  }, [initialReviews, searchQuery, filterRating]);

  return (
    <section className="relative bg-[#F4FFF8] py-20 px-6 min-h-screen overflow-hidden">
      
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#3E8467]/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="container mx-auto max-w-7xl relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Apa Kata <span className="text-[#3E8467]">Mereka?</span>
            </h2>
            <p className="text-gray-500">
               Pengalaman asli dari pelanggan setia Arif Hidrofarm. Transparansi adalah prioritas kami.
            </p>
        </div>

        {/* Filter Bar */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-10 flex flex-col md:flex-row gap-4 items-center">
          
          {/* Search */}
          <div className="relative flex-1 w-full group">
             <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
               <Search className="h-5 w-5 text-gray-400 group-focus-within:text-[#70B398] transition-colors" />
             </div>
             <input
              type="text"
              placeholder="Cari ulasan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-[#70B398] focus:ring-4 focus:ring-[#70B398]/10 outline-none transition-all text-gray-700 placeholder-gray-400 shadow-sm"
            />
          </div>

          {/* Filter Rating */}
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto">
            <button 
                onClick={() => setFilterRating('all')}
                className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-all border ${filterRating === 'all' ? 'bg-[#3E8467] text-white border-[#3E8467]' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}
            >
                Semua
            </button>
            {[5, 4, 3, 2, 1].map(star => (
                <button 
                    key={star}
                    onClick={() => setFilterRating(star)}
                    className={`px-3 py-2 rounded-lg text-sm font-bold flex items-center gap-1 transition-all border ${filterRating === star ? 'bg-yellow-50 text-yellow-700 border-yellow-400' : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'}`}
                >
                    {star} <Star size={14} className="fill-current" />
                </button>
            ))}
          </div>
        </div>

        {/* Grid Reviews */}
        {filteredReviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredReviews.map((review: any) => (
               <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 border-2 border-dashed border-gray-200 rounded-3xl bg-white/50">
             <p className="text-gray-500 font-medium">Belum ada ulasan yang sesuai.</p>
             <button onClick={() => {setSearchQuery(''); setFilterRating('all');}} className="text-[#3E8467] text-sm mt-2 hover:underline font-bold">Reset Filter</button>
          </div>
        )}

      </div>
    </section>
  );
};

export default ReviewListClient;