import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import {
  getUser,
  saveUser,
  getPegawai,
  getAllPegawai,
  syncPegawaiList,
  getPeriodes,
  getPeriodeById,
  savePeriode,
  deletePeriode,
  getPertanyaan,
  savePertanyaan,
  getJawabanUser,
  getAllJawaban,
  saveJawaban,
} from './src/lib/db-store';
import { comparePassword, hashPassword, signJWT, verifyJWT } from './src/lib/auth';
import { JWTPayload, Pegawai, CareerPathPeriode, CareerPathPertanyaan, CareerPathJawaban } from './src/lib/types';

async function createApp() {
  const app = express();

  app.use(express.json({ limit: '20mb' }));
  app.use(express.urlencoded({ extended: true, limit: '20mb' }));
  app.use(cookieParser());

  // --- Auth Middleware Helper ---
  async function authMiddleware(req: Request, res: Response, next: NextFunction) {
    const token = req.cookies?.cekkotakku_session || req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: 'Tidak terautentikasi.' });
    }

    const payload = await verifyJWT(token);
    if (!payload) {
      return res.status(401).json({ error: 'Sesi telah berakhir atau tidak valid.' });
    }

    (req as any).user = payload;
    next();
  }

  function adminMiddleware(req: Request, res: Response, next: NextFunction) {
    const user = (req as any).user as JWTPayload;
    if (user?.role !== 'admin') {
      return res.status(403).json({ error: 'Akses ditolak. Memerlukan role Admin.' });
    }
    next();
  }

  // --- API ROUTES ---

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', name: 'CEK KOTAKKU Backend API' });
  });

  // Login
  app.post('/api/auth/login', async (req, res) => {
    try {
      const { nip, password } = req.body || {};
      if (!nip || !password) {
        return res.status(400).json({ error: 'NIP dan kata sandi wajib diisi.' });
      }

      const user = await getUser(nip.trim());
      if (!user) {
        return res.status(401).json({ error: 'NIP atau kata sandi tidak valid.' });
      }

      const isMatch = await comparePassword(password, user.passwordHash);
      if (!isMatch) {
        return res.status(401).json({ error: 'NIP atau kata sandi tidak valid.' });
      }

      let pegawai: Pegawai | null = null;
      if (user.role === 'user') {
        pegawai = await getPegawai(user.nip);
        if (!pegawai) {
          return res.status(403).json({
            error: 'Autentikasi berhasil, namun data pemetaan talenta Anda belum diunggah oleh Admin.',
          });
        }
      }

      const jwtPayload: JWTPayload = {
        nip: user.nip,
        role: user.role,
        nama: pegawai?.nama || (user.role === 'admin' ? 'Administrator System' : user.nip),
      };

      const token = await signJWT(jwtPayload);

      res.cookie('cekkotakku_session', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 6 * 3600 * 1000, // 6 jam
        path: '/',
      });

      return res.json({
        success: true,
        user: jwtPayload,
        pegawai,
      });
    } catch (err: any) {
      console.error('Login error:', err);
      return res.status(500).json({ error: err.message || 'Terjadi kesalahan pada server.' });
    }
  });

  // Logout
  app.post('/api/auth/logout', (req, res) => {
    res.clearCookie('cekkotakku_session', { path: '/' });
    return res.json({ success: true, message: 'Berhasil keluar sistem.' });
  });

  // Get Current User
  app.get('/api/auth/me', authMiddleware, async (req, res) => {
    const userPayload = (req as any).user as JWTPayload;
    let pegawai: Pegawai | null = null;

    if (userPayload.role === 'user') {
      pegawai = await getPegawai(userPayload.nip);
    }

    return res.json({
      user: userPayload,
      pegawai,
    });
  });

  // Change Password
  app.post('/api/auth/change-password', authMiddleware, async (req, res) => {
    try {
      const userPayload = (req as any).user as JWTPayload;
      const { oldPassword, newPassword } = req.body || {};

      if (!oldPassword || !newPassword) {
        return res.status(400).json({ error: 'Kata sandi lama dan baru wajib diisi.' });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({ error: 'Kata sandi baru minimal 6 karakter.' });
      }

      const user = await getUser(userPayload.nip);
      if (!user) {
        return res.status(404).json({ error: 'User tidak ditemukan.' });
      }

      const isMatch = await comparePassword(oldPassword, user.passwordHash);
      if (!isMatch) {
        return res.status(400).json({ error: 'Kata sandi lama salah.' });
      }

      const newHash = await hashPassword(newPassword);
      await saveUser({
        ...user,
        passwordHash: newHash,
      });

      return res.json({ success: true, message: 'Kata sandi berhasil diperbarui.' });
    } catch (err: any) {
      return res.status(500).json({ error: err.message || 'Gagal mengubah kata sandi.' });
    }
  });

  // Pegawai endpoints
  app.get('/api/pegawai', authMiddleware, adminMiddleware, async (req, res) => {
    try {
      const list = await getAllPegawai();
      return res.json({ success: true, data: list });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  });

  app.get('/api/pegawai/:nip', authMiddleware, async (req, res) => {
    try {
      const userPayload = (req as any).user as JWTPayload;
      const targetNip = req.params.nip;

      // Regular user can only view their own profile; Admin can view any NIP
      if (userPayload.role !== 'admin' && userPayload.nip !== targetNip) {
        return res.status(403).json({ error: 'Akses ditolak.' });
      }

      const p = await getPegawai(targetNip);
      if (!p) {
        return res.status(404).json({ error: 'Data pegawai tidak ditemukan.' });
      }

      return res.json({ success: true, data: p });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/pegawai/sync', authMiddleware, adminMiddleware, async (req, res) => {
    try {
      const { rows } = req.body || {};
      if (!Array.isArray(rows) || rows.length === 0) {
        return res.status(400).json({ error: 'Format data Excel tidak valid atau data kosong.' });
      }

      const count = await syncPegawaiList(rows as Pegawai[]);
      return res.json({
        success: true,
        message: `Berhasil mereset & menyinkronkan ${count} data pegawai.`,
        count,
      });
    } catch (err: any) {
      return res.status(500).json({ error: err.message || 'Gagal melakukan sinkronisasi data Excel.' });
    }
  });

  // Career Path Periodes
  app.get('/api/career-path/periode', authMiddleware, async (req, res) => {
    try {
      const userPayload = (req as any).user as JWTPayload;
      const allPeriodes = await getPeriodes();

      if (userPayload.role === 'admin') {
        return res.json({ success: true, data: allPeriodes });
      }

      // Filter active periodes for user
      const filtered = allPeriodes.filter((p) => {
        if (p.status !== 'Aktif') return false;
        if (p.targetType === 'Semua') return true;
        return Array.isArray(p.targetNip) && p.targetNip.includes(userPayload.nip);
      });

      return res.json({ success: true, data: filtered });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/career-path/periode', authMiddleware, adminMiddleware, async (req, res) => {
    try {
      const body = req.body as CareerPathPeriode;
      if (!body.namaPeriode) {
        return res.status(400).json({ error: 'Nama periode wajib diisi.' });
      }

      const periodeId = body.periodeId || `PERIODE_${Date.now()}`;
      const item: CareerPathPeriode = {
        periodeId,
        namaPeriode: body.namaPeriode,
        status: body.status || 'Aktif',
        targetType: body.targetType || 'Semua',
        targetNip: Array.isArray(body.targetNip) ? body.targetNip : [],
      };

      await savePeriode(item);
      return res.json({ success: true, data: item, message: 'Periode berhasil disimpan.' });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  });

  app.delete('/api/career-path/periode/:periodeId', authMiddleware, adminMiddleware, async (req, res) => {
    try {
      const { periodeId } = req.params;
      await deletePeriode(periodeId);
      return res.json({ success: true, message: 'Periode berhasil dihapus.' });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  });

  // Questions per period
  app.get('/api/career-path/periode/:periodeId/pertanyaan', authMiddleware, async (req, res) => {
    try {
      const { periodeId } = req.params;
      const questions = await getPertanyaan(periodeId);
      return res.json({ success: true, data: questions });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/career-path/periode/:periodeId/pertanyaan', authMiddleware, adminMiddleware, async (req, res) => {
    try {
      const { periodeId } = req.params;
      const { questions } = req.body || {};

      if (!Array.isArray(questions)) {
        return res.status(400).json({ error: 'Format pertanyaan tidak valid.' });
      }

      await savePertanyaan(periodeId, questions as CareerPathPertanyaan[]);
      return res.json({ success: true, message: 'Daftar pertanyaan berhasil diperbarui.' });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  });

  // User Answer
  app.get('/api/career-path/jawaban', authMiddleware, async (req, res) => {
    try {
      const userPayload = (req as any).user as JWTPayload;
      const periodeId = req.query.periodeId as string;

      if (!periodeId) {
        return res.status(400).json({ error: 'periodeId wajib diisi.' });
      }

      if (userPayload.role === 'admin') {
        const answers = await getAllJawaban(periodeId);
        return res.json({ success: true, data: answers });
      }

      const userAns = await getJawabanUser(periodeId, userPayload.nip);
      return res.json({ success: true, data: userAns });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/career-path/jawaban', authMiddleware, async (req, res) => {
    try {
      const userPayload = (req as any).user as JWTPayload;
      const { periodeId, jawaban } = req.body || {};

      if (!periodeId || !jawaban) {
        return res.status(400).json({ error: 'periodeId dan jawaban wajib diisi.' });
      }

      const key = `${periodeId}_${userPayload.nip}`;
      const item: CareerPathJawaban = {
        jawabanId: key,
        periodeId,
        nip: userPayload.nip,
        nama: userPayload.nama || userPayload.nip,
        jawaban,
        status: 'Sudah Mengisi',
      };

      await saveJawaban(item);
      return res.json({ success: true, message: 'Jawaban kuesioner berhasil disimpan.', data: item });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  });

  // Admin Monitoring
  app.get('/api/career-path/monitoring', authMiddleware, adminMiddleware, async (req, res) => {
    try {
      const periodeId = req.query.periodeId as string;
      if (!periodeId) {
        return res.status(400).json({ error: 'periodeId wajib diisi.' });
      }

      const periode = await getPeriodeById(periodeId);
      if (!periode) {
        return res.status(404).json({ error: 'Periode tidak ditemukan.' });
      }

      const allEmployees = await getAllPegawai();
      const existingAnswers = await getAllJawaban(periodeId);
      const answerMap = new Map<string, CareerPathJawaban>();
      existingAnswers.forEach((a) => answerMap.set(a.nip, a));

      // Filter target employees based on periode targetType
      let targetList = allEmployees;
      if (periode.targetType === 'Tertentu' && Array.isArray(periode.targetNip)) {
        targetList = allEmployees.filter((e) => periode.targetNip.includes(e.nip));
      }

      let sudahMengisiCount = 0;
      let belumMengisiCount = 0;

      const unitDistribution: Record<string, { total: number; sudah: number }> = {};

      const tableData = targetList.map((emp) => {
        const ans = answerMap.get(emp.nip);
        const isFilled = ans?.status === 'Sudah Mengisi';

        if (isFilled) {
          sudahMengisiCount++;
        } else {
          belumMengisiCount++;
        }

        const unit = emp.unitOrganisasi || 'Lainnya';
        if (!unitDistribution[unit]) {
          unitDistribution[unit] = { total: 0, sudah: 0 };
        }
        unitDistribution[unit].total++;
        if (isFilled) unitDistribution[unit].sudah++;

        return {
          nip: emp.nip,
          nama: emp.nama,
          unitOrganisasi: emp.unitOrganisasi,
          jabatan: emp.jabatan,
          status: isFilled ? 'Sudah Mengisi' : 'Belum Mengisi',
          diisiPada: ans?.diisiPada || null,
          jawaban: ans?.jawaban || null,
        };
      });

      return res.json({
        success: true,
        summary: {
          totalTarget: targetList.length,
          totalSudah: sudahMengisiCount,
          totalBelum: belumMengisiCount,
        },
        unitDistribution: Object.entries(unitDistribution).map(([unit, val]) => ({
          unit,
          total: val.total,
          sudah: val.sudah,
          belum: val.total - val.sudah,
        })),
        tableData,
      });
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  });

  // --- VITE MIDDLEWARE / STATIC SERVING ---
  // Di Vercel, frontend sudah di-deploy terpisah sebagai static output (hasil `vite build`),
  // jadi function ini cukup menangani route /api/* saja dan TIDAK perlu menyalakan
  // Vite dev middleware maupun static file serving di sini.
  const isVercel = !!process.env.VERCEL;

  if (!isVercel) {
    if (process.env.NODE_ENV !== 'production') {
      // Dynamic import: 'vite' berat (esbuild/rollup) dan hanya dibutuhkan untuk
      // dev server lokal, jadi jangan pernah di-load secara statis di top-level
      // module (itu akan ikut ter-load di Vercel dan bisa bikin function crash).
      const { createServer: createViteServer } = await import('vite');
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: 'spa',
      });
      app.use(vite.middlewares);
    } else {
      const distPath = path.join(process.cwd(), 'dist');
      app.use(express.static(distPath));
      app.get('*', (req, res) => {
        res.sendFile(path.join(distPath, 'index.html'));
      });
    }
  }

  return app;
}

// Cache promise-nya supaya Express app tidak dibuat ulang di setiap invocation
// serverless (penting untuk performa & supaya route hanya didaftarkan sekali).
let appPromise: ReturnType<typeof createApp> | null = null;
export function getApp() {
  if (!appPromise) {
    appPromise = createApp();
  }
  return appPromise;
}

// Kalau dijalankan sebagai server Node.js tradisional (bukan di Vercel),
// langsung buat app-nya dan dengarkan di port 3000 seperti biasa.
if (!process.env.VERCEL) {
  const PORT = 3000;
  getApp().then((app) => {
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server CEK KOTAKKU running on http://0.0.0.0:${PORT}`);
    });
  });
}
