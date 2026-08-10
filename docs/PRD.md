# PRODUCT REQUIREMENTS DOCUMENT (PRD)

## Undangan Digital — Puan & Ilham

**STATUS: DRAFT SEMENTARA**

| | |
| --- | --- |
| **Nama Produk** | Undangan Digital — Website Undangan Pernikahan Puan & Ilham |
| **Versi Dokumen** | v0.1 |
| **Disusun oleh** | Ridzuan (Pengembang) |
| **Untuk** | Proyek Personal |
| **Tanggal** | 11 Agustus 2026 |
| **Dokumen Terkait** | Desain Figma (via MCP), Aset Grafik (`assets/`) |

---

# 1. Ringkasan Produk (Overview)

Undangan pernikahan secara fisik memiliki keterbatasan dari segi jangkauan, biaya cetak, dan sulitnya mengelola RSVP dari para tamu. Informasi tanggal, lokasi, dan jadwal acara juga dapat berubah dan sulit diperbarui setelah kartu dicetak.

**Undangan Digital** adalah sebuah website undangan pernikahan pribadi yang dapat diakses melalui satu tautan tunggal secara real-time oleh semua tamu. Website ini mencakup halaman sampul (cover), bagian-bagian utama (ayat Al-Quran, pesan undangan, tanggal & tempat, jadwal acara, dress code, formulir RSVP, dan ucapan tamu), serta satu halaman admin untuk memantau daftar RSVP. Tujuan utamanya adalah menyampaikan undangan secara modern, elegan, dan mudah dikelola.

# 2. Tujuan & Sasaran (Goals)

## 2.1 Tujuan Produk
- Menyampaikan undangan pernikahan secara digital yang elegan dan responsif kepada semua tamu melalui satu tautan.
- Mengumpulkan konfirmasi kehadiran (RSVP) secara otomatis dan terpusat.
- Menyediakan ruang bagi tamu untuk menulis ucapan dan doa.
- Memberikan pengalaman pengguna yang menarik dengan desain yang selaras dengan tema pernikahan.

## 2.2 Metrik Keberhasilan (KPIs)
- 100% tamu dapat mengakses website tanpa error (zero downtime selama periode undangan).
- ≥ 80% tamu yang mengakses website berhasil mengisi RSVP.
- Waktu muat halaman (Largest Contentful Paint) < 3 detik pada koneksi 4G.

# 3. Pengguna & Peran (Users & Roles)

- **Tamu (Guest):** Mengakses website undangan melalui tautan yang dibagikan, melihat semua informasi acara, mengisi formulir RSVP, dan mengirim ucapan/doa.
- **Admin (Pengantin/Pengembang):** Mengakses halaman admin untuk melihat daftar RSVP yang telah dikirim oleh tamu.

# 4. Ruang Lingkup (Scope)

## 4.1 Termasuk (MVP 1)
- Halaman Sampul (Cover Page) sebagai tampilan awal.
- Halaman Utama dengan bagian: Intro, Ayat Al-Quran, Pesan Undangan, Tanggal & Tempat, Jadwal Acara, Dress Code, Formulir RSVP, Ucapan Tamu, dan Footer.
- Formulir RSVP tersimpan ke database (Supabase).
- Formulir Ucapan/Doa Tamu tersimpan dan ditampilkan secara real-time.
- Halaman Admin (dashboard) untuk melihat daftar data RSVP.
- Satu tautan tunggal real-time untuk semua tamu.

## 4.2 Di Luar Lingkup Awal / Fase Lanjutan
- **Virtual Photobooth** — lihat Bab 11.

# 5. Asumsi & Batasan (Assumptions & Constraints)

