export interface JWTPayload {
  nip: string;
  role: 'admin' | 'user';
  nama?: string;
  [key: string]: any;
}

export interface UserAccount {
  nip: string;
  passwordHash: string;
  role: 'admin' | 'user';
  createdAt?: string;
  updatedAt?: string;
}

export interface KomponenNilai {
  nama: string;
  skor: number;
  bobot: number;
}

export interface Pegawai {
  nip: string;
  nama: string;
  unitOrganisasi: string;
  jabatan: string;
  nilaiX: number; // Potensi (0 - 100 atau 1 - 3)
  nilaiY: number; // Kinerja (0 - 100 atau 1 - 3)
  box: number; // Box 1 sampai 9
  komponenX?: Record<string, number> | KomponenNilai[];
  komponenY?: Record<string, number> | KomponenNilai[];
  updatedAt?: string;
}

export interface CareerPathPeriode {
  periodeId: string;
  namaPeriode: string;
  status: 'Aktif' | 'Nonaktif' | 'Selesai';
  targetType: 'Semua' | 'Tertentu';
  targetNip?: string[];
  dibuatPada?: string;
  diperbaruiPada?: string;
}

export interface CareerPathPertanyaan {
  id?: string;
  urutan: number;
  teksPertanyaan: string;
  tipeSoal: 'Pilihan Ganda' | 'Checkbox' | 'Dropdown' | 'Skala' | 'Teks Bebas';
  opsi?: string;
  wajib: boolean;
}

export interface CareerPathJawaban {
  jawabanId: string;
  periodeId: string;
  nip: string;
  nama: string;
  jawaban: Record<string, any>;
  status: 'Sudah Mengisi' | 'Belum Mengisi';
  diisiPada?: string;
  diperbaruiPada?: string;
}
