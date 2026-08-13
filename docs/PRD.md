# PRODUCT REQUIREMENTS DOCUMENT (PRD)

## Undangan Digital — Puan & Ilham

**STATUS: v0.2 — MVP 2**

| | |
| --- | --- |
| **Nama Produk** | Undangan Digital — Website Undangan Pernikahan Puan & Ilham |
| **Versi Dokumen** | v0.2 |
| **Disusun oleh** | Ridzuan (Pengembang) |
| **Untuk** | Proyek Personal |
| **Tanggal** | 13 Agustus 2026 |
| **Dokumen Terkait** | Desain Figma (via MCP), Aset Grafik (`../public/assets/`) |

---

# 1. Ringkasan Produk (Overview)

Undangan pernikahan secara fisik memiliki keterbatasan dari segi jangkauan, biaya cetak, dan sulitnya mengelola RSVP dari para tamu. Informasi tanggal, lokasi, dan jadwal acara juga dapat berubah dan sulit diperbarui setelah kartu dicetak.

**Undangan Digital** adalah sebuah website undangan pernikahan pribadi yang dapat diakses melalui satu tautan tunggal secara real-time oleh semua tamu. Website ini mencakup halaman sampul (cover), bagian-bagian utama (ayat Al-Quran, pesan undangan, tanggal & tempat, jadwal acara, dress code, formulir RSVP, dan ucapan tamu), satu halaman admin untuk memantau daftar RSVP, serta fitur **Virtual Photobooth** yang memungkinkan tamu mengambil foto dengan bingkai bertema pernikahan dan berbagi kenangan. Tujuan utamanya adalah menyampaikan undangan secara modern, elegan, dan mudah dikelola, sekaligus menciptakan pengalaman interaktif bagi tamu.

# 2. Tujuan & Sasaran (Goals)

## 2.1 Tujuan Produk
- Menyampaikan undangan pernikahan secara digital yang elegan dan responsif kepada semua tamu melalui satu tautan.
- Mengumpulkan konfirmasi kehadiran (RSVP) secara otomatis dan terpusat.
- Menyediakan ruang bagi tamu untuk menulis ucapan dan doa.
- Memberikan pengalaman pengguna yang menarik dengan desain yang selaras dengan tema pernikahan.
- **(MVP 2)** Menyediakan fitur Virtual Photobooth agar tamu dapat mengambil foto, memilih bingkai, menulis pesan, dan membagikan kenangan pernikahan dalam galeri digital bersama.

## 2.2 Metrik Keberhasilan (KPIs)
- 100% tamu dapat mengakses website tanpa error (zero downtime selama periode undangan).
- ≥ 80% tamu yang mengakses website berhasil mengisi RSVP.
- Waktu muat halaman (Largest Contentful Paint) < 3 detik pada koneksi 4G.
- **(MVP 2)** ≥ 50% tamu yang mengakses Photobooth berhasil menyelesaikan alur hingga mengunduh/membagikan foto.
- **(MVP 2)** Ukuran gambar hasil Photobooth ≤ 300 KB setelah kompresi client-side.

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

## 4.2 Termasuk (MVP 2 — Virtual Photobooth)
- Terintegrasi dalam proyek Next.js yang sama, diakses melalui rute `/kenangan-perkahwinan`.
- Halaman Sampul (Cover Page) — identik dengan cover undangan utama.
- Halaman Utama Photobooth dengan bagian: Intro, Galeri Kenangan (Memory Section), dan Footer.
- Alur multi-halaman: Info Pengirim → Pilih Bingkai → Pilih Metode Foto → Kamera / Unggah → Tulis Pesan → Unduh & Bagikan.
- Akses kamera perangkat langsung melalui browser (HTML5 `getUserMedia`).
- Penggabungan foto dan bingkai di sisi klien menggunakan HTML5 Canvas.
- Kompresi gambar hasil akhir (foto + bingkai sudah digabung) di sisi klien (WebP/JPEG) sebelum diunggah ke Supabase Storage.
- Galeri publik menampilkan semua momen yang telah dikirim oleh tamu.
- Semua operasi dioptimalkan untuk batas Vercel + Supabase Free Tier.

