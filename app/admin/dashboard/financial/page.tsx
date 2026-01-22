'use client';

import { useEffect, useState } from 'react';

interface FinancialReport {
  id: number;
  month: string;
  fileName: string;
  blobUrl: string;
  fileType: 'pdf' | 'excel';
  uploadedAt: string;
  uploadedBy?: string;
}

export default function FinancialInput() {
  const [reports, setReports] = useState<FinancialReport[]>([]);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await fetch('/api/financial');
      const data = await response.json();
      setReports(data);
    } catch (error) {
      console.error('Failed to fetch reports:', error);
      setMessage('Gagal memuat laporan');
    }
  };

  const getCurrentMonth = () => {
    const now = new Date();
    return now.toISOString().slice(0, 7); // YYYY-MM format
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file || !selectedMonth) {
      setMessage('Pilih file dan bulan');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('month', selectedMonth);
      formData.append('uploadedBy', 'admin');

      const response = await fetch('/api/financial', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const newReport = await response.json();
        setReports((prev) => {
          const filtered = prev.filter((r) => r.month !== selectedMonth);
          return [...filtered, newReport].sort((a, b) => b.month.localeCompare(a.month));
        });
        setFile(null);
        setSelectedMonth('');
        setMessage('Laporan berhasil diupload');
        setTimeout(() => setMessage(''), 3000);
      } else {
        const error = await response.json();
        setMessage(error.error || 'Gagal mengupload laporan');
      }
    } catch (error) {
      console.error('Upload error:', error);
      setMessage('Terjadi kesalahan saat upload');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number, month: string) => {
    if (!confirm('Hapus laporan bulan ' + month + '?')) return;

    try {
      const response = await fetch(`/api/financial/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setReports((prev) => prev.filter((r) => r.id !== id));
        setMessage('Laporan berhasil dihapus');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      console.error('Delete error:', error);
      setMessage('Gagal menghapus laporan');
    }
  };

  const generateMonthOptions = () => {
    const months = [];
    const now = new Date();
    for (let i = 0; i < 12; i++) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const monthStr = `${year}-${month}`;
      const label = new Intl.DateTimeFormat('id-ID', { year: 'numeric', month: 'long' }).format(date);
      months.push({ value: monthStr, label });
    }
    return months;
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-primary mb-6">Upload Laporan Keuangan</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upload Form */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Upload Laporan Bulanan</h2>
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow">
            {message && (
              <div className={`mb-4 p-3 rounded ${message.includes('berhasil') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {message}
              </div>
            )}
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Pilih Bulan</label>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded"
                required
              >
                <option value="">-- Pilih Bulan --</option>
                {generateMonthOptions().map((month) => (
                  <option key={month.value} value={month.value}>
                    {month.label} ({month.value})
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Upload File (PDF/Excel)</label>
              <input
                type="file"
                onChange={handleFileChange}
                className="w-full px-3 py-2 border border-gray-300 rounded"
                accept=".pdf,.xls,.xlsx"
                required
              />
              {file && <p className="text-sm text-gray-600 mt-2">File: {file.name}</p>}
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-primary text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? 'Uploading...' : 'Upload Laporan'}
            </button>
          </form>
        </div>

        {/* Reports List */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Laporan yang Telah Diupload</h2>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {reports.length === 0 ? (
              <p className="text-gray-500">Belum ada laporan yang diupload</p>
            ) : (
              reports.map((report) => (
                <div key={report.id} className="bg-white p-4 rounded shadow flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-semibold">{report.month}</p>
                    <p className="text-sm text-gray-600">{report.fileName}</p>
                    <p className="text-xs text-gray-500">
                      Diupload: {new Date(report.uploadedAt).toLocaleDateString('id-ID')}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <a
                      href={report.blobUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                    >
                      Lihat
                    </a>
                    <button
                      onClick={() => handleDelete(report.id, report.month)}
                      className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}