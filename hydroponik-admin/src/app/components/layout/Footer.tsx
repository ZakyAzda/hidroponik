import Link from 'next/link';
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-[#CDEEDA] pt-16 pb-8">
      <div className="container mx-auto px-6">
        
        {/* Top Section: Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Column 1: Brand & About */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold font-['Alkatra'] flex items-center gap-2 text-[#0F392B]">
              <span>🌿</span> arifhidrofarm
            </h2>
            <p className="text-[#2C5F4B] text-sm leading-relaxed pr-4 font-medium">
              Menghadirkan kesegaran alami ke meja makan Anda. Sayuran hidroponik bebas pestisida, dipanen dengan cinta untuk kesehatan keluarga.
            </p>
          </div>

          {/* Column 2: Quick Menu */}
          <div>
            <h3 className="text-[#0F392B] text-lg font-bold mb-6 relative inline-block">
              Menu Cepat
              <span className="absolute -bottom-2 left-0 w-1/2 h-1 bg-[#2C5F4B] rounded-full"></span>
            </h3>
            <ul className="space-y-3">
              {['Home', 'Produk', 'Tentang Kami', 'Kontak'].map((item, idx) => (
                <li key={idx}>
                  <Link 
                    href={item === 'Home' ? '/' : `/${item.toLowerCase().replace(' ', '-')}`} 
                    className="text-[#2C5F4B] text-sm font-semibold hover:text-[#0F392B] hover:translate-x-2 transition-all duration-300 block"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact with Icons */}
          <div>
            <h3 className="text-[#0F392B] text-lg font-bold mb-6 relative inline-block">
              Hubungi Kami
              <span className="absolute -bottom-2 left-0 w-1/2 h-1 bg-[#2C5F4B] rounded-full"></span>
            </h3>
            <ul className="space-y-4 text-sm text-[#2C5F4B]">
              <li className="flex items-start space-x-3 group cursor-pointer">
                {/* Icon Box: Putih agar clean */}
                <div className="p-2 bg-white rounded-lg text-[#2C5F4B] shadow-sm group-hover:bg-[#0F392B] group-hover:text-white transition-colors duration-300">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                </div>
                <span className="mt-1 font-semibold group-hover:text-[#0F392B] transition-colors">arifhidrofarm@gmail.com</span>
              </li>
              <li className="flex items-start space-x-3 group cursor-pointer">
                <div className="p-2 bg-white rounded-lg text-[#2C5F4B] shadow-sm group-hover:bg-[#0F392B] group-hover:text-white transition-colors duration-300">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                </div>
                <span className="mt-1 font-semibold group-hover:text-[#0F392B] transition-colors">+62 823-2547-9897</span>
              </li>
              <li className="flex items-start space-x-3 group cursor-pointer">
                <div className="p-2 bg-white rounded-lg text-[#2C5F4B] shadow-sm group-hover:bg-[#0F392B] group-hover:text-white transition-colors duration-300">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                </div>
                <span className="mt-1 font-semibold group-hover:text-[#0F392B] transition-colors">Padang, West Sumatera</span>
              </li>
            </ul>
          </div>

          {/* Column 4: Social Media */}
          <div>
            <h3 className="text-[#0F392B] text-lg font-bold mb-6 relative inline-block">
              Ikuti Kami
              <span className="absolute -bottom-2 left-0 w-1/2 h-1 bg-[#2C5F4B] rounded-full"></span>
            </h3>
            <div className="flex gap-4">
               {/* Twitter / X */}
               <a href="#" className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-[#2C5F4B] hover:bg-[#0F392B] hover:text-white transition-all duration-300 hover:-translate-y-1">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
               </a>
               {/* Instagram */}
               <a href="#" className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-[#2C5F4B] hover:bg-[#E1306C] hover:text-white transition-all duration-300 hover:-translate-y-1">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01M7.5 3h9a6 6 0 016 6v9a6 6 0 01-6 6h-9a6 6 0 01-6-6v-9a6 6 0 016-6z" /></svg>
               </a>
               {/* TikTok */}
               <a href="#" className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-[#2C5F4B] hover:bg-black hover:text-white transition-all duration-300 hover:-translate-y-1">
                 <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/></svg>
               </a>
            </div>
            <p className="mt-6 text-xs text-[#2C5F4B] font-medium">
              Bergabunglah dengan komunitas kami.
            </p>
          </div>
        </div>

        {/* Bottom Section: Copyright & Legal */}
        {/* Menggunakan border gelap tipis agar terlihat rapi */}
        <div className="border-t border-[#A8D3C0] pt-8 mt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[#2C5F4B] text-xs font-semibold text-center md:text-left">
            © 2025 <span className="text-[#0F392B] font-bold">arifhidrofarm</span>. All Rights Reserved.
          </p>
          
          <div className="flex space-x-6 text-xs text-[#2C5F4B] font-semibold">
            <Link href="/privacy" className="hover:text-[#0F392B] transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-[#0F392B] transition-colors">Terms of Services</Link>
            <Link href="/support" className="hover:text-[#0F392B] transition-colors">Support</Link>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;