## 4.3 Di Luar Lingkup
- Fitur filter wajah / AR (Augmented Reality) pada kamera.
- Video photobooth / GIF animasi.
- Moderasi konten otomatis (AI-based).
- Notifikasi real-time ke admin saat ada foto baru.

# 5. Asumsi & Batasan (Assumptions & Constraints)

- **Tech Stack:** Next.js (App Router) + Supabase (PostgreSQL + API + Storage) + Vercel (Free Tier).
- **Pendekatan Desain:** Mobile-first; desain Figma telah siap dan akan diimplementasikan melalui Figma MCP.
- **Tipografi:** Times New Roman (serif utama) & Pinyon Script (aksara hiasan/nama).
- **Aset:** Semua aset grafik (SVG, PNG, GIF) telah disediakan di direktori `assets/`. Tidak ada kebutuhan untuk membeli atau membuat aset baru. Bingkai Photobooth dan aset Virtual Photobooth (MVP 2) disediakan di direktori `public/assets/`.
- **Batasan Free Tier (KRITIS untuk MVP 2):**
  - Vercel: 100 GB bandwidth/bulan, serverless function 10s timeout.
  - Supabase Free: 500 MB database, 1 GB file storage, 50.000 monthly active users.
  - *Asumsi pengembang:* Trafik undangan pribadi tidak diperkirakan melebihi batas gratis.
  - **(MVP 2)** Kompresi wajib dilakukan di sisi klien sebelum unggah untuk meminimalkan penggunaan storage. Yang diunggah adalah **gambar hasil akhir** (foto + bingkai sudah digabung via Canvas). Target ukuran file ≤ 300 KB per foto.
  - **(MVP 2)** Pagination dan lazy loading wajib diterapkan pada galeri untuk mengurangi bandwidth.
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
| **photobooth_entries** | `id` (uuid, PK), `sender_name` (text), `message` (text, maks 200 karakter), `photo_url` (text), `frame_id` (text), `created_at` (timestamptz) | **(MVP 2)** Menyimpan entri photobooth dari tamu. |
| **photobooth_frames** | `id` (text, PK), `name` (text), `file_path` (text), `is_active` (boolean) | **(MVP 2)** Master data bingkai (opsional — bisa di-hardcode). |

# 9. Kebutuhan Non-Fungsional (Non-Functional Requirements)

- **Responsif (Mobile-First):** Website wajib menampilkan desain yang optimal pada perangkat mobile (≥ 360px) dan menyesuaikan diri pada tablet serta desktop.
- **Performa:** Largest Contentful Paint (LCP) < 3 detik pada koneksi 4G. Gunakan Next.js Image Optimization untuk aset besar (PNG). Aset SVG dimuat secara inline atau lazy-loaded.
- **Keamanan Admin:** Halaman `/admin` dilindungi menggunakan **Supabase Auth**. Admin wajib login sebelum dapat mengakses dashboard.
- **SEO & Aksesibilitas:** Metadata (title, description, og:image) dikonfigurasi untuk tampilan tautan yang baik di WhatsApp dan media sosial. Alt text disediakan untuk semua gambar.
- **Ketersediaan:** Di-host pada Vercel dengan CDN global; target uptime 99.9%.
- **(MVP 2) Izin Kamera:** Sistem harus menangani dengan baik skenario izin kamera ditolak atau tidak tersedia (graceful degradation).
- **(MVP 2) Ukuran Unggah:** Gambar yang diunggah ke Supabase Storage adalah **hasil akhir yang sudah digabung** (foto + bingkai merged via Canvas), bukan foto mentah. Wajib dikompresi di sisi klien; ukuran maksimal 300 KB per file.
- **(MVP 2) Galeri Performa:** MemorySection menggunakan pagination/infinite scroll dan lazy loading gambar untuk menjaga performa pada jumlah entri yang besar.

