import React, { useEffect, useState } from 'react';
import { Compass, CheckCircle2, Send, Clock, Calendar } from 'lucide-react';
import { CareerPathPeriode, CareerPathPertanyaan, JWTPayload } from '../lib/types';
import { QuestionRenderer } from '../components/career-path/QuestionRenderer';

interface CareerPathPageProps {
  user: JWTPayload | null;
  onShowToast: (msg: { type: 'success' | 'error'; text: string }) => void;
}

export const CareerPathPage: React.FC<CareerPathPageProps> = ({ user, onShowToast }) => {
  const [periodes, setPeriodes] = useState<CareerPathPeriode[]>([]);
  const [selectedPeriode, setSelectedPeriode] = useState<CareerPathPeriode | null>(null);
  const [questions, setQuestions] = useState<CareerPathPertanyaan[]>([]);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchPeriodes();
  }, []);

  const fetchPeriodes = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/career-path/periode');
      const data = await res.json();
      if (res.ok && data.success) {
        const list: CareerPathPeriode[] = data.data || [];
        setPeriodes(list);
        if (list.length > 0) {
          selectPeriode(list[0]);
        }
      }
    } catch (err) {
      console.error('Failed to fetch periodes:', err);
    } finally {
      setLoading(false);
    }
  };

  const selectPeriode = async (p: CareerPathPeriode) => {
    setSelectedPeriode(p);
    setLoading(true);
    try {
      // Fetch Questions
      const resQ = await fetch(`/api/career-path/periode/${p.periodeId}/pertanyaan`);
      const dataQ = await resQ.json();

      // Fetch User's existing answers
      const resA = await fetch(`/api/career-path/jawaban?periodeId=${p.periodeId}`);
      const dataA = await resA.json();

      if (resQ.ok && dataQ.success) {
        setQuestions(dataQ.data || []);
      }

      if (resA.ok && dataA.success && dataA.data) {
        setAnswers(dataA.data.jawaban || {});
        setIsSubmitted(dataA.data.status === 'Sudah Mengisi');
      } else {
        setAnswers({});
        setIsSubmitted(false);
      }
    } catch (err) {
      console.error('Failed to load questions/answers:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (idx: number, val: any) => {
    setAnswers((prev) => ({
      ...prev,
      [`q_${idx}`]: val,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPeriode) return;

    // Validate required questions
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (q.wajib) {
        const val = answers[`q_${i}`];
        if (
          val === undefined ||
          val === null ||
          val === '' ||
          (Array.isArray(val) && val.length === 0)
        ) {
          onShowToast({
            type: 'error',
            text: `Pertanyaan #${i + 1} (${q.teksPertanyaan}) wajib diisi!`,
          });
          return;
        }
      }
    }

    setIsSaving(true);
    try {
      const res = await fetch('/api/career-path/jawaban', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          periodeId: selectedPeriode.periodeId,
          jawaban: answers,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Gagal menyimpan jawaban kuesioner.');
      }

      setIsSubmitted(true);
      onShowToast({
        type: 'success',
        text: 'Jawaban kuesioner career path Anda berhasil disimpan!',
      });
    } catch (err: any) {
      onShowToast({
        type: 'error',
        text: err.message || 'Terjadi kesalahan saat menyimpan.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (loading && periodes.length === 0) {
    return (
      <div className="p-8 text-center text-xs font-bold text-slate-400">
        Memuat kuesioner career path...
      </div>
    );
  }

  if (periodes.length === 0) {
    return (
      <div className="p-8 bg-white rounded-2xl border border-slate-200 text-center space-y-3">
        <Clock className="w-8 h-8 text-slate-400 mx-auto" />
        <h3 className="font-extrabold text-base text-slate-800">
          Belum Ada Periode Kuesioner Aktif
        </h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          Administrator belum membuka periode pengisian kuesioner career path baru untuk NIP Anda.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Selector Periodes */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-slate-900">Pilih Periode Pengisian</h3>
            <p className="text-xs text-slate-500">Pilih kuesioner karir yang ingin diselesaikan</p>
          </div>
        </div>

        <select
          value={selectedPeriode?.periodeId || ''}
          onChange={(e) => {
            const found = periodes.find((p) => p.periodeId === e.target.value);
            if (found) selectPeriode(found);
          }}
          className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold focus:ring-2 focus:ring-indigo-500 outline-none bg-white min-w-[240px]"
        >
          {periodes.map((p) => (
            <option key={p.periodeId} value={p.periodeId}>
              {p.namaPeriode}
            </option>
          ))}
        </select>
      </div>

      {/* Periode Banner Status */}
      {selectedPeriode && (
        <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 to-indigo-950 text-white shadow-lg space-y-2 border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              <Calendar className="w-3 h-3" />
              <span>Status: {selectedPeriode.status}</span>
            </span>
            {isSubmitted && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                <CheckCircle2 className="w-3 h-3 text-indigo-400" />
                <span>Sudah Mengisi</span>
              </span>
            )}
          </div>
          <h2 className="text-lg md:text-xl font-black">{selectedPeriode.namaPeriode}</h2>
          <p className="text-xs text-slate-300">
            NIP: {user?.nip} • Ditujukan untuk:{' '}
            {selectedPeriode.targetType === 'Semua' ? 'Seluruh Pegawai' : 'Pegawai Pilihan'}
          </p>
        </div>
      )}

      {/* Questions Renderer Form */}
      {questions.length === 0 ? (
        <div className="p-8 bg-white rounded-2xl border border-slate-200 text-center text-xs font-bold text-slate-400">
          Belum ada pertanyaan pada periode kuesioner ini.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <QuestionRenderer
            questions={questions}
            answers={answers}
            onAnswerChange={handleAnswerChange}
          />

          <div className="p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500">
              {isSubmitted
                ? 'Anda dapat memperbarui jawaban kuesioner kapan saja selama periode aktif.'
                : 'Pastikan seluruh pertanyaan wajib (*) telah terisi sebelum mengirim.'}
            </p>

            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-3 rounded-xl font-extrabold text-xs text-white bg-gradient-to-r from-indigo-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 shadow-md shadow-indigo-600/20 flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{isSaving ? 'Menyimpan...' : isSubmitted ? 'Perbarui Jawaban' : 'Kirim Kuesioner'}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
