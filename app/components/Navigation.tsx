'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-primary text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <Image src="/logo.png" alt="Logo" width={50} height={40} className="h-10" />
          <Link href="/" className="text-xl font-bold">Koperasi Desa Koto Jayo Bersamo</Link>
        </div>
        {/* Desktop Menu */}
        <ul className="hidden md:flex space-x-4">
          <li><Link href="/" className="hover:text-accent">Beranda</Link></li>
          <li><Link href="/tentang" className="hover:text-accent">Tentang Kami</Link></li>
          <li><Link href="/kegiatan" className="hover:text-accent">Dokumentasi Kegiatan</Link></li>
          <li><Link href="/laporan-keuangan" className="hover:text-accent">Laporan Keuangan</Link></li>
          <li><Link href="/kontak" className="hover:text-accent">Kontak</Link></li>
          <li><Link href="/admin/login" className="text-sm hover:text-accent">Admin</Link></li>
        </ul>
        {/* Mobile Menu Button */}
        <button
          className="md:hidden flex flex-col space-y-1"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          <span className="w-6 h-0.5 bg-white"></span>
          <span className="w-6 h-0.5 bg-white"></span>
          <span className="w-6 h-0.5 bg-white"></span>
        </button>
      </div>
      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-primary">
          <ul className="flex flex-col space-y-2 p-4">
            <li><Link href="/" className="block hover:text-accent" onClick={() => setIsOpen(false)}>Beranda</Link></li>
            <li><Link href="/tentang" className="block hover:text-accent" onClick={() => setIsOpen(false)}>Tentang Kami</Link></li>
            <li><Link href="/kegiatan" className="block hover:text-accent" onClick={() => setIsOpen(false)}>Dokumentasi Kegiatan</Link></li>
            <li><Link href="/laporan-keuangan" className="block hover:text-accent" onClick={() => setIsOpen(false)}>Laporan Keuangan</Link></li>
            <li><Link href="/kontak" className="block hover:text-accent" onClick={() => setIsOpen(false)}>Kontak</Link></li>
            <li><Link href="/admin/login" className="block text-sm hover:text-accent" onClick={() => setIsOpen(false)}>Admin</Link></li>
          </ul>
        </div>
      )}
    </nav>
  );
}