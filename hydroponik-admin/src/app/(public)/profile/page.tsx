'use client';

import React, { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Image from 'next/image';
import { 
  User, MapPin, Package, LogOut, Edit, 
  CreditCard, Truck, CheckCircle, XCircle, Clock, ShoppingBag, Key, Plus, Trash2, X
} from 'lucide-react';

// Definisi Tipe Order
interface Order {
  id: number;
  status: string;
  totalAmount: number;
  createdAt: string;
  items: {
    id: number;
    quantity: number;
    price: number;
    product: {
      name: string;
      imageUrl: string | null;
    };
  }[];
}

export default function ProfilePage() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [activeMenu, setActiveMenu] = useState('orders'); 
  
  // State Order
  const [orders, setOrders] = useState<Order[]>([]);
  const [orderTab, setOrderTab] = useState('ALL'); 
  const [isLoading, setIsLoading] = useState(false);

  // State Password
  const [showPassForm, setShowPassForm] = useState(false);
  const [passData, setPassData] = useState({ oldPassword: '', newPassword: '' });
  const [loadingPass, setLoadingPass] = useState(false);

  // State Alamat
  const [addresses, setAddresses] = useState<any[]>([]);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({ label: '', recipientName: '', phoneNumber: '', fullAddress: '' });
  const [loadingAddr, setLoadingAddr] = useState(false);

  // Proteksi Halaman
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) router.push('/');
    else if (user) {
        fetchOrders();
        // Jika user masuk ke menu alamat, load alamat
        if(activeMenu === 'address') fetchAddresses();
    }
  }, [user, activeMenu]);

  // Fetch Data Pesanan
  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('access_token');
      const res = await axios.get('http://localhost:3000/orders', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(res.data);
    } catch (err) { console.error(err); } 
    finally { setIsLoading(false); }
  };

  // Fetch Alamat
  const fetchAddresses = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const res = await axios.get('http://localhost:3000/users/addresses', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAddresses(res.data);
    } catch (err) { console.error(err); }
  };

  // Handle Ganti Password
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

  // Handle Simpan Alamat
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

  // Handle Hapus Alamat
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

  // --- LOGIKA FILTER TAB ---
  const filteredOrders = orders.filter((order) => {
    if (orderTab === 'ALL') return true;
    return order.status === orderTab;
  });

  const orderTabs = [
    { id: 'ALL', label: 'Semua' },
    { id: 'PENDING', label: 'Belum Bayar' },
    { id: 'PROCESSING', label: 'Dikemas' },
    { id: 'SHIPPED', label: 'Dikirim' },
    { id: 'COMPLETED', label: 'Selesai' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'PROCESSING': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'SHIPPED': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'COMPLETED': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#F4FFF8] pt-28 pb-20 px-4">
      <div className="max-w-6xl mx-auto">
        
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* --- SIDEBAR MENU --- */}
          <div className="w-full md:w-1/4 h-fit">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-[#3E8467]/10 sticky top-28">
              <div className="flex flex-col items-center text-center mb-8">
                <div className="w-20 h-20 bg-[#3E8467] rounded-full flex items-center justify-center text-white text-3xl font-bold mb-3 shadow-md border-4 border-green-50">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <h2 className="font-bold text-gray-800 text-lg truncate w-full">{user.name}</h2>
                <span className="mt-2 px-3 py-1 bg-green-100 text-green-700 text-[10px] font-bold rounded-full uppercase tracking-wider">
                  {user.role}
                </span>
              </div>

              <nav className="space-y-2">
                <button onClick={() => setActiveMenu('profile')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeMenu === 'profile' ? 'bg-[#3E8467] text-white shadow-md' : 'text-gray-600 hover:bg-green-50 hover:text-[#3E8467]'}`}>
                  <User size={18} /> Data Diri
                </button>
                <button onClick={() => setActiveMenu('orders')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeMenu === 'orders' ? 'bg-[#3E8467] text-white shadow-md' : 'text-gray-600 hover:bg-green-50 hover:text-[#3E8467]'}`}>
                  <Package size={18} /> Pesanan Saya
                </button>
                <button onClick={() => setActiveMenu('address')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeMenu === 'address' ? 'bg-[#3E8467] text-white shadow-md' : 'text-gray-600 hover:bg-green-50 hover:text-[#3E8467]'}`}>
                  <MapPin size={18} /> Alamat
                </button>
                <hr className="my-4 border-gray-100" />
                <button onClick={() => { logout(); }} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-all">
                  <LogOut size={18} /> Keluar
                </button>
              </nav>
            </div>
          </div>

          {/* --- KONTEN UTAMA --- */}
          <div className="w-full md:w-3/4">
            <div className="bg-white rounded-2xl shadow-lg min-h-[600px] border border-[#3E8467]/10 overflow-hidden p-6">
              
              {/* === 1. RIWAYAT PESANAN === */}
              {activeMenu === 'orders' && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  {/* Tab Nav */}
                  <div className="flex border-b border-gray-100 overflow-x-auto mb-6">
                    {orderTabs.map((tab) => (
                      <button key={tab.id} onClick={() => setOrderTab(tab.id)} className={`flex-1 py-4 text-sm font-medium px-4 transition-colors relative ${orderTab === tab.id ? 'text-[#3E8467]' : 'text-gray-500 hover:text-[#3E8467]'}`}>
                        {tab.label}
                        {orderTab === tab.id && <div className="absolute bottom-0 left-0 w-full h-1 bg-[#3E8467] rounded-t-full"></div>}
                      </button>
                    ))}
                  </div>

                  {/* List Pesanan */}
                  <div className="space-y-4">
                    {isLoading ? <div className="text-center py-10 text-gray-400">Memuat...</div> : 
                     filteredOrders.length > 0 ? filteredOrders.map((order) => (
                        <div key={order.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-center p-4 border-b border-gray-50 bg-[#F4FFF8]/50">
                              <div className="flex items-center gap-2 text-xs text-gray-500">
                                <ShoppingBag size={14} /> <span className="font-bold text-gray-700">Order #{order.id}</span>
                                <span>•</span> <span>{new Date(order.createdAt).toLocaleDateString('id-ID')}</span>
                              </div>
                              <span className={`px-3 py-1 rounded-full text-[10px] font-bold border uppercase ${getStatusColor(order.status)}`}>{order.status}</span>
                            </div>
                            <div className="p-4 space-y-4">
                              {order.items.map((item) => (
                                <div key={item.id} className="flex gap-4">
                                  <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 relative border">
                                    {item.product.imageUrl && <Image src={item.product.imageUrl} alt={item.product.name} fill className="object-cover" />}
                                  </div>
                                  <div className="flex-1">
                                    <h4 className="text-sm font-bold text-gray-800 line-clamp-1">{item.product.name}</h4>
                                    <div className="flex justify-between mt-1">
                                      <p className="text-xs text-gray-500">x{item.quantity}</p>
                                      <p className="text-sm text-gray-600">Rp {new Intl.NumberFormat('id-ID').format(item.price)}</p>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                            <div className="p-4 border-t border-gray-50 flex justify-end bg-gray-50/30">
                                <div className="text-right">
                                    <p className="text-xs text-gray-500 mb-1">Total Pesanan</p>
                                    <p className="text-lg font-bold text-[#3E8467]">Rp {new Intl.NumberFormat('id-ID').format(order.totalAmount)}</p>
                                </div>
                            </div>
                        </div>
                    )) : (
                        <div className="flex flex-col items-center justify-center py-16 text-center">
                            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4"><Package size={40} className="text-gray-300" /></div>
                            <h3 className="text-gray-800 font-bold">Belum ada pesanan</h3>
                            <p className="text-gray-500 text-xs mt-1 mb-6">Di tab ini kosong.</p>
                            <button onClick={() => router.push('/produk')} className="bg-[#3E8467] text-white px-6 py-2 rounded-full text-sm font-bold hover:bg-[#2F5E4D]">Belanja Sekarang</button>
                        </div>
                    )}
                  </div>
                </div>
              )}

              {/* === 2. DATA DIRI & GANTI PASSWORD === */}
              {activeMenu === 'profile' && (
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
                            <button type="submit" disabled={loadingPass} className="bg-[#3E8467] text-white px-6 py-2 rounded-lg text-sm font-bold hover:bg-[#2F5E4D] disabled:opacity-50">{loadingPass ? 'Menyimpan...' : 'Simpan Password'}</button>
                        </form>
                    )}
                  </div>
                </div>
              )}

              {/* === 3. MANAJEMEN ALAMAT === */}
              {activeMenu === 'address' && (
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
                        <button type="submit" disabled={loadingAddr} className="bg-[#3E8467] text-white px-6 py-2 rounded-lg text-sm font-bold hover:bg-[#2F5E4D] w-full">{loadingAddr ? 'Menyimpan...' : 'Simpan Alamat'}</button>
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
              )}

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}