// app/(public)/produk/page.tsx (atau app/produk/page.tsx)

import React from 'react';
import ProductListClient from '../../components/products/ProductListClient'; // Import komponen client tadi

// Fungsi fetch ini berjalan di SERVER
async function getProducts() {
  try {
    // Pastikan URL ini benar mengarah ke NEST.JS Backend Anda
    // Jika backend dan frontend beda port, pastikan port-nya benar (misal: 3000 atau 3001)
    const res = await fetch('http://localhost:3000/products', { 
      cache: 'no-store' // Agar data selalu fresh
    });
    
    if (!res.ok) {
      throw new Error('Failed to fetch products');
    }
    return res.json();
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

// Halaman ini adalah Server Component (default)
export default async function ProdukPage() {
  const products = await getProducts();
  
  return (
    <div className="pt-20"> {/* Padding top agar tidak tertutup Navbar Fixed */}
      <ProductListClient initialProducts={products} />
    </div>
  );
}