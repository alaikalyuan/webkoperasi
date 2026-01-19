export default function Home() {
  return (
    <>
      <section className="min-h-screen flex items-center relative bg-[url('/image.png')] bg-cover bg-center">
        <div className="absolute inset-0 bg-gradient-to-r from-black to-transparent"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-md md:max-w-lg mr-auto text-left">
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">Selamat Datang di Koperasi Desa Koto Jayo Bersamo</h1>
            <p className="text-lg md:text-xl text-white mb-8">Meningkatkan kesejahteraan masyarakat desa melalui kerja sama dan transparansi.</p>
          </div>
        </div>
      </section>
      <div className="container mx-auto p-4">
        <section className="py-12">
          <div className="bg-white p-6 rounded shadow">
            <h2 className="text-2xl font-semibold mb-4">Ringkasan Koperasi</h2>
            <p>Koperasi Desa Koto Jayo Bersamo didirikan untuk membantu masyarakat dalam bidang ekonomi dan sosial.</p>
          </div>
        </section>
        <section className="py-12">
          <h2 className="text-3xl font-bold text-primary mb-6">Sorotan Kegiatan Terbaru</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
    </>
  );
}
