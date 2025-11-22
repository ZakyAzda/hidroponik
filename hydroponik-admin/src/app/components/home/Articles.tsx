/* eslint-disable @next/next/no-img-element */
import React from 'react';
import Link from 'next/link';
import LocalDate from '@/app/components/LocalDate';
// Pastikan path ini sesuai dengan lokasi file Reveal.tsx kamu
import { Reveal } from '@/components/ui/Reveal'; 

const ArticleItem = ({ title, date, description, imageUrl }: { title: string, date: string, description: string, imageUrl: string }) => (
  <div className="group flex items-start space-x-4 bg-white/60 backdrop-blur-md rounded-2xl p-4 shadow-sm hover:shadow-xl hover:bg-white transition-all duration-300 border border-white/50 hover:border-[#70B398]/30 transform hover:-translate-x-1">
    <div className="relative overflow-hidden rounded-xl flex-shrink-0 w-28 h-28 md:w-32 md:h-32 shadow-inner">
      <img 
        src={imageUrl} 
        alt={title} 
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" 
      />
      <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-300"></div>
    </div>
    <div className="flex-1 min-w-0 py-1 flex flex-col h-full justify-between">
      <div>
        <div className="flex items-center space-x-2 mb-2">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#70B398] group-hover:shadow-[0_0_8px_#70B398] transition-shadow duration-300"></span>
          <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">
            <LocalDate dateString={date} options={{ year: 'numeric', month: 'long' }} />
          </span>
        </div>
        <h4 className="font-bold text-base text-gray-800 mb-1 line-clamp-2 leading-snug group-hover:text-[#3E8467] transition-colors duration-300">
          {title}
        </h4>
        <p className="text-xs md:text-sm text-gray-500 line-clamp-2 leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity">
          {description}
        </p>
      </div>
    </div>
  </div>
);

async function getArticles() {
  try {
    const res = await fetch('http://localhost:3000/articles', { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch articles');
    return res.json();
  } catch (error) {
    console.error('Error fetching articles:', error);
    return [];
  }
}

const Articles = async () => {
  const articles = await getArticles();
  const mainArticle = articles[0];
  const otherArticles = articles.slice(1, 4);

  // Jika tidak ada artikel
  if (!mainArticle) {
    return (
        <section className="bg-[#F4FFF8] py-20 px-6 relative overflow-hidden">
            <div className="container mx-auto max-w-7xl relative z-10 text-center">
               <p className="text-gray-500">Belum ada artikel terbaru.</p>
            </div>
        </section>
    );
  }

  return (
    <section className="relative bg-[#F4FFF8] py-20 px-6 overflow-hidden">
      {/* Decorative Background Elements (Blobs) */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-white/20 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-white/30 rounded-full blur-[80px] translate-x-1/3 translate-y-1/3 pointer-events-none" />
      <div className="container mx-auto max-w-7xl relative z-10">
        
        {/* Header Section dengan Reveal */}
        <Reveal>
          <div className="flex flex-col md:flex-row justify-between md:items-end mb-12 gap-6 border-b border-[#70B398]/20 pb-8">
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-white rounded-2xl shadow-sm rotate-3">
                 <span className="text-4xl">💧</span>
              </div>
              <div>
                <span className="text-[#70B398] font-bold tracking-wider text-sm uppercase mb-1 block">Blog & Edukasi</span>
                <h2 className="text-3xl md:text-5xl font-bold text-gray-800 leading-tight">
                  Artikel & <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3E8467] to-[#70B398]">Tips</span>
                </h2>
              </div>
            </div>
            
            <Link 
              href="/artikel" 
              className="group flex items-center space-x-2 text-gray-600 font-semibold hover:text-[#70B398] transition-colors duration-300"
            >
              <span>Lihat Semua Artikel</span>
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm group-hover:bg-[#70B398] group-hover:text-white transition-all duration-300">
                <svg className="w-4 h-4 group-hover:-rotate-45 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </div>
            </Link>
          </div>
        </Reveal>
        
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Main Article (Kiri) - Animasi Muncul */}
          <Reveal delay={100}>
            <div className="group relative h-full flex flex-col bg-white rounded-[32px] shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 ring-1 ring-gray-100">
              
              {/* Image Container */}
              <div className="relative h-64 md:h-80 lg:h-[400px] overflow-hidden">
                <div className="absolute inset-0 bg-gray-200 animate-pulse" /> {/* Placeholder loading effect */}
                <img 
                  src={mainArticle.imageUrl} 
                  alt={mainArticle.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-in-out" 
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-90" />
                
                {/* Floating Badge */}
                <div className="absolute top-6 left-6">
                    <span className="bg-white/20 backdrop-blur-md text-white border border-white/30 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider shadow-lg">
                        Terbaru
                    </span>
                </div>
              </div>

              {/* Content Overlay (Absolute position to allow text over image style or below) */}
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                 <div className="flex items-center space-x-3 mb-3 text-white/90">
                    <span className="bg-[#70B398] w-2 h-2 rounded-full shadow-[0_0_10px_#70B398]"></span>
                    <span className="text-sm font-medium tracking-wide">
                        <LocalDate dateString={mainArticle.createdAt} options={{ year: 'numeric', month: 'long', day: 'numeric' }} />
                    </span>
                 </div>
                 
                 <Link href={`/artikel/${mainArticle.id || '#'}`} className="block">
                    <h3 className="text-2xl md:text-4xl font-bold text-white mb-3 leading-tight group-hover:underline decoration-[#70B398] decoration-2 underline-offset-4 transition-all">
                        {mainArticle.title}
                    </h3>
                 </Link>
                 
                 <p className="text-white/80 text-sm md:text-base line-clamp-2 mb-4 max-w-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                    {mainArticle.content.substring(0, 150).replace(/<[^>]*>?/gm, '')}...
                 </p>

                 <div className="flex items-center text-[#9EE5C6] font-semibold text-sm">
                    <span className="mr-2">Baca Artikel</span>
                    <svg className="w-5 h-5 transform group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                 </div>
              </div>
            </div>
          </Reveal>
          
          {/* Other Articles (Kanan) - Animasi Staggered (Berurutan) */}
          <div className="flex flex-col justify-center space-y-5">
            {otherArticles.map((article: any, index: number) => (
              // Delay bertambah setiap item (index * 150ms)
              <Reveal key={article.id} delay={200 + (index * 150)}>
                <ArticleItem 
                  title={article.title}
                  date={article.createdAt}
                  description={article.content.replace(/<[^>]*>?/gm, '').substring(0, 100)} // Hapus tag HTML jika ada
                  imageUrl={article.imageUrl}
                />
              </Reveal>
            ))}

            {/* View All Button Mobile Only */}
            <Reveal delay={600}>
                <div className="block lg:hidden mt-6">
                    <Link 
                        href="/artikel" 
                        className="w-full bg-white border border-[#70B398] text-[#70B398] font-bold py-3 rounded-xl flex items-center justify-center hover:bg-[#70B398] hover:text-white transition-all duration-300"
                    >
                        Lihat Semua Artikel
                    </Link>
                </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Articles;