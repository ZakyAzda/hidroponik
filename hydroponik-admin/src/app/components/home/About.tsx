/* eslint-disable @next/next/no-img-element */
import React from 'react';
import { Reveal } from '@/components/ui/Reveal';

const About = () => {
  return ( // <--- PASTIKAN ADA TANDA KURUNG BIASA INI
    <section className="relative bg-[#F4FFF8] py-24 md:py-32 px-6 overflow-hidden">
      <div className="container mx-auto max-w-7xl relative z-10">

        {/* Header Section */}
        <Reveal>
          <div className="text-center max-w-4xl mx-auto mb-16">
            <span className="text-sm font-semibold text-[#70B398] uppercase tracking-widest block mb-3">
              Filosofi Kami
            </span>
            <h2 className="text-4xl md:text-6xl font-extrabold text-gray-800 leading-tight">
              🌍 Tentang <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3E8467] to-[#70B398]">Komunitas Arif Hidrofarm</span>
            </h2>
          </div>
        </Reveal>

        <div className="grid md:grid-cols-2 gap-12 items-start md:items-center">

          {/* Left Column: Image */}
          <div className="relative">
            <Reveal delay={300}>

              <div className="absolute inset-0 border-4 border-[#70B398] rounded-[24px] transform -translate-x-3 -translate-y-3 opacity-30 pointer-events-none hidden md:block" />

              <div className="w-full h-80 md:h-[400px] rounded-3xl overflow-hidden shadow-2xl relative group bg-white">
                <img
                  src="https://images.unsplash.com/photo-1517457210348-1cd772ce8bd8?w=800&auto=format&fit=crop"
                  alt="Petani hidroponik"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
              </div>
            </Reveal>
          </div>

          {/* Right Column: Text */}
          <div className="space-y-6">
            <Reveal delay={400}>
              <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                <p className="text-gray-700 text-lg mb-4 leading-relaxed font-medium">
                  Kami adalah komunitas petani muda yang berkomitmen menghadirkan hasil panen **sehat dan berkelanjutan** melalui sistem hidroponik modern.
                </p>
              </div>
            </Reveal>

            <Reveal delay={500}>
              <p className="text-gray-600 leading-relaxed pl-4 border-l-4 border-[#70B398]/50">
                Misi kami adalah membantu masyarakat bercocok tanam dengan cara yang lebih **efisien, bersih, dan ramah lingkungan**. Dari edukasi hingga distribusi perlengkapan, kami hadir untuk mendukung petani modern di seluruh Indonesia.
              </p>
            </Reveal>

            <Reveal delay={600}>
              <div className="flex items-center space-x-4 pt-4">
                <span className="text-3xl">🌱</span>
                <p className="text-gray-800 font-semibold italic">
                  "Inspirasi hidup sehat dan ramah lingkungan dimulai dari langkah pertama menanam."
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  ); // <--- PASTIKAN ADA TANDA KURUNG BIASA INI
};

export default About;