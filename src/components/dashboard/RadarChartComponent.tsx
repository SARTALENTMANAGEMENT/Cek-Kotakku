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

interface RadarChartProps {
  dataX?: Record<string, number>;
  dataY?: Record<string, number>;
}

export const RadarChartComponent: React.FC<RadarChartProps> = ({ dataX = {}, dataY = {} }) => {
  const keys = Array.from(new Set([...Object.keys(dataX), ...Object.keys(dataY)]));

  if (keys.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-xs font-semibold text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
        Komponen nilai teknis belum dikonfigurasi
      </div>
    );
  }

  const chartData = keys.map((key) => ({
    subject: key,
    Potensi: dataX[key] || 0,
    Kinerja: dataY[key] || 0,
  }));

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
          <PolarGrid stroke="#e2e8f0" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: '#475569', fontSize: 11, fontWeight: 700 }} />
          <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#cbd5e1" fontSize={10} />
          <Radar
            name="Potensi (X)"
            dataKey="Potensi"
            stroke="#6366f1"
            fill="#6366f1"
            fillOpacity={0.4}
          />
          <Radar
            name="Kinerja (Y)"
            dataKey="Kinerja"
            stroke="#ec4899"
            fill="#ec4899"
            fillOpacity={0.3}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#0f172a',
              borderRadius: '12px',
              color: '#fff',
              fontSize: '12px',
              border: 'none',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)',
            }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};
