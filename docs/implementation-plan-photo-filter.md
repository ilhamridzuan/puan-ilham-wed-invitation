# Implementation Plan — Fitur Filter Foto pada Virtual Photobooth

## Ringkasan

Menambahkan fitur filter foto bergaya Instagram ke dalam alur Virtual Photobooth menggunakan pendekatan **Hybrid CSS + Canvas API** — **zero dependency baru**, sepenuhnya client-side, GPU-accelerated untuk preview, dan konsisten saat export.

**Pendekatan**: CSS `filter` property untuk real-time preview + `CanvasRenderingContext2D.filter` untuk export ke WebP.

---

## Alur Pengguna Setelah Perubahan

```
Info Pengirim → Pilih Bingkai → Metode Foto → Kamera/Upload → ✨ PILIH FILTER (BARU) → Tulis Pesan → Hasil
/info           /pilih-bingkai   /metode-foto   /kamera           /filter                  /pesan        /hasil
```

Filter disisipkan **setelah foto diambil** dan **sebelum halaman pesan**. Halaman `/filter` adalah halaman baru.

---

## Proposed Changes

### Komponen 1 — Filter Preset Configuration

#### [NEW] `src/lib/filterPresets.ts`

File konfigurasi yang mendefinisikan semua filter preset. Setiap preset memiliki ID, nama tampilan, dan CSS filter string.

```typescript
export interface FilterPreset {
  id: string
  name: string
  css: string // CSS filter string, e.g. "brightness(1.1) sepia(0.3)"
}

export const FILTER_PRESETS: FilterPreset[] = [
  { id: 'original', name: 'Asli',        css: 'none' },
  { id: 'warm',     name: 'Hangat',      css: 'brightness(1.1) saturate(1.3) sepia(0.15)' },
  { id: 'cool',     name: 'Sejuk',       css: 'brightness(1.05) saturate(0.9) hue-rotate(15deg)' },
  { id: 'vintage',  name: 'Vintage',     css: 'sepia(0.4) contrast(0.9) brightness(1.1) saturate(1.5)' },
  { id: 'bw',       name: 'Hitam Putih', css: 'grayscale(100%) brightness(1.2) contrast(1.05)' },
  { id: 'soft',     name: 'Lembut',      css: 'brightness(1.15) contrast(0.95) saturate(1.1)' },
  { id: 'dramatic', name: 'Dramatik',    css: 'contrast(1.4) brightness(0.9) saturate(1.2)' },
  { id: 'rose',     name: 'Mawar',       css: 'sepia(0.15) saturate(1.4) hue-rotate(-10deg) brightness(1.05)' },
]

export function getFilterPreset(filterId: string): FilterPreset {
  return FILTER_PRESETS.find(f => f.id === filterId) || FILTER_PRESETS[0]
}
```

**Catatan desain:**
- 8 preset dipilih agar cocok dengan tema pernikahan (warm, vintage, rose = nuansa romantis)
- Nama dalam bahasa Indonesia sesuai konvensi project
- "Asli" (original) selalu menjadi opsi pertama sebagai default

---

### Komponen 2 — State Management

#### [MODIFY] `src/app/kenangan-perkahwinan/PhotoboothContext.tsx`

Tambahkan dua state baru ke context: `filterId` dan `filterCss`.

```diff
 type PhotoboothContextType = {
   senderName: string;
   setSenderName: (name: string) => void;
   frameId: string;
   setFrameId: (id: string) => void;
   photos: string[];
   setPhotos: (photos: string[]) => void;
+  filterId: string;
+  setFilterId: (id: string) => void;
+  filterCss: string;
+  setFilterCss: (css: string) => void;
   finalImageUrl: string | null;
   setFinalImageUrl: (url: string | null) => void;
   message: string;
   setMessage: (msg: string) => void;
   reset: () => void;
 };
```

State initialization:
```diff
   const [photos, setPhotos] = useState<string[]>([]);
+  const [filterId, setFilterId] = useState('original');
+  const [filterCss, setFilterCss] = useState('none');
   const [finalImageUrl, setFinalImageUrl] = useState<string | null>(null);
```

