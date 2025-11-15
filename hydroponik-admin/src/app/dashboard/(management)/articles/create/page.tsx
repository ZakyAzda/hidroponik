'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import api from '../../../../lib/api';
import withAuth from '../../../withAuth';
import { ImageUpload } from '@/components/ui/ImageUpload';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { 
  ArrowLeft, 
  FileText, 
  Image as ImageIcon, 
  Type, 
  AlignLeft,
  Save,
  AlertCircle,
  CheckCircle2,
  Loader2
} from 'lucide-react';

function CreateArticlePage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isPublished, setIsPublished] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !content) {
      setError('Judul dan Konten tidak boleh kosong.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const articleData = {
        title,
        content,
        imageUrl,
        isPublished,
      };

      console.log('Data yang akan dikirim ke backend:', articleData);

      await api.post('/articles', articleData);
      setSuccess(true);
      
      setTimeout(() => {
        router.push('/dashboard/articles');
      }, 1500);
    } catch (err) {
      setError('Gagal membuat artikel. Coba lagi.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <Link 
            href="/dashboard/articles" 
            className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali ke Daftar Artikel
          </Link>
          
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Buat Artikel Baru</h1>
              <p className="text-gray-500 mt-1">Tulis dan publikasikan artikel Anda</p>
            </div>
          </div>
        </div>

        {/* Success Alert */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-green-900">Artikel berhasil dibuat!</p>
              <p className="text-sm text-green-700">Mengalihkan ke halaman daftar artikel...</p>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
            <p className="text-sm text-red-900">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Main Content Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 space-y-6">
              {/* Title Section */}
              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Type className="h-4 w-4 text-gray-500" />
                  Judul Artikel
                </Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Masukkan judul artikel yang menarik..."
                  required
                  className="text-lg font-medium focus-visible:ring-2"
                  disabled={isLoading}
                />
                <p className="text-xs text-gray-500">
                  Judul yang menarik akan membuat pembaca tertarik untuk membaca artikel Anda
                </p>
              </div>

              {/* Content Section */}
              <div className="space-y-2">
                <Label htmlFor="content" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <AlignLeft className="h-4 w-4 text-gray-500" />
                  Konten Artikel
                </Label>
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Tulis konten artikel Anda di sini..."
                  required
                  className="min-h-[300px] focus-visible:ring-2 resize-none"
                  disabled={isLoading}
                />
                <p className="text-xs text-gray-500">
                  {content.length} karakter
                </p>
              </div>
            </div>
          </div>

          {/* Image Upload Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-2">
                <ImageIcon className="h-4 w-4 text-gray-500" />
                <Label className="text-sm font-semibold text-gray-700">
                  Gambar Artikel
                </Label>
                <span className="text-xs text-gray-500">(Opsional)</span>
              </div>
              
              <ImageUpload 
                endpoint="/articles/upload"
                onUploadSuccess={(url) => setImageUrl(url)} 
              />
              
              {imageUrl && (
                <div className="mt-4">
                  <p className="text-xs text-gray-600 mb-2">Preview:</p>
                  <div className="relative rounded-lg border overflow-hidden bg-gray-50">
                    <img
                      src={imageUrl}
                      alt="Preview"
                      className="w-full h-auto max-h-96 object-contain"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Publish Settings Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-green-100 rounded-lg mt-0.5">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <Label htmlFor="isPublished" className="text-sm font-semibold text-gray-700 cursor-pointer">
                      Publikasikan Artikel
                    </Label>
                    <p className="text-xs text-gray-500 mt-1">
                      Artikel yang dipublikasikan akan langsung terlihat oleh publik
                    </p>
                  </div>
                </div>
                <Switch
                  id="isPublished"
                  checked={isPublished}
                  onCheckedChange={setIsPublished}
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between gap-4 pt-4">
            <Link href="/dashboard/articles">
              <Button 
                type="button" 
                variant="outline"
                disabled={isLoading}
                className="w-full sm:w-auto"
              >
                Batal
              </Button>
            </Link>
            
            <Button 
              type="submit" 
              disabled={isLoading || !title || !content}
              className="w-full sm:w-auto min-w-[150px]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  {isPublished ? 'Publikasikan' : 'Simpan sebagai Draft'}
                </>
              )}
            </Button>
          </div>
        </form>

        {/* Help Text */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-900">
            <span className="font-semibold">Tips:</span> Gunakan judul yang jelas dan deskriptif. 
            Pastikan konten artikel mudah dibaca dan informatif. Tambahkan gambar untuk membuat artikel lebih menarik.
          </p>
        </div>
      </div>
    </div>
  );
}

export default withAuth(CreateArticlePage);