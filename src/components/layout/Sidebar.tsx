import React from 'react';
import {
  LayoutDashboard,
  Compass,
  KeyRound,
  UserSearch,
  Database,
  FileCheck2,
  LineChart,
  LogOut,
  X,
  Sparkles,
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
    .join('')
    .substring(0, 2)
    .toUpperCase();

  const handleNav = (path: string) => {
    onNavigate(path);
    onCloseMobile();
  };

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
      {/* Mobile Drawer Overlay */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-xs md:hidden"
        />
      )}

      <aside
        className={`fixed md:static top-0 left-0 bottom-0 z-50 w-72 bg-slate-900 text-slate-100 flex flex-col justify-between border-r border-slate-800/80 transition-transform duration-300 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full overflow-y-auto">
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

          {/* Navigation Links */}
          <div className="px-3 py-2 space-y-6 flex-1">
            {/* Menu Utama */}
            <div>
              <p className="px-3.5 mb-2.5 text-[10px] font-black uppercase tracking-widest text-slate-400">
                Menu Utama
              </p>
              <nav className="space-y-1">
                <button
                  onClick={() => handleNav('/dashboard')}
                  className={navItemClass('/dashboard')}
                >
                  <LayoutDashboard className="w-4 h-4 shrink-0" />
                  <span>Dashboard Talenta</span>
                </button>
                <button
                  onClick={() => handleNav('/career-path')}
                  className={navItemClass('/career-path')}
                >
                  <Compass className="w-4 h-4 shrink-0" />
                  <span>Career Path</span>
                </button>
                <button
                  onClick={() => handleNav('/ganti-password')}
                  className={navItemClass('/ganti-password')}
                >
                  <KeyRound className="w-4 h-4 shrink-0" />
                  <span>Ganti Kata Sandi</span>
                </button>
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
                  <button
                    onClick={() => handleNav('/admin/cari-talenta')}
                    className={navItemClass('/admin/cari-talenta')}
                  >
                    <UserSearch className="w-4 h-4 shrink-0" />
                    <span>Cari Talenta Pegawai</span>
                  </button>
                  <button
                    onClick={() => handleNav('/admin/sinkronisasi')}
                    className={navItemClass('/admin/sinkronisasi')}
                  >
                    <Database className="w-4 h-4 shrink-0" />
                    <span>Sinkronisasi Data</span>
                  </button>
                  <button
                    onClick={() => handleNav('/admin/career-path')}
                    className={navItemClass('/admin/career-path')}
                  >
                    <FileCheck2 className="w-4 h-4 shrink-0" />
                    <span>Kelola Kuesioner</span>
                  </button>
                  <button
                    onClick={() => handleNav('/admin/monitoring')}
                    className={navItemClass('/admin/monitoring')}
                  >
                    <LineChart className="w-4 h-4 shrink-0" />
                    <span>Monitoring Career Path</span>
                  </button>
                </nav>
              </div>
            )}
          </div>

          {/* Footer - Logout Button */}
          <div className="p-3 border-t border-slate-800/80">
            <button
              onClick={onLogout}
              className="w-full flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-extrabold text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 transition-all duration-200 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Keluar Sistem</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
