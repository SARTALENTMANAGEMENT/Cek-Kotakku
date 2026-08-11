import React, { useEffect, useState } from 'react';
import { Plus, Trash2, Edit3, Save, FileQuestion, Users } from 'lucide-react';
import { CareerPathPeriode, CareerPathPertanyaan, Pegawai } from '../lib/types';
import { QuestionBuilder } from '../components/career-path/QuestionBuilder';
import { Modal } from '../components/ui/Modal';

interface KelolaKuesionerPageProps {
  onShowToast: (msg: { type: 'success' | 'error'; text: string }) => void;
}

export const KelolaKuesionerPage: React.FC<KelolaKuesionerPageProps> = ({ onShowToast }) => {
  const [periodes, setPeriodes] = useState<CareerPathPeriode[]>([]);
  const [pegawaiList, setPegawaiList] = useState<Pegawai[]>([]);
  const [loading, setLoading] = useState(true);

  const [activePeriode, setActivePeriode] = useState<CareerPathPeriode | null>(null);
  const [questions, setQuestions] = useState<CareerPathPertanyaan[]>([]);

  // Modal State for New/Edit Periode
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [periodeForm, setPeriodeForm] = useState<Partial<CareerPathPeriode>>({
    namaPeriode: '',
    status: 'Aktif',
    targetType: 'Semua',
    targetNip: [],
  });

  const [isSavingQuestions, setIsSavingQuestions] = useState(false);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const [resP, resPeg] = await Promise.all([
        fetch('/api/career-path/periode'),
        fetch('/api/pegawai'),
      ]);

      const dataP = await resP.json();
      const dataPeg = await resPeg.json();

      if (resP.ok && dataP.success) {
        const list: CareerPathPeriode[] = dataP.data || [];
        setPeriodes(list);
        if (list.length > 0) {
          selectPeriode(list[0]);
        }
      }

      if (resPeg.ok && dataPeg.success) {
        setPegawaiList(dataPeg.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch initial data:', err);
    } finally {
      setLoading(false);
    }
  };

  const selectPeriode = async (p: CareerPathPeriode) => {
    setActivePeriode(p);
    try {
      const res = await fetch(`/api/career-path/periode/${p.periodeId}/pertanyaan`);
      const data = await res.json();
      if (res.ok && data.success) {
        setQuestions(data.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch questions:', err);
    }
  };

  const handleSavePeriode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!periodeForm.namaPeriode) {
      onShowToast({ type: 'error', text: 'Nama periode wajib diisi!' });
      return;
    }

    try {
      const res = await fetch('/api/career-path/periode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(periodeForm),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Gagal menyimpan periode.');
      }

      onShowToast({ type: 'success', text: 'Periode kuesioner berhasil disimpan.' });
      setIsModalOpen(false);
      fetchInitialData();
    } catch (err: any) {
      onShowToast({ type: 'error', text: err.message || 'Terjadi kesalahan.' });
    }
  };

  const handleDeletePeriode = async (periodeId: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus periode kuesioner ini?')) return;

    try {
      const res = await fetch(`/api/career-path/periode/${periodeId}`, {
        method: 'DELETE',
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Gagal menghapus periode.');
      }

      onShowToast({ type: 'success', text: 'Periode kuesioner berhasil dihapus.' });
      fetchInitialData();
    } catch (err: any) {
      onShowToast({ type: 'error', text: err.message || 'Terjadi kesalahan.' });
    }
  };

  const handleSaveQuestions = async () => {
    if (!activePeriode) return;

    setIsSavingQuestions(true);
    try {
      const res = await fetch(`/api/career-path/periode/${activePeriode.periodeId}/pertanyaan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questions }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Gagal menyimpan daftar pertanyaan.');
      }

      onShowToast({ type: 'success', text: 'Daftar pertanyaan berhasil diperbarui.' });
    } catch (err: any) {
      onShowToast({ type: 'error', text: err.message || 'Terjadi kesalahan.' });
    } finally {
      setIsSavingQuestions(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-pink-50 border border-pink-100 flex items-center justify-center text-pink-600 shrink-0">
            <FileQuestion className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-slate-900">Periode & Instrumen Kuesioner</h3>
            <p className="text-xs text-slate-500">
              Atur daftar pertanyaan dan target sasaran pengisian
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setPeriodeForm({
              namaPeriode: '',
              status: 'Aktif',
              targetType: 'Semua',
              targetNip: [],
            });
            setIsModalOpen(true);
          }}
          className="px-4 py-2.5 rounded-xl font-extrabold text-xs text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/20 flex items-center gap-2 transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Buat Periode Baru</span>
        </button>
      </div>

      {/* List Periodes & Builder Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Periode List */}
        <div className="lg:col-span-4 space-y-3">
          <p className="text-xs font-black uppercase text-slate-400 tracking-wider">Daftar Periode:</p>

          {loading ? (
            <div className="p-4 text-xs font-bold text-slate-400">Loading periode...</div>
          ) : periodes.length === 0 ? (
            <div className="p-4 bg-white rounded-xl border border-slate-200 text-xs font-bold text-slate-400 text-center">
              Belum ada periode. Klik "Buat Periode Baru".
            </div>
          ) : (
            periodes.map((p) => {
              const isActive = activePeriode?.periodeId === p.periodeId;
              return (
                <div
                  key={p.periodeId}
                  onClick={() => selectPeriode(p)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                    isActive
                      ? 'bg-slate-900 text-white border-slate-900 shadow-lg'
                      : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200/80 shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                        p.status === 'Aktif'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-slate-500/20 text-slate-400'
                      }`}
                    >
                      {p.status}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setPeriodeForm(p);
                          setIsModalOpen(true);
                        }}
                        className={`p-1 rounded-lg transition-colors ${
                          isActive ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-slate-100 text-slate-500'
                        }`}
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeletePeriode(p.periodeId);
                        }}
                        className={`p-1 rounded-lg transition-colors ${
                          isActive ? 'hover:bg-rose-900 text-rose-300' : 'hover:bg-rose-50 text-rose-500'
                        }`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <p className="font-extrabold text-xs">{p.namaPeriode}</p>
                  <p className={`text-[10px] font-semibold ${isActive ? 'text-slate-400' : 'text-slate-500'}`}>
                    Target: {p.targetType === 'Semua' ? 'Semua Pegawai' : `${p.targetNip?.length || 0} Pegawai`}
                  </p>
                </div>
              );
            })
          )}
        </div>

        {/* Question Builder */}
        <div className="lg:col-span-8 space-y-4">
          {activePeriode ? (
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-5">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <h3 className="font-black text-base text-slate-900">
                    Edit Pertanyaan: {activePeriode.namaPeriode}
                  </h3>
                  <p className="text-xs font-medium text-slate-500">
                    Urutkan dan tentukan jenis soal untuk kuesioner pegawai
                  </p>
                </div>

                <button
                  onClick={handleSaveQuestions}
                  disabled={isSavingQuestions}
                  className="px-5 py-2.5 rounded-xl font-extrabold text-xs text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/20 flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50 shrink-0"
                >
                  <Save className="w-4 h-4" />
                  <span>{isSavingQuestions ? 'Menyimpan...' : 'Simpan Perubahan'}</span>
                </button>
              </div>

              <QuestionBuilder questions={questions} onChange={setQuestions} />
            </div>
          ) : (
            <div className="p-8 bg-white rounded-2xl border border-slate-200 text-center text-xs font-bold text-slate-400">
              Pilih salah satu periode di sebelah kiri untuk mengedit pertanyaan.
            </div>
          )}
        </div>
      </div>

      {/* Modal Form Periode */}
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={periodeForm.periodeId ? 'Edit Periode Kuesioner' : 'Buat Periode Baru'}
        >
          <form onSubmit={handleSavePeriode} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Nama Periode Kuesioner</label>
              <input
                type="text"
                required
                value={periodeForm.namaPeriode || ''}
                onChange={(e) => setPeriodeForm({ ...periodeForm, namaPeriode: e.target.value })}
                placeholder="Contoh: Pemetaan Karir Triwulan 1 2026"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Status Periode</label>
                <select
                  value={periodeForm.status || 'Aktif'}
                  onChange={(e) =>
                    setPeriodeForm({
                      ...periodeForm,
                      status: e.target.value as CareerPathPeriode['status'],
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                >
                  <option value="Aktif">Aktif</option>
                  <option value="Nonaktif">Nonaktif</option>
                  <option value="Selesai">Selesai</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Target Sasaran</label>
                <select
                  value={periodeForm.targetType || 'Semua'}
                  onChange={(e) =>
                    setPeriodeForm({
                      ...periodeForm,
                      targetType: e.target.value as CareerPathPeriode['targetType'],
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                >
                  <option value="Semua">Semua Pegawai</option>
                  <option value="Tertentu">Pegawai Pilihan (NIP)</option>
                </select>
              </div>
            </div>

            {periodeForm.targetType === 'Tertentu' && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Pilih Pegawai Target ({periodeForm.targetNip?.length || 0} Dipilih)
                </label>
                <div className="max-h-48 overflow-y-auto p-3 border border-slate-200 rounded-xl space-y-2 bg-slate-50">
                  {pegawaiList.map((p) => {
                    const isChecked = (periodeForm.targetNip || []).includes(p.nip);
                    return (
                      <label key={p.nip} className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            const arr = periodeForm.targetNip || [];
                            if (e.target.checked) {
                              setPeriodeForm({ ...periodeForm, targetNip: [...arr, p.nip] });
                            } else {
                              setPeriodeForm({
                                ...periodeForm,
                                targetNip: arr.filter((id) => id !== p.nip),
                              });
                            }
                          }}
                          className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
                        />
                        <span>
                          {p.nama} ({p.nip})
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="pt-3 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl text-xs font-extrabold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-600/20"
              >
                Simpan Periode
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
