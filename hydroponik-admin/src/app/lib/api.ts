// src/lib/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000', // Base URL backend Anda
});

// Ini adalah "interceptor"
// Kode ini akan berjalan SEBELUM setiap request dikirim
api.interceptors.request.use(
  (config) => {
    // Ambil token dari local storage
    const token = localStorage.getItem('access_token');
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