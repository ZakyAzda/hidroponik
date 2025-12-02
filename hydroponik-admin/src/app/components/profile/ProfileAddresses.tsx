'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MapPin, Plus, Trash2, X, Loader2 } from 'lucide-react';

export default function ProfileAddresses() {
  const [addresses, setAddresses] = useState<any[]>([]);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({ label: '', recipientName: '', phoneNumber: '', fullAddress: '' });
  const [loadingAddr, setLoadingAddr] = useState(false);

  useEffect(() => { fetchAddresses(); }, []);

  const fetchAddresses = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const res = await axios.get('http://localhost:3000/users/addresses', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAddresses(res.data);
    } catch (err) { console.error(err); }
  };

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingAddr(true);
    try {
      const token = localStorage.getItem('access_token');
      await axios.post('http://localhost:3000/users/addresses', newAddress, {
        headers: { Authorization: `Bearer ${token}` }
      });
      await fetchAddresses();
      setShowAddressForm(false);
      setNewAddress({ label: '', recipientName: '', phoneNumber: '', fullAddress: '' });
    } catch (err) { alert("Gagal menyimpan alamat."); }
    finally { setLoadingAddr(false); }
  };

  const handleDeleteAddress = async (id: number) => {
    if(!confirm("Hapus alamat ini?")) return;
    try {
        const token = localStorage.getItem('access_token');
        await axios.delete(`http://localhost:3000/users/addresses/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        fetchAddresses();
    } catch(err) { alert("Gagal menghapus alamat"); }
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2"><MapPin className="text-[#3E8467]" /> Alamat Tersimpan</h2>
        {!showAddressForm && (
            <button onClick={() => setShowAddressForm(true)} className="text-sm bg-[#3E8467] text-white px-4 py-2 rounded-lg font-medium hover:bg-[#2F5E4D] flex items-center gap-2 transition-all"><Plus size={16} /> Tambah</button>
        )}
      </div>

      {showAddressForm && (
        <form onSubmit={handleSaveAddress} className="bg-gray-50 p-6 rounded-xl border border-green-200 mb-6 shadow-sm animate-in fade-in">
            <div className="flex justify-between mb-4">
                <h3 className="font-bold text-gray-700">Tambah Alamat Baru</h3>
                <button type="button" onClick={() => setShowAddressForm(false)}><X size={20} className="text-gray-400 hover:text-red-500"/></button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <input placeholder="Label (Rumah/Kantor)" className="p-3 border rounded-lg text-sm" value={newAddress.label} onChange={e => setNewAddress({...newAddress, label: e.target.value})} required />
                <input placeholder="Nama Penerima" className="p-3 border rounded-lg text-sm" value={newAddress.recipientName} onChange={e => setNewAddress({...newAddress, recipientName: e.target.value})} required />
            </div>
            <input placeholder="No. WhatsApp" className="w-full p-3 border rounded-lg text-sm mb-4" value={newAddress.phoneNumber} onChange={e => setNewAddress({...newAddress, phoneNumber: e.target.value})} required />
            <textarea placeholder="Alamat Lengkap" className="w-full p-3 border rounded-lg text-sm h-24 mb-4" value={newAddress.fullAddress} onChange={e => setNewAddress({...newAddress, fullAddress: e.target.value})} required />
            <button type="submit" disabled={loadingAddr} className="bg-[#3E8467] text-white px-6 py-2 rounded-lg text-sm font-bold hover:bg-[#2F5E4D] w-full flex justify-center gap-2">
                {loadingAddr && <Loader2 className="animate-spin w-4 h-4" />} Simpan Alamat
            </button>
        </form>
      )}

      <div className="space-y-4">
        {addresses.length > 0 ? addresses.map((addr) => (
            <div key={addr.id} className="p-4 border border-gray-200 rounded-xl hover:border-green-300 transition-all relative group bg-white">
                <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-gray-800">{addr.label}</span>
                    {addr.isPrimary && <span className="bg-green-100 text-green-700 text-[10px] px-2 py-0.5 rounded-full font-bold">UTAMA</span>}
                </div>
                <p className="text-sm text-gray-600 font-medium">{addr.recipientName} | {addr.phoneNumber}</p>
                <p className="text-sm text-gray-500 mt-1">{addr.fullAddress}</p>
                <button onClick={() => handleDeleteAddress(addr.id)} className="absolute top-4 right-4 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"><Trash2 size={18} /></button>
            </div>
        )) : (
            !showAddressForm && <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed border-gray-200 rounded-xl bg-gray-50"><MapPin className="w-12 h-12 text-gray-300 mb-3" /><p className="text-gray-500 text-sm">Belum ada alamat.</p></div>
        )}
      </div>
    </div>
  );
}