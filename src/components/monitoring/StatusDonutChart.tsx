import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface StatusDonutProps {
  sudah: number;
  belum: number;
}

export const StatusDonutChart: React.FC<StatusDonutProps> = ({ sudah, belum }) => {
  const data = [
    { name: 'Sudah Mengisi', value: sudah },
    { name: 'Belum Mengisi', value: belum },
  ];

  const COLORS = ['#10b981', '#f43f5e'];

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={85}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: '#0f172a',
              borderRadius: '12px',
              color: '#fff',
              fontSize: '12px',
              border: 'none',
            }}
          />
          <Legend verticalAlign="bottom" height={36} iconType="circle" />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
