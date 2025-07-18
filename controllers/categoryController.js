const { pool } = require('../config/database');

// Fungsi untuk mendapatkan semua kategori
async function getAllCategories(req, res) {
  try {
    const userId = req.user.id;
    
    // Ambil kategori milik pengguna dan kategori global (user_id = NULL)
    const [categories] = await pool.execute(
      'SELECT * FROM categories WHERE user_id = ? OR user_id IS NULL ORDER BY name ASC',
      [userId]
    );
    
    return res.status(200).json({
      status: 'success',
      data: {
        categories
      }
    });
  } catch (error) {
    console.error('Error saat mengambil kategori:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Terjadi kesalahan saat mengambil kategori.'
    });
  }
}

// Fungsi untuk membuat kategori baru
async function createCategory(req, res) {
  try {
    const { name, description, color } = req.body;
    const userId = req.user.id;
    
    // Validasi input
    if (!name) {
      return res.status(400).json({
        status: 'error',
        message: 'Nama kategori diperlukan.'
      });
    }
    
    // Periksa apakah kategori dengan nama yang sama sudah ada
    const [existingCategories] = await pool.execute(
      'SELECT * FROM categories WHERE name = ? AND (user_id = ? OR user_id IS NULL)',
      [name, userId]
    );
    
    if (existingCategories.length > 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Kategori dengan nama tersebut sudah ada.'
      });
    }
    
    // Buat kategori baru
    const [result] = await pool.execute(
      'INSERT INTO categories (name, description, color, user_id) VALUES (?, ?, ?, ?)',
      [name, description || null, color || '#3498db', userId]
    );
    
    // Ambil kategori yang baru dibuat
    const [newCategory] = await pool.execute(
      'SELECT * FROM categories WHERE id = ?',
      [result.insertId]
    );
    
    return res.status(201).json({
      status: 'success',
      message: 'Kategori berhasil dibuat.',
      data: {
        category: newCategory[0]
      }
    });
  } catch (error) {
    console.error('Error saat membuat kategori:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Terjadi kesalahan saat membuat kategori.'
    });
  }
}

// Fungsi untuk memperbarui kategori
async function updateCategory(req, res) {
  try {
    const { id } = req.params;
    const { name, description, color } = req.body;
    const userId = req.user.id;
    
    // Validasi input
    if (!name) {
      return res.status(400).json({
        status: 'error',
        message: 'Nama kategori diperlukan.'
      });
    }
    
    // Periksa apakah kategori ada dan milik pengguna
    const [categories] = await pool.execute(
      'SELECT * FROM categories WHERE id = ?',
      [id]
    );
    
    if (categories.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Kategori tidak ditemukan.'
      });
    }
    
    const category = categories[0];
    
    // Periksa kepemilikan kategori
    if (category.user_id !== null && category.user_id !== userId) {
      return res.status(403).json({
        status: 'error',
        message: 'Anda tidak memiliki izin untuk memperbarui kategori ini.'
      });
    }
    
    // Perbarui kategori
    await pool.execute(
      'UPDATE categories SET name = ?, description = ?, color = ? WHERE id = ?',
      [name, description || category.description, color || category.color, id]
    );
    
    // Ambil kategori yang diperbarui
    const [updatedCategory] = await pool.execute(
      'SELECT * FROM categories WHERE id = ?',
      [id]
    );
    
    return res.status(200).json({
      status: 'success',
      message: 'Kategori berhasil diperbarui.',
      data: {
        category: updatedCategory[0]
      }
    });
  } catch (error) {
    console.error('Error saat memperbarui kategori:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Terjadi kesalahan saat memperbarui kategori.'
    });
  }
}

// Fungsi untuk menghapus kategori
async function deleteCategory(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    // Periksa apakah kategori ada dan milik pengguna
    const [categories] = await pool.execute(
      'SELECT * FROM categories WHERE id = ?',
      [id]
    );
    
    if (categories.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Kategori tidak ditemukan.'
      });
    }
    
    const category = categories[0];
    
    // Periksa kepemilikan kategori
    if (category.user_id !== null && category.user_id !== userId) {
      return res.status(403).json({
        status: 'error',
        message: 'Anda tidak memiliki izin untuk menghapus kategori ini.'
      });
    }
    
    // Hapus kategori
    await pool.execute(
      'DELETE FROM categories WHERE id = ?',
      [id]
    );
    
    return res.status(200).json({
      status: 'success',
      message: 'Kategori berhasil dihapus.'
    });
  } catch (error) {
    console.error('Error saat menghapus kategori:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Terjadi kesalahan saat menghapus kategori.'
    });
  }
}

module.exports = {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory
};