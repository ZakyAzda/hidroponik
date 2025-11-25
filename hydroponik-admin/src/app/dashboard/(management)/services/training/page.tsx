'use client';

import { useEffect, useState } from 'react'; // <--- 1. WAJIB ADA
import withAuth from '../../../withAuth'; // Sesuaikan path jika perlu
import api from '@/app/lib/api'; // <--- 2. WAJIB ADA (Sesuaikan path jika relative: ../../../../lib/api)
import { Eye, Trash2, PlusCircle, DollarSign, Briefcase, Hash, Users, GraduationCap } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'; // Pastikan komponen Table diimport
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Link from 'next/link';

// Definisikan tipe data untuk Jasa
interface Service {
  id: number;
  name: string;
  price: number;
  categoryId: number;
  description: string | null;
  imageUrl: string | null;
}

// GANTI ID INI SESUAI DATABASE KAMU (Misal Pelatihan ID-nya 3)
const TRAINING_CATEGORY_ID = 1; 

function ManageTrainingServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  
  // State Edit
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // State Form Edit (Agar input bisa diketik)
  const [editFormData, setEditFormData] = useState({
    name: '',
    description: '',
    price: 0,
  });

  const fetchServices = async () => {
    try {
      // Ambil data dengan filter kategori
      const response = await api.get(`/services?categoryId=${TRAINING_CATEGORY_ID}`);
      setServices(response.data);
    } catch (error) {
      console.error('Gagal mengambil data jasa:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchServices(); }, []);

  // Saat tombol edit ditekan, isi form dengan data lama
  const handleEditClick = (service: Service) => {
    setSelectedService(service);
    setEditFormData({
      name: service.name,
      description: service.description || '',
      price: service.price,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (serviceId: number) => {
    if (confirm('Anda yakin ingin menghapus jasa ini?')) {
      try {
        await api.delete(`/services/${serviceId}`);
        fetchServices(); 
      } catch (error) {
        alert('Gagal menghapus jasa.');
      }
    }
  };

  const handleSaveChanges = async () => {
    if (!selectedService) return;
    try {
      const dataToUpdate = {
        name: editFormData.name,
        description: editFormData.description,
        price: Number(editFormData.price),
      };
      await api.patch(`/services/${selectedService.id}`, dataToUpdate);
      setIsDialogOpen(false);
      fetchServices();
    } catch (error) {
      alert('Gagal menyimpan perubahan.');
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          <p className="mt-4 text-gray-600">Memuat data pelatihan...</p>
        </div>
      </div>
    );
  }

  const totalRevenue = services.reduce((sum, service) => sum + service.price, 0);
  const averagePrice = services.length > 0 ? totalRevenue / services.length : 0;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-black rounded-lg">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Manajemen Pelatihan</h1>
                <p className="text-gray-500 mt-1">Kelola workshop dan kelas hidroponik</p>
              </div>
            </div>
            <Link href="/dashboard/services/create">
              <Button className="bg-black hover:bg-gray-800 text-white">
                <PlusCircle className="h-4 w-4 mr-2" />
                Tambah Pelatihan
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Kelas</p>
                <p className="text-2xl font-bold text-gray-900">{services.length}</p>
              </div>
              <div className="p-2 bg-gray-100 rounded-lg">
                <Users className="h-5 w-5 text-gray-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Nilai Jasa</p>
                <p className="text-2xl font-bold text-gray-900">
                  Rp {totalRevenue.toLocaleString('id-ID')}
                </p>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <DollarSign className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Rata-rata Harga</p>
                <p className="text-2xl font-bold text-gray-900">
                  Rp {Math.round(averagePrice).toLocaleString('id-ID')}
                </p>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <Briefcase className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {services.length === 0 ? (
            <div className="p-12 text-center">
              <GraduationCap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Belum ada data pelatihan</h3>
              <Link href="/dashboard/services/create">
                <Button className="mt-4 bg-black hover:bg-gray-800 text-white">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Tambah Sekarang
                </Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50 border-b border-gray-200">
                    <TableHead className="font-semibold text-gray-700"><Hash className="h-4 w-4 inline mr-1"/> ID</TableHead>
                    <TableHead className="font-semibold text-gray-700">Gambar</TableHead>
                    <TableHead className="font-semibold text-gray-700"><GraduationCap className="h-4 w-4 inline mr-1"/> Nama Pelatihan</TableHead>
                    <TableHead className="font-semibold text-gray-700"><DollarSign className="h-4 w-4 inline mr-1"/> Harga</TableHead>
                    <TableHead className="text-right font-semibold text-gray-700">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {services.map((service, index) => (
                    <TableRow key={service.id} className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'} hover:bg-gray-50 transition-colors`}>
                      <TableCell className="font-medium">#{service.id}</TableCell>
                      <TableCell>
                        <div className="h-12 w-12 rounded-md bg-gray-100 overflow-hidden">
                           {service.imageUrl ? (
                             <img src={service.imageUrl} alt={service.name} className="h-full w-full object-cover" />
                           ) : (
                             <GraduationCap className="h-6 w-6 text-gray-400 m-auto mt-3" />
                           )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="font-medium text-gray-900">{service.name}</p>
                        <p className="text-xs text-gray-500 truncate max-w-[200px]">{service.description}</p>
                      </TableCell>
                      <TableCell>Rp {service.price.toLocaleString('id-ID')}</TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-2">
                          
                          {/* --- EDIT DIALOG --- */}
                          <Dialog open={isDialogOpen && selectedService?.id === service.id} onOpenChange={setIsDialogOpen}>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-gray-100" onClick={() => handleEditClick(service)}>
                                <Eye className="h-4 w-4 text-gray-600" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Edit Pelatihan</DialogTitle>
                              </DialogHeader>
                              <div className="py-4 space-y-4">
                                <div>
                                  <Label>Nama Pelatihan</Label>
                                  <Input value={editFormData.name} onChange={(e) => setEditFormData({...editFormData, name: e.target.value})} />
                                </div>
                                <div>
                                  <Label>Harga</Label>
                                  <Input type="number" value={editFormData.price} onChange={(e) => setEditFormData({...editFormData, price: Number(e.target.value)})} />
                                </div>
                                <div>
                                  <Label>Deskripsi</Label>
                                  <Textarea value={editFormData.description} onChange={(e) => setEditFormData({...editFormData, description: e.target.value})} />
                                </div>
                              </div>
                              <Button onClick={handleSaveChanges} className="w-full bg-black text-white">Simpan</Button>
                            </DialogContent>
                          </Dialog>

                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-red-50" onClick={() => handleDelete(service.id)}>
                            <Trash2 className="h-4 w-4 text-red-600" />
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

// 3. PASTIKAN NAMA EXPORT BENAR
export default withAuth(ManageTrainingServicesPage);