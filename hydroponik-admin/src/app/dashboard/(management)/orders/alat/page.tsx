'use client';

import { useEffect, useState, useCallback } from 'react';
import withAuth from '../../../withAuth'; 
import api from '../../../../lib/api'; 
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Eye, Trash2, Package, Calendar, User, Hash, ShoppingCart, AlertCircle, Truck, CheckCircle, X, Download } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { OrderEditForm } from '@/components/ui/OrderEditForm'; 

// --- IMPORT HELPER PDF ---
// Pastikan path ini sesuai dengan lokasi file pdfGenerator.ts kamu
import { generateOrderPDF } from '../../../../lib/pdfGenerator'; 

interface Order {
  id: number;
  createdAt: string;
  totalAmount: number;
  status: string;
  user: { name: string; email: string; };
  items: { quantity: number; product: { name: string; }; }[];
}

function AlatOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  
  // --- STATE FILTER ---
  const [filterStatus, setFilterStatus] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  // ------------------------------

  const [editingOrder, setEditingOrder] = useState<Order | null>(null);

  // --- FETCH ORDERS ---
  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      // Kategori tetap hardcode
      params.append('category', 'Alat Hidroponik'); 
      
      // Masukkan filter jika ada
      if (filterStatus !== 'all') params.append('status', filterStatus);
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);

      const response = await api.get(`/orders/admin/all?${params.toString()}`);
      setOrders(response.data);
    } catch (error) {
      console.error('Gagal mengambil data pesanan:', error);
    } finally {
      setLoading(false);
    }
  }, [filterStatus, startDate, endDate]); 

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

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

  const handleEditFinished = () => {
    setEditingOrder(null); 
    fetchOrders(); 
  };

  const resetFilter = () => {
    setFilterStatus('all');
    setStartDate('');
    setEndDate('');
  };

  // --- HANDLER DOWNLOAD PDF ---
  const handleDownloadPDF = () => {
    generateOrderPDF({
      title: 'Laporan Pesanan Alat & Nutrisi', // Judul khusus Alat
      orders: orders,
      startDate: startDate,
      endDate: endDate,
      filterStatus: filterStatus,
      themeColor: [33, 33, 33] // WARNA HITAM/DARK GREY (Beda dengan Sayur)
    });
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

  if (loading && orders.length === 0) {
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
              <div className="p-3 bg-black rounded-lg">
                <Package className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Pesanan Alat Hidroponik</h1>
                <p className="text-gray-500 mt-1">Kelola dan pantau semua pesanan pelanggan</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Total Pesanan</p>
              <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
            </div>
          </div>
        </div>

        {/* Stats Cards - LENGKAP 5 KARTU */}
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
              <div className="p-2 bg-gray-100 rounded-lg">
                <ShoppingCart className="h-5 w-5 text-gray-600" />
              </div>
            </div>
          </div>

          {/* Card 2: Pending */}
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Pending</p>
                <p className="text-xl font-bold text-gray-900">
                  {orders.filter(order => order.status.toLowerCase() === 'pending').length}
                </p>
              </div>
              <div className="p-2 bg-yellow-100 rounded-lg">
                <AlertCircle className="h-5 w-5 text-yellow-600" />
              </div>
            </div>
          </div>

           {/* Card 3: Dikemas */}
           <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Dikemas</p>
                <p className="text-xl font-bold text-gray-900">
                  {orders.filter(order => order.status.toLowerCase() === 'processing').length}
                </p>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <Package className="h-5 w-5 text-blue-600" />
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
              <div className="p-2 bg-purple-100 rounded-lg">
                <Truck className="h-5 w-5 text-purple-600" />
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
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* --- SECTION FILTER & DOWNLOAD --- */}
        <div className="flex flex-col md:flex-row gap-3 items-end mb-6 bg-white p-4 rounded-lg border border-gray-200">
            <div className="w-full md:w-auto">
                <label className="text-xs font-semibold text-gray-500 mb-1 block">Status</label>
                <select 
                    value={filterStatus} 
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full md:w-[180px] p-2 text-sm border rounded-md"
                >
                    <option value="all">Semua</option>
                    <option value="pending">Pending</option>
                    <option value="processing">Dikemas</option>
                    <option value="shipped">Diperjalanan</option>
                    <option value="completed">Selesai</option>
                    <option value="cancelled">Dibatalkan</option>
                </select>
            </div>
            <div className="w-full md:w-auto">
                <label className="text-xs font-semibold text-gray-500 mb-1 block">Dari</label>
                <input 
                    type="date" 
                    value={startDate} 
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full p-2 text-sm border rounded-md"
                />
            </div>
            <div className="w-full md:w-auto">
                <label className="text-xs font-semibold text-gray-500 mb-1 block">Sampai</label>
                <input 
                    type="date" 
                    value={endDate} 
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full p-2 text-sm border rounded-md"
                />
            </div>

            {/* Tombol Reset */}
            {(filterStatus !== 'all' || startDate || endDate) && (
                <Button variant="ghost" size="sm" onClick={resetFilter} className="text-red-500 hover:text-red-600">
                    <X className="w-4 h-4 mr-1"/> Reset
                </Button>
            )}

            {/* --- TOMBOL UNDUH LAPORAN --- */}
            <Button 
                onClick={handleDownloadPDF} 
                className="ml-auto bg-black hover:bg-gray-800 text-white"
            >
                <Download className="w-4 h-4 mr-2" />
                Unduh Laporan
            </Button>
            {/* --------------------------- */}
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {orders.length === 0 ? (
            <div className="p-12 text-center">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Belum ada pesanan</h3>
              <p className="text-gray-500">Pesanan akan muncul di sini setelah pelanggan melakukan pembelian</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50 border-b border-gray-200">
                    <TableHead className="font-semibold text-gray-700"><Hash className="h-4 w-4 inline mr-1"/> ID</TableHead>
                    <TableHead className="font-semibold text-gray-700"><User className="h-4 w-4 inline mr-1"/> Pelanggan</TableHead>
                    <TableHead className="font-semibold text-gray-700"><Package className="h-4 w-4 inline mr-1"/> Item</TableHead>
                    <TableHead className="font-semibold text-gray-700">Total</TableHead>
                    <TableHead className="font-semibold text-gray-700">Status</TableHead>
                    <TableHead className="font-semibold text-gray-700"><Calendar className="h-4 w-4 inline mr-1"/> Tanggal</TableHead>
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
                        <span className="text-gray-400">#</span>
                        <span className="font-semibold">{order.id.toString().padStart(5, '0')}</span>
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
                              <span className="inline-flex items-center justify-center w-6 h-6 bg-gray-100 rounded text-xs font-medium text-gray-700">
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
                          
                          {/* --- EDIT BUTTON (POPUP) --- */}
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
                                <DialogTitle>Kelola Pesanan #{order.id}</DialogTitle>
                              </DialogHeader>
                              {editingOrder && (
                                <OrderEditForm order={editingOrder} onFinished={handleEditFinished} />
                              )}
                            </DialogContent>
                          </Dialog>
                          
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

export default withAuth(AlatOrdersPage);