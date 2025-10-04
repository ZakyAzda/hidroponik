'use client';

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Box, Book, ShoppingCart, User, LogOut, BarChart3, Settings, ChevronRight } from "lucide-react";
import withAuth from "./withAuth";
import api from "../lib/api";

// ... (Interface dan komponen StatCard, QuickActionCard tetap sama) ...
interface UserProfile { name: string; email: string; role: string; }
interface DashboardStats { productCount: number; orderCount: number; bookingCount: number; }

function StatCard({ title, value, icon, trend }: { title: string, value: number, icon: React.ReactNode, trend?: string }) {
    // ... (Isi komponen tidak berubah)
    return (
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 group">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-500 mb-2">{title}</p>
              <p className="text-3xl font-bold text-gray-900 mb-1">{value.toLocaleString()}</p>
              {trend && (
                <p className="text-xs text-green-600 font-medium">{trend}</p>
              )}
            </div>
            <div className="bg-gray-100 p-3 rounded-lg group-hover:bg-gray-800 group-hover:text-white transition-all duration-300">
              {icon}
            </div>
          </div>
        </div>
      );
}

function QuickActionCard({ title, description, icon, onClick }: { title: string, description: string, icon: React.ReactNode, onClick: () => void }) {
    // ... (Isi komponen tidak berubah)
    return (
        <button
          onClick={onClick}
          className="w-full bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl hover:border-gray-300 transition-all duration-300 text-left group"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-start space-x-4">
              <div className="bg-gray-100 p-3 rounded-lg group-hover:bg-gray-800 group-hover:text-white transition-all duration-300">
                {icon}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
                <p className="text-sm text-gray-500">{description}</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors duration-300" />
          </div>
        </button>
      );
}

// Mengubah nama fungsi ini agar konsisten
function DashboardPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, statsRes] = await Promise.all([
          api.get('/auth/profile'),
          api.get('/dashboard/stats')
        ]);
        setProfile(profileRes.data);
        setStats(statsRes.data);
      } catch (error) {
        console.error("Gagal mengambil data dashboard:", error);
        localStorage.removeItem('access_token');
        router.push('/');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    router.push('/');
  };

  const handleNavigate = (path: string) => {
    router.push(path);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-300 border-t-gray-800 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    // ... (Seluruh isi JSX Anda tidak berubah)
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="bg-gray-800 p-2 rounded-lg">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium text-gray-900">{profile?.name}</p>
                <p className="text-xs text-gray-500">{profile?.role}</p>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
              >
                <LogOut className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Selamat datang kembali, {profile?.name}!
          </h2>
          <p className="text-gray-600">
            Berikut adalah ringkasan aktivitas dashboard Anda hari ini.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {stats ? (
            <>
              <StatCard title="Total Produk" value={stats.productCount} icon={<Box className="w-6 h-6" />} />
              <StatCard title="Total Pesanan" value={stats.orderCount} icon={<ShoppingCart className="w-6 h-6" />} />
              <StatCard title="Total Booking Jasa" value={stats.bookingCount} icon={<Book className="w-6 h-6" />} />
            </>
          ) : ( <p>Loading stats...</p> )}
        </div>
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Aksi Cepat</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <QuickActionCard title="Manajemen Produk" description="Kelola produk, tambah produk baru, atau update inventory" icon={<Box className="w-6 h-6" />} onClick={() => handleNavigate('/dashboard/products')} />
            <QuickActionCard title="Kelola Pesanan" description="Lihat dan proses pesanan dari pelanggan" icon={<ShoppingCart className="w-6 h-6" />} onClick={() => handleNavigate('/dashboard/orders')} />
            <QuickActionCard title="Booking Jasa" description="Kelola booking jasa dan jadwal layanan" icon={<Book className="w-6 h-6" />} onClick={() => handleNavigate('/dashboard/bookings')} />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center space-x-4 mb-4">
              <div className="bg-gray-100 p-3 rounded-lg">
                <User className="w-6 h-6 text-gray-700" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Informasi Profil</h4>
                <p className="text-sm text-gray-500">Detail akun administrator</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Nama:</span>
                <span className="text-sm font-medium text-gray-900">{profile?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Email:</span>
                <span className="text-sm font-medium text-gray-900">{profile?.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Role:</span>
                <span className="text-sm font-medium text-gray-900">{profile?.role}</span>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center space-x-4 mb-4">
              <div className="bg-gray-100 p-3 rounded-lg">
                <Settings className="w-6 h-6 text-gray-700" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Pengaturan Sistem</h4>
                <p className="text-sm text-gray-500">Konfigurasi dan preferensi</p>
              </div>
            </div>
            <button
              onClick={() => handleNavigate('/dashboard/settings')}
              className="w-full mt-4 px-4 py-2 bg-gray-800 hover:bg-black text-white rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <Settings className="w-4 h-4" />
              <span>Buka Pengaturan</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

// Mengganti nama `DashboardPageComponent` dengan `DashboardPage` agar cocok
export default withAuth(DashboardPage);