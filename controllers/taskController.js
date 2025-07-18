const { pool } = require('../config/database');

// Fungsi untuk mendapatkan semua tugas
async function getAllTasks(req, res) {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10, status, priority, search } = req.query;
    
    // Hitung offset untuk pagination
    const offset = (page - 1) * limit;
    
    // Buat query dasar
    let query = 'SELECT t.*, c.name as category_name, c.color as category_color FROM tasks t LEFT JOIN categories c ON t.category_id = c.id WHERE t.user_id = ?';
    let countQuery = 'SELECT COUNT(*) as total FROM tasks WHERE user_id = ?';
    let params = [userId];
    let countParams = [userId];
    
    // Tambahkan filter jika ada
    if (status) {
      query += ' AND t.status = ?';
      countQuery += ' AND status = ?';
      params.push(status);
      countParams.push(status);
    }
    
    if (priority) {
      query += ' AND t.priority = ?';
      countQuery += ' AND priority = ?';
      params.push(priority);
      countParams.push(priority);
    }
    
    if (search) {
      query += ' AND (t.title LIKE ? OR t.description LIKE ?)';
      countQuery += ' AND (title LIKE ? OR description LIKE ?)';
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm);
      countParams.push(searchTerm, searchTerm);
    }
    
    // Tambahkan sorting dan pagination
    query += ' ORDER BY t.due_date ASC, t.priority DESC, t.created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));
    
    // Jalankan query
    const [tasks] = await pool.execute(query, params);
    const [countResult] = await pool.execute(countQuery, countParams);
    
    const total = countResult[0].total;
    const totalPages = Math.ceil(total / limit);
    
    return res.status(200).json({
      status: 'success',
      data: {
        tasks,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages
        }
      }
    });
  } catch (error) {
    console.error('Error saat mengambil tugas:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Terjadi kesalahan saat mengambil tugas.'
    });
  }
}

// Fungsi untuk mendapatkan tugas berdasarkan ID
async function getTaskById(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    // Ambil tugas dari database
    const [tasks] = await pool.execute(
      'SELECT t.*, c.name as category_name, c.color as category_color FROM tasks t LEFT JOIN categories c ON t.category_id = c.id WHERE t.id = ? AND t.user_id = ?',
      [id, userId]
    );
    
    if (tasks.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Tugas tidak ditemukan.'
      });
    }
    
    return res.status(200).json({
      status: 'success',
      data: {
        task: tasks[0]
      }
    });
  } catch (error) {
    console.error('Error saat mengambil tugas:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Terjadi kesalahan saat mengambil tugas.'
    });
  }
}

// Fungsi untuk membuat tugas baru
async function createTask(req, res) {
  try {
    const { title, description, priority, due_date, category_id } = req.body;
    const userId = req.user.id;
    
    // Validasi input
    if (!title) {
      return res.status(400).json({
        status: 'error',
        message: 'Judul tugas diperlukan.'
      });
    }
    
    // Validasi kategori jika disediakan
    if (category_id) {
      const [categories] = await pool.execute(
        'SELECT * FROM categories WHERE id = ? AND (user_id = ? OR user_id IS NULL)',
        [category_id, userId]
      );
      
      if (categories.length === 0) {
        return res.status(400).json({
          status: 'error',
          message: 'Kategori tidak valid.'
        });
      }
    }
    
    // Buat tugas baru
    const [result] = await pool.execute(
      'INSERT INTO tasks (title, description, priority, due_date, category_id, user_id) VALUES (?, ?, ?, ?, ?, ?)',
      [title, description || null, priority || 'medium', due_date || null, category_id || null, userId]
    );
    
    // Ambil tugas yang baru dibuat
    const [newTask] = await pool.execute(
      'SELECT t.*, c.name as category_name, c.color as category_color FROM tasks t LEFT JOIN categories c ON t.category_id = c.id WHERE t.id = ?',
      [result.insertId]
    );
    
    return res.status(201).json({
      status: 'success',
      message: 'Tugas berhasil dibuat.',
      data: {
        task: newTask[0]
      }
    });
  } catch (error) {
    console.error('Error saat membuat tugas:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Terjadi kesalahan saat membuat tugas.'
    });
  }
}

