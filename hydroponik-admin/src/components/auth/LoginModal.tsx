'use client';

import React, { useState } from 'react';
import axios from 'axios';
import { Mail, Lock, User, X, Loader2, Sprout, Leaf } from 'lucide-react';
import { useAuthStore } from '@/store/authStore'; 
import { useRouter } from 'next/navigation';

// --- KOMPONEN INPUT (GLASS STYLE) ---
const InputGroup = ({ icon, type, placeholder, value, onChange }: any) => (
  <div className="bg-white/40 backdrop-blur-md rounded-xl flex items-center px-4 py-3 w-full border border-white/50 focus-within:border-[#3E8467] focus-within:bg-white/70 transition-all duration-300 group shadow-sm">
    <div className="text-[#3E8467] mr-3 opacity-70 group-focus-within:opacity-100">{icon}</div>
    <input 
      type={type} 
      placeholder={placeholder} 
      className="bg-transparent border-none outline-none text-sm w-full text-gray-800 placeholder-gray-500 font-medium" 
      value={value} 
      onChange={(e) => onChange(e.target.value)} 
      required 
    />
  </div>
);

export default function LoginModal() {
  const { isLoginOpen, closeLogin, setToken, setUser } = useAuthStore();
  const router = useRouter();

  // State: isSignUp true = Tampilkan Bagian Belakang Kartu (Register)
  const [isSignUp, setIsSignUp] = useState(false);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

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
      closeLogin();
      router.refresh();
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

  return (
    // CONTAINER UTAMA (OVERLAY)
    <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4 perspective-1000">
      
      {/* CSS Khusus untuk 3D Flip */}
      <style jsx>{`
        .perspective-1000 { perspective: 1000px; }
        .transform-style-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
      `}</style>

      {/* Backdrop Gelap Blur */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={closeLogin}></div>

      {/* --- 3D CARD CONTAINER --- */}
      <div 
        className={`relative w-full max-w-[450px] min-h-[550px] transition-all duration-700 transform-style-3d ${isSignUp ? 'rotate-y-180' : ''}`}
      >
        
        {/* === SISI DEPAN (LOGIN) === */}
        <div className="absolute inset-0 w-full h-full backface-hidden">
          <div className="h-full w-full bg-white/30 backdrop-blur-xl border border-white/40 rounded-[30px] shadow-2xl p-8 flex flex-col relative overflow-hidden">
            
            {/* Dekorasi Glass */}
            <div className="absolute -top-20 -right-20 w-60 h-60 bg-[#70B398]/30 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-[#3E8467]/30 rounded-full blur-3xl"></div>

            {/* Tombol Close */}
            <button onClick={closeLogin} className="absolute top-4 right-4 p-2 bg-white/40 hover:bg-red-100 hover:text-red-500 rounded-full transition-all z-20">
              <X size={18} />
            </button>

            {/* Header */}
            <div className="text-center mb-8 relative z-10">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/50 rounded-full mb-4 shadow-inner">
                <Sprout className="text-[#3E8467]" size={32} />
              </div>
              <h2 className="text-3xl font-bold text-[#2F4F4F]">Selamat Datang</h2>
              <p className="text-[#4A7060] text-sm mt-2">Masuk untuk melanjutkan panen Anda</p>
            </div>

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-4 relative z-10">
              <InputGroup icon={<Mail size={18} />} type="email" placeholder="Email" value={email} onChange={setEmail} />
              <InputGroup icon={<Lock size={18} />} type="password" placeholder="Password" value={password} onChange={setPassword} />
              
              {error && <div className="bg-red-100/80 text-red-600 text-xs px-3 py-2 rounded-lg text-center">{error}</div>}

              <button type="submit" disabled={isLoading} className="w-full py-3.5 bg-[#3E8467] hover:bg-[#2F5E4D] text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2">
                {isLoading ? <Loader2 className="animate-spin w-5 h-5" /> : 'Masuk Sekarang'}
              </button>
            </form>

            {/* Footer (Switch to Register) */}
            <div className="mt-auto pt-6 text-center relative z-10">
              <p className="text-[#2F4F4F] text-sm">
                Belum punya akun?{' '}
                <button onClick={() => setIsSignUp(true)} className="font-bold text-[#3E8467] hover:underline hover:text-[#2F5E4D] transition-colors">
                  Daftar di sini
                </button>
              </p>
            </div>
          </div>
        </div>

        {/* === SISI BELAKANG (REGISTER) === */}
        <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180">
          <div className="h-full w-full bg-gradient-to-br from-[#3E8467]/90 to-[#2F5E4D]/90 backdrop-blur-xl border border-white/20 rounded-[30px] shadow-2xl p-8 flex flex-col relative overflow-hidden text-white">
            
            {/* Dekorasi */}
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-white/20 rounded-full blur-2xl"></div>

            {/* Tombol Close */}
            <button onClick={closeLogin} className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-red-500/80 text-white rounded-full transition-all z-20">
              <X size={18} />
            </button>

            {/* Header */}
            <div className="text-center mb-6 relative z-10">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 border border-white/30 rounded-full mb-4 shadow-lg">
                <Leaf className="text-white" size={32} />
              </div>
              <h2 className="text-3xl font-bold">Bergabunglah</h2>
              <p className="text-green-100 text-sm mt-2">Mulai perjalanan hijau Anda hari ini</p>
            </div>

            {/* Form Register */}
            <form onSubmit={handleRegister} className="space-y-4 relative z-10">
              {/* Input Khusus Dark Background */}
              <div className="bg-white/10 backdrop-blur-md rounded-xl flex items-center px-4 py-3 w-full border border-white/30 focus-within:bg-white/20 transition-all">
                <User className="text-green-100 mr-3" size={18} />
                <input type="text" placeholder="Nama Lengkap" className="bg-transparent border-none outline-none text-sm w-full text-white placeholder-green-100/70" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-xl flex items-center px-4 py-3 w-full border border-white/30 focus-within:bg-white/20 transition-all">
                <Mail className="text-green-100 mr-3" size={18} />
                <input type="email" placeholder="Email" className="bg-transparent border-none outline-none text-sm w-full text-white placeholder-green-100/70" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-xl flex items-center px-4 py-3 w-full border border-white/30 focus-within:bg-white/20 transition-all">
                <Lock className="text-green-100 mr-3" size={18} />
                <input type="password" placeholder="Password" className="bg-transparent border-none outline-none text-sm w-full text-white placeholder-green-100/70" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>

              {error && <div className="bg-red-500/80 text-white text-xs px-3 py-2 rounded-lg text-center">{error}</div>}

              <button type="submit" disabled={isLoading} className="w-full py-3.5 bg-white text-[#3E8467] font-bold rounded-xl shadow-lg hover:bg-gray-100 transition-all transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 mt-2">
                {isLoading ? <Loader2 className="animate-spin w-5 h-5" /> : 'Buat Akun'}
              </button>
            </form>

            {/* Footer (Switch to Login) */}
            <div className="mt-auto pt-6 text-center relative z-10">
              <p className="text-green-100 text-sm">
                Sudah punya akun?{' '}
                <button onClick={() => setIsSignUp(false)} className="font-bold text-white hover:underline transition-colors">
                  Masuk
                </button>
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}