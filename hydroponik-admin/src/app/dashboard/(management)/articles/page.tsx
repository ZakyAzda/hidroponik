'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import api from '../../../lib/api';
import withAuth from '../../withAuth';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { 
  Eye, 
  Trash2, 
  PlusCircle, 
  ImageOff, 
  FileText, 
  User, 
  Hash, 
  Calendar,
  CheckCircle2,
  XCircle,
  Home // <-- Tambahkan Home icon
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Article {
  id: number;
  title: string;
  content: string;
  imageUrl: string | null;
  isPublished: boolean;
  author: {
    name: string;
  };
}

function ManageArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const fetchArticles = useCallback(async () => {
    try {
      const response = await api.get('/articles/all');
      setArticles(response.data);
    } catch (error) {
      console.error('Gagal mengambil data artikel:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  const handleDelete = async (articleId: number) => {
    if (!confirm('Anda yakin ingin menghapus artikel ini?')) return;

    try {
      await api.delete(`/articles/${articleId}`);
      setArticles(prev => prev.filter(article => article.id !== articleId));
    } catch (error) {
      alert('Gagal menghapus artikel.');
    }
  };

  const handleSaveChanges = async () => {
    if (!selectedArticle) return;

    setIsSaving(true);
    try {
      const dataToUpdate = {
        title: selectedArticle.title,
        content: selectedArticle.content,
        imageUrl: selectedArticle.imageUrl,
        isPublished: selectedArticle.isPublished,
      };
      
      await api.patch(`/articles/${selectedArticle.id}`, dataToUpdate);
      
      setArticles(prev =>
        prev.map(article =>
          article.id === selectedArticle.id ? selectedArticle : article
        )
      );
      
      setIsDialogOpen(false);
      setSelectedArticle(null);
    } catch (error) {
      alert('Gagal menyimpan perubahan.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleViewEdit = (article: Article) => {
    setSelectedArticle({ ...article });
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedArticle(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          <p className="mt-4 text-gray-600">Memuat data artikel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Manajemen Artikel</h1>
                <p className="text-gray-500 mt-1">Kelola dan pantau semua artikel Anda</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <Button variant="outline" className="shadow-sm">
                  <Home className="h-4 w-4 mr-2" />
                  Kembali ke Home
                </Button>
              </Link>
              <Link href="/dashboard/articles/create">
                <Button className="shadow-sm">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Tambah Artikel
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Artikel</p>
                <p className="text-2xl font-bold text-gray-900">{articles.length}</p>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Dipublikasikan</p>
                <p className="text-2xl font-bold text-gray-900">
                  {articles.filter(article => article.isPublished).length}
                </p>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Draft</p>
                <p className="text-2xl font-bold text-gray-900">
                  {articles.filter(article => !article.isPublished).length}
                </p>
              </div>
              <div className="p-2 bg-yellow-100 rounded-lg">
                <XCircle className="h-5 w-5 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Dengan Gambar</p>
                <p className="text-2xl font-bold text-gray-900">
                  {articles.filter(article => article.imageUrl).length}
                </p>
              </div>
              <div className="p-2 bg-purple-100 rounded-lg">
                <ImageOff className="h-5 w-5 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {articles.length === 0 ? (
            <div className="p-12 text-center">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Belum ada artikel</h3>
              <p className="text-gray-500">Mulai dengan membuat artikel pertama Anda</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50 border-b border-gray-200">
                    <TableHead className="font-semibold text-gray-700">
                      <div className="flex items-center gap-2">
                        <Hash className="h-4 w-4" />
                        ID
                      </div>
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700 w-[100px]">Gambar</TableHead>
                    <TableHead className="font-semibold text-gray-700">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Judul
                      </div>
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Penulis
                      </div>
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700">Status</TableHead>
                    <TableHead className="text-right font-semibold text-gray-700">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {articles.map((article, index) => (
                    <TableRow 
                      key={article.id} 
                      className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'} hover:bg-gray-50 transition-colors border-b border-gray-100`}
                    >
                      <TableCell className="font-medium">
                        <span className="inline-flex items-center gap-1 text-gray-900">
                          <span className="text-gray-400">#</span>
                          <span className="font-semibold">{article.id.toString().padStart(4, '0')}</span>
                        </span>
                      </TableCell>
                      <TableCell>
                        {article.imageUrl ? (
                          <img
                            src={article.imageUrl}
                            alt={article.title}
                            className="h-16 w-16 object-cover rounded-lg border shadow-sm"
                            loading="lazy"
                          />
                        ) : (
                          <div className="h-16 w-16 rounded-lg border bg-gray-50 flex items-center justify-center">
                            <ImageOff className="h-6 w-6 text-gray-400" />
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <p className="font-medium text-gray-900 line-clamp-2">
                          {article.title}
                        </p>
                      </TableCell>
                      <TableCell>
                        <p className="text-gray-700">{article.author.name}</p>
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
                          article.isPublished 
                            ? 'bg-green-100 text-green-800 border-green-200' 
                            : 'bg-yellow-100 text-yellow-800 border-yellow-200'
                        }`}>
                          {article.isPublished ? 'Published' : 'Draft'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleViewEdit(article)}
                            className="h-8 w-8 p-0 hover:bg-gray-100"
                          >
                            <Eye className="h-4 w-4 text-gray-600" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleDelete(article.id)}
                            className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              Detail & Edit Artikel
            </DialogTitle>
          </DialogHeader>
          
          {selectedArticle && (
            <div className="py-4 space-y-5 overflow-y-auto pr-2">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm font-medium">
                  Judul Artikel
                </Label>
                <Input
                  id="title"
                  value={selectedArticle.title}
                  onChange={(e) =>
                    setSelectedArticle({ ...selectedArticle, title: e.target.value })
                  }
                  placeholder="Masukkan judul artikel"
                  className="focus-visible:ring-2"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="imageUrl" className="text-sm font-medium">
                  URL Gambar
                </Label>
                <Input
                  id="imageUrl"
                  value={selectedArticle.imageUrl || ''}
                  onChange={(e) =>
                    setSelectedArticle({ ...selectedArticle, imageUrl: e.target.value })
                  }
                  placeholder="https://example.com/image.jpg"
                  className="focus-visible:ring-2"
                />
              </div>

              {selectedArticle.imageUrl && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Preview Gambar</Label>
                  <div className="relative rounded-lg border overflow-hidden bg-gray-50">
                    <img
                      src={selectedArticle.imageUrl}
                      alt="Preview"
                      className="w-full h-auto max-h-64 object-contain"
                      loading="lazy"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="content" className="text-sm font-medium">
                  Konten Artikel
                </Label>
                <Textarea
                  id="content"
                  value={selectedArticle.content}
                  onChange={(e) =>
                    setSelectedArticle({ ...selectedArticle, content: e.target.value })
                  }
                  placeholder="Tulis konten artikel di sini..."
                  className="min-h-[200px] focus-visible:ring-2 resize-none"
                />
              </div>

              <div className="flex items-center space-x-3 pt-2 p-4 bg-gray-50 rounded-lg">
                <Switch
                  id="isPublished"
                  checked={selectedArticle.isPublished}
                  onCheckedChange={(checked) =>
                    setSelectedArticle({ ...selectedArticle, isPublished: checked })
                  }
                />
                <Label htmlFor="isPublished" className="cursor-pointer">
                  <span className="font-medium">Publikasikan Artikel</span>
                  <p className="text-sm text-gray-500">
                    Artikel akan terlihat oleh publik
                  </p>
                </Label>
              </div>
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={handleCloseDialog}
              disabled={isSaving}
            >
              Batal
            </Button>
            <Button onClick={handleSaveChanges} disabled={isSaving}>
              {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default withAuth(ManageArticlesPage);