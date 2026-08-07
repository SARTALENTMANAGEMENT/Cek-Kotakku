import React from 'react';
import { Plus, Trash2, ArrowUp, ArrowDown, HelpCircle } from 'lucide-react';
import { CareerPathPertanyaan, TipeSoal } from '../../lib/types';

interface QuestionBuilderProps {
  questions: CareerPathPertanyaan[];
  onChange: (updated: CareerPathPertanyaan[]) => void;
}

const TIPE_SOAL_OPTIONS: TipeSoal[] = [
  'Pilihan Ganda',
  'Checkbox',
  'Dropdown',
  'Skala',
  'Teks Bebas',
];

export const QuestionBuilder: React.FC<QuestionBuilderProps> = ({ questions, onChange }) => {
  const handleAddQuestion = () => {
    const newQ: CareerPathPertanyaan = {
      urutan: questions.length + 1,
      teksPertanyaan: '',
      tipeSoal: 'Pilihan Ganda',
      opsi: 'Opsi 1|Opsi 2|Opsi 3',
      wajib: true,
    };
    onChange([...questions, newQ]);
  };

  const handleRemoveQuestion = (idx: number) => {
    const updated = questions.filter((_, i) => i !== idx);
    const reordered = updated.map((q, i) => ({ ...q, urutan: i + 1 }));
    onChange(reordered);
  };

  const handleMoveQuestion = (idx: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && idx === 0) ||
      (direction === 'down' && idx === questions.length - 1)
    ) {
      return;
    }

    const updated = [...questions];
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    const temp = updated[idx];
    updated[idx] = updated[targetIdx];
    updated[targetIdx] = temp;

    const reordered = updated.map((q, i) => ({ ...q, urutan: i + 1 }));
    onChange(reordered);
  };

  const handleUpdateField = (idx: number, field: keyof CareerPathPertanyaan, val: any) => {
    const updated = [...questions];
    updated[idx] = { ...updated[idx], [field]: val };
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-extrabold text-slate-800">Daftar Pertanyaan Kuesioner</h4>
          <p className="text-xs text-slate-500">
            Atur urutan, tipe soal, dan opsi jawaban kuesioner.
          </p>
        </div>
        <button
          onClick={handleAddQuestion}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-extrabold bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          Tambah Pertanyaan
        </button>
      </div>

      {questions.length === 0 ? (
        <div className="p-8 text-center bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl">
          <HelpCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <p className="text-sm font-bold text-slate-600">Belum ada pertanyaan pada periode ini.</p>
          <p className="text-xs text-slate-400 mt-1">
            Klik tombol "Tambah Pertanyaan" untuk mulai menyusun kuesioner.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {questions.map((q, idx) => (
            <div
              key={idx}
              className="p-5 bg-white border border-slate-200/90 rounded-2xl shadow-xs space-y-3 relative group"
            >
              <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-700 font-black text-xs flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <span className="text-xs font-extrabold text-slate-700">Pertanyaan #{idx + 1}</span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleMoveQuestion(idx, 'up')}
                    disabled={idx === 0}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 disabled:opacity-30"
                    title="Geser ke Atas"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleMoveQuestion(idx, 'down')}
                    disabled={idx === questions.length - 1}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 disabled:opacity-30"
                    title="Geser ke Bawah"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleRemoveQuestion(idx)}
                    className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 transition-colors ml-1"
                    title="Hapus Pertanyaan"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Teks Pertanyaan */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Teks Pertanyaan
                </label>
                <input
                  type="text"
                  value={q.teksPertanyaan}
                  onChange={(e) => handleUpdateField(idx, 'teksPertanyaan', e.target.value)}
                  placeholder="Masukkan kalimat pertanyaan..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Tipe Soal */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Tipe Soal
                  </label>
                  <select
                    value={q.tipeSoal}
                    onChange={(e) =>
                      handleUpdateField(idx, 'tipeSoal', e.target.value as TipeSoal)
                    }
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold bg-white text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  >
                    {TIPE_SOAL_OPTIONS.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Wajib Diisi Toggle */}
                <div className="flex items-center gap-3 pt-5">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={q.wajib}
                      onChange={(e) => handleUpdateField(idx, 'wajib', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                  <span className="text-xs font-bold text-slate-700">Wajib Diisi oleh Pegawai</span>
                </div>
              </div>

              {/* Opsi Pertanyaan (jika bukan Teks Bebas) */}
              {q.tipeSoal !== 'Teks Bebas' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Opsi Jawaban (pisahkan dengan tanda garis tegak <code className="bg-slate-100 px-1 py-0.5 rounded text-indigo-600">|</code>)
                  </label>
                  <input
                    type="text"
                    value={q.opsi || ''}
                    onChange={(e) => handleUpdateField(idx, 'opsi', e.target.value)}
                    placeholder={
                      q.tipeSoal === 'Skala'
                        ? '1|2|3|4|5'
                        : 'Opsi A|Opsi B|Opsi C'
                    }
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
