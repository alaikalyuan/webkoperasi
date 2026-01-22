'use client';

import { useEffect, useState } from 'react';

interface FinancialReport {
  id: number;
  month: string;
  fileName: string;
  blobUrl: string;
  fileType: 'pdf' | 'excel';
  uploadedAt: string;
  uploadedBy?: string;
}

export default function FinancialReports() {
  const [reports, setReports] = useState<FinancialReport[]>([]);
  const [selectedReport, setSelectedReport] = useState<FinancialReport | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/financial')
      .then(res => res.json())
      .then(data => {
        setReports(data.sort((a: FinancialReport, b: FinancialReport) => b.month.localeCompare(a.month)));
        setLoading(false);
      })
      .catch(error => {
        console.error('Failed to fetch reports:', error);
        setLoading(false);
      });
  }, []);

  const formatMonth = (monthStr: string) => {
    const [year, month] = monthStr.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return new Intl.DateTimeFormat('id-ID', { year: 'numeric', month: 'long' }).format(date);
  };

  const getFileIcon = (fileType: string) => {
    return fileType === 'pdf' ? '📄' : '📊';
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold text-primary mb-6">Laporan Keuangan</h1>

      {loading ? (
        <div className="text-center py-8">
          <p>Memuat laporan...</p>
        </div>
      ) : reports.length === 0 ? (
        <div className="bg-yellow-50 border border-yellow-200 p-6 rounded">
          <p className="text-yellow-800">Belum ada laporan keuangan yang tersedia.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Reports List */}
          <div className="lg:col-span-1">
            <h2 className="text-2xl font-semibold mb-4">Daftar Laporan</h2>
            <div className="space-y-2">
              {reports.map((report) => (
                <button
                  key={report.id}
                  onClick={() => setSelectedReport(report)}
                  className={`w-full text-left p-3 rounded transition-colors ${
                    selectedReport?.id === report.id
                      ? 'bg-primary text-white'
                      : 'bg-white border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="font-semibold">{formatMonth(report.month)}</div>
                  <div className="text-sm">
                    {getFileIcon(report.fileType)} {report.fileType.toUpperCase()}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Selected Report Display */}
          <div className="lg:col-span-3">
            {selectedReport ? (
              <div className="bg-white p-6 rounded shadow">
                <div className="mb-6">
                  <h2 className="text-3xl font-semibold mb-2">
                    {formatMonth(selectedReport.month)}
                  </h2>
                  <p className="text-gray-600">
                    File: {selectedReport.fileName}
                  </p>
                  <p className="text-sm text-gray-500">
                    Diupload: {new Date(selectedReport.uploadedAt).toLocaleDateString('id-ID')}
                  </p>
                </div>

                <div className="space-y-4">
                  {selectedReport.fileType === 'pdf' ? (
                    <div>
                      <iframe
                        src={selectedReport.blobUrl}
                        className="w-full h-96 border border-gray-300 rounded"
                        title={selectedReport.fileName}
                      />
                    </div>
                  ) : (
                    <div className="bg-gray-50 p-4 rounded text-center">
                      <p className="text-gray-600 mb-4">File Excel tidak dapat ditampilkan secara langsung</p>
                      <a
                        href={selectedReport.blobUrl}
                        download={selectedReport.fileName}
                        className="inline-block bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
                      >
                        Download Excel
                      </a>
                    </div>
                  )}

                  <div className="flex gap-3">
                    <a
                      href={selectedReport.blobUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-primary text-white px-4 py-2 rounded text-center hover:bg-green-700 transition-colors"
                    >
                      Buka di Tab Baru
                    </a>
                    <a
                      href={selectedReport.blobUrl}
                      download={selectedReport.fileName}
                      className="flex-1 bg-blue-500 text-white px-4 py-2 rounded text-center hover:bg-blue-600 transition-colors"
                    >
                      Download
                    </a>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 p-6 rounded border border-gray-300 text-center">
                <p className="text-gray-600">Pilih laporan dari daftar di sebelah untuk melihat detailnya</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}