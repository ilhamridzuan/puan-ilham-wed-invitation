const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '../src');

const replacements = [
  {
    file: 'components/MainPage.tsx',
    changes: [
      { from: 'aria-label="Memuatkan..."', to: 'aria-label="Memuat..."' }
    ]
  },
  {
    file: 'components/MusicPlayer.tsx',
    changes: [
      { from: '"Jeda Muzik"', to: '"Jeda Musik"' },
      { from: '"Main Muzik"', to: '"Putar Musik"' }
    ]
  },
  {
    file: 'components/sections/DateLocationSection.tsx',
    changes: [
      { from: 'aria-label="Tarikh & Lokasi"', to: 'aria-label="Tanggal & Lokasi"' }
    ]
  },
  {
    file: 'components/sections/ScheduleSection.tsx',
    changes: [
      { from: 'alt="Atur Cara — Jadual Susunan Acara Perkahwinan"', to: 'alt="Atur Cara — Jadwal Susunan Acara Perkahwinan"' }
    ]
  },
  {
    file: 'app/kenangan-perkahwinan/hasil/page.tsx',
    changes: [
      { from: '"Gagal menyimpan ke galeri. Sila cuba lagi."', to: '"Gagal menyimpan ke galeri. Silakan coba lagi."' },
      { from: '"Tautan disalin ke papan klip!"', to: '"Tautan berhasil disalin!"' },
      { from: '"Kami sangat berterimakasih jika anda berkenan untuk momen ini ditampilkan ke galeri kenangan."', to: '"Kami sangat berterima kasih jika Anda berkenan untuk momen ini ditampilkan ke galeri kenangan."' }
    ]
  },
  {
    file: 'app/kenangan-perkahwinan/kamera/page.tsx',
    changes: [
      { from: '"Gagal mengakses kamera. Pastikan anda telah memberikan izin."', to: '"Gagal mengakses kamera. Pastikan Anda telah memberikan izin."' },
      { from: 'title="Tukar Kamera"', to: 'title="Ganti Kamera"' }
    ]
  },
  {
    file: 'app/kenangan-perkahwinan/pesan/page.tsx',
    changes: [
      { from: '"Sila isi mesej untuk pengantin."', to: '"Silakan isi pesan untuk pengantin."' },
      { from: '"Terjadi kesalahan saat mengirim data. Sila cuba lagi."', to: '"Terjadi kesalahan saat mengirim data. Silakan coba lagi."' }
    ]
  },
  {
    file: 'app/kenangan-perkahwinan/pilih-bingkai/page.tsx',
    changes: [
      { from: 'aria-label="Bingkai Seterusnya"', to: 'aria-label="Bingkai Selanjutnya"' }
    ]
  },
  {
    file: 'app/kenangan-perkahwinan/lihat/[id]/page.tsx',
    changes: [
      { from: '"Momen tidak dijumpai."', to: '"Momen tidak ditemukan."' },
      { from: '"Tautan halaman ini disalin ke papan klip!"', to: '"Tautan halaman berhasil disalin!"' }
    ]
  },
  {
    file: 'app/admin/RSVPTable.tsx',
    changes: [
      { from: "toLocaleString('ms-MY')", to: "toLocaleString('id-ID')" }
    ]
  },
  {
    file: 'app/admin/WishesTable.tsx',
    changes: [
      { from: "toLocaleString('ms-MY')", to: "toLocaleString('id-ID')" }
    ]
  }
];

let changedCount = 0;

for (const rep of replacements) {
  const filePath = path.join(srcDir, rep.file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    let updated = false;

    for (const change of rep.changes) {
      if (content.includes(change.from)) {
        content = content.split(change.from).join(change.to);
        updated = true;
      } else {
        console.log(`WARN: Could not find '${change.from}' in ${rep.file}`);
      }
    }

    if (updated) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Updated ${rep.file}`);
      changedCount++;
    }
  } else {
    console.log(`WARN: File not found ${filePath}`);
  }
}

console.log(`Done. Updated ${changedCount} files.`);
