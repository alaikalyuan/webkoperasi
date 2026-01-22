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

export default function Home() {
  const [latestActivities, setLatestActivities] = useState<Activity[]>([]);
  const [currentActivityIndex, setCurrentActivityIndex] = useState(0);
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

  // Auto-play carousel
  useEffect(() => {
    if (latestActivities.length === 0) return;

    const interval = setInterval(() => {
      setCurrentActivityIndex(prev =>
        prev === latestActivities.length - 1 ? 0 : prev + 1
      );
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [latestActivities.length]);

  const openModal = (activity: Activity) => {
    setSelectedActivity(activity);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedActivity(null);
  };

  const goToPrevious = () => {
    setCurrentActivityIndex(prev =>
      prev === 0 ? latestActivities.length - 1 : prev - 1
    );
  };

  const goToNext = () => {
    setCurrentActivityIndex(prev =>
      prev === latestActivities.length - 1 ? 0 : prev + 1
    );
  };

  const goToSlide = (index: number) => {
    setCurrentActivityIndex(index);
  };

  return (
    <>
      <section className="min-h-60 sm:min-h-96 flex items-center relative bg-[url('/image.png')] bg-cover bg-center">
        <div className="absolute inset-0 bg-linear-to-r from-black to-transparent"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-md md:max-w-lg mr-auto text-left">
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">Selamat Datang di Koperasi Kito Jayo Besamo</h1>
            <p className="text-lg md:text-xl text-white">Tanah Batin Kito Besamo</p>
          </div>
        </div>
      </section>
      <div className="container mx-auto p-4">
      <section className="py-6">
          <h2 className="text-3xl font-bold text-primary mb-6">Kegiatan Terbaru</h2>
          
          {latestActivities.length > 0 ? (
            <div className="relative">
              {/* Carousel Container */}
              <div className="overflow-hidden rounded-lg shadow-lg">
                <div
                  className="relative h-96 bg-gray-200 transition-opacity duration-500"
                >
                  {/* Current Activity Card */}
                  <div
                    onClick={() => openModal(latestActivities[currentActivityIndex])}
                    className="w-full h-full cursor-pointer"
                  >
                    {latestActivities[currentActivityIndex].imageUrl ? (
                      <Image
                        src={latestActivities[currentActivityIndex].imageUrl}
                        alt={latestActivities[currentActivityIndex].title}
                        className="w-full h-full object-cover"
                        fill
                        sizes="100vw"
                        priority
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-primary to-green-600">
                        <span className="text-6xl">📸</span>
                      </div>
                    )}
                  </div>

                  {/* Dark Overlay */}
                  <div className="absolute inset-0 bg-black/40"></div>

                  {/* Activity Info Overlay */}
                  <div className="absolute inset-0 flex flex-col justify-end p-6 bg-gradient-to-t from-black/80 to-transparent">
                    <div
                      onClick={() => openModal(latestActivities[currentActivityIndex])}
                      className="cursor-pointer hover:text-primary transition-colors"
                    >
                      <h3 className="text-2xl font-bold text-white mb-2 line-clamp-2">
                        {latestActivities[currentActivityIndex].title}
                      </h3>
                      <p className="text-sm text-gray-200 mb-2 line-clamp-2">
                        {latestActivities[currentActivityIndex].description}
                      </p>
                      <p className="text-xs text-gray-300">
                        {new Date(latestActivities[currentActivityIndex].date).toLocaleDateString('id-ID')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation Arrows */}
              <button
                onClick={goToPrevious}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white text-primary rounded-full p-2 transition-all duration-300 transform hover:scale-110 shadow-lg"
                aria-label="Previous activity"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <button
                onClick={goToNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white text-primary rounded-full p-2 transition-all duration-300 transform hover:scale-110 shadow-lg"
                aria-label="Next activity"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              {/* Slide Indicators */}
              <div className="flex justify-center gap-2 mt-6">
                {latestActivities.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      index === currentActivityIndex
                        ? 'bg-primary w-8'
                        : 'bg-gray-300 w-2 hover:bg-gray-400'
                    }`}
                    aria-label={`Go to activity ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-96">
              <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-600">Memuat kegiatan terbaru...</p>
              </div>
            </div>
          )}
        </section>
        <section className="py-12">
          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-2xl font-semibold mb-4">Ringkasan Koperasi</h2>
            <p>Koperasi Desa Kito Jayo Besamo didirikan untuk membantu masyarakat dalam bidang ekonomi dan sosial.</p>
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
                  <Image
                    src={selectedActivity.imageUrl}
                    alt={selectedActivity.title}
                    className="w-full h-full object-cover"
                    fill
                    sizes="(max-width: 768px) 100vw, 672px"
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
