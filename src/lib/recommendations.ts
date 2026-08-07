export function generateNarrativeRecommendation(box: number): string {
  switch (box) {
    case 1:
      return 'Talenta Berprospek (Potensi Tinggi, Kinerja Rendah): Pegawai memiliki potensi kepemimpinan dan manajerial yang sangat baik namun kinerja saat ini perlu ditingkatkan. Disarankan untuk diberikan pendampingan (coaching/mentoring), penataan ulang beban kerja, dan penetapan target kinerja yang lebih terukur.';
    case 2:
      return 'Talenta Utama (Potensi Tinggi, Kinerja Sedang): Pegawai memiliki potensi sangat baik dengan kinerja yang stabil. Disarankan untuk diberikan proyek strategis, rotasi jabatan untuk memperluas wawasan, serta pelatihan kepemimpinan lanjutan.';
    case 3:
      return 'Talenta Unggul (Potensi Tinggi, Kinerja Tinggi): Pegawai merupakan Top Talent. Disarankan masuk ke dalam Fast-Track Suksesi Jabatan Strategis/Pimpinan, diberikan tugas khusus skala nasional/unit, dan insentif pengembangan karir maksimal.';
    case 4:
      return 'Kontributor Pasif (Potensi Sedang, Kinerja Rendah): Pegawai memerlukan evaluasi menyeluruh terhadap hambatan kerja. Disarankan diberikan bimbingan teknis, pelatihan ulang kompetensi dasar, serta evaluasi rutin bulanan.';
    case 5:
      return 'Kontributor Inti (Potensi Sedang, Kinerja Sedang): Pegawai merupakan tulang punggung operasional. Disarankan diberikan pengayaan tugas (job enrichment), apresiasi berkala, dan peningkatan kompetensi berkala.';
    case 6:
      return 'Kinerja Tinggi (Potensi Sedang, Kinerja Tinggi): Pegawai menunjukkan hasil kerja luar biasa. Disarankan diberikan peran sebagai mentor teknis, promosi ke jabatan fungsional/struktural yang relevan, dan penghargaan kinerja.';
    case 7:
      return 'Perlu Pembinaan (Potensi Rendah, Kinerja Rendah): Pegawai memerlukan konseling karir, pembinaan disiplin kerja, penetapan Rencana Aksi Perbaikan Kinerja (RAPK), atau penyesuaian penempatan kerja.';
    case 8:
      return 'Pekerja Efektif (Potensi Rendah, Kinerja Sedang): Pegawai bekerja secara efisien dalam tugas rutin. Disarankan dipertahankan pada posisi operasional saat ini dengan pemberian apresiasi dan pelatihan motivasi kerja.';
    case 9:
      return 'Ahli Teknis / Spesialis (Potensi Rendah, Kinerja Tinggi): Pegawai sangat menguasai keahlian teknis spesifik. Disarankan diarahkan ke jalur karir Spesialis/Fungsional Ahli, dijadikan narasumber internal, dan diberikan insentif keahlian.';
    default:
      return 'Data posisi box pemetaan talenta belum teridentifikasi. Silakan hubungi Tim Administrasi Talenta SDM.';
  }
}

export interface BoxInfo {
  box: number;
  title: string;
  subtitle: string;
  category: string;
  colorClass: string;
}

export const BOX_DETAILS: Record<number, BoxInfo> = {
  1: { box: 1, title: 'Talenta Berprospek', subtitle: 'Potensi Tinggi, Kinerja Rendah', category: 'High Potential', colorClass: 'from-purple-500 to-indigo-600 text-white' },
  2: { box: 2, title: 'Talenta Utama', subtitle: 'Potensi Tinggi, Kinerja Sedang', category: 'High Potential', colorClass: 'from-violet-600 to-purple-600 text-white' },
  3: { box: 3, title: 'Talenta Unggul', subtitle: 'Potensi Tinggi, Kinerja Tinggi', category: 'Top Talent', colorClass: 'from-pink-500 via-purple-600 to-indigo-600 text-white' },
  4: { box: 4, title: 'Kontributor Pasif', subtitle: 'Potensi Sedang, Kinerja Rendah', category: 'Medium Potential', colorClass: 'from-slate-500 to-indigo-500 text-white' },
  5: { box: 5, title: 'Kontributor Inti', subtitle: 'Potensi Sedang, Kinerja Sedang', category: 'Core Contributor', colorClass: 'from-indigo-500 to-purple-500 text-white' },
  6: { box: 6, title: 'Kinerja Tinggi', subtitle: 'Potensi Sedang, Kinerja Tinggi', category: 'High Performer', colorClass: 'from-violet-500 to-pink-500 text-white' },
  7: { box: 7, title: 'Perlu Pembinaan', subtitle: 'Potensi Rendah, Kinerja Rendah', category: 'Low Potential', colorClass: 'from-slate-600 to-slate-700 text-white' },
  8: { box: 8, title: 'Pekerja Efektif', subtitle: 'Potensi Rendah, Kinerja Sedang', category: 'Solid Performer', colorClass: 'from-slate-500 to-violet-600 text-white' },
  9: { box: 9, title: 'Ahli Teknis / Spesialis', subtitle: 'Potensi Rendah, Kinerja Tinggi', category: 'Specialist', colorClass: 'from-purple-600 to-pink-600 text-white' }
};
