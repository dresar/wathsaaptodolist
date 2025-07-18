const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../config/database');
const crypto = require('crypto');

// Fungsi untuk login pengguna
async function login(req, res) {
  try {
    const { email, password } = req.body;
    
    // Validasi input
    if (!email || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Email dan password diperlukan.'
      });
    }
    
    // Cari pengguna berdasarkan email
    const [users] = await pool.execute(
      'SELECT * FROM users WHERE email = ? AND is_active = 1',
      [email]
    );
    
    if (users.length === 0) {
      return res.status(401).json({
        status: 'error',
        message: 'Email atau password salah.'
      });
    }
    
    const user = users[0];
    
    // Verifikasi password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({
        status: 'error',
        message: 'Email atau password salah.'
      });
    }
    
    // Buat token JWT
    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );
    
    // Simpan token ke database
    await pool.execute(
      'INSERT INTO tokens (user_id, token, description) VALUES (?, ?, ?)',
      [user.id, token, 'Login token']
    );
    
    // Catat aktivitas login
    await pool.execute(
      'INSERT INTO activity_logs (user_id, action, details, ip_address, user_agent) VALUES (?, ?, ?, ?, ?)',
      [user.id, 'login', 'User login successful', req.ip, req.headers['user-agent']]
    );
    
    // Kirim respons dengan token
    return res.status(200).json({
      status: 'success',
      message: 'Login berhasil.',
      data: {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role
        },
        token
      }
    });
  } catch (error) {
    console.error('Error saat login:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Terjadi kesalahan saat login.'
    });
  }
}

// Fungsi untuk mendapatkan profil pengguna
async function getProfile(req, res) {
  try {
    const userId = req.user.id;
    
    // Ambil data pengguna dari database
    const [users] = await pool.execute(
      'SELECT id, username, email, profile_photo, role, created_at, updated_at FROM users WHERE id = ?',
      [userId]
    );
    
    if (users.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Pengguna tidak ditemukan.'
      });
    }
    
    return res.status(200).json({
      status: 'success',
      data: {
        user: users[0]
      }
    });
  } catch (error) {
    console.error('Error saat mengambil profil:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Terjadi kesalahan saat mengambil profil.'
    });
  }
}

// Fungsi untuk logout pengguna
async function logout(req, res) {
  try {
    const token = req.token;
    const userId = req.user.id;
    
    // Hapus token dari database
    await pool.execute(
      'DELETE FROM tokens WHERE token = ? AND user_id = ?',
      [token, userId]
    );
    
    return res.status(200).json({
      status: 'success',
      message: 'Logout berhasil.'
    });
  } catch (error) {
    console.error('Error saat logout:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Terjadi kesalahan saat logout.'
    });
  }
}

// Fungsi untuk registrasi pengguna baru
async function register(req, res) {
  try {
    const { username, email, password } = req.body;
    
    // Validasi input
    if (!username || !email || !password) {
      return res.status(400).json({
        status: 'error',
        message: 'Username, email, dan password diperlukan.'
      });
    }
    
    // Validasi format email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        status: 'error',
        message: 'Format email tidak valid.'
      });
    }
    
    // Validasi password (minimal 8 karakter, mengandung huruf dan angka)
    if (password.length < 8 || !/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
      return res.status(400).json({
        status: 'error',
        message: 'Password harus minimal 8 karakter dan mengandung huruf dan angka.'
      });
    }
    
    // Cek apakah email sudah terdaftar
    const [existingUsers] = await pool.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    
    if (existingUsers.length > 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Email sudah terdaftar.'
      });
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Generate API key
    const apiKey = crypto.randomBytes(16).toString('hex');
    
    // Simpan pengguna baru ke database
    const [result] = await pool.execute(
      'INSERT INTO users (username, email, password, api_key, is_active, role, created_at, updated_at) VALUES (?, ?, ?, ?, 1, "user", NOW(), NOW())',
      [username, email, hashedPassword, apiKey]
    );
    
    const userId = result.insertId;
    
    // Buat token JWT
    const token = jwt.sign(
      { id: userId, username, email, role: 'user' },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );
    
    // Simpan token ke database
    await pool.execute(
      'INSERT INTO tokens (user_id, token, description) VALUES (?, ?, ?)',
      [userId, token, 'Registration token']
    );
    
    // Catat aktivitas registrasi
    await pool.execute(
      'INSERT INTO activity_logs (user_id, action, details, ip_address, user_agent) VALUES (?, ?, ?, ?, ?)',
      [userId, 'register', 'User registration successful', req.ip, req.headers['user-agent']]
    );
    
    // Kirim respons dengan token
    return res.status(201).json({
      status: 'success',
      message: 'Yeay! Kamu berhasil daftar, selamat bergabung!',
      data: {
        user: {
          id: userId,
          username,
          email,
          api_key: apiKey,
          role: 'user'
        },
        token
      }
    });
  } catch (error) {
    console.error('Error saat registrasi:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Terjadi kesalahan saat registrasi.'
    });
  }
}

module.exports = {
  login,
  getProfile,
  logout,
  register
};