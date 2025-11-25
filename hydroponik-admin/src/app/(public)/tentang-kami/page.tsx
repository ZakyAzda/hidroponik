import React from 'react';
import Image from 'next/image';
import { Reveal } from '@/components/ui/Reveal'; // Pastikan path Reveal benar
import { Target, Heart, Users, Sprout, Award, Leaf, Quote } from 'lucide-react';

export const metadata = {
  title: 'Tentang Kami - Arif Hidrofarm',
  description: 'Cerita perjalanan kami membangun ekosistem pertanian hidroponik modern di Indonesia.',
};

// Data Dummy Tim (Nanti ganti foto asli leek)
const teamMembers = [
  {
    id: 1,
    name: "Arif Setiawan",
    role: "Founder & CEO",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=800&auto=format&fit=crop",
    bio: "Pecinta tanaman yang bermimpi menghijaukan perkotaan dengan teknologi."
  },
  {
    id: 2,
    name: "Sarah Amalia",
    role: "Head of Agronomy",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop",
    bio: "Ahli nutrisi tanaman dengan pengalaman 10 tahun di industri pertanian."
  },
  {
    id: 3,
    name: "Budi Santoso",
    role: "Lead Technician",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=800&auto=format&fit=crop",
    bio: "Master perakitan greenhouse dan sistem irigasi otomatis."
  }
];

const stats = [
  { label: "Proyek Selesai", value: "150+", icon: <Award size={24} /> },
  { label: "Petani Dibina", value: "500+", icon: <Users size={24} /> },
  { label: "Bibit Terjual", value: "10k+", icon: <Sprout size={24} /> },
  { label: "Kepuasan", value: "99%", icon: <Heart size={24} /> },
];

