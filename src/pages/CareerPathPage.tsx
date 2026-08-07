import React, { useState, useEffect } from 'react';
import { Compass, FileCheck2, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { CareerPathPeriode, CareerPathPertanyaan, CareerPathJawaban, JWTPayload } from '../lib/types';
import { QuestionRenderer } from '../components/career-path/QuestionRenderer';

interface CareerPathPageProps {
  user: JWTPayload | null;
  onShowToast: (type: 'success' | 'error' | 'info', text: string) => void;
}

export const CareerPathPage: React.FC<CareerPathPageProps> = ({ user, onShowToast }) => {
  const [periodes, setPeriodes] = useState<CareerPathPeriode[]>([]);
  const [selectedPeriode, setSelectedPeriode] = useState<CareerPathPeriode | null>(null);
  const [questions, setQuestions] = useState<CareerPathPertanyaan[]>([]);
  const [existingAnswer, setExistingAnswer] = useState<CareerPathJawaban | null>(null);
  const [formData, setFormData] = useState<Record<string, string | string[]>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchPeriodes();
  }, []);

  const fetchPeriodes = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/career-path/periode');
      const data = await res.json();
      if (res.ok && data.data) {
        setPeriodes(data.data);
      }
    } catch (err) {
      onShowToast('error', 'Gagal memuat daftar periode Career Path.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenPeriode = async (periode: CareerPathPeriode) => {
    setSelectedPeriode(periode);
    setLoading(true);
    setFormData({});
    setErrors({});

    try {
      // Fetch questions
      const qRes = await fetch(`/api/career-path/periode/${periode.periodeId}/pertanyaan`);
      const qData = await qRes.json();
      const qList: CareerPathPertanyaan[] = qData.data || [];
      setQuestions(qList);

      // Fetch user's existing answer if any
      const aRes = await fetch(`/api/career-path/jawaban?periodeId=${periode.periodeId}`);
      const aData = await aRes.json();
      const ans: CareerPathJawaban | null = aData.data || null;
      setExistingAnswer(ans);

      if (ans && ans.jawaban) {
        setFormData(ans.jawaban);
      } else {
        // Initialize default empty values
        const initial: Record<string, string | string[]> = {};
        qList.forEach((q, idx) => {
          initial[idx.toString()] = q.tipeSoal === 'Checkbox' ? [] : '';
        });
        setFormData(initial);
      }
    } catch (err) {
      onShowToast('error', 'Gagal memuat kuesioner.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPeriode) return;

    // Validate mandatory fields
    const newErrors: Record<string, string> = {};
    questions.forEach((q, idx) => {
      if (q.wajib) {
        const key = idx.toString();
        const val = formData[key];
        if (!val || (Array.isArray(val) && val.length === 0)) {
          newErrors[key] = 'Pertanyaan ini wajib diisi.';
        }
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      onShowToast('error', 'Mohon lengkapi seluruh pertanyaan yang wajib diisi.');
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch('/api/career-path/jawaban', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          periodeId: selectedPeriode.periodeId,
          jawaban: formData,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        onShowToast('error', data.error || 'Gagal menyimpan jawaban.');
        setSubmitting(false);
        return;
      }

      onShowToast('success', 'Jawaban kuesioner berhasil disimpan!');
      setExistingAnswer(data.data);
    } catch (err) {
      onShowToast('error', 'Terjadi kesalahan saat mengirim jawaban.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading && periodes.length === 0) {
    return (
      <div className="p-12 text-center">
        <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs font-bold text-slate-500">Memuat periode kuesioner Career Path...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between">
        <div>
          <h2 className="text-lg font-black text-slate-800 flex items-center gap-2">
            <Compass className="w-5 h-5 text-indigo-600" />
            Pengisian Kuesioner Career Path
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Pilihlah periode kuesioner aktif di bawah ini untuk mengisi atau mengedit aspirasi karir Anda.
          </p>
        </div>
      </div>

      {periodes.length === 0 ? (
        /* Empty State */
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200/80 shadow-xs max-w-lg mx-auto">
          <FileCheck2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-extrabold text-slate-800">
            Belum ada periode Career Path untuk Anda
          </h3>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            Saat ini tidak ada periode pengisian kuesioner career path aktif yang menyasar akun Anda. Silakan periksa kembali di kemudian hari.
          </p>
        </div>
      ) : !selectedPeriode ? (
        /* List of Periods */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {periodes.map((p) => (
            <div
              key={p.periodeId}
              onClick={() => handleOpenPeriode(p)}
              className="p-6 rounded-2xl bg-white border border-slate-200/80 hover:border-indigo-400 shadow-xs hover:shadow-md transition-all cursor-pointer space-y-4 group"
            >
              <div className="flex items-start justify-between">
                <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                  {p.status}
                </span>
                <span className="text-[11px] font-semibold text-slate-400">
                  Target: {p.targetType}
                </span>
              </div>

              <div>
                <h3 className="text-base font-extrabold text-slate-900 group-hover:text-indigo-600 transition-colors">
                  {p.namaPeriode}
                </h3>
                <p className="text-xs text-slate-500 mt-1">ID Periode: {p.periodeId}</p>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-indigo-600">
                <span>Buka Kuesioner</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Questionnaire Filling Screen */
        <div className="space-y-6">
          {/* Back button and status bar */}
          <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <button
              onClick={() => setSelectedPeriode(null)}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
            >
              ← Kembali ke Daftar Periode
            </button>
            {existingAnswer?.status === 'Sudah Mengisi' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Anda Sudah Pernah Mengisi Kuesioner Ini
              </span>
            )}
          </div>

          <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-lg">
            <h3 className="text-lg font-black">{selectedPeriode.namaPeriode}</h3>
            <p className="text-xs text-slate-300 mt-1">
              Silakan isi seluruh pertanyaan di bawah ini secara jujur dan objektif.
            </p>
          </div>

          {questions.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
              <p className="text-sm font-bold text-slate-600">
                Belum ada daftar pertanyaan pada periode ini.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {questions.map((q, idx) => (
                <QuestionRenderer
                  key={idx}
                  question={q}
                  index={idx}
                  value={formData[idx.toString()] || (q.tipeSoal === 'Checkbox' ? [] : '')}
                  onChange={(val) => {
                    setFormData({ ...formData, [idx.toString()]: val });
                    setErrors({ ...errors, [idx.toString()]: '' });
                  }}
                  error={errors[idx.toString()]}
                />
              ))}

              <div className="p-5 bg-white rounded-2xl border border-slate-200 flex justify-end">
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-violet-600 to-pink-600 text-white font-extrabold text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  {submitting ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>{existingAnswer ? 'Perbarui Jawaban' : 'Kirim Jawaban'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
};
