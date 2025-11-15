// src/lib/api.ts
import axios from 'axios';
import { useAuthStore } from '../../store/authStore'; // Sesuaikan path jika berbeda

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL, // Base URL backend Anda
});

// Ini adalah "interceptor"
// Kode ini akan berjalan SEBELUM setiap request dikirim
api.interceptors.request.use(
  (config) => {
    // Ambil token dari Zustand store
    const token = useAuthStore.getState().token; // Menggunakan .getState() untuk mengambil state di luar komponen React
    if (token) {
      // Jika token ada, tambahkan ke header Authorization
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default api;