Reset function:
```diff
   const reset = () => {
     setSenderName('');
     setFrameId('');
     setPhotos([]);
+    setFilterId('original');
+    setFilterCss('none');
     setFinalImageUrl(null);
     setMessage('');
   };
```

Provider value — tambahkan `filterId`, `setFilterId`, `filterCss`, `setFilterCss`.

---

### Komponen 3 — Halaman Filter (Baru)

#### [NEW] `src/app/kenangan-perkahwinan/filter/page.tsx`

Halaman baru yang disisipkan antara kamera/upload dan pesan.

**Wireframe UX:**
```
┌──────────────────────────────┐
│  [←]    Kenangan Perkahwinan │
│         Puan & Ilham         │
│                              │
│  ┌────────────────────────┐  │
│  │                        │  │
│  │   Foto preview besar   │  │
│  │   dengan CSS filter    │  │   ← Preview utama,
│  │   yang sedang aktif    │  │      filter applied via CSS style
│  │                        │  │
│  └────────────────────────┘  │
│                              │
│  ✨ Pilih Filter             │
│                              │
│  ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐   │
│  │  │ │  │ │  │ │  │ │  │   │   ← Horizontal scrollable
│  │OG│ │WM│ │CL│ │VN│ │BW│   │      thumbnails kecil
│  │  │ │  │ │  │ │  │ │  │   │      masing-masing dengan
│  └──┘ └──┘ └──┘ └──┘ └──┘   │      filter CSS applied
│  Asli Hngat Sjuk Vntg B&W   │
│                              │
│      [ Pilih Filter → ]      │
└──────────────────────────────┘
```

**Spesifikasi implementasi:**

1. **Guard**: Jika `photos` kosong di context, redirect ke `/kenangan-perkahwinan`.

2. **Preview besar**: Tampilkan foto pertama (`photos[0]`) sebagai `<img>` dengan `style={{ filter: selectedFilterCss }}`. Jika bingkai multi-foto (2 atau 4), tampilkan foto pertama saja sebagai representasi preview filter (bukan seluruh merge — merge terlalu lambat untuk preview real-time).

3. **Thumbnail carousel**: Horizontal scrollable row (`overflow-x-auto flex gap-3 snap-x`) yang menampilkan 8 thumbnail kecil (foto pertama dengan masing-masing filter CSS). Thumbnail yang aktif memiliki border tebal warna `primary`.

4. **Nama filter**: Ditampilkan di bawah setiap thumbnail.

5. **Tombol "Pilih Filter"**: Menyimpan `filterId` dan `filterCss` ke context, lalu navigate ke `/kenangan-perkahwinan/pesan`.

6. **Tombol kembali**: Navigate back ke halaman sebelumnya.

7. **Layout**: Konsisten dengan halaman lain (flower pattern background, glass card, header dengan Title Photobooth + Puan & Ilham logo).

**Kode inti untuk thumbnail carousel:**
```tsx
import { FILTER_PRESETS, type FilterPreset } from '@/lib/filterPresets'

// State lokal
const [selectedFilter, setSelectedFilter] = useState<FilterPreset>(FILTER_PRESETS[0])

// Thumbnail carousel
<div className="flex gap-3 overflow-x-auto snap-x snap-mandatory px-4 pb-2 scrollbar-hide">
  {FILTER_PRESETS.map((preset) => (
    <button
      key={preset.id}
      onClick={() => setSelectedFilter(preset)}
      className={`flex flex-col items-center shrink-0 snap-center ${
        selectedFilter.id === preset.id
          ? 'ring-2 ring-primary ring-offset-2 rounded-lg'
          : ''
      }`}
    >
      {/* Thumbnail foto dengan filter CSS */}
      <div className="w-16 h-20 sm:w-20 sm:h-24 rounded-md overflow-hidden bg-gray-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={photos[0]}
          alt={preset.name}
          className="w-full h-full object-cover"
          style={{ filter: preset.css }}
        />
      </div>
      <span className={`text-xs mt-1 font-serif italic ${
        selectedFilter.id === preset.id
          ? 'text-primary font-semibold'
          : 'text-gray-600'
      }`}>
        {preset.name}
      </span>
    </button>
  ))}
</div>

// Preview besar
<img
  src={photos[0]}
  alt="Preview Filter"
  className="w-full h-full object-cover rounded-md"
  style={{ filter: selectedFilter.css }}
/>
```

