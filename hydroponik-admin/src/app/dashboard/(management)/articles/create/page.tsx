'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import api from '../../../../lib/api';
import withAuth from '../../../withAuth';
// <-- Impor komponen ImageUpload Anda, pastikan path ini benar
import { ImageUpload } from '@/components/ui/ImageUpload'; // Sesuaikan path jika perlu
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft } from 'lucide-react';

function CreateArticlePage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  // <-- State ini sekarang untuk menyimpan URL gambar (string), bukan File
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content || !imageUrl) {
      setError('Judul, Konten, dan Gambar tidak boleh kosong.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // <-- Kirim sebagai JSON biasa, tidak perlu FormData lagi
      const articleData = {
        title,
        content,
        imageUrl,
      };

      console.log('Data yang akan dikirim ke backend:', articleData);

      await api.post('/articles', articleData);
      router.push('/dashboard/articles');
    } catch (err) {
      setError('Gagal membuat artikel. Coba lagi.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
            <Link href="/dashboard/articles" className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali ke Daftar Artikel
            </Link>
          <h1 className="text-3xl font-bold text-gray-900">Buat Artikel Baru</h1>
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-sm border space-y-6">
          
          <div>
            <Label>Gambar Artikel</Label>
            {/* <-- Gunakan komponen ImageUpload dengan prop onUploadSuccess --> */}
            <ImageUpload onUploadSuccess={(url) => setImageUrl(url)} />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="title">Judul Artikel</Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Konten</Label>
            <Textarea id="content" value={content} onChange={(e) => setContent(e.target.value)} required className="min-h-[250px]" />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="text-right">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Menyimpan...' : 'Simpan Artikel'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default withAuth(CreateArticlePage);