# 10. Integrasi Pihak Ketiga

| **Layanan** | **Fungsi** | **Catatan** |
| --- | --- | --- |
| **Supabase** | Database (PostgreSQL), API, Realtime subscriptions untuk RSVP & Ucapan, **Storage** untuk foto Photobooth (MVP 2), dan **Auth** untuk proteksi halaman admin. | Free Tier. |
| **Vercel** | Hosting, CDN, dan deployment otomatis dari repositori Git. | Free Tier. |
| **Google Maps / Waze** | Tautan navigasi ke lokasi acara. | Deeplink saja, tidak memerlukan API key. |
| **Figma (MCP)** | Sumber desain UI; diakses melalui Figma MCP untuk implementasi pixel-perfect. | Selama pengembangan saja. |
| **Web Share API** | **(MVP 2)** Membagikan gambar hasil Photobooth ke aplikasi lain di perangkat tamu. | Bawaan browser, tidak memerlukan API key. Fallback ke copy-link jika tidak tersedia. |
| **HTML5 Camera API** | **(MVP 2)** Akses kamera perangkat langsung melalui browser (`getUserMedia`). | Bawaan browser, memerlukan HTTPS. |

# 11. MVP 2 — Virtual Photobooth: Spesifikasi Lengkap

## 11.1 Ringkasan

Fitur **Virtual Photobooth** memungkinkan tamu mengambil foto atau mengunggah gambar dari galeri perangkat, memilih bingkai bertema pernikahan, menulis pesan, lalu mengunduh dan membagikan hasil foto yang telah digabungkan dengan bingkai. Semua foto yang dikirim ditampilkan dalam galeri publik (Memory Section) yang dapat dilihat oleh semua tamu. Fitur ini terintegrasi dalam proyek Next.js yang sama dan diakses melalui rute `/kenangan-perkahwinan`.

## 11.2 Routing & Arsitektur Halaman

| **Rute** | **Halaman** | **Keterangan** |
| --- | --- | --- |
| `/kenangan-perkahwinan` | Cover Page | Halaman sampul identik dengan cover undangan utama (MVP 1). |
| `/kenangan-perkahwinan` | Main Page | Halaman utama Photobooth: IntroSection, MemorySection (galeri publik), Footer. Diakses setelah melewati cover. |
| `/kenangan-perkahwinan/info` | Sender Information Page | Formulir input nama pengirim. |
| `/kenangan-perkahwinan/pilih-bingkai` | Frame Select Page | Antarmuka pemilihan bingkai photobooth. |
| `/kenangan-perkahwinan/metode-foto` | Add Photo Method Page | Pilihan metode: buka kamera perangkat atau unggah dari galeri. |
| `/kenangan-perkahwinan/kamera` | Camera Page | Antarmuka kamera aktif untuk mengambil foto. |
| `/kenangan-perkahwinan/pesan` | Add Messages Page | Formulir pesan + preview real-time hasil penggabungan foto dan bingkai. |
| `/kenangan-perkahwinan/hasil` | Download & Share Page | Layar akhir: tombol Unduh, Bagikan, Ambil Ulang (retake), atau kembali ke Main Page. |

## 11.3 Kebutuhan Fungsional — Virtual Photobooth

### 11.3.1 Tamu — Halaman Sampul Photobooth (Cover Page)

| **ID** | **Kebutuhan Fungsional** | **Kriteria Penerimaan (Acceptance Criteria)** | **Prioritas** |
| --- | --- | --- | --- |
| **PB-CVR-1** | Sistem menampilkan halaman sampul saat tamu mengakses `/kenangan-perkahwinan`. | Halaman sampul identik dengan cover undangan utama (MVP 1). Menampilkan elemen hiasan, nama pengantin, dan tanggal. | **Wajib** |
| **PB-CVR-2** | Terdapat tombol/interaksi untuk masuk ke halaman utama Photobooth. | Tamu dapat klik/scroll untuk beralih dari cover ke halaman utama Photobooth dengan animasi transisi yang halus. | **Wajib** |

