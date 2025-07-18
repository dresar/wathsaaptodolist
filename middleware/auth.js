const jwt = require('jsonwebtoken');
const { pool } = require('../config/database');

// Middleware untuk verifikasi token JWT
const verifyToken = async (req, res, next) => {
  try {
    // Ambil token dari header Authorization
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        status: 'error',
        message: 'Akses ditolak. Token tidak disediakan.'
      });
    }
    
    // Ekstrak token dari header
    const token = authHeader.split(' ')[1];
    
    // Verifikasi token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Periksa apakah token ada di database
    const [tokenRows] = await pool.execute(
      'SELECT * FROM tokens WHERE token = ? AND user_id = ?',
      [token, decoded.id]
    );
    
    if (tokenRows.length === 0) {
      return res.status(401).json({
        status: 'error',
        message: 'Token tidak valid atau telah kedaluwarsa.'
      });
    }
    
    // Tambahkan informasi user ke request
    req.user = decoded;
    req.token = token;
    
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        status: 'error',
        message: 'Token telah kedaluwarsa.'
      });
    }
    
    return res.status(401).json({
      status: 'error',
      message: 'Token tidak valid.'
    });
  }
};

module.exports = {
  verifyToken
};