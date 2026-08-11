import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Download,
  CheckCircle2,
  XCircle,
  Users,
  Eye,
  FileSpreadsheet,
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { CareerPathPeriode, CareerPathPertanyaan } from '../lib/types';
import { StatusDonutChart } from '../components/monitoring/StatusDonutChart';
import { UnitBarChart } from '../components/monitoring/UnitBarChart';
import { Modal } from '../components/ui/Modal';

interface MonitoringPageProps {
  onShowToast: (type: 'success' | 'error' | 'info', text: string) => void;
}

export const MonitoringPage: React.FC<MonitoringPageProps> = ({ onShowToast }) => {
  const [periodes, setPeriodes] = useState<CareerPathPeriode[]>([]);
  const [selectedPeriodeId, setSelectedPeriodeId] = useState<string>('');
  const [questions, setQuestions] = useState<CareerPathPertanyaan[]>([]);

  const [summary, setSummary] = useState({ totalTarget: 0, totalSudah: 0, totalBelum: 0 });
  const [unitDist, setUnitDist] = useState<Array<{ unit: string; total: number; sudah: number; belum: number }>>([]);
  const [tableData, setTableData] = useState<any[]>([]);

  const [selectedAnswerModal, setSelectedAnswerModal] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPeriodes();
  }, []);

  useEffect(() => {
    if (selectedPeriodeId) {
      fetchMonitoringData(selectedPeriodeId);
    }
  }, [selectedPeriodeId]);

  const fetchPeriodes = async () => {
    try {
      const res = await fetch('/api/career-path/periode');
      const data = await res.json();
      if (res.ok && data.data && data.data.length > 0) {
        setPeriodes(data.data);
        setSelectedPeriodeId(data.data[0].periodeId);
      }
    } catch (err) {
      onShowToast('error', 'Gagal memuat daftar periode.');
    }
  };

  const fetchMonitoringData = async (periodeId: string) => {
    setLoading(true);
    try {
      // Fetch Questions for Excel export columns
      const qRes = await fetch(`/api/career-path/periode/${periodeId}/pertanyaan`);
      const qData = await qRes.json();
      setQuestions(qData.data || []);

      // Fetch monitoring statistics
      const res = await fetch(`/api/career-path/monitoring?periodeId=${periodeId}`);
      const data = await res.json();

      if (res.ok) {
        setSummary(data.summary);
        setUnitDist(data.unitDistribution);
        setTableData(data.tableData);
      }
    } catch (err) {
      onShowToast('error', 'Gagal memuat data monitoring.');
    } finally {
      setLoading(false);
    }
  };

  const handleExportExcel = () => {
    if (tableData.length === 0) return;

    // Prepare rows for Excel export
    const excelRows = tableData.map((row) => {
      const baseRow: Record<string, any> = {
        NIP: row.nip,
        Nama: row.nama,
        'Unit Organisasi': row.unitOrganisasi,
        Jabatan: row.jabatan,
        Status: row.status,
        'Waktu Pengisian': row.diisiPada ? new Date(row.diisiPada).toLocaleString('id-ID') : '-',
      };

      // Add each question answer as a separate column
      questions.forEach((q, idx) => {
        const colTitle = `Q${idx + 1}: ${q.teksPertanyaan}`;
        const ansVal = row.jawaban ? row.jawaban[idx.toString()] : '-';
        baseRow[colTitle] = Array.isArray(ansVal) ? ansVal.join(', ') : ansVal || '-';
      });

      return baseRow;
    });

    const worksheet = XLSX.utils.json_to_sheet(excelRows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Hasil Career Path');

    const fileName = `Monitoring_CareerPath_${selectedPeriodeId}.xlsx`;
    XLSX.writeFile(workbook, fileName);

    onShowToast('success', `File Excel ${fileName} berhasil diunduh!`);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Periode Selector */}
      <div className="p-6 md:p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
            <LineChart className="w-6 h-6 text-indigo-600" />
            Monitoring Pengisian Career Path
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Pantau partisipasi pengisian kuesioner, distribusi unit kerja, dan unduh rekapan ke Excel.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedPeriodeId}
            onChange={(e) => setSelectedPeriodeId(e.target.value)}
            className="p-3 rounded-xl border border-slate-200 text-xs font-bold bg-white text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          >
            {periodes.map((p) => (
              <option key={p.periodeId} value={p.periodeId}>
                {p.namaPeriode}
              </option>
            ))}
          </select>

          <button
            onClick={handleExportExcel}
            disabled={tableData.length === 0}
            className="px-4 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md transition-all flex items-center gap-2 shrink-0 cursor-pointer disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>Export Excel</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-indigo-50 text-indigo-600">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-extrabold text-slate-400 uppercase">Total Target Pegawai</p>
            <p className="text-2xl font-black text-slate-900">{summary.totalTarget}</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-emerald-50 text-emerald-600">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-extrabold text-slate-400 uppercase">Sudah Mengisi</p>
            <p className="text-2xl font-black text-emerald-600">{summary.totalSudah}</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-rose-50 text-rose-600">
            <XCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-extrabold text-slate-400 uppercase">Belum Mengisi</p>
            <p className="text-2xl font-black text-rose-600">{summary.totalBelum}</p>
          </div>
        </div>
      </div>

      {/* Interactive Recharts Graphics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StatusDonutChart sudahCount={summary.totalSudah} belumCount={summary.totalBelum} />
        <UnitBarChart data={unitDist} />
      </div>

      {/* Table of Employee Status */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-sm font-extrabold text-slate-800">Daftar Status Pengisian Pegawai</h3>
          <span className="text-xs font-bold text-slate-500">
            Total {tableData.length} Pegawai
          </span>
        </div>

        <div className="overflow-x-auto border border-slate-200 rounded-2xl">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-900 text-white font-bold">
              <tr>
                <th className="p-3.5">NIP</th>
                <th className="p-3.5">Nama Pegawai</th>
                <th className="p-3.5">Unit Organisasi</th>
                <th className="p-3.5">Status Pengisian</th>
                <th className="p-3.5">Waktu Pengisian</th>
                <th className="p-3.5 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-medium bg-white">
              {tableData.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50">
                  <td className="p-3.5 font-bold text-slate-900">{row.nip}</td>
                  <td className="p-3.5 font-bold">{row.nama}</td>
                  <td className="p-3.5">{row.unitOrganisasi}</td>
                  <td className="p-3.5">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold ${
                        row.status === 'Sudah Mengisi'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}
                    >
                      {row.status === 'Sudah Mengisi' ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <XCircle className="w-3.5 h-3.5 text-rose-600" />
                      )}
                      {row.status}
                    </span>
                  </td>
                  <td className="p-3.5 text-slate-500">
                    {row.diisiPada ? new Date(row.diisiPada).toLocaleString('id-ID') : '-'}
                  </td>
                  <td className="p-3.5 text-center">
                    {row.status === 'Sudah Mengisi' && (
                      <button
                        onClick={() => setSelectedAnswerModal(row)}
                        className="px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center gap-1 mx-auto transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Lihat Jawaban</span>
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Answer Detail Modal */}
      {selectedAnswerModal && (
        <Modal
          isOpen={!!selectedAnswerModal}
          onClose={() => setSelectedAnswerModal(null)}
          title={`Detail Jawaban: ${selectedAnswerModal.nama}`}
          subtitle={`NIP: ${selectedAnswerModal.nip} | Unit: ${selectedAnswerModal.unitOrganisasi}`}
          maxWidth="2xl"
        >
          <div className="space-y-4">
            {questions.map((q, idx) => {
              const ansVal = selectedAnswerModal.jawaban
                ? selectedAnswerModal.jawaban[idx.toString()]
                : '-';
              const displayVal = Array.isArray(ansVal) ? ansVal.join(', ') : ansVal || '-';

              return (
                <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
                  <p className="text-xs font-extrabold text-slate-800">
                    <span className="text-indigo-600 mr-1">{idx + 1}.</span>
                    {q.teksPertanyaan}
                  </p>
                  <div className="mt-2 p-3 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-700">
                    {displayVal}
                  </div>
                </div>
              );
            })}
          </div>
        </Modal>
      )}
    </div>
  );
};
