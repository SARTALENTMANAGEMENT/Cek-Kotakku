import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface UnitBarChartProps {
  data: Array<{
    unit: string;
    total: number;
    sudah: number;
    belum: number;
  }>;
}

export const UnitBarChart: React.FC<UnitBarChartProps> = ({ data }) => {
  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex flex-col justify-between">
      <div>
        <h4 className="text-sm font-extrabold text-slate-800">Distribusi Pengisian per Unit Organisasi</h4>
        <p className="text-xs text-slate-500 mt-0.5">
          Perbandingan jumlah pegawai yang sudah vs belum mengisi berdasarkan unit
        </p>
      </div>

      <div className="h-56 w-full my-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="unit" tick={{ fill: '#64748b', fontSize: 10, fontWeight: 600 }} />
            <YAxis tick={{ fill: '#64748b', fontSize: 10 }} />
            <Tooltip
              contentStyle={{ borderRadius: '12px', fontSize: '12px' }}
              cursor={{ fill: '#f8fafc' }}
            />
            <Legend verticalAlign="bottom" height={36} iconType="circle" />
            <Bar dataKey="sudah" name="Sudah Mengisi" fill="#10b981" radius={[6, 6, 0, 0]} />
            <Bar dataKey="belum" name="Belum Mengisi" fill="#f43f5e" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
