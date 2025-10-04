'use client';

import { useEffect, useState } from 'react';
import withAuth from '../../withAuth';
import api from '../../../lib/api';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Trash2 } from 'lucide-react';

// Tipe data (bisa diperluas nanti)
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

  // Pastikan nama kategori ini SAMA PERSIS dengan nama di database Anda
  const KATEGORI_ALAT = "Alat Hidroponik"; 

  const fetchOrders = async () => {
    try {
      const response = await api.get(`/orders/admin/all?category=${KATEGORI_ALAT}`); 
      setOrders(response.data);
    } catch (error) { console.error('Gagal mengambil data pesanan:', error); } 
    finally { setLoading(false); }
  };

  useEffect(() => { fetchOrders(); }, []);

  const handleDelete = async (orderId: number) => { /* ... Logika hapus ... */ };

  if (loading) { return <p className="text-center p-8">Loading orders...</p>; }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Kelola Pesanan Alat</h1>
      <div className="rounded-lg border shadow-sm bg-white">
        <Table>
          <TableCaption>Daftar semua pesanan alat dari pelanggan.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Pelanggan</TableHead>
              <TableHead>Detail Pesanan</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Tanggal</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">#{order.id}</TableCell>
                <TableCell>
                  <div>{order.user.name}</div>
                  <div className="text-sm text-gray-500">{order.user.email}</div>
                </TableCell>
                <TableCell>
                  <ul className='list-disc pl-4'>
                  {order.items.map((item, index) => (
                    <li key={index}>{item.quantity}x {item.product.name}</li>
                  ))}
                  </ul>
                </TableCell>
                <TableCell>Rp {order.totalAmount.toLocaleString('id-ID')}</TableCell>
                <TableCell><Badge>{order.status}</Badge></TableCell>
                <TableCell>{new Date(order.createdAt).toLocaleDateString('id-ID')}</TableCell>
                <TableCell className="text-right space-x-2">
                    <Button variant="outline" size="icon"><Eye className="h-4 w-4" /></Button>
                    <Button variant="destructive" size="icon" onClick={() => handleDelete(order.id)}><Trash2 className="h-4 w-4" /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default withAuth(AlatOrdersPage);