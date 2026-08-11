import React, { useEffect, useState } from 'react';
import { Search, Filter, User, Building, Eye, ChevronRight } from 'lucide-react';
import { Pegawai } from '../lib/types';
import { NineBoxGrid } from '../components/dashboard/NineBoxGrid';
import { Modal } from '../components/ui/Modal';
import { BOX_INFO_MAP } from '../lib/recommendations';

export const CariTalentaPage: React.FC = () => {
  const [pegawaiList, setPegawaiList] = useState<Pegawai[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [unitFilter, setUnitFilter] = useState('');
  const [selectedBoxFilter, setSelectedBoxFilter] = useState<number | null>(null);
  const [selectedPegawai, setSelectedPegawai] = useState<Pegawai | null>(null);

  useEffect(() => {
    fetchPegawai();
  }, []);

  const fetchPegawai = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/pegawai');
      const data = await res.json();
      if (res.ok && data.success) {
        setPegawaiList(data.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch pegawai:', err);
    } finally {
      setLoading(false);
    }
  };

  const units = Array.from(new Set(pegawaiList.map((p) => p.unitOrganisasi).filter(Boolean)));

  const filteredList = pegawaiList.filter((p) => {
    const matchSearch =
      p.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.nip.includes(searchTerm) ||
      p.jabatan.toLowerCase().includes(searchTerm.toLowerCase());
    const matchUnit = !unitFilter || p.unitOrganisasi === unitFilter;
    const matchBox = selectedBoxFilter === null || p.box === selectedBoxFilter;
    return matchSearch && matchUnit && matchBox;
  });

  return (
    <div className="space-y-6">
      {/* Top Matrix Overview */}
      <NineBoxGrid
        allPegawai={pegawaiList}
        selectedBoxFilter={selectedBoxFilter}
        onSelectBox={(box) => {
          if (selectedBoxFilter === box) {
            setSelectedBoxFilter(null);
          } else {
            setSelectedBoxFilter(box);
          }
        }}
      />

      {/* Filter and Search Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-80">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Cari berdasarkan Nama, NIP, Jabatan..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400" />
              <select
                value={unitFilter}
                onChange={(e) => setUnitFilter(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
              >
                <option value="">Semua Unit Kerja</option>
                {units.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
            </div>

            {selectedBoxFilter !== null && (
              <button
                onClick={() => setSelectedBoxFilter(null)}
                className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
              >
                Reset Filter Box #{selectedBoxFilter}
              </button>
            )}
          </div>
        </div>

        {/* Status Count Summary */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs font-semibold text-slate-500">
          <span>
            Menampilkan <strong className="text-slate-900">{filteredList.length}</strong> dari{' '}
            <strong className="text-slate-900">{pegawaiList.length}</strong> Pegawai
          </span>
          {selectedBoxFilter !== null && (
            <span className="text-indigo-600 font-bold">
              Filter Terpasang: Box #{selectedBoxFilter} ({BOX_INFO_MAP[selectedBoxFilter]?.category})
            </span>
          )}
        </div>
      </div>

      {/* Directory Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-xs font-bold text-slate-400">Loading data pegawai...</div>
        ) : filteredList.length === 0 ? (
          <div className="p-8 text-center text-xs font-bold text-slate-400">
            Tidak ada pegawai yang sesuai kriteria pencarian.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-extrabold">
                <tr>
                  <th className="p-4">Pegawai</th>
                  <th className="p-4">Jabatan & Unit</th>
                  <th className="p-4 text-center">Skor X (Potensi)</th>
                  <th className="p-4 text-center">Skor Y (Kinerja)</th>
                  <th className="p-4 text-center">Talent Box</th>
                  <th className="p-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                {filteredList.map((p) => {
                  const box = BOX_INFO_MAP[p.box] || BOX_INFO_MAP[5];
                  return (
                    <tr key={p.nip} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 font-black flex items-center justify-center shrink-0">
                            <User className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="font-extrabold text-slate-900">{p.nama}</p>
                            <p className="text-[10px] text-slate-400 font-mono">NIP: {p.nip}</p>
                          </div>
                        </div>
                      </td>

                      <td className="p-4">
                        <p className="font-bold text-slate-800">{p.jabatan}</p>
                        <p className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                          <Building className="w-3 h-3" />
                          <span>{p.unitOrganisasi}</span>
                        </p>
                      </td>

                      <td className="p-4 text-center font-black text-indigo-600 text-sm">
                        {p.nilaiX}
                      </td>

                      <td className="p-4 text-center font-black text-pink-600 text-sm">
                        {p.nilaiY}
                      </td>

                      <td className="p-4 text-center">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-black border ${box.badgeColor}`}
                        >
                          Box {p.box}: {box.category}
                        </span>
                      </td>

                      <td className="p-4 text-right">
                        <button
                          onClick={() => setSelectedPegawai(p)}
                          className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs inline-flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Detail</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail Pegawai Modal */}
      {selectedPegawai && (
        <Modal
          isOpen={!!selectedPegawai}
          onClose={() => setSelectedPegawai(null)}
          title={`Detail Pemetaan Talenta: ${selectedPegawai.nama}`}
        >
          <div className="space-y-5">
            <div className="p-4 rounded-2xl bg-slate-900 text-white flex items-center justify-between">
              <div>
                <p className="text-base font-black">{selectedPegawai.nama}</p>
                <p className="text-xs text-slate-300">NIP: {selectedPegawai.nip}</p>
                <p className="text-xs text-indigo-300 font-semibold mt-1">
                  {selectedPegawai.jabatan} • {selectedPegawai.unitOrganisasi}
                </p>
              </div>
              <div className="text-right">
                <span className="px-3 py-1 rounded-full bg-indigo-500 text-white font-black text-xs">
                  Box #{selectedPegawai.box}
                </span>
                <p className="text-[10px] text-slate-400 mt-1">
                  X: {selectedPegawai.nilaiX} | Y: {selectedPegawai.nilaiY}
                </p>
              </div>
            </div>

            {/* Recommendations */}
            {(() => {
              const info = BOX_INFO_MAP[selectedPegawai.box] || BOX_INFO_MAP[5];
              return (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-100">
                    <h4 className="text-xs font-black text-indigo-900 uppercase tracking-wider mb-2">
                      Rekomendasi Pengembangan:
                    </h4>
                    <ul className="space-y-1.5">
                      {info.rekomendasiPengembangan.map((item, idx) => (
                        <li key={idx} className="text-xs font-semibold text-indigo-950 flex items-start gap-2">
                          <ChevronRight className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 rounded-xl bg-pink-50 border border-pink-100">
                    <h4 className="text-xs font-black text-pink-900 uppercase tracking-wider mb-2">
                      Rekomendasi Karir & Suksesi:
                    </h4>
                    <ul className="space-y-1.5">
                      {info.rekomendasiKarir.map((item, idx) => (
                        <li key={idx} className="text-xs font-semibold text-pink-950 flex items-start gap-2">
                          <ChevronRight className="w-3.5 h-3.5 text-pink-600 shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })()}
          </div>
        </Modal>
      )}
    </div>
  );
};
