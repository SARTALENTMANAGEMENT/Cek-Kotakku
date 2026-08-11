import React from 'react';
import { NineBoxGrid } from '../components/dashboard/NineBoxGrid';
import { RadarChartComponent } from '../components/dashboard/RadarChartComponent';
import { StrengthBar } from '../components/ui/StrengthBar';
import { getBoxInfo } from '../lib/recommendations';
import { Pegawai, JWTPayload } from '../lib/types';
import { Award, Compass, CheckCircle2, AlertTriangle, TrendingUp } from 'lucide-react';

interface DashboardPageProps {
  user: JWTPayload | null;
  pegawai: Pegawai | null;
  onNavigate: (path: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ pegawai, onNavigate }) => {
  if (!pegawai) {
    return (
      <div className="p-8 bg-white rounded-2xl border border-slate-200 text-center space-y-4">
        <div className="w-12 h-12 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-center mx-auto text-amber-600">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h3 className="font-extrabold text-base text-slate-800">
          Data Pemetaan Talenta Belum Tersedia
        </h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          Akun Administrator Anda saat ini belum memiliki data skor 9-box individual, atau data
          skor pegawai Anda belum diunggah oleh Tim Admin HR.
        </p>
      </div>
    );
  }

  const boxInfo = getBoxInfo(pegawai.box);

  const compX = pegawai.komponenX || {
    'Kepemimpinan & Visi': pegawai.nilaiX || 75,
     Inovasi: pegawai.nilaiX || 70,
    'Manajerial Tim': pegawai.nilaiX || 80,
  };

  const compY = pegawai.komponenY || {
    'Capaian Kinerja SKP': pegawai.nilaiY || 85,
     Disiplin: pegawai.nilaiY || 90,
    'Kemitraan & Tim': pegawai.nilaiY || 80,
  };

  return (
    <div className="space-y-6">
      {/* Overview Card */}
      <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-slate-800">
        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-bold">
            <Award className="w-3.5 h-3.5" />
            <span>Posisi Talent Box #{pegawai.box}</span>
          </div>
          <h2 className="text-xl md:text-2xl font-black tracking-tight">{pegawai.nama}</h2>
          <p className="text-xs text-slate-300 font-medium">
            {pegawai.jabatan} • <span className="text-slate-400">{pegawai.unitOrganisasi}</span>
          </p>
        </div>

        <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 shrink-0">
          <div className="text-center px-2">
            <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Sumbu X (Potensi)</p>
            <p className="text-2xl font-black text-indigo-400">{pegawai.nilaiX}</p>
          </div>
          <div className="w-px h-10 bg-white/20" />
          <div className="text-center px-2">
            <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Sumbu Y (Kinerja)</p>
            <p className="text-2xl font-black text-pink-400">{pegawai.nilaiY}</p>
          </div>
        </div>
      </div>

      {/* Grid Matrix and Radar Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <NineBoxGrid activePegawai={pegawai} />
        </div>

        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">Komposisi Skor Potensi & Kinerja</h3>
              <p className="text-[11px] font-medium text-slate-500">
                Visualisasi spider radar chart komponen penilai
              </p>
            </div>
            <TrendingUp className="w-4 h-4 text-indigo-600" />
          </div>

          <RadarChartComponent dataX={compX as Record<string, number>} dataY={compY as Record<string, number>} />

          <div className="pt-2 space-y-3">
            <p className="text-xs font-black uppercase text-slate-400 tracking-wider">
              Rincian Komponen Potensi:
            </p>
            {Object.entries(compX).map(([k, v]) => (
              <StrengthBar key={k} label={k} score={Number(v)} />
            ))}
          </div>
        </div>
      </div>

      {/* Box Recommendations Card */}
      <div className={`p-6 rounded-3xl border shadow-xs space-y-6 ${boxInfo.bgLight} ${boxInfo.borderColor}`}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${boxInfo.badgeColor}`}>
              {boxInfo.category}
            </span>
            <h3 className="text-lg font-black text-slate-900 mt-2">{boxInfo.label}</h3>
            <p className="text-xs font-semibold text-slate-600 mt-1">{boxInfo.description}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          <div className="bg-white/80 backdrop-blur-xs p-5 rounded-2xl border border-slate-200/80 space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-indigo-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-indigo-600" />
              <span>Rekomendasi Program Pengembangan</span>
            </h4>
            <ul className="space-y-2">
              {boxInfo.rekomendasiPengembangan.map((item, idx) => (
                <li key={idx} className="text-xs font-semibold text-slate-700 flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0 mt-1.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white/80 backdrop-blur-xs p-5 rounded-2xl border border-slate-200/80 space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-pink-900 flex items-center gap-2">
              <Compass className="w-4 h-4 text-pink-600" />
              <span>Rekomendasi Karir & Suksesi</span>
            </h4>
            <ul className="space-y-2">
              {boxInfo.rekomendasiKarir.map((item, idx) => (
                <li key={idx} className="text-xs font-semibold text-slate-700 flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-pink-500 shrink-0 mt-1.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={() => onNavigate('/career-path')}
            className="px-5 py-3 rounded-2xl font-extrabold text-xs text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-500/20 flex items-center gap-2 transition-all cursor-pointer"
          >
            <Compass className="w-4 h-4" />
            <span>Isi Kuesioner Career Path Sekarang</span>
          </button>
        </div>
      </div>
    </div>
  );
};
