'use client';

import { useEffect, useState } from 'react';
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
import { Eye, Trash2, PlusCircle, Briefcase, DollarSign, Users, Hash } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
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
  type: string;
  description: string | null;
}

function ManageConsultingServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const fetchServices = async () => {
  try {
    // Panggil endpoint DENGAN filter categoryId
    // Ganti '2' dengan ID kategori "Instalasi" Anda yang sebenarnya
    const response = await api.get('/services?categoryId=1'); 
    setServices(response.data);
  } catch (error) {
    console.error('Gagal mengambil data jasa:', error);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => { fetchServices(); }, []);

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
        name: selectedService.name,
        description: selectedService.description,
        price: Number(selectedService.price),
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
          <p className="mt-4 text-gray-600">Memuat data jasa konsultasi...</p>
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
                <Briefcase className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Manajemen Jasa Konsultasi</h1>
                <p className="text-gray-500 mt-1">Kelola semua jasa konsultasi yang ditawarkan</p>
              </div>
            </div>
            <Link href="/dashboard/services/create">
              <Button className="bg-black hover:bg-gray-800">
                <PlusCircle className="h-4 w-4 mr-2" />
                Tambah Jasa Konsultasi
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Jasa</p>
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
              <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Belum ada jasa Pelatihan</h3>
              <p className="text-gray-500">Tambahkan jasa Pelatihan pertama Anda untuk memulai</p>
              <Link href="/dashboard/services/create">
                <Button className="mt-4 bg-black hover:bg-gray-800">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Tambah Jasa Pelatihan
                </Button>
              </Link>
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
                    <TableHead className="font-semibold text-gray-700">
                      <div className="flex items-center gap-2">
                        <Briefcase className="h-4 w-4" />
                        Nama Jasa
                      </div>
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4" />
                        Harga
                      </div>
                    </TableHead>
                    <TableHead className="text-right font-semibold text-gray-700">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {services.map((service, index) => (
                    <TableRow 
                      key={service.id}
                      className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'} hover:bg-gray-50 transition-colors border-b border-gray-100`}
                    >
                      <TableCell className="font-medium">
                        <span className="inline-flex items-center gap-1 text-gray-900">
                          <span className="text-gray-400">#</span>
                          <span className="font-semibold">{service.id.toString().padStart(5, '0')}</span>
                        </span>
                      </TableCell>
                      <TableCell>
                        <p className="font-medium text-gray-900">{service.name}</p>
                        {service.description && (
                          <p className="text-sm text-gray-500 mt-1 line-clamp-1">{service.description}</p>
                        )}
                      </TableCell>
                      <TableCell>
                        <span className="font-semibold text-gray-900">
                          Rp {service.price.toLocaleString('id-ID')}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-2">
                          <Dialog open={isDialogOpen && selectedService?.id === service.id} onOpenChange={setIsDialogOpen}>
                            <DialogTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                className="h-8 w-8 p-0 hover:bg-gray-100"
                                onClick={() => {
                                  setSelectedService(service);
                                  setIsDialogOpen(true);
                                }}
                              >
                                <Eye className="h-4 w-4 text-gray-600" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[500px]">
                              <DialogHeader>
                                <DialogTitle className="text-xl font-bold">Detail & Edit Jasa</DialogTitle>
                                <DialogDescription>
                                  Lihat dan edit informasi jasa Pelatihan
                                </DialogDescription>
                              </DialogHeader>
                              {selectedService && (
                                <div className="py-4 space-y-4">
                                  <div>
                                    <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                                      Nama Jasa
                                    </Label>
                                    <Input 
                                      id="name" 
                                      value={selectedService.name} 
                                      onChange={(e) => setSelectedService({...selectedService, name: e.target.value})}
                                      className="mt-1.5"
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                                      Deskripsi
                                    </Label>
                                    <Textarea 
                                      id="description" 
                                      value={selectedService.description || ''} 
                                      onChange={(e) => setSelectedService({...selectedService, description: e.target.value})}
                                      className="mt-1.5 min-h-[100px]"
                                      placeholder="Tambahkan deskripsi jasa konsultasi..."
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor="price" className="text-sm font-medium text-gray-700">
                                      Harga (Rp)
                                    </Label>
                                    <Input 
                                      id="price" 
                                      type="number" 
                                      value={selectedService.price} 
                                      onChange={(e) => setSelectedService({...selectedService, price: Number(e.target.value)})}
                                      className="mt-1.5"
                                    />
                                  </div>
                                </div>
                              )}
                              <DialogFooter>
                                <Button 
                                  variant="outline" 
                                  onClick={() => setIsDialogOpen(false)}
                                >
                                  Batal
                                </Button>
                                <Button 
                                  onClick={handleSaveChanges}
                                  className="bg-black hover:bg-gray-800"
                                >
                                  Simpan Perubahan
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleDelete(service.id)}
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

export default withAuth(ManageConsultingServicesPage);