- **Tech Stack:** Next.js (App Router) + Supabase (PostgreSQL + API) + Vercel (Free Tier).
- **Pendekatan Desain:** Mobile-first; desain Figma telah siap dan akan diimplementasikan melalui Figma MCP.
- **Tipografi:** Times New Roman (serif utama) & Pinyon Script (aksara hiasan/nama).
- **Aset:** Semua aset grafik (SVG, PNG, GIF) telah disediakan di direktori `assets/`. Tidak ada kebutuhan untuk membeli atau membuat aset baru.
- **Batasan Free Tier:**
  - Vercel: 100 GB bandwidth/bulan, serverless function 10s timeout.
  - Supabase Free: 500 MB database, 1 GB file storage, 50.000 monthly active users.
  - *Asumsi pengembang:* Trafik undangan pribadi tidak diperkirakan melebihi batas gratis.
- **Tanpa Autentikasi Tamu:** Tamu mengakses website tanpa perlu login. Halaman admin dilindungi menggunakan **Supabase Auth**.
- **Domain:** Menggunakan domain yang mengandung kata kunci "puan & ilham" (cth: `puandanilham.vercel.app` atau domain kustom serupa). Format akhir domain *TBD*.
- **Batas RSVP:** Maksimum **10 tamu** per pengisian formulir RSVP.
- **RSVP Tidak Dapat Diubah:** Tamu tidak diperbolehkan mengedit atau menghapus RSVP setelah dikirim. Hanya admin yang dapat mengelola data RSVP.

# 6. Kebutuhan Fungsional (Functional Requirements)

## 6.1 Tamu — Halaman Sampul (Cover Page)

| **ID** | **Kebutuhan Fungsional** | **Kriteria Penerimaan (Acceptance Criteria)** | **Prioritas** |
| --- | --- | --- | --- |
| **CVR-1** | Sistem menampilkan halaman sampul sebagai tampilan pertama saat tamu membuka tautan. | Halaman sampul ditampilkan memenuhi layar (full viewport) dengan elemen hiasan, nama pengantin, dan tanggal. | **Wajib** |
| **CVR-2** | Terdapat tombol atau interaksi untuk masuk ke halaman utama. | Tamu dapat klik/scroll untuk beralih dari cover ke bagian utama dengan animasi transisi yang halus. | **Wajib** |

## 6.2 Tamu — Bagian Intro & Ayat Al-Quran

| **ID** | **Kebutuhan Fungsional** | **Kriteria Penerimaan (Acceptance Criteria)** | **Prioritas** |
| --- | --- | --- | --- |
| **INT-1** | Sistem menampilkan bagian pengenalan (Intro) setelah cover page. | Bagian intro menampilkan ilustrasi pengantin dan teks pembuka sesuai desain Figma. | **Wajib** |
| **INT-2** | Sistem menampilkan ayat Al-Quran yang relevan. | Ayat ditampilkan menggunakan aset `Ayat Qur'an with border & bg.svg` yang sudah mencakup teks Arab, terjemahan, border, dan background. | **Wajib** |

## 6.3 Tamu — Pesan Undangan

| **ID** | **Kebutuhan Fungsional** | **Kriteria Penerimaan (Acceptance Criteria)** | **Prioritas** |
| --- | --- | --- | --- |
| **MSG-1** | Sistem menampilkan pesan undangan resmi dari keluarga pengantin. | Teks undangan ditampilkan menggunakan aset `Kalimat Jemputan Revisi (2).svg` yang sudah mencakup kalimat undangan lengkap beserta nama orang tua dan nama pengantin. | **Wajib** |

## 6.4 Tamu — Tanggal & Tempat

| **ID** | **Kebutuhan Fungsional** | **Kriteria Penerimaan (Acceptance Criteria)** | **Prioritas** |
| --- | --- | --- | --- |
| **LOC-1** | Sistem menampilkan tanggal dan lokasi acara pernikahan. | Tanggal (4 September), hari, dan waktu ditampilkan dengan jelas bersama ilustrasi kalender. Alamat teks lokasi diambil dari desain Figma. | **Wajib** |
| **LOC-2** | Terdapat tautan navigasi ke lokasi acara. | Tombol/tautan mengarah ke Google Maps (tautan *TBD*, akan disediakan kemudian). Opsi navigasi Waze juga disediakan. | **Wajib** |

## 6.5 Tamu — Jadwal Acara (Event Schedule)

