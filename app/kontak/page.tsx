'use client';

import { useEffect, useState } from 'react';

interface CooperativeInfo {
  name: string;
  address: string;
  phone: string;
  email: string;
}

export default function Contact() {
  const [cooperative, setCooperative] = useState<CooperativeInfo | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  useEffect(() => {
    fetch('/api/cooperative')
      .then(res => res.json())
      .then(data => setCooperative(data));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    alert('Pesan telah dikirim!');
  };

  if (!cooperative) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold text-primary mb-6">Kontak Kami</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <section>
          <h2 className="text-3xl font-semibold mb-4">Informasi Kontak</h2>
          <div className="bg-white p-6 rounded shadow">
            <p><strong>Alamat:</strong> {cooperative.address}</p>
            <p><strong>WhatsApp Admin:</strong> {cooperative.phone}</p>
            <p><strong>Email:</strong> {cooperative.email}</p>
          </div>
        </section>
        <section>
          <h2 className="text-3xl font-semibold mb-4">Formulir Pertanyaan/Saran</h2>
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow">
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium mb-2">Nama</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="message" className="block text-sm font-medium mb-2">Pesan</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded"
                required
              ></textarea>
            </div>
            <button type="submit" className="bg-primary text-white px-4 py-2 rounded hover:bg-green-700">
              Kirim Pesan
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}