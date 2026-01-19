'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

interface Activity {
  id: number;
  title: string;
  description: string;
  date: string;
}

export default function Activities() {
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    fetch('/api/activities')
      .then(res => res.json())
      .then(data => setActivities(data));
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold text-primary mb-6">Dokumentasi Kegiatan</h1>
      <section className="mb-8">
        <h2 className="text-3xl font-semibold mb-4">Galeri Foto/Video</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-4 rounded shadow">
            <Image src="/placeholder-activity1.jpg" alt="Kegiatan 1" width={400} height={192} className="w-full h-48 object-cover mb-2" />
            <h3 className="text-xl font-semibold">Rapat Anggota</h3>
            <p>Deskripsi kegiatan rapat anggota.</p>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <Image src="/placeholder-activity2.jpg" alt="Kegiatan 2" width={400} height={192} className="w-full h-48 object-cover mb-2" />
            <h3 className="text-xl font-semibold">Distribusi Bantuan</h3>
            <p>Deskripsi distribusi bantuan sembako.</p>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <Image src="/placeholder-activity3.jpg" alt="Kegiatan 3" width={400} height={192} className="w-full h-48 object-cover mb-2" />
            <h3 className="text-xl font-semibold">Pelatihan</h3>
            <p>Deskripsi pelatihan wirausaha.</p>
          </div>
        </div>
      </section>
      <section>
        <h2 className="text-3xl font-semibold mb-4">Berita dan Artikel</h2>
        <div className="space-y-4">
          {activities.map(activity => (
            <article key={activity.id} className="bg-white p-6 rounded shadow">
              <h3 className="text-2xl font-bold mb-2">{activity.title}</h3>
              <p className="text-sm text-gray-600 mb-2">Tanggal: {activity.date}</p>
              <p>{activity.description}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}