| **ID** | **Kebutuhan Fungsional** | **Kriteria Penerimaan (Acceptance Criteria)** | **Prioritas** |
| --- | --- | --- | --- |
| **SCH-1** | Sistem menampilkan jadwal susunan acara. | Daftar susunan acara (waktu dan aktivitas) ditampilkan dalam format visual yang mudah dibaca sesuai aset `Atur Cara Fix.svg`. | **Wajib** |

## 6.6 Tamu — Dress Code

| **ID** | **Kebutuhan Fungsional** | **Kriteria Penerimaan (Acceptance Criteria)** | **Prioritas** |
| --- | --- | --- | --- |
| **DRS-1** | Sistem menampilkan panduan dress code acara. | Ilustrasi dan warna dress code ditampilkan menggunakan aset `Dress Code Illustration.svg`. | **Wajib** |

## 6.7 Tamu — Formulir RSVP

| **ID** | **Kebutuhan Fungsional** | **Kriteria Penerimaan (Acceptance Criteria)** | **Prioritas** |
| --- | --- | --- | --- |
| **RSV-1** | Tamu dapat mengisi formulir RSVP yang mencakup nama, status kehadiran, dan jumlah tamu. | Formulir memiliki field: nama (wajib), status kehadiran (Hadir/Tidak Hadir), dan jumlah tamu (angka, maks 10). Validasi dilakukan sebelum pengiriman. Jika jumlah tamu > 10, sistem menampilkan pesan error. | **Wajib** |
| **RSV-4** | Tamu tidak dapat mengedit atau menghapus RSVP yang sudah dikirim. | Setelah RSVP berhasil dikirim, tidak ada opsi edit atau hapus yang tersedia bagi tamu. Hanya admin yang dapat mengelola data RSVP. | **Wajib** |
| **RSV-2** | Data RSVP disimpan ke database Supabase. | Setelah dikirim, data berhasil tersimpan ke tabel `rsvps` di Supabase dan tamu menerima umpan balik berhasil. | **Wajib** |
| **RSV-3** | Sistem menampilkan pesan konfirmasi setelah RSVP berhasil dikirim. | Pesan "Terima kasih" atau sejenisnya ditampilkan setelah formulir berhasil dikirim. | **Wajib** |

## 6.8 Tamu — Ucapan & Doa Tamu

| **ID** | **Kebutuhan Fungsional** | **Kriteria Penerimaan (Acceptance Criteria)** | **Prioritas** |
| --- | --- | --- | --- |
| **WSH-1** | Tamu dapat mengirim ucapan atau doa melalui formulir. | Formulir memiliki field: nama (wajib) dan pesan ucapan/doa (wajib). | **Wajib** |
| **WSH-2** | Ucapan tamu ditampilkan secara real-time di halaman. | Ucapan baru muncul tanpa perlu memuat ulang halaman (Supabase Realtime atau polling). | **Penting** |
| **WSH-3** | Data ucapan disimpan ke database Supabase. | Data berhasil tersimpan ke tabel `wishes` di Supabase. | **Wajib** |

## 6.9 Tamu — Footer

| **ID** | **Kebutuhan Fungsional** | **Kriteria Penerimaan (Acceptance Criteria)** | **Prioritas** |
| --- | --- | --- | --- |
| **FTR-1** | Sistem menampilkan bagian footer di akhir halaman. | Footer mengandung kredit, tanggal acara ringkas, dan elemen hiasan sesuai desain Figma. | **Wajib** |

## 6.10 Admin — Dashboard RSVP

