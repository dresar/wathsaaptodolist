const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { testConnection } = require('./config/database');
const apiRoutes = require('./routes/api');

// Inisialisasi aplikasi Express
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware untuk logging request
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Rute untuk health check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'API berjalan dengan baik',
    timestamp: new Date().toISOString()
  });
});

// Rute API
app.use('/api', apiRoutes);

// Middleware untuk menangani rute yang tidak ditemukan
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Rute tidak ditemukan'
  });
});

// Middleware untuk menangani error
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    status: 'error',
    message: 'Terjadi kesalahan pada server'
  });
});

// Jalankan server
async function startServer() {
  try {
    // Tes koneksi database
    const isConnected = await testConnection();
    
    if (!isConnected) {
      console.error('Gagal terhubung ke database. Server tidak dijalankan.');
      process.exit(1);
    }
    
    // Jalankan server
    app.listen(PORT, () => {
      console.log(`Server berjalan di http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Error saat menjalankan server:', error);
    process.exit(1);
  }
}

startServer();