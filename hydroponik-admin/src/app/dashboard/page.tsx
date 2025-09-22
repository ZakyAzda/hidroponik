'use client';

import withAuth from "./withAuth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import api from "../lib/api";
import Link from 'next/link';
import { Button } from "@/components/ui/button"; 


interface UserProfile {
  name: string;
  email: string;
  role: string;
}

function DashboardPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/auth/profile');
        setProfile(response.data);
      } catch (error) {
        console.error("Gagal Mengambil profil:", error);
        localStorage.removeItem('access_token');
        router.push('/'); 
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    router.push('/');
  };

  if (loading) {
    return <p>Loading profile...</p>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <h1>Selamat Datang di Dashboard!</h1>
      
      {/* Bagian Navigasi */}
      <div style={{ marginTop: '20px' }}>
        <Link href="/dashboard/products">
          <Button style={{ padding: '10px 15px' }}>
            Lihat Manajemen Produk
          </Button>
        </Link>
      </div>
      
      {/* Bagian Profil yang Hilang */}
      {profile && (
        <div style={{ marginTop: '20px', border: '1px solid #ccc', padding: '15px' }}>
          <h2>Profil Anda</h2>
          <p><strong>Nama:</strong> {profile.name}</p>
          <p><strong>Email:</strong> {profile.email}</p>
          <p><strong>Role:</strong> {profile.role}</p>
        </div>
      )}
      
      {/* Tombol Logout */}
      <Button 
        onClick={handleLogout} 
        style={{ marginTop: '20px', padding: '10px 15px' }}
      >
        Logout
      </Button>
    </div>
  );
}

export default withAuth(DashboardPage);