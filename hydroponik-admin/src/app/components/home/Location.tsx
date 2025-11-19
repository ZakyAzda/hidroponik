/* eslint-disable @next/next/no-img-element */
import React from 'react';
import Link from 'next/link';

const Location = () => {
  return (
    <section className="bg-[#F4FFF8] py-16 px-6">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold mb-8">📍 Kunjungi Kami</h2>
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="grid md:grid-cols-3">
            {/* Address */}
            <div className="p-6 md:col-span-1">
              <address className="not-italic text-black">
                Jln bawah, buluh, <br />
                Kecamatan Pauh, <br />
                Kota Padang, <br />
                Sumatera Barat, <br />
                Indonesia 25147
              </address>
              <Link href="#" className="mt-4 inline-block bg-[#70B398] text-white font-semibold px-4 py-2 rounded-lg hover:bg-opacity-90">
                Lihat pada Peta →
              </Link>
            </div>
            {/* Map Image */}
            <div className="md:col-span-2 h-64 md:h-full">
              <img src="https://placehold.co/399x239" alt="Peta Lokasi" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Location;
