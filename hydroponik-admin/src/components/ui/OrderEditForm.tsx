'use client';

import { useState } from 'react';
import api from '../../app/lib/api'; // Pastikan path api benar
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Package, User, CreditCard, Calendar } from 'lucide-react';

interface OrderEditFormProps {
  order: any;
  onFinished: () => void;
}

export function OrderEditForm({ order, onFinished }: OrderEditFormProps) {
  const [status, setStatus] = useState(order.status);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.patch(`/orders/${order.id}`, { status });
      onFinished();
    } catch (err) {
      console.error(err);
      setError('Gagal memperbarui status pesanan.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      
      {/* --- BAGIAN 1: INFO PESANAN (PREVIEW) --- */}
      <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-3">
        <div className="flex items-center justify-between border-b border-gray-200 pb-2 mb-2">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Detail Pesanan</span>
          <span className="text-xs font-bold text-black">#{order.id}</span>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-500 flex items-center gap-1 mb-1"><User size={12}/> Pelanggan</p>
            <p className="font-medium text-gray-900 truncate">{order.user.name}</p>
          </div>
          <div>
            <p className="text-gray-500 flex items-center gap-1 mb-1"><CreditCard size={12}/> Total</p>
            <p className="font-medium text-gray-900">Rp {order.totalAmount.toLocaleString('id-ID')}</p>
          </div>
          <div>
             <p className="text-gray-500 flex items-center gap-1 mb-1"><Calendar size={12}/> Tanggal</p>
             <p className="font-medium text-gray-900">{new Date(order.createdAt).toLocaleDateString('id-ID')}</p>
          </div>
          <div>
             <p className="text-gray-500 flex items-center gap-1 mb-1"><Package size={12}/> Item</p>
             <p className="font-medium text-gray-900">{order.items.length} Barang</p>
          </div>
        </div>
      </div>

      {/* --- BAGIAN 2: EDIT STATUS --- */}
      <div className="space-y-2">
        <Label htmlFor="status" className="text-base font-semibold text-gray-800">Update Status Pesanan</Label>
        <p className="text-xs text-gray-500 mb-2">Ubah status sesuai proses terkini di lapangan.</p>
        
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-full h-11">
            <SelectValue placeholder="Pilih Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="PENDING">🟡 PENDING (Belum Bayar)</SelectItem>
            <SelectItem value="PROCESSING">🔵 PROCESSING (Dikemas)</SelectItem>
            <SelectItem value="SHIPPED">🟣 SHIPPED (Dikirim)</SelectItem>
            <SelectItem value="COMPLETED">🟢 COMPLETED (Selesai)</SelectItem>
            <SelectItem value="CANCELLED">🔴 CANCELLED (Batal)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* --- ERROR MESSAGE --- */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-sm text-red-600 text-center">
          {error}
        </div>
      )}

      {/* --- FOOTER BUTTON --- */}
      <div className="flex justify-end pt-2">
        <Button 
          type="submit" 
          disabled={loading}
          className="bg-black hover:bg-gray-800 text-white px-6 py-2.5 w-full sm:w-auto"
        >
          {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
        </Button>
      </div>

    </form>
  );
}