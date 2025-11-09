'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
// PASTIKAN PATH INI BENAR SESUAI PROYEK ANDA
import api from '../../../lib/api'; 
import withAuth from '../../withAuth'; 
// ===========================================
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
import { Eye, Trash2, PlusCircle } from 'lucide-react';
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

  const fetchArticles = async () => {
    try {
      const response = await api.get('/articles/all');
      setArticles(response.data);
    } catch (error) {
      console.error('Gagal mengambil data artikel:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const handleDelete = async (articleId: number) => {
    if (confirm('Anda yakin ingin menghapus artikel ini?')) {
      try {
        await api.delete(`/articles/${articleId}`);
        fetchArticles();
      } catch (error) {
        alert('Gagal menghapus artikel.');
      }
    }
  };

  const handleSaveChanges = async () => {
    if (!selectedArticle) return;
    try {
      const dataToUpdate = {
        title: selectedArticle.title,
        content: selectedArticle.content,
        imageUrl: selectedArticle.imageUrl,
        isPublished: selectedArticle.isPublished,
      };
      await api.patch(`/articles/${selectedArticle.id}`, dataToUpdate);
      setIsDialogOpen(false);
      fetchArticles();
    } catch (error) {
      alert('Gagal menyimpan perubahan.');
    }
  };
  
  const handleViewEdit = (article: Article) => {
    setSelectedArticle({ ...article });
    setIsDialogOpen(true);
  };

  if (loading) {
    return <div className="p-6">Memuat data artikel...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Manajemen Artikel</h1>
            <Link href="/dashboard/articles/create">
              <Button>
                <PlusCircle className="h-4 w-4 mr-2" />
                Tambah Artikel
              </Button>
            </Link>
        </div>

        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Judul</TableHead>
                <TableHead>Penulis</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {articles.length > 0 ? (
                articles.map(article => (
                  <TableRow key={article.id}>
                    <TableCell className="font-medium">{article.title}</TableCell>
                    <TableCell>{article.author.name}</TableCell>
                    <TableCell>
                      <Badge variant={article.isPublished ? 'default' : 'secondary'}>
                        {article.isPublished ? 'Published' : 'Draft'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => handleViewEdit(article)}>
                        <Eye className="h-4 w-4 mr-2" />
                        Lihat & Edit
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700" onClick={() => handleDelete(article.id)}>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Hapus
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center h-24">
                    Belum ada artikel.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detail & Edit Artikel</DialogTitle>
          </DialogHeader>
          {selectedArticle && (
            <div className="py-4 space-y-4 max-h-[60vh] overflow-y-auto pr-4">
              <div className="space-y-1">
                <Label htmlFor="title">Judul</Label>
                <Input id="title" value={selectedArticle.title} onChange={(e) => setSelectedArticle({...selectedArticle, title: e.target.value})} />
              </div>
              <div className="space-y-1">
                <Label htmlFor="imageUrl">URL Gambar</Label>
                <Input id="imageUrl" value={selectedArticle.imageUrl || ''} onChange={(e) => setSelectedArticle({...selectedArticle, imageUrl: e.target.value})} />
              </div>
              <div className="space-y-1">
                <Label htmlFor="content">Konten</Label>
                <Textarea id="content" value={selectedArticle.content} onChange={(e) => setSelectedArticle({...selectedArticle, content: e.target.value})} className="min-h-[200px]" />
              </div>
              <div className="flex items-center space-x-2 pt-2">
                <Switch id="isPublished" checked={selectedArticle.isPublished} onCheckedChange={(checked) => setSelectedArticle({...selectedArticle, isPublished: checked})} />
                <Label htmlFor="isPublished">Publish Artikel?</Label>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Batal</Button>
            <Button onClick={handleSaveChanges}>Simpan Perubahan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default withAuth(ManageArticlesPage);