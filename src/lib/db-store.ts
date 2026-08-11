import { getAdminFirestore } from './firebase-admin.js';
import {
  UserAccount,
  Pegawai,
  CareerPathPeriode,
  CareerPathPertanyaan,
  CareerPathJawaban,
} from './types.js';
import { hashPassword } from './auth.js';

// Initial seed data for memory store fallback
let memoryUsers: Record<string, UserAccount> = {};
let memoryPegawai: Record<string, Pegawai> = {};
let memoryPeriodes: Record<string, CareerPathPeriode> = {};
let memoryQuestions: Record<string, CareerPathPertanyaan[]> = {};
let memoryAnswers: Record<string, CareerPathJawaban> = {}; // key: `${periodeId}_${nip}`

let isSeeded = false;

async function initSeedData() {
  if (isSeeded) return;
  isSeeded = true;

  const defaultAdminHash = await hashPassword('admin123');
  memoryUsers['admin'] = {
    nip: 'admin',
    passwordHash: defaultAdminHash,
    role: 'admin',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const sampleEmployees: Pegawai[] = [
    {
      nip: '199001012015011001',
      nama: 'Ahmad Fauzi, S.T.',
      unitOrganisasi: 'Direktorat SDM & Organisasi',
      jabatan: 'Analis Talenta Ahli Muda',
      nilaiX: 88.5,
      nilaiY: 92.0,
      box: 3,
      komponenX: {
        kompetensi: 90,
        pengembangan: 85,
        pengalaman: 88,
        potensi: 92,
        pendidikan: 85,
        kesesuaian: 90,
        disiplin: 89,
      },
      komponenY: {
        kinerja: 94,
        penghargaan: 90,
        timKerja: 91,
        umpanBalik: 93,
      },
      updatedAt: new Date().toISOString(),
    },
    {
      nip: '198805122012032002',
      nama: 'Siti Rahmawati, M.Si.',
      unitOrganisasi: 'Direktorat Keuangan',
      jabatan: 'Kepala Subbagian Perencanaan',
      nilaiX: 85.0,
      nilaiY: 78.5,
      box: 2,
      komponenX: {
        kompetensi: 86,
        pengembangan: 84,
        pengalaman: 82,
        potensi: 88,
        pendidikan: 90,
        kesesuaian: 85,
        disiplin: 80,
      },
      komponenY: {
        kinerja: 78,
        penghargaan: 75,
        timKerja: 80,
        umpanBalik: 81,
      },
      updatedAt: new Date().toISOString(),
    },
    {
      nip: '199203152018021003',
      nama: 'Budi Santoso, S.Kom.',
      unitOrganisasi: 'Pusat Data & Informasi',
      jabatan: 'Pengembang Sistem Informasi',
      nilaiX: 72.0,
      nilaiY: 91.0,
      box: 6,
      komponenX: {
        kompetensi: 75,
        pengembangan: 70,
        pengalaman: 68,
        potensi: 74,
        pendidikan: 72,
        kesesuaian: 75,
        disiplin: 70,
      },
      komponenY: {
        kinerja: 92,
        penghargaan: 88,
        timKerja: 90,
        umpanBalik: 94,
      },
      updatedAt: new Date().toISOString(),
    },
    {
      nip: '199507202020012004',
      nama: 'Dewi Lestari, S.E.',
      unitOrganisasi: 'Direktorat Keuangan',
      jabatan: 'Pengelola Keuangan',
      nilaiX: 70.0,
      nilaiY: 72.5,
      box: 5,
      komponenX: {
        kompetensi: 72,
        pengembangan: 68,
        pengalaman: 70,
        potensi: 71,
        pendidikan: 70,
        kesesuaian: 69,
        disiplin: 69,
      },
      komponenY: {
        kinerja: 73,
        penghargaan: 70,
        timKerja: 74,
        umpanBalik: 73,
      },
      updatedAt: new Date().toISOString(),
    },
    {
      nip: '199104102016021005',
      nama: 'Rian Pratama, S.H.',
      unitOrganisasi: 'Biro Hukum & Layanan Informasi',
      jabatan: 'Analis Hukum Pertanahan',
      nilaiX: 86.0,
      nilaiY: 65.0,
      box: 1,
      komponenX: {
        kompetensi: 88,
        pengembangan: 85,
        pengalaman: 82,
        potensi: 89,
        pendidikan: 84,
        kesesuaian: 87,
        disiplin: 87,
      },
      komponenY: {
        kinerja: 62,
        penghargaan: 60,
        timKerja: 68,
        umpanBalik: 70,
      },
      updatedAt: new Date().toISOString(),
    }
  ];

  const defaultUserHash = await hashPassword('pegawai123');
  for (const p of sampleEmployees) {
    memoryPegawai[p.nip] = p;
    memoryUsers[p.nip] = {
      nip: p.nip,
      passwordHash: defaultUserHash,
      role: 'user',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  // Sample Career Path Periode
  const samplePeriodeId = 'PERIODE_2026_Q3';
  memoryPeriodes[samplePeriodeId] = {
    periodeId: samplePeriodeId,
    namaPeriode: 'Pemetaan Career Path & Aspirasi Jabatan Q3 2026',
    status: 'Aktif',
    targetType: 'Semua',
    targetNip: [],
    dibuatPada: new Date().toISOString(),
    diperbaruiPada: new Date().toISOString(),
  };

  memoryQuestions[samplePeriodeId] = [
    {
      urutan: 1,
      teksPertanyaan: 'Apa orientasi bidang karir yang Anda harapkan dalam 3 tahun ke depan?',
      tipeSoal: 'Pilihan Ganda',
      opsi: 'Manajerial / Struktural|Spesialis / Fungsional Ahli|Proyek Khusus / Taskforce|Pengembangan Keahlian Teknis Baru',
      wajib: true,
    },
    {
      urutan: 2,
      teksPertanyaan: 'Pilihlah pengembangan kompetensi yang paling relevan dengan minat Anda (Bisa lebih dari satu):',
      tipeSoal: 'Checkbox',
      opsi: 'Kepemimpinan Strategis|Manajemen Proyek Digital|Analisis Data & AI|Hukum & Regulasi|Manajemen Keuangan Publik',
      wajib: true,
    },
    {
      urutan: 3,
      teksPertanyaan: 'Seberapa siap Anda jika ditugaskan atau dirotasi ke unit/wilayah kerja lain?',
      tipeSoal: 'Skala',
      opsi: '1|2|3|4|5',
      wajib: true,
    },
    {
      urutan: 4,
      teksPertanyaan: 'Unit Organisasi pilihan utama Anda jika dilakukan rotasi/promosi:',
      tipeSoal: 'Dropdown',
      opsi: 'Direktorat SDM & Organisasi|Direktorat Keuangan|Pusat Data & Informasi|Biro Hukum & Layanan Informasi',
      wajib: false,
    },
    {
      urutan: 5,
      teksPertanyaan: 'Uraikan aspirasi karir dan inovasi yang ingin Anda kontribusikan bagi instansi:',
      tipeSoal: 'Teks Bebas',
      opsi: '',
      wajib: false,
    },
  ];

  // Sample user answer
  memoryAnswers[`${samplePeriodeId}_199001012015011001`] = {
    jawabanId: `${samplePeriodeId}_199001012015011001`,
    periodeId: samplePeriodeId,
    nip: '199001012015011001',
    nama: 'Ahmad Fauzi, S.T.',
    jawaban: {
      '0': 'Manajerial / Struktural',
      '1': ['Kepemimpinan Strategis', 'Analisis Data & AI'],
      '2': '5',
      '3': 'Direktorat SDM & Organisasi',
      '4': 'Ingin mengembangkan transformasi digital dalam pemetaan talenta berbasis AI.',
    },
    status: 'Sudah Mengisi',
    diisiPada: new Date().toISOString(),
    diperbaruiPada: new Date().toISOString(),
  };
}

// Ensure default seed
initSeedData();

// --- USER OPERATIONS ---
export async function getUser(nip: string): Promise<UserAccount | null> {
  await initSeedData();
  const db = getAdminFirestore();

  if (db) {
    try {
      const doc = await db.collection('users').doc(nip).get();
      if (doc.exists) {
        return doc.data() as UserAccount;
      }
    } catch (err) {
      console.error('Firestore getUser error:', err);
    }
  }

  // Fallback memory
  return memoryUsers[nip] || null;
}

export async function saveUser(user: UserAccount): Promise<void> {
  await initSeedData();
  const db = getAdminFirestore();
  const now = new Date().toISOString();
  const userData = { ...user, updatedAt: now };

  if (db) {
    try {
      await db.collection('users').doc(user.nip).set(userData, { merge: true });
    } catch (err) {
      console.error('Firestore saveUser error:', err);
    }
  }

  memoryUsers[user.nip] = userData;
}

// --- PEGAWAI OPERATIONS ---
export async function getPegawai(nip: string): Promise<Pegawai | null> {
  await initSeedData();
  const db = getAdminFirestore();

  if (db) {
    try {
      const doc = await db.collection('pegawai').doc(nip).get();
      if (doc.exists) {
        return doc.data() as Pegawai;
      }
    } catch (err) {
      console.error('Firestore getPegawai error:', err);
    }
  }

  return memoryPegawai[nip] || null;
}

export async function getAllPegawai(): Promise<Pegawai[]> {
  await initSeedData();
  const db = getAdminFirestore();

  if (db) {
    try {
      const snapshot = await db.collection('pegawai').get();
      if (!snapshot.empty) {
        return snapshot.docs.map((doc) => doc.data() as Pegawai);
      }
    } catch (err) {
      console.error('Firestore getAllPegawai error:', err);
    }
  }

  return Object.values(memoryPegawai);
}

export async function syncPegawaiList(newList: Pegawai[]): Promise<number> {
  await initSeedData();
  const db = getAdminFirestore();
  const now = new Date().toISOString();

  // Create default password hash for newly imported employees
  const defaultPasswordHash = await hashPassword('pegawai123');

  if (db) {
    try {
      // Clean existing pegawai collection using batching
      const existingSnap = await db.collection('pegawai').get();
      if (!existingSnap.empty) {
        let batch = db.batch();
        let count = 0;
        for (const doc of existingSnap.docs) {
          batch.delete(doc.ref);
          count++;
          if (count % 400 === 0) {
            await batch.commit();
            batch = db.batch();
          }
        }
        if (count % 400 !== 0) {
          await batch.commit();
        }
      }

      // Write new records
      let batch = db.batch();
      let count = 0;
      for (const p of newList) {
        const pWithTime = { ...p, updatedAt: now };
        const ref = db.collection('pegawai').doc(p.nip);
        batch.set(ref, pWithTime);

        // Also check if user account exists, if not create one
        const userRef = db.collection('users').doc(p.nip);
        batch.set(userRef, {
          nip: p.nip,
          passwordHash: defaultPasswordHash,
          role: 'user',
          createdAt: now,
          updatedAt: now,
        }, { merge: true });

        count++;
        if (count % 200 === 0) {
          await batch.commit();
          batch = db.batch();
        }
      }
      if (count % 200 !== 0) {
        await batch.commit();
      }
    } catch (err) {
      console.error('Firestore syncPegawaiList error:', err);
    }
  }

  // Update memory store as well
  memoryPegawai = {};
  for (const p of newList) {
    const pWithTime = { ...p, updatedAt: now };
    memoryPegawai[p.nip] = pWithTime;
    if (!memoryUsers[p.nip]) {
      memoryUsers[p.nip] = {
        nip: p.nip,
        passwordHash: defaultPasswordHash,
        role: 'user',
        createdAt: now,
        updatedAt: now,
      };
    }
  }

  return newList.length;
}

// --- CAREER PATH PERIODE OPERATIONS ---
export async function getPeriodes(): Promise<CareerPathPeriode[]> {
  await initSeedData();
  const db = getAdminFirestore();

  if (db) {
    try {
      const snap = await db.collection('careerPathPeriode').get();
      if (!snap.empty) {
        return snap.docs.map((doc) => doc.data() as CareerPathPeriode);
      }
    } catch (err) {
      console.error('Firestore getPeriodes error:', err);
    }
  }

  return Object.values(memoryPeriodes);
}

export async function getPeriodeById(periodeId: string): Promise<CareerPathPeriode | null> {
  await initSeedData();
  const db = getAdminFirestore();

  if (db) {
    try {
      const doc = await db.collection('careerPathPeriode').doc(periodeId).get();
      if (doc.exists) {
        return doc.data() as CareerPathPeriode;
      }
    } catch (err) {
      console.error('Firestore getPeriodeById error:', err);
    }
  }

  return memoryPeriodes[periodeId] || null;
}

export async function savePeriode(periode: CareerPathPeriode): Promise<void> {
  await initSeedData();
  const db = getAdminFirestore();
  const now = new Date().toISOString();
  const item = {
    ...periode,
    dibuatPada: periode.dibuatPada || now,
    diperbaruiPada: now,
  };

  if (db) {
    try {
      await db.collection('careerPathPeriode').doc(periode.periodeId).set(item, { merge: true });
    } catch (err) {
      console.error('Firestore savePeriode error:', err);
    }
  }

  memoryPeriodes[periode.periodeId] = item;
}

export async function deletePeriode(periodeId: string): Promise<void> {
  await initSeedData();
  const db = getAdminFirestore();

  if (db) {
    try {
      await db.collection('careerPathPeriode').doc(periodeId).delete();
    } catch (err) {
      console.error('Firestore deletePeriode error:', err);
    }
  }

  delete memoryPeriodes[periodeId];
  delete memoryQuestions[periodeId];
}

// --- PERTANYAAN OPERATIONS ---
export async function getPertanyaan(periodeId: string): Promise<CareerPathPertanyaan[]> {
  await initSeedData();
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
        return snap.docs.map((d) => ({ id: d.id, ...d.data() } as CareerPathPertanyaan));
      }
    } catch (err) {
      console.error('Firestore getPertanyaan error:', err);
    }
  }

  return memoryQuestions[periodeId] || [];
}

