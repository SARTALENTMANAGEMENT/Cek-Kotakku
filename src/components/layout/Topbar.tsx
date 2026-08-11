import React from 'react';
import { Menu } from 'lucide-react';
import { JWTPayload } from '../../lib/types';

interface TopbarProps {
  currentPath: string;
  onToggleMobileSidebar: () => void;
  user: JWTPayload | null;
}

export const Topbar: React.FC<TopbarProps> = ({
  currentPath,
  onToggleMobileSidebar,
  user,
}) => {
  const getPageMeta = () => {
    switch (currentPath) {
      case '/':
        return {
          title: 'Hasil Pemetaan Talenta Pegawai',
          subtitle: 'Visualisasi posisi 9-Box Grid dan rekomendasi pengembangan karir',
        };
      case '/cari-talenta':
        return {
          title: 'Matriks & Pencarian Talenta',
          subtitle: 'Direktori master pegawai dan pemetaan 9-box organisasi',
        };
      case '/career-path':
        return {
          title: 'Kuesioner Career Path',
          subtitle: 'Pengisian pemetaan minat, aspirasi, dan rencana karir',
        };
      case '/kelola-kuesioner':
        return {
          title: 'Kelola Periode & Pertanyaan',
          subtitle: 'Pusat pengaturan instrumen kuesioner career path pegawai',
        };
      case '/monitoring':
        return {
          title: 'Monitoring & Rekapitulasi Pengisian',
          subtitle: 'Pantau progres pengisian kuesioner per unit organisasi',
        };
      case '/sinkronisasi':
        return {
          title: 'Sinkronisasi Data Excel Talent',
          subtitle: 'Impor & perbarui skor pemetaan 9-box pegawai dari file Excel',
        };
      case '/ganti-password':
        return {
          title: 'Pengaturan Kata Sandi',
          subtitle: 'Perbarui kata sandi keamanan akun Anda',
        };
      default:
        return {
          title: 'CEK KOTAKKU',
          subtitle: 'Sistem Manajemen Talenta & Pemetaan Karir Pegawai',
        };
    }
  };

  const meta = getPageMeta();

  const userInitials = (user?.nama || user?.nip || 'U')
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
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
