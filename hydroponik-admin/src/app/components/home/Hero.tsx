/* eslint-disable @next/next/no-img-element */
import React from 'react';
import Link from 'next/link';

const Hero = () => {
  return (
    <section className="bg-[#F4FFF8] py-16 px-6">
      <div className="container mx-auto grid md:grid-cols-2 gap-8 items-center">
        {/* Left Column: Text Content */}
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-black leading-tight">
            🌱 Temukan <br />
            Keindahan Tanaman <br />
            di Rumahmu
          </h1>
          <p className="mt-4 text-black text-base">
            Nikmati kemudahan bercocok tanam tanpa tanah dengan sistem hidroponik modern. 
            Temukan berbagai jenis tanaman segar, alat, dan nutrisi terbaik untuk hasil maksimal.
          </p>
          <Link href="/produk" className="mt-6 inline-block bg-[#70B398] text-white font-semibold px-6 py-3 rounded-lg text-lg hover:bg-opacity-90 transition">
            Belanja Sekarang →
          </Link>
        </div>

        {/* Right Column: Image Collage */}
        <div className="relative h-64 md:h-auto">
            <div className="w-[115px] h-[174px] absolute left-1/4 top-1/4 bg-[#00FF80] overflow-hidden rounded-[10px] transform -translate-x-1/2 -translate-y-1/2">
                <img className="w-full h-full object-cover" src="https://placehold.co/115x174" alt="placeholder" />
            </div>
            <div className="w-[104px] h-[102px] absolute left-3/4 top-1/4 bg-[#00FF80] overflow-hidden rounded-[10px] transform -translate-x-1/2 -translate-y-1/2">
                <img className="w-full h-full object-cover" src="https://placehold.co/104x102" alt="placeholder" />
            </div>
            <div className="w-[104px] h-[96px] absolute left-3/4 top-3/4 bg-[#00FF80] overflow-hidden rounded-[10px] transform -translate-x-1/2 -translate-y-1/2">
                <img className="w-full h-full object-cover" src="https://placehold.co/104x96" alt="placeholder" />
            </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