### 11.3.2 Tamu — Halaman Utama Photobooth (Main Page)

| **ID** | **Kebutuhan Fungsional** | **Kriteria Penerimaan (Acceptance Criteria)** | **Prioritas** |
| --- | --- | --- | --- |
| **PB-MN-1** | Sistem menampilkan IntroSection sebagai pengantar fitur Photobooth. | Bagian intro menjelaskan fitur Virtual Photobooth secara singkat dengan desain yang selaras dengan tema pernikahan. | **Wajib** |
| **PB-MN-2** | Sistem menampilkan MemorySection berupa galeri publik semua momen yang telah dikirim tamu. | Galeri menampilkan foto-foto hasil Photobooth dari semua tamu dalam format grid/masonry. Setiap item menampilkan foto yang telah digabung dengan bingkai, nama pengirim, dan pesan. Galeri menggunakan **pagination** atau **infinite scroll** dengan lazy loading untuk menghemat bandwidth. | **Wajib** |
| **PB-MN-3** | Terdapat tombol CTA (Call-to-Action) untuk memulai alur Photobooth. | Tombol "Mulai Photobooth" atau sejenisnya mengarahkan tamu ke halaman Sender Information (`/kenangan-perkahwinan/info`). | **Wajib** |
| **PB-MN-4** | Sistem menampilkan Footer di akhir halaman. | Footer mengandung kredit dan elemen hiasan, konsisten dengan desain MVP 1. | **Wajib** |

### 11.3.3 Tamu — Halaman Info Pengirim (Sender Information Page)

| **ID** | **Kebutuhan Fungsional** | **Kriteria Penerimaan (Acceptance Criteria)** | **Prioritas** |
| --- | --- | --- | --- |
| **PB-INF-1** | Tamu mengisi nama sebagai identitas pengirim. | Formulir memiliki field nama (wajib, minimal 2 karakter). Validasi ditampilkan jika field kosong atau kurang dari 2 karakter. | **Wajib** |
| **PB-INF-2** | Setelah mengisi nama, tamu melanjutkan ke halaman Pilih Bingkai. | Tombol "Lanjut" mengarahkan ke halaman Frame Select. Nama disimpan dalam state (client-side) untuk digunakan di langkah selanjutnya. | **Wajib** |

### 11.3.4 Tamu — Halaman Pilih Bingkai (Frame Select Page)

| **ID** | **Kebutuhan Fungsional** | **Kriteria Penerimaan (Acceptance Criteria)** | **Prioritas** |
| --- | --- | --- | --- |
| **PB-FRM-1** | Sistem menampilkan daftar bingkai photobooth yang tersedia. | Tersedia **3 pilihan** bingkai bertema pernikahan yang ditampilkan sebagai thumbnail yang dapat dipilih. Bingkai yang aktif/dipilih memiliki indikator visual (border, highlight). Aset bingkai disimpan di `public/assets/`. | **Wajib** |
| **PB-FRM-2** | Tamu memilih satu bingkai dan melanjutkan ke langkah berikutnya. | Bingkai yang dipilih disimpan dalam state. Tombol "Lanjut" mengarahkan ke halaman Add Photo Method. Tombol "Kembali" tersedia untuk kembali ke langkah sebelumnya. | **Wajib** |

### 11.3.5 Tamu — Halaman Pilih Metode Foto (Add Photo Method Page)

