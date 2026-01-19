'use client';

import { useEffect, useState } from 'react';

interface Member {
  id: number;
  name: string;
  address: string;
  joinDate: string;
}

export default function MembersManagement() {
  const [members, setMembers] = useState<Member[]>([]);
  const [formData, setFormData] = useState({ name: '', address: '', joinDate: '' });

  useEffect(() => {
    fetch('/api/members')
      .then(res => res.json())
      .then(data => setMembers(data));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch('/api/members', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    if (response.ok) {
      const newMember = await response.json();
      setMembers([...members, newMember]);
      setFormData({ name: '', address: '', joinDate: '' });
    }
  };

  const handleDelete = (id: number) => {
    setMembers(members.filter(member => member.id !== id));
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-primary mb-6">Manajemen Anggota</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Tambah Anggota Baru</h2>
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow">
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Nama</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Alamat</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Tanggal Bergabung</label>
              <input
                type="date"
                value={formData.joinDate}
                onChange={(e) => setFormData({ ...formData, joinDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded"
                required
              />
            </div>
            <button type="submit" className="bg-primary text-white px-4 py-2 rounded hover:bg-green-700">
              Tambah Anggota
            </button>
          </form>
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-4">Daftar Anggota ({members.length})</h2>
          <div className="bg-white p-4 rounded shadow max-h-96 overflow-y-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2 text-left">Nama</th>
                  <th className="px-4 py-2 text-left">Alamat</th>
                  <th className="px-4 py-2 text-left">Tanggal Bergabung</th>
                  <th className="px-4 py-2">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {members.map(member => (
                  <tr key={member.id} className="border-t">
                    <td className="px-4 py-2">{member.name}</td>
                    <td className="px-4 py-2">{member.address}</td>
                    <td className="px-4 py-2">{member.joinDate}</td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => handleDelete(member.id)}
                        className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-700 text-sm"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}