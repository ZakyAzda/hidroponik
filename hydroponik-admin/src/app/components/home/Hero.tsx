'use client';

import React from 'react';

const Hero = () => {
  return (
    <section className="bg-[#F4FFF8] pt-36 pb-16 px-6 overflow-hidden"> 
      <div className="container mx-auto grid md:grid-cols-2 gap-12 items-center max-w-6xl">
        
        {/* Left Column: Text Content */}
        <div className="space-y-6">
          {/* Animated Badge */}
          <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-md animate-fade-in-up opacity-0 animation-delay-100">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#70B398] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#70B398]"></span>
            </span>
            <span className="text-sm font-semibold text-gray-700">Hidroponik Modern</span>
          </div>

          {/* Animated Heading */}
          <h1 className="text-4xl md:text-5xl font-bold text-black leading-tight animate-fade-in-up opacity-0 animation-delay-200">
            🌱 Temukan <br />
            <span className="bg-gradient-to-r from-[#70B398] to-[#5fa085] bg-clip-text text-transparent">
              Keindahan Tanaman
            </span> <br />
            di Rumahmu
          </h1>

          {/* Animated Paragraph */}
          <p className="text-black text-base md:text-lg leading-relaxed animate-fade-in-up opacity-0 animation-delay-300">
            Nikmati kemudahan bercocok tanam tanpa tanah dengan sistem hidroponik modern. 
            Temukan berbagai jenis tanaman segar, alat, dan nutrisi terbaik untuk hasil maksimal.
          </p>

          {/* Animated Button */}
          <div className="animate-fade-in-up opacity-0 animation-delay-400">
            <a 
              href="/produk" 
              className="group inline-flex items-center space-x-2 bg-gradient-to-r from-[#70B398] to-[#5fa085] text-white font-semibold px-8 py-4 rounded-xl text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 shadow-lg"
            >
              <span>Belanja Sekarang</span>
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>

          {/* Animated Stats */}
          <div className="flex items-center space-x-8 pt-4 animate-fade-in-up opacity-0 animation-delay-500">
            <div className="text-center">
              <div className="text-3xl font-bold text-[#70B398]">500+</div>
              <div className="text-sm text-gray-600">Produk</div>
            </div>
            <div className="w-px h-12 bg-gray-300"></div>
            <div className="text-center">
              <div className="text-3xl font-bold text-[#70B398]">1000+</div>
              <div className="text-sm text-gray-600">Pelanggan</div>
            </div>
            <div className="w-px h-12 bg-gray-300"></div>
            <div className="text-center">
              <div className="text-3xl font-bold text-[#70B398]">98%</div>
              <div className="text-sm text-gray-600">Kepuasan</div>
            </div>
          </div>
        </div>

        {/* Right Column: Animated Image Grid */}
        <div className="relative flex gap-4 h-[400px] md:h-[500px] items-center">
          
          {/* Large Image - Left (Animated) */}
          <div className="flex-1 h-[70%] bg-gradient-to-br from-[#70B398] to-[#9ECDB5] overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 animate-slide-in-left opacity-0 animation-delay-200 group">
            <img 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
              src="https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=400&h=600&fit=crop" 
              alt="Hydroponic farming illustration" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </div>

          {/* Two Images - Right Stack */}
          <div className="flex flex-col gap-4 w-[45%]">
            
            {/* Top Image (Animated) */}
            <div className="flex-1 bg-gradient-to-br from-[#70B398] to-[#9ECDB5] overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 animate-slide-in-right opacity-0 animation-delay-300 group">
              <img 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                src="https://images.unsplash.com/photo-1560493676-04071c5f467b?w=300&h=250&fit=crop" 
                alt="Fresh hydroponic vegetables" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>

            {/* Bottom Image (Animated) */}
            <div className="flex-1 bg-gradient-to-br from-[#70B398] to-[#9ECDB5] overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 animate-slide-in-right opacity-0 animation-delay-400 group">
              <img 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                src="https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=300&h=250&fit=crop" 
                alt="Hydroponic lettuce growing" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>
          </div>

          {/* Floating Decorative Elements */}
          <div className="absolute -top-4 -right-4 w-20 h-20 bg-[#70B398]/20 rounded-full blur-2xl animate-float"></div>
          <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-[#70B398]/10 rounded-full blur-3xl animate-float-delayed"></div>
        </div>
      </div>

      {/* Custom CSS for Animations */}
      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-in-left {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slide-in-right {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }

        .animate-slide-in-left {
          animation: slide-in-left 0.8s ease-out forwards;
        }

        .animate-slide-in-right {
          animation: slide-in-right 0.8s ease-out forwards;
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-float-delayed {
          animation: float 6s ease-in-out 3s infinite;
        }

        .animation-delay-100 {
          animation-delay: 0.1s;
        }

        .animation-delay-200 {
          animation-delay: 0.2s;
        }

        .animation-delay-300 {
          animation-delay: 0.3s;
        }

        .animation-delay-400 {
          animation-delay: 0.4s;
        }

        .animation-delay-500 {
          animation-delay: 0.5s;
        }
      `}</style>
    </section>
  );
};

export default Hero;