import React from 'react';
import { Menu, Sparkles } from 'lucide-react';
import { JWTPayload } from '../../lib/types';

interface TopbarProps {
  currentPath: string;
  onToggleMobileSidebar: () => void;
  user: JWTPayload | null;
}

const PAGE_METADATA: Record<string, { title: string; subtitle: string }> = {
  '/dashboard': {
    title: 'Dashboard Pemetaan Talenta',
    subtitle: 'Ringkasan posisi 9-box matrix, komponen skor, dan rekomendasi karir',
  },
  '/career-path': {
    title: 'Career Path Pegawai',
    subtitle: 'Daftar dan pengisian kuesioner pemetaan jalur karir & aspirasi',
  },
  '/ganti-password': {
    title: 'Ganti Kata Sandi',
    subtitle: 'Pembaruan kata sandi akun secara aman',
  },
  '/admin/cari-talenta': {
    title: 'Pencarian Talenta Pegawai',
    subtitle: 'Cari dan tinjau hasil pemetaan 9-box pegawai berdasarkan NIP',
  },
  '/admin/sinkronisasi': {
    title: 'Sinkronisasi Data Talenta',
    subtitle: 'Upload file Excel (.xls/.xlsx) untuk mereset dan menyinkronkan data master pegawai',
  },
  '/admin/career-path': {
    title: 'Kelola Kuesioner Career Path',
    subtitle: 'Pengaturan periode kuesioner dan penyusunan daftar pertanyaan dinamis',
  },
  '/admin/monitoring': {
    title: 'Monitoring Career Path',
    subtitle: 'Pantau rekapitulasi, grafik pengisian, dan unduh hasil kuesioner ke Excel',
  },
};

export const Topbar: React.FC<TopbarProps> = ({ currentPath, onToggleMobileSidebar, user }) => {
  const meta = PAGE_METADATA[currentPath] || {
    title: 'Sistem Manajemen Talenta',
    subtitle: 'Aplikasi CEK KOTAKKU Pemetaan Talenta Pegawai',
  };

  const userInitials = (user?.nama || user?.nip || 'U')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  return (
    <header className="sticky top-0 z-30 h-20 bg-white/80 backdrop-blur-md border-b border-slate-200/80 px-4 md:px-8 flex items-center justify-between shadow-xs">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileSidebar}
          className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 md:hidden transition-colors cursor-pointer"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-base md:text-lg font-black text-slate-900 tracking-tight leading-snug">
            {meta.title}
          </h2>
          <p className="text-xs font-medium italic text-slate-500 hidden sm:block">{meta.subtitle}</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100/80">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse" />
          <span className="text-[11px] font-black text-indigo-700 uppercase tracking-wider">
            Periode Aktif 2026
          </span>
        </div>

        <div className="flex items-center gap-3 pl-2 border-l border-slate-200/60">
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-xs font-extrabold text-slate-800 truncate max-w-[180px]">
              {user?.nama || user?.nip}
            </span>
            <span className="text-[10px] font-semibold text-slate-400">NIP: {user?.nip}</span>
          </div>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-pink-600 text-white font-black flex items-center justify-center text-xs shadow-md shadow-indigo-500/20 ring-2 ring-indigo-100">
            {userInitials}
          </div>
        </div>
      </div>
    </header>
  );
};
