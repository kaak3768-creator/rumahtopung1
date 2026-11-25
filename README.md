# Totok Punggung Medan — Responsive Website Starter

Website ini sudah dirapikan untuk layout desktop, laptop, tablet, dan HP; file SQL Supabase disediakan sebagai fondasi database.


## Status penting sebelum publikasi
- Frontend saat ini **masih menggunakan localStorage** untuk data dan login demo. Supabase schema disediakan tetapi belum tersambung ke semua fitur website. Pengunjung dari perangkat lain belum berbagi data sampai migrasi frontend/backend selesai.
- Admin demo **tidak aman untuk website live**. Jangan deploy sebelum mengganti sistem autentikasi demo dengan Supabase Auth dan menghubungkan CRUD admin ke database.
- Isi terapis/testimoni/produk/kelas di website masih contoh. Ganti data dummy dan nomor WhatsApp sebelum publik.

## 1) Buka lokal
1. Extract ZIP.
2. Buka `index.html` di browser, atau jalankan server lokal (disarankan):
   - Install Node.js jika belum ada.
   - Di folder project, jalankan `npx serve .` atau pakai Live Server VS Code.
3. Buka URL lokal yang ditampilkan server.

## 2) Buat Supabase database
1. Buat project di https://supabase.com/ (free plan cukup untuk development awal).
2. Dashboard project → **SQL Editor** → New query.
3. Buka `SUPABASE_SCHEMA.sql`, copy seluruh isi, lalu Run.
4. Periksa Table Editor: tabel `therapists`, `products`, `courses`, `articles`, `site_settings`, `therapist_applications`, `contact_messages`, `orders`, `admin_users` harus tersedia.
5. Dashboard → Project Settings → API. Salin **Project URL** dan **anon/public key** saja. Jangan pernah gunakan `service_role`/secret key di frontend.
6. `supabase-config.example.js` hanyalah contoh konfigurasi. Setelah frontend dimigrasi, rename salinan menjadi `supabase-config.js` dan masukkan URL serta anon key.

### Mengaktifkan admin (schema)
1. Daftar akun lewat Supabase Auth (setelah UI auth frontend dimigrasi).
2. SQL Editor, ganti email di perintah komentar terakhir `SUPABASE_SCHEMA.sql`, jalankan untuk memasukkan user tersebut ke `admin_users`.
3. Admin role tidak boleh diatur dari frontend. `admin_users` hanya bisa dikelola oleh admin yang sudah sah / SQL Editor.

## 3) Deploy website static (Netlify)
1. Buat akun Netlify.
2. Drag folder project (bukan file ZIP) ke Netlify Drop: https://app.netlify.com/drop
3. Jika deploy via Git, upload repo ke GitHub lalu import di Netlify.
4. Setelah deploy, buka URL website dan tes menu, dialog, formulir, gambar, dan layout dari HP serta laptop.

## 4) Checklist sebelum live
- [ ] Ganti nomor WA di `assets/db.js` dan admin panel.
- [ ] Hapus konten demo/testimoni, masukkan data nyata yang mendapat izin.
- [ ] Ganti login admin demo dan jangan pakai akun demo untuk produksi.
- [ ] Migrasikan autentikasi dan penyimpanan data ke Supabase (schema sudah tersedia, integrasi aplikasi belum selesai).
- [ ] Pastikan email confirmation / password recovery sesuai konfigurasi Auth.
- [ ] Uji formulir, keranjang, login, admin CRUD, filter, gambar produk, dialog pada browser mobile.
- [ ] Jangan menyimpan API secret/service-role key dalam file JS atau ZIP yang publik.

## Admin demo (hanya untuk testing lokal)
- URL: `admin.html`
- Username: `faziladmin`
- Password: `123`

**Hapus/ubah akun demo sebelum website live.** Data demo disimpan di browser.

## Responsif
Styles tambahan di akhir `assets/style.css` mengatur layout grid fluid, wrap header, menu layar kecil, dialog scroll, table scroll, spacing/touch targets, dan reduced-motion.

## Panduan konfigurasi/deploy tambahan
Baca `SETUP_DEPLOY.md` sebelum live. File `.env.example` dan `supabase-config.example.js` adalah template. Frontend saat ini belum sepenuhnya bermigrasi dari localStorage ke Supabase; jangan menganggap login/data multi-device sudah aktif.

## Migration status (read before deployment)
See `MIGRATION_STATUS.md`. This package is a responsive frontend + Supabase schema/deployment preparation, **not a completed cloud migration**. Authentication, content CRUD, therapist applications, orders, and messages still rely on browser-local storage until the frontend is fully migrated to Supabase Auth and database operations. Deploying now does not create shared data across devices.


## Supabase bridge scaffold (in progress)
- The HTML now loads Supabase JS v2, `assets/supabase-config.js`, and `assets/supabase-bridge.js`.
- Bridge exposes `window.TPCloud` auth and CRUD helpers after config is supplied.
- **Important:** the existing page workflows are still wired to legacy synchronous `DB`/`localStorage`. The bridge is not yet connected to those workflows, so this build is not a live cloud database version and does not provide cross-device data sync yet.
- Do not deploy this as a finished production system until auth, form writes, admin CRUD, and database access policies are migrated and tested.
