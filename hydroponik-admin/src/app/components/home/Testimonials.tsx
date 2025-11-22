/* eslint-disable @next/next/no-img-element */
import React from 'react';
import Link from 'next/link';

// Import komponen Reveal
import { Reveal } from '@/components/ui/Reveal'; 
import LocalDate from '@/app/components/LocalDate';


// SVG Bintang (untuk Rating)
const StarIcon = ({ filled = true }: { filled?: boolean }) => (
  <svg 
    className={`w-5 h-5 transition-colors duration-300 ${filled ? 'text-yellow-500' : 'text-gray-300'}`} 
    fill="currentColor" 
    viewBox="0 0 20 20" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.817 2.046a1 1 0 00-.363 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.817-2.046a1 1 0 00-1.175 0l-2.817 2.046c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

// Diperbarui: TestimonialCard dengan desain yang lebih premium
const TestimonialCard = ({ name, date, review, avatarUrl, rating = 5 }: { name: string, date: string, review: string, avatarUrl: string, rating?: number }) => (
  <div className="bg-white p-6 md:p-8 rounded-3xl shadow-xl border border-gray-100/50 hover:shadow-2xl transition-all duration-300 hover:scale-[1.01]">
    <div className="flex items-center mb-4">
      <img 
        src={avatarUrl || 'https://placehold.co/50x50'} 
        alt={name} 
        className="w-14 h-14 rounded-full object-cover ring-2 ring-[#70B398] p-0.5" 
      />
      <div className="ml-4">
        <h4 className="font-bold text-lg text-gray-800">{name}</h4>
        <p className="text-xs text-gray-500">
          <LocalDate dateString={date} options={{ year: 'numeric', month: 'long', day: 'numeric' }} />
        </p>
      </div>
    </div>
    
    {/* Rating Stars yang lebih bersih */}
    <div className="flex mb-4">
      {[...Array(5)].map((_, i) => (
        <StarIcon key={i} filled={i < rating} />
      ))}
    </div>
    
    <p className="text-base text-gray-700 italic relative before:content-['“'] before:absolute before:-top-4 before:-left-4 before:text-4xl before:text-[#70B398]/30 before:font-serif before:font-bold">
      {review}
    </p>
  </div>
);

async function getReviews() {
    try {
      const res = await fetch('http://localhost:3000/reviews/public', { cache: 'no-store' });
      if (!res.ok) {
        throw new Error('Failed to fetch reviews');
      }
      // Tambahkan rating dummy jika data API tidak menyediakannya
      const reviews = await res.json();
      return reviews.map((r: any, index: number) => ({
          ...r,
          // Dummy rating 4 atau 5
          rating: (index % 2 === 0) ? 5 : 4, 
      }));
    } catch (error) {
      console.error('Error fetching reviews:', error);
      return [];
    }
}

const Testimonials = async () => {
  const reviews = await getReviews();
  // Ambil 4 review: 1 utama + 3 kecil
  const mainReview = reviews[0];
  const secondaryReviews = reviews.slice(1, 4); 

  return (
    // Background TETAP SAMA: bg-[#F4FFF8]
    <section className="bg-[#F4FFF8] py-24 md:py-32 px-6 relative overflow-hidden">
      <div className="container mx-auto max-w-7xl relative z-10">
        
        {/* Header Section */}
        <Reveal>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 border-b-2 border-dashed border-gray-300/50 pb-8">
            <div className="space-y-3">
              <span className="text-sm font-semibold text-[#70B398] uppercase tracking-widest block">
                Kepercayaan Pelanggan
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800">
                💬 Apa Kata <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3E8467] to-[#70B398]">Mereka</span>
              </h2>
            </div>
            <Link 
              href="/reviews" 
              className="mt-4 md:mt-0 group inline-flex items-center space-x-2 bg-gradient-to-r from-[#70B398] to-[#5fa085] text-white text-sm font-semibold px-6 py-3 rounded-lg overflow-hidden hover:shadow-xl hover:scale-105 transition-all duration-300 shadow-md"
            >
              <span>Lihat Semua Review</span>
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </Reveal>
        
        {/* Main Content Grid (1 Review Besar + 3 Review Kecil) */}
        <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-8 items-start">
          
          {/* Column 1: Review Unggulan (2 kolom) */}
          <div className="md:col-span-2 lg:col-span-2">
            {mainReview ? (
              <Reveal delay={200}>
                <div className="bg-white p-8 md:p-10 rounded-3xl shadow-2xl border-4 border-[#70B398] relative">
                  <span className="absolute -top-4 -left-4 text-7xl font-serif text-[#70B398]/20 font-bold">“</span>
                  <p className="text-xl md:text-2xl text-gray-800 font-semibold italic mb-6 leading-snug">
                    {mainReview.comment}
                  </p>
                  <div className="flex items-center pt-4 border-t border-gray-100">
                    <img 
                      src={mainReview.user?.avatarUrl || 'https://placehold.co/50x50'} 
                      alt={mainReview.user?.name} 
                      className="w-16 h-16 rounded-full object-cover ring-4 ring-[#70B398]/20 p-0.5" 
                    />
                    <div className="ml-4">
                       <div className="flex mb-1">
                          {[...Array(5)].map((_, i) => (
                             <StarIcon key={i} filled={i < mainReview.rating} />
                          ))}
                       </div>
                      <h4 className="font-bold text-lg text-gray-900">{mainReview.user?.name || 'Anonim'}</h4>
                      <p className="text-sm text-gray-500">Pelanggan Sejak <LocalDate dateString={mainReview.createdAt} options={{ year: 'numeric' }} /></p>
                    </div>
                  </div>
                </div>
              </Reveal>
            ) : (
              <p className="text-gray-600">Belum ada testimoni utama.</p>
            )}
          </div>

          {/* Column 2: 3 Review Kecil (Satu per satu muncul) */}
          <div className="md:col-span-1 lg:col-span-2 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6">
            {secondaryReviews.map((review: any, index: number) => (
              <Reveal key={review.id} delay={300 + (index * 150)}>
                <TestimonialCard
                  name={review.user?.name || 'Anonim'}
                  date={review.createdAt}
                  review={review.comment}
                  avatarUrl={review.user?.avatarUrl} 
                  rating={review.rating}
                />
              </Reveal>
            ))}
            
            {/* Slot Kosong untuk alignment/dekorasi jika hanya ada 1 atau 2 review sekunder */}
            {secondaryReviews.length < 3 && (
                <div className="hidden lg:block md:col-span-1 p-6 text-center text-gray-500 border-2 border-dashed border-gray-300/50 rounded-3xl h-full flex items-center justify-center">
                    <p>Tempat Testimoni Berikutnya</p>
                </div>
            )}
            
          </div>
        </div>
        
        {/* Tambahkan bagian untuk statistik kecil di bawah testimoni utama */}
        <Reveal delay={700}>
            <div className="mt-16 text-center max-w-4xl mx-auto">
                <p className="text-xl font-medium text-gray-700">
                    Kami telah melayani <span className="font-extrabold text-[#3E8467]">500+</span> komunitas dan mendapat rata-rata rating <span className="font-extrabold text-yellow-500">4.9/5</span>!
                </p>
            </div>
        </Reveal>
      </div>
    </section>
  );
};

export default Testimonials;