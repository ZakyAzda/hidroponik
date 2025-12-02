'use client';

import React, { useState } from 'react';
import axios from 'axios';
import { User, Key, Loader2 } from 'lucide-react';

export default function ProfileDetails({ user }: { user: any }) {
  const [showPassForm, setShowPassForm] = useState(false);
  const [passData, setPassData] = useState({ oldPassword: '', newPassword: '' });
  const [loadingPass, setLoadingPass] = useState(false);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingPass(true);
    try {
      const token = localStorage.getItem('access_token');
      await axios.patch('http://localhost:3000/users/password', passData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("✅ Password berhasil diubah!");
      setShowPassForm(false);
      setPassData({ oldPassword: '', newPassword: '' });
    } catch (err: any) {
      alert(err.response?.data?.message || "Gagal mengubah password.");
    } finally {
      setLoadingPass(false);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2"><User className="text-[#3E8467]" /> Data Diri</h2>
      
      <div className="grid gap-4 mb-8">
        <div className="p-4 border rounded-xl bg-gray-50">
          <label className="text-xs text-gray-500 uppercase font-bold mb-1 block">Nama Lengkap</label>
          <p className="text-gray-800 font-medium">{user.name}</p>
        </div>
        <div className="p-4 border rounded-xl bg-gray-50">
          <label className="text-xs text-gray-500 uppercase font-bold mb-1 block">Email</label>
          <p className="text-gray-800 font-medium">{user.email}</p>
        </div>
      </div>

      <div className="border-t pt-6">
        <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-gray-700 flex items-center gap-2"><Key size={18}/> Keamanan</h3>
            <button onClick={() => setShowPassForm(!showPassForm)} className="text-xs text-[#3E8467] font-bold hover:underline">{showPassForm ? 'Batal' : 'Ubah Password'}</button>
        </div>
        {showPassForm && (
            <form onSubmit={handleChangePassword} className="bg-gray-50 p-6 rounded-xl border border-gray-200 space-y-4 animate-in fade-in">
                <div>
                    <label className="text-xs font-bold text-gray-500 block mb-1">Password Lama</label>
                    <input type="password" placeholder="••••••" className="w-full p-3 border rounded-lg text-sm" value={passData.oldPassword} onChange={e => setPassData({...passData, oldPassword: e.target.value})} required />
                </div>
                <div>
                    <label className="text-xs font-bold text-gray-500 block mb-1">Password Baru</label>
                    <input type="password" placeholder="Minimal 6 karakter" className="w-full p-3 border rounded-lg text-sm" value={passData.newPassword} onChange={e => setPassData({...passData, newPassword: e.target.value})} required />
                </div>
                <button type="submit" disabled={loadingPass} className="bg-[#3E8467] text-white px-6 py-2 rounded-lg text-sm font-bold hover:bg-[#2F5E4D] disabled:opacity-50 flex items-center gap-2">
                    {loadingPass && <Loader2 className="animate-spin w-4 h-4" />} Simpan Password
                </button>
            </form>
        )}
      </div>
    </div>
  );
}