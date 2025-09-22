// src/app/page.tsx
'use client';

import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation'; // <-- Impor useRouter

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter(); // <-- Inisialisasi router

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('http://localhost:3000/auth/login', {
        email: email,
        password: password,
      });

      // --- PERUBAHAN DI SINI ---
      // 1. Simpan token ke Local Storage
      localStorage.setItem('access_token', response.data.access_token);
      
      // 2. Arahkan ke halaman dashboard
      router.push('/dashboard');
      // --------------------------

    } catch (err: any) {
      console.error('Login Gagal:', err.response.data.message);
      setError(err.response.data.message || 'Terjadi kesalahan');
    }
  };

  return (
    <main style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div style={{ padding: '20px', fontFamily: 'sans-serif', border: '1px solid #ccc', borderRadius: '8px', width: '300px' }}>
        <h1>Admin Login</h1>
        <form onSubmit={handleLogin}>
          {/* ... sisa form tetap sama ... */}
          <div>
            <label>Email:</label><br />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ padding: '8px', margin: '5px 0', width: '95%' }}
            />
          </div>
          <div>
            <label>Password:</label><br />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ padding: '8px', margin: '5px 0', width: '95%' }}
            />
          </div>
          <button type="submit" style={{ padding: '10px 15px', marginTop: '10px', width: '100%' }}>
            Login
          </button>
        </form>

        {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      </div>
    </main>
  );
}