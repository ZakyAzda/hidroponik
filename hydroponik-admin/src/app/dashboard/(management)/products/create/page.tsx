'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import withAuth from '../../../withAuth';
import api from '../../../../lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ImageUpload } from '@/components/ui/ImageUpload';
import { ArrowLeft, Package, DollarSign, Image, Archive } from 'lucide-react';

interface Category {
  id: number;
  name: string;
}

function CreateProductPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    imageUrl: '',
    price: 0,
    stock: 0,
    categoryId: '',
  });
  
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/product-categories');
        setCategories(response.data);
      } catch (err) {
        console.error('Gagal mengambil kategori:', err);
        setError('Gagal memuat daftar kategori.');
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };
  
  const handleCategoryChange = (value: string) => {
    setFormData(prev => ({ ...prev, categoryId: value }));
  };
  
  const handleUploadSuccess = (url: string) => {
    setFormData(prev => ({ ...prev, imageUrl: url }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.imageUrl) {
        setError('Harap upload gambar terlebih dahulu.');
        return;
    }
    setError('');
    setIsLoading(true);

    try {
      await api.post('/products', {
        ...formData,
        price: parseInt(String(formData.price), 10),
        stock: parseInt(String(formData.stock), 10),
        categoryId: parseInt(formData.categoryId, 10),
      });
      router.push('/dashboard/products/alat');
    } catch (err: any) {
      console.error('Gagal membuat produk:', err);
      const errorMessages = err.response?.data?.message;
      setError(Array.isArray(errorMessages) ? errorMessages.join(', ') : 'Terjadi kesalahan');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.back()}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-5 w-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">Tambah Produk Baru</h1>
                <p className="mt-1 text-sm text-gray-500">
                  Lengkapi informasi produk untuk menambahkan ke inventori
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Main Information */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information Card */}
              <Card className="border-gray-200 shadow-sm">
                <CardHeader className="bg-white border-b border-gray-100">
                  <div className="flex items-center space-x-2">
                    <Package className="h-5 w-5 text-gray-400" />
                    <CardTitle className="text-lg font-medium">Informasi Dasar</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="pt-6 space-y-6">
                  <div>
                    <Label htmlFor="name" className="text-gray-700 font-medium mb-2 block">
                      Nama Produk <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="border-gray-300 focus:border-gray-900 focus:ring-gray-900"
                      placeholder="Masukkan nama produk"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="categoryId" className="text-gray-700 font-medium mb-2 block">
                      Kategori <span className="text-red-500">*</span>
                    </Label>
                    <Select onValueChange={handleCategoryChange} required>
                      <SelectTrigger className="border-gray-300 focus:border-gray-900 focus:ring-gray-900">
                        <SelectValue placeholder="Pilih kategori produk" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(category => (
                          <SelectItem key={category.id} value={String(category.id)}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="description" className="text-gray-700 font-medium mb-2 block">
                      Deskripsi Produk
                    </Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={5}
                      className="border-gray-300 focus:border-gray-900 focus:ring-gray-900 resize-none"
                      placeholder="Tuliskan deskripsi detail tentang produk"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Pricing & Inventory Card */}
              <Card className="border-gray-200 shadow-sm">
                <CardHeader className="bg-white border-b border-gray-100">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-5 w-5 text-gray-400" />
                    <CardTitle className="text-lg font-medium">Harga & Inventori</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="price" className="text-gray-700 font-medium mb-2 block">
                        Harga (Rp) <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                          Rp
                        </span>
                        <Input
                          id="price"
                          type="number"
                          value={formData.price}
                          onChange={handleChange}
                          className="pl-10 border-gray-300 focus:border-gray-900 focus:ring-gray-900"
                          placeholder="0"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="stock" className="text-gray-700 font-medium mb-2 block">
                        Stok <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative">
                        <Archive className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                        <Input
                          id="stock"
                          type="number"
                          value={formData.stock}
                          onChange={handleChange}
                          className="pl-10 border-gray-300 focus:border-gray-900 focus:ring-gray-900"
                          placeholder="0"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Image Upload & Actions */}
            <div className="space-y-6">
              {/* Image Upload Card */}
              <Card className="border-gray-200 shadow-sm">
                <CardHeader className="bg-white border-b border-gray-100">
                  <div className="flex items-center space-x-2">
                    <Image className="h-5 w-5 text-gray-400" />
                    <CardTitle className="text-lg font-medium">Gambar Produk</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <Label className="text-gray-700 font-medium block">
                      Upload Gambar <span className="text-red-500">*</span>
                    </Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-gray-400 transition-colors">
                      {/* --- PERBAIKAN DI SINI: TAMBAHKAN endpoint="products" --- */}
                      <ImageUpload endpoint="products" onUploadSuccess={handleUploadSuccess} />
                    </div>
                    {formData.imageUrl && (
                      <div className="mt-4">
                        <img
                          src={formData.imageUrl}
                          alt="Preview"
                          className="w-full h-48 object-cover rounded-lg border border-gray-200"
                        />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <Card className="border-gray-200 shadow-sm">
                <CardContent className="pt-6">
                  {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm text-red-600">{error}</p>
                    </div>
                  )}
                  
                  <div className="space-y-3">
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-gray-900 hover:bg-gray-800 text-white font-medium py-2.5"
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Menyimpan...
                        </div>
                      ) : (
                        'Simpan Produk'
                      )}
                    </Button>
                    
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => router.back()}
                      className="w-full border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-2.5"
                    >
                      Batal
                    </Button>
                  </div>

                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <p className="text-xs text-gray-500 text-center">
                      <span className="text-red-500">*</span> Wajib diisi
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default withAuth(CreateProductPage);