export default function AboutPage() {
  return (
    <main className="bg-[#F4FFF8] overflow-hidden">
      
     {/* --- SECTION 1: HERO STORY --- */}
      <section className="relative pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-6xl">
          
          {/* Judul Utama */}
          <Reveal>
            <div className="text-center max-w-3xl mx-auto mb-12">
              <span className="text-[#3E8467] font-bold tracking-wider uppercase text-sm mb-2 block">Perjalanan Kami</span>
              <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6 leading-tight">
                Menanam <span className="text-[#3E8467]">Harapan</span> untuk Masa Depan Pangan.
              </h1>
            </div>
          </Reveal>

          {/* Image Banner */}
          <Reveal delay={200}>
            <div className="relative w-full h-[400px] md:h-[500px] rounded-3xl overflow-hidden shadow-2xl mb-16">
              <Image 
                src="https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?q=80&w=2000&auto=format&fit=crop"
                alt="Kebun Hidroponik"
                fill
                className="object-cover hover:scale-105 transition-transform duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              <div className="absolute bottom-8 left-8 md:bottom-12 md:left-12 text-white">
                <p className="text-xl font-medium">Est. 2023</p>
                <h3 className="text-3xl font-bold">Padang, Indonesia</h3>
              </div>
            </div>
          </Reveal>

          {/* --- BAGIAN BARU: THE ORIGIN STORY (DIMANA & KENAPA) --- */}
          <Reveal delay={400}>
            <div className="max-w-4xl mx-auto bg-white rounded-2xl p-8 md:p-12 shadow-lg border border-[#3E8467]/10 relative mt-[-80px] z-10">
              {/* Ikon Kutipan Dekoratif */}
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-[#3E8467] text-white p-4 rounded-full shadow-lg">
                <Quote size={24} fill="currentColor" />
              </div>

              <div className="text-center space-y-6 pt-4">
                <h3 className="text-2xl font-bold text-gray-800">
                  Lahir di Kota Padang, Tumbuh dari Keresahan.
                </h3>
                <p className="text-gray-600 text-lg leading-relaxed font-medium">
                  "Semua bermula pada tahun 2023, ketika kami menyadari betapa sulitnya mendapatkan sayuran yang benar-benar <span className="text-[#3E8467] font-bold">segar, bersih, dan bebas pestisida</span> di tengah hiruk pikuk perkotaan."
                </p>
                <p className="text-gray-500 leading-relaxed">
                  Kami percaya bahwa keterbatasan lahan bukanlah akhir dari pertanian. Arif Hidrofarm diciptakan bukan sekadar untuk berjualan alat, tapi untuk membuktikan bahwa siapa saja—di mana saja—bisa menjadi petani modern dan menyajikan makanan terbaik untuk keluarga mereka langsung dari pekarangan rumah sendiri.
                </p>
                
                {/* Tanda Tangan Digital (Opsional, biar keren) */}
                <div className="pt-4">
                  <p className="font-handwriting text-3xl text-[#3E8467] opacity-80">Arif Setiawan</p>
                  <p className="text-xs text-gray-400 uppercase tracking-widest mt-2">Founder Arif Hidrofarm</p>
                </div>
              </div>
            </div>
          </Reveal>
          {/* ------------------------------------------------------- */}

        </div>
      </section>

      {/* --- SECTION 2: VISI & MISI (Card Grid) --- */}
      <section className="py-20 px-6 relative">
        {/* Background Decoration */}
        <div className="absolute top-0 left-0 w-full h-1/2 bg-[#3E8467]/5 skew-y-3 transform origin-top-left -z-10"></div>

        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            
            {/* Left: Content */}
            <div className="space-y-8">
              <Reveal>
                <div className="bg-white p-8 rounded-2xl shadow-lg border-l-4 border-[#3E8467]">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-green-100 rounded-full text-[#3E8467]">
                      <Target size={28} />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800">Visi Kami</h3>
                  </div>
                  <p className="text-gray-600 leading-relaxed">
                    Menjadi penggerak utama revolusi pertanian perkotaan yang berkelanjutan, 
                    memastikan setiap rumah tangga memiliki akses ke sumber makanan sehat dan segar.
                  </p>
                </div>
              </Reveal>

              <Reveal delay={200}>
                <div className="bg-white p-8 rounded-2xl shadow-lg border-l-4 border-[#70B398]">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-teal-100 rounded-full text-teal-600">
                      <Leaf size={28} />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800">Misi Kami</h3>
                  </div>
                  <ul className="space-y-3 text-gray-600">
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">✓</span> Menyediakan alat hidroponik berkualitas tinggi & terjangkau.
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">✓</span> Mengedukasi masyarakat tentang kemudahan bertani modern.
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-1">✓</span> Memberikan layanan pendampingan dari nol hingga panen.
                    </li>
                  </ul>
                </div>
              </Reveal>
            </div>

            {/* Right: Image Collage */}
            <Reveal delay={400}>
              <div className="relative">
                <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
                  <Image 
                    src="https://images.unsplash.com/photo-1550989460-0adf9ea622e2?q=80&w=800&auto=format&fit=crop"
                    alt="Misi"
                    width={600}
                    height={800}
                    className="object-cover"
                  />
                </div>
                {/* Floating Image */}
                <div className="absolute -bottom-10 -left-10 w-48 h-48 rounded-2xl overflow-hidden shadow-xl border-4 border-white z-20 hidden md:block">
                  <Image 
                    src="data:image/jpeg;base64,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"
                    alt="Detail Tanaman"
                    fill
                    className="object-cover"
                  />
                </div>
                {/* Dot Pattern */}
                <div className="absolute -top-10 -right-10 w-32 h-32 opacity-20">
                  <svg width="100%" height="100%" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <pattern id="dotPattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                      <circle cx="2" cy="2" r="2" fill="#3E8467" />
                    </pattern>
                    <rect width="100%" height="100%" fill="url(#dotPattern)" />
                  </svg>
                </div>
              </div>
            </Reveal>

          </div>
        </div>
      </section>

      {/* --- SECTION 3: STATISTIK --- */}
      <section className="bg-[#3E8467] py-16 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, idx) => (
              <Reveal key={idx} delay={idx * 100}>
                <div className="p-4 text-white group hover:-translate-y-2 transition-transform duration-300">
                  <div className="flex justify-center mb-4 text-green-200 group-hover:text-white transition-colors">
                    {stat.icon}
                  </div>
                  <div className="text-4xl md:text-5xl font-bold mb-2">{stat.value}</div>
                  <div className="text-sm md:text-base text-green-100 uppercase tracking-wider">{stat.label}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* --- SECTION 4: MEET THE TEAM --- */}
      <section className="py-24 px-6">
        <div className="container mx-auto max-w-6xl">
          
          <Reveal>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800">Di Balik Layar</h2>
              <p className="text-gray-500 mt-4">Orang-orang berdedikasi yang membuat ini semua terjadi.</p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamMembers.map((member, idx) => (
              <Reveal key={member.id} delay={idx * 200}>
                <div className="bg-white rounded-2xl overflow-hidden shadow-lg group hover:shadow-2xl transition-all duration-300">
                  {/* Photo */}
                  <div className="relative h-80 overflow-hidden">
                    <Image 
                      src={member.image}
                      alt={member.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    {/* Overlay on Hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                      <p className="text-white text-sm italic">"{member.bio}"</p>
                    </div>
                  </div>
                  {/* Info */}
                  <div className="p-6 text-center">
                    <h3 className="text-xl font-bold text-gray-800">{member.name}</h3>
                    <p className="text-[#3E8467] font-medium">{member.role}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

        </div>
      </section>

    </main>
  );
}