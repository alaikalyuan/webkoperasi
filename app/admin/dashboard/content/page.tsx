'use client';

import { useEffect, useState } from 'react';

interface Activity {
  id: number;
  title: string;
  description: string;
  date: string;
}

export default function ContentManagement() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [formData, setFormData] = useState({ title: '', description: '', date: '' });

  useEffect(() => {
    fetch('/api/activities')
      .then(res => res.json())
      .then(data => setActivities(data));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch('/api/activities', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    if (response.ok) {
      const newActivity = await response.json();
      setActivities([...activities, newActivity]);
      setFormData({ title: '', description: '', date: '' });
    }
  };

  const handleDelete = async (id: number) => {
    // For simplicity, just remove from state. In real app, add DELETE API
    setActivities(activities.filter(activity => activity.id !== id));
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-primary mb-6">Manajemen Konten Kegiatan</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Tambah Kegiatan Baru</h2>
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow">
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Judul</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
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
                rows={4}
                required
              />
            </div>
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
            <button type="submit" className="bg-primary text-white px-4 py-2 rounded hover:bg-green-700">
              Tambah Kegiatan
            </button>
          </form>
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-4">Daftar Kegiatan</h2>
          <div className="space-y-4">
            {activities.map(activity => (
              <div key={activity.id} className="bg-white p-4 rounded shadow">
                <h3 className="text-xl font-semibold">{activity.title}</h3>
                <p className="text-gray-600">{activity.description}</p>
                <p className="text-sm text-gray-500">{activity.date}</p>
                <button
                  onClick={() => handleDelete(activity.id)}
                  className="mt-2 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700"
                >
                  Hapus
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}