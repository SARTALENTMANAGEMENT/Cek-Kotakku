import React from 'react';
import { Plus, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import { CareerPathPertanyaan } from '../../lib/types';

interface QuestionBuilderProps {
  questions: CareerPathPertanyaan[];
  onChange: (questions: CareerPathPertanyaan[]) => void;
}

export const QuestionBuilder: React.FC<QuestionBuilderProps> = ({ questions, onChange }) => {
  const addQuestion = () => {
    const newQ: CareerPathPertanyaan = {
      urutan: questions.length + 1,
      teksPertanyaan: '',
      tipeSoal: 'Pilihan Ganda',
      opsi: 'Opsi 1, Opsi 2, Opsi 3',
      wajib: true,
    };
    onChange([...questions, newQ]);
  };

  const updateQuestion = (index: number, updated: Partial<CareerPathPertanyaan>) => {
    const copy = [...questions];
    copy[index] = { ...copy[index], ...updated };
    onChange(copy);
  };

  const removeQuestion = (index: number) => {
    const copy = questions.filter((_, i) => i !== index);
    const reordered = copy.map((q, idx) => ({ ...q, urutan: idx + 1 }));
    onChange(reordered);
  };

  const moveQuestion = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= questions.length) return;

    const copy = [...questions];
    const temp = copy[index];
    copy[index] = copy[targetIdx];
    copy[targetIdx] = temp;

    const reordered = copy.map((q, idx) => ({ ...q, urutan: idx + 1 }));
    onChange(reordered);
  };

  return (
    <div className="space-y-4">
      {questions.map((q, idx) => (
        <div
          key={idx}
          className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4 relative group"
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-xl bg-slate-900 text-white font-extrabold text-xs flex items-center justify-center">
                {idx + 1}
              </span>
              <span className="text-xs font-black uppercase text-slate-500 tracking-wider">
                Pertanyaan #{idx + 1}
              </span>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled={idx === 0}
                onClick={() => moveQuestion(idx, 'up')}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 disabled:opacity-30"
              >
                <ArrowUp className="w-4 h-4" />
              </button>
              <button
                type="button"
                disabled={idx === questions.length - 1}
                onClick={() => moveQuestion(idx, 'down')}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 disabled:opacity-30"
              >
                <ArrowDown className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => removeQuestion(idx)}
                className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 transition-colors ml-1"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Teks Pertanyaan</label>
              <input
                type="text"
                value={q.teksPertanyaan}
                onChange={(e) => updateQuestion(idx, { teksPertanyaan: e.target.value })}
                placeholder="Contoh: Apa target pengembangan karir utama Anda?"
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tipe Jawaban</label>
                <select
                  value={q.tipeSoal}
                  onChange={(e) =>
                    updateQuestion(idx, {
                      tipeSoal: e.target.value as CareerPathPertanyaan['tipeSoal'],
                    })
                  }
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                >
                  <option value="Pilihan Ganda">Pilihan Ganda</option>
                  <option value="Checkbox">Checkbox (Multi Pilihan)</option>
                  <option value="Dropdown">Dropdown</option>
                  <option value="Skala">Skala 1 - 5</option>
                  <option value="Teks Bebas">Teks Bebas (Essay)</option>
                </select>
              </div>

              <div className="flex items-center pt-5">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={q.wajib}
                    onChange={(e) => updateQuestion(idx, { wajib: e.target.checked })}
                    className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
                  />
                  <span className="text-xs font-bold text-slate-700">Wajib Diisi oleh Pegawai</span>
                </label>
              </div>
            </div>

            {['Pilihan Ganda', 'Checkbox', 'Dropdown'].includes(q.tipeSoal) && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Pilihan Opsi (Pisahkan dengan Tanda Koma)
                </label>
                <input
                  type="text"
                  value={q.opsi || ''}
                  onChange={(e) => updateQuestion(idx, { opsi: e.target.value })}
                  placeholder="Contoh: Opsi A, Opsi B, Opsi C"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
            )}
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={addQuestion}
        className="w-full py-3 border-2 border-dashed border-slate-300 hover:border-indigo-500 hover:bg-indigo-50/50 text-indigo-600 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
      >
        <Plus className="w-4 h-4" />
        <span>Tambah Pertanyaan Baru</span>
      </button>
    </div>
  );
};
