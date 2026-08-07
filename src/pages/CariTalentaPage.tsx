import React, { useState } from 'react';
import { UserSearch, Search, Clock, History, UserCheck, AlertCircle } from 'lucide-react';
import { Pegawai } from '../lib/types';
import { NineBoxGrid } from '../components/dashboard/NineBoxGrid';
import { RadarChartComponent } from '../components/dashboard/RadarChartComponent';
import { generateNarrativeRecommendation } from '../lib/recommendations';

interface CariTalentaPageProps {
  onShowToast: (type: 'success' | 'error' | 'info', text: string) => void;
}

export const CariTalentaPage: React.FC<CariTalentaPageProps> = ({ onShowToast }) => {
  const [searchNip, setSearchNip] = useState('');
  const [loading, setLoading] = useState(false);
  const [pegawai, setPegawai] = useState<Pegawai | null>(null);
  const [historyNip, setHistoryNip] = useState<string[]>([]);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSearch = async (nipToSearch: string) => {
    const nip = nipToSearch.trim();
    if (!nip) return;

    setLoading(true);
    setErrorMsg('');
    setPegawai(null);

    try {
      const res = await fetch(`/api/pegawai/${nip}`);
      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || 'Data pegawai dengan NIP tersebut tidak ditemukan.');
        return;
      }

      setPegawai(data.data);
      // Add to search history
      setHistoryNip((prev) => Array.from(new Set([nip, ...prev])).slice(0, 5));
    } catch (err) {
      setErrorMsg('Gagal terhubung ke server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Search Bar */}
      <div className="p-6 md:p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4">
        <div>
          <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
            <UserSearch className="w-6 h-6 text-indigo-600" />
            Cari & Tinjau Talenta Pegawai
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Masukkan NIP pegawai untuk melihat posisi 9-Box Matrix, rincian komponen, dan grafik pemetaan.
          </p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch(searchNip);
          }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchNip}
              onChange={(e) => setSearchNip(e.target.value)}
              placeholder="Masukkan NIP Pegawai (Cth: 199001012015011001)"
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-violet-600 to-pink-600 text-white font-extrabold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Search className="w-4 h-4" />
                <span>Cari Talenta</span>
              </>
            )}
          </button>
        </form>

        {/* Search History Chips */}
        {historyNip.length > 0 && (
          <div className="flex items-center gap-2 pt-2 text-xs">
            <span className="font-bold text-slate-400 flex items-center gap-1 shrink-0">
              <History className="w-3.5 h-3.5" /> Riwayat Pencarian:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {historyNip.map((hNip) => (
                <button
                  key={hNip}
                  onClick={() => {
                    setSearchNip(hNip);
                    handleSearch(hNip);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition-colors"
                >
                  {hNip}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Searched Employee Details */}
      {pegawai && (
        <div className="space-y-6 animate-fade-in">
          {/* Employee Summary Banner */}
          <div className="p-6 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                PROFIL TALENTA PEGAWAI
              </span>
              <h3 className="text-2xl font-black text-white">{pegawai.nama}</h3>
              <p className="text-xs text-slate-300">
                NIP: {pegawai.nip} | Jabatan: {pegawai.jabatan} ({pegawai.unitOrganisasi})
              </p>
            </div>

            <div className="flex items-center gap-3 bg-slate-800/80 p-4 rounded-2xl border border-slate-700/60 shrink-0">
              <div className="text-center px-3 border-r border-slate-700">
                <p className="text-[10px] font-extrabold uppercase text-slate-400">Sumbu X (Potensi)</p>
                <p className="text-2xl font-black text-indigo-400">{pegawai.nilaiX.toFixed(1)}</p>
              </div>
              <div className="text-center px-3 border-r border-slate-700">
                <p className="text-[10px] font-extrabold uppercase text-slate-400">Sumbu Y (Kinerja)</p>
                <p className="text-2xl font-black text-pink-400">{pegawai.nilaiY.toFixed(1)}</p>
              </div>
              <div className="text-center px-3">
                <p className="text-[10px] font-extrabold uppercase text-slate-400">Kategori</p>
                <p className="text-2xl font-black text-amber-400">BOX {pegawai.box}</p>
              </div>
            </div>
          </div>

          {/* 9 Box Grid */}
          <NineBoxGrid currentBox={pegawai.box} />

          {/* Recharts Radar Chart */}
          <RadarChartComponent komponenX={pegawai.komponenX} komponenY={pegawai.komponenY} />

          {/* Strategic Recommendation */}
          <div className="bg-gradient-to-r from-indigo-900 via-violet-900 to-slate-900 p-6 rounded-3xl text-white shadow-md space-y-2">
            <h4 className="text-sm font-extrabold text-indigo-200 uppercase tracking-wider">
              Rekomendasi Karir Strategis Box {pegawai.box}
            </h4>
            <p className="text-sm font-medium leading-relaxed text-slate-200">
              {generateNarrativeRecommendation(pegawai.box)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
