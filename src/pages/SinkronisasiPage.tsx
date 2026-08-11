import React, { useState } from 'react';
import { Database, UploadCloud, FileSpreadsheet, AlertCircle, CheckCircle2, RefreshCw } from 'lucide-react';
import * as XLSX from 'xlsx';
import { Pegawai } from '../lib/types';

interface SinkronisasiPageProps {
  onShowToast: (type: 'success' | 'error' | 'info', text: string) => void;
}

export const SinkronisasiPage: React.FC<SinkronisasiPageProps> = ({ onShowToast }) => {
  const [file, setFile] = useState<File | null>(null);
  const [parsedRows, setParsedRows] = useState<Pegawai[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setErrorMsg('');
    setSuccessMsg('');
    parseExcel(selectedFile);
  };

  const parseExcel = (fileObj: File) => {
    setLoading(true);
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const buffer = e.target?.result;
        const workbook = XLSX.read(buffer, { type: 'binary' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const rawJson: any[] = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

        if (rawJson.length === 0) {
          setErrorMsg('File Excel tidak berisi data.');
          setLoading(false);
          return;
        }

        // Validate column headers against required list
        const sample = rawJson[0];
        const requiredHeaders = [
          'NIP',
          'Nama',
          'Unit Organisasi',
          'Jabatan',
          'Nilai X',
          'Nilai Y',
          'Box',
        ];

        const missing = requiredHeaders.filter((h) => !(h in sample));
        if (missing.length > 0) {
          setErrorMsg(
            `Header kolom Excel tidak sesuai kriteria. Kolom wajib yang hilang: ${missing.join(', ')}`
          );
          setParsedRows([]);
          setLoading(false);
          return;
        }

        // Map raw JSON objects to Pegawai interface
        const mappedList: Pegawai[] = rawJson.map((row) => {
          const numX = parseFloat(row['Nilai X']) || 0;
          const numY = parseFloat(row['Nilai Y']) || 0;
          const boxVal = parseInt(row['Box']) || 5;

          return {
            nip: String(row['NIP']).trim(),
            nama: String(row['Nama']).trim(),
            unitOrganisasi: String(row['Unit Organisasi']).trim(),
            jabatan: String(row['Jabatan']).trim(),
            nilaiX: numX,
            nilaiY: numY,
            box: boxVal,
            komponenX: {
              kompetensi: parseFloat(row['X - Penilaian Kompetensi']) || numX,
              pengembangan: parseFloat(row['X - Pengembangan Kompetensi']) || numX,
              pengalaman: parseFloat(row['X - Pengalaman Jabatan']) || numX,
              potensi: parseFloat(row['X - Penilaian Potensi']) || numX,
              pendidikan: parseFloat(row['X - Tingkat Pendidikan Formal']) || numX,
              kesesuaian: parseFloat(row['X - Kesesuaian Bidang Ilmu']) || numX,
              disiplin: parseFloat(row['X - Verifikasi Rekam Jejak Disiplin']) || numX,
            },
            komponenY: {
              kinerja: parseFloat(row['Y - Penilaian Kinerja']) || numY,
              penghargaan: parseFloat(row['Y - Penghargaan']) || numY,
              timKerja: parseFloat(row['Y - Penugasan dalam Tim Kerja']) || numY,
              umpanBalik: parseFloat(row['Y - Umpan Balik Kinerja 360']) || numY,
            },
          };
        });

        setParsedRows(mappedList);
      } catch (err: any) {
        setErrorMsg('Gagal membaca file Excel. Pastikan format file .xls atau .xlsx valid.');
      } finally {
        setLoading(false);
      }
    };

    reader.onerror = () => {
      setErrorMsg('Gagal membaca file dari perangkat.');
      setLoading(false);
    };

    reader.readAsBinaryString(fileObj);
  };

  const handleSyncSubmit = async () => {
    if (parsedRows.length === 0) return;

    setUploading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await fetch('/api/pegawai/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rows: parsedRows }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || 'Gagal menyinkronkan data pegawai.');
        setUploading(false);
        return;
      }

      setSuccessMsg(data.message || `Berhasil menyinkronkan ${parsedRows.length} data pegawai.`);
      onShowToast('success', 'Data pegawai master berhasil disinkronkan!');
      setParsedRows([]);
      setFile(null);
    } catch (err) {
      setErrorMsg('Terjadi kesalahan koneksi server saat pengiriman data.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="p-6 md:p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-4">
        <div className="p-3.5 rounded-2xl bg-indigo-50 text-indigo-600 shrink-0">
          <Database className="w-7 h-7" />
        </div>
        <div>
          <h2 className="text-xl font-black text-slate-800">Sinkronisasi Data Master Pegawai</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Unggah file Excel (.xls / .xlsx) untuk memperbarui seluruh data master talenta pegawai.
          </p>
        </div>
      </div>

      {/* File Dropzone Area */}
      <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-sm space-y-6">
        <div className="border-2 border-dashed border-indigo-200 hover:border-indigo-500 bg-indigo-50/30 hover:bg-indigo-50/60 rounded-2xl p-8 text-center transition-all cursor-pointer relative">
          <input
            type="file"
            accept=".xls,.xlsx"
            onChange={handleFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <FileSpreadsheet className="w-12 h-12 text-indigo-600 mx-auto mb-3" />
          <h3 className="text-base font-extrabold text-slate-800">
            {file ? file.name : 'Pilih atau Seret File Excel (.xls / .xlsx)'}
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Format yang didukung: Microsoft Excel Spreadsheet (.xls, .xlsx)
          </p>
        </div>

        {errorMsg && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Parsed Preview Table */}
        {parsedRows.length > 0 && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h4 className="text-sm font-extrabold text-slate-800">
                  Pratinjau Data Parse ({parsedRows.length} Pegawai Terdeteksi)
                </h4>
                <p className="text-xs text-slate-500">
                  Tinjau data di bawah sebelum melakukan sinkronisasi ke database.
                </p>
              </div>
              <button
                onClick={handleSyncSubmit}
                disabled={uploading}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-violet-600 to-pink-600 text-white font-extrabold text-xs shadow-md hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {uploading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <UploadCloud className="w-4 h-4" />
                    <span>Sync & Reset Database</span>
                  </>
                )}
              </button>
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-2xl max-h-80">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-900 text-white sticky top-0 font-bold">
                  <tr>
                    <th className="p-3">NIP</th>
                    <th className="p-3">Nama Pegawai</th>
                    <th className="p-3">Unit Organisasi</th>
                    <th className="p-3">Jabatan</th>
                    <th className="p-3 text-center">Sumbu X</th>
                    <th className="p-3 text-center">Sumbu Y</th>
                    <th className="p-3 text-center">Box</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 font-medium bg-white">
                  {parsedRows.slice(0, 15).map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="p-3 font-bold text-slate-900">{row.nip}</td>
                      <td className="p-3">{row.nama}</td>
                      <td className="p-3">{row.unitOrganisasi}</td>
                      <td className="p-3">{row.jabatan}</td>
                      <td className="p-3 text-center font-bold text-indigo-600">{row.nilaiX}</td>
                      <td className="p-3 text-center font-bold text-pink-600">{row.nilaiY}</td>
                      <td className="p-3 text-center">
                        <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 font-black">
                          Box {row.box}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {parsedRows.length > 15 && (
              <p className="text-[11px] font-semibold text-slate-400 text-center">
                + Menampilkan 15 dari {parsedRows.length} total baris data pegawai.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
