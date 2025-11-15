'use client';

import { useEffect, useState } from 'react';
import withAuth from '../../withAuth';
import api from '../../../lib/api';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Check, X, Clock, Star, MessageSquare, User, ShoppingBag, FileText } from 'lucide-react';

// Definisikan tipe data untuk Review
interface Review {
  id: number;
  rating: number;
  comment: string | null;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
  user: {
    name: string;
  };
  product: {
    name: string;
  };
}

function ManageReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const response = await api.get('/reviews');
      setReviews(response.data);
    } catch (error) {
      console.error('Gagal mengambil data review:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleUpdateStatus = async (id: number, status: 'APPROVED' | 'REJECTED') => {
    try {
      await api.patch(`/reviews/${id}/status`, { status });
      // Perbarui state secara lokal untuk responsivitas instan
      setReviews(prevReviews =>
        prevReviews.map(review =>
          review.id === id ? { ...review, status } : review
        )
      );
    } catch (error) {
      console.error(`Gagal mengubah status review ${id}:`, error);
      alert('Gagal memperbarui status review.');
    }
  };

  const getStatusBadge = (status: Review['status']) => {
    switch (status) {
      case 'APPROVED':
        return <Badge variant="default" className="bg-green-500 hover:bg-green-600 text-white">Disetujui</Badge>;
      case 'REJECTED':
        return <Badge variant="destructive">Ditolak</Badge>;
      case 'PENDING':
      default:
        return <Badge variant="secondary">Menunggu</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-gray-300 border-t-gray-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg shadow-lg">
              <Star className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Manajemen Review</h1>
              <p className="text-gray-500 mt-1">Moderasi semua review produk dari pengguna</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 border-b border-gray-200">
                <TableHead className="font-semibold text-gray-700">Produk</TableHead>
                <TableHead className="font-semibold text-gray-700">Pengguna</TableHead>
                <TableHead className="font-semibold text-gray-700">Rating</TableHead>
                <TableHead className="font-semibold text-gray-700">Komentar</TableHead>
                <TableHead className="font-semibold text-gray-700">Status</TableHead>
                <TableHead className="text-right font-semibold text-gray-700">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reviews.length > 0 ? (
                reviews.map((review) => (
                  <TableRow key={review.id} className="hover:bg-gray-50 transition-colors border-b border-gray-100">
                    <TableCell className="font-medium text-gray-800">{review.product.name}</TableCell>
                    <TableCell className="text-gray-600">{review.user.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`h-4 w-4 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-600 max-w-xs truncate">{review.comment || '-'}</TableCell>
                    <TableCell>{getStatusBadge(review.status)}</TableCell>
                    <TableCell className="text-right">
                      {review.status === 'PENDING' && (
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            size="sm"
                            className="bg-green-500 hover:bg-green-600 text-white"
                            onClick={() => handleUpdateStatus(review.id, 'APPROVED')}
                          >
                            <Check className="h-4 w-4 mr-1" />
                            Setujui
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleUpdateStatus(review.id, 'REJECTED')}
                          >
                            <X className="h-4 w-4 mr-1" />
                            Tolak
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900">Belum ada review</h3>
                    <p className="text-gray-500">Saat ini tidak ada review yang perlu dimoderasi.</p>
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

export default withAuth(ManageReviewsPage);
