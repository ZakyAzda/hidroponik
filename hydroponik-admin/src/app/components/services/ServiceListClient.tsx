'use client';

import React, { useState, useMemo } from 'react';
import ServiceCard from './ServiceCard';
import { Search, Filter, ArrowUpDown } from 'lucide-react';

const ServiceListClient = ({ initialServices }: { initialServices: any[] }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('default');

  // 1. Ambil Kategori Unik dari Data Services
  const categories = useMemo(() => {
    if (!Array.isArray(initialServices)) return [];
    const uniqueCats = new Set(initialServices.map(s => s.category?.name).filter(Boolean));
    return Array.from(uniqueCats);
  }, [initialServices]);

  // 2. Filter Logic (Search, Category, Sort)
  const filteredServices = useMemo(() => {
    let filtered = Array.isArray(initialServices) ? [...initialServices] : [];
    
    // A. Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(service => 
        service.name.toLowerCase().includes(q) ||
        service.description?.toLowerCase().includes(q)
      );
    }

    // B. Kategori
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(service => 
        service.category?.name === selectedCategory
      );
    }

    // C. Sort
    if (sortBy === 'price-low') {
      filtered.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (sortBy === 'price-high') {
      filtered.sort((a, b) => Number(b.price) - Number(a.price));
    } else if (sortBy === 'name-asc') {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'name-desc') {
      filtered.sort((a, b) => b.name.localeCompare(a.name));
    }
    
    return filtered;
  }, [initialServices, searchQuery, selectedCategory, sortBy]);

  return (
    <section className="relative bg-[#F4FFF8] py-20 px-6 min-h-screen overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#70B398]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#3E8467]/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
      
      <div className="container mx-auto max-w-7xl relative z-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="space-y-2">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 flex items-center gap-3">
              <span className="animate-bounce inline-block">🛠️</span>
              <span className="bg-gradient-to-r from-[#3E8467] to-[#70B398] bg-clip-text text-transparent">
                Layanan Kami
              </span>
            </h2>
            <p className="text-gray-500 text-sm md:text-base">Solusi profesional untuk kebutuhan pertanian Anda</p>
          </div>
        </div>

        {/* --- FILTER BAR (Style Modern) --- */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-10 flex flex-col md:flex-row gap-4 items-center">
          
          {/* 1. Search Input */}
          <div className="relative flex-1 group w-full">
             <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
               <Search className="h-5 w-5 text-gray-400 group-focus-within:text-[#70B398] transition-colors" />
             </div>
             <input
              type="text"
              placeholder="Cari layanan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-[#70B398] focus:ring-4 focus:ring-[#70B398]/10 outline-none transition-all text-gray-700 placeholder-gray-400 shadow-sm"
            />
          </div>

          {/* 2. Category Filter */}
          <div className="relative w-full md:w-auto min-w-[200px]">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
               <Filter className="h-4 w-4 text-gray-500" />
            </div>
            <select 
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full pl-10 pr-8 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-[#70B398] outline-none appearance-none cursor-pointer text-sm font-medium text-gray-700 shadow-sm"
            >
              <option value="all">Semua Kategori</option>
              {categories.map((cat: string, index: number) => (
                <option key={index} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* 3. Sort Filter */}
          <div className="relative w-full md:w-auto min-w-[200px]">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
               <ArrowUpDown className="h-4 w-4 text-gray-500" />
            </div>
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full pl-10 pr-8 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-[#70B398] outline-none appearance-none cursor-pointer text-sm font-medium text-gray-700 shadow-sm"
            >
              <option value="default">Urutkan: Default</option>
              <option value="price-low">Harga: Terendah</option>
              <option value="price-high">Harga: Tertinggi</option>
              <option value="name-asc">Nama: A - Z</option>
              <option value="name-desc">Nama: Z - A</option>
            </select>
          </div>

        </div>

        {/* --- CONTENT GRID --- */}
        {filteredServices.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredServices.map((service: any, index: number) => (
              <div 
                key={service.id}
                className="animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-forwards"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <ServiceCard service={service} />
              </div>
            ))}
          </div>
        ) : (
          // EMPTY STATE
          <div className="text-center py-24 bg-white/60 backdrop-blur-sm rounded-3xl border-2 border-dashed border-gray-200">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <Search className="text-gray-400" size={32} />
            </div>
            <h3 className="text-xl font-semibold text-gray-700">Layanan tidak ditemukan</h3>
            <p className="text-gray-500 mt-2">Coba ubah kata kunci atau reset filter.</p>
            <button 
              onClick={() => {setSearchQuery(''); setSelectedCategory('all');}}
              className="mt-6 text-[#3E8467] font-semibold hover:underline"
            >
              Reset Filter
            </button>
          </div>
        )}

      </div>
    </section>
  );
};

export default ServiceListClient;