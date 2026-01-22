'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminDashboard() {
  const router = useRouter();
  const [isLoggedIn] = useState(() => {
    if (typeof window !== 'undefined') {
      return !!localStorage.getItem('adminLoggedIn');
    }
    return false;
  });

  useEffect(() => {
    const loggedIn = localStorage.getItem('adminLoggedIn');
    if (!loggedIn) {
      router.push('/admin/login');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('adminLoggedIn');
    router.push('/');
  };

  if (!isLoggedIn) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-bg-light">
      <nav className="bg-primary text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">Dashboard Admin</h1>
          <button onClick={handleLogout} className="bg-accent px-4 py-2 rounded hover:bg-red-700">
            Logout
          </button>
        </div>
      </nav>
      <div className="container mx-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link href="/admin/dashboard/content" className="bg-white p-6 rounded shadow hover:shadow-lg transition">
            <h2 className="text-xl font-semibold text-primary mb-2">Manajemen Konten</h2>
            <p>Tambah, edit, atau hapus dokumentasi kegiatan.</p>
          </Link>
          <Link href="/admin/dashboard/financial" className="bg-white p-6 rounded shadow hover:shadow-lg transition">
            <h2 className="text-xl font-semibold text-primary mb-2">Input Laporan Keuangan</h2>
            <p>Masukkan data pemasukan dan pengeluaran.</p>
          </Link>
          <Link href="/admin/dashboard/staff" className="bg-white p-6 rounded shadow hover:shadow-lg transition">
            <h2 className="text-xl font-semibold text-primary mb-2">Struktur Organisasi</h2>
            <p>Kelola pengurus dan dewan pengawas.</p>
          </Link>
          <Link href="/admin/dashboard/profile" className="bg-white p-6 rounded shadow hover:shadow-lg transition">
            <h2 className="text-xl font-semibold text-primary mb-2">Pengaturan Profil</h2>
            <p>Ubah password dan informasi koperasi.</p>
          </Link>
        </div>
      </div>
    </div>
  );
}