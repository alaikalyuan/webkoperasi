'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface Activity {
  id: number;
  title: string;
  description: string;
  date: string;
  imageUrl?: string;
  imageUrl2?: string;
  imageUrl3?: string;
  imageUrl4?: string;
}

export default function ContentManagement() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [formData, setFormData] = useState({ title: '', description: '', date: '' });
  const [imageFiles, setImageFiles] = useState<(File | null)[]>([null, null, null, null]);
  const [imagePreviews, setImagePreviews] = useState<(string)[]>(['', '', '', '']);
  const [showAddConfirm, setShowAddConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteActivityId, setDeleteActivityId] = useState<number | null>(null);

  useEffect(() => {
    fetch('/api/activities')
      .then(res => res.json())
      .then(data => setActivities(data));
  }, []);

  const handleImageChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const newFiles = [...imageFiles];
    const newPreviews = [...imagePreviews];

    if (file) {
      newFiles[index] = file;
      const reader = new FileReader();
      reader.onloadend = () => {
        newPreviews[index] = reader.result as string;
        setImagePreviews(newPreviews);
      };
      reader.readAsDataURL(file);
    } else {
      newFiles[index] = null;
      newPreviews[index] = '';
    }
    setImageFiles(newFiles);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowAddConfirm(true);
  };

  const confirmAdd = async () => {
    setShowAddConfirm(false);
    const formDataToSend = new FormData();
    formDataToSend.append('title', formData.title);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('date', formData.date);
    
    imageFiles.forEach((file, index) => {
      if (file) {
        formDataToSend.append(`image${index + 1}`, file);
      }
    });

    const response = await fetch('/api/activities', {
      method: 'POST',
      body: formDataToSend
    });
    if (response.ok) {
      const newActivity = await response.json();
      setActivities([...activities, newActivity]);
      setFormData({ title: '', description: '', date: '' });
      setImageFiles([null, null, null, null]);
      setImagePreviews(['', '', '', '']);
    }
  };

  const handleDelete = async (id: number) => {
    setDeleteActivityId(id);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (deleteActivityId === null) return;

    try {
      const response = await fetch(`/api/activities?id=${deleteActivityId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setActivities(activities.filter(activity => activity.id !== deleteActivityId));
        setShowDeleteConfirm(false);
        setDeleteActivityId(null);
      } else {
        alert('Gagal menghapus kegiatan');
      }
    } catch (error) {
      console.error('Error deleting activity:', error);
      alert('Terjadi kesalahan saat menghapus');
    }
  };

  return (
    <div className='min-h-screen bg-bg-light'>
      <nav className="bg-primary text-white p-4">
        <div className="container mx-auto">
          <Link href="/admin/dashboard" className="text-white hover:text-gray-200">← Kembali ke Dashboard</Link>
        </div>
      </nav>
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
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Gambar (Opsional - maksimal 4 gambar)</label>
              <p className="text-xs text-gray-500 mb-3">Gambar pertama akan menjadi thumbnail</p>
              {[0, 1, 2, 3].map((index) => (
                <div key={index} className="mb-3">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageChange(index, e)}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                  />
                  {imagePreviews[index] && (
                    <div className="mt-2">
                      <p className="text-xs text-gray-600 mb-1">Preview Gambar {index + 1}:</p>
                      <img src={imagePreviews[index]} alt={`Preview ${index + 1}`} className="w-full h-32 object-cover rounded" />
                    </div>
                  )}
                </div>
              ))}
            </div>
            <button type="submit" className="bg-primary text-white px-4 py-2 rounded hover:bg-green-700">
              Tambah Kegiatan
            </button>
          </form>
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-4">Daftar Kegiatan</h2>
          <div className="space-y-4 max-h-5/12 overflow-y-auto">
            {activities.map(activity => (
              <div key={activity.id} className="bg-white p-4 rounded shadow">
                {activity.imageUrl && (
                  <img src={activity.imageUrl} alt={activity.title} className="w-full h-32 object-cover rounded mb-2" />
                )}
                <h3 className="text-xl font-semibold">{activity.title}</h3>
                <p className="text-gray-600 text-sm line-clamp-2">{activity.description}</p>
                <p className="text-sm text-gray-500">{activity.date}</p>
                {(activity.imageUrl2 || activity.imageUrl3 || activity.imageUrl4) && (
                  <p className="text-xs text-blue-600 mt-1">📸 {[activity.imageUrl, activity.imageUrl2, activity.imageUrl3, activity.imageUrl4].filter(Boolean).length} gambar</p>
                )}
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

      {/* Add Confirmation Modal */}
      {showAddConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-sm w-full p-6">
            <h2 className="text-2xl font-bold mb-4 text-primary">Konfirmasi Tambah Kegiatan</h2>
            <p className="text-gray-700 mb-6">
              Apakah Anda yakin ingin menambahkan kegiatan <strong>&quot;{formData.title}&quot;</strong>?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowAddConfirm(false)}
                className="flex-1 bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 transition"
              >
                Batal
              </button>
              <button
                onClick={confirmAdd}
                className="flex-1 bg-primary text-white px-4 py-2 rounded hover:bg-green-700 transition"
              >
                Tambah
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && deleteActivityId !== null && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-sm w-full p-6">
            <h2 className="text-2xl font-bold mb-4 text-red-600">Konfirmasi Hapus Kegiatan</h2>
            <p className="text-gray-700 mb-6">
              Apakah Anda yakin ingin menghapus kegiatan ini? Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 transition"
              >
                Batal
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 transition"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </div>
  );
}