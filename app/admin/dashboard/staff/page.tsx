'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface StaffMember {
  id?: number;
  name: string;
  position: string;
  category: 'pengurus' | 'dewan_pengawas';
  imageUrl?: string;
}

interface ConfirmState {
  show: boolean;
  type: 'add' | 'edit' | 'delete';
  staffId?: number;
}

export default function StaffManagement() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [confirm, setConfirm] = useState<ConfirmState>({
    show: false,
    type: 'add'
  });
  const [formData, setFormData] = useState<StaffMember>({
    name: '',
    position: '',
    category: 'pengurus',
    imageUrl: ''
  });

  useEffect(() => {
    const loggedIn = localStorage.getItem('adminLoggedIn');
    if (!loggedIn) {
      router.push('/admin/login');
    } else {
      setIsLoggedIn(true);
      fetchStaff();
    }
  }, [router]);

  const fetchStaff = async () => {
    try {
      const res = await fetch('/api/staff');
      if (res.ok) {
        const data = await res.json();
        setStaff(data);
      }
    } catch (error) {
      console.error('Failed to fetch staff:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setConfirm({
      show: true,
      type: editingId ? 'edit' : 'add'
    });
  };

  const confirmSubmit = async () => {
    try {
      const url = editingId ? `/api/staff` : `/api/staff`;
      const method = editingId ? 'PUT' : 'POST';
      const body = editingId ? { id: editingId, ...formData } : formData;

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (res.ok) {
        await fetchStaff();
        resetForm();
        setConfirm({ show: false, type: 'add' });
      }
    } catch (error) {
      console.error('Failed to save staff:', error);
    }
  };

  const handleEdit = (member: StaffMember) => {
    setFormData(member);
    setEditingId(member.id || null);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    setConfirm({
      show: true,
      type: 'delete',
      staffId: id
    });
  };

  const confirmDelete = async () => {
    if (!confirm.staffId) return;

    try {
      const res = await fetch(`/api/staff?id=${confirm.staffId}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        await fetchStaff();
        setConfirm({ show: false, type: 'add' });
      }
    } catch (error) {
      console.error('Failed to delete staff:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      position: '',
      category: 'pengurus',
      imageUrl: ''
    });
    setEditingId(null);
    setShowForm(false);
  };

  if (!isLoggedIn) {
    return <div className="text-center py-8">Loading...</div>;
  }

  const pengurus = staff.filter(s => s.category === 'pengurus');
  const dewanPengawas = staff.filter(s => s.category === 'dewan_pengawas');

  return (
    <div className="min-h-screen bg-bg-light">
      <nav className="bg-primary text-white p-4">
        <div className="container mx-auto">
          <Link href="/admin/dashboard" className="text-white hover:text-gray-200">← Kembali ke Dashboard</Link>
        </div>
      </nav>

      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold text-primary mb-6">Manajemen Struktur Organisasi</h1>

        {/* Add/Edit Form */}
        {showForm && (
          <div className="bg-white p-6 rounded shadow mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              {editingId ? 'Edit Anggota' : 'Tambah Anggota Baru'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Nama</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Posisi</label>
                <input
                  type="text"
                  name="position"
                  value={formData.position}
                  onChange={handleInputChange}
                  required
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Kategori</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="pengurus">Pengurus</option>
                  <option value="dewan_pengawas">Dewan Pengawas</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">URL Foto (opsional)</label>
                <input
                  type="url"
                  name="imageUrl"
                  value={formData.imageUrl || ''}
                  onChange={handleInputChange}
                  className="w-full border rounded px-3 py-2"
                  placeholder="https://example.com/photo.jpg"
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark"
                >
                  {editingId ? 'Perbarui' : 'Tambah'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        )}

        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-primary text-white px-6 py-2 rounded mb-6 hover:bg-primary-dark"
          >
            + Tambah Anggota
          </button>
        )}

        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : (
          <>
            {/* Pengurus Section */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Pengurus ({pengurus.length})</h2>
              <div className="bg-white rounded shadow overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-2 text-left">Nama</th>
                      <th className="px-4 py-2 text-left">Posisi</th>
                      <th className="px-4 py-2 text-left">Foto</th>
                      <th className="px-4 py-2 text-left">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pengurus.map(member => (
                      <tr key={member.id} className="border-t hover:bg-gray-50">
                        <td className="px-4 py-2">{member.name}</td>
                        <td className="px-4 py-2">{member.position}</td>
                        <td className="px-4 py-2">
                          {member.imageUrl ? (
                            <a href={member.imageUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                              Lihat
                            </a>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                        <td className="px-4 py-2 space-x-2">
                          <button
                            onClick={() => handleEdit(member)}
                            className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => member.id && handleDelete(member.id)}
                            className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
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

            {/* Dewan Pengawas Section */}
            <div>
              <h2 className="text-2xl font-semibold mb-4">Dewan Pengawas ({dewanPengawas.length})</h2>
              <div className="bg-white rounded shadow overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-2 text-left">Nama</th>
                      <th className="px-4 py-2 text-left">Posisi</th>
                      <th className="px-4 py-2 text-left">Foto</th>
                      <th className="px-4 py-2 text-left">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dewanPengawas.map(member => (
                      <tr key={member.id} className="border-t hover:bg-gray-50">
                        <td className="px-4 py-2">{member.name}</td>
                        <td className="px-4 py-2">{member.position}</td>
                        <td className="px-4 py-2">
                          {member.imageUrl ? (
                            <a href={member.imageUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                              Lihat
                            </a>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                        <td className="px-4 py-2 space-x-2">
                          <button
                            onClick={() => handleEdit(member)}
                            className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => member.id && handleDelete(member.id)}
                            className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
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
          </>
        )}

        {/* Confirmation Modal */}
        {confirm.show && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-sm w-full p-6">
              <h2 className="text-2xl font-bold mb-4 text-primary">
                {confirm.type === 'add' && 'Konfirmasi Tambah Anggota'}
                {confirm.type === 'edit' && 'Konfirmasi Edit Anggota'}
                {confirm.type === 'delete' && 'Konfirmasi Hapus Anggota'}
              </h2>
              <p className="text-gray-700 mb-6">
                {confirm.type === 'add' && (
                  <>Apakah Anda yakin ingin menambahkan anggota <strong>&quot;{formData.name}&quot;</strong> sebagai <strong>{formData.position}</strong>?</>
                )}
                {confirm.type === 'edit' && (
                  <>Apakah Anda yakin ingin mengubah data anggota <strong>&quot;{formData.name}&quot;</strong>?</>
                )}
                {confirm.type === 'delete' && (
                  <>Apakah Anda yakin ingin menghapus anggota ini? Tindakan ini tidak dapat dibatalkan.</>
                )}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setConfirm({ show: false, type: 'add' })}
                  className="flex-1 bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 transition"
                >
                  Batal
                </button>
                <button
                  onClick={() => {
                    if (confirm.type === 'delete') {
                      confirmDelete();
                    } else {
                      confirmSubmit();
                    }
                  }}
                  className={`flex-1 text-white px-4 py-2 rounded transition ${
                    confirm.type === 'delete'
                      ? 'bg-red-500 hover:bg-red-600'
                      : 'bg-primary hover:bg-green-700'
                  }`}
                >
                  {confirm.type === 'delete' ? 'Hapus' : confirm.type === 'add' ? 'Tambah' : 'Perbarui'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
