'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Package, Carrot, Atom, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

// Daftar item navigasi HANYA untuk produk
const navItems = [
  { href: '/dashboard', label: 'Dashboard Utama', icon: Home },
  { href: '/dashboard/products/alat', label: 'Alat Hidroponik', icon: Atom },
  { href: '/dashboard/products/sayuran', label: 'Sayuran & Melon', icon: Carrot },
];

export function ProductSidebar() {
  const pathname = usePathname();
  return (
    <aside className="hidden w-72 flex-col border-r bg-white p-4 lg:flex">
      <div className="mb-8 flex items-center gap-3 px-2">
        <div className="bg-gray-800 p-2 rounded-lg">
          <Package className="h-6 w-6 text-white" />
        </div>
        <h2 className="text-xl font-bold">Manajemen Produk</h2>
      </div>
      <nav className="flex flex-col gap-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-600 transition-all hover:bg-gray-100",
                isActive && "bg-gray-100 font-semibold text-gray-900"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