// Fungsi untuk memperbarui tugas
async function updateTask(req, res) {
  try {
    const { id } = req.params;
    const { title, description, status, priority, due_date, category_id } = req.body;
    const userId = req.user.id;
    
    // Periksa apakah tugas ada dan milik pengguna
    const [tasks] = await pool.execute(
      'SELECT * FROM tasks WHERE id = ? AND user_id = ?',
      [id, userId]
    );
    
    if (tasks.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Tugas tidak ditemukan.'
      });
    }
    
    const task = tasks[0];
    
    // Validasi kategori jika disediakan
    if (category_id) {
      const [categories] = await pool.execute(
        'SELECT * FROM categories WHERE id = ? AND (user_id = ? OR user_id IS NULL)',
        [category_id, userId]
      );
      
      if (categories.length === 0) {
        return res.status(400).json({
          status: 'error',
          message: 'Kategori tidak valid.'
        });
      }
    }
    
    // Perbarui tugas
    await pool.execute(
      'UPDATE tasks SET title = ?, description = ?, status = ?, priority = ?, due_date = ?, category_id = ? WHERE id = ?',
      [
        title || task.title,
        description !== undefined ? description : task.description,
        status || task.status,
        priority || task.priority,
        due_date || task.due_date,
        category_id !== undefined ? category_id : task.category_id,
        id
      ]
    );
    
    // Ambil tugas yang diperbarui
    const [updatedTask] = await pool.execute(
      'SELECT t.*, c.name as category_name, c.color as category_color FROM tasks t LEFT JOIN categories c ON t.category_id = c.id WHERE t.id = ?',
      [id]
    );
    
    return res.status(200).json({
      status: 'success',
      message: 'Tugas berhasil diperbarui.',
      data: {
        task: updatedTask[0]
      }
    });
  } catch (error) {
    console.error('Error saat memperbarui tugas:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Terjadi kesalahan saat memperbarui tugas.'
    });
  }
}

// Fungsi untuk memperbarui status tugas
async function updateTaskStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const userId = req.user.id;
    
    // Validasi input
    if (!status || !['pending', 'in_progress', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({
        status: 'error',
        message: 'Status tidak valid. Status harus salah satu dari: pending, in_progress, completed, cancelled.'
      });
    }
    
    // Periksa apakah tugas ada dan milik pengguna
    const [tasks] = await pool.execute(
      'SELECT * FROM tasks WHERE id = ? AND user_id = ?',
      [id, userId]
    );
    
    if (tasks.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Tugas tidak ditemukan.'
      });
    }
    
    // Perbarui status tugas
    await pool.execute(
      'UPDATE tasks SET status = ? WHERE id = ?',
      [status, id]
    );
    
    // Ambil tugas yang diperbarui
    const [updatedTask] = await pool.execute(
      'SELECT t.*, c.name as category_name, c.color as category_color FROM tasks t LEFT JOIN categories c ON t.category_id = c.id WHERE t.id = ?',
      [id]
    );
    
    return res.status(200).json({
      status: 'success',
      message: 'Status tugas berhasil diperbarui.',
      data: {
        task: updatedTask[0]
      }
    });
  } catch (error) {
    console.error('Error saat memperbarui status tugas:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Terjadi kesalahan saat memperbarui status tugas.'
    });
  }
}

// Fungsi untuk menghapus tugas
async function deleteTask(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    // Periksa apakah tugas ada dan milik pengguna
    const [tasks] = await pool.execute(
      'SELECT * FROM tasks WHERE id = ? AND user_id = ?',
      [id, userId]
    );
    
    if (tasks.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Tugas tidak ditemukan.'
      });
    }
    
    // Hapus tugas
    await pool.execute(
      'DELETE FROM tasks WHERE id = ?',
      [id]
    );
    
    return res.status(200).json({
      status: 'success',
      message: 'Tugas berhasil dihapus.'
    });
  } catch (error) {
    console.error('Error saat menghapus tugas:', error);
    return res.status(500).json({
      status: 'error',
      message: 'Terjadi kesalahan saat menghapus tugas.'
    });
  }
}

module.exports = {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  updateTaskStatus,
  deleteTask
};