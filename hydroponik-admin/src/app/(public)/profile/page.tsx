'use client';

import React, { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { User, MapPin, Package, LogOut } from 'lucide-react';
// Import Komponen Baru
import ProfileOrders from '@/app/components/profile/ProfileOrder';
import ProfileDetails from '@/app/components/profile/ProfileDetails';
import ProfileAddresses from '@/app/components/profile/ProfileAddresses';

export default function ProfilePage() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [activeMenu, setActiveMenu] = useState('orders'); 

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) router.push('/');
  }, [user]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#F4FFF8] pt-28 pb-20 px-4">
      <div className="max-w-6xl mx-auto">
        
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* --- SIDEBAR MENU --- */}
          <div className="w-full md:w-1/4 h-fit">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-[#3E8467]/10 sticky top-28">
              <div className="flex flex-col items-center text-center mb-8">
                <div className="w-20 h-20 bg-[#3E8467] rounded-full flex items-center justify-center text-white text-3xl font-bold mb-3 shadow-md border-4 border-green-50">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <h2 className="font-bold text-gray-800 text-lg truncate w-full">{user.name}</h2>
                <span className="mt-2 px-3 py-1 bg-green-100 text-green-700 text-[10px] font-bold rounded-full uppercase tracking-wider">
                  {user.role}
                </span>
              </div>

              <nav className="space-y-2">
                <button onClick={() => setActiveMenu('profile')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeMenu === 'profile' ? 'bg-[#3E8467] text-white shadow-md' : 'text-gray-600 hover:bg-green-50 hover:text-[#3E8467]'}`}>
                  <User size={18} /> Data Diri
                </button>
                <button onClick={() => setActiveMenu('orders')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeMenu === 'orders' ? 'bg-[#3E8467] text-white shadow-md' : 'text-gray-600 hover:bg-green-50 hover:text-[#3E8467]'}`}>
                  <Package size={18} /> Pesanan Saya
                </button>
                <button onClick={() => setActiveMenu('address')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeMenu === 'address' ? 'bg-[#3E8467] text-white shadow-md' : 'text-gray-600 hover:bg-green-50 hover:text-[#3E8467]'}`}>
                  <MapPin size={18} /> Alamat
                </button>
                <hr className="my-4 border-gray-100" />
                <button onClick={() => { logout(); }} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-all">
                  <LogOut size={18} /> Keluar
                </button>
              </nav>
            </div>
          </div>

          {/* --- KONTEN UTAMA (Clean & Modular) --- */}
          <div className="w-full md:w-3/4">
            <div className="bg-white rounded-2xl shadow-lg min-h-[600px] border border-[#3E8467]/10 overflow-hidden p-6">
              
              {/* Switch Component Berdasarkan Menu */}
              {activeMenu === 'orders' && <ProfileOrders />}
              {activeMenu === 'profile' && <ProfileDetails user={user} />}
              {activeMenu === 'address' && <ProfileAddresses />}

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}