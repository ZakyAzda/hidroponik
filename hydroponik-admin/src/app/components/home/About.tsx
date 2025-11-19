/* eslint-disable @next/next/no-img-element */
import React from 'react';

const About = () => {
  return (
    <section className="bg-[#F4FFF8] py-16 px-6">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold mb-8">🌍 Tentang Kami</h2>
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Image */}
          <div className="w-full h-64 rounded-lg overflow-hidden">
            <img src="https://placehold.co/241x188" alt="Tentang Kami" className="w-full h-full object-cover" />
          </div>
          {/* Text */}
          <div className="text-black">
            <p className="mb-4">
              Kami adalah komunitas petani muda yang berkomitmen menghadirkan hasil panen sehat dan berkelanjutan.
            </p>
            <p className="mb-4">
              Misi kami adalah membantu masyarakat bercocok tanam dengan cara yang lebih efisien, bersih, dan ramah lingkungan. Dari edukasi hingga distribusi perlengkapan, kami hadir untuk mendukung petani modern di seluruh Indonesia.
            </p>
            <p>
              Dengan metode hidroponik modern, kami ingin menginspirasi lebih banyak orang untuk hidup sehat dan ramah lingkungan 🌱.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
