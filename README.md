# Bot WhatsApp Terintegrasi dengan API Daftar Tugas
Untuk Tugas Pemograman Integrative 

Aplikasi ini adalah bot WhatsApp yang terintegrasi dengan API backend untuk manajemen daftar tugas (to-do list). Bot ini memungkinkan pengguna untuk melakukan operasi CRUD pada kategori dan tugas melalui WhatsApp.

## Fitur

- Autentikasi pengguna menggunakan JWT token
- Manajemen kategori (membuat, melihat, memperbarui, menghapus)
- Manajemen tugas (membuat, melihat, memperbarui status, menghapus)
- Integrasi WhatsApp untuk akses mudah ke API

## Persyaratan Sistem

- Node.js (v14 atau lebih baru)
- MySQL (v5.7 atau lebih baru)
- XAMPP (untuk menjalankan MySQL)
- WhatsApp yang terpasang di ponsel

## Instalasi

1. Clone repositori ini atau ekstrak file ke direktori lokal
2. Buat database MySQL bernama `todolist` (sudah ada dalam file SQL)
3. Import file `todolist.sql` ke database MySQL
4. Install dependensi dengan menjalankan:

```bash
npm install
```

5. Salin file `.env.example` ke `.env` dan sesuaikan konfigurasi:

```
# Konfigurasi Server
PORT=3000

# Konfigurasi Database
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=todolist

# Konfigurasi JWT
JWT_SECRET=rahasia_jwt_todolist_super_aman
JWT_EXPIRES_IN=30d

# Konfigurasi API
API_URL=http://localhost:3000
```

## Menjalankan Aplikasi

Untuk menjalankan aplikasi, gunakan perintah:

```bash
npm start
```

Ini akan menjalankan server API dan bot WhatsApp secara bersamaan.

Untuk pengembangan, Anda dapat menggunakan:

```bash
npm run dev
```

## Penggunaan Bot WhatsApp

1. Saat pertama kali dijalankan, bot akan menampilkan QR code di terminal
2. Pindai QR code dengan WhatsApp di ponsel Anda (WhatsApp Web)
3. Setelah terhubung, Anda dapat menggunakan perintah berikut di WhatsApp:

### Perintah Umum

- `/help` - Menampilkan bantuan
- `/login [email] [password]` - Masuk ke akun
- `/logout` - Keluar dari akun
- `/profile` - Melihat profil pengguna

### Perintah Kategori

- `/buat-kategori [nama] [deskripsi]` - Membuat kategori baru
- `/lihat-kategori` - Melihat daftar kategori

### Perintah Tugas

- `/buat-tugas [judul] [deskripsi] [kategori_id]` - Membuat tugas baru
- `/lihat-tugas` - Melihat daftar tugas
- `/update-tugas [id] [status]` - Mengubah status tugas (pending/in_progress/completed/cancelled)
- `/hapus-tugas [id]` - Menghapus tugas

## Struktur Proyek

```
├── config/
│   └── database.js       # Konfigurasi database
├── controllers/
│   ├── userController.js  # Controller untuk pengguna
│   ├── categoryController.js # Controller untuk kategori
│   └── taskController.js  # Controller untuk tugas
├── middleware/
│   └── auth.js           # Middleware autentikasi JWT
├── routes/
│   └── api.js            # Definisi rute API
├── .env                  # Variabel lingkungan
├── index.js              # File utama untuk menjalankan aplikasi
├── server.js             # Server Express untuk API
├── whatsapp-bot.js       # Bot WhatsApp
└── package.json          # Dependensi dan skrip
```

## Keamanan

- Semua endpoint API (kecuali login) dilindungi dengan middleware JWT
- Password disimpan dengan aman menggunakan bcrypt
- Token JWT memiliki masa berlaku 30 hari
- Token disimpan di database untuk validasi

## Pengembangan Lebih Lanjut

- Menambahkan fitur registrasi pengguna melalui WhatsApp
- Implementasi notifikasi pengingat tugas
- Penambahan fitur pencarian dan filter tugas
- Dukungan untuk lampiran file pada tugas

## Lisensi

MIT