**Handle submit:**
```tsx
const handleSelect = () => {
  setFilterId(selectedFilter.id)
  setFilterCss(selectedFilter.css)
  router.push('/kenangan-perkahwinan/pesan')
}
```

---

### Komponen 4 — Canvas Utils (Modifikasi Export)

#### [MODIFY] `src/lib/canvasUtils.ts`

Tambahkan parameter `filterCss` ke fungsi `mergePhotoAndFrame`. Filter diterapkan **hanya pada layer foto**, bukan pada bingkai.

**Perubahan function signature:**
```diff
 export async function mergePhotoAndFrame(
   photos: string[],
   frameUrl: string,
   config: FrameConfig,
-  finalWidth: number = 1200
+  finalWidth: number = 1200,
+  filterCss: string = 'none'
 ): Promise<Blob> {
```

**Perubahan pada step "Draw Photos" (sekitar baris 44-70):**
```diff
         // 3. Draw Photos
+        // Apply CSS filter ke context sebelum draw foto
+        const supportsCtxFilter = 'filter' in ctx;
+        if (filterCss && filterCss !== 'none' && supportsCtxFilter) {
+          ctx.filter = filterCss;
+        }
+
         for (let i = 0; i < config.photoCount; i++) {
           const photoUrl = photos[i] || photos[0];
           const photoImg = await loadImage(photoUrl);
           // ... existing position calculation logic (TIDAK BERUBAH) ...
           drawCover(ctx, photoImg, x, y, pWidth, pHeight);
         }
+
+        // Reset filter sebelum draw bingkai agar bingkai tidak ter-filter
+        if (supportsCtxFilter) {
+          ctx.filter = 'none';
+        }

         // 4. Draw transparent-ified frame on top
         ctx.drawImage(offCanvas, 0, 0, finalWidth, finalHeight);
```

**Catatan penting:**
- Filter diterapkan **sebelum loop draw foto** dan **di-reset sebelum draw bingkai**
- Ini memastikan semua foto mendapat filter yang sama, sementara bingkai SVG tetap tidak terpengaruh
- Fallback: jika `ctx.filter` tidak didukung browser, foto di-export tanpa filter (bukan error)

**Browser `ctx.filter` Support:**

| Browser | Support |
|---|---|
| Chrome 99+ | ✅ |
| Firefox 49+ | ✅ |
| Safari 16+ | ✅ |
| Edge 99+ | ✅ |
| Samsung Internet 18+ | ✅ |
| iOS Safari 16+ | ✅ |

Coverage global ~95%. Untuk browser lama, foto di-export sebagai "Asli" (tanpa filter).

---

### Komponen 5 — Rewiring Navigasi

#### [MODIFY] `src/app/kenangan-perkahwinan/kamera/page.tsx`

Ubah navigasi setelah semua foto diambil: dari langsung ke `/pesan`, menjadi ke `/filter`.

```diff
         if (newPhotos.length >= totalPhotos) {
           setPhotos(newPhotos);
-          router.push("/kenangan-perkahwinan/pesan");
+          router.push("/kenangan-perkahwinan/filter");
         }
```

Lokasi: baris 82-84.

---

#### [MODIFY] `src/app/kenangan-perkahwinan/metode-foto/page.tsx`

Ubah navigasi setelah upload dari galeri: dari langsung ke `/pesan`, menjadi ke `/filter`.

```diff
       Promise.all(promises).then(uploadedPhotos => {
         if (uploadedPhotos.length > 0) {
           // ... existing padding logic ...
           setPhotos(finalPhotos);
-          router.push("/kenangan-perkahwinan/pesan");
+          router.push("/kenangan-perkahwinan/filter");
         }
       });
```

Lokasi: baris 63.

---

