import React, { useState } from 'react';
import { BOX_DETAILS, BoxInfo } from '../../lib/recommendations';
import { Sparkles, Info } from 'lucide-react';

interface NineBoxGridProps {
  currentBox: number;
}

// 3x3 Matrix Layout Structure:
// Row 1 (Kinerja Tinggi): Box 9 (Pot.Rendah), Box 6 (Pot.Sedang), Box 3 (Pot.Tinggi)
// Row 2 (Kinerja Sedang): Box 8 (Pot.Rendah), Box 5 (Pot.Sedang), Box 2 (Pot.Tinggi)
// Row 3 (Kinerja Rendah): Box 7 (Pot.Rendah), Box 4 (Pot.Sedang), Box 1 (Pot.Tinggi)
const GRID_MATRIX = [
  [9, 6, 3],
  [8, 5, 2],
  [7, 4, 1],
];

export const NineBoxGrid: React.FC<NineBoxGridProps> = ({ currentBox }) => {
  const [selectedBox, setSelectedBox] = useState<number | null>(currentBox);

  const activeBoxInfo: BoxInfo | undefined = BOX_DETAILS[selectedBox || currentBox];

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-extrabold text-slate-800">Matriks Pemetaan 9-Box Talenta</h3>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-gradient-to-r from-indigo-500 to-pink-500 text-white shadow-xs">
              Sumbu X (Potensi) × Sumbu Y (Kinerja)
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Klik pada kotak matriks untuk melihat detail kategori dan interpretasi hasil pemetaan.
          </p>
        </div>
      </div>

      {/* Grid Container with Axis Labels */}
      <div className="relative">
        {/* Y Axis Label (Sumbu Y - Kinerja) */}
        <div className="absolute -left-7 top-1/2 -translate-y-1/2 -rotate-90 hidden md:flex items-center gap-2 text-[11px] font-extrabold text-slate-500 tracking-wider uppercase">
          <span>Sumbu Y: Kinerja</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:pl-4">
          {GRID_MATRIX.map((row, rowIdx) =>
            row.map((boxNum) => {
              const info = BOX_DETAILS[boxNum];
              const isCurrent = boxNum === currentBox;
              const isSelected = boxNum === selectedBox;

              return (
                <div
                  key={boxNum}
                  onClick={() => setSelectedBox(boxNum)}
                  className={`relative p-4 rounded-2xl border-2 transition-all duration-300 cursor-pointer flex flex-col justify-between min-h-[120px] ${
                    isCurrent
                      ? 'bg-gradient-to-br from-indigo-600 via-violet-600 to-pink-600 text-white border-transparent shadow-lg shadow-indigo-500/30 scale-[1.02] ring-4 ring-indigo-200/60 z-10'
                      : isSelected
                      ? 'bg-slate-900 text-white border-indigo-500 shadow-md ring-2 ring-indigo-400/40'
                      : 'bg-slate-50 hover:bg-slate-100/80 text-slate-800 border-slate-200/80 hover:border-indigo-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-black px-2 py-0.5 rounded-lg ${
                        isCurrent
                          ? 'bg-white/20 text-white'
                          : isSelected
                          ? 'bg-indigo-500 text-white'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      KOTAK {boxNum}
                    </span>
                    {isCurrent && (
                      <span className="flex items-center gap-1 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 shadow-xs animate-pulse">
                        <Sparkles className="w-3 h-3" />
                        Posisi Anda
                      </span>
                    )}
                  </div>

                  <div className="mt-2">
                    <h4
                      className={`text-sm font-extrabold leading-snug ${
                        isCurrent || isSelected ? 'text-white' : 'text-slate-900'
                      }`}
                    >
                      {info.title}
                    </h4>
                    <p
                      className={`text-[11px] font-medium mt-0.5 ${
                        isCurrent ? 'text-indigo-100' : isSelected ? 'text-slate-300' : 'text-slate-500'
                      }`}
                    >
                      {info.subtitle}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* X Axis Label (Sumbu X - Potensi) */}
        <div className="mt-4 text-center hidden md:block">
          <span className="text-[11px] font-extrabold text-slate-500 tracking-wider uppercase">
            Sumbu X: Potensi
          </span>
        </div>
      </div>

      {/* Selected Box Information Banner */}
      {activeBoxInfo && (
        <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 border border-indigo-100/80 flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-black text-sm shrink-0">
            {activeBoxInfo.box}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h5 className="text-sm font-bold text-slate-900">
                Interpretasi Kotak {activeBoxInfo.box}: {activeBoxInfo.title}
              </h5>
              {activeBoxInfo.box === currentBox && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-600 text-white">
                  Posisi Pegawai Aktif
                </span>
              )}
            </div>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Kategori: <strong className="text-indigo-900">{activeBoxInfo.category}</strong> (
              {activeBoxInfo.subtitle}).
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
