export type Role = 'admin' | 'user';

export interface UserAccount {
  nip: string;
  passwordHash: string;
  role: Role;
  createdAt?: string;
  updatedAt?: string;
}

export interface KomponenPotensi {
  kompetensi: number;
  pengembangan: number;
  pengalaman: number;
  potensi: number;
  pendidikan: number;
  kesesuaian: number;
  disiplin: number;
}

export interface KomponenKinerja {
  kinerja: number;
  penghargaan: number;
  timKerja: number;
  umpanBalik: number;
}

export interface Pegawai {
  nip: string;
  nama: string;
  unitOrganisasi: string;
  jabatan: string;
  nilaiX: number; // Skor Potensi
  nilaiY: number; // Skor Kinerja
  box: number; // 1-9
  komponenX: KomponenPotensi;
  komponenY: KomponenKinerja;
  updatedAt?: string;
}

export type StatusPeriode = 'Aktif' | 'Nonaktif' | 'Selesai';
export type TargetType = 'Semua' | 'Tertentu';

export interface CareerPathPeriode {
  periodeId: string;
  namaPeriode: string;
  status: StatusPeriode;
  targetType: TargetType;
  targetNip: string[];
  dibuatPada?: string;
  diperbaruiPada?: string;
}

export type TipeSoal = 'Pilihan Ganda' | 'Checkbox' | 'Dropdown' | 'Skala' | 'Teks Bebas';

export interface CareerPathPertanyaan {
  id?: string;
  urutan: number;
  teksPertanyaan: string;
  tipeSoal: TipeSoal;
  opsi: string; // Separated by '|'
  wajib: boolean;
}

export interface CareerPathJawaban {
  jawabanId: string; // ${periodeId}_${nip}
  periodeId: string;
  nip: string;
  nama: string;
  jawaban: Record<string, string | string[]>;
  status: 'Sudah Mengisi' | 'Belum Mengisi';
  diisiPada?: string;
  diperbaruiPada?: string;
}

export interface JWTPayload {
  nip: string;
  role: Role;
  nama?: string;
}
