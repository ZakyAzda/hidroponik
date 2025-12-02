import React from 'react';
import ReviewListClient from '@/app/components/reviews/ReviewListClient';

async function getReviews() {
  try {
    // Kita pakai endpoint public (agar tidak perlu login untuk baca review)
    const res = await fetch('http://localhost:3000/reviews/public', { 
      cache: 'no-store' 
    });
    
    if (!res.ok) return [];
    return res.json();
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return [];
  }
}

export const metadata = {
  title: 'Ulasan Pelanggan - Arif Hidrofarm',
  description: 'Lihat apa kata mereka tentang produk dan layanan kami.',
};

export default async function ReviewsPage() {
  const reviews = await getReviews();
  
  return (
    <div className="pt-20">
      <ReviewListClient initialReviews={reviews} />
    </div>
  );
}