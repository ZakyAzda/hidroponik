'use client';

import { useEffect, useState } from 'react';
import withAuth from '../withAuth';
import api from '../../lib/api';

interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
}

function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get('/products');
        setProducts(response.data);
      } catch (error) {
        console.error('Gagal mengambil data produk:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // GANTI SELURUH BAGIAN RETURN DENGAN INI
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Manajemen Produk</h1>
      
      {loading ? (
        <p>Loading products...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.id} className="bg-white border rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900">{product.name}</h2>
              <p className="text-sm text-gray-500 mt-1">ID: {product.id}</p>
              <div className="mt-4 flex justify-between items-center">
                <p className="text-lg font-bold text-green-700">
                  Rp {product.price.toLocaleString('id-ID')}
                </p>
                <p className="text-sm font-medium text-gray-800 bg-gray-100 px-3 py-1 rounded-full">
                  Stok: {product.stock}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default withAuth(ProductsPage);