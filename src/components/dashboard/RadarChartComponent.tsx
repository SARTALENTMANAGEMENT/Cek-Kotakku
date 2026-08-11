import React from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { KomponenPotensi, KomponenKinerja } from '../../lib/types';

interface RadarChartComponentProps {
  komponenX: KomponenPotensi;
  komponenY: KomponenKinerja;
}

export const RadarChartComponent: React.FC<RadarChartComponentProps> = ({
  komponenX,
  komponenY,
}) => {
  const dataPotensi = [
    { subject: 'Kompetensi', score: komponenX?.kompetensi || 0, fullMark: 100 },
    { subject: 'Pengembangan', score: komponenX?.pengembangan || 0, fullMark: 100 },
    { subject: 'Pengalaman', score: komponenX?.pengalaman || 0, fullMark: 100 },
    { subject: 'Potensi', score: komponenX?.potensi || 0, fullMark: 100 },
    { subject: 'Pendidikan', score: komponenX?.pendidikan || 0, fullMark: 100 },
    { subject: 'Kesesuaian', score: komponenX?.kesesuaian || 0, fullMark: 100 },
    { subject: 'Disiplin', score: komponenX?.disiplin || 0, fullMark: 100 },
  ];

  const dataKinerja = [
    { subject: 'Kinerja Utama', score: komponenY?.kinerja || 0, fullMark: 100 },
    { subject: 'Penghargaan', score: komponenY?.penghargaan || 0, fullMark: 100 },
    { subject: 'Tim Kerja', score: komponenY?.timKerja || 0, fullMark: 100 },
    { subject: 'Umpan Balik', score: komponenY?.umpanBalik || 0, fullMark: 100 },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Radar Chart Sumbu X (Potensi) */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex flex-col justify-between">
        <div className="mb-2">
          <h4 className="text-sm font-extrabold text-slate-800 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-600"></span>
            Profil Radar Sumbu X (Komponen Potensi)
          </h4>
          <p className="text-xs text-slate-500 mt-0.5">7 Sub-komponen Penilaian Potensi Pegawai</p>
        </div>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="75%" data={dataPotensi}>
              <PolarGrid stroke="#e2e8f0" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#475569', fontSize: 11, fontWeight: 600 }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10 }} />
              <Radar
                name="Skor Potensi"
                dataKey="score"
                stroke="#6366f1"
                fill="#818cf8"
                fillOpacity={0.5}
              />
              <Tooltip
                formatter={(value: any) => [`${value} / 100`, 'Skor']}
                contentStyle={{ borderRadius: '12px', borderColor: '#e2e8f0', fontSize: '12px' }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Radar Chart Sumbu Y (Kinerja) */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex flex-col justify-between">
        <div className="mb-2">
          <h4 className="text-sm font-extrabold text-slate-800 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-pink-500"></span>
            Profil Radar Sumbu Y (Komponen Kinerja)
          </h4>
          <p className="text-xs text-slate-500 mt-0.5">4 Sub-komponen Penilaian Kinerja Pegawai</p>
        </div>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="75%" data={dataKinerja}>
              <PolarGrid stroke="#e2e8f0" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#475569', fontSize: 11, fontWeight: 600 }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10 }} />
              <Radar
                name="Skor Kinerja"
                dataKey="score"
                stroke="#ec4899"
                fill="#f472b6"
                fillOpacity={0.5}
              />
              <Tooltip
                formatter={(value: any) => [`${value} / 100`, 'Skor']}
                contentStyle={{ borderRadius: '12px', borderColor: '#e2e8f0', fontSize: '12px' }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
