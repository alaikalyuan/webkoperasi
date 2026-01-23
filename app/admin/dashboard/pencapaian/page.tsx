'use client';

import { useEffect, useState } from 'react';

interface Pencapaian {
  id: number | null;
  totalAssets: string;
  totalMembers: number;
  updatedAt: string;
}

export default function PencapaianManagement() {
  const [pencapaian, setPencapaian] = useState<Pencapaian | null>(null);
  const [formData, setFormData] = useState({ totalAssets: '', totalMembers: '' });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchPencapaian();
  }, []);

  const fetchPencapaian = async () => {
    try {
      const response = await fetch('/api/pencapaian');
      const data = await response.json();
      setPencapaian(data);
      setFormData({
        totalAssets: data.totalAssets,
        totalMembers: data.totalMembers.toString(),
      });
    } catch (error) {
      console.error('Failed to fetch pencapaian:', error);
      setMessage('Gagal memuat data pencapaian');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/pencapaian', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          totalAssets: formData.totalAssets,
          totalMembers: parseInt(formData.totalMembers),
        }),
      });

      if (response.ok) {
        const updated = await response.json();
        setPencapaian(updated);
        setMessage('Data pencapaian berhasil disimpan');
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('Gagal menyimpan data pencapaian');
      }
    } catch (error) {
      console.error('Failed to save pencapaian:', error);
      setMessage('Terjadi kesalahan saat menyimpan');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !pencapaian) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Memuat data pencapaian...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-primary mb-6">Manajemen Pencapaian</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Edit Form */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Edit Data Pencapaian</h2>
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow">
            {message && (
              <div
                className={`mb-4 p-3 rounded ${
                  message.includes('berhasil')
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                }`}
              >
                {message}
              </div>
            )}

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Total Aset</label>
              <input
                type="text"
                value={formData.totalAssets}
                onChange={(e) =>
                  setFormData({ ...formData, totalAssets: e.target.value })
                }
                placeholder="Contoh: Rp 500.000.000"
                className="w-full px-3 py-2 border border-gray-300 rounded"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Masukkan format seperti: Rp 500.000.000
              </p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Jumlah Anggota</label>
              <input
                type="number"
                value={formData.totalMembers}
                onChange={(e) =>
                  setFormData({ ...formData, totalMembers: e.target.value })
                }
                placeholder="Contoh: 150"
                className="w-full px-3 py-2 border border-gray-300 rounded"
                required
                min="0"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white px-4 py-2 rounded hover:bg-green-700 disabled:bg-gray-400 transition"
            >
              {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
          </form>
        </div>

        {/* Preview */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Pratinjau</h2>
          <div className="bg-white p-6 rounded shadow">
            <div className="bg-gradient-to-br from-primary to-green-700 p-6 rounded text-white mb-4">
              <h3 className="text-lg font-semibold mb-4">Pencapaian Koperasi</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm opacity-90">Total Aset</p>
                  <p className="text-3xl font-bold">{formData.totalAssets || 'Rp -'}</p>
                </div>
                <div>
                  <p className="text-sm opacity-90">Jumlah Anggota</p>
                  <p className="text-3xl font-bold">{formData.totalMembers || '0'} orang</p>
                </div>
              </div>
            </div>

            {pencapaian?.updatedAt && (
              <div className="text-sm text-gray-600">
                <p>
                  Terakhir diperbarui:{' '}
                  {new Date(pencapaian.updatedAt).toLocaleDateString('id-ID', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
