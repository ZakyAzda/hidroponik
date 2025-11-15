'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import withAuth from '../../../withAuth';
import api from '../../../../lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, UserPlus, Mail, KeyRound, UserCog } from 'lucide-react';

function CreateUserPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'CUSTOMER', // Default role
  });
  
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleRoleChange = (value: 'CUSTOMER' | 'ADMIN') => {
    setFormData(prev => ({ ...prev, role: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await api.post('/users', formData);
      alert('Pengguna baru berhasil dibuat!');
      router.push('/dashboard/users'); // Asumsi halaman daftar user ada di sini
    } catch (err: any) {
      const errorMessages = err.response?.data?.message;
      setError(Array.isArray(errorMessages) ? errorMessages.join(', ') : 'Gagal membuat pengguna.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali
          </button>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg">
              <UserPlus className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Tambah Pengguna Baru</h1>
              <p className="text-gray-500 mt-1">Buat akun baru untuk pelanggan atau admin</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <Card className="border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle>Detail Pengguna</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-2"><UserPlus className="w-4 h-4" /> Nama Lengkap</Label>
                <Input id="name" value={formData.name} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2"><Mail className="w-4 h-4" /> Alamat Email</Label>
                <Input id="email" type="email" value={formData.email} onChange={handleChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="flex items-center gap-2"><KeyRound className="w-4 h-4" /> Password</Label>
                <Input id="password" type="password" value={formData.password} onChange={handleChange} required minLength={6} />
                <p className="text-xs text-gray-500">Minimal 6 karakter.</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="role" className="flex items-center gap-2"><UserCog className="w-4 h-4" /> Peran (Role)</Label>
                <Select onValueChange={handleRoleChange} value={formData.role}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih peran" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CUSTOMER">Customer</SelectItem>
                    <SelectItem value="ADMIN">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {error && <p className="text-sm text-red-600">{error}</p>}

              <div className="flex justify-end gap-4 pt-4">
                <Button type="button" variant="outline" onClick={() => router.back()}>Batal</Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Menyimpan...' : 'Simpan Pengguna'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
}

export default withAuth(CreateUserPage);
