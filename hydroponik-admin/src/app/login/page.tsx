'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Eye, EyeOff, Lock, Mail, Shield } from 'lucide-react';
import { useAuthStore } from '../../store/authStore'; // <-- 1. Impor store Zustand

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  
  // 2. Ambil fungsi dari store
  const setToken = useAuthStore((state) => state.setToken);
  const setUser = useAuthStore((state) => state.setUser);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await axios.post('http://localhost:3000/auth/login', {
        email: email,
        password: password,
      });

      // 3. Gunakan fungsi dari store untuk menyimpan state
      const { access_token, user } = response.data;
      setToken(access_token);
      setUser(user);
      
      router.push('/dashboard');

    } catch (err: any) {
      setError(err.response?.data?.message || 'Terjadi kesalahan');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4 relative">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 25% 25%, #000 2px, transparent 2px)',
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        <form onSubmit={handleLogin}>
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden transform hover:shadow-2xl transition-shadow duration-300">
            <div className="bg-gradient-to-r from-gray-800 to-black p-8 text-center relative">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-full mb-4 backdrop-blur-sm">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">Admin Portal</h1>
              <p className="text-gray-300 text-sm">Selamat datang kembali</p>
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-gradient-to-r from-gray-500 to-gray-400 rounded-full"></div>
            </div>

            <div className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-500" />
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    placeholder="admin@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all duration-200 hover:bg-gray-100"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-gray-500" />
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full px-4 py-3 pr-12 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all duration-200 hover:bg-gray-100"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm text-center font-medium">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-gray-800 hover:bg-black text-white font-semibold rounded-lg transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-gray-300 border-t-white rounded-full animate-spin"></div>
                    <span>Memproses...</span>
                  </>
                ) : (
                  <>
                    <Shield className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                    <span>Masuk ke Dashboard</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
