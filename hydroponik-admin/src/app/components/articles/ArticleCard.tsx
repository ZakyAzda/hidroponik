'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, User, ArrowRight } from 'lucide-react';

// Helper format tanggal Indonesia
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

const ArticleCard = ({ article }: { article: any }) => {
  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 border border-[#3E8467]/10 flex flex-col h-full hover:-translate-y-2">
      
      {/* Image Thumbnail */}
      <div className="relative h-56 overflow-hidden">
        <Image 
          src={article.imageUrl || "https://images.unsplash.com/photo-1550989460-0adf9ea622e2?q=80&w=800&auto=format&fit=crop"} 
          alt={article.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        {/* Overlay Gelap saat Hover */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-grow">
        
        {/* Meta Data (Tanggal & Penulis) */}
        <div className="flex items-center gap-4 text-xs text-gray-400 mb-3">
          <div className="flex items-center gap-1">
            <Calendar size={14} />
            <span>{formatDate(article.createdAt)}</span>
          </div>
          <div className="flex items-center gap-1">
            <User size={14} />
            <span>{article.author?.name || 'Admin'}</span>
          </div>
        </div>

        {/* Judul */}
        <h3 className="text-xl font-bold text-gray-800 mb-3 leading-tight group-hover:text-[#3E8467] transition-colors line-clamp-2">
          {article.title}
        </h3>

        {/* Preview Konten (Potong teks jika kepanjangan) */}
        <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-3 flex-grow">
          {article.content}
        </p>

        {/* Tombol Baca */}
        <Link 
          href={`/artikel/${article.id}`} 
          className="mt-auto inline-flex items-center gap-2 text-sm font-bold text-[#3E8467] hover:text-[#2F5E4D] transition-all group/link"
        >
          Baca Selengkapnya 
          <ArrowRight size={16} className="transition-transform group-hover/link:translate-x-1" />
        </Link>
      </div>
    </div>
  );
};

export default ArticleCard;