import React, { useState, useEffect } from 'react';
import { FileCheck2, Plus, Edit2, Trash2, Save, Layers, Target, Settings } from 'lucide-react';
import { CareerPathPeriode, CareerPathPertanyaan, StatusPeriode, TargetType } from '../lib/types';
import { QuestionBuilder } from '../components/career-path/QuestionBuilder';
import { Modal } from '../components/ui/Modal';

interface KelolaKuesionerPageProps {
  onShowToast: (type: 'success' | 'error' | 'info', text: string) => void;
}

export const KelolaKuesionerPage: React.FC<KelolaKuesionerPageProps> = ({ onShowToast }) => {
  const [periodes, setPeriodes] = useState<CareerPathPeriode[]>([]);
  const [selectedPeriode, setSelectedPeriode] = useState<CareerPathPeriode | null>(null);
  const [questions, setQuestions] = useState<CareerPathPertanyaan[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPeriode, setEditingPeriode] = useState<Partial<CareerPathPeriode>>({
    namaPeriode: '',
    status: 'Aktif',
    targetType: 'Semua',
    targetNip: [],
  });
  const [targetNipInput, setTargetNipInput] = useState('');

  const [loading, setLoading] = useState(true);
  const [savingQuestions, setSavingQuestions] = useState(false);

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
        if (data.data.length > 0 && !selectedPeriode) {
          handleSelectPeriode(data.data[0]);
        }
      }
    } catch (err) {
      onShowToast('error', 'Gagal memuat daftar periode kuesioner.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPeriode = async (periode: CareerPathPeriode) => {
    setSelectedPeriode(periode);
    try {
      const res = await fetch(`/api/career-path/periode/${periode.periodeId}/pertanyaan`);
      const data = await res.json();
      setQuestions(data.data || []);
    } catch (err) {
      onShowToast('error', 'Gagal memuat daftar pertanyaan.');
    }
  };

  const handleOpenCreateModal = () => {
    setEditingPeriode({
      namaPeriode: '',
      status: 'Aktif',
      targetType: 'Semua',
      targetNip: [],
    });
    setTargetNipInput('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (periode: CareerPathPeriode, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingPeriode(periode);
    setTargetNipInput(Array.isArray(periode.targetNip) ? periode.targetNip.join(', ') : '');
    setIsModalOpen(true);
  };

  const handleDeletePeriode = async (periodeId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Apakah Anda yakin ingin menghapus periode kuesioner ini?')) return;

    try {
      const res = await fetch(`/api/career-path/periode/${periodeId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        onShowToast('success', 'Periode kuesioner berhasil dihapus.');
        if (selectedPeriode?.periodeId === periodeId) {
          setSelectedPeriode(null);
          setQuestions([]);
        }
        fetchPeriodes();
      }
    } catch (err) {
      onShowToast('error', 'Gagal menghapus periode.');
    }
  };

  const handleSavePeriodeModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPeriode.namaPeriode) {
      onShowToast('error', 'Nama periode wajib diisi.');
      return;
    }

    const nipList = targetNipInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const payload: CareerPathPeriode = {
      periodeId: editingPeriode.periodeId || `PERIODE_${Date.now()}`,
      namaPeriode: editingPeriode.namaPeriode,
      status: (editingPeriode.status as StatusPeriode) || 'Aktif',
      targetType: (editingPeriode.targetType as TargetType) || 'Semua',
      targetNip: nipList,
    };

    try {
      const res = await fetch('/api/career-path/periode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        onShowToast('error', data.error || 'Gagal menyimpan periode.');
        return;
      }

      onShowToast('success', 'Periode kuesioner berhasil disimpan.');
      setIsModalOpen(false);
      fetchPeriodes();
      if (!selectedPeriode) {
        handleSelectPeriode(data.data);
      }
    } catch (err) {
      onShowToast('error', 'Terjadi kesalahan server.');
    }
  };

  const handleSaveQuestions = async () => {
    if (!selectedPeriode) return;

    setSavingQuestions(true);
    try {
      const res = await fetch(`/api/career-path/periode/${selectedPeriode.periodeId}/pertanyaan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questions }),
      });

      if (!res.ok) {
        onShowToast('error', 'Gagal menyimpan daftar pertanyaan.');
        setSavingQuestions(false);
        return;
      }

      onShowToast('success', 'Daftar pertanyaan kuesioner berhasil disimpan!');
    } catch (err) {
      onShowToast('error', 'Terjadi kesalahan saat menyimpan pertanyaan.');
    } finally {
      setSavingQuestions(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
            <FileCheck2 className="w-6 h-6 text-indigo-600" />
            Kelola Kuesioner Career Path
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Buat periode kuesioner dan atur pertanyaan dinamis untuk pemetaan karir pegawai.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: List of Periods */}
        <div className="lg:col-span-4 bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-extrabold text-slate-800 flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-600" />
              Periode Kuesioner
            </h3>
            <button
              onClick={handleOpenCreateModal}
              className="p-1.5 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
              title="Buat Periode Baru"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
            {periodes.map((p) => {
              const isSelected = selectedPeriode?.periodeId === p.periodeId;
              return (
                <div
                  key={p.periodeId}
                  onClick={() => handleSelectPeriode(p)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                    isSelected
                      ? 'bg-slate-900 text-white border-slate-800 shadow-md ring-2 ring-indigo-500/40'
                      : 'bg-slate-50 hover:bg-slate-100/80 border-slate-200/80 text-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md ${
                        p.status === 'Aktif'
                          ? 'bg-emerald-500 text-white'
                          : 'bg-slate-300 text-slate-700'
                      }`}
                    >
                      {p.status}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => handleOpenEditModal(p, e)}
                        className={`p-1 rounded-lg hover:bg-white/20 transition-colors ${
                          isSelected ? 'text-slate-300' : 'text-slate-500'
                        }`}
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => handleDeletePeriode(p.periodeId, e)}
                        className="p-1 rounded-lg text-rose-500 hover:bg-rose-500/20 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-black truncate">{p.namaPeriode}</h4>
                    <p
                      className={`text-[10px] font-medium mt-0.5 ${
                        isSelected ? 'text-slate-300' : 'text-slate-500'
                      }`}
                    >
                      Target: {p.targetType}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Question Builder */}
        <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
          {selectedPeriode ? (
            <>
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                    Periode Terpilih
                  </span>
                  <h3 className="text-base font-black text-slate-900 mt-1">
                    {selectedPeriode.namaPeriode}
                  </h3>
                </div>
                <button
                  onClick={handleSaveQuestions}
                  disabled={savingQuestions}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-violet-600 to-pink-600 text-white font-extrabold text-xs shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {savingQuestions ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Simpan Seluruh Pertanyaan</span>
                    </>
                  )}
                </button>
              </div>

              {/* Question Builder */}
              <QuestionBuilder questions={questions} onChange={setQuestions} />
            </>
          ) : (
            <div className="p-12 text-center text-slate-400">
              <Settings className="w-10 h-10 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-600">Pilihlah periode kuesioner di sebelah kiri.</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal Create/Edit Periode */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingPeriode.periodeId ? 'Edit Periode Kuesioner' : 'Buat Periode Kuesioner Baru'}
      >
        <form onSubmit={handleSavePeriodeModal} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Nama Periode Kuesioner</label>
            <input
              type="text"
              value={editingPeriode.namaPeriode || ''}
              onChange={(e) => setEditingPeriode({ ...editingPeriode, namaPeriode: e.target.value })}
              placeholder="Cth: Pemetaan Career Path Q3 2026"
              className="w-full p-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Status Periode</label>
              <select
                value={editingPeriode.status || 'Aktif'}
                onChange={(e) =>
                  setEditingPeriode({ ...editingPeriode, status: e.target.value as StatusPeriode })
                }
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                <option value="Aktif">Aktif</option>
                <option value="Nonaktif">Nonaktif</option>
                <option value="Selesai">Selesai</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Tipe Sasaran Target</label>
              <select
                value={editingPeriode.targetType || 'Semua'}
                onChange={(e) =>
                  setEditingPeriode({ ...editingPeriode, targetType: e.target.value as TargetType })
                }
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                <option value="Semua">Semua Pegawai</option>
                <option value="Tertentu">NIP Pegawai Tertentu</option>
              </select>
            </div>
          </div>

          {editingPeriode.targetType === 'Tertentu' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Daftar NIP Target (pisahkan dengan koma)
              </label>
              <textarea
                rows={3}
                value={targetNipInput}
                onChange={(e) => setTargetNipInput(e.target.value)}
                placeholder="199001012015011001, 198805122012032002"
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          )}

          <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-extrabold text-xs hover:bg-indigo-700 shadow-sm"
            >
              Simpan Periode
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
