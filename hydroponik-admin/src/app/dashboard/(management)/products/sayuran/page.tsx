'use client';

import { useEffect, useState } from 'react';
import withAuth from '../../../withAuth';
import api from '../../../../lib/api';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Eye, Trash2, Leaf, Plus, Sprout, DollarSign, Image, Layers, AlertCircle, Landmark } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ProductEditForm } from '@/components/ui/ProductEditForm';

interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  imageUrl?: string | null;
  description?: string | null;
}

const SAYURAN_CATEGORY_ID = 2;

function SayuranProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const fetchProducts = async () => {
    try {
      const response = await api.get(`/products?categoryId=${SAYURAN_CATEGORY_ID}`);
      setProducts(response.data);
    } catch (error) { 
      console.error('Gagal mengambil data produk:', error); 
    }
    finally { 
      setLoading(false); 
    }
  };

  useEffect(() => { 
    fetchProducts(); 
  }, []);
  
  const handleDelete = async (productId: number) => {
    if (confirm('Anda yakin ingin menghapus produk ini?')) {
      try {
        await api.delete(`/products/${productId}`);
        fetchProducts(); 
      } catch (error) { 
        alert('Gagal menghapus produk.'); 
      }
    }
  };
  
  const handleEditFinished = () => {
    setEditingProduct(null);
    fetchProducts();
  };

  const getStockStatus = (stock: number) => {
    if (stock === 0) return { color: 'bg-red-100 text-red-800 border-red-200', label: 'Habis' };
    if (stock < 10) return { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', label: 'Stok Rendah' };
    return { color: 'bg-green-100 text-green-800 border-green-200', label: 'Tersedia' };
  };

  const getFreshnessIndicator = (stock: number) => {
    // Asumsi: stok tinggi = lebih segar untuk sayuran
    if (stock >= 20) return { icon: '🥬', label: 'Sangat Segar' };
    if (stock >= 10) return { icon: '🥒', label: 'Segar' };
    if (stock > 0) return { icon: '🍃', label: 'Terbatas' };
    return { icon: '❌', label: 'Habis' };
  };

  if (loading) { 
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          <p className="mt-4 text-gray-600">Memuat data produk sayuran...</p>
        </div>
      </div>
    );
  }

  // Calculate statistics
  const totalValue = products.reduce((sum, product) => sum + (product.price * product.stock), 0);
  const lowStockCount = products.filter(product => product.stock > 0 && product.stock < 10).length;
  const outOfStockCount = products.filter(product => product.stock === 0).length;
  const freshProduceCount = products.filter(product => product.stock >= 20).length;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg">
                <Leaf className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Manajemen Sayuran & Melon</h1>
                <p className="text-gray-500 mt-1">Kelola produk sayuran segar dan stok harian</p>
              </div>
            </div>
            <Link href="/dashboard/products/create">
              <Button className="bg-green-600 hover:bg-green-700 text-white shadow-md">
                <Plus className="h-4 w-4 mr-2" />
                Tambah Produk Baru
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Produk</p>
                <p className="text-2xl font-bold text-gray-900">{products.length}</p>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <Sprout className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Nilai Stok</p>
                <p className="text-2xl font-bold text-gray-900">
                  Rp {totalValue.toLocaleString('id-ID')}
                </p>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <Landmark className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Produk Segar</p>
                <p className="text-2xl font-bold text-gray-900">{freshProduceCount}</p>
              </div>
              <div className="p-2 bg-emerald-100 rounded-lg">
                <Leaf className="h-5 w-5 text-emerald-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Perlu Restock</p>
                <p className="text-2xl font-bold text-gray-900">{lowStockCount + outOfStockCount}</p>
              </div>
              <div className="p-2 bg-yellow-100 rounded-lg">
                <AlertCircle className="h-5 w-5 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {products.length === 0 ? (
            <div className="p-12 text-center">
              <Leaf className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Belum ada produk sayuran</h3>
              <p className="text-gray-500 mb-4">Mulai dengan menambahkan produk sayuran segar pertama Anda</p>
              <Link href="/dashboard/products/create">
                <Button className="bg-green-600 hover:bg-green-700 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Tambah Produk Pertama
                </Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50 border-b border-gray-200">
                    <TableHead className="w-[100px] font-semibold text-gray-700">
                      <div className="flex items-center gap-2">
                        <Image className="h-4 w-4" />
                        Gambar
                      </div>
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700">
                      <div className="flex items-center gap-2">
                        <Leaf className="h-4 w-4" />
                        Nama Produk
                      </div>
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700">
                      <div className="flex items-center gap-2">
                        <Layers className="h-4 w-4" />
                        Stok
                      </div>
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700">Kesegaran</TableHead>
                    <TableHead className="font-semibold text-gray-700">Status</TableHead>
                    <TableHead className="font-semibold text-gray-700">
                      <div className="flex items-center gap-2">
                        <Landmark className="h-4 w-4" />
                        Harga/kg
                      </div>
                    </TableHead>
                    <TableHead className="text-right font-semibold text-gray-700">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product, index) => {
                    const stockStatus = getStockStatus(product.stock);
                    const freshness = getFreshnessIndicator(product.stock);
                    return (
                      <TableRow 
                        key={product.id}
                        className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'} hover:bg-gray-50 transition-colors border-b border-gray-100`}
                      >
                        <TableCell>
                          <div className="relative group">
                            <img 
                              src={product.imageUrl || 'https://placehold.co/400x400/90EE90/228B22?text=Sayuran'} 
                              alt={product.name} 
                              className="h-16 w-16 object-cover rounded-lg border-2 border-green-200 group-hover:border-green-300 transition-colors"
                            />
                            {product.stock === 0 && (
                              <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
                                <span className="text-white text-xs font-semibold">Habis</span>
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <p className="font-medium text-gray-900">{product.name}</p>
                            {product.description && (
                              <p className="text-sm text-gray-500 line-clamp-1">{product.description}</p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className={`text-lg font-semibold ${product.stock === 0 ? 'text-red-600' : product.stock < 10 ? 'text-yellow-600' : 'text-green-600'}`}>
                              {product.stock}
                            </span>
                            <span className="text-sm text-gray-500">kg</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="text-xl">{freshness.icon}</span>
                            <span className="text-sm text-gray-600">{freshness.label}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${stockStatus.color}`}>
                            {stockStatus.label}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="font-semibold text-gray-900">
                            Rp {product.price.toLocaleString('id-ID')}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-end gap-2">
                            <Dialog open={editingProduct?.id === product.id} onOpenChange={(isOpen) => !isOpen && setEditingProduct(null)}>
                              <DialogTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => setEditingProduct(product)}
                                  className="h-8 w-8 p-0 hover:bg-green-50 hover:text-green-600"
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>View / Edit Produk: {editingProduct?.name}</DialogTitle>
                                </DialogHeader>
                                {editingProduct && <ProductEditForm productId={editingProduct.id} onFinished={handleEditFinished} />}
                              </DialogContent>
                            </Dialog>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleDelete(product.id)}
                              className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default withAuth(SayuranProductsPage);