export default function About() {
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-4 rounded shadow text-center">
            <img src="/placeholder-ketua.jpg" alt="Ketua" className="w-24 h-24 mx-auto mb-2 rounded-full" />
            <h3 className="text-xl font-semibold">Ketua</h3>
            <p>Nama Ketua</p>
          </div>
          <div className="bg-white p-4 rounded shadow text-center">
            <img src="/placeholder-sekretaris.jpg" alt="Sekretaris" className="w-24 h-24 mx-auto mb-2 rounded-full" />
            <h3 className="text-xl font-semibold">Sekretaris</h3>
            <p>Nama Sekretaris</p>
          </div>
          <div className="bg-white p-4 rounded shadow text-center">
            <img src="/placeholder-bendahara.jpg" alt="Bendahara" className="w-24 h-24 mx-auto mb-2 rounded-full" />
            <h3 className="text-xl font-semibold">Bendahara</h3>
            <p>Nama Bendahara</p>
          </div>
        </div>
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