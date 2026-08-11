import React, { useState } from 'react';
import { RefreshCw, FileSpreadsheet, CheckCircle2, AlertCircle, ArrowUpRight } from 'lucide-react';
import { Pegawai } from '../lib/types';

interface SinkronisasiPageProps {
  onShowToast: (msg: { type: 'success' | 'error'; text: string }) => void;
}

export const SinkronisasiPage: React.FC<SinkronisasiPageProps> = ({ onShowToast }) => {
  const [jsonInput, setJsonInput] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<string | null>(null);

  const sampleTemplate: Pegawai[] = [
    {
      nip: '199001012015011001',
      nama: 'Budi Santoso, S.Kom',
      unitOrganisasi: 'Direktorat Sistem Informasi',
      jabatan: 'Analisis Sistem Informasi Ahli Muda',
      nilaiX: 85,
      nilaiY: 92,
      box: 9,
    },
    {
      nip: '199203152017021002',
      nama: 'Siti Aminah, M.T',
      unitOrganisasi: 'Direktorat Pengelolaan Data',
      jabatan: 'Pranata Komputer Ahli Pertama',
      nilaiX: 78,
      nilaiY: 88,
      box: 8,
    },
  ];

  const handleInsertSample = () => {
    setJsonInput(JSON.stringify(sampleTemplate, null, 2));
  };

  const handleSync = async () => {
    if (!jsonInput.trim()) {
      onShowToast({ type: 'error', text: 'Data JSON wajib diisi.' });
      return;
    }

    let parsed: Pegawai[];
    try {
      parsed = JSON.parse(jsonInput);
      if (!Array.isArray(parsed)) {
        throw new Error('Format data harus berupa Array JSON []');
      }
    } catch (e: any) {
      onShowToast({ type: 'error', text: `Format JSON tidak valid: ${e.message}` });
      return;
    }

    setIsSyncing(true);
    setSyncResult(null);

    try {
      const res = await fetch('/api/pegawai/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rows: parsed }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Gagal sinkronisasi data pegawai.');
      }

      const count = data.count || parsed.length;
      setSyncResult(`Berhasil memperbarui ${count} data pegawai ke dalam database 9-box.`);
      onShowToast({
        type: 'success',
        text: `Sinkronisasi berhasil! ${count} data diperbarui.`,
      });
    } catch (err: any) {
      onShowToast({ type: 'error', text: err.message || 'Gagal terhubung ke server.' });
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
            <RefreshCw className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-slate-900">Sinkronisasi Data Excel Talent</h3>
            <p className="text-xs text-slate-500">
              Impor data skor 9-box hasil evaluasi berkala HR ke dalam sistem
            </p>
          </div>
        </div>

        <button
          onClick={handleInsertSample}
          className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <FileSpreadsheet className="w-4 h-4 text-indigo-600" />
          <span>Muat Contoh Format Template</span>
        </button>
      </div>

      {syncResult && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-extrabold flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{syncResult}</span>
        </div>
      )}

      {/* JSON Editor Box */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <div>
          <label className="block text-xs font-black uppercase text-slate-700 mb-1">
            Data Pegawai (JSON Format Array)
          </label>
          <p className="text-xs text-slate-500 mb-3">
            Kolom Wajib: <code>nip</code>, <code>nama</code>, <code>unitOrganisasi</code>,{' '}
            <code>jabatan</code>, <code>nilaiX</code> (0-100), <code>nilaiY</code> (0-100).
          </p>

          <textarea
            rows={12}
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            placeholder='[&#10;  {&#10;    "nip": "199001012015011001",&#10;    "nama": "Budi Santoso, S.Kom",&#10;    "unitOrganisasi": "Direktorat Sistem Informasi",&#10;    "jabatan": "Analisis Sistem Informasi",&#10;    "nilaiX": 85,&#10;    "nilaiY": 92&#10;  }&#10;]'
            className="w-full p-4 rounded-xl border border-slate-200 font-mono text-xs focus:ring-2 focus:ring-indigo-500 outline-none bg-slate-900 text-indigo-300"
          />
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={handleSync}
            disabled={isSyncing}
            className="px-6 py-3 rounded-xl font-extrabold text-xs text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/20 flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Memproses Sinkronisasi...' : 'Proses & Simpan Data Pegawai'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