export async function savePertanyaan(
  periodeId: string,
  questions: CareerPathPertanyaan[]
): Promise<void> {
  await initSeedData();
  const db = getAdminFirestore();

  if (db) {
    try {
      const colRef = db.collection('careerPathPeriode').doc(periodeId).collection('pertanyaan');
      const existing = await colRef.get();
      const batch = db.batch();

      for (const d of existing.docs) {
        batch.delete(d.ref);
      }

      questions.forEach((q, idx) => {
        const qRef = colRef.doc(`q_${idx + 1}`);
        batch.set(qRef, { ...q, urutan: idx + 1 });
      });

      await batch.commit();
    } catch (err) {
      console.error('Firestore savePertanyaan error:', err);
    }
  }

  memoryQuestions[periodeId] = questions.map((q, idx) => ({ ...q, urutan: idx + 1 }));
}

// --- JAWABAN OPERATIONS ---
export async function getJawabanUser(
  periodeId: string,
  nip: string
): Promise<CareerPathJawaban | null> {
  await initSeedData();
  const db = getAdminFirestore();
  const key = `${periodeId}_${nip}`;

  if (db) {
    try {
      const doc = await db.collection('careerPathJawaban').doc(key).get();
      if (doc.exists) {
        return doc.data() as CareerPathJawaban;
      }
    } catch (err) {
      console.error('Firestore getJawabanUser error:', err);
    }
  }

  return memoryAnswers[key] || null;
}

export async function getAllJawaban(periodeId: string): Promise<CareerPathJawaban[]> {
  await initSeedData();
  const db = getAdminFirestore();

  if (db) {
    try {
      const snap = await db
        .collection('careerPathJawaban')
        .where('periodeId', '==', periodeId)
        .get();

      if (!snap.empty) {
        return snap.docs.map((d) => d.data() as CareerPathJawaban);
      }
    } catch (err) {
      console.error('Firestore getAllJawaban error:', err);
    }
  }

  return Object.values(memoryAnswers).filter((ans) => ans.periodeId === periodeId);
}

export async function saveJawaban(jawaban: CareerPathJawaban): Promise<void> {
  await initSeedData();
  const db = getAdminFirestore();
  const now = new Date().toISOString();
  const item: CareerPathJawaban = {
    ...jawaban,
    diisiPada: jawaban.diisiPada || now,
    diperbaruiPada: now,
  };

  if (db) {
    try {
      await db.collection('careerPathJawaban').doc(jawaban.jawabanId).set(item, { merge: true });
    } catch (err) {
      console.error('Firestore saveJawaban error:', err);
    }
  }

  memoryAnswers[jawaban.jawabanId] = item;
}
