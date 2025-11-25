'use client';

import React, { useState, useMemo } from 'react';
import ArticleCard from '@/app/components/articles/ArticleCard'; // Sesuaikan path import ini
import { Search, FileText } from 'lucide-react';

const ArticleListClient = ({ initialArticles }: { initialArticles: any[] }) => {
  // State untuk menyimpan apa yang diketik user
  const [searchQuery, setSearchQuery] = useState('');

  // --- LOGIKA FILTER CANGGIH ---
  // Setiap kali 'searchQuery' berubah, list artikel di-filter ulang otomatis
  const filteredArticles = useMemo(() => {
    let filtered = Array.isArray(initialArticles) ? initialArticles : [];
    
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(article => 
        // Cari di Judul ATAU di Isi Konten
        article.title.toLowerCase().includes(q) ||
        article.content.toLowerCase().includes(q)
      );
    }
    return filtered;
  }, [initialArticles, searchQuery]);

  return (
    <section className="relative bg-[#F4FFF8] py-20 px-6 min-h-screen overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-96 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-30"></div>
      <div className="absolute top-20 right-0 w-64 h-64 bg-[#70B398]/10 rounded-full blur-3xl"></div>

      <div className="container mx-auto max-w-7xl relative z-10">
        
        {/* HEADER + SEARCH BAR */}
        <div className="flex flex-col items-center text-center mb-16">
          <span className="text-[#3E8467] font-bold tracking-wider uppercase text-sm mb-3 block bg-green-100 px-4 py-1 rounded-full">
            Blog & Edukasi
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            Tips Hidroponik <span className="text-[#3E8467]">Terbaru</span>
          </h2>
          
          {/* --- SEARCH INPUT BESAR --- */}
          <div className="relative w-full max-w-xl mx-auto group">
             <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
               <Search className="h-6 w-6 text-gray-400 group-focus-within:text-[#3E8467] transition-colors" />
             </div>
             <input
              type="text"
              placeholder="Cari artikel... (contoh: Cara menanam)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-14 pr-6 py-5 bg-white border-2 border-green-100 rounded-full focus:border-[#3E8467] focus:ring-4 focus:ring-[#3E8467]/10 outline-none transition-all duration-300 text-lg text-gray-700 shadow-lg hover:shadow-xl"
            />
          </div>
        </div>

        {/* GRID ARTIKEL */}
        {filteredArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArticles.map((article: any, index: number) => (
              <div 
                key={article.id}
                className="animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-forwards"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <ArticleCard article={article} />
              </div>
            ))}
          </div>
        ) : (
          // TAMPILAN JIKA TIDAK ADA HASIL
          <div className="text-center py-20 bg-white/60 backdrop-blur-sm rounded-3xl border-2 border-dashed border-gray-200 max-w-2xl mx-auto">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
              <FileText className="text-gray-400" size={40} />
            </div>
            <h3 className="text-2xl font-bold text-gray-700 mb-2">Artikel tidak ditemukan</h3>
            <p className="text-gray-500">
              Maaf, kami tidak menemukan artikel dengan kata kunci <strong>"{searchQuery}"</strong>.
            </p>
            <button 
              onClick={() => setSearchQuery('')}
              className="mt-6 text-[#3E8467] font-semibold hover:underline"
            >
              Hapus Pencarian
            </button>
          </div>
        )}

      </div>
    </section>
  );
};

export default ArticleListClient;