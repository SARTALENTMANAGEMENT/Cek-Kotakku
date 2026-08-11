import React from 'react';

interface StrengthBarProps {
  password: string;
}

export const StrengthBar: React.FC<StrengthBarProps> = ({ password }) => {
  const getStrength = (pwd: string) => {
    let score = 0;
    if (!pwd) return score;
    if (pwd.length >= 6) score += 1;
    if (pwd.length >= 10) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;
    return score;
  };

  const score = getStrength(password);

  const getLabel = () => {
    if (score === 0) return { text: 'Sangat Lemah', color: 'bg-slate-200 text-slate-500' };
    if (score <= 2) return { text: 'Lemah', color: 'bg-rose-500 text-rose-600' };
    if (score <= 3) return { text: 'Sedang', color: 'bg-amber-500 text-amber-600' };
    if (score <= 4) return { text: 'Kuat', color: 'bg-violet-500 text-violet-600' };
    return { text: 'Sangat Kuat', color: 'bg-emerald-500 text-emerald-600' };
  };

  const labelInfo = getLabel();

  return (
    <div className="mt-2 space-y-1.5">
      <div className="flex items-center justify-between text-xs font-semibold">
        <span className="text-slate-500">Kekuatan Kata Sandi:</span>
        <span className={labelInfo.color.replace(/bg-[a-z0-9-]+/, '')}>{labelInfo.text}</span>
      </div>
      <div className="flex gap-1 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden p-0.5">
        {[1, 2, 3, 4, 5].map((level) => (
          <div
            key={level}
            className={`flex-1 h-full rounded-full transition-all duration-300 ${
              score >= level ? labelInfo.color.split(' ')[0] : 'bg-slate-200'
            }`}
          />
        ))}
      </div>
    </div>
  );
};
