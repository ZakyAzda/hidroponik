'use client';

import { useEffect, useState } from 'react';
import withAuth from '../../../withAuth';
import api from '../../../../lib/api';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Trash2, Leaf, Calendar, User, Hash, ShoppingCart, AlertCircle } from 'lucide-react';
// --- 1. IMPORT DIALOG & FORM EDIT ---
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { OrderEditForm } from '@/components/ui/OrderEditForm';

// Tipe data
interface Order {
  id: number;
  createdAt: string;
  totalAmount: number;
  status: string;
  user: { name: string; email: string; };
  items: { quantity: number; product: { name: string; }; }[];
}

function SayuranOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  
  // --- 2. STATE UNTUK EDITING ---
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);

  // Pastikan nama kategori ini SAMA PERSIS dengan nama di database Anda
  const KATEGORI_SAYURAN = "Sayuran & Melon";

  const fetchOrders = async () => {
    try {
      // --- PERBAIKAN DI SINI ---
      // Gunakan encodeURIComponent agar tanda '&' tidak memutus URL
      const encodedCategory = encodeURIComponent(KATEGORI_SAYURAN);
      const response = await api.get(`/orders/admin/all?category=${encodedCategory}`); 
      
      // Debugging: Cek apa yang didapat
      console.log("Order Sayur:", response.data);
      
      setOrders(response.data);
    } catch (error) { 
      console.error('Gagal mengambil data pesanan:', error); 
    } 
    finally { 
      setLoading(false); 
    }
  };

  useEffect(() => { 
    fetchOrders(); 
  }, []);

  const handleDelete = async (orderId: number) => {
    if (confirm('Anda yakin ingin menghapus pesanan ini?')) {
      try {
        await api.delete(`/orders/${orderId}`);
        fetchOrders(); 
      } catch (error) {
        alert('Gagal menghapus pesanan.');
      }
    }
  };

  // --- 3. FUNGSI CALLBACK SETELAH EDIT SELESAI ---
  const handleEditFinished = () => {
    setEditingOrder(null); // Tutup popup
    fetchOrders(); // Refresh data
  };

  const getStatusColor = (status: string) => {
    const statusMap: { [key: string]: string } = {
      'pending': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'processing': 'bg-blue-100 text-blue-800 border-blue-200',
      'completed': 'bg-green-100 text-green-800 border-green-200',
      'cancelled': 'bg-red-100 text-red-800 border-red-200',
      'shipped': 'bg-purple-100 text-purple-800 border-purple-200',
    };
    return statusMap[status.toLowerCase()] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  if (loading) { 
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          <p className="mt-4 text-gray-600">Memuat data pesanan...</p>
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
              <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg">
                <Leaf className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Pesanan Sayuran & Melon</h1>
                <p className="text-gray-500 mt-1">Kelola dan pantau semua pesanan sayuran segar</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-500">Total Pesanan</p>
                <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
              </div>
            </div>
          </div>
        </div>

       {/* Stats Cards - 5 Kolom Sejajar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          
          {/* Card 1: Total Transaksi */}
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Total Transaksi</p>
                <p className="text-xl font-bold text-gray-900">
                  Rp {orders.reduce((sum, order) => sum + order.totalAmount, 0).toLocaleString('id-ID')}
                </p>
              </div>
              <div className="p-2 bg-green-50 rounded-lg">
                <ShoppingCart className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </div>
          
          {/* Card 2: Pesanan Hari Ini */}
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Hari Ini</p>
                <p className="text-xl font-bold text-gray-900">
                  {orders.filter(order => 
                    new Date(order.createdAt).toDateString() === new Date().toDateString()
                  ).length}
                </p>
              </div>
              <div className="p-2 bg-blue-50 rounded-lg">
                <Calendar className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </div>

          {/* Card 3: Pending */}
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Pending</p>
                <p className="text-xl font-bold text-gray-900">
                  {orders.filter(order => order.status.toLowerCase() === 'pending').length}
                </p>
              </div>
              <div className="p-2 bg-yellow-50 rounded-lg">
                <AlertCircle className="h-5 w-5 text-yellow-600" />
              </div>
            </div>
          </div>

          {/* Card 4: Diperjalanan */}
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Diperjalanan</p>
                <p className="text-xl font-bold text-gray-900">
                  {orders.filter(order => order.status.toLowerCase() === 'shipped').length}
                </p>
              </div>
              <div className="p-2 bg-purple-50 rounded-lg">
                <Leaf className="h-5 w-5 text-purple-600" />
              </div>
            </div>
          </div>

          {/* Card 5: Selesai */}
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Selesai</p>
                <p className="text-xl font-bold text-gray-900">
                  {orders.filter(order => order.status.toLowerCase() === 'completed').length}
                </p>
              </div>
              <div className="p-2 bg-green-50 rounded-lg">
                <Leaf className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </div>

        </div>
        {/* Table Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {orders.length === 0 ? (
            <div className="p-12 text-center">
              <Leaf className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Belum ada pesanan</h3>
              <p className="text-gray-500">Pesanan sayuran akan muncul di sini setelah pelanggan melakukan pembelian</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50 border-b border-gray-200">
                    <TableHead className="font-semibold text-gray-700">
                      <div className="flex items-center gap-2">
                        <Hash className="h-4 w-4" /> ID
                      </div>
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" /> Pelanggan
                      </div>
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700">
                      <div className="flex items-center gap-2">
                        <Leaf className="h-4 w-4" /> Item
                      </div>
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700">Total</TableHead>
                    <TableHead className="font-semibold text-gray-700">Status</TableHead>
                    <TableHead className="font-semibold text-gray-700">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" /> Tanggal
                      </div>
                    </TableHead>
                    <TableHead className="text-right font-semibold text-gray-700">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order, index) => (
                    <TableRow 
                      key={order.id} 
                      className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'} hover:bg-gray-50 transition-colors border-b border-gray-100`}
                    >
                      <TableCell className="font-medium">
                        <span className="inline-flex items-center gap-1 text-gray-900">
                          <span className="text-gray-400">#</span>
                          <span className="font-semibold">{order.id.toString().padStart(5, '0')}</span>
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="font-medium text-gray-900">{order.user.name}</p>
                          <p className="text-sm text-gray-500">{order.user.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                              <span className="inline-flex items-center justify-center min-w-[24px] h-6 px-1.5 bg-green-100 rounded text-xs font-medium text-green-700">
                                {item.quantity}
                              </span>
                              <span className="text-sm text-gray-700">{item.product.name}</span>
                            </div>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-semibold text-gray-900">
                          Rp {order.totalAmount.toLocaleString('id-ID')}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="text-sm text-gray-900">
                            {new Date(order.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(order.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-2">
                          
                          {/* --- 4. TOMBOL EDIT DENGAN POPUP DI SINI --- */}
                          <Dialog open={editingOrder?.id === order.id} onOpenChange={(isOpen) => !isOpen && setEditingOrder(null)}>
                            <DialogTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => setEditingOrder(order)}
                                className="h-8 w-8 p-0 hover:bg-gray-100"
                              >
                                <Eye className="h-4 w-4 text-gray-600" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Kelola Pesanan Sayur #{order.id}</DialogTitle>
                              </DialogHeader>
                              {/* Form Edit */}
                              {editingOrder && (
                                <OrderEditForm order={editingOrder} onFinished={handleEditFinished} />
                              )}
                            </DialogContent>
                          </Dialog>
                          {/* ------------------------------------------ */}

                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleDelete(order.id)}
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
    </div>
  );
}

export default withAuth(SayuranOrdersPage);