| **ID** | **Kebutuhan Fungsional** | **Kriteria Penerimaan (Acceptance Criteria)** | **Prioritas** |
| --- | --- | --- | --- |
| **PB-MTD-1** | Sistem menampilkan dua opsi untuk menambahkan foto: membuka kamera perangkat atau mengunggah dari galeri. | Dua tombol/kartu ditampilkan: (1) "Buka Kamera" dan (2) "Unggah dari Galeri". Masing-masing memiliki ikon dan deskripsi singkat. | **Wajib** |
| **PB-MTD-2** | Opsi "Buka Kamera" mengarahkan ke halaman Camera Page. | Navigasi ke `/kenangan-perkahwinan/kamera`. | **Wajib** |
| **PB-MTD-3** | Opsi "Unggah dari Galeri" membuka dialog pemilih file perangkat. | Input file menerima format gambar (JPEG, PNG, WebP). Setelah file dipilih, tamu langsung diarahkan ke halaman Add Messages dengan foto yang dipilih. | **Wajib** |
| **PB-MTD-4** | Sistem menangani kasus perangkat tidak mendukung kamera. | Jika `getUserMedia` tidak tersedia atau izin kamera ditolak, opsi "Buka Kamera" di-disable atau menampilkan pesan informatif. Tamu tetap dapat mengunggah dari galeri. | **Wajib** |

### 11.3.6 Tamu — Halaman Kamera (Camera Page)

| **ID** | **Kebutuhan Fungsional** | **Kriteria Penerimaan (Acceptance Criteria)** | **Prioritas** |
| --- | --- | --- | --- |
| **PB-CAM-1** | Sistem mengakses kamera perangkat melalui browser menggunakan HTML5 `getUserMedia` API. | Stream kamera ditampilkan secara live di viewport. Kamera depan (facing: user) digunakan sebagai default. | **Wajib** |
| **PB-CAM-2** | Tamu dapat mengambil foto dengan tombol capture. | Tombol shutter/capture menangkap frame dari video stream dan menyimpannya sebagai data gambar (Blob/Data URL). | **Wajib** |
| **PB-CAM-3** | Tamu dapat beralih antara kamera depan dan belakang (jika tersedia). | Tombol toggle kamera tersedia. Jika perangkat hanya memiliki satu kamera, tombol tidak ditampilkan. | **Penting** |
| **PB-CAM-4** | Setelah foto berhasil diambil, tamu melihat preview dan dapat melanjutkan atau mengulang. | Preview foto ditampilkan setelah capture. Tombol "Gunakan Foto" mengarahkan ke halaman Add Messages. Tombol "Ambil Ulang" kembali ke mode kamera live. | **Wajib** |
| **PB-CAM-5** | Kamera stream dihentikan saat meninggalkan halaman. | Stream `MediaStream` di-stop (semua tracks) saat navigasi keluar untuk menghemat sumber daya perangkat dan mematikan indikator kamera. | **Wajib** |

### 11.3.7 Tamu — Halaman Tulis Pesan (Add Messages Page)

| **ID** | **Kebutuhan Fungsional** | **Kriteria Penerimaan (Acceptance Criteria)** | **Prioritas** |
| --- | --- | --- | --- |
| **PB-MSG-1** | Tamu dapat menulis pesan/ucapan yang menyertai foto. | Formulir memiliki field pesan (textarea, wajib, maks 200 karakter). Penghitung karakter ditampilkan secara real-time. | **Wajib** |
| **PB-MSG-2** | Sistem menampilkan preview real-time hasil penggabungan foto dan bingkai. | Preview menunjukkan foto tamu yang telah digabung (merged) dengan bingkai yang dipilih sebelumnya. Preview di-render menggunakan HTML5 Canvas atau overlay CSS. Preview diperbarui secara real-time saat tamu mengubah foto/bingkai. | **Wajib** |
| **PB-MSG-3** | Tamu mengirim foto dan pesan. | Tombol "Kirim" memicu proses: (1) Penggabungan final foto + bingkai menggunakan HTML5 Canvas, (2) Kompresi gambar hasil gabungan (WebP preferred, fallback JPEG, kualitas ≤ 0.8, target ≤ 300 KB), (3) Unggah **gambar hasil akhir yang sudah digabung** (bukan foto mentah) ke Supabase Storage, (4) Simpan metadata (nama, pesan, URL foto hasil, ID bingkai, timestamp) ke tabel `photobooth_entries` di Supabase. Loading indicator ditampilkan selama proses. Foto mentah (sebelum digabung) **tidak** diunggah/disimpan ke server. | **Wajib** |
| **PB-MSG-4** | Sistem menangani error saat pengiriman. | Jika unggah atau penyimpanan gagal, pesan error informatif ditampilkan dan tamu dapat mencoba kembali tanpa kehilangan data yang sudah diisi. | **Wajib** |

