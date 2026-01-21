'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

interface Activity {
  id: number;
  title: string;
  description: string;
  date: string;
  imageUrl?: string;
}

export default function Activities() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetch('/api/activities')
      .then(res => res.json())
      .then(data => {
        const sorted = [...data].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setActivities(sorted);
      });
  }, []);

  const openModal = (activity: Activity) => {
    setSelectedActivity(activity);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedActivity(null);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold text-primary mb-2">Dokumentasi Kegiatan</h1>
      <p className="text-gray-600 mb-8">Klik pada foto untuk melihat detail lengkap kegiatan</p>

      {/* Thumbnail Gallery */}
      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-6">Galeri Kegiatan</h2>
        {activities.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activities.map(activity => (
              <div
                key={activity.id}
                onClick={() => openModal(activity)}
                className="bg-white rounded shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-300 transform hover:scale-105"
              >
                <div className="relative h-48 bg-gray-200">
                  {activity.imageUrl ? (
                    <Image
                      src={activity.imageUrl}
                      alt={activity.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary to-green-600 text-white">
                      <span className="text-4xl">📸</span>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-primary mb-2 line-clamp-2">{activity.title}</h3>
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">{activity.description}</p>
                  <p className="text-xs text-gray-500">{new Date(activity.date).toLocaleDateString('id-ID')}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white p-8 rounded shadow text-center text-gray-600">
            <p className="text-lg">Belum ada kegiatan yang ditambahkan</p>
          </div>
        )}
      </section>

      {/* Modal */}
      {isModalOpen && selectedActivity && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-2/3 overflow-y-auto">
            <div className="sticky top-0 bg-primary text-white p-4 flex justify-between items-center z-10">
              <h2 className="text-2xl font-bold">{selectedActivity.title}</h2>
              <button
                onClick={closeModal}
                className="text-2xl font-bold hover:text-gray-200 transition"
              >
                ✕
              </button>
            </div>

            <div className="p-6">
              {selectedActivity.imageUrl && (
                <div className="mb-4 relative h-64 bg-gray-200 rounded overflow-hidden">
                  <Image
                    src={selectedActivity.imageUrl}
                    alt={selectedActivity.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-semibold text-gray-600 uppercase mb-1">Tanggal</h3>
                  <p className="text-lg text-gray-800">
                    {new Date(selectedActivity.date).toLocaleDateString('id-ID', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-600 uppercase mb-1">Deskripsi</h3>
                  <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">{selectedActivity.description}</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-100 p-4 flex gap-2">
              <button
                onClick={closeModal}
                className="flex-1 bg-primary text-white px-4 py-2 rounded hover:bg-green-700 transition"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}