'use client';

import React, { useEffect, useRef, useState } from 'react';

interface RevealProps {
  children: React.ReactNode;
  delay?: number; // Delay dalam milidetik
}

export const Reveal = ({ children, delay = 0 }: RevealProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Jika elemen muncul di layar (viewport)
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // Matikan observer agar animasi hanya jalan sekali
        }
      },
      {
        threshold: 0.1, // Animasi mulai saat 10% elemen terlihat
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ease-[cubic-bezier(0.17,0.55,0.55,1)] transform ${
        isVisible 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-20'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};