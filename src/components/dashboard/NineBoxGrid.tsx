import React from 'react';
import { Pegawai } from '../../lib/types';
import { BOX_INFO_MAP } from '../../lib/recommendations';

interface NineBoxGridProps {
  activePegawai?: Pegawai | null;
  allPegawai?: Pegawai[];
  onSelectBox?: (boxNumber: number) => void;
  selectedBoxFilter?: number | null;
}

export const NineBoxGrid: React.FC<NineBoxGridProps> = ({
  activePegawai,
  allPegawai = [],
  onSelectBox,
  selectedBoxFilter,
}) => {
  // Grid layout 3x3:
  // Top Row (Y = High / Kinerja Tinggi): Box 7 (Low X), Box 8 (Med X), Box 9 (High X)
  // Mid Row (Y = Med / Kinerja Sedang): Box 4 (Low X), Box 5 (Med X), Box 6 (High X)
  // Bot Row (Y = Low / Kinerja Rendah): Box 1 (Low X), Box 2 (Med X), Box 3 (High X)
  const gridMatrix = [
    [7, 8, 9],
    [4, 5, 6],
    [1, 2, 3],
  ];

  return (
    <div className="bg-white rounded-2xl p-5 md:p-6 border border-slate-200/80 shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
        <div>
          <h3 className="text-base font-extrabold text-slate-900">Matriks 9-Box Talent Grid</h3>
          <p className="text-xs font-medium text-slate-500">
            Sumbu Y: Kinerja / SKP • Sumbu X: Potensi / Kompetensi
          </p>
        </div>
        {activePegawai && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-indigo-50 text-indigo-700 border border-indigo-200">
            <span className="w-2 h-2 rounded-full bg-indigo-600 animate-ping" />
            Posisi Anda: Box {activePegawai.box}
          </span>
        )}
      </div>

      {/* Grid Canvas */}
      <div className="relative">
        {/* Y Axis Label */}
        <div className="hidden md:flex absolute -left-8 top-1/2 -translate-y-1/2 -rotate-90 text-[11px] font-black uppercase tracking-widest text-slate-400 select-none">
          Kinerja (Sumbu Y) →
        </div>

        <div className="grid grid-cols-3 gap-2 md:gap-3 aspect-4/3 md:aspect-16/10">
          {gridMatrix.flat().map((boxNum) => {
            const info = BOX_INFO_MAP[boxNum];
            const isUserBox = activePegawai?.box === boxNum;
            const isSelected = selectedBoxFilter === boxNum;
            const countInBox = allPegawai.filter((p) => p.box === boxNum).length;

            return (
              <div
                key={boxNum}
                onClick={() => onSelectBox && onSelectBox(boxNum)}
                className={`group relative p-3 md:p-4 rounded-xl md:rounded-2xl border transition-all duration-300 flex flex-col justify-between cursor-pointer overflow-hidden ${
                  isUserBox
                    ? 'ring-3 ring-indigo-600 ring-offset-2 bg-indigo-50/90 border-indigo-300 shadow-md z-10'
                    : isSelected
                    ? 'ring-2 ring-violet-500 bg-violet-50/80 border-violet-300'
                    : `${info.bgLight} ${info.borderColor} hover:shadow-md hover:border-slate-300`
                }`}
              >
                {/* Header Tag */}
                <div className="flex items-start justify-between gap-1">
                  <span className="text-xs md:text-sm font-black text-slate-800">
                    Box {boxNum}
                  </span>
                  {allPegawai.length > 0 && (
                    <span className="text-[10px] md:text-xs font-bold px-2 py-0.5 rounded-full bg-slate-900/10 text-slate-800">
                      {countInBox} Orang
                    </span>
                  )}
                </div>

                {/* Box Title */}
                <div className="my-auto py-1">
                  <p className="text-[11px] md:text-xs font-black text-slate-900 leading-tight">
                    {info.category}
                  </p>
                  <p className="text-[10px] font-medium text-slate-500 line-clamp-2 mt-0.5 hidden sm:block">
                    {info.label.split(':')[1] || info.label}
                  </p>
                </div>

                {/* Status Indicator */}
                {isUserBox && (
                  <div className="mt-1">
                    <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-600 text-white shadow-xs">
                      Posisi Anda
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* X Axis Label */}
        <div className="mt-3 text-center text-[11px] font-black uppercase tracking-widest text-slate-400 select-none">
          Potensi (Sumbu X) →
        </div>
      </div>
    </div>
  );
};
