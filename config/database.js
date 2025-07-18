const mysql = require('mysql2/promise');
require('dotenv').config();

// Konfigurasi koneksi database
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Fungsi untuk menguji koneksi database
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('Koneksi database berhasil!');
    connection.release();
    return true;
  } catch (error) {
    console.error('Koneksi database gagal:', error.message);
    return false;
  }
}

module.exports = {
  pool,
  testConnection
};