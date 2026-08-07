import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface StatusDonutChartProps {
  sudahCount: number;
  belumCount: number;
}

export const StatusDonutChart: React.FC<StatusDonutChartProps> = ({
  sudahCount,
  belumCount,
}) => {
  const data = [
    { name: 'Sudah Mengisi', value: sudahCount, color: '#10b981' },
    { name: 'Belum Mengisi', value: belumCount, color: '#f43f5e' },
  ];

  const total = sudahCount + belumCount;
  const percentage = total > 0 ? Math.round((sudahCount / total) * 100) : 0;

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex flex-col justify-between">
      <div>
        <h4 className="text-sm font-extrabold text-slate-800">Rasio Pengisian Career Path</h4>
        <p className="text-xs text-slate-500 mt-0.5">Persentase pegawai target yang telah mengisi kuesioner</p>
      </div>

      <div className="h-56 w-full relative my-2">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={80}
              paddingAngle={4}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(val: any) => [`${val} Pegawai`, 'Jumlah']}
              contentStyle={{ borderRadius: '12px', fontSize: '12px' }}
            />
            <Legend verticalAlign="bottom" height={36} iconType="circle" />
          </PieChart>
        </ResponsiveContainer>

        {/* Center Percentage Display */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-8 text-center pointer-events-none">
          <span className="text-2xl font-black text-slate-800">{percentage}%</span>
          <p className="text-[10px] font-bold text-slate-400 uppercase">Selesai</p>
        </div>
      </div>
    </div>
  );
};
