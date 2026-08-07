/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { JWTPayload, Pegawai } from './lib/types';
import { Sidebar } from './components/layout/Sidebar';
import { Topbar } from './components/layout/Topbar';
import { ToastContainer, ToastMessage } from './components/ui/Toast';

import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { CareerPathPage } from './pages/CareerPathPage';
import { GantiPasswordPage } from './pages/GantiPasswordPage';
import { CariTalentaPage } from './pages/CariTalentaPage';
import { SinkronisasiPage } from './pages/SinkronisasiPage';
import { KelolaKuesionerPage } from './pages/KelolaKuesionerPage';
import { MonitoringPage } from './pages/MonitoringPage';

export default function App() {
  const [user, setUser] = useState<JWTPayload | null>(null);
  const [pegawai, setPegawai] = useState<Pegawai | null>(null);
  const [currentPath, setCurrentPath] = useState<string>('/dashboard');
  const [isOpenMobileSidebar, setIsOpenMobileSidebar] = useState<boolean>(false);

  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [loadingAuth, setLoadingAuth] = useState<boolean>(true);

  // Sync route with browser window.location.pathname
  useEffect(() => {
    checkSession();

    const handlePopState = () => {
      const path = window.location.pathname;
      if (path && path !== '/') {
        setCurrentPath(path);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const checkSession = async () => {
    setLoadingAuth(true);
    try {
      const res = await fetch('/api/auth/me');
      const data = await res.json();
      if (res.ok && data.user) {
        setUser(data.user);
        setPegawai(data.pegawai || null);

        const currentWindowPath = window.location.pathname;
        if (currentWindowPath && currentWindowPath !== '/') {
          setCurrentPath(currentWindowPath);
        } else {
          setCurrentPath('/dashboard');
        }
      } else {
        setUser(null);
        setPegawai(null);
      }
    } catch {
      setUser(null);
      setPegawai(null);
    } finally {
      setLoadingAuth(false);
    }
  };

  const showToast = (type: 'success' | 'error' | 'info', text: string) => {
    const newToast: ToastMessage = {
      id: Date.now().toString(),
      type,
      text,
    };
    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
    }, 4500);
  };

  const handleNavigate = (path: string) => {
    setCurrentPath(path);
    window.history.pushState({}, '', path);
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {
      // Ignore errors
    }
    setUser(null);
    setPegawai(null);
    setCurrentPath('/dashboard');
    window.history.pushState({}, '', '/');
    showToast('info', 'Anda telah keluar dari sistem.');
  };

  if (loadingAuth) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm font-extrabold tracking-wide">Memuat Sistem CEK KOTAKKU...</p>
      </div>
    );
  }

  // If not logged in, render Login Page
  if (!user) {
    return (
      <LoginPage
        onLoginSuccess={(loggedUser, loggedPegawai) => {
          setUser(loggedUser);
          setPegawai(loggedPegawai);
          handleNavigate('/dashboard');
          showToast('success', `Selamat datang kembali, ${loggedUser.nama || loggedUser.nip}!`);
        }}
      />
    );
  }

  const renderActivePage = () => {
    switch (currentPath) {
      case '/dashboard':
        return <DashboardPage pegawai={pegawai} user={user} />;
      case '/career-path':
        return <CareerPathPage user={user} onShowToast={showToast} />;
      case '/ganti-password':
        return <GantiPasswordPage onShowToast={showToast} />;
      case '/admin/cari-talenta':
        return <CariTalentaPage onShowToast={showToast} />;
      case '/admin/sinkronisasi':
        return <SinkronisasiPage onShowToast={showToast} />;
      case '/admin/career-path':
        return <KelolaKuesionerPage onShowToast={showToast} />;
      case '/admin/monitoring':
        return <MonitoringPage onShowToast={showToast} />;
      default:
        return <DashboardPage pegawai={pegawai} user={user} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex text-slate-800 font-sans antialiased relative overflow-hidden">
      {/* Decorative High Density Background Glows */}
      <div className="fixed top-[-100px] right-[-100px] w-96 h-96 bg-indigo-500/5 blur-[100px] pointer-events-none rounded-full" />
      <div className="fixed bottom-[-100px] left-[-100px] w-96 h-96 bg-pink-500/5 blur-[100px] pointer-events-none rounded-full" />

      {/* Sidebar */}
      <Sidebar
        currentPath={currentPath}
        onNavigate={handleNavigate}
        user={user}
        onLogout={handleLogout}
        isOpenMobile={isOpenMobileSidebar}
        onCloseMobile={() => setIsOpenMobileSidebar(false)}
      />

      {/* Main Content Viewport */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen z-10">
        <Topbar
          currentPath={currentPath}
          onToggleMobileSidebar={() => setIsOpenMobileSidebar(!isOpenMobileSidebar)}
          user={user}
        />

        <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">{renderActivePage()}</main>

        {/* High Density Footer Status Bar */}
        <footer className="h-8 bg-white/80 backdrop-blur-xs border-t border-slate-200/80 px-6 flex items-center justify-between text-[11px] font-medium text-slate-500 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-semibold text-slate-600">Sistem Aktif - Database Firestore Linked</span>
          </div>
          <div className="text-slate-400 font-bold hidden sm:block">CEK KOTAKKU v2.0 - High Density Edition</div>
        </footer>
      </div>

      {/* Global Toast Notification Container */}
      <ToastContainer toasts={toasts} onDismiss={(id) => setToasts((t) => t.filter((item) => item.id !== id))} />
    </div>
  );
}
