import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, User, ArrowLeft, Share2, Clock, Tag } from 'lucide-react';
import { notFound } from 'next/navigation';

// 1. FUNGSI FETCH DATA DETAIL
async function getArticle(id: string) {
  try {
    const res = await fetch(`http://localhost:3000/articles/${id}`, { 
      cache: 'no-store' // Data selalu fresh
    });
    
    if (!res.ok) return null;
    
    return res.json();
  } catch (error) {
    console.error('Error fetching article:', error);
    return null;
  }
}

// Helper Format Tanggal
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

// 2. HALAMAN UTAMA
export default async function ArticleDetailPage({ params }: { params: { id: string } }) {
  const article = await getArticle(params.id);

  // Jika artikel tidak ditemukan, lempar ke halaman 404
  if (!article) {
    return notFound();
  }

  return (
    <main className="bg-white min-h-screen pb-20">
      
      {/* --- HEADER IMAGE (PARALLAX STYLE) --- */}
      <div className="relative h-[400px] md:h-[500px] w-full">
        <Image 
          src={article.imageUrl || "https://images.unsplash.com/photo-1550989460-0adf9ea622e2?q=80&w=1200&auto=format&fit=crop"} 
          alt={article.title}
          fill
          className="object-cover"
          priority
        />
        {/* Gradient Overlay agar teks terbaca */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
        
        {/* Tombol Kembali Absolute */}
        <div className="absolute top-28 left-6 md:left-10 z-20">
          <Link 
            href="/artikel" 
            className="flex items-center gap-2 text-white/80 hover:text-white bg-black/20 hover:bg-black/40 backdrop-blur-sm px-4 py-2 rounded-full transition-all"
          >
            <ArrowLeft size={18} /> Kembali ke Artikel
          </Link>
        </div>

        {/* Judul di atas Gambar */}
        <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 text-white z-10">
          <div className="container mx-auto max-w-4xl">
            <span className="bg-[#3E8467] text-white px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider mb-4 inline-block shadow-lg">
              Tips & Edukasi
            </span>
            <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-4 shadow-black drop-shadow-lg">
              {article.title}
            </h1>
            
            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-6 text-sm md:text-base text-white/90">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center border border-white/30">
                   <User size={14} />
                </div>
                <span className="font-medium">{article.author?.name || 'Admin Arif Hidrofarm'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={16} />
                <span>{formatDate(article.createdAt)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={16} />
                <span>5 Menit Baca</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- CONTENT BODY --- */}
      <div className="container mx-auto max-w-4xl px-6 -mt-10 relative z-20">
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-gray-100">
          
          {/* Share Button & Tags (Hiasan) */}
          <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-6">
            <div className="flex gap-2">
               <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                 <Tag size={12} /> Hidroponik
               </span>
               <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                 <Tag size={12} /> Tips
               </span>
            </div>
            <button className="flex items-center gap-2 text-gray-500 hover:text-[#3E8467] transition-colors text-sm font-semibold">
              <Share2 size={18} /> Bagikan
            </button>
          </div>

          {/* ISI ARTIKEL */}
          {/* whitespace-pre-line: Agar enter/paragraf dari database terbaca */}
          <article className="prose prose-lg prose-green max-w-none text-gray-700 leading-relaxed whitespace-pre-line">
            {article.content}
          </article>

          {/* Footer Artikel */}
          <div className="mt-12 pt-8 border-t border-gray-100">
            <h3 className="font-bold text-gray-800 mb-4">Tentang Penulis</h3>
            <div className="flex items-center gap-4 bg-[#F4FFF8] p-6 rounded-xl border border-green-100">
              <div className="w-16 h-16 bg-[#3E8467] rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {article.author?.name?.charAt(0) || 'A'}
              </div>
              <div>
                <p className="font-bold text-gray-900">{article.author?.name || 'Admin'}</p>
                <p className="text-sm text-gray-500">Tim Ahli Agronomi Arif Hidrofarm</p>
              </div>
            </div>
          </div>

        </div>
      </div>

    </main>
  );
}