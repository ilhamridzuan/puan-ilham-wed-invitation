# 🚀 Implementation Prompt — All Improvements

> **Instruksi**: Prompt di bawah ini sudah siap pakai. Anda bisa langsung paste ke sesi baru atau gunakan dengan `/goal`. Review dan sesuaikan bagian yang ditandai `[SESUAIKAN]` sebelum menjalankan.

---

## Prompt

```
Kamu adalah coding assistant yang akan mengimplementasikan serangkaian perbaikan dan fitur baru pada proyek undangan digital pernikahan "Puan & Ilham". Proyek ini menggunakan Next.js 16 (App Router), React 19, Supabase (PostgreSQL + Auth + Storage + Realtime), Tailwind CSS v4, dan Framer Motion. Di-deploy di Vercel Free Tier.

Referensi penting:
- PRD lengkap: `docs/PRD.md`
- Source code utama: `puandanilham/src/`
- Aset grafik: `puandanilham/public/assets/` dan `assets/` (root)
- Migrasi database: `puandanilham/supabase/migrations/`
- Package manifest: `puandanilham/package.json`

---

# FASE 1: PERBAIKAN KRITIS

Kerjakan seluruh item di fase ini terlebih dahulu sebelum lanjut ke fase berikutnya.

## 1.1 — Fix Auth Middleware (proxy.ts → middleware.ts)

**Masalah**: File `src/proxy.ts` berisi logika auth guard untuk `/admin`, tetapi Next.js hanya mengenali file bernama `middleware.ts` di root `src/` atau project root. Halaman admin kemungkinan tidak terlindungi.

**Tugas**:
1. Baca `src/proxy.ts` dan pahami logikanya.
2. Rename atau buat file baru `src/middleware.ts` yang mengimplementasikan logika yang sama menggunakan konvensi Next.js middleware yang benar.
3. Export `config` dengan `matcher` yang menargetkan `/admin/:path*` (kecuali `/admin/login`).
4. Pastikan middleware menggunakan `createServerClient` dari `@supabase/ssr` dengan `NextRequest`/`NextResponse` cookies.
5. Hapus `src/proxy.ts` setelah migrasi selesai.
6. Verifikasi: Jalankan `npm run build` dan pastikan tidak ada error.

**Referensi pattern middleware Supabase + Next.js**:
```typescript
// src/middleware.ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // ... auth check logic
}

