import React from 'react';
import {
  Sparkles,
  LayoutDashboard,
  Search,
  Compass,
  FileQuestion,
  BarChart3,
  RefreshCw,
  KeyRound,
  LogOut,
  X,
} from 'lucide-react';
import { JWTPayload } from '../../lib/types';

interface SidebarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  user: JWTPayload | null;
  onLogout: () => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPath,
  onNavigate,
  user,
  onLogout,
  isOpenMobile,
  onCloseMobile,
}) => {
  const isUserAdmin = user?.role === 'admin';

  const userInitials = (user?.nama || user?.nip || 'U')
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const navItemClass = (path: string) => {
    const active = currentPath === path;
    return `group flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
      active
        ? 'bg-gradient-to-r from-indigo-600 via-violet-600 to-pink-600 text-white shadow-lg shadow-indigo-500/20 font-extrabold'
        : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
    }`;
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-xs md:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-50 h-screen w-64 bg-slate-900 border-r border-slate-800/80 flex flex-col transition-transform duration-300 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Header Brand */}
        <div className="p-5 flex items-center justify-between border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 via-violet-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-black text-base text-white tracking-tight leading-none">
                CEK KOTAKKU
              </h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                Talenta Pegawai v2.0
              </p>
            </div>
          </div>
          <button
            onClick={onCloseMobile}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 md:hidden transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Profile Card */}
        <div className="p-4 mx-3 my-3 rounded-2xl bg-slate-800/50 border border-white/5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-pink-500 text-white font-black flex items-center justify-center text-xs shadow-md shrink-0">
            {userInitials}
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-black text-white truncate">{user?.nama || user?.nip}</p>
            <p className="text-[10px] font-semibold text-slate-400 truncate">NIP: {user?.nip}</p>
            <span className="inline-block mt-1 px-2 py-0.5 text-[9px] font-black tracking-wider uppercase rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              {user?.role === 'admin' ? 'ADMINISTRATOR' : 'PEGAWAI'}
            </span>
          </div>
        </div>

        {/* Navigation Sections */}
        <div className="px-3 py-2 space-y-6 flex-1 overflow-y-auto">
          {/* Menu Utama */}
          <div>
            <p className="px-3.5 mb-2.5 text-[10px] font-black uppercase tracking-widest text-slate-400">
              Menu Utama
            </p>
            <nav className="space-y-1">
              <div
                onClick={() => {
                  onNavigate('/');
                  onCloseMobile();
                }}
                className={navItemClass('/')}
              >
                <LayoutDashboard className="w-4 h-4 shrink-0" />
                <span>Kotak Talenta Saya</span>
              </div>

              {isUserAdmin && (
                <div
                  onClick={() => {
                    onNavigate('/cari-talenta');
                    onCloseMobile();
                  }}
                  className={navItemClass('/cari-talenta')}
                >
                  <Search className="w-4 h-4 shrink-0" />
                  <span>Cari & Matriks Talenta</span>
                </div>
              )}

              <div
                onClick={() => {
                  onNavigate('/career-path');
                  onCloseMobile();
                }}
                className={navItemClass('/career-path')}
              >
                <Compass className="w-4 h-4 shrink-0" />
                <span>Kuesioner Career Path</span>
              </div>
            </nav>
          </div>

          {/* Section Administrasi (Khusus Admin) */}
          {isUserAdmin && (
            <div>
              <div className="px-3.5 mb-2.5 flex items-center justify-between">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Administrasi
                </p>
                <span className="px-1.5 py-0.5 text-[8px] font-black rounded bg-pink-500/20 text-pink-300 border border-pink-500/30">
                  ADMIN
                </span>
              </div>
              <nav className="space-y-1">
                <div
                  onClick={() => {
                    onNavigate('/kelola-kuesioner');
                    onCloseMobile();
                  }}
                  className={navItemClass('/kelola-kuesioner')}
                >
                  <FileQuestion className="w-4 h-4 shrink-0" />
                  <span>Kelola Kuesioner</span>
                </div>

                <div
                  onClick={() => {
                    onNavigate('/monitoring');
                    onCloseMobile();
                  }}
                  className={navItemClass('/monitoring')}
                >
                  <BarChart3 className="w-4 h-4 shrink-0" />
                  <span>Monitoring Pengisian</span>
                </div>

                <div
                  onClick={() => {
                    onNavigate('/sinkronisasi');
                    onCloseMobile();
                  }}
                  className={navItemClass('/sinkronisasi')}
                >
                  <RefreshCw className="w-4 h-4 shrink-0" />
                  <span>Sinkron Excel Talent</span>
                </div>
              </nav>
            </div>
          )}

          {/* Pengaturan Akun */}
          <div>
            <p className="px-3.5 mb-2.5 text-[10px] font-black uppercase tracking-widest text-slate-400">
              Pengaturan
            </p>
            <nav className="space-y-1">
              <div
                onClick={() => {
                  onNavigate('/ganti-password');
                  onCloseMobile();
                }}
                className={navItemClass('/ganti-password')}
              >
                <KeyRound className="w-4 h-4 shrink-0" />
                <span>Ubah Kata Sandi</span>
              </div>
            </nav>
          </div>
        </div>

        {/* Footer Logout */}
        <div className="p-3 border-t border-slate-800/80">
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-extrabold text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 transition-all duration-200 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Keluar Sistem</span>
          </button>
        </div>
      </aside>
    </>
  );
};
