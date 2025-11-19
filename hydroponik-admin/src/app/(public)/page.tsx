import React from 'react';
import Hero from '@/app/components/home/Hero';
import FeaturedProducts from '@/app/components/home/FeaturedProducts';
import Articles from '@/app/components/home/Articles';
import About from '@/app/components/home/About';
import Testimonials from '@/app/components/home/Testimonials';
import Location from '@/app/components/home/Location';

export default function PublicHomePage() {
  return (
    <>
      <Hero />
      <FeaturedProducts />
      <Articles />
      <About />
      <Testimonials />
      <Location />
       </>
     );
    }