### 11.3.8 Tamu — Halaman Unduh & Bagikan (Download & Share Page)

| **ID** | **Kebutuhan Fungsional** | **Kriteria Penerimaan (Acceptance Criteria)** | **Prioritas** |
| --- | --- | --- | --- |
| **PB-DL-1** | Sistem menampilkan hasil akhir foto yang telah digabung dengan bingkai. | Gambar hasil ditampilkan dalam resolusi penuh dengan nama pengirim dan pesan di bawahnya. | **Wajib** |
| **PB-DL-2** | Tamu dapat mengunduh gambar hasil ke perangkat. | Tombol "Unduh" memicu download gambar dalam format WebP/JPEG. Nama file mengandung identitas (cth: `kenangan-puan-ilham-[nama].webp`). | **Wajib** |
| **PB-DL-3** | Tamu dapat membagikan gambar hasil melalui mekanisme share perangkat. | Tombol "Bagikan" menggunakan Web Share API (`navigator.share`). Jika Web Share API tidak tersedia, fallback ke tombol salin tautan (copy link) atau opsi share manual. | **Wajib** |
| **PB-DL-4** | Tamu dapat mengambil foto baru (Retake). | Tombol "Ambil Foto Lagi" mengarahkan kembali ke halaman Sender Information untuk memulai alur dari awal. | **Wajib** |
| **PB-DL-5** | Tamu dapat kembali ke halaman utama Photobooth. | Tombol "Kembali ke Galeri" mengarahkan ke Main Page (`/kenangan-perkahwinan`). | **Wajib** |

## 11.4 Alur Pengguna — Virtual Photobooth

### 11.4.1 Alur Tamu — Mengambil & Membagikan Foto

1. Tamu mengakses `/kenangan-perkahwinan` → **Halaman Sampul (Cover Page)** ditampilkan (identik dengan cover undangan).
2. Tamu klik tombol atau scroll → Masuk ke **Halaman Utama Photobooth**.
3. Tamu melihat IntroSection dan **MemorySection** (galeri semua momen tamu lain).
4. Tamu klik tombol **"Mulai Photobooth"** → Navigasi ke **Halaman Info Pengirim**.
5. Tamu mengisi **nama** → Klik "Lanjut" → Navigasi ke **Halaman Pilih Bingkai**.
6. Tamu memilih **bingkai** dari daftar yang tersedia → Klik "Lanjut" → Navigasi ke **Halaman Pilih Metode Foto**.
7. Tamu memilih metode:
   - **Opsi A: Buka Kamera** → Navigasi ke **Halaman Kamera** → Tamu mengambil foto → Preview ditampilkan → Klik "Gunakan Foto".
   - **Opsi B: Unggah dari Galeri** → Dialog pemilih file terbuka → Tamu memilih gambar.
8. Navigasi ke **Halaman Tulis Pesan** → Tamu melihat **preview real-time** foto + bingkai → Tamu menulis pesan.
9. Tamu klik **"Kirim"** → Proses di sisi klien: penggabungan foto + bingkai via Canvas → kompresi hasil akhir → unggah **gambar hasil gabungan** ke Supabase Storage → simpan metadata.
10. Navigasi ke **Halaman Unduh & Bagikan** → Tamu dapat:
    - **Unduh** gambar hasil.
    - **Bagikan** via Web Share API.
    - **Ambil Foto Lagi** (kembali ke langkah 4).
    - **Kembali ke Galeri** (kembali ke Halaman Utama).

