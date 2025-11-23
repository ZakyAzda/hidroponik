'use client';

import React, { useState } from 'react';
import axios from 'axios';
import { Mail, Lock, User, Loader2, X } from 'lucide-react'; // Tambah icon X
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';

export default function LoginModal() {
  // 1. Ambil state dari Store
  const { isLoginOpen, closeLogin, setToken, setUser } = useAuthStore();
  const router = useRouter();

  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Jika state tertutup, jangan render apa-apa (RETURN NULL)
  if (!isLoginOpen) return null;

  // --- LOGIKA LOGIN ---
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await axios.post('http://localhost:3000/auth/login', { email, password });
      const { access_token, user } = response.data;

      setToken(access_token);
      setUser(user);
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('user_data', JSON.stringify(user));

      closeLogin(); // TUTUP POPUP SETELAH SUKSES
      router.refresh(); // Refresh halaman agar Navbar update

    } catch (err: any) {
      setError(err.response?.data?.message || 'Login Gagal.');
    } finally {
      setIsLoading(false);
    }
  };

  // --- LOGIKA REGISTER ---
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await axios.post('http://localhost:3000/auth/register', { name, email, password });
      if (response.data.access_token) {
         const { access_token, user } = response.data;
         setToken(access_token);
         setUser(user);
         localStorage.setItem('access_token', access_token);
         localStorage.setItem('user_data', JSON.stringify(user));
         closeLogin();
         router.refresh();
      } else {
         alert("Registrasi Berhasil! Silakan Login.");
         setIsSignUp(false);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registrasi Gagal.');
    } finally {
      setIsLoading(false);
    }
  };

  // Helper Input
  const InputGroup = ({ icon, type, placeholder, value, onChange }: any) => (
    <div className="bg-gray-100 rounded-lg flex items-center px-4 py-3 w-full border border-transparent focus-within:border-[#70B398] focus-within:bg-white transition-all">
      <div className="text-gray-400 mr-3">{icon}</div>
      <input type={type} placeholder={placeholder} className="bg-transparent border-none outline-none text-sm w-full text-gray-700 placeholder-gray-400" value={value} onChange={(e) => onChange(e.target.value)} required />
    </div>
  );

  return (
    // OVERLAY HITAM (FIXED POSITION DI ATAS SEMUANYA)
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      {/* Backdrop Blur */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closeLogin}></div>

      {/* CONTAINER CARD (Sama seperti sebelumnya) */}
      <div className="bg-white rounded-[20px] shadow-2xl relative overflow-hidden w-full max-w-[900px] min-h-[550px] z-[101] animate-in fade-in zoom-in-95 duration-300">
        
        {/* Tombol Close (X) */}
        <button onClick={closeLogin} className="absolute top-4 right-4 z-[110] p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
          <X className="w-5 h-5 text-gray-500" />
        </button>

        {/* --- FORM LOGIN (Kiri) --- */}
        <div className={`absolute top-0 h-full transition-all duration-700 ease-in-out w-1/2 left-0 z-[2] ${isSignUp ? "translate-x-[100%] opacity-0 z-[1]" : "opacity-100"}`}>
          <form onSubmit={handleLogin} className="bg-white flex flex-col items-center justify-center h-full px-12 text-center">
            <h1 className="text-3xl font-bold text-[#3E8467] mb-4">Masuk</h1>
            <p className="text-gray-400 text-sm mb-6">Selamat datang kembali</p>
            <div className="w-full space-y-4">
              <InputGroup icon={<Mail size={18} />} type="email" placeholder="Email" value={email} onChange={setEmail} />
              <InputGroup icon={<Lock size={18} />} type="password" placeholder="Password" value={password} onChange={setPassword} />
            </div>
            {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
            <button type="submit" disabled={isLoading} className="mt-6 bg-[#70B398] text-white font-bold py-3 px-12 rounded-full uppercase tracking-wider text-xs transition-transform transform hover:scale-105 active:scale-95 hover:bg-[#5fa085] flex items-center justify-center">
              {isLoading ? <Loader2 className="animate-spin w-4 h-4" /> : 'Sign In'}
            </button>
          </form>
        </div>

        {/* --- FORM REGISTER (Kanan) --- */}
        <div className={`absolute top-0 h-full transition-all duration-700 ease-in-out w-1/2 left-0 opacity-0 z-[1] ${isSignUp ? "translate-x-[100%] opacity-100 z-[5]" : ""}`}>
          <form onSubmit={handleRegister} className="bg-white flex flex-col items-center justify-center h-full px-12 text-center">
            <h1 className="text-3xl font-bold text-[#3E8467] mb-4">Buat Akun</h1>
            <p className="text-gray-400 text-sm mb-6">Mulai perjalanan Anda</p>
            <div className="w-full space-y-4">
              <InputGroup icon={<User size={18} />} type="text" placeholder="Nama Lengkap" value={name} onChange={setName} />
              <InputGroup icon={<Mail size={18} />} type="email" placeholder="Email" value={email} onChange={setEmail} />
              <InputGroup icon={<Lock size={18} />} type="password" placeholder="Password" value={password} onChange={setPassword} />
            </div>
            {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
            <button type="submit" disabled={isLoading} className="mt-6 bg-[#70B398] text-white font-bold py-3 px-12 rounded-full uppercase tracking-wider text-xs transition-transform transform hover:scale-105 active:scale-95 hover:bg-[#5fa085] flex items-center justify-center">
              {isLoading ? <Loader2 className="animate-spin w-4 h-4" /> : 'Sign Up'}
            </button>
          </form>
        </div>

        {/* --- SLIDER OVERLAY (Gambar) --- */}
        <div className={`absolute top-0 left-[50%] w-1/2 h-full overflow-hidden transition-transform duration-700 ease-in-out z-[100] ${isSignUp ? "-translate-x-[100%]" : ""}`}>
          <div className={`bg-gradient-to-r from-[#70B398] to-[#3E8467] text-white relative -left-[100%] h-full w-[200%] transform transition-transform duration-700 ease-in-out ${isSignUp ? "translate-x-[50%]" : "translate-x-0"}`}>
            <div className={`absolute top-0 flex flex-col items-center justify-center w-1/2 h-full px-10 text-center transition-transform duration-700 ease-in-out transform ${isSignUp ? "translate-x-0" : "-translate-x-[20%]"}`}>
              <h1 className="text-2xl font-bold mb-4">Sudah Punya Akun?</h1>
              <button onClick={() => setIsSignUp(false)} className="bg-transparent border border-white text-white font-bold py-2 px-8 rounded-full uppercase tracking-wider text-xs hover:bg-white hover:text-[#3E8467] transition-all">Sign In</button>
            </div>
            <div className={`absolute top-0 right-0 flex flex-col items-center justify-center w-1/2 h-full px-10 text-center transition-transform duration-700 ease-in-out transform ${isSignUp ? "translate-x-[20%]" : "translate-x-0"}`}>
              <h1 className="text-2xl font-bold mb-4">Pengunjung Baru?</h1>
              <button onClick={() => setIsSignUp(true)} className="bg-transparent border border-white text-white font-bold py-2 px-8 rounded-full uppercase tracking-wider text-xs hover:bg-white hover:text-[#3E8467] transition-all">Sign Up</button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}