import React from 'react';

interface StrengthBarProps {
  label: string;
  score: number;
  maxScore?: number;
}

export const StrengthBar: React.FC<StrengthBarProps> = ({
  label,
  score,
  maxScore = 100,
}) => {
  const percentage = Math.min(100, Math.max(0, (score / maxScore) * 100));

  let colorClass = 'bg-rose-500';
  if (percentage >= 80) colorClass = 'bg-emerald-500';
  else if (percentage >= 65) colorClass = 'bg-indigo-500';
  else if (percentage >= 50) colorClass = 'bg-amber-500';

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center text-xs font-semibold">
        <span className="text-slate-700">{label}</span>
        <span className="font-extrabold text-slate-900">{score} pts</span>
      </div>
      <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${colorClass}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