### 11.4.2 Alur Tamu — Melihat Galeri Kenangan

1. Tamu mengakses `/kenangan-perkahwinan` → Cover → Halaman Utama.
2. Tamu scroll ke **MemorySection** → Galeri menampilkan semua foto dari tamu lain.
3. Galeri dimuat secara bertahap (lazy loading / pagination) untuk menghemat bandwidth.
4. Tamu dapat melihat detail setiap entri: foto + bingkai (merged), nama pengirim, dan pesan.

## 11.5 Spesifikasi Teknis & Batasan (MVP 2)

| **Aspek** | **Spesifikasi** | **Detail** |
| --- | --- | --- |
| **Akses Kamera** | HTML5 `navigator.mediaDevices.getUserMedia()` | Akses kamera langsung melalui browser tanpa plugin/library tambahan. Dukungan kamera depan (default) dan belakang. |
| **Penggabungan Foto + Bingkai** | HTML5 Canvas API | Proses merge sepenuhnya di sisi klien. Foto di-render di layer pertama, bingkai di-overlay sebagai layer kedua pada Canvas. Resolusi output disesuaikan dengan ukuran bingkai. |
| **Kompresi Gambar** | Client-side compression | Format output: WebP (preferred), JPEG (fallback untuk browser yang tidak mendukung WebP). Kualitas: ≤ 0.8. Target ukuran: ≤ 300 KB per gambar. Kompresi dilakukan menggunakan `canvas.toBlob()` atau `canvas.toDataURL()`. |
| **Penyimpanan Gambar** | Supabase Storage | **Hanya gambar hasil akhir** (foto + bingkai sudah digabung via Canvas) yang diunggah ke bucket `photobooth` di Supabase Storage. Foto mentah tidak disimpan di server. Penamaan file: `{uuid}.webp` atau `{uuid}.jpg`. |
| **Penyimpanan Metadata** | Supabase PostgreSQL | Data tersimpan di tabel `photobooth_entries`. |
| **Optimasi Free Tier** | **KRITIS** | (1) Kompresi wajib di client sebelum unggah. (2) Lazy loading & pagination pada galeri. (3) Thumbnail generation di client untuk tampilan galeri. (4) Cache-Control headers pada aset statis. (5) Hindari serverless function yang berjalan lama. (6) Monitoring penggunaan storage secara berkala. |
| **Bingkai Photobooth** | Aset statis (PNG transparan) | Disimpan di direktori `public/assets/` sebagai aset statis. Tersedia 3 pilihan bingkai. Tidak diunggah ke Supabase Storage (menghemat storage). |
| **Browser Support** | Modern browsers | Chrome, Safari, Firefox, Edge (versi terbaru). `getUserMedia` memerlukan HTTPS. |

## 11.6 Model Data Tambahan (MVP 2)

| **Entitas** | **Field Utama** | **Keterangan** |
| --- | --- | --- |
| **photobooth_entries** | `id` (uuid, PK), `sender_name` (text, NOT NULL), `message` (text, NOT NULL, maks 200 karakter), `photo_url` (text, NOT NULL — URL gambar hasil akhir (foto + bingkai sudah digabung) di Supabase Storage), `frame_id` (text, NOT NULL — identifier bingkai yang digunakan), `created_at` (timestamptz, default NOW()) | Menyimpan setiap entri photobooth dari tamu. `photo_url` merujuk ke gambar yang sudah di-merge, bukan foto mentah. |
| **photobooth_frames** | `id` (text, PK), `name` (text), `file_path` (text — path relatif di `public/assets/`), `is_active` (boolean, default true) | Master data bingkai yang tersedia (3 bingkai). Opsional: bisa juga di-hardcode sebagai konfigurasi statis mengingat jumlah bingkai tetap (3) dan jarang berubah. |

# 12. Pertanyaan Terbuka / TBD

