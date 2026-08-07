# CEK KOTAKKU - Aplikasi Manajemen Talenta Pegawai

Aplikasi Manajemen & Pemetaan Talenta Pegawai berbasis **9-Box Talent Matrix**, **Monitoring Career Path**, dan **Sinkronisasi Data Talenta (Excel)**.

## Fitur Utama

1. **Dashboard Talenta**: Grid 9-Box interaktif (Potensi x Kinerja), rincian 11 komponen (7 Potensi + 4 Kinerja), Radar Chart visualisasi balance skor, dan Rekomendasi Karir Strategis.
2. **Career Path (Pegawai)**: Daftar & pengisian kuesioner interaktif (Pilihan Ganda, Checkbox, Dropdown, Skala 1-5, Teks Bebas).
3. **Cari Talenta Pegawai (Admin)**: Pencarian pegawai berdasarkan NIP dengan tampilan lengkap 9-box & profil.
4. **Sinkronisasi Data Excel (Admin)**: Upload file `.xls` / `.xlsx` untuk menggantikan/memperbarui data master pegawai.
5. **Kelola Kuesioner (Admin)**: Pengaturan periode kuesioner dan Question Builder interaktif.
6. **Monitoring Career Path (Admin)**: Ringkasan statistik, Grafik Donut status pengisian, Bar Chart pengisian per Unit, dan Export Excel jawaban.
7. **Keamanan & Autentikasi**: Sesi kustom JWT dalam `httpOnly` cookie, password ter-hash (`bcryptjs`), serta akses server-side Firebase Admin SDK.

## Langkah Setup & Environment

1. Salin `.env.example` ke `.env`:
   ```bash
   cp .env.example .env
   ```
2. Isi variabel di `.env` / Vercel Environment Variables:
   - `FIREBASE_PROJECT_ID`: ID Project Firebase
   - `FIREBASE_CLIENT_EMAIL`: Service Account Email
   - `FIREBASE_PRIVATE_KEY`: Service Account Private Key (pastikan karakter `\n` ditangani)
   - `JWT_SECRET`: Secret key untuk signing cookie sesi JWT

3. Deploy Firestore Rules:
   ```bash
   firebase deploy --only firestore:rules
   ```

4. Menjalankan Server Lokal:
   ```bash
   npm install
   npm run dev
   ```
