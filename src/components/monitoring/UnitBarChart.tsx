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

interface UnitDistributionItem {
  unit: string;
  total: number;
  sudah: number;
  belum: number;
}

interface UnitBarChartProps {
  data: UnitDistributionItem[];
}

export const UnitBarChart: React.FC<UnitBarChartProps> = ({ data }) => {
  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis
            dataKey="unit"
            tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }}
            interval={0}
            angle={-15}
            textAnchor="end"
          />
          <YAxis tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#0f172a',
              borderRadius: '12px',
              color: '#fff',
              fontSize: '12px',
              border: 'none',
            }}
          />
          <Legend verticalAlign="top" height={36} iconType="circle" />
          <Bar dataKey="sudah" name="Sudah Mengisi" fill="#10b981" radius={[6, 6, 0, 0]} />
          <Bar dataKey="belum" name="Belum Mengisi" fill="#f43f5e" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