- ~~Nama domain khusus untuk undangan?~~ → **Terjawab:** Domain mengandung kata kunci "puan & ilham". Format akhir domain masih perlu ditentukan.
- ~~Konten teks Ayat Al-Quran?~~ → **Terjawab:** Menggunakan aset `Ayat Qur'an with border & bg.svg`.
- ~~Konten teks pesan undangan?~~ → **Terjawab:** Menggunakan aset `Kalimat Jemputan Revisi (2).svg`.
- ~~Alamat lokasi acara?~~ → **Terjawab:** Alamat dalam bentuk teks akan diambil dari desain Figma. Tautan Google Maps akan dimasukkan kemudian.
- ~~Mekanisme perlindungan admin?~~ → **Terjawab:** Supabase Auth.
- ~~Batas jumlah tamu per RSVP?~~ → **Terjawab:** Maksimum 10 tamu.
- ~~Tamu dapat mengedit/menghapus RSVP?~~ → **Terjawab:** Tidak. Hanya admin yang dapat mengelola data RSVP.
- Musik latar (background music) — akan ditentukan kemudian.
- ~~**(MVP 2)** Desain bingkai photobooth?~~ → **Terjawab:** Tersedia 3 pilihan bingkai. Aset bingkai dan aset Virtual Photobooth lainnya disimpan di `public/assets/`.
- ~~**(MVP 2)** Apakah perlu moderasi manual oleh admin sebelum foto tampil di galeri publik?~~ → **Terjawab:** Tidak perlu. Foto langsung tampil di galeri publik setelah diunggah.
- ~~**(MVP 2)** Batas maksimal jumlah entri photobooth per tamu (rate limiting)?~~ → **Terjawab:** Tidak perlu rate limiting.

# 13. Glosarium

- **RSVP (Répondez S'il Vous Plaît):** Konfirmasi kehadiran; tamu menyatakan apakah akan hadir atau tidak ke acara.
- **Cover Page:** Halaman sampul / muka depan yang menjadi tampilan pertama saat tamu membuka tautan undangan.
- **Supabase:** Platform Backend-as-a-Service (BaaS) berbasis PostgreSQL yang menyediakan database, API, dan fungsi real-time.
- **Supabase Storage:** Layanan penyimpanan file (object storage) dari Supabase, digunakan untuk menyimpan gambar hasil Photobooth.
- **Vercel:** Platform hosting untuk aplikasi Next.js dengan deployment otomatis dan CDN global.
- **Figma MCP:** Model Context Protocol untuk mengakses desain Figma secara programatik selama pengembangan.
- **Mobile-First:** Pendekatan desain yang mengutamakan pengalaman pada perangkat mobile sebelum menyesuaikan untuk layar yang lebih besar.
- **Virtual Photobooth:** Fitur yang memungkinkan tamu mengambil foto, memilih bingkai, dan membagikan kenangan pernikahan secara digital.
- **HTML5 Canvas:** Elemen HTML5 untuk menggambar grafik 2D secara programatik, digunakan untuk menggabungkan foto dan bingkai.
- **getUserMedia:** API browser (bagian dari WebRTC) yang memungkinkan akses ke kamera dan mikrofon perangkat pengguna.
- **Web Share API:** API browser yang memungkinkan aplikasi web berbagi konten (teks, URL, file) ke aplikasi lain di perangkat.
- **Client-side Compression:** Proses mengecilkan ukuran file gambar di sisi browser sebelum diunggah ke server, untuk menghemat bandwidth dan storage.
- **Memory Section:** Bagian galeri publik pada halaman Photobooth yang menampilkan semua momen/foto yang telah dikirim oleh tamu.

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
| `Title Photobooth.svg` | Judul Web Photobooth  |
| `Strip Photobooth 4 Photo.svg` | bingkai Photobooth 4 Photo|
| `Strip Photobooth 2 Photo.svg` | bingkai Photobooth 2 Photo|
| `Strip Photobooth 1 Photo.svg` | bingkai Photobooth 1 Photo|
---

