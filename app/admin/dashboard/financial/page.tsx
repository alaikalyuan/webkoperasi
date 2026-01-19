'use client';

import { useEffect, useState } from 'react';

interface FinancialEntry {
  id: number;
  date: string;
  category: 'pemasukan' | 'pengeluaran';
  amount: number;
  description: string;
}

export default function FinancialInput() {
  const [entries, setEntries] = useState<FinancialEntry[]>([]);
  const [formData, setFormData] = useState({
    date: '',
    category: 'pemasukan' as 'pemasukan' | 'pengeluaran',
    amount: '',
    description: ''
  });
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    fetch('/api/financial')
      .then(res => res.json())
      .then(data => setEntries(data));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch('/api/financial', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...formData,
        amount: parseInt(formData.amount)
      })
    });
    if (response.ok) {
      const newEntry = await response.json();
      setEntries([...entries, newEntry]);
      setFormData({ date: '', category: 'pemasukan', amount: '', description: '' });
      setFile(null);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-primary mb-6">Input Laporan Keuangan</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Tambah Entri Keuangan</h2>
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow">
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Tanggal</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Kategori</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as 'pemasukan' | 'pengeluaran' })}
                className="w-full px-3 py-2 border border-gray-300 rounded"
              >
                <option value="pemasukan">Pemasukan</option>
                <option value="pengeluaran">Pengeluaran</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Jumlah (Rp)</label>
              <input
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Deskripsi</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded"
                rows={3}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Upload File (Kwitansi/PDF)</label>
              <input
                type="file"
                onChange={handleFileChange}
                className="w-full px-3 py-2 border border-gray-300 rounded"
                accept=".pdf,.jpg,.jpeg,.png"
              />
            </div>
            <button type="submit" className="bg-primary text-white px-4 py-2 rounded hover:bg-green-700">
              Tambah Entri
            </button>
          </form>
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-4">Entri Terbaru</h2>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {entries.map(entry => (
              <div key={entry.id} className="bg-white p-4 rounded shadow">
                <div className="flex justify-between">
                  <span className={`font-semibold ${entry.category === 'pemasukan' ? 'text-green-600' : 'text-red-600'}`}>
                    {entry.category === 'pemasukan' ? 'Pemasukan' : 'Pengeluaran'}
                  </span>
                  <span className="font-bold">Rp {entry.amount.toLocaleString()}</span>
                </div>
                <p className="text-gray-600">{entry.description}</p>
                <p className="text-sm text-gray-500">{entry.date}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}