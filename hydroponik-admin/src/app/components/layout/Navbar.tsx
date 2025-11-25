'use client';

import Link from 'next/link';
import React, { useState, useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import Image from 'next/image';
// Pastikan path import store benar
import { useCartStore } from '@/app/lib/useCartStore'; 
import { useAuthStore } from '@/store/authStore'; 
import { LayoutDashboard, LogOut, User, Search, ShoppingCart, Package, UserCog, ChevronDown } from 'lucide-react';

type SearchResult = {
  id: number; title: string; imageUrl: string | null; type: 'produk' | 'artikel' | 'jasa'; price?: number; url: string;
};

const Navbar = () => {
  const [isSticky, setSticky] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [mounted, setMounted] = useState(false); // Untuk menangani hydration

  // --- PERBAIKAN UTAMA DI SINI ---
  // 1. Jangan pakai useState lokal untuk user.
  // 2. Ambil langsung 'user' dari Store Zustand agar REAKTIF (Berubah otomatis).
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser); // Kita butuh ini untuk load dari localStorage saat refresh
  const openLogin = useAuthStore((state) => state.openLogin);
  const logout = useAuthStore((state) => state.logout);

  const cartItems = useCartStore((state) => state.items);
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const pathname = usePathname();
  const router = useRouter();
  const searchInputRef = useRef<HTMLInputElement>(null);

  const getBadgeColor = (type: string) => {
    switch (type) {
      case 'produk': return 'bg-green-100 text-green-700';
      case 'jasa': return 'bg-purple-100 text-purple-700';
      case 'artikel': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const navLinks = [
    { name: 'Beranda', href: '/' },
    { name: 'Produk', href: '/produk' },
    { name: 'Jasa', href: '/jasa' },
    { name: 'Tentang Kami', href: '/tentang-kami' },
    { name: 'Artikel', href: '/artikel' },
  ];

  // --- EFEK SAAT MOUNT (REFRESH HALAMAN) ---
  useEffect(() => {
    const handleScroll = () => setSticky(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    
    setMounted(true);

    // Cek LocalStorage saat halaman di-refresh.
    // Jika ada data, masukkan kembali ke Zustand Store agar user tetap login.
    const storedUser = localStorage.getItem('user_data');
    const storedToken = localStorage.getItem('access_token');
    
    if (storedUser && storedToken) {
      try {
        // Ini yang membuat Navbar "ingat" kalau user sudah login setelah refresh
        setUser(JSON.parse(storedUser)); 
        useAuthStore.getState().setToken(storedToken);
      } catch (e) {
        console.error("Gagal load user", e);
      }
    }

    return () => window.removeEventListener('scroll', handleScroll);
  }, [setUser]); // Dependency array

  useEffect(() => { if (isSearchOpen && searchInputRef.current) searchInputRef.current.focus(); }, [isSearchOpen]);

  // --- LOGIKA SEARCH ---
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.length > 2) {
        setIsSearching(true);
        try {
          const keyword = searchQuery.toLowerCase();
          const [productsRes, articlesRes, servicesRes] = await Promise.allSettled([
            fetch('http://localhost:3000/products').then(res => res.json()),
            fetch('http://localhost:3000/articles').then(res => res.json()),
            fetch('http://localhost:3000/services').then(res => res.json())
          ]);

          let combinedResults: SearchResult[] = [];

          // Helper process
          const process = (res: any, type: any) => {
             if (res.status === 'fulfilled' && Array.isArray(res.value)) {
                return res.value.filter((i: any) => (i.name || i.title).toLowerCase().includes(keyword))
                .slice(0, 2).map((i: any) => ({
                   id: i.id, title: i.name || i.title, imageUrl: i.imageUrl, type, price: i.price, url: `/${type}/${i.id}`
                }));
             }
             return [];
          };

          combinedResults = [
             ...process(productsRes, 'produk'),
             ...process(servicesRes, 'jasa'),
             ...process(articlesRes, 'artikel')
          ];
          setResults(combinedResults);
        } catch (error) { console.error(error); } finally { setIsSearching(false); }
      } else { setResults([]); }
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/produk?q=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
    }
  };

  // Fungsi Logout yang memanggil store
  const handleLogout = () => {
    logout(); // Panggil fungsi dari store
    // Optional: router.refresh() jika logout() di store belum melakukannya
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 py-4 px-4 md:px-6">
        <div className={cn(
          "mx-auto container bg-gradient-to-r from-[#CDEEDA] to-[#D5F2E3] rounded-full p-4 flex justify-between items-center border border-[#70B398]/20",
          "transition-all duration-500 ease-in-out",
          isSticky ? "shadow-2xl shadow-[#70B398]/30" : "shadow-lg hover:shadow-xl"
        )}>
           
           {/* Logo */}
           <Link href="/" className="flex items-center space-x-3 group">
             <div className="relative">
                <div className="absolute inset-0 bg-[#70B398]/20 rounded-full blur-md group-hover:blur-lg transition-all duration-300"></div>
                <Image src="/images/logo.png" alt="Logo" width={45} height={45} />
             </div>
             <div className="flex flex-col">
                <span className="text-gray-900 text-xl font-bold tracking-tight leading-none group-hover:text-[#70B398] transition-colors duration-300" style={{ fontFamily: "'Poppins', sans-serif" }}>Arif Hidrofarm</span>
                <span className="text-xs text-gray-600 font-medium tracking-wide" style={{ fontFamily: "'Inter', sans-serif" }}>Hidroponik Berkualitas</span>
             </div>
          </Link>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center space-x-2">
            {navLinks.map((link) => (
               <Link key={link.href} href={link.href} className={cn("text-sm font-semibold px-5 py-2.5 rounded-full transition-all", pathname === link.href ? "bg-white shadow-md text-gray-900" : "text-gray-800 hover:bg-white/60 hover:text-[#70B398]")}>
                 <span className="relative z-10">{link.name}</span>
               </Link>
            ))}
          </nav>

           {/* Action Buttons */}
          <div className="flex items-center space-x-3">
            
            {/* Search */}
            <button onClick={() => setIsSearchOpen(true)} className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-[#70B398] hover:text-white transition-all shadow-sm hover:shadow-md group">
              <Search className="w-5 h-5 text-gray-700 group-hover:text-white transition-colors" />
            </button>
            
            {/* Cart */}
            <Link href="/cart">
              <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-[#70B398] hover:text-white transition-all shadow-md relative">
                <ShoppingCart className="w-5 h-5 text-gray-700 group-hover:text-white transition-colors" />
                {mounted && cartCount > 0 && (
                  <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full ring-2 ring-white animate-bounce">{cartCount}</span>
                )}
              </button>
            </Link>

            {/* --- LOGIKA TOMBOL AUTH (REAKTIF) --- */}
            {mounted && user ? (
               // JIKA USER ADA (SUDAH LOGIN) -> TAMPILKAN AVATAR & DROPDOWN
               <div className="relative group z-50">
                 <div className="flex items-center gap-2 cursor-pointer py-1 px-2 rounded-full hover:bg-white/50 transition-all">
                   <div className="w-10 h-10 bg-[#3E8467] rounded-full flex items-center justify-center text-white font-bold shadow-md border-2 border-white">
                      {user.name ? user.name.charAt(0).toUpperCase() : <User size={20}/>}
                   </div>
                   <ChevronDown size={16} className="text-gray-600 md:block hidden transition-transform group-hover:rotate-180" />
                 </div>
                 
                 {/* DROPDOWN MENU */}
                 <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right z-[100]">
                    
                    <div className="px-5 py-4 border-b border-gray-50 bg-gray-50/50">
                      <p className="text-xs text-gray-500 font-medium mb-1">Halo, selamat datang</p>
                      <p className="text-sm font-bold text-gray-900 truncate">{user.name}</p>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full mt-2 inline-block font-bold uppercase tracking-wider ${user.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'}`}>
                        {user.role}
                      </span>
                    </div>

                    <div className="p-2 space-y-1">
                      {/* 1. ADMIN DASHBOARD (Hanya muncul jika Role ADMIN) */}
                      {user.role === 'ADMIN' && (
                        <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700 rounded-lg transition-colors font-medium">
                          <LayoutDashboard size={18} /> Admin Dashboard
                        </Link>
                      )}

                      {/* 2. MENU UMUM */}
                      <Link href="/profile" className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 hover:bg-green-50 hover:text-[#3E8467] rounded-lg transition-colors">
                        <UserCog size={18} /> Kelola Profil
                      </Link>
                      <Link href="/profile" className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 hover:bg-green-50 hover:text-[#3E8467] rounded-lg transition-colors">
                        <Package size={18} /> Riwayat Pemesanan
                      </Link>
                    </div>

                    <div className="h-px bg-gray-100 mx-2"></div>

                    {/* 3. LOGOUT */}
                    <div className="p-2">
                      <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-lg w-full text-left transition-colors font-medium">
                         <LogOut size={18} /> Keluar
                      </button>
                    </div>
                 </div>
               </div>
            ) : (
               // JIKA BELUM LOGIN -> TAMPILKAN TOMBOL MASUK
               <button 
                 onClick={openLogin} // Memanggil Modal
                 className="bg-gradient-to-r from-[#70B398] to-[#5fa085] text-white text-sm font-semibold px-6 py-2.5 rounded-full hover:shadow-lg hover:scale-105 transition-all duration-300 shadow-md" 
                 style={{ fontFamily: "'Inter', sans-serif" }}
               >
                 Masuk
               </button>
            )}
          </div>
        </div>
      </header>

      {/* Search Overlay (Pastikan bagian ini ada di kode Anda, saya singkat disini) */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-[60] flex items-start justify-center pt-32 px-4">
           <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsSearchOpen(false)}></div>
           {/* ... Isi Modal Search (sama seperti sebelumnya) ... */}
        </div>
      )}
    </>
  );
};

export default Navbar;