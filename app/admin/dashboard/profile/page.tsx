'use client';

import { useEffect, useState } from 'react';

interface CooperativeInfo {
  name: string;
  address: string;
  phone: string;
  email: string;
}

export default function ProfileSettings() {
  const [cooperativeInfo, setCooperativeInfo] = useState<CooperativeInfo>({
    name: '',
    address: '',
    phone: '',
    email: ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    fetch('/api/cooperative')
      .then(res => res.json())
      .then(data => setCooperativeInfo(data));
  }, []);

  const handleInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch('/api/cooperative', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cooperativeInfo)
    });
    if (response.ok) {
      alert('Informasi koperasi telah diperbarui!');
    }
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('Password baru tidak cocok!');
      return;
    }
    // Change password logic
    alert('Password telah diubah!');
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-primary mb-6">Pengaturan Profil</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Informasi Koperasi</h2>
          <form onSubmit={handleInfoSubmit} className="bg-white p-6 rounded shadow">
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Nama Koperasi</label>
              <input
                type="text"
                value={cooperativeInfo.name}
                onChange={(e) => setCooperativeInfo({ ...cooperativeInfo, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Alamat</label>
              <textarea
                value={cooperativeInfo.address}
                onChange={(e) => setCooperativeInfo({ ...cooperativeInfo, address: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded"
                rows={3}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Telepon</label>
              <input
                type="text"
                value={cooperativeInfo.phone}
                onChange={(e) => setCooperativeInfo({ ...cooperativeInfo, phone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                value={cooperativeInfo.email}
                onChange={(e) => setCooperativeInfo({ ...cooperativeInfo, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded"
              />
            </div>
            <button type="submit" className="bg-primary text-white px-4 py-2 rounded hover:bg-green-700">
              Simpan Perubahan
            </button>
          </form>
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-4">Ubah Password Admin</h2>
          <form onSubmit={handlePasswordSubmit} className="bg-white p-6 rounded shadow">
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Password Saat Ini</label>
              <input
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Password Baru</label>
              <input
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Konfirmasi Password Baru</label>
              <input
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded"
                required
              />
            </div>
            <button type="submit" className="bg-primary text-white px-4 py-2 rounded hover:bg-green-700">
              Ubah Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}