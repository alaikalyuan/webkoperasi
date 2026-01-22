'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

interface StaffMember {
  id: number;
  name: string;
  position: string;
  category: string;
  imageUrl?: string;
}

export default function About() {
  const [pengurus, setPengurus] = useState<StaffMember[]>([]);
  const [dewanPengawas, setDewanPengawas] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const pengurusRes = await fetch('/api/staff?category=pengurus');
        const dewanRes = await fetch('/api/staff?category=dewan_pengawas');
        
        if (pengurusRes.ok) {
          setPengurus(await pengurusRes.json());
        }
        if (dewanRes.ok) {
          setDewanPengawas(await dewanRes.json());
        }
      } catch (error) {
        console.error('Failed to fetch staff data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStaff();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold text-primary mb-6">Tentang Kami</h1>
      <section className="mb-8">
        <h2 className="text-3xl font-semibold mb-4">Visi dan Misi</h2>
        <div className="bg-white p-6 rounded shadow">
          <h3 className="text-xl font-bold mb-2">Visi</h3>
          <p>Menjadi koperasi terdepan dalam meningkatkan kesejahteraan masyarakat desa melalui kerja sama ekonomi yang berkelanjutan.</p>
          <h3 className="text-xl font-bold mb-2 mt-4">Misi</h3>
          <ul className="list-disc list-inside">
            <li>Menyediakan layanan keuangan yang mudah diakses oleh anggota.</li>
            <li>Mengembangkan program-program pemberdayaan ekonomi.</li>
            <li>Meningkatkan transparansi dan akuntabilitas dalam pengelolaan koperasi.</li>
          </ul>
        </div>
      </section>
      <section className="mb-8">
        <h2 className="text-3xl font-semibold mb-4">Struktur Organisasi</h2>
        
        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-600">Loading data...</p>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <h3 className="text-2xl font-semibold mb-4">Pengurus</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pengurus.map((person) => (
                  <div key={person.id} className="bg-white p-4 rounded shadow text-center">
                    <Image 
                      src={person.imageUrl || '/placeholder.png'} 
                      alt={person.name} 
                      width={96}
                      height={96}
                      className="mx-auto mb-2 rounded-full" 
                    />
                    <h4 className="text-lg font-semibold">{person.position}</h4>
                    <p>{person.name}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-semibold mb-4">Dewan Pengawas</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {dewanPengawas.map((person) => (
                  <div key={person.id} className="bg-white p-4 rounded shadow text-center">
                    <Image 
                      src={person.imageUrl || '/placeholder.png'} 
                      alt={person.name} 
                      width={96}
                      height={96}
                      className="mx-auto mb-2 rounded-full" 
                    />
                    <h4 className="text-lg font-semibold">{person.position}</h4>
                    <p>{person.name}</p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </section>
      <section>
        <h2 className="text-3xl font-semibold mb-4">Legalitas Koperasi</h2>
        <div className="bg-white p-6 rounded shadow">
          <p><strong>Nomor Badan Hukum:</strong> 123456789</p>
          <p><strong>Tanggal Pendirian:</strong> 1 Januari 2020</p>
          <p><strong>Alamat:</strong> Desa Koto Jayo, Kecamatan XYZ, Kabupaten ABC</p>
        </div>
      </section>
    </div>
  );
}