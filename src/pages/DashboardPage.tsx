import React from 'react';
import { Pegawai, JWTPayload } from '../lib/types';
import { NineBoxGrid } from '../components/dashboard/NineBoxGrid';
import { RadarChartComponent } from '../components/dashboard/RadarChartComponent';
import { generateNarrativeRecommendation } from '../lib/recommendations';
import { User, Award, TrendingUp, Sparkles, Shield, Building2 } from 'lucide-react';

interface DashboardPageProps {
  pegawai: Pegawai | null;
  user: JWTPayload | null;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ pegawai, user }) => {
  if (!pegawai) {
    return (
      <div className="p-8 text-center bg-white rounded-3xl border border-slate-200 shadow-sm">
        <Shield className="w-12 h-12 text-indigo-500 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-slate-800">Sesi Administrator Active</h3>
        <p className="text-sm text-slate-500 max-w-md mx-auto mt-1">
          Anda berada dalam sesi Administrator. Gunakan menu <strong>Cari Talenta Pegawai</strong> untuk meninjau hasil pemetaan 9-box individual.
        </p>
      </div>
    );
  }

  const recommendationText = generateNarrativeRecommendation(pegawai.box);

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      {/* Welcome Banner Card */}
      <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-indigo-600 via-violet-600 to-pink-600 text-white shadow-xl shadow-indigo-600/15 relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-white/5 skew-x-12 pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Portal Hasil Pemetaan Talenta Pegawai</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight">
              Selamat Datang, {pegawai.nama}
            </h1>
            <p className="text-indigo-100 text-xs md:text-sm font-medium max-w-2xl leading-relaxed">
              Berikut adalah hasil evaluasi dan pemetaan potensi serta kinerja Anda berdasarkan kriteria matriks 9-Box Talenta Nasional.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white/15 p-4 rounded-2xl backdrop-blur-md border border-white/20 shrink-0">
            <div className="text-center px-3 border-r border-white/20">
              <p className="text-[10px] font-extrabold uppercase text-indigo-200">Sumbu X (Potensi)</p>
              <p className="text-2xl font-black text-white">{pegawai.nilaiX.toFixed(1)}</p>
            </div>
            <div className="text-center px-3 border-r border-white/20">
              <p className="text-[10px] font-extrabold uppercase text-indigo-200">Sumbu Y (Kinerja)</p>
              <p className="text-2xl font-black text-white">{pegawai.nilaiY.toFixed(1)}</p>
            </div>
            <div className="text-center px-3">
              <p className="text-[10px] font-extrabold uppercase text-indigo-200">Kotak Matrix</p>
              <p className="text-2xl font-black text-amber-300">BOX {pegawai.box}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Pegawai Metadata Identity Card */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3">
          <div className="p-3 rounded-xl bg-indigo-50 text-indigo-600">
            <User className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase">NIP Pegawai</p>
            <p className="text-sm font-extrabold text-slate-800">{pegawai.nip}</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3">
          <div className="p-3 rounded-xl bg-violet-50 text-violet-600">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase">Jabatan Saat Ini</p>
            <p className="text-sm font-extrabold text-slate-800 truncate max-w-[180px]" title={pegawai.jabatan}>
              {pegawai.jabatan}
            </p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3">
          <div className="p-3 rounded-xl bg-pink-50 text-pink-600">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase">Unit Organisasi</p>
            <p className="text-sm font-extrabold text-slate-800 truncate max-w-[180px]" title={pegawai.unitOrganisasi}>
              {pegawai.unitOrganisasi}
            </p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3">
          <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase">Kategori Talenta</p>
            <p className="text-sm font-extrabold text-emerald-700">BOX {pegawai.box}</p>
          </div>
        </div>
      </div>

      {/* Interactive 9-Box Matrix Grid */}
      <NineBoxGrid currentBox={pegawai.box} />

      {/* Recharts Radar Chart */}
      <RadarChartComponent komponenX={pegawai.komponenX} komponenY={pegawai.komponenY} />

      {/* Detailed Components Score Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Potensi Component List */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-base font-extrabold text-slate-800 flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-indigo-600" />
              Rincian Komponen Sumbu X (Potensi)
            </h3>
            <span className="text-xs font-extrabold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
              Skor Total: {pegawai.nilaiX.toFixed(1)}
            </span>
          </div>

          <div className="space-y-3">
            {[
              { label: 'Penilaian Kompetensi', val: pegawai.komponenX?.kompetensi || 0 },
              { label: 'Pengembangan Kompetensi', val: pegawai.komponenX?.pengembangan || 0 },
              { label: 'Pengalaman Jabatan', val: pegawai.komponenX?.pengalaman || 0 },
              { label: 'Penilaian Potensi', val: pegawai.komponenX?.potensi || 0 },
              { label: 'Tingkat Pendidikan Formal', val: pegawai.komponenX?.pendidikan || 0 },
              { label: 'Kesesuaian Bidang Ilmu', val: pegawai.komponenX?.kesesuaian || 0 },
              { label: 'Verifikasi Rekam Jejak Disiplin', val: pegawai.komponenX?.disiplin || 0 },
            ].map((item, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-slate-700">
                  <span>{item.label}</span>
                  <span className="text-indigo-600">{item.val} / 100</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, Math.max(0, item.val))}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Kinerja Component List */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-base font-extrabold text-slate-800 flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-pink-500" />
              Rincian Komponen Sumbu Y (Kinerja)
            </h3>
            <span className="text-xs font-extrabold text-pink-600 bg-pink-50 px-2.5 py-1 rounded-full">
              Skor Total: {pegawai.nilaiY.toFixed(1)}
            </span>
          </div>

          <div className="space-y-3">
            {[
              { label: 'Penilaian Kinerja Utama', val: pegawai.komponenY?.kinerja || 0 },
              { label: 'Penghargaan', val: pegawai.komponenY?.penghargaan || 0 },
              { label: 'Penugasan dalam Tim Kerja', val: pegawai.komponenY?.timKerja || 0 },
              { label: 'Umpan Balik Kinerja 360°', val: pegawai.komponenY?.umpanBalik || 0 },
            ].map((item, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-xs font-bold text-slate-700">
                  <span>{item.label}</span>
                  <span className="text-pink-600">{item.val} / 100</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-violet-500 to-pink-500 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, Math.max(0, item.val))}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Strategic Career Recommendation Box */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-950 p-6 md:p-8 rounded-3xl border border-slate-800 text-white shadow-xl space-y-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-pink-500 text-white">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-white">Rekomendasi Karir Strategis</h3>
            <p className="text-xs text-slate-400">Rekomendasi tindak lanjut berdasarkan hasil pemetaan Box {pegawai.box}</p>
          </div>
        </div>

        <p className="text-sm font-medium leading-relaxed text-slate-200 pt-2 border-t border-slate-800/80">
          {recommendationText}
        </p>
      </div>
    </div>
  );
};
