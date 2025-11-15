'use client';

import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import api from '../../app/lib/api';

interface ImageUploadProps {
  onUploadSuccess: (url: string) => void;
  endpoint: string; // <-- Tambahkan prop endpoint
}

export function ImageUpload({ onUploadSuccess, endpoint }: ImageUploadProps) {
  const [status, setStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setStatus('uploading');
    setErrorMessage('');
    const formData = new FormData();
    formData.append('file', file);

    try {
      // Kirim file ke endpoint yang ditentukan
      const response = await api.post(endpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      // Panggil fungsi callback dengan URL yang dikembalikan backend
      onUploadSuccess(response.data.imageUrl);
      setStatus('success');
    } catch (error) {
      console.error('Upload failed:', error);
      setErrorMessage('Upload gagal. Coba lagi.');
      setStatus('error');
    }
  }, [onUploadSuccess, endpoint]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.png', '.jpg', '.gif'] },
    multiple: false,
  });

  const renderContent = () => {
    switch (status) {
      case 'uploading':
        return (
          <>
            <Loader2 className="h-10 w-10 animate-spin text-gray-500" />
            <p className="mt-2 text-sm text-gray-600">Mengupload...</p>
          </>
        );
      case 'success':
        return (
          <>
            <CheckCircle className="h-10 w-10 text-green-500" />
            <p className="mt-2 text-sm text-green-600">Upload Berhasil!</p>
          </>
        );
      case 'error':
        return (
          <>
            <AlertCircle className="h-10 w-10 text-red-500" />
            <p className="mt-2 text-sm text-red-600">{errorMessage}</p>
          </>
        );
      default:
        return (
          <>
            <UploadCloud className="h-10 w-10 text-gray-400" />
            <p className="mt-2 text-sm text-gray-600">
              <span className="font-semibold">Klik untuk memilih</span> atau seret file ke sini
            </p>
            <p className="text-xs text-gray-500">PNG, JPG, GIF (MAX. 800x400px)</p>
          </>
        );
    }
  };

  return (
    <div
      {...getRootProps()}
      className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer transition-colors
        ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50 hover:bg-gray-100'}
        ${status === 'success' && 'border-green-500 bg-green-50'}
        ${status === 'error' && 'border-red-500 bg-red-50'}`}
    >
      <input {...getInputProps()} />
      {renderContent()}
    </div>
  );
}