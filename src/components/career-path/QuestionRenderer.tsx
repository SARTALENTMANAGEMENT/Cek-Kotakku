import React from 'react';
import { CareerPathPertanyaan } from '../../lib/types';

interface QuestionRendererProps {
  question: CareerPathPertanyaan;
  index: number;
  value: string | string[];
  onChange: (val: string | string[]) => void;
  error?: string;
}

export const QuestionRenderer: React.FC<QuestionRendererProps> = ({
  question,
  index,
  value,
  onChange,
  error,
}) => {
  const options = (question.opsi || '')
    .split('|')
    .map((o) => o.trim())
    .filter(Boolean);

  const renderInput = () => {
    switch (question.tipeSoal) {
      case 'Pilihan Ganda':
        return (
          <div className="space-y-2 mt-2">
            {options.map((opt, optIdx) => (
              <label
                key={optIdx}
                className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                  value === opt
                    ? 'bg-indigo-50/80 border-indigo-500 font-bold text-indigo-900 ring-2 ring-indigo-200'
                    : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <input
                  type="radio"
                  name={`q_${question.urutan}`}
                  value={opt}
                  checked={value === opt}
                  onChange={(e) => onChange(e.target.value)}
                  className="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-sm">{opt}</span>
              </label>
            ))}
          </div>
        );

      case 'Checkbox': {
        const currentArr = Array.isArray(value) ? value : [];
        const handleCheckbox = (opt: string, checked: boolean) => {
          if (checked) {
            onChange([...currentArr, opt]);
          } else {
            onChange(currentArr.filter((i) => i !== opt));
          }
        };

        return (
          <div className="space-y-2 mt-2">
            {options.map((opt, optIdx) => {
              const isChecked = currentArr.includes(opt);
              return (
                <label
                  key={optIdx}
                  className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                    isChecked
                      ? 'bg-indigo-50/80 border-indigo-500 font-bold text-indigo-900 ring-2 ring-indigo-200'
                      : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={(e) => handleCheckbox(opt, e.target.checked)}
                    className="w-4 h-4 text-indigo-600 rounded-md focus:ring-indigo-500"
                  />
                  <span className="text-sm">{opt}</span>
                </label>
              );
            })}
          </div>
        );
      }

      case 'Dropdown':
        return (
          <select
            value={(value as string) || ''}
            onChange={(e) => onChange(e.target.value)}
            className="w-full mt-2 p-3 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">-- Pilih Salah Satu --</option>
            {options.map((opt, optIdx) => (
              <option key={optIdx} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        );

      case 'Skala': {
        const scaleValues = options.length > 0 ? options : ['1', '2', '3', '4', '5'];
        return (
          <div className="mt-3">
            <div className="flex items-center justify-between gap-2 max-w-md">
              {scaleValues.map((val) => {
                const isSelected = value === val;
                return (
                  <label
                    key={val}
                    className={`flex-1 flex flex-col items-center justify-center py-3 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-gradient-to-tr from-indigo-600 to-violet-600 text-white font-extrabold border-transparent shadow-md scale-105'
                        : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700 font-bold'
                    }`}
                  >
                    <input
                      type="radio"
                      name={`scale_${question.urutan}`}
                      value={val}
                      checked={isSelected}
                      onChange={(e) => onChange(e.target.value)}
                      className="sr-only"
                    />
                    <span className="text-base">{val}</span>
                  </label>
                );
              })}
            </div>
            <div className="flex justify-between text-[11px] font-semibold text-slate-400 max-w-md mt-1.5 px-1">
              <span>Sangat Tidak Siap (1)</span>
              <span>Sangat Siap (5)</span>
            </div>
          </div>
        );
      }

      case 'Teks Bebas':
      default:
        return (
          <textarea
            rows={4}
            value={(value as string) || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Tuliskan jawaban Anda di sini secara rinci..."
            className="w-full mt-2 p-3.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        );
    }
  };

  return (
    <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-2">
      <div className="flex items-start justify-between gap-3">
        <label className="text-sm font-extrabold text-slate-800 leading-snug">
          <span className="text-indigo-600 mr-1">{index + 1}.</span>
          {question.teksPertanyaan}
          {question.wajib && <span className="text-rose-500 ml-1 font-bold">*</span>}
        </label>
        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 shrink-0">
          {question.tipeSoal}
        </span>
      </div>

      {renderInput()}

      {error && <p className="text-xs font-semibold text-rose-500 mt-1">{error}</p>}
    </div>
  );
};