export const config = {
  matcher: ['/admin/:path*'],
}
```

## 1.2 — Optimasi Ukuran Aset

**Masalah**: Beberapa aset berukuran sangat besar yang akan memperlambat loading di mobile:
- `Ilustrasi no bg.png` (~19.8 MB)
- `Border Floral 1.svg` (~6 MB)  
- `Flower Decoration Pop.gif` (~5.4 MB)
- `Backgroudn.png` (~3.4 MB)

**Tugas**:
1. **PNG besar → WebP**: Buat script Node.js di `puandanilham/scripts/optimize-assets.js` yang menggunakan `sharp` (install sebagai devDependency) untuk mengonversi:
   - `Ilustrasi no bg.png` → WebP dengan quality 80, resize ke max width 1200px (mobile-first, tidak perlu resolusi penuh)
   - `Backgroudn.png` → WebP dengan quality 75
   - Simpan hasil di `public/assets/optimized/` dengan nama file kebab-case

2. **GIF → Video loop**: Konversi `Flower Decoration Pop.gif` menjadi WebM dan MP4 menggunakan ffmpeg command (tulis instruksi di README atau buat script). Jika ffmpeg tidak tersedia, minimal compress GIF menggunakan sharp/gifsicle. Update komponen yang menggunakannya untuk menggunakan `<video>` tag dengan `autoPlay loop muted playsInline`.

3. **SVG besar**: Untuk `Border Floral 1.svg` (6 MB), periksa apakah SVG bisa disederhanakan (remove metadata, minify paths). Gunakan SVGO jika memungkinkan. Jika tidak bisa dikurangi secara signifikan, pertimbangkan rasterize ke WebP.

4. **Update semua referensi** di komponen React yang menggunakan aset lama ke aset yang sudah dioptimasi.

5. **Pastikan gunakan `next/image`** dengan props `sizes`, `quality`, dan `placeholder="blur"` (jika applicable) untuk semua gambar raster di komponen.

**Constraint**: Jangan hapus aset asli, simpan sebagai backup. Hanya update referensi di code.

## 1.3 — Rename File Aset (Hapus Spasi & Karakter Khusus)

**Masalah**: File aset menggunakan nama dengan spasi, tanda kurung, ampersand, dan apostrof yang bisa bermasalah di URL encoding.

**Tugas**:
1. Buat mapping rename untuk SEMUA file di `public/assets/`:

   | Nama Lama | Nama Baru |
   |---|---|
   | `Atur Cara Fix.svg` | `atur-cara.svg` |
   | `Ayat Qur'an with border & bg.svg` | `ayat-quran-border-bg.svg` |
   | `Backgroudn.png` | `background.png` (fix typo juga) |
   | `Border Floral 1.svg` | `border-floral.svg` |
   | `Dress Code Illustration.svg` | `dress-code-illustration.svg` |
   | `Flower Decoration Pop.gif` | `flower-decoration-pop.gif` |
   | `Flower Pattern.png` | `flower-pattern.png` |
   | `Ilustrasi no bg.png` | `ilustrasi-no-bg.png` |
   | `Kalimat Jemputan Fix.svg` | `kalimat-jemputan.svg` |
   | `Kalimat Jemputan (gelar lengkap).svg` | `kalimat-jemputan-gelar-lengkap.svg` |
   | `Location Ilustration.svg` | `location-illustration.svg` |
   | `Puan&Ilham.svg` | `puan-dan-ilham.svg` |
   | `September 4th Calendar.svg` | `september-4th-calendar.svg` |
   | `Title Main Section.svg` | `title-main-section.svg` |
   | `Title Onboarding.svg` | `title-onboarding.svg` |
   | `Title Photobooth.svg` | `title-photobooth.svg` |
   | `Strip Photobooth 1 Photo.svg` | `strip-photobooth-1-photo.svg` |
   | `Strip Photobooth 2 Photo.svg` | `strip-photobooth-2-photo.svg` |
   | `Strip Photobooth 4 Photo.svg` | `strip-photobooth-4-photo.svg` |
   | `Date&Time.svg` | `date-time.svg` |
   | `Ilustrasi with border.svg` | `ilustrasi-with-border.svg` |
   | `Logo Website Jemputan.svg` | `logo-website-jemputan.svg` |
   | `Texture.png` | `texture.png` |
   | `Dayang Nurfaizah, Hael Husaini - Gurindam Jiwa (Official Music Video).mp3` | `gurindam-jiwa.mp3` |

2. Rename semua file sesuai mapping di atas.
3. Lakukan **search & replace** di SELURUH codebase (`src/`, `puandanilham/`) untuk mengupdate semua referensi ke nama file baru.
4. Verifikasi: Jalankan `npm run build` dan pastikan tidak ada broken reference.

## 1.4 — Konversi Bahasa Melayu Malaysia → Melayu Kepulauan Riau / Indonesia Formal

**Konteks**: Undangan ini didesain dengan nuansa **Melayu Kepulauan Riau**. Istilah-istilah khas Melayu seperti "Majelis Perkahwinan", "Kenangan Perkahwinan", "Jemputan", dan "Atur Cara" HARUS DIPERTAHANKAN karena memang bagian dari identitas desain. Namun, beberapa teks saat ini menggunakan **bahasa Melayu Malaysia** (contoh: "Sila", "cuba", "Muzik", "Seterusnya", "Tarikh") yang perlu diubah ke padanan **Melayu Kepri / Indonesia formal**.

**YANG HARUS DIPERTAHANKAN (JANGAN UBAH):**
- `Majelis Perkahwinan` — istilah khas Melayu, tetap dipertahankan di semua tempat
- `Kenangan Perkahwinan` — istilah khas Melayu, tetap dipertahankan di semua tempat
- `Jemputan` — istilah Melayu Kepri untuk "undangan", tetap dipertahankan
- `Atur Cara` / `Aturcara` — istilah Melayu untuk "susunan acara", tetap dipertahankan
- Seluruh isi konten undangan dan photobooth yang sudah didesain (teks ayat, kalimat jemputan, jadwal, heading, subtitle)
- Teks yang sudah dalam bahasa Indonesia dan sudah benar

