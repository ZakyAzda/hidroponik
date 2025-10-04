'use client';

import { useEffect, useState } from 'react';
import api from '../../app/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Product {
  id: number;
  name: string;
  description: string | null;
  imageUrl: string | null;
  price: number;
  stock: number;
  categoryId: number;
}

interface Category {
  id: number;
  name: string;
}

interface ProductEditFormProps {
  productId: number;
  onFinished: () => void;
}

export function ProductEditForm({ productId, onFinished }: ProductEditFormProps) {
  const [formData, setFormData] = useState<Partial<Product>>({});
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productRes, categoriesRes] = await Promise.all([
          api.get(`/products/${productId}`),
          api.get('/product-categories')
        ]);
        setFormData(productRes.data);
        setCategories(categoriesRes.data);
      } catch (err) {
        setError('Gagal memuat data produk.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [productId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleCategoryChange = (value: string) => {
    setFormData(prev => ({ ...prev, categoryId: parseInt(value, 10) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const dataToSubmit = {
        name: formData.name,
        description: formData.description,
        imageUrl: formData.imageUrl,
        price: formData.price ? parseInt(String(formData.price), 10) : undefined,
        stock: formData.stock ? parseInt(String(formData.stock), 10) : undefined,
        categoryId: formData.categoryId
      };
      await api.patch(`/products/${productId}`, dataToSubmit);
      onFinished();
    } catch (err: any) {
      const errorMessages = err.response?.data?.message;
      setError(Array.isArray(errorMessages) ? errorMessages.join(', ') : 'Gagal menyimpan perubahan.');
    }
  };

  if (loading) return <p>Loading data...</p>;

  return (
    // Bagian return diubah untuk menyertakan preview gambar
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* --- BAGIAN BARU: PREVIEW GAMBAR --- */}
      {formData.imageUrl && (
        <div className="mb-4">
          <Label>Gambar Saat Ini</Label>
          <img 
            src={formData.imageUrl} 
            alt={formData.name || 'Gambar Produk'}
            className="mt-2 w-full h-48 object-cover rounded-lg border" 
          />
        </div>
      )}
      {/* --- AKHIR BAGIAN BARU --- */}

      <div>
        <Label htmlFor="name">Nama Produk</Label>
        <Input id="name" value={formData.name || ''} onChange={handleChange} />
      </div>
      <div>
        <Label htmlFor="description">Deskripsi</Label>
        <Textarea id="description" value={formData.description || ''} onChange={handleChange} />
      </div>
      <div>
        <Label htmlFor="imageUrl">URL Gambar</Label>
        <Input id="imageUrl" value={formData.imageUrl || ''} onChange={handleChange} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="price">Harga</Label>
          <Input id="price" type="number" value={formData.price || 0} onChange={handleChange} />
        </div>
        <div>
          <Label htmlFor="stock">Stok</Label>
          <Input id="stock" type="number" value={formData.stock || 0} onChange={handleChange} />
        </div>
      </div>
      <div>
        <Label htmlFor="categoryId">Kategori</Label>
        <Select
          onValueChange={handleCategoryChange}
          value={String(formData.categoryId)}
        >
          <SelectTrigger><SelectValue placeholder="Pilih kategori..." /></SelectTrigger>
          <SelectContent>
            {categories.map(category => (
              <SelectItem key={category.id} value={String(category.id)}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <div className="flex justify-end pt-4">
        <Button type="submit">Simpan Perubahan</Button>
      </div>
    </form>
  );
}