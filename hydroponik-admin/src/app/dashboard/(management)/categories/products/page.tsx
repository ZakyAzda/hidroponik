'use client';

import { useState, useEffect } from 'react';
import withAuth from '../../../withAuth';
import api from '../../../../lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Tags, Plus, Trash2, Loader2, Package } from 'lucide-react'; // Ganti ikon Briefcase jadi Package

interface Category {
  id: number;
  name: string;
}

function ProductCategoriesPage() { // Nama komponen diganti jadi Product
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- PERBAIKAN 1: Fetch Kategori PRODUK ---
  const fetchCategories = async () => {
    try {
      // GANTI DARI '/services-categories' KE '/product-categories'
      const response = await api.get('/product-categories'); 
      setCategories(response.data);
    } catch (error) {
      console.error('Gagal mengambil kategori produk:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    setIsSubmitting(true);
    try {
      // --- PERBAIKAN 2: Post ke Endpoint PRODUK ---
      await api.post('/product-categories', { name: newCategoryName });
      alert('Kategori Produk berhasil ditambahkan!');
      setNewCategoryName('');
      setIsDialogOpen(false);
      fetchCategories();
    } catch (error) {
      alert('Gagal menambahkan kategori.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Yakin ingin menghapus kategori produk ini?')) {
      try {
        // --- PERBAIKAN 3: Delete ke Endpoint PRODUK ---
        await api.delete(`/product-categories/${id}`);
        fetchCategories();
      } catch (error) {
        alert('Gagal menghapus kategori.');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        
        {/* Header - Teks Diganti jadi Produk */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-black rounded-lg">
              <Tags className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Kategori Produk</h1>
              <p className="text-gray-500 mt-1">Kelola jenis produk dan barang</p>
            </div>
          </div>

          {/* Tombol Tambah */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-black hover:bg-gray-800 text-white">
                <Plus className="h-4 w-4 mr-2" /> Tambah Kategori
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Tambah Kategori Produk Baru</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddCategory} className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nama Kategori</Label>
                  <Input 
                    id="name" 
                    placeholder="Contoh: Sayuran, Alat, Nutrisi..." 
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    required
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Batal</Button>
                  <Button type="submit" disabled={isSubmitting} className="bg-black text-white">
                    {isSubmitting ? 'Menyimpan...' : 'Simpan'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Tabel */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="w-[100px]">ID</TableHead>
                <TableHead>Nama Kategori</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.length > 0 ? (
                categories.map((category) => (
                  <TableRow key={category.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium">#{category.id}</TableCell>
                    <TableCell>
                        <div className="flex items-center gap-2">
                            <Package className="h-4 w-4 text-gray-400" />
                            <span className="font-semibold text-gray-700">{category.name}</span>
                        </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(category.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-8 text-gray-500">
                    Belum ada kategori produk.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

      </div>
    </div>
  );
}

export default withAuth(ProductCategoriesPage);