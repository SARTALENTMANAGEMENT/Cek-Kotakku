import React, { useEffect, useState } from 'react';
import { BarChart3, CheckCircle, XCircle, Users, Download } from 'lucide-react';
import { CareerPathPeriode } from '../lib/types';
import { StatusDonutChart } from '../components/monitoring/StatusDonutChart';
import { UnitBarChart } from '../components/monitoring/UnitBarChart';

export const MonitoringPage: React.FC = () => {
  const [periodes, setPeriodes] = useState<CareerPathPeriode[]>([]);
  const [selectedPeriodeId, setSelectedPeriodeId] = useState('');
  const [loading, setLoading] = useState(true);
  const [dataMonitoring, setDataMonitoring] = useState<any>(null);

  useEffect(() => {
    fetchPeriodes();
  }, []);

  useEffect(() => {
    if (selectedPeriodeId) {
      fetchMonitoring(selectedPeriodeId);
    }
  }, [selectedPeriodeId]);

  const fetchPeriodes = async () => {
    try {
      const res = await fetch('/api/career-path/periode');
      const data = await res.json();
      if (res.ok && data.success && data.data.length > 0) {
        setPeriodes(data.data);
        setSelectedPeriodeId(data.data[0].periodeId);
      } else {
        setLoading(false);
      }
    } catch (err) {
      console.error('Failed to fetch periodes:', err);
      setLoading(false);
    }
  };

  const fetchMonitoring = async (pId: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/career-path/monitoring?periodeId=${pId}`);
      const data = await res.json();
      if (res.ok && data.success) {
        setDataMonitoring(data);
      }
    } catch (err) {
      console.error('Failed to fetch monitoring:', err);
    } finally {
      setLoading(false);
    }
  };

  if (periodes.length === 0) {
    return (
      <div className="p-8 bg-white rounded-2xl border border-slate-200 text-center text-xs font-bold text-slate-400">
        Belum ada periode kuesioner untuk dipantau.
      </div>
    );
  }

  const summary = dataMonitoring?.summary || { totalTarget: 0, totalSudah: 0, totalBelum: 0 };
  const unitDist = dataMonitoring?.unitDistribution || [];
  const tableData: any[] = dataMonitoring?.tableData || [];

  return (
    <div className="space-y-6">
      {/* Top Filter */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-slate-900">Monitoring Pengisian Kuesioner</h3>
            <p className="text-xs text-slate-500">
              Pantau progres partisipasi pegawai secara komprehensif
            </p>
          </div>
        </div>

        <select
          value={selectedPeriodeId}
          onChange={(e) => setSelectedPeriodeId(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold focus:ring-2 focus:ring-indigo-500 outline-none bg-white min-w-[240px]"
        >
          {periodes.map((p) => (
            <option key={p.periodeId} value={p.periodeId}>
              {p.namaPeriode}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="p-8 text-center text-xs font-bold text-slate-400">Memuat data monitoring...</div>
      ) : (
        <>
          {/* Summary Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Target</p>
                <p className="text-2xl font-black text-slate-900">{summary.totalTarget} Pegawai</p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Sudah Mengisi</p>
                <p className="text-2xl font-black text-emerald-600">{summary.totalSudah} Pegawai</p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center font-black">
                <XCircle className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Belum Mengisi</p>
                <p className="text-2xl font-black text-rose-600">{summary.totalBelum} Pegawai</p>
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                Rasio Partisipasi
              </h4>
              <StatusDonutChart sudah={summary.totalSudah} belum={summary.totalBelum} />
            </div>

            <div className="lg:col-span-8 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                Distribusi per Unit Organisasi
              </h4>
              <UnitBarChart data={unitDist} />
            </div>
          </div>

          {/* Tabel Detail Response */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden space-y-4 p-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                Tabel Detail Partisipasi Pegawai ({tableData.length})
              </h4>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-extrabold">
                  <tr>
                    <th className="p-3">Pegawai</th>
                    <th className="p-3">Unit Organisasi</th>
                    <th className="p-3">Jabatan</th>
                    <th className="p-3 text-center">Status</th>
                    <th className="p-3 text-right">Waktu Pengisian</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                  {tableData.map((row) => (
                    <tr key={row.nip} className="hover:bg-slate-50/80">
                      <td className="p-3">
                        <p className="font-extrabold text-slate-900">{row.nama}</p>
                        <p className="text-[10px] text-slate-400 font-mono">NIP: {row.nip}</p>
                      </td>
                      <td className="p-3">{row.unitOrganisasi}</td>
                      <td className="p-3">{row.jabatan}</td>
                      <td className="p-3 text-center">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                            row.status === 'Sudah Mengisi'
                              ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-200'
                              : 'bg-rose-500/10 text-rose-600 border border-rose-200'
                          }`}
                        >
                          {row.status}
                        </span>
                      </td>
                      <td className="p-3 text-right text-slate-500 text-[11px]">
                        {row.diisiPada
                          ? new Date(row.diisiPada).toLocaleString('id-ID')
                          : 'Belum Ada'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