### Komponen 6 — Halaman Pesan (Modifikasi Preview & Export)

#### [MODIFY] `src/app/kenangan-perkahwinan/pesan/page.tsx`

**Perubahan 1 — Ambil `filterCss` dari context:**
```diff
- const { senderName, frameId, photos, setFinalImageUrl, setMessage: setContextMessage } = usePhotobooth();
+ const { senderName, frameId, photos, filterCss, setFinalImageUrl, setMessage: setContextMessage } = usePhotobooth();
```

**Perubahan 2 — Teruskan `filterCss` ke `mergePhotoAndFrame`:**
```diff
-        const blob = await mergePhotoAndFrame(photos, frameUrl, frameConfig, 1200);
+        const blob = await mergePhotoAndFrame(photos, frameUrl, frameConfig, 1200, filterCss);
```

Lokasi: baris 37.

---

## Ringkasan Perubahan File

| Status | File | Deskripsi |
|:---:|---|---|
| `[NEW]` | `src/lib/filterPresets.ts` | Konfigurasi 8 filter preset (type + data) |
| `[NEW]` | `src/app/kenangan-perkahwinan/filter/page.tsx` | Halaman pilih filter dengan preview + thumbnail carousel |
| `[MODIFY]` | `src/app/kenangan-perkahwinan/PhotoboothContext.tsx` | Tambah state `filterId` dan `filterCss` |
| `[MODIFY]` | `src/lib/canvasUtils.ts` | Tambah parameter `filterCss` di `mergePhotoAndFrame` + fallback |
| `[MODIFY]` | `src/app/kenangan-perkahwinan/kamera/page.tsx` | Ubah navigasi: `/pesan` → `/filter` |
| `[MODIFY]` | `src/app/kenangan-perkahwinan/metode-foto/page.tsx` | Ubah navigasi: `/pesan` → `/filter` |
| `[MODIFY]` | `src/app/kenangan-perkahwinan/pesan/page.tsx` | Teruskan `filterCss` ke `mergePhotoAndFrame` |

**Total: 2 file baru, 5 file dimodifikasi, 0 dependency baru.**

---

## Keputusan Desain (Finalized)

- **Filter ID di database**: Tidak perlu. Filter sudah ter-bake ke gambar output, informasi visual sudah tersimpan. Tidak ada migrasi database baru yang diperlukan.
- **Halaman filter wajib**: Ya. User HARUS melewati halaman filter (bisa pilih "Asli" untuk tanpa filter). Halaman ini juga berfungsi sebagai konfirmasi foto sebelum lanjut ke halaman pesan.

---

## Verification Plan

### Automated Tests
```bash
cd puandanilham && npm run build
```
Harus zero errors dan zero warnings terkait perubahan baru.

### Manual Verification

1. **Alur lengkap**: Info → Bingkai → Metode → Kamera → **Filter** → Pesan → Hasil
   - Pastikan navigasi forward dan back berfungsi di setiap step
   - Pastikan state context persist di setiap navigasi

2. **Filter preview**: Pilih setiap filter dan pastikan preview berubah secara instan (GPU-accelerated, tidak ada delay)

3. **Export konsistensi**: Ambil foto dengan filter "Vintage", lalu di halaman hasil, pastikan gambar yang diunduh memiliki efek vintage yang **identik** dengan preview

4. **Filter "Asli"**: Pastikan memilih "Asli" menghasilkan output yang 100% sama dengan behavior sebelum fitur filter ditambahkan

5. **Multi-foto**: Test dengan bingkai 2 foto dan 4 foto — semua foto harus mendapat filter yang sama

6. **Browser compatibility**: Test di Chrome, Safari (iOS), dan Firefox. Jika `ctx.filter` tidak didukung, foto harus di-export tanpa filter (bukan error)

7. **Back navigation**: Dari halaman pesan, tekan back → harus kembali ke halaman filter dengan filter yang dipilih sebelumnya masih tersimpan di context

8. **File size output**: Pastikan foto dengan filter tetap ≤ 300 KB (CSS filter tidak menambah ukuran file karena hanya mengubah pixel values, bukan menambah layer)
