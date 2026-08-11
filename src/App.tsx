import React, { useEffect, useState } from 'react';
import { JWTPayload, Pegawai } from './lib/types';
import { Sidebar } from './components/layout/Sidebar';
import { Topbar } from './components/layout/Topbar';
import { Toast, ToastMessage } from './components/ui/Toast';

import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { CariTalentaPage } from './pages/CariTalentaPage';
import { CareerPathPage } from './pages/CareerPathPage';
import { KelolaKuesionerPage } from './pages/KelolaKuesionerPage';
import { MonitoringPage } from './pages/MonitoringPage';
import { SinkronisasiPage } from './pages/SinkronisasiPage';
import { GantiPasswordPage } from './pages/GantiPasswordPage';

export default function App() {
  const [user, setUser] = useState<JWTPayload | null>(null);
  const [pegawai, setPegawai] = useState<Pegawai | null>(null);
  const [isAuthChecking, setIsAuthChecking] = useState(true);

  const [currentPath, setCurrentPath] = useState('/');
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const [isOpenMobileSidebar, setIsOpenMobileSidebar] = useState(false);

  useEffect(() => {
    checkAuthSession();
  }, []);

  const checkAuthSession = async () => {
    setIsAuthChecking(true);
    try {
      const res = await fetch('/api/auth/me');
      const data = await res.json();
      if (res.ok && data.success && data.user) {
        setUser(data.user);
        setPegawai(data.pegawai || null);
      } else {
        setUser(null);
        setPegawai(null);
      }
    } catch (err) {
      setUser(null);
      setPegawai(null);
    } finally {
      setIsAuthChecking(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (err) {
      console.error('Logout error:', err);
    }
    setUser(null);
    setPegawai(null);
    setCurrentPath('/');
    showToast({ type: 'success', text: 'Anda telah berhasil keluar dari sistem.' });
  };

  const showToast = (msg: ToastMessage) => {
    setToast(msg);
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  if (isAuthChecking) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white space-y-4">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-bold tracking-wider uppercase text-slate-400">
          Memuat Sistem CEK KOTAKKU...
        </p>
      </div>
    );
  }

  if (!user) {
    return <LoginPage onLoginSuccess={checkAuthSession} />;
  }

  const renderContent = () => {
    switch (currentPath) {
      case '/':
        return (
          <DashboardPage
            user={user}
            pegawai={pegawai}
            onNavigate={(path) => setCurrentPath(path)}
          />
        );
      case '/cari-talenta':
        return user.role === 'admin' ? (
          <CariTalentaPage />
        ) : (
          <DashboardPage
            user={user}
            pegawai={pegawai}
            onNavigate={(path) => setCurrentPath(path)}
          />
        );
      case '/career-path':
        return <CareerPathPage user={user} onShowToast={showToast} />;
      case '/kelola-kuesioner':
        return user.role === 'admin' ? (
          <KelolaKuesionerPage onShowToast={showToast} />
        ) : (
          <DashboardPage
            user={user}
            pegawai={pegawai}
            onNavigate={(path) => setCurrentPath(path)}
          />
        );
      case '/monitoring':
        return user.role === 'admin' ? (
          <MonitoringPage />
        ) : (
          <DashboardPage
            user={user}
            pegawai={pegawai}
            onNavigate={(path) => setCurrentPath(path)}
          />
        );
      case '/sinkronisasi':
        return user.role === 'admin' ? (
          <SinkronisasiPage onShowToast={showToast} />
        ) : (
          <DashboardPage
            user={user}
            pegawai={pegawai}
            onNavigate={(path) => setCurrentPath(path)}
          />
        );
      case '/ganti-password':
        return <GantiPasswordPage onShowToast={showToast} />;
      default:
        return (
          <DashboardPage
            user={user}
            pegawai={pegawai}
            onNavigate={(path) => setCurrentPath(path)}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans antialiased">
      {/* Sidebar Navigation */}
      <Sidebar
        currentPath={currentPath}
        onNavigate={(path) => setCurrentPath(path)}
        user={user}
        onLogout={handleLogout}
        isOpenMobile={isOpenMobileSidebar}
        onCloseMobile={() => setIsOpenMobileSidebar(false)}
      />

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar
          currentPath={currentPath}
          onToggleMobileSidebar={() => setIsOpenMobileSidebar(!isOpenMobileSidebar)}
          user={user}
        />

        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto">
          {renderContent()}
        </main>
      </div>

      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
