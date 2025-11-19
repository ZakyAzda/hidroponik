/* eslint-disable @next/next/no-img-element */
import React from 'react';
import Link from 'next/link';

import LocalDate from '@/app/components/LocalDate';

const ArticleItem = ({ title, date, description, imageUrl }: { title: string, date: string, description: string, imageUrl: string }) => (
  <div className="flex items-start space-x-4 bg-white rounded-2xl p-4 shadow-md hover:shadow-lg transition-shadow duration-200">
    <img 
      src={imageUrl} 
      alt={title} 
      className="w-28 h-28 rounded-xl object-cover flex-shrink-0" 
    />
    <div className="flex-1 min-w-0 py-1">
      <span className="text-xs text-gray-500 font-medium">
        <LocalDate dateString={date} options={{ year: 'numeric', month: 'long' }} />
      </span>
      <h4 className="font-bold text-base text-gray-900 text-[100px] mt-2 mb-2 line-clamp-2 leading-tight">{title}</h4>
      <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">{description}</p>
    </div>
  </div>
);

async function getArticles() {
  try {
    const res = await fetch('http://localhost:3000/articles', { cache: 'no-store' });
    if (!res.ok) {
      throw new Error('Failed to fetch articles');
    }
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

  if (!mainArticle) {
    return (
        <section className="bg-[#F4FFF8] py-16 px-6">
            <div className="container mx-auto max-w-7xl">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">💧 Artikel & Tips</h2>
                <p className="text-gray-600">Tidak ada artikel untuk ditampilkan.</p>
            </div>
        </section>
    );
  }

  return (
    <section className="bg-[#F4FFF8] py-16 px-6">
      <div className="container mx-auto max-w-7xl">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800">💧 Artikel & Tips</h2>
          <Link 
            href="/artikel" 
            className="bg-[#70B398] text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-[#5fa085] transition-colors duration-200"
          >
            Lihat Artikel Lainnya {'>'}
          </Link>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {/* Main Article */}
          <div className="flex flex-col bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
            <div className="relative h-72 overflow-hidden">
              <img 
                src={mainArticle.imageUrl} 
                alt={mainArticle.title} 
                className="w-full h-full object-cover" 
              />
            </div>
            <div className="p-6 flex-1 flex flex-col">
              <span className="text-sm text-gray-500 font-medium">
                <LocalDate dateString={mainArticle.createdAt} options={{ year: 'numeric', month: 'long' }} />
              </span>
              <h3 className="text-2xl font-bold text-gray-900 mt-3 mb-3 line-clamp-2 leading-tight">{mainArticle.title}</h3>
              <p className="text-base text-gray-600 line-clamp-3 leading-relaxed">{mainArticle.content.substring(0, 150)}...</p>
            </div>
          </div>
          {/* Other Articles */}
          <div className="flex flex-col text-[100px] space-y-4">
            {otherArticles.map((article: any) => (
              <ArticleItem 
                key={article.id} 
                title={article.title}
                date={article.createdAt}
                description={`${article.content.substring(0, 50)}...`}
                imageUrl={article.imageUrl}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Articles;