export interface BoxInfo {
  box: number;
  label: string;
  category: string;
  badgeColor: string;
  bgLight: string;
  borderColor: string;
  description: string;
  rekomendasiPengembangan: string[];
  rekomendasiKarir: string[];
}

export const BOX_INFO_MAP: Record<number, BoxInfo> = {
  1: {
    box: 1,
    label: 'Box 1: Low Performer (Perlu Penanganan Khusus)',
    category: 'Risiko Tinggi',
    badgeColor: 'bg-rose-500/10 text-rose-700 border-rose-200',
    bgLight: 'bg-rose-50/50',
    borderColor: 'border-rose-200',
    description: 'Pegawai memiliki tingkat potensi rendah dan capaian kinerja di bawah ekspektasi.',
    rekomendasiPengembangan: [
      'Konseling dan mentoring intensif terkait masalah kinerja',
      'Pelatihan dasar peningkatan keterampilan (re-skilling)',
      'Penetapan target kinerja mingguan dengan evaluasi terukur',
    ],
    rekomendasiKarir: [
      'Penataan ulang beban kerja atau re-assignment peran',
      'Pemberian peringatan atau pembinaan disiplin pegawai bila diperlukan',
    ],
  },
  2: {
    box: 2,
    label: 'Box 2: Unpolished Gem (Potensi Sedang, Kinerja Rendah)',
    category: 'Perlu Pembinaan',
    badgeColor: 'bg-amber-500/10 text-amber-700 border-amber-200',
    bgLight: 'bg-amber-50/50',
    borderColor: 'border-amber-200',
    description: 'Pegawai memiliki potensi sedang namun kinerja saat ini belum optimal.',
    rekomendasiPengembangan: [
      'Coaching harian dan pengawasan berkala dari atasan langsung',
      'Pelatihan teknis sesuai kompetensi jabatan',
      'Analisis kendala hambatan kerja (workload / fasilitas)',
    ],
    rekomendasiKarir: [
      'Rotasi ke lingkungan tim yang lebih suportif',
      'Evaluasi ulang kesesuaian tugas dengan minat dan keahlian',
    ],
  },
  3: {
    box: 3,
    label: 'Box 3: High Potential / Rough Diamond (Potensi Tinggi, Kinerja Rendah)',
    category: 'Talenta Berpotensi',
    badgeColor: 'bg-indigo-500/10 text-indigo-700 border-indigo-200',
    bgLight: 'bg-indigo-50/50',
    borderColor: 'border-indigo-200',
    description: 'Pegawai berpotensi sangat tinggi namun hasil kerjanya belum menonjol.',
    rekomendasiPengembangan: [
      'Penugasan pada proyek tantangan khusus (stretch assignment)',
      'Mentoring langsung dari Pejabat Pimpinan Tinggi / Senior Manager',
      'Pelatihan kepemimpinan dan manajemen waktu',
    ],
    rekomendasiKarir: [
      'Persiapan untuk peran kepemimpinan masa depan',
      'Penyesuaian peranan agar kapabilitas tinggi pegawai dapat tersalurkan',
    ],
  },
  4: {
    box: 4,
    label: 'Box 4: Effective Contributor (Potensi Rendah, Kinerja Sedang)',
    category: 'Pekerja Stabil',
    badgeColor: 'bg-sky-500/10 text-sky-700 border-sky-200',
    bgLight: 'bg-sky-50/50',
    borderColor: 'border-sky-200',
    description: 'Pegawai konsisten memenuhi standar kerja dasar walau potensi pertumbuhan terbatas.',
    rekomendasiPengembangan: [
      'Pelatihan penyegaran (refreshment) tugas rutin',
      'Peningkatan efisiensi kerja dan otomatisasi alur kerja',
    ],
    rekomendasiKarir: [
      'Pengayaan jabatan pada posisi saat ini (job enrichment)',
      'Pertahankan keberadaan pada unit kerja yang stabil',
    ],
  },
  5: {
    box: 5,
    label: 'Box 5: Core Player (Potensi Sedang, Kinerja Sedang)',
    category: 'Kontributor Inti',
    badgeColor: 'bg-blue-500/10 text-blue-700 border-blue-200',
    bgLight: 'bg-blue-50/50',
    borderColor: 'border-blue-200',
    description: 'Pegawai andalan yang menjadi tulang punggung operasional organisasi.',
    rekomendasiPengembangan: [
      'Pelatihan peningkatan kapasitas teknis & kepemimpinan manajerial',
      'Dilibatkan dalam tim kerja lintas unit organisasi',
    ],
    rekomendasiKarir: [
      'Pertimbangan untuk promosi jabatan berkala',
      'Pengembangan karir fungsional lanjutan',
    ],
  },
  6: {
    box: 6,
    label: 'Box 6: High Performer / Future Leader (Potensi Tinggi, Kinerja Sedang)',
    category: 'Kandidat Pemimpin',
    badgeColor: 'bg-purple-500/10 text-purple-700 border-purple-200',
    bgLight: 'bg-purple-50/50',
    borderColor: 'border-purple-200',
    description: 'Pegawai dengan kapasitas potensi tinggi dan capaian kinerja yang memuaskan.',
    rekomendasiPengembangan: [
      'Program Management Development / Leadership Training',
      'Penugasan sebagai ketua tim / project manager',
    ],
    rekomendasiKarir: [
      'Masuk dalam Talent Pool / Suksesi Jabatan',
      'Kandidat promosi jabatan struktural atau fungsional ahli',
    ],
  },
  7: {
    box: 7,
    label: 'Box 7: Solid Professional / Workhorse (Potensi Rendah, Kinerja Tinggi)',
    category: 'Ahli Spesialis',
    badgeColor: 'bg-teal-500/10 text-teal-700 border-teal-200',
    bgLight: 'bg-teal-50/50',
    borderColor: 'border-teal-200',
    description: 'Pegawai menghasilkan kinerja melampaui ekspektasi dalam perannya saat ini.',
    rekomendasiPengembangan: [
      'Sertifikasi keahlian teknis tingkat lanjut (spesialisasi)',
      'Didaulat sebagai narasumber internal atau mentor bagi pegawai muda',
    ],
    rekomendasiKarir: [
      'Penghargaan prestasi kerja (Employee Awards)',
      'Promosi pada jalur karir Fungsional Spesialis',
    ],
  },
  8: {
    box: 8,
    label: 'Box 8: High Achiever / Key Player (Potensi Sedang, Kinerja Tinggi)',
    category: 'Pekerja Kunci',
    badgeColor: 'bg-emerald-500/10 text-emerald-700 border-emerald-200',
    bgLight: 'bg-emerald-50/50',
    borderColor: 'border-emerald-200',
    description: 'Pegawai berkinerja unggul dengan potensi pengembangan manajerial yang baik.',
    rekomendasiPengembangan: [
      'Program sertifikasi eksekutif dan jejaring strategis',
      'Pelatihan perumusan kebijakan dan inovasi organisasi',
    ],
    rekomendasiKarir: [
      'Prioritas utama promosi jabatan target',
      'Pengangkatan dalam Jabatan Fungsional Utama / Pejabat Administrator',
    ],
  },
  9: {
    box: 9,
    label: 'Box 9: Star / Top Talent (Potensi Tinggi, Kinerja Tinggi)',
    category: 'Bintang Talenta (Star)',
    badgeColor: 'bg-amber-500/20 text-amber-900 border-amber-300 font-bold',
    bgLight: 'bg-gradient-to-br from-amber-50 to-orange-50',
    borderColor: 'border-amber-300',
    description: 'Pegawai terbaik (Star) dengan potensi dan kinerja maksimal di tingkat tertinggi.',
    rekomendasiPengembangan: [
      'Program akselerasi kepemimpinan eksekutif',
      'Tugas belajar magister/doktoral atau pemagangan internasional',
      'Dilibatkan langsung dalam penyusunan Rencana Strategis Instansi',
    ],
    rekomendasiKarir: [
      'Kandidat prioritas nomor 1 untuk suksesi Pejabat Pimpinan Tinggi (JPT)',
      'Rotasi ke posisi strategis berisiko tinggi dengan dampak nasional',
    ],
  },
};

export function getBoxInfo(box: number): BoxInfo {
  return BOX_INFO_MAP[box] || BOX_INFO_MAP[5];
}
