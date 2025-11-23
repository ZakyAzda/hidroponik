'use client';

import Link from 'next/link';
import React, { useState, useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import Image from 'next/image';
// Pastikan path ini benar mengarah ke file di dalam src/app/lib
import { useCartStore } from '@/app/lib/useCartStore';
// 1. IMPORT AUTH STORE (Sesuaikan path jika folder store Anda berbeda)
import { useAuthStore } from '@/store/authStore'; 
import { LayoutDashboard, LogOut, User, Search, ShoppingCart } from 'lucide-react';

type SearchResult = {
  id: number; 
  title: string; 
  imageUrl: string | null; 
  type: 'produk' | 'artikel' | 'jasa'; 
  price?: number; 
  url: string;
};

const Navbar = () => {
  const [isSticky, setSticky] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  // State User & Auth
  const [user, setUser] = useState<any>(null);
  const [mounted, setMounted] = useState(false);

  // 2. AMBIL FUNGSI OPEN LOGIN DARI STORE
  const openLogin = useAuthStore((state) => state.openLogin);

  // Cart
  const cartItems = useCartStore((state) => state.items);
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const pathname = usePathname();
  const router = useRouter();
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Helper warna badge
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

  useEffect(() => {
    const handleScroll = () => setSticky(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    
    // LOAD USER
    setMounted(true);
    const storedUser = localStorage.getItem('user_data');
    if (storedUser) {
      try { setUser(JSON.parse(storedUser)); } catch (e) {}
    }

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

          if (productsRes.status === 'fulfilled' && Array.isArray(productsRes.value)) {
            const items = productsRes.value
              .filter((p: any) => p.name.toLowerCase().includes(keyword))
              .slice(0, 3)
              .map((p: any) => ({
                id: p.id, title: p.name, imageUrl: p.imageUrl, type: 'produk' as const, price: p.price, url: `/produk/${p.id}`
              }));
            combinedResults = [...combinedResults, ...items];
          }

          if (servicesRes.status === 'fulfilled' && Array.isArray(servicesRes.value)) {
            const items = servicesRes.value
              .filter((s: any) => s.name.toLowerCase().includes(keyword))
              .slice(0, 2)
              .map((s: any) => ({
                id: s.id, title: s.name, imageUrl: s.imageUrl, type: 'jasa' as const, price: s.price, url: `/jasa/${s.id}`
              }));
            combinedResults = [...combinedResults, ...items];
          }

          if (articlesRes.status === 'fulfilled' && Array.isArray(articlesRes.value)) {
            const items = articlesRes.value
              .filter((a: any) => a.title.toLowerCase().includes(keyword))
              .slice(0, 2)
              .map((a: any) => ({
                id: a.id, title: a.title, imageUrl: a.imageUrl, type: 'artikel' as const, price: undefined, url: `/artikel/${a.id}`
              }));
            combinedResults = [...combinedResults, ...items];
          }
          setResults(combinedResults);
        } catch (error) {
          console.error("Search Error:", error);
        } finally {
          setIsSearching(false);
        }
      } else {
        setResults([]);
      }
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

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_data');
    setUser(null);
    router.push('/');
    router.refresh();
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
                <Image src="/images/logo.png" alt="Logo" width={56} height={56} />
             </div>
             <div className="flex flex-col">
                <span className="text-gray-900 text-xl font-bold tracking-tight leading-none group-hover:text-[#70B398] transition-colors duration-300" style={{ fontFamily: "'Poppins', sans-serif" }}>Arif Hidrofarm</span>
                <span className="text-xs text-gray-600 font-medium tracking-wide" style={{ fontFamily: "'Inter', sans-serif" }}>Hidroponik Berkualitas</span>
             </div>
          </Link>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center space-x-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link key={link.href} href={link.href} className={cn("relative text-sm font-semibold px-5 py-2.5 rounded-full transition-all duration-300 group", "style={{ fontFamily: \"'Inter', sans-serif\" }}", isActive ? "text-gray-900 bg-white shadow-md" : "text-gray-800 hover:bg-white/60 hover:text-[#70B398]")}>
                  <span className="relative z-10">{link.name}</span>
                </Link>
              );
            })}
          </nav>

           {/* Action Buttons */}
          <div className="flex items-center space-x-3">
            
            {/* 1. TOMBOL DASHBOARD (ADMIN ONLY) */}
            {mounted && user?.role === 'ADMIN' && (
              <Link href="/dashboard">
                <button className="hidden md:flex items-center gap-2 bg-gray-900 text-white text-xs font-bold px-4 py-2.5 rounded-full hover:bg-gray-700 transition-all shadow-md border border-gray-700" title="Admin Dashboard">
                  <LayoutDashboard size={16} />
                  <span>Dashboard</span>
                </button>
              </Link>
            )}

            {/* Search */}
            <button onClick={() => setIsSearchOpen(true)} className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-[#70B398] hover:text-white transition-all duration-300 shadow-sm hover:shadow-md group">
              <Search className="w-5 h-5 text-gray-700 group-hover:text-white transition-colors" />
            </button>
            
            {/* Cart */}
            <Link href="/cart">
              <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-[#70B398] hover:text-white transition-all duration-300 shadow-sm hover:shadow-md group relative">
                <ShoppingCart className="w-5 h-5 text-gray-700 group-hover:text-white transition-colors" />
                {mounted && cartCount > 0 && (
                  <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full ring-2 ring-white animate-bounce">
                    {cartCount}
                  </span>
                )}
              </button>
            </Link>

            {/* Login / Profile */}
            {mounted && user ? (
               <div className="relative group z-50">
                 <div className="w-10 h-10 bg-[#3E8467] rounded-full flex items-center justify-center text-white font-bold cursor-pointer hover:scale-105 transition-transform shadow-md border-2 border-white">
                    {user.name ? user.name.charAt(0).toUpperCase() : <User size={20}/>}
                 </div>
                 <div className="absolute right-0 top-full mt-2 w-40 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right">
                    <div className="px-4 py-3 border-b border-gray-50 bg-gray-50">
                      <p className="text-xs text-gray-500">Halo,</p>
                      <p className="text-sm font-bold text-gray-800 truncate">{user.name}</p>
                    </div>
                    {/* Mobile Dashboard Link */}
                    {user.role === 'ADMIN' && (
                      <Link href="/dashboard" className="flex md:hidden items-center gap-2 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                        <LayoutDashboard size={14} /> Dashboard
                      </Link>
                    )}
                    <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-3 text-sm text-red-600 hover:bg-red-50 w-full text-left transition-colors">
                       <LogOut size={14} /> Keluar
                    </button>
                 </div>
               </div>
            ) : (
               // --- BAGIAN INI YANG DIUBAH ---
               // Menggunakan button onClick={openLogin} BUKAN Link href="/login"
               <button 
                  onClick={openLogin} // <--- INI KUNCINYA. Panggil fungsi, jangan pindah halaman!
                  className="bg-gradient-to-r from-[#70B398] to-[#5fa085] text-white text-sm font-semibold px-6 py-2.5 rounded-full hover:shadow-lg hover:scale-105 transition-all duration-300 shadow-md"
                >
                  Masuk
                </button>
              )}
          </div>
        </div>
      </header>

      {/* --- SEARCH MODAL OVERLAY --- */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-[60] flex items-start justify-center pt-32 px-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300" onClick={() => setIsSearchOpen(false)}></div>

          <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-4 animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[80vh]">
            <form onSubmit={handleSearchSubmit} className="relative flex items-center flex-shrink-0">
              <svg className="w-6 h-6 text-gray-400 absolute left-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              <input 
                ref={searchInputRef}
                type="text" 
                placeholder="Cari produk, jasa instalasi, atau tips..." 
                className="w-full pl-14 pr-12 py-4 text-lg text-gray-800 placeholder-gray-400 bg-gray-50 border-2 border-transparent rounded-xl focus:border-[#70B398] focus:bg-white focus:outline-none transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="button" onClick={() => setIsSearchOpen(false)} className="absolute right-3 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </form>

            <div className="mt-4 overflow-y-auto custom-scrollbar">
              {isSearching ? (
                <div className="text-center py-4 text-gray-500">Mencari...</div>
              ) : searchQuery.length > 2 && results.length > 0 ? (
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Hasil Pencarian</p>
                  
                  {results.map((item) => (
                    <Link 
                      key={`${item.type}-${item.id}`} 
                      href={item.url} 
                      onClick={() => setIsSearchOpen(false)}
                      className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-xl transition-colors group cursor-pointer"
                    >
                      <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        {item.imageUrl ? (
                          <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">No Img</div>
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800 group-hover:text-[#3E8467] line-clamp-1">{item.title}</h4>
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${getBadgeColor(item.type)}`}>
                            {item.type}
                          </span>
                          {item.price && (
                            <span className="text-xs text-gray-500 font-medium">
                              Rp {new Intl.NumberFormat('id-ID').format(item.price)}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <svg className="w-4 h-4 text-gray-300 group-hover:text-[#3E8467]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    </Link>
                  ))}
                  
                  <button onClick={handleSearchSubmit} className="w-full text-center py-3 text-sm text-[#3E8467] font-semibold hover:underline mt-2">
                    Lihat semua hasil untuk "{searchQuery}"
                  </button>
                </div>
              ) : searchQuery.length > 2 && results.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>Tidak ditemukan hasil untuk "{searchQuery}"</p>
                </div>
              ) : (
                <div className="px-2">
                   <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">Pencarian Populer</p>
                   <div className="flex flex-wrap gap-2">
                    {['Jasa Instalasi', 'Paket Pemula', 'Konsultasi', 'Selada'].map((tag) => (
                      <button key={tag} onClick={() => { setSearchQuery(tag); router.push(`/produk?q=${encodeURIComponent(tag)}`); setIsSearchOpen(false); }} className="px-3 py-1.5 bg-gray-100 hover:bg-[#E8F7F0] hover:text-[#3E8467] text-gray-600 text-sm rounded-lg transition-colors">
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;