**YANG HARUS DIUBAH:**
Kata-kata **Melayu Malaysia** yang TIDAK digunakan di Melayu Kepri / Indonesia formal.

**Tugas**: Lakukan perubahan string berikut secara file-by-file. Gunakan search & replace yang presisi.

---

### File: `src/components/MainPage.tsx`
| Teks Lama (Melayu Malaysia) | Teks Baru (Indonesia / Melayu Kepri) | Kategori |
|---|---|---|
| `aria-label="Memuatkan..."` | `aria-label="Memuat..."` | Accessibility |

### File: `src/components/MusicPlayer.tsx`
| Teks Lama | Teks Baru | Kategori |
|---|---|---|
| `"Jeda Muzik"` | `"Jeda Musik"` | Accessibility |
| `"Main Muzik"` | `"Putar Musik"` | Accessibility |

### File: `src/components/sections/DateLocationSection.tsx`
| Teks Lama | Teks Baru | Kategori |
|---|---|---|
| `aria-label="Tarikh & Lokasi"` | `aria-label="Tanggal & Lokasi"` | Accessibility |

### File: `src/components/sections/ScheduleSection.tsx`
| Teks Lama | Teks Baru | Kategori |
|---|---|---|
| `alt="Atur Cara — Jadual Susunan Acara Perkahwinan"` | `alt="Atur Cara — Jadwal Susunan Acara Perkahwinan"` | Image alt text (hanya `Jadual`→`Jadwal`) |

### File: `src/app/kenangan-perkahwinan/hasil/page.tsx`
| Teks Lama | Teks Baru | Kategori |
|---|---|---|
| `"Gagal menyimpan ke galeri. Sila cuba lagi."` | `"Gagal menyimpan ke galeri. Silakan coba lagi."` | Error message |
| `"Tautan disalin ke papan klip!"` | `"Tautan berhasil disalin!"` | Notification |
| `"Kami sangat berterimakasih jika anda berkenan untuk momen ini ditampilkan ke galeri kenangan."` | `"Kami sangat berterima kasih jika Anda berkenan untuk momen ini ditampilkan ke galeri kenangan."` | Info message |

### File: `src/app/kenangan-perkahwinan/kamera/page.tsx`
| Teks Lama | Teks Baru | Kategori |
|---|---|---|
| `"Gagal mengakses kamera. Pastikan anda telah memberikan izin."` | `"Gagal mengakses kamera. Pastikan Anda telah memberikan izin."` | Error message |
| `title="Tukar Kamera"` | `title="Ganti Kamera"` | Button tooltip |

### File: `src/app/kenangan-perkahwinan/pesan/page.tsx`
| Teks Lama | Teks Baru | Kategori |
|---|---|---|
| `"Sila isi mesej untuk pengantin."` | `"Silakan isi pesan untuk pengantin."` | Validation message |
| `"Terjadi kesalahan saat mengirim data. Sila cuba lagi."` | `"Terjadi kesalahan saat mengirim data. Silakan coba lagi."` | Error message |

### File: `src/app/kenangan-perkahwinan/pilih-bingkai/page.tsx`
| Teks Lama | Teks Baru | Kategori |
|---|---|---|
| `aria-label="Bingkai Seterusnya"` | `aria-label="Bingkai Selanjutnya"` | Accessibility |

### File: `src/app/kenangan-perkahwinan/lihat/[id]/page.tsx`
| Teks Lama | Teks Baru | Kategori |
|---|---|---|
| `"Momen tidak dijumpai."` | `"Momen tidak ditemukan."` | Error / Empty state |
| `"Tautan halaman ini disalin ke papan klip!"` | `"Tautan halaman berhasil disalin!"` | Notification |

### File: `src/app/admin/RSVPTable.tsx`
| Teks Lama | Teks Baru | Kategori |
|---|---|---|
| `new Date(r.created_at).toLocaleString('ms-MY')` | `new Date(r.created_at).toLocaleString('id-ID')` | Locale format |

### File: `src/app/admin/WishesTable.tsx`
| Teks Lama | Teks Baru | Kategori |
|---|---|---|
| `new Date(w.created_at).toLocaleString('ms-MY')` | `new Date(w.created_at).toLocaleString('id-ID')` | Locale format |

---

**Catatan Tambahan untuk 1.4:**
- Setelah semua perubahan, lakukan pencarian global (`grep` / `search`) di seluruh `src/` untuk kata-kata **Melayu Malaysia** berikut dan pastikan TIDAK ADA yang tersisa:
  - `Sila` → harus `Silakan` (kecuali dalam konten undangan)
  - `mesej` → harus `pesan`
  - `cuba` → harus `coba`
  - `Muzik` → harus `Musik`
  - `Tukar` → harus `Ganti` (dalam konteks UI button)
  - `Seterusnya` → harus `Selanjutnya` / `Berikutnya`
  - `Tarikh` → harus `Tanggal`
  - `dijumpai` → harus `ditemukan`
  - `Memuatkan` → harus `Memuat`
  - `Jadual` → harus `Jadwal`
  - `ms-MY` → harus `id-ID`
- **JANGAN** ubah kata-kata berikut karena ini adalah Melayu Kepri yang sah:
  - `Perkahwinan` — PERTAHANKAN di semua tempat (metadata, aria-label, alt text, konten)
  - `Majelis` — PERTAHANKAN di semua tempat
  - `Jemputan` — PERTAHANKAN di semua tempat
  - `Atur Cara` / `Aturcara` — PERTAHANKAN di semua tempat
  - `Kenangan` — PERTAHANKAN di semua tempat
- Beberapa teks yang TIDAK perlu diubah (sudah benar): form label RSVP, placeholder RSVP, button label "Kirim"/"Mengirim...", pesan sukses RSVP, validation di `src/lib/actions.ts`, dan server action messages.
- Verifikasi: Jalankan `npm run build` setelah semua perubahan string selesai.

---

# FASE 2: PERBAIKAN PENTING

Kerjakan setelah Fase 1 selesai dan verified.

## 2.1 — OG Image & Social Sharing Metadata

**Tugas**:
1. Buat atau sediakan gambar OG (1200x630px) untuk undangan utama. Jika tidak ada gambar desain khusus, generate menggunakan `ImageResponse` dari `next/og` yang menampilkan:
   - Nama pengantin: "Puan & Ilham"
   - Tanggal: "4 September 2026" [SESUAIKAN tanggal jika berbeda]
   - Background pattern floral
   - Simpan sebagai `public/og-image.jpg`

2. Update `src/app/layout.tsx` metadata (PERTAHANKAN istilah Melayu Kepri: "Jemputan", "Majelis Perkahwinan"):
   ```typescript
   export const metadata: Metadata = {
     title: 'Jemputan Majelis Perkahwinan | Puan & Ilham',
     description: 'Anda dijemput hadir ke Majelis Perkahwinan Puan & Ilham pada 4 September 2026. Klik untuk RSVP dan informasi lengkap.',
     openGraph: {
       title: 'Jemputan Majelis Perkahwinan Puan & Ilham',
       description: 'Anda dijemput hadir ke Majelis Perkahwinan Puan & Ilham',
       images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
       type: 'website',
     },
     twitter: {
       card: 'summary_large_image',
       title: 'Jemputan Majelis Perkahwinan Puan & Ilham',
       images: ['/og-image.jpg'],
     },
   }
   ```

3. Tambahkan metadata khusus untuk halaman photobooth di `src/app/kenangan-perkahwinan/layout.tsx` (PERTAHANKAN "Kenangan Perkahwinan"):
   ```typescript
   export const metadata: Metadata = {
     title: 'Kenangan Perkahwinan | Puan & Ilham',
     description: 'Bagikan kenangan indah Anda bersama Puan & Ilham! Ambil foto, pilih bingkai, dan bagikan di galeri kenangan digital.',
     openGraph: {
       title: 'Kenangan Perkahwinan Puan & Ilham — Virtual Photobooth',
       description: 'Ambil foto kenangan bersama Puan & Ilham!',
       images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
     },
   }
   ```

4. Tambahkan metadata untuk halaman detail kenangan `src/app/kenangan-perkahwinan/lihat/[id]/page.tsx` menggunakan `generateMetadata` yang secara dinamis mengambil `photo_url` dari entry tersebut sebagai og:image.

## 2.2 — Error Boundaries per Section

**Tugas**:
1. Buat komponen `src/components/ErrorBoundary.tsx`:
   ```typescript
   'use client'
   
   import { Component, type ReactNode, type ErrorInfo } from 'react'

   interface Props {
     children: ReactNode
     fallback?: ReactNode
     sectionName?: string
   }

   interface State {
     hasError: boolean
   }

   export class ErrorBoundary extends Component<Props, State> {
     constructor(props: Props) {
       super(props)
       this.state = { hasError: false }
     }

     static getDerivedStateFromError(): State {
       return { hasError: true }
     }

     componentDidCatch(error: Error, errorInfo: ErrorInfo) {
       console.error(`Error in ${this.props.sectionName || 'section'}:`, error, errorInfo)
     }

     render() {
       if (this.state.hasError) {
         return this.props.fallback || null  // Silent fail — section hilang tapi halaman tetap jalan
       }
       return this.props.children
     }
   }
   ```

2. Wrap setiap section di `MainPage.tsx` dan `PhotoboothMainPage.tsx` dengan `<ErrorBoundary>`:
   ```tsx
   <ErrorBoundary sectionName="RSVP">
     <Suspense fallback={<SectionSkeleton />}>
       <RSVPSection />
     </Suspense>
   </ErrorBoundary>
   ```

3. Buat juga `src/app/kenangan-perkahwinan/error.tsx` dan `src/app/error.tsx` sebagai error page level route.

## 2.3 — Rate Limiting pada API

**Tugas**:
1. Implementasi rate limiter sederhana berbasis in-memory Map di `src/lib/rateLimit.ts`:
   ```typescript
   const rateLimit = (limit: number, windowMs: number) => {
     const requests = new Map<string, { count: number; resetTime: number }>()
     
     return (ip: string): boolean => {
       const now = Date.now()
       const record = requests.get(ip)
       
       if (!record || now > record.resetTime) {
         requests.set(ip, { count: 1, resetTime: now + windowMs })
         return true // allowed
       }
       
       if (record.count >= limit) {
         return false // blocked
       }
       
       record.count++
       return true // allowed
     }
   }
   
   // Max 5 RSVP submissions per IP per 15 minutes
   export const rsvpLimiter = rateLimit(5, 15 * 60 * 1000)
   
   // Max 10 wishes per IP per 15 minutes
   export const wishesLimiter = rateLimit(10, 15 * 60 * 1000)
   
   // Max 10 photobooth uploads per IP per 30 minutes
   export const photoboothLimiter = rateLimit(10, 30 * 60 * 1000)
   ```

2. Terapkan di `src/app/api/rsvp/route.ts` dan `src/app/api/wishes/route.ts`:
   ```typescript
   import { rsvpLimiter } from '@/lib/rateLimit'
   import { headers } from 'next/headers'

   export async function POST(req: Request) {
     const headersList = await headers()
     const ip = headersList.get('x-forwarded-for') ?? headersList.get('x-real-ip') ?? 'unknown'
     
     if (!rsvpLimiter(ip)) {
       return NextResponse.json(
         { error: 'Terlalu banyak permintaan. Sila cuba sebentar lagi.' },
         { status: 429 }
       )
     }
     // ... existing logic
   }
   ```

3. Terapkan juga rate limiting pada proses upload photobooth di `src/app/kenangan-perkahwinan/pesan/page.tsx` (buat API route baru jika upload saat ini dilakukan langsung dari client ke Supabase, atau tambahkan rate limit di level Supabase RLS jika memungkinkan).

## 2.4 — Loading Skeletons

**Tugas**:
1. Buat komponen `src/components/SectionSkeleton.tsx` yang menampilkan skeleton placeholder animasi pulse:
   ```tsx
   export function SectionSkeleton({ height = 'h-64' }: { height?: string }) {
     return (
       <div className={`${height} w-full animate-pulse bg-primary/5 rounded-lg`} />
     )
   }
   ```

2. Buat skeleton spesifik untuk:
   - `WishesSkeleton`: 3 card skeleton dengan avatar circle + 2 line text
   - `GallerySkeleton`: Grid 2 kolom × 3 baris skeleton cards

3. Terapkan sebagai fallback di `<Suspense>` wrapping pada `MainPage.tsx` untuk `WishesSection` dan di `MemoryGallery.tsx` saat data sedang loading.

## 2.5 — Input Sanitization

**Tugas**:
1. Install `dompurify` sebagai dependency (atau gunakan sanitasi manual).
2. Di server actions (`src/lib/actions.ts`) dan API routes, tambahkan sanitasi pada input text:
   ```typescript
   function sanitizeInput(input: string): string {
     return input
       .replace(/</g, '&lt;')
       .replace(/>/g, '&gt;')
       .replace(/"/g, '&quot;')
       .replace(/'/g, '&#x27;')
       .trim()
   }
   ```
3. Terapkan `sanitizeInput()` pada semua field teks sebelum insert ke database: `name`, `message` di wishes, `sender_name`, `message` di photobooth_entries, dan `name` di RSVP.

## 2.6 — Music Player iOS Safari Fallback

**Tugas**:
1. Di `src/components/MusicPlayer.tsx`, pastikan ada try-catch di sekitar `audio.play()`:
   ```typescript
   const playAudio = async () => {
     try {
       await audioRef.current?.play()
       setIsPlaying(true)
     } catch (err) {
       console.warn('Autoplay blocked:', err)
       setIsPlaying(false)
       // Tampilkan visual hint agar user tap tombol musik
     }
   }
   ```
2. Tambahkan visual indicator (ikon musik berkedip atau tooltip) jika play gagal, agar user tahu mereka perlu tap tombol untuk mendengarkan musik.

---

# FASE 3: FITUR BARU — DAMPAK TINGGI

Kerjakan setelah Fase 2 selesai dan verified.

## 3.1 — Countdown Timer

**Tugas**:
1. Buat komponen `src/components/sections/CountdownSection.tsx`.
2. Tampilkan countdown ke tanggal pernikahan: **4 September 2026** [SESUAIKAN jika berbeda].
3. Format tampilan: 4 kotak terpisah untuk Hari, Jam, Menit, Detik.
4. Desain:
   - Background: sesuai tema (warna `--color-primary: #384d95` atau variasi)
   - Font angka: besar, serif (Times New Roman)
   - Label: kecil, di bawah setiap angka ("Hari", "Jam", "Menit", "Detik")
   - Animasi: angka berubah dengan transisi slide-up halus
5. Gunakan `useEffect` + `setInterval` (1 detik) dengan cleanup.
6. Setelah tanggal berlalu, tampilkan pesan: "Alhamdulillah, hari bahagia telah tiba! 💍"
7. Letakkan setelah `IntroSection` dan sebelum `QuranSection` di `MainPage.tsx`.

## 3.2 — Tombol "Add to Calendar"

**Tugas**:
1. Buat komponen `src/components/AddToCalendar.tsx`.
2. Tampilkan tombol dropdown/group dengan 3 opsi:
   - **Google Calendar**: Generate URL format `https://calendar.google.com/calendar/render?action=TEMPLATE&text=...&dates=...&location=...&details=...`
   - **Apple Calendar (.ics)**: Generate dan download file `.ics`
   - **Outlook (.ics)**: Sama dengan Apple Calendar, file `.ics`

3. Data event:
   ```
   Title: Majelis Perkahwinan Puan & Ilham
   Date: 4 September 2026 [SESUAIKAN]
   Time: [SESUAIKAN — ambil dari desain/jadwal acara]
   Location: Sam's Anna Restaurant, Tanjungpinang [SESUAIKAN]
   Description: Anda dijemput hadir ke Majelis Perkahwinan Puan & Ilham
   ```

4. Letakkan di `DateLocationSection.tsx`, di bawah tombol Google Maps/Waze yang sudah ada.
5. Styling: Tombol dengan ikon kalender, sesuai tema.

## 3.3 — Tombol Share WhatsApp

**Tugas**:
1. Buat komponen `src/components/ShareWhatsApp.tsx`.
2. Tombol floating (fixed position) atau di footer yang membuka WhatsApp Web/App dengan pesan pre-filled:
   ```
   Assalamualaikum! 💍 Anda dijemput hadir ke Majelis Perkahwinan Puan & Ilham pada 4 September 2026.

   Klik untuk RSVP & maklumat lanjut:
   https://[DOMAIN] [SESUAIKAN domain]
   ```
3. URL format: `https://api.whatsapp.com/send?text={encodedMessage}`
4. Letakkan sebagai floating button di bawah MusicPlayer, atau di FooterSection.
5. Ikon: WhatsApp logo (gunakan SVG inline sederhana).

## 3.4 — Personalisasi Nama Tamu via URL Query Param

**Tugas**:
1. Baca query parameter `?to=Nama+Tamu` dari URL.
2. Di `CoverPage.tsx`, tambahkan teks personalisasi di bawah nama pengantin:
   ```
   Kepada Yth.
   [Nama Tamu]
   ```
   Jika param `to` tidak ada, jangan tampilkan baris ini.

3. Implementasi:
   - Gunakan `useSearchParams()` dari `next/navigation` di `CoverPage.tsx` (client component).
   - Decode nama: `decodeURIComponent(searchParams.get('to') || '')`
   - Sanitize input (gunakan fungsi sanitize dari 2.5).
   - Tampilkan dengan font Pinyon Script (`var(--font-script)`) agar terlihat elegan.

4. Pastikan metadata OG tetap generik (tidak include nama tamu) karena og:image di-cache oleh platform.

## 3.5 — Admin Dashboard untuk Photobooth

**Tugas**:
1. Buat komponen `src/app/admin/PhotoboothTable.tsx` serupa dengan `RSVPTable.tsx`.
2. Tampilkan tabel dengan kolom:
   - Thumbnail foto (kecil, clickable untuk preview lebih besar)
   - Nama pengirim
   - Pesan
   - Bingkai yang digunakan
   - Tanggal kirim
   - Tombol Hapus

3. Tambahkan statistik photobooth di dashboard admin (`src/app/admin/page.tsx`):
   - Total foto yang dikirim
   - Jumlah foto hari ini

4. Fetch data dari `photobooth_entries` di server component.
5. Implementasi delete: Hapus record dari `photobooth_entries` DAN hapus file dari Supabase Storage bucket `photobooth`. Buat server action `deletePhotoboothEntry(id, photoUrl)` di `src/lib/actions.ts`.

---

# FASE 4: FITUR NICE-TO-HAVE

Kerjakan setelah Fase 3 selesai, jika masih ada waktu dan bandwidth.

## 4.1 — Konfetti Animasi Setelah RSVP Berhasil

**Tugas**:
1. Install `canvas-confetti` (`npm install canvas-confetti @types/canvas-confetti`).
2. Di `RSVPSection.tsx`, setelah RSVP berhasil dikirim (state success), trigger:
   ```typescript
   import confetti from 'canvas-confetti'
   
   confetti({
     particleCount: 100,
     spread: 70,
     origin: { y: 0.6 },
     colors: ['#384d95', '#c9a96e', '#f5e6d3'], // sesuaikan warna tema
   })
   ```
3. Trigger konfetti sekali saat pesan sukses pertama kali ditampilkan.

## 4.2 — Infinite Scroll untuk Memory Gallery

**Tugas**:
1. Di `src/components/Photobooth/MemoryGallery.tsx`, ganti tombol "Muat Lagi" dengan infinite scroll menggunakan Intersection Observer:
   ```typescript
   const observerRef = useRef<HTMLDivElement>(null)
   
   useEffect(() => {
     const observer = new IntersectionObserver(
       (entries) => {
         if (entries[0].isIntersecting && hasMore && !isLoading) {
           loadMore()
         }
       },
       { threshold: 0.1 }
     )
     
     if (observerRef.current) observer.observe(observerRef.current)
     return () => observer.disconnect()
   }, [hasMore, isLoading])
   ```
2. Tampilkan loading spinner di bawah grid saat sedang fetch.
3. Tampilkan pesan "Semua kenangan telah dimuatkan" saat tidak ada lagi data.

## 4.3 — QR Code untuk Sharing

**Tugas**:
1. Install `qrcode.react` (`npm install qrcode.react`).
2. Buat komponen `src/components/QRCodeShare.tsx`:
   ```tsx
   import { QRCodeSVG } from 'qrcode.react'
   
   export function QRCodeShare({ url }: { url: string }) {
     return (
       <div className="flex flex-col items-center gap-2">
         <QRCodeSVG value={url} size={150} bgColor="transparent" fgColor="#384d95" />
         <p className="text-xs text-primary/60">Imbas untuk buka undangan</p>
       </div>
     )
   }
   ```
3. Letakkan di `FooterSection.tsx` dengan URL undangan utama.
4. Opsional: Tambahkan juga di halaman hasil photobooth (`/hasil`) dengan URL ke entry detail (`/kenangan-perkahwinan/lihat/[id]`).

## 4.4 — Visitor Analytics (Vercel Analytics)

**Tugas**:
1. Install `@vercel/analytics` (`npm install @vercel/analytics`).
2. Tambahkan di `src/app/layout.tsx`:
   ```tsx
   import { Analytics } from '@vercel/analytics/next'
   
   export default function RootLayout({ children }) {
     return (
       <html>
         <body>
           {children}
           <Analytics />
         </body>
       </html>
     )
   }
   ```
3. Opsional: Install juga `@vercel/speed-insights` untuk monitoring performa.

## 4.5 — PWA Support

**Tugas**:
1. Buat `public/manifest.json`:
   ```json
   {
     "name": "Jemputan Perkahwinan Puan & Ilham",
     "short_name": "Puan & Ilham",
     "description": "Undangan Digital Perkahwinan Puan & Ilham",
     "start_url": "/",
     "display": "standalone",
     "background_color": "#f5e6d3",
     "theme_color": "#384d95",
     "icons": [
       { "src": "/icon-192.png", "sizes": "192x192", "type": "image/png" },
       { "src": "/icon-512.png", "sizes": "512x512", "type": "image/png" }
     ]
   }
   ```
2. Tambahkan link manifest di `layout.tsx` metadata.
3. Generate ikon PWA dari logo yang sudah ada.

---

# ATURAN UMUM (Berlaku untuk SEMUA fase)

1. **Jangan ubah desain visual** yang sudah ada kecuali diminta secara eksplisit. Pertahankan tema warna, font, dan layout.
2. **Mobile-first**: Semua fitur baru harus responsif, dioptimasi untuk layar ≥ 360px.
3. **Pertahankan semua komentar dan docstring** yang sudah ada dan tidak terkait perubahan.
4. **TypeScript strict**: Semua kode baru harus typed dengan benar, tidak boleh ada `any`.
5. **Free Tier friendly**: Hindari operasi server-side yang berat. Semua proses gambar tetap di client-side.
6. **Verifikasi setiap fase**: Jalankan `npm run build` setelah setiap fase selesai. Pastikan zero errors.
7. **Commit per fase**: Setiap fase harus menghasilkan kode yang bisa di-build dan berjalan. Jangan biarkan kode dalam state setengah jadi.

---

# URUTAN EKSEKUSI

1. ✅ Fase 1: Perbaikan Kritis (WAJIB)
2. ✅ Fase 2: Perbaikan Penting (WAJIB)
3. ✅ Fase 3: Fitur Baru Dampak Tinggi (DIREKOMENDASIKAN)
4. ⬜ Fase 4: Nice-to-Have (OPSIONAL — kerjakan jika ada waktu)

Mulai dari Fase 1.1 dan kerjakan secara berurutan. Laporkan progress setelah setiap fase selesai sebelum melanjutkan ke fase berikutnya.
```

---

> [!TIP]
> **Cara menggunakan prompt ini:**
> 1. Review item bertanda `[SESUAIKAN]` dan isi dengan data yang benar (tanggal, domain, waktu acara)
> 2. Copy seluruh teks di dalam code block di atas
> 3. Buka sesi Antigravity baru, paste prompt tersebut
> 4. Disarankan gunakan `/goal` agar agent tidak berhenti di tengah jalan
> 5. Agent akan mengerjakan per fase dan meminta konfirmasi sebelum lanjut

> [!NOTE]
> Prompt ini dirancang agar **modular** — anda bisa menghapus item yang tidak diinginkan tanpa mempengaruhi item lainnya. Misalnya, jika anda tidak ingin PWA support, hapus saja bagian 4.5.
