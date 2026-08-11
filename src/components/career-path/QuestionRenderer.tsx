import React from 'react';
import { CareerPathPertanyaan } from '../../lib/types';

interface QuestionRendererProps {
  questions: CareerPathPertanyaan[];
  answers: Record<string, any>;
  onAnswerChange: (questionIdx: number, value: any) => void;
  disabled?: boolean;
}

export const QuestionRenderer: React.FC<QuestionRendererProps> = ({
  questions,
  answers,
  onAnswerChange,
  disabled = false,
}) => {
  return (
    <div className="space-y-6">
      {questions.map((q, idx) => {
        const value = answers[`q_${idx}`];
        const optionsList = q.opsi
          ? q.opsi.split(',').map((o) => o.trim()).filter(Boolean)
          : [];

        return (
          <div
            key={idx}
            className="p-5 md:p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-3"
          >
            <div className="flex items-start gap-3">
              <span className="w-7 h-7 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-700 font-extrabold text-xs flex items-center justify-center shrink-0">
                {idx + 1}
              </span>
              <div>
                <p className="text-xs md:text-sm font-extrabold text-slate-800">
                  {q.teksPertanyaan}{' '}
                  {q.wajib && <span className="text-rose-500">*</span>}
                </p>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Tipe: {q.tipeSoal}
                </span>
              </div>
            </div>

            <div className="pl-10 pt-1">
              {q.tipeSoal === 'Pilihan Ganda' && (
                <div className="space-y-2">
                  {optionsList.map((opt, oIdx) => (
                    <label
                      key={oIdx}
                      className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/30 transition-colors cursor-pointer"
                    >
                      <input
                        type="radio"
                        name={`q_${idx}`}
                        value={opt}
                        disabled={disabled}
                        checked={value === opt}
                        onChange={(e) => onAnswerChange(idx, e.target.value)}
                        className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 border-slate-300"
                      />
                      <span className="text-xs font-semibold text-slate-700">{opt}</span>
                    </label>
                  ))}
                </div>
              )}

              {q.tipeSoal === 'Checkbox' && (
                <div className="space-y-2">
                  {optionsList.map((opt, oIdx) => {
                    const selectedArr = Array.isArray(value) ? value : [];
                    const isChecked = selectedArr.includes(opt);

                    return (
                      <label
                        key={oIdx}
                        className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/30 transition-colors cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          value={opt}
                          disabled={disabled}
                          checked={isChecked}
                          onChange={(e) => {
                            if (e.target.checked) {
                              onAnswerChange(idx, [...selectedArr, opt]);
                            } else {
                              onAnswerChange(idx, selectedArr.filter((i: string) => i !== opt));
                            }
                          }}
                          className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
                        />
                        <span className="text-xs font-semibold text-slate-700">{opt}</span>
                      </label>
                    );
                  })}
                </div>
              )}

              {q.tipeSoal === 'Dropdown' && (
                <select
                  disabled={disabled}
                  value={value || ''}
                  onChange={(e) => onAnswerChange(idx, e.target.value)}
                  className="w-full max-w-md px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                >
                  <option value="">-- Pilih Salah Satu --</option>
                  {optionsList.map((opt, oIdx) => (
                    <option key={oIdx} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              )}

              {q.tipeSoal === 'Skala' && (
                <div className="flex items-center gap-3 py-2">
                  {[1, 2, 3, 4, 5].map((scale) => (
                    <button
                      type="button"
                      key={scale}
                      disabled={disabled}
                      onClick={() => onAnswerChange(idx, scale)}
                      className={`w-10 h-10 rounded-xl font-black text-xs transition-all ${
                        value === scale
                          ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/30 scale-105'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {scale}
                    </button>
                  ))}
                </div>
              )}

              {q.tipeSoal === 'Teks Bebas' && (
                <textarea
                  disabled={disabled}
                  rows={3}
                  value={value || ''}
                  onChange={(e) => onAnswerChange(idx, e.target.value)}
                  placeholder="Tuliskan jawaban lengkap Anda di sini..."
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
