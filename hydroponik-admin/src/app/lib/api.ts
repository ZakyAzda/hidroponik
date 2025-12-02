import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000', // Pastikan URL backend benar
});

// Interceptor: Pasang Token Otomatis
api.interceptors.request.use(
  (config) => {
    // Ambil langsung dari localStorage (Lebih aman daripada Store untuk request awal)
    const token = localStorage.getItem('access_token');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;