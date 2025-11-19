/* eslint-disable @next/next/no-img-element */
import React from 'react';
import Link from 'next/link';

import LocalDate from '@/app/components/LocalDate';

const TestimonialCard = ({ name, date, review, avatarUrl }: { name: string, date: string, review: string, avatarUrl: string }) => (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <div className="flex items-center mb-4">
      <img src={avatarUrl || 'https://placehold.co/30x30'} alt={name} className="w-12 h-12 rounded-full object-cover" />
      <div className="ml-4">
        <h4 className="font-bold text-md">{name}</h4>
        <p className="text-xs text-gray-500">
          <LocalDate dateString={date} options={{ year: 'numeric', month: 'long', day: 'numeric' }} />
        </p>
      </div>
    </div>
    <div className="flex mb-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="w-5 h-5 overflow-hidden relative">
          <div className="w-[10.31px] h-[9.85px] left-[0.34px] top-[0.41px] absolute bg-[#FDD835]"></div>
        </div>
      ))}
    </div>
    <p className="text-sm text-gray-700">{review}</p>
  </div>
);

async function getReviews() {
    try {
      const res = await fetch('http://localhost:3000/reviews/public', { cache: 'no-store' });
      if (!res.ok) {
        throw new Error('Failed to fetch reviews');
      }
      return res.json();
    } catch (error) {
      console.error('Error fetching reviews:', error);
      return [];
    }
}

const Testimonials = async () => {
  const reviews = await getReviews();
  const featuredReview = reviews[0];

  return (
    <section className="bg-[#F4FFF8] py-16 px-6">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">💬 Apa Kata Mereka</h2>
          <Link href="/reviews" className="bg-[#70B398] text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-opacity-90">
            Lihat Selengkapnya →
          </Link>
        </div>
        <div className="grid md:grid-cols-2 gap-8 items-start">
          <div className="space-y-8">
            {featuredReview ? (
              <TestimonialCard
                key={featuredReview.id}
                name={featuredReview.user.name}
                date={featuredReview.createdAt}
                review={featuredReview.comment}
                avatarUrl={featuredReview.user.avatarUrl} // Assuming user has an avatarUrl field
              />
            ) : (
                <p>Belum ada testimoni untuk ditampilkan.</p>
            )}
          </div>
          <div className="relative grid grid-cols-2 gap-4 h-full">
             <img src="https://placehold.co/221x172" alt="Testimonial collage 1" className="rounded-lg object-cover w-full h-auto col-span-1" />
             <img src="https://placehold.co/105x101" alt="Testimonial collage 2" className="rounded-lg object-cover w-full h-auto col-span-1" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;