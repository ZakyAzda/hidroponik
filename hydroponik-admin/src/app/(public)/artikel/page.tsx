import React from 'react';
import ArticleListClient from '@/app/components/articles/ArticleListClient'; // Sesuaikan path

// Fungsi Fetch Data dari Backend
async function getArticles() {
  try {
    // Pastikan URL backend benar
    const res = await fetch('http://localhost:3000/articles', { 
      cache: 'no-store' 
    });
    
    if (!res.ok) {
      throw new Error('Failed to fetch articles');
    }
    return res.json();
  } catch (error) {
    console.error('Error fetching articles:', error);
    return [];
  }
}

export const metadata = {
  title: 'Artikel & Tips - Arif Hidrofarm',
  description: 'Pelajari cara bertani hidroponik, tips merawat tanaman, dan berita terbaru.',
};

export default async function ArticlesPage() {
  const articles = await getArticles();
  
  return (
    <div className="pt-20"> {/* Padding top agar tidak tertutup Navbar */}
      <ArticleListClient initialArticles={articles} />
    </div>
  );
}