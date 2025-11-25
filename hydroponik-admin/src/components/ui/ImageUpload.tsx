'use client';

import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, Loader2, CheckCircle, AlertCircle, X } from 'lucide-react';
import axios from 'axios';

interface ImageUploadProps {
  onUploadSuccess: (url: string) => void;
  endpoint: string; // <-- Ini PENTING (products/services)
}

export function ImageUpload({ onUploadSuccess, endpoint }: ImageUploadProps) {
  const [status, setStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [preview, setPreview] = useState<string | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    // 1. Tampilkan Preview Lokal (UX)
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    setStatus('uploading');
    setErrorMessage('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      // 2. AMBIL TOKEN DARI LOCALSTORAGE
      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error("Sesi habis. Silakan login kembali.");
      }

      // 3. KIRIM FILE DENGAN HEADER AUTHORIZATION
      // URL otomatis menyesuaikan endpoint yang dikirim (products atau services)
      const response = await axios.post(`http://localhost:3000/${endpoint}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`, // <--- KUNCI AGAR TIDAK 401 UNAUTHORIZED
        },
      });
      
      // 4. SUKSES
      onUploadSuccess(response.data.imageUrl);
      setStatus('success');

    } catch (error: any) {
      console.error('Upload failed:', error);
      setErrorMessage(error.response?.data?.message || error.message || 'Upload gagal. Coba lagi.');
      setStatus('error');
      // Jangan hapus preview dulu biar user tau gambar mana yang gagal
    }
  }, [onUploadSuccess, endpoint]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.png', '.jpg', '.gif', '.webp'] },
    multiple: false,
    disabled: status === 'uploading', // Disable dropzone saat upload
  });

  // Fungsi Reset (Tombol X)
  const handleReset = (e: React.MouseEvent) => {
    e.stopPropagation(); // Mencegah klik tembus ke dropzone
    setStatus('idle');
    setPreview(null);
    onUploadSuccess(''); // Beritahu parent form kalau gambar dihapus
  };

  const renderContent = () => {
    // TAMPILAN SAAT ADA GAMBAR (PREVIEW / UPLOADING / SUCCESS)
    if (preview && status !== 'error') {
        return (
            <div className="relative w-full h-full group">
                <img src={preview} alt="Preview" className="w-full h-full object-cover rounded-lg opacity-80" />
                
                {status === 'uploading' && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 rounded-lg backdrop-blur-[2px]">
                        <Loader2 className="h-10 w-10 animate-spin text-white" />
                        <p className="text-white text-xs mt-2 font-medium">Mengupload...</p>
                    </div>
                )}
                
                {status === 'success' && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-green-500/20 rounded-lg backdrop-blur-sm">
                        <CheckCircle className="h-12 w-12 text-green-600 drop-shadow-md" />
                        <p className="text-white font-bold shadow-black drop-shadow-md mt-2">Berhasil!</p>
                        
                        {/* Tombol Hapus/Reset */}
                        <button 
                            onClick={handleReset} 
                            className="absolute top-2 right-2 p-1.5 bg-white/80 hover:bg-red-500 hover:text-white rounded-full transition-all shadow-md"
                            title="Ganti Gambar"
                        >
                            <X size={16} />
                        </button>
                    </div>
                )}
            </div>
        )
    }

    // TAMPILAN SAAT KOSONG / ERROR
    switch (status) {
      case 'error':
        return (
          <>
            <AlertCircle className="h-10 w-10 text-red-500" />
            <p className="mt-2 text-sm text-red-600 text-center px-4 font-medium">{errorMessage}</p>
            <button onClick={(e) => { e.stopPropagation(); setStatus('idle'); setPreview(null); }} className="mt-2 text-xs underline text-gray-500 hover:text-gray-800">Coba Lagi</button>
          </>
        );
      default:
        return (
          <>
            <UploadCloud className={`h-10 w-10 transition-colors ${isDragActive ? 'text-blue-500' : 'text-gray-400'}`} />
            <p className="mt-2 text-sm text-gray-600 text-center">
              <span className="font-semibold text-[#3E8467]">Klik untuk upload</span> atau seret gambar
            </p>
            <p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP (Max 5MB)</p>
          </>
        );
    }
  };

  return (
    <div
      {...getRootProps()}
      className={`relative flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-300 overflow-hidden
        ${isDragActive ? 'border-blue-500 bg-blue-50 scale-[1.02]' : 'border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-[#3E8467]'}
        ${status === 'error' ? 'border-red-300 bg-red-50' : ''}
        ${status === 'success' ? 'border-green-500 ring-2 ring-green-100' : ''}
      `}
    >
      <input {...getInputProps()} />
      {renderContent()}
    </div>
  );
}