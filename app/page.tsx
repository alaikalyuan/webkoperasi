'use client';

import { useEffect, useState } from 'react';

interface Activity {
  id: number;
  title: string;
  description: string;
  date: string;
  imageUrl?: string;
}

export default function Home() {
  const [latestActivities, setLatestActivities] = useState<Activity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetch('/api/activities')
      .then(res => res.json())
      .then(data => {
        const sorted = [...data].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setLatestActivities(sorted.slice(0, 3));
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
    <>
      <section className="min-h-screen flex items-center relative bg-[url('/image.png')] bg-cover bg-center">
        <div className="absolute inset-0 bg-linear-to-r from-black to-transparent"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-md md:max-w-lg mr-auto text-left">
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">Selamat Datang di Koperasi Kito Jayo Besamo</h1>
            <p className="text-lg md:text-xl text-white mb-8">Tanah Batin Kito Besamo</p>
          </div>
        </div>
      </section>
      <div className="container mx-auto p-4">
        <section className="py-12">
          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-2xl font-semibold mb-4">Ringkasan Koperasi</h2>
            <p>Koperasi Desa Kito Jayo Besamo didirikan untuk membantu masyarakat dalam bidang ekonomi dan sosial.</p>
          </div>
        </section>
        <section className="py-12">
          <h2 className="text-3xl font-bold text-primary mb-6">Sorotan Kegiatan Terbaru</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {latestActivities.length > 0 ? (
              latestActivities.map(activity => (
                <div
                  key={activity.id}
                  onClick={() => openModal(activity)}
                  className="bg-white rounded shadow overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-300 transform hover:scale-105"
                >
                  <div className="relative h-40 bg-gray-200">
                    {activity.imageUrl ? (
                      <img
                        src={activity.imageUrl}
                        alt={activity.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary to-green-600 text-white">
                        <span className="text-3xl">📸</span>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-primary mb-2 line-clamp-2">{activity.title}</h3>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">{activity.description}</p>
                    <p className="text-xs text-gray-500">{new Date(activity.date).toLocaleDateString('id-ID')}</p>
                  </div>
                </div>
              ))
            ) : (
              <>
                <div className="bg-white p-4 rounded shadow">
                  <h3 className="text-xl font-semibold">Rapat Anggota Tahunan</h3>
                  <p>Diskusi tentang perkembangan koperasi dan rencana masa depan.</p>
                </div>
                <div className="bg-white p-4 rounded shadow">
                  <h3 className="text-xl font-semibold">Distribusi Sembako</h3>
                  <p>Bantuan sembako untuk anggota yang membutuhkan.</p>
                </div>
                <div className="bg-white p-4 rounded shadow">
                  <h3 className="text-xl font-semibold">Pelatihan Wirausaha</h3>
                  <p>Pelatihan untuk meningkatkan keterampilan anggota.</p>
                </div>
              </>
            )}
          </div>
        </section>
        <section className="py-12">
          <h2 className="text-3xl font-bold text-primary mb-6">Pencapaian</h2>
          <div className="bg-white p-6 rounded shadow text-center">
            <p className="text-2xl font-bold text-accent">Total Aset: Rp 500.000.000</p>
            <p>Jumlah Anggota: 150 orang</p>
          </div>
        </section>
      </div>

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
                  <img
                    src={selectedActivity.imageUrl}
                    alt={selectedActivity.title}
                    className="w-full h-full object-cover"
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
    </>
  );
}
