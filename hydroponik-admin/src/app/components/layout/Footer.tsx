import Link from 'next/link';
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-[#CDEEDA] pt-12 pb-4">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Column 1: Brand */}
          <div>
            <h2 className="text-black text-lg font-bold font-['Alkatra'] mb-2">🌿 arifhidrofarm</h2>
            <p className="text-black text-sm">
              Nikmati sayuran sehat, segar, dan bebas pestisida langsung dari kebun hidroponik kami ke meja makan Anda.
            </p>
          </div>

          {/* Column 2: Quick Menu */}
          <div>
            <h3 className="text-black text-md font-semibold mb-2">Menu Cepat</h3>
            <ul className="space-y-2">
              <li><Link href="/" className="text-black text-sm hover:underline">Home</Link></li>
              <li><Link href="/produk" className="text-black text-sm hover:underline">Produk</Link></li>
              <li><Link href="/tentang-kami" className="text-black text-sm hover:underline">Tentang Kami</Link></li>
              <li><Link href="/kontak" className="text-black text-sm hover:underline">Kontak</Link></li>
            </ul>
          </div>

          {/* Column 3: Contact */}
          <div>
            <h3 className="text-black text-md font-semibold mb-2">Hubungi Kami</h3>
            <ul className="space-y-2 text-sm">
              <li>arifhidrofarm@gmail.com</li>
              <li>+62 823-2547-9897</li>
              <li>Padang, West Sumatera</li>
            </ul>
          </div>

          {/* Column 4: Social Media */}
          <div>
            <h3 className="text-black text-md font-semibold mb-2">Sosial Media</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-black text-sm hover:underline">Twitter</a></li>
              <li><a href="#" className="text-black text-sm hover:underline">Instagram</a></li>
              <li><a href="#" className="text-black text-sm hover:underline">Youtube</a></li>
              <li><a href="#" className="text-black text-sm hover:underline">Tiktok</a></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="bg-[#434343] mt-8 py-2">
        <div className="container mx-auto px-6 flex justify-between items-center text-white text-xs">
          <p>© 2025 arifhidrofarm. Alright Reserved.| Memberdayakan Tanaman dengan Teknologi Modern.</p>
          <div className="flex space-x-4">
            <Link href="/privacy" className="hover:underline">Privacy Policy</Link>
            <Link href="/terms" className="hover:underline">Term of Services</Link>
            <Link href="/support" className="hover:underline">Support</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