| **ID** | **Kebutuhan Fungsional** | **Kriteria Penerimaan (Acceptance Criteria)** | **Prioritas** |
| --- | --- | --- | --- |
| **ADM-1** | Admin dapat mengakses halaman dashboard RSVP melalui rute khusus (cth: `/admin`). | Halaman admin dilindungi menggunakan **Supabase Auth**. Admin harus login terlebih dahulu. Tamu biasa yang mengakses `/admin` diarahkan ke halaman login. | **Wajib** |
| **ADM-2** | Dashboard menampilkan daftar semua data RSVP yang telah dikirim. | Tabel menampilkan: nama tamu, status kehadiran, jumlah tamu, dan waktu pengiriman. | **Wajib** |
| **ADM-3** | Dashboard menampilkan ringkasan statistik RSVP. | Menampilkan jumlah total RSVP, jumlah yang hadir, jumlah yang tidak hadir, dan jumlah keseluruhan tamu yang diperkirakan. | **Penting** |
| **ADM-4** | Admin dapat mengelola (mengedit/menghapus) data RSVP. | Admin memiliki opsi untuk mengedit atau menghapus entri RSVP dari dashboard. Tamu sendiri tidak memiliki akses ini. | **Penting** |

# 7. Alur Pengguna Utama (Key User Flows)

## 7.1 Alur Tamu — Lihat Undangan & RSVP

1. Tamu menerima tautan undangan melalui WhatsApp/media sosial.
2. Tamu membuka tautan → Halaman Sampul (Cover Page) ditampilkan.
3. Tamu klik tombol atau scroll ke bawah → Masuk ke Halaman Utama.
4. Tamu membaca bagian Intro, Ayat Al-Quran, Pesan Undangan, Tanggal & Tempat, Jadwal Acara, dan Dress Code secara berurutan.
5. Tamu mengisi formulir RSVP (nama, status kehadiran, jumlah tamu) → Klik kirim.
6. Sistem menyimpan data ke Supabase → Pesan konfirmasi ditampilkan.
7. Tamu menulis ucapan/doa → Klik kirim → Ucapan ditampilkan di daftar ucapan.
8. Tamu melihat ucapan-ucapan lain dari tamu lain.

## 7.2 Alur Admin — Memantau RSVP

1. Admin membuka rute `/admin`.
2. Sistem memeriksa autentikasi via Supabase Auth → Jika belum login, diarahkan ke halaman login → Setelah login berhasil, dashboard ditampilkan.
3. Admin melihat ringkasan statistik (jumlah hadir, tidak hadir, total tamu).
4. Admin melihat tabel daftar RSVP dengan detail setiap tamu.

# 8. Model Data (High-Level)

| **Entitas** | **Field Utama** | **Keterangan** |
| --- | --- | --- |
| **rsvps** | `id` (uuid, PK), `name` (text), `attendance` (text: 'hadir'/'tidak_hadir'), `guest_count` (integer, maks 10), `created_at` (timestamptz) | Menyimpan data RSVP setiap tamu. Tamu tidak dapat mengedit/menghapus setelah dikirim. |
| **wishes** | `id` (uuid, PK), `name` (text), `message` (text), `created_at` (timestamptz) | Menyimpan ucapan dan doa tamu. |

# 9. Kebutuhan Non-Fungsional (Non-Functional Requirements)

- **Responsif (Mobile-First):** Website wajib menampilkan desain yang optimal pada perangkat mobile (≥ 360px) dan menyesuaikan diri pada tablet serta desktop.
- **Performa:** Largest Contentful Paint (LCP) < 3 detik pada koneksi 4G. Gunakan Next.js Image Optimization untuk aset besar (PNG). Aset SVG dimuat secara inline atau lazy-loaded.
- **Keamanan Admin:** Halaman `/admin` dilindungi menggunakan **Supabase Auth**. Admin wajib login sebelum dapat mengakses dashboard.
- **SEO & Aksesibilitas:** Metadata (title, description, og:image) dikonfigurasi untuk tampilan tautan yang baik di WhatsApp dan media sosial. Alt text disediakan untuk semua gambar.
- **Ketersediaan:** Di-host pada Vercel dengan CDN global; target uptime 99.9%.

# 10. Integrasi Pihak Ketiga

| **Layanan** | **Fungsi** | **Catatan** |
| --- | --- | --- |
| **Supabase** | Database (PostgreSQL), API, Realtime subscriptions untuk RSVP & Ucapan, dan **Auth** untuk proteksi halaman admin. | Free Tier. |
| **Vercel** | Hosting, CDN, dan deployment otomatis dari repositori Git. | Free Tier. |
| **Google Maps / Waze** | Tautan navigasi ke lokasi acara. | Deeplink saja, tidak memerlukan API key. |
| **Figma (MCP)** | Sumber desain UI; diakses melalui Figma MCP untuk implementasi pixel-perfect. | Selama pengembangan saja. |

