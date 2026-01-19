'use client';

import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface FinancialEntry {
  id: number;
  date: string;
  category: 'pemasukan' | 'pengeluaran';
  amount: number;
  description: string;
}

export default function FinancialReports() {
  const [entries, setEntries] = useState<FinancialEntry[]>([]);

  useEffect(() => {
    fetch('/api/financial')
      .then(res => res.json())
      .then(data => setEntries(data));
  }, []);

  // Group by month for chart
  const chartData = entries.reduce((acc, entry) => {
    const month = entry.date.substring(0, 7); // YYYY-MM
    if (!acc[month]) {
      acc[month] = { name: month, pemasukan: 0, pengeluaran: 0 };
    }
    if (entry.category === 'pemasukan') {
      acc[month].pemasukan += entry.amount;
    } else {
      acc[month].pengeluaran += entry.amount;
    }
    return acc;
  }, {} as Record<string, { name: string; pemasukan: number; pengeluaran: number }>);

  const chartArray = Object.values(chartData);

  const totalPemasukan = entries.filter(e => e.category === 'pemasukan').reduce((sum, e) => sum + e.amount, 0);
  const totalPengeluaran = entries.filter(e => e.category === 'pengeluaran').reduce((sum, e) => sum + e.amount, 0);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold text-primary mb-6">Laporan Keuangan</h1>
      <section className="mb-8">
        <h2 className="text-3xl font-semibold mb-4">Grafik Ringkasan Pemasukan vs Pengeluaran</h2>
        <div className="bg-white p-6 rounded shadow">
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={chartArray}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => value ? `Rp ${value.toLocaleString()}` : ''} />
              <Legend />
              <Bar dataKey="pemasukan" fill="#84934A" name="Pemasukan" />
              <Bar dataKey="pengeluaran" fill="#492828" name="Pengeluaran" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
      <section className="mb-8">
        <h2 className="text-3xl font-semibold mb-4">Tabel Laporan Bulanan</h2>
        <div className="bg-white p-6 rounded shadow overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2">Bulan</th>
                <th className="px-4 py-2">Pemasukan</th>
                <th className="px-4 py-2">Pengeluaran</th>
                <th className="px-4 py-2">Saldo</th>
              </tr>
            </thead>
            <tbody>
              {chartArray.map((item) => (
                <tr key={item.name} className="border-t">
                  <td className="px-4 py-2">{item.name}</td>
                  <td className="px-4 py-2">Rp {item.pemasukan.toLocaleString()}</td>
                  <td className="px-4 py-2">Rp {item.pengeluaran.toLocaleString()}</td>
                  <td className="px-4 py-2">Rp {(item.pemasukan - item.pengeluaran).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <section>
        <h2 className="text-3xl font-semibold mb-4">Laporan Tahunan</h2>
        <div className="bg-white p-6 rounded shadow">
          <p><strong>Total Pemasukan:</strong> Rp {totalPemasukan.toLocaleString()}</p>
          <p><strong>Total Pengeluaran:</strong> Rp {totalPengeluaran.toLocaleString()}</p>
          <p><strong>Saldo Akhir:</strong> Rp {(totalPemasukan - totalPengeluaran).toLocaleString()}</p>
          <button className="mt-4 bg-primary text-white px-4 py-2 rounded hover:bg-green-700">
            Unduh Laporan PDF
          </button>
        </div>
      </section>
    </div>
  );
}