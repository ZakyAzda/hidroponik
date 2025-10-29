'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import withAuth from '../../../withAuth';
import api from '../../../../lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Briefcase, DollarSign, FileText, Layers } from 'lucide-react';


interface Category {
  id: number;
  name: string;
}

function CreateServicePage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    categoryId: 0,
  });
  
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);

   useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/services-categories');
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
  setFormData(prev => ({ 
    ...prev, 
    categoryId: parseInt(value, 10) // Perbarui 'categoryId' dan ubah jadi angka
  }));
};

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.categoryId) {
      setError('Harap pilih kategori jasa terlebih dahulu.');
      return;
    }
    
    setError('');
    setIsLoading(true);

    try {
      await api.post('/services', {
        ...formData,
        price: parseInt(String(formData.price), 10),
      });

      // Redirect berdasarkan kategori service
      if (formData.categoryId === 1) {
        router.push('/dashboard/services/training');
      } else {
        router.push('/dashboard/services/consulting');
      }
    } catch (err: any) {
      console.error('Gagal membuat jasa:', err);
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
                <h1 className="text-2xl font-semibold text-gray-900">Tambah Jasa Baru</h1>
                <p className="mt-1 text-sm text-gray-500">
                  Lengkapi informasi jasa untuk menambahkan ke layanan
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {/* Service Type Selection */}
            <Card className="border-gray-200 shadow-sm">
              <CardHeader className="bg-white border-b border-gray-100">
                <div className="flex items-center space-x-2">
                  <Layers className="h-5 w-5 text-gray-400" />
                  <CardTitle className="text-lg font-medium">Tipe Jasa</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div>
                    <Label htmlFor="categoryId" className="text-gray-700 font-medium mb-2 block">
                      Kategori <span className="text-red-500">*</span>
                    </Label>
                    <Select onValueChange={value => setFormData(prev => ({ ...prev, categoryId: parseInt(value, 10) }))} required>
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
              </CardContent>
            </Card>

            {/* Basic Information Card */}
            <Card className="border-gray-200 shadow-sm">
              <CardHeader className="bg-white border-b border-gray-100">
                <div className="flex items-center space-x-2">
                  <Briefcase className="h-5 w-5 text-gray-400" />
                  <CardTitle className="text-lg font-medium">Informasi Dasar</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                <div>
                  <Label htmlFor="name" className="text-gray-700 font-medium mb-2 block">
                    Nama Jasa <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="border-gray-300 focus:border-gray-900 focus:ring-gray-900"
                    placeholder="Masukkan nama jasa"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description" className="text-gray-700 font-medium mb-2 block">
                    Deskripsi Jasa
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={5}
                    className="border-gray-300 focus:border-gray-900 focus:ring-gray-900 resize-none"
                    placeholder="Tuliskan deskripsi detail tentang jasa yang ditawarkan"
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    Jelaskan manfaat dan detail layanan yang akan diberikan
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Pricing Card */}
            <Card className="border-gray-200 shadow-sm">
              <CardHeader className="bg-white border-b border-gray-100">
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-5 w-5 text-gray-400" />
                  <CardTitle className="text-lg font-medium">Harga</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div>
                  <Label htmlFor="price" className="text-gray-700 font-medium mb-2 block">
                    Harga (Rp) <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
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
                      min="0"
                    />
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    Tentukan harga per sesi atau per paket layanan
                  </p>
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
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 bg-gray-900 hover:bg-gray-800 text-white font-medium py-2.5"
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
                      'Simpan Jasa'
                    )}
                  </Button>
                  
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                    className="flex-1 border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-2.5"
                  >
                    Batal
                  </Button>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
                    <div className="flex items-center space-x-1">
                      <span className="text-red-500">*</span>
                      <span>Wajib diisi</span>
                    </div>
                    <span className="text-gray-300">|</span>
                    <span>Pastikan semua informasi sudah benar</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </form>
      </div>
    </div>
  );
}

export default withAuth(CreateServicePage);