import { getAdminFirestore } from './firebase-admin';
import { hashPassword } from './auth';
import {
  UserAccount,
  Pegawai,
  CareerPathPeriode,
  CareerPathPertanyaan,
  CareerPathJawaban,
} from './types';

// In-Memory Storage Fallback
const memoryUsers = new Map<string, UserAccount>();
const memoryPegawai = new Map<string, Pegawai>();
const memoryPeriodes = new Map<string, CareerPathPeriode>();
const memoryPertanyaan = new Map<string, CareerPathPertanyaan[]>();
const memoryJawaban = new Map<string, CareerPathJawaban>();

let isInitialized = false;

async function seedInitialData() {
  if (isInitialized) return;
  isInitialized = true;

  const defaultAdminHash = await hashPassword('admin123');
  const defaultUserHash = await hashPassword('user123');

  // Seed default admin
  memoryUsers.set('admin', {
    nip: 'admin',
    passwordHash: defaultAdminHash,
    role: 'admin',
    createdAt: new Date().toISOString(),
  });

  // Seed default sample pegawai
  const samplePegawai: Pegawai[] = [
    {
      nip: '199001012015011001',
      nama: 'Budi Santoso, S.Kom',
      unitOrganisasi: 'Direktorat Sistem Informasi',
      jabatan: 'Analisis Sistem Informasi Ahli Muda',
      nilaiX: 85,
      nilaiY: 92,
      box: 9,
      komponenX: { Kepemimpinan: 85, Inovasi: 88, Manajerial: 82 },
      komponenY: { 'Capaian SKP': 95, Disiplin: 90, Kerjasama: 91 },
    },
    {
      nip: '199203152017021002',
      nama: 'Siti Aminah, M.T',
      unitOrganisasi: 'Direktorat Pengelolaan Data',
      jabatan: 'Pranata Komputer Ahli Pertama',
      nilaiX: 78,
      nilaiY: 88,
      box: 8,
      komponenX: { Kepemimpinan: 75, Inovasi: 82 },
      komponenY: { 'Capaian SKP': 90, Disiplin: 86 },
    },
    {
      nip: '198811202012012003',
      nama: 'Ahmad Dahlan, S.E',
      unitOrganisasi: 'Biro Keuangan dan Perencanaan',
      jabatan: 'Penata Laporan Keuangan',
      nilaiX: 62,
      nilaiY: 74,
      box: 5,
      komponenX: { Kepemimpinan: 60, Inovasi: 64 },
      komponenY: { 'Capaian SKP': 76, Disiplin: 72 },
    },
    {
      nip: '199505042019031004',
      nama: 'Dewi Lestari, S.S',
      unitOrganisasi: 'Biro Hubungan Masyarakat',
      jabatan: 'Pranata Humas Ahli Pertama',
      nilaiX: 90,
      nilaiY: 65,
      box: 7,
      komponenX: { Kepemimpinan: 92, Inovasi: 88 },
      komponenY: { 'Capaian SKP': 66, Disiplin: 64 },
    },
  ];

  for (const p of samplePegawai) {
    memoryPegawai.set(p.nip, p);
    memoryUsers.set(p.nip, {
      nip: p.nip,
      passwordHash: defaultUserHash,
      role: 'user',
      createdAt: new Date().toISOString(),
    });
  }

  // Seed default periode
  const defaultPeriode: CareerPathPeriode = {
    periodeId: 'PERIODE_2026_Q1',
    namaPeriode: 'Pemetaan Karir & Aspirasi Talenta 2026 (Periode 1)',
    status: 'Aktif',
    targetType: 'Semua',
    dibuatPada: new Date().toISOString(),
  };
  memoryPeriodes.set(defaultPeriode.periodeId, defaultPeriode);

  // Seed default pertanyaan
  const defaultQuestions: CareerPathPertanyaan[] = [
    {
      urutan: 1,
      teksPertanyaan: 'Apa orientasi pengembangan karir yang Anda harapkan dalam 2 tahun ke depan?',
      tipeSoal: 'Pilihan Ganda',
      opsi: 'Promosi Struktural, Pengayaan Jabatan Fungsional, Rotasi Lintassektor, Tugas Belajar',
      wajib: true,
    },
    {
      urutan: 2,
      teksPertanyaan: 'Pilih kompetensi teknis/manajerial yang ingin Anda tingkatkan:',
      tipeSoal: 'Checkbox',
      opsi: 'Kepemimpinan Strategis, Analisis Data & AI, Manajemen Proyek, Komunikasi Publik',
      wajib: true,
    },
    {
      urutan: 3,
      teksPertanyaan: 'Sebutkan inovasi atau kontribusi terbesar yang telah Anda selesaikan tahun ini:',
      tipeSoal: 'Teks Bebas',
      opsi: '',
      wajib: true,
    },
  ];
  memoryPertanyaan.set(defaultPeriode.periodeId, defaultQuestions);
}

// === USER STORE ===
export async function getUser(nip: string): Promise<UserAccount | null> {
  await seedInitialData();
  const db = getAdminFirestore();
  if (db) {
    try {
      const doc = await db.collection('users').doc(nip).get();
      if (doc.exists) {
        return doc.data() as UserAccount;
      }
    } catch (e) {
      console.warn('Firestore fallback to memory for getUser:', e);
    }
  }
  return memoryUsers.get(nip) || null;
}

export async function saveUser(user: UserAccount): Promise<void> {
  await seedInitialData();
  memoryUsers.set(user.nip, user);
  const db = getAdminFirestore();
  if (db) {
    try {
      await db.collection('users').doc(user.nip).set(user, { merge: true });
    } catch (e) {
      console.warn('Firestore failed saveUser:', e);
    }
  }
}

// === PEGAWAI STORE ===
export async function getPegawai(nip: string): Promise<Pegawai | null> {
  await seedInitialData();
  const db = getAdminFirestore();
  if (db) {
    try {
      const doc = await db.collection('pegawai').doc(nip).get();
      if (doc.exists) {
        return doc.data() as Pegawai;
      }
    } catch (e) {
      console.warn('Firestore fallback for getPegawai:', e);
    }
  }
  return memoryPegawai.get(nip) || null;
}

export async function getAllPegawai(): Promise<Pegawai[]> {
  await seedInitialData();
  const db = getAdminFirestore();
  if (db) {
    try {
      const snap = await db.collection('pegawai').get();
      if (!snap.empty) {
        return snap.docs.map((doc) => doc.data() as Pegawai);
      }
    } catch (e) {
      console.warn('Firestore fallback for getAllPegawai:', e);
    }
  }
  return Array.from(memoryPegawai.values());
}

export async function syncPegawaiList(rows: Pegawai[]): Promise<number> {
  await seedInitialData();
  memoryPegawai.clear();
  const defaultUserHash = await hashPassword('user123');

  const db = getAdminFirestore();
  const batch = db ? db.batch() : null;

  for (const row of rows) {
    if (!row.nip) continue;

    // Calculate Box 1-9 based on X and Y if needed
    let box = row.box || 5;
    if (typeof row.nilaiX === 'number' && typeof row.nilaiY === 'number') {
      const xCat = row.nilaiX >= 80 ? 3 : row.nilaiX >= 65 ? 2 : 1;
      const yCat = row.nilaiY >= 80 ? 3 : row.nilaiY >= 65 ? 2 : 1;
      box = (yCat - 1) * 3 + xCat;
    }

    const p: Pegawai = {
      ...row,
      box,
      updatedAt: new Date().toISOString(),
    };

    memoryPegawai.set(p.nip, p);

    // Create default user account if not exists
    if (!memoryUsers.has(p.nip)) {
      memoryUsers.set(p.nip, {
        nip: p.nip,
        passwordHash: defaultUserHash,
        role: 'user',
        createdAt: new Date().toISOString(),
      });
    }

    if (db && batch) {
      const pRef = db.collection('pegawai').doc(p.nip);
      batch.set(pRef, p, { merge: true });

      const uRef = db.collection('users').doc(p.nip);
      batch.set(uRef, {
        nip: p.nip,
        passwordHash: defaultUserHash,
        role: 'user',
        updatedAt: new Date().toISOString(),
      }, { merge: true });
    }
  }

  if (db && batch) {
    try {
      await batch.commit();
    } catch (e) {
      console.warn('Firestore batch syncPegawaiList failed:', e);
    }
  }

  return memoryPegawai.size;
}

// === CAREER PATH PERIODE STORE ===
export async function getPeriodes(): Promise<CareerPathPeriode[]> {
  await seedInitialData();
  const db = getAdminFirestore();
  if (db) {
    try {
      const snap = await db.collection('careerPathPeriode').get();
      if (!snap.empty) {
        return snap.docs.map((doc) => doc.data() as CareerPathPeriode);
      }
    } catch (e) {
      console.warn('Firestore fallback getPeriodes:', e);
    }
  }
  return Array.from(memoryPeriodes.values());
}

export async function getPeriodeById(periodeId: string): Promise<CareerPathPeriode | null> {
  await seedInitialData();
  const db = getAdminFirestore();
  if (db) {
    try {
      const doc = await db.collection('careerPathPeriode').doc(periodeId).get();
      if (doc.exists) {
        return doc.data() as CareerPathPeriode;
      }
    } catch (e) {
      console.warn('Firestore fallback getPeriodeById:', e);
    }
  }
  return memoryPeriodes.get(periodeId) || null;
}

export async function savePeriode(periode: CareerPathPeriode): Promise<void> {
  await seedInitialData();
  const now = new Date().toISOString();
  const item: CareerPathPeriode = {
    ...periode,
    diperbaruiPada: now,
    dibuatPada: periode.dibuatPada || now,
  };

  memoryPeriodes.set(item.periodeId, item);

  const db = getAdminFirestore();
  if (db) {
    try {
      await db.collection('careerPathPeriode').doc(item.periodeId).set(item, { merge: true });
    } catch (e) {
      console.warn('Firestore savePeriode failed:', e);
    }
  }
}

export async function deletePeriode(periodeId: string): Promise<void> {
  await seedInitialData();
  memoryPeriodes.delete(periodeId);
  memoryPertanyaan.delete(periodeId);

  const db = getAdminFirestore();
  if (db) {
    try {
      await db.collection('careerPathPeriode').doc(periodeId).delete();
    } catch (e) {
      console.warn('Firestore deletePeriode failed:', e);
    }
  }
}

// === PERTANYAAN STORE ===
export async function getPertanyaan(periodeId: string): Promise<CareerPathPertanyaan[]> {
  await seedInitialData();
  const db = getAdminFirestore();
  if (db) {
    try {
      const snap = await db
        .collection('careerPathPeriode')
        .doc(periodeId)
        .collection('pertanyaan')
        .orderBy('urutan', 'asc')
        .get();
      if (!snap.empty) {
        return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as CareerPathPertanyaan);
      }
    } catch (e) {
      console.warn('Firestore fallback getPertanyaan:', e);
    }
  }
  return memoryPertanyaan.get(periodeId) || [];
}

export async function savePertanyaan(periodeId: string, questions: CareerPathPertanyaan[]): Promise<void> {
  await seedInitialData();
  memoryPertanyaan.set(periodeId, questions);

  const db = getAdminFirestore();
  if (db) {
    try {
      const subRef = db.collection('careerPathPeriode').doc(periodeId).collection('pertanyaan');
      const existing = await subRef.get();
      const batch = db.batch();

      existing.docs.forEach((doc) => batch.delete(doc.ref));

      questions.forEach((q, idx) => {
        const qDoc = subRef.doc(`q_${idx + 1}`);
        batch.set(qDoc, { ...q, urutan: idx + 1 });
      });

      await batch.commit();
    } catch (e) {
      console.warn('Firestore savePertanyaan failed:', e);
    }
  }
}

// === JAWABAN STORE ===
export async function getJawabanUser(periodeId: string, nip: string): Promise<CareerPathJawaban | null> {
  await seedInitialData();
  const key = `${periodeId}_${nip}`;
  const db = getAdminFirestore();
  if (db) {
    try {
      const doc = await db.collection('careerPathJawaban').doc(key).get();
      if (doc.exists) {
        return doc.data() as CareerPathJawaban;
      }
    } catch (e) {
      console.warn('Firestore fallback getJawabanUser:', e);
    }
  }
  return memoryJawaban.get(key) || null;
}

export async function getAllJawaban(periodeId: string): Promise<CareerPathJawaban[]> {
  await seedInitialData();
  const db = getAdminFirestore();
  if (db) {
    try {
      const snap = await db
        .collection('careerPathJawaban')
        .where('periodeId', '==', periodeId)
        .get();
      if (!snap.empty) {
        return snap.docs.map((doc) => doc.data() as CareerPathJawaban);
      }
    } catch (e) {
      console.warn('Firestore fallback getAllJawaban:', e);
    }
  }
  const result: CareerPathJawaban[] = [];
  memoryJawaban.forEach((val) => {
    if (val.periodeId === periodeId) {
      result.push(val);
    }
  });
  return result;
}

export async function saveJawaban(jawaban: CareerPathJawaban): Promise<void> {
  await seedInitialData();
  const now = new Date().toISOString();
  const item: CareerPathJawaban = {
    ...jawaban,
    diisiPada: jawaban.diisiPada || now,
    diperbaruiPada: now,
  };

  memoryJawaban.set(item.jawabanId, item);

  const db = getAdminFirestore();
  if (db) {
    try {
      await db.collection('careerPathJawaban').doc(item.jawabanId).set(item, { merge: true });
    } catch (e) {
      console.warn('Firestore saveJawaban failed:', e);
    }
  }
}