# 11. Fitur Usulan / Fase Lanjutan (MVP 2)

- **Virtual Photobooth.** Memungkinkan tamu mengambil gambar atau mengunggah foto mereka dengan bingkai/filter bertema pernikahan. Foto dikumpulkan dalam galeri digital yang dapat dilihat oleh pengantin dan tamu lain. Berkaitan dengan bagian Ucapan Tamu di MVP 1 sebagai kelanjutan interaksi sosial.

# 12. Pertanyaan Terbuka / TBD

- ~~Nama domain khusus untuk undangan?~~ → **Terjawab:** Domain mengandung kata kunci "puan & ilham". Format akhir domain masih perlu ditentukan.
- ~~Konten teks Ayat Al-Quran?~~ → **Terjawab:** Menggunakan aset `Ayat Qur'an with border & bg.svg`.
- ~~Konten teks pesan undangan?~~ → **Terjawab:** Menggunakan aset `Kalimat Jemputan Revisi (2).svg`.
- ~~Alamat lokasi acara?~~ → **Terjawab:** Alamat dalam bentuk teks akan diambil dari desain Figma. Tautan Google Maps akan dimasukkan kemudian.
- ~~Mekanisme perlindungan admin?~~ → **Terjawab:** Supabase Auth.
- ~~Batas jumlah tamu per RSVP?~~ → **Terjawab:** Maksimum 10 tamu.
- ~~Tamu dapat mengedit/menghapus RSVP?~~ → **Terjawab:** Tidak. Hanya admin yang dapat mengelola data RSVP.
- Musik latar (background music) — akan ditentukan kemudian.

# 13. Glosarium

- **RSVP (Répondez S'il Vous Plaît):** Konfirmasi kehadiran; tamu menyatakan apakah akan hadir atau tidak ke acara.
- **Cover Page:** Halaman sampul / muka depan yang menjadi tampilan pertama saat tamu membuka tautan undangan.
- **Supabase:** Platform Backend-as-a-Service (BaaS) berbasis PostgreSQL yang menyediakan database, API, dan fungsi real-time.
- **Vercel:** Platform hosting untuk aplikasi Next.js dengan deployment otomatis dan CDN global.
- **Figma MCP:** Model Context Protocol untuk mengakses desain Figma secara programatik selama pengembangan.
- **Mobile-First:** Pendekatan desain yang mengutamakan pengalaman pada perangkat mobile sebelum menyesuaikan untuk layar yang lebih besar.

---

## Lampiran: Daftar Aset Tersedia

| **File** | **Keterangan (Perkiraan)** |
| --- | --- |
| `Atur Cara Fix.svg` | Ilustrasi jadwal susunan acara |
| `Ayat Qur'an with border & bg.svg` | Ayat Al-Quran lengkap dengan border dan background |
| `Backgroudn.png` | Gambar latar belakang utama |
| `Border Floral 1.svg` | Hiasan bingkai bunga |
| `Dress Code Illustration.svg` | Ilustrasi panduan dress code |
| `Flower Decoration Pop.gif` | Animasi hiasan bunga |
| `Flower Pattern.png` | Pola bunga (latar / hiasan) |
| `Ilustrasi no bg.png` | Ilustrasi utama (tanpa latar belakang) |
| `Kalimat Jemputan Revisi (2).svg` | Teks pesan undangan resmi |
| `Location Ilustration.svg` | Ikon/ilustrasi lokasi |
| `Puan&Ilham.svg` | Logo/nama pengantin |
| `September 4th Calendar.svg` | Ilustrasi kalender tanggal acara |
| `Title Main Section.svg` | Judul bagian utama |
| `Title Onboarding.svg` | Judul halaman sampul (cover) |

---

*Dokumen ini merupakan draft sementara dan dapat berubah seiring pembahasan lebih lanjut.*
