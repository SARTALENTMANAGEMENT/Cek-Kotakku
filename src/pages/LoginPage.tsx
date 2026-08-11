import React, { useState } from 'react';
import { Sparkles, KeyRound, User, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { JWTPayload, Pegawai } from '../lib/types';

interface LoginPageProps {
  onLoginSuccess: (user: JWTPayload, pegawai: Pegawai | null) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [nip, setNip] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nip || !password) {
      setErrorMsg('NIP dan Kata Sandi wajib diisi.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nip: nip.trim(), password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || 'Gagal masuk ke dalam sistem.');
        setLoading(false);
        return;
      }

      onLoginSuccess(data.user, data.pegawai);
    } catch (err: any) {
      setErrorMsg('Gagal terhubung ke server. Periksa koneksi Anda.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decorative Gradients */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-indigo-600/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-pink-600/20 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10 animate-scale-up">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-500 via-violet-500 to-pink-500 shadow-xl shadow-indigo-500/20 mb-4">
            <Sparkles className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">CEK KOTAKKU</h1>
          <p className="text-xs font-semibold text-slate-400 mt-1">
            Sistem Manajemen & Pemetaan Talenta Pegawai
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-7 shadow-2xl backdrop-blur-md">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-white">Masuk Sistem</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Gunakan NIP dan kata sandi Anda untuk mengakses portal.
            </p>
          </div>

          {errorMsg && (
            <div className="mb-5 p-4 rounded-2xl bg-rose-950/80 border border-rose-500/40 text-rose-200 text-xs font-medium leading-relaxed animate-shake">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Input NIP */}
            <div>
              <label className="block text-xs font-extrabold text-slate-300 mb-1.5 uppercase tracking-wider">
                NIP Pegawai / Username Admin
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={nip}
                  onChange={(e) => setNip(e.target.value)}
                  placeholder="Masukkan NIP (cth: 199001012015011001)"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-800/80 border border-slate-700/80 text-white text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none placeholder-slate-500 transition-all"
                />
              </div>
            </div>

            {/* Input Password */}
            <div>
              <label className="block text-xs font-extrabold text-slate-300 mb-1.5 uppercase tracking-wider">
                Kata Sandi
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan kata sandi"
                  className="w-full pl-10 pr-11 py-3 rounded-xl bg-slate-800/80 border border-slate-700/80 text-white text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none placeholder-slate-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-1.5 text-slate-400 hover:text-white absolute right-3 top-1/2 -translate-y-1/2 rounded-lg"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3.5 px-5 rounded-xl bg-gradient-to-r from-indigo-600 via-violet-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-extrabold text-sm shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Masuk Akun</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Login Preset Helper */}
          <div className="mt-6 pt-5 border-t border-slate-800/80">
            <p className="text-[11px] font-bold text-slate-400 mb-2">Akses Demo Cepat:</p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setNip('admin');
                  setPassword('admin123');
                }}
                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700/80 text-xs font-semibold text-indigo-300 border border-slate-700 text-left truncate transition-colors"
              >
                <strong>Admin:</strong> admin / admin123
              </button>
              <button
                type="button"
                onClick={() => {
                  setNip('199001012015011001');
                  setPassword('pegawai123');
                }}
                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700/80 text-xs font-semibold text-pink-300 border border-slate-700 text-left truncate transition-colors"
              >
                <strong>Pegawai:</strong> 199001... / pegawai123
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
