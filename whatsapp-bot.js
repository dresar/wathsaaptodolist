const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const axios = require('axios');
require('dotenv').config();

// Konfigurasi API
const API_URL = process.env.API_URL || 'http://localhost:3000';

// Simpan token JWT dan data pengguna untuk setiap nomor WhatsApp
const userSessions = new Map();

// Inisialisasi client WhatsApp
const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    args: ['--no-sandbox']
  }
});

// Event saat QR code siap untuk dipindai
client.on('qr', (qr) => {
  console.log('QR Code siap untuk dipindai:');
  qrcode.generate(qr, { small: true });
});

// Event saat client siap
client.on('ready', () => {
  console.log('Bot WhatsApp siap digunakan!');
});

// Event saat client terautentikasi
client.on('authenticated', () => {
  console.log('Autentikasi berhasil!');
});

// Event saat client gagal terautentikasi
client.on('auth_failure', (msg) => {
  console.error('Autentikasi gagal:', msg);
});

// Event saat menerima pesan
client.on('message', async (message) => {
  try {
    const chat = await message.getChat();
    const sender = message.from;
    const messageContent = message.body.trim();
    
    // Periksa apakah pesan dari grup
    if (chat.isGroup) {
      // Opsional: Tambahkan logika untuk grup jika diperlukan
      return;
    }
    
    // Proses perintah
    if (messageContent.startsWith('/')) {
      const command = messageContent.split(' ')[0].toLowerCase();
      const args = messageContent.split(' ').slice(1);
      
      switch (command) {
        case '/help':
          await sendHelpMessage(message);
          break;
        
        case '/register':
          await handleRegister(message, args);
          break;
        
        case '/login':
          await handleLogin(message, args);
          break;
        
        case '/logout':
          await handleLogout(message);
          break;
        
        case '/profile':
          await handleProfile(message);
          break;
        
        case '/buat-kategori':
          await handleCreateCategory(message, args);
          break;
        
        case '/lihat-kategori':
          await handleViewCategories(message);
          break;
        
        case '/buat-tugas':
          await handleCreateTask(message, args);
          break;
        
        case '/lihat-tugas':
          await handleViewTasks(message, args);
          break;
        
        case '/update-tugas':
          await handleUpdateTaskStatus(message, args);
          break;
        
        case '/hapus-tugas':
          await handleDeleteTask(message, args);
          break;
        
        default:
          await message.reply('Perintah tidak dikenali. Ketik /help untuk melihat daftar perintah.');
      }
    } else {
      // Jika bukan perintah, kirim pesan bantuan
      await message.reply('Selamat datang di Bot Daftar Tugas! Ketik /help untuk melihat daftar perintah.');
    }
  } catch (error) {
    console.error('Error saat memproses pesan:', error);
    await message.reply('Terjadi kesalahan saat memproses pesan Anda. Silakan coba lagi nanti.');
  }
});

// Function to send help message
async function sendHelpMessage(message) {
  const helpText = `🌟 *BOT DAFTAR TUGAS - BANTUAN* 🌟\n\n` +
    `📋 *PERINTAH UMUM:*\n` +
    `  • /help\n` +
    `  • /register [username] [email] [password]\n` +
    `  • /login [email] [password]\n` +
    `  • /logout\n` +
    `  • /profile\n\n` +
    `🗂️ *PERINTAH KATEGORI:*\n` +
    `  • /buat-kategori [nama] [deskripsi]\n` +
    `  • /lihat-kategori\n\n` +
    `📝 *PERINTAH TUGAS:*\n` +
    `  • /buat-tugas [judul] [deskripsi] [kategori_id]\n` +
    `  • /lihat-tugas\n` +
    `  • /update-tugas [id] [status]\n` +
    `    (pending/in_progress/completed/cancelled)\n` +
    `  • /hapus-tugas [id]\n\n` +
    `💡 *Tip:* Gunakan perintah dengan format yang tepat untuk hasil terbaik!`;
  
  await message.reply(helpText);
}

// Fungsi untuk menangani registrasi
async function handleRegister(message, args) {
  try {
    const sender = message.from;
    
    // Periksa apakah sudah login
    if (userSessions.has(sender)) {
      await message.reply('⚠️ *PERHATIAN!* ⚠️\n\nAnda sudah login. Gunakan */logout* untuk keluar terlebih dahulu.');
      return;
    }
    
    // Validasi argumen
    if (args.length < 3) {
      await message.reply('❌ *FORMAT TIDAK VALID* ❌\n\n📝 Gunakan format yang benar:\n*/register [username] [email] [password]*\n\n💡 *Contoh:* /register johndoe john@example.com password123');
      return;
    }
    
    const username = args[0];
    const email = args[1];
    const password = args[2];
    
    // Kirim permintaan registrasi ke API
    const response = await axios.post(`${API_URL}/api/users/register`, {
      username,
      email,
      password
    });
    
    // Tampilkan informasi registrasi berhasil dengan token
    const token = response.data.data.token;
    const tokenPreview = token.substring(0, 20) + '...' + token.substring(token.length - 20);
    
    const successMessage = `🎉 *REGISTRASI BERHASIL!* 🎉\n\n` +
      `✨ Selamat datang, *${username}*! ✨\n\n` +
      `📋 *DETAIL AKUN:*\n` +
      `  • 👤 *Username:* ${username}\n` +
      `  • 📧 *Email:* ${email}\n` +
      `  • 🔑 *API Key:* ${response.data.data.user.api_key}\n\n` +
      `🔐 *TOKEN ANDA:*\n${tokenPreview}\n\n` +
      `💡 Simpan token ini untuk akses API.\n📲 Gunakan */login* untuk masuk kembali.`;
    
    await message.reply(successMessage);
    
    // Simpan token dan data pengguna
    userSessions.set(sender, {
      token: response.data.data.token,
      user: response.data.data.user
    });
  } catch (error) {
    console.error('Error saat registrasi:', error.response?.data || error.message);
    
    if (error.response?.status === 400) {
      await message.reply(`❌ *ERROR REGISTRASI* ❌\n\n${error.response.data.message || 'Data registrasi tidak valid. Silakan coba lagi.'}\n\n💡 Pastikan email belum terdaftar dan password cukup kuat.`);
    } else {
      await message.reply('❌ *ERROR SISTEM* ❌\n\nTerjadi kesalahan saat registrasi. Silakan coba lagi nanti.\n\n💡 Jika masalah berlanjut, hubungi administrator.');
    }
  }
}

// Fungsi untuk menangani login
async function handleLogin(message, args) {
  try {
    const sender = message.from;
    
    // Periksa apakah sudah login
    if (userSessions.has(sender)) {
      await message.reply('⚠️ *PERHATIAN!* ⚠️\n\nAnda sudah login. Gunakan */logout* untuk keluar terlebih dahulu.');
      return;
    }
    
    // Validasi argumen
    if (args.length < 2) {
      await message.reply('❌ *FORMAT TIDAK VALID* ❌\n\n📝 Gunakan format yang benar:\n*/login [email] [password]*\n\n💡 *Contoh:* /login john@example.com password123');
      return;
    }
    
    const email = args[0];
    const password = args[1];
    
    // Kirim permintaan login ke API
    const response = await axios.post(`${API_URL}/api/users/login`, {
      email,
      password
    });
    
    // Simpan token dan data pengguna
    userSessions.set(sender, {
      token: response.data.data.token,
      user: response.data.data.user
    });
    
    await message.reply(`🔓 *LOGIN BERHASIL!* 🔓\n\n✨ Selamat datang kembali, *${response.data.data.user.username}*! ✨\n\n💡 Gunakan */profile* untuk melihat profil Anda.\n📋 Gunakan */help* untuk melihat daftar perintah.`);
  } catch (error) {
    console.error('Error saat login:', error.response?.data || error.message);
    
    if (error.response?.status === 401) {
      await message.reply('❌ *LOGIN GAGAL* ❌\n\nEmail atau password salah. Silakan coba lagi.\n\n💡 Jika lupa password, hubungi administrator.');
    } else {
      await message.reply('❌ *ERROR SISTEM* ❌\n\nTerjadi kesalahan saat login. Silakan coba lagi nanti.\n\n💡 Jika masalah berlanjut, hubungi administrator.');
    }
  }
}

// Fungsi untuk menangani logout
async function handleLogout(message) {
  try {
    const sender = message.from;
    
    // Periksa apakah sudah login
    if (!userSessions.has(sender)) {
      await message.reply('⚠️ *PERHATIAN!* ⚠️\n\nAnda belum login. Gunakan */login* untuk masuk terlebih dahulu.\n\n💡 Jika belum memiliki akun, gunakan */register* untuk mendaftar.');
      return;
    }
    
    const session = userSessions.get(sender);
    
    // Kirim permintaan logout ke API
    await axios.post(
      `${API_URL}/api/users/logout`,
      {},
      {
        headers: {
          Authorization: `Bearer ${session.token}`
        }
      }
    );
    
    // Hapus sesi pengguna
    userSessions.delete(sender);
    
    await message.reply('🚪 *LOGOUT BERHASIL!* 🚪\n\n👋 Terima kasih telah menggunakan Bot Daftar Tugas.\n\n💡 Gunakan */login* untuk masuk kembali kapan saja.');
  } catch (error) {
    console.error('Error saat logout:', error.response?.data || error.message);
    await message.reply('❌ *ERROR SISTEM* ❌\n\nTerjadi kesalahan saat logout. Silakan coba lagi nanti.\n\n💡 Jika masalah berlanjut, hubungi administrator.');
  }
}

// Fungsi untuk menangani profil
async function handleProfile(message) {
  try {
    const sender = message.from;
    
    // Periksa apakah sudah login
    if (!userSessions.has(sender)) {
      await message.reply('Anda belum login. Gunakan /login untuk masuk.');
      return;
    }
    
    const session = userSessions.get(sender);
    
    // Kirim permintaan profil ke API
    const response = await axios.get(
      `${API_URL}/api/users/profile`,
      {
        headers: {
          Authorization: `Bearer ${session.token}`
        }
      }
    );
    
    const user = response.data.data.user;
    
    // Format pesan profil
    const profileText = `👤 *PROFIL PENGGUNA* 👤\n\n` +
      `📝 *INFORMASI AKUN:*\n` +
      `  • 👤 *Username:* ${user.username}\n` +
      `  • 📧 *Email:* ${user.email}\n` +
      `  • 🛡️ *Role:* ${user.role}\n` +
      `  • 📅 *Bergabung sejak:* ${new Date(user.created_at).toLocaleDateString()}\n\n` +
      `💡 Gunakan */help* untuk melihat daftar perintah yang tersedia.`;
    
    await message.reply(profileText);
  } catch (error) {
    console.error('Error saat mengambil profil:', error.response?.data || error.message);
    
    if (error.response?.status === 401) {
      // Token tidak valid, hapus sesi
      userSessions.delete(message.from);
      await message.reply('⚠️ *SESI BERAKHIR* ⚠️\n\nSesi Anda telah berakhir. Silakan login kembali dengan */login*.\n\n💡 Sesi mungkin berakhir karena token kedaluwarsa atau telah digunakan di perangkat lain.');
    } else {
      await message.reply('❌ *ERROR SISTEM* ❌\n\nTerjadi kesalahan saat mengambil profil. Silakan coba lagi nanti.\n\n💡 Jika masalah berlanjut, hubungi administrator.');
    }
  }
}

// Fungsi untuk menangani pembuatan kategori
async function handleCreateCategory(message, args) {
  try {
    const sender = message.from;
    
    // Periksa apakah sudah login
    if (!userSessions.has(sender)) {
      await message.reply('Anda belum login. Gunakan /login untuk masuk.');
      return;
    }
    
    // Validasi argumen
    if (args.length < 1) {
      await message.reply('❌ *FORMAT TIDAK VALID* ❌\n\n📝 Gunakan format yang benar:\n*/buat-kategori [nama] [deskripsi]*\n\n💡 *Contoh:* /buat-kategori Pekerjaan Tugas-tugas kantor');
      return;
    }
    
    const name = args[0];
    const description = args.slice(1).join(' ');
    const session = userSessions.get(sender);
    
    // Kirim permintaan pembuatan kategori ke API
    const response = await axios.post(
      `${API_URL}/api/categories`,
      {
        name,
        description
      },
      {
        headers: {
          Authorization: `Bearer ${session.token}`
        }
      }
    );
    
    const category = response.data.data.category;
    
    await message.reply(`📁 *KATEGORI BERHASIL DIBUAT!* 📁\n\n📋 *DETAIL KATEGORI:*\n  • 🆔 *ID:* ${category.id}\n  • 📝 *Nama:* ${category.name}\n  • 📄 *Deskripsi:* ${category.description || '-'}\n\n💡 Gunakan */lihat-kategori* untuk melihat semua kategori.\n✏️ Gunakan */buat-tugas* untuk membuat tugas dalam kategori ini.`);
  } catch (error) {
    console.error('Error saat membuat kategori:', error.response?.data || error.message);
    
    if (error.response?.status === 401) {
      // Token tidak valid, hapus sesi
      userSessions.delete(message.from);
      await message.reply('⚠️ *SESI BERAKHIR* ⚠️\n\nSesi Anda telah berakhir. Silakan login kembali dengan */login*.\n\n💡 Sesi mungkin berakhir karena token kedaluwarsa atau telah digunakan di perangkat lain.');
    } else if (error.response?.status === 400) {
      await message.reply(`❌ *ERROR KATEGORI* ❌\n\n${error.response.data.message || 'Data kategori tidak valid.'}\n\n💡 Pastikan nama kategori belum digunakan dan deskripsi tidak terlalu panjang.`);
    } else {
      await message.reply('❌ *ERROR SISTEM* ❌\n\nTerjadi kesalahan saat membuat kategori. Silakan coba lagi nanti.\n\n💡 Jika masalah berlanjut, hubungi administrator.');
    }
  }
}

// Fungsi untuk menangani melihat kategori
async function handleViewCategories(message) {
  try {
    const sender = message.from;
    
    // Periksa apakah sudah login
    if (!userSessions.has(sender)) {
      await message.reply('Anda belum login. Gunakan /login untuk masuk.');
      return;
    }
    
    const session = userSessions.get(sender);
    
    // Kirim permintaan daftar kategori ke API
    const response = await axios.get(
      `${API_URL}/api/categories`,
      {
        headers: {
          Authorization: `Bearer ${session.token}`
        }
      }
    );
    
    const categories = response.data.data.categories;
    
    if (categories.length === 0) {
      await message.reply('📋 *DAFTAR KATEGORI KOSONG* 📋\n\nAnda belum memiliki kategori.\n\n💡 Gunakan */buat-kategori [nama] [deskripsi]* untuk membuat kategori baru.\n\n*Contoh:* /buat-kategori Pekerjaan Tugas-tugas kantor');
      return;
    }
    
    // Format pesan kategori
    let categoriesText = '📋 *DAFTAR KATEGORI* 📋\n\n';
    
    categories.forEach((category, index) => {
      categoriesText += `🔸 *${index + 1}. ${category.name}*\n` +
        `   • 🆔 *ID:* ${category.id}\n` +
        `   • 📄 *Deskripsi:* ${category.description || '-'}\n` +
        `   • 🎨 *Warna:* ${category.color}\n\n`;
    });
    
    categoriesText += `💡 *Tip:* Gunakan ID kategori saat membuat tugas baru dengan */buat-tugas*.`;
    
    await message.reply(categoriesText);
  } catch (error) {
    console.error('Error saat mengambil kategori:', error.response?.data || error.message);
    
    if (error.response?.status === 401) {
      // Token tidak valid, hapus sesi
      userSessions.delete(message.from);
      await message.reply('⚠️ *SESI BERAKHIR* ⚠️\n\nSesi Anda telah berakhir. Silakan login kembali dengan */login*.\n\n💡 Sesi mungkin berakhir karena token kedaluwarsa atau telah digunakan di perangkat lain.');
    } else {
      await message.reply('❌ *ERROR SISTEM* ❌\n\nTerjadi kesalahan saat mengambil kategori. Silakan coba lagi nanti.\n\n💡 Jika masalah berlanjut, hubungi administrator.');
    }
  }
}

// Fungsi untuk menangani pembuatan tugas
async function handleCreateTask(message, args) {
  try {
    const sender = message.from;
    
    // Periksa apakah sudah login
    if (!userSessions.has(sender)) {
      await message.reply('Anda belum login. Gunakan /login untuk masuk.');
      return;
    }
    
    // Validasi argumen
    if (args.length < 3) {
      await message.reply('❌ *FORMAT TIDAK VALID* ❌\n\n📝 Gunakan format yang benar:\n*/buat-tugas [judul] [deskripsi] [kategori_id]*\n\n💡 *Contoh:* /buat-tugas "Laporan Bulanan" "Membuat laporan keuangan bulan ini" 1\n\n📋 Gunakan */lihat-kategori* untuk melihat ID kategori yang tersedia.');
      return;
    }
    
    const title = args[0];
    const category_id = args[args.length - 1];
    const description = args.slice(1, args.length - 1).join(' ');
    const session = userSessions.get(sender);
    
    // Kirim permintaan pembuatan tugas ke API
    const response = await axios.post(
      `${API_URL}/api/tasks`,
      {
        title,
        description,
        category_id
      },
      {
        headers: {
          Authorization: `Bearer ${session.token}`
        }
      }
    );
    
    const task = response.data.data.task;
    
    await message.reply(`✅ *TUGAS BERHASIL DIBUAT!* ✅\n\n📋 *DETAIL TUGAS:*\n  • 🆔 *ID:* ${task.id}\n  • 📝 *Judul:* ${task.title}\n  • 📄 *Deskripsi:* ${task.description || '-'}\n  • 🔄 *Status:* ${task.status}\n  • 📁 *Kategori:* ${task.category_name || 'Tidak ada kategori'}\n\n💡 Gunakan */lihat-tugas* untuk melihat semua tugas.\n🔄 Gunakan */update-tugas ${task.id} [status]* untuk mengubah status tugas ini.`);
  } catch (error) {
    console.error('Error saat membuat tugas:', error.response?.data || error.message);
    
    if (error.response?.status === 401) {
      // Token tidak valid, hapus sesi
      userSessions.delete(message.from);
      await message.reply('⚠️ *SESI BERAKHIR* ⚠️\n\nSesi Anda telah berakhir. Silakan login kembali dengan */login*.\n\n💡 Sesi mungkin berakhir karena token kedaluwarsa atau telah digunakan di perangkat lain.');
    } else if (error.response?.status === 400) {
      await message.reply(`❌ *ERROR TUGAS* ❌\n\n${error.response.data.message || 'Data tugas tidak valid.'}\n\n💡 Pastikan kategori_id valid dan semua data terisi dengan benar.\n📋 Gunakan */lihat-kategori* untuk melihat ID kategori yang tersedia.`);
    } else {
      await message.reply('❌ *ERROR SISTEM* ❌\n\nTerjadi kesalahan saat membuat tugas. Silakan coba lagi nanti.\n\n💡 Jika masalah berlanjut, hubungi administrator.');
    }
  }
}

// Fungsi untuk menangani melihat tugas
async function handleViewTasks(message, args) {
  try {
    const sender = message.from;
    
    // Periksa apakah sudah login
    if (!userSessions.has(sender)) {
      await message.reply('Anda belum login. Gunakan /login untuk masuk.');
      return;
    }
    
    const session = userSessions.get(sender);
    
    // Kirim permintaan daftar tugas ke API
    const response = await axios.get(
      `${API_URL}/api/tasks`,
      {
        headers: {
          Authorization: `Bearer ${session.token}`
        }
      }
    );
    
    const tasks = response.data.data.tasks;
    
    if (tasks.length === 0) {
      await message.reply('📝 *DAFTAR TUGAS KOSONG* 📝\n\nAnda belum memiliki tugas.\n\n💡 Gunakan */buat-tugas [judul] [deskripsi] [kategori_id]* untuk membuat tugas baru.\n\n*Contoh:* /buat-tugas "Laporan Bulanan" "Membuat laporan keuangan bulan ini" 1');
      return;
    }
    
    // Format pesan tugas
    let tasksText = '📝 *DAFTAR TUGAS* 📝\n\n';
    
    tasks.forEach((task, index) => {
      // Emoji untuk status
      let statusEmoji = '⏳'; // default: pending
      if (task.status === 'in_progress') statusEmoji = '🔄';
      else if (task.status === 'completed') statusEmoji = '✅';
      else if (task.status === 'cancelled') statusEmoji = '❌';
      
      // Emoji untuk prioritas
      let priorityEmoji = '🟢'; // default: low
      if (task.priority === 'medium') priorityEmoji = '🟡';
      else if (task.priority === 'high') priorityEmoji = '🔴';
      
      tasksText += `🔸 *${index + 1}. ${task.title}*\n` +
        `   • 🆔 *ID:* ${task.id}\n` +
        `   • 📄 *Deskripsi:* ${task.description || '-'}\n` +
        `   • ${statusEmoji} *Status:* ${task.status}\n` +
        `   • ${priorityEmoji} *Prioritas:* ${task.priority}\n` +
        `   • 📁 *Kategori:* ${task.category_name || 'Tidak ada kategori'}\n\n`;
    });
    
    tasksText += `💡 *Tip:* Gunakan */update-tugas [id] [status]* untuk mengubah status tugas.`;
    
    await message.reply(tasksText);
  } catch (error) {
    console.error('Error saat mengambil tugas:', error.response?.data || error.message);
    
    if (error.response?.status === 401) {
      // Token tidak valid, hapus sesi
      userSessions.delete(message.from);
      await message.reply('⚠️ *SESI BERAKHIR* ⚠️\n\nSesi Anda telah berakhir. Silakan login kembali dengan */login*.\n\n💡 Sesi mungkin berakhir karena token kedaluwarsa atau telah digunakan di perangkat lain.');
    } else {
      await message.reply('❌ *ERROR SISTEM* ❌\n\nTerjadi kesalahan saat mengambil tugas. Silakan coba lagi nanti.\n\n💡 Jika masalah berlanjut, hubungi administrator.');
    }
  }
}

// Fungsi untuk menangani update status tugas
async function handleUpdateTaskStatus(message, args) {
  try {
    const sender = message.from;
    
    // Periksa apakah sudah login
    if (!userSessions.has(sender)) {
      await message.reply('Anda belum login. Gunakan /login untuk masuk.');
      return;
    }
    
    // Validasi argumen
    if (args.length < 2) {
      await message.reply('❌ *FORMAT TIDAK VALID* ❌\n\n📝 Gunakan format yang benar:\n*/update-tugas [id] [status]*\n\n💡 *Contoh:* /update-tugas 1 completed\n\n📋 Status yang tersedia: pending, in_progress, completed, cancelled');
      return;
    }
    
    const id = args[0];
    const status = args[1];
    const session = userSessions.get(sender);
    
    // Validasi status
    const validStatuses = ['pending', 'in_progress', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      await message.reply(`❌ *STATUS TIDAK VALID* ❌\n\n📝 Status harus salah satu dari:\n• *${validStatuses.join('*\n• *')}*\n\n💡 *Contoh:* /update-tugas 1 completed`);
      return;
    }
    
    // Kirim permintaan update status tugas ke API
    const response = await axios.patch(
      `${API_URL}/api/tasks/${id}/status`,
      {
        status
      },
      {
        headers: {
          Authorization: `Bearer ${session.token}`
        }
      }
    );
    
    const task = response.data.data.task;
    
    // Emoji untuk status
    let statusEmoji = '⏳'; // default: pending
    if (task.status === 'in_progress') statusEmoji = '🔄';
    else if (task.status === 'completed') statusEmoji = '✅';
    else if (task.status === 'cancelled') statusEmoji = '❌';
    
    await message.reply(`🔄 *STATUS TUGAS BERHASIL DIPERBARUI!* 🔄\n\n📋 *DETAIL TUGAS:*\n  • 🆔 *ID:* ${task.id}\n  • 📝 *Judul:* ${task.title}\n  • ${statusEmoji} *Status Baru:* ${task.status}\n\n💡 Gunakan */lihat-tugas* untuk melihat semua tugas Anda.`);
  } catch (error) {
    console.error('Error saat memperbarui status tugas:', error.response?.data || error.message);
    
    if (error.response?.status === 401) {
      // Token tidak valid, hapus sesi
      userSessions.delete(message.from);
      await message.reply('⚠️ *SESI BERAKHIR* ⚠️\n\nSesi Anda telah berakhir. Silakan login kembali dengan */login*.\n\n💡 Sesi mungkin berakhir karena token kedaluwarsa atau telah digunakan di perangkat lain.');
    } else if (error.response?.status === 404) {
      await message.reply('❌ *TUGAS TIDAK DITEMUKAN* ❌\n\nTugas dengan ID tersebut tidak ditemukan.\n\n💡 Gunakan */lihat-tugas* untuk melihat daftar tugas dengan ID yang valid.');
    } else {
      await message.reply('❌ *ERROR SISTEM* ❌\n\nTerjadi kesalahan saat memperbarui status tugas. Silakan coba lagi nanti.\n\n💡 Jika masalah berlanjut, hubungi administrator.');
    }
  }
}

// Fungsi untuk menangani penghapusan tugas
async function handleDeleteTask(message, args) {
  try {
    const sender = message.from;
    
    // Periksa apakah sudah login
    if (!userSessions.has(sender)) {
      await message.reply('Anda belum login. Gunakan /login untuk masuk.');
      return;
    }
    
    // Validasi argumen
    if (args.length < 1) {
      await message.reply('❌ *FORMAT TIDAK VALID* ❌\n\n📝 Gunakan format yang benar:\n*/hapus-tugas [id]*\n\n💡 *Contoh:* /hapus-tugas 1\n\n📋 Gunakan */lihat-tugas* untuk melihat ID tugas yang tersedia.');
      return;
    }
    
    const id = args[0];
    const session = userSessions.get(sender);
    
    // Kirim permintaan penghapusan tugas ke API
    await axios.delete(
      `${API_URL}/api/tasks/${id}`,
      {
        headers: {
          Authorization: `Bearer ${session.token}`
        }
      }
    );
    
    await message.reply(`🗑️ *TUGAS BERHASIL DIHAPUS!* 🗑️\n\n✅ Tugas dengan ID *${id}* telah dihapus dari sistem.\n\n💡 Gunakan */lihat-tugas* untuk melihat daftar tugas yang tersisa.\n📝 Gunakan */buat-tugas* untuk membuat tugas baru.`);
  } catch (error) {
    console.error('Error saat menghapus tugas:', error.response?.data || error.message);
    
    if (error.response?.status === 401) {
      // Token tidak valid, hapus sesi
      userSessions.delete(message.from);
      await message.reply('⚠️ *SESI BERAKHIR* ⚠️\n\nSesi Anda telah berakhir. Silakan login kembali dengan */login*.\n\n💡 Sesi mungkin berakhir karena token kedaluwarsa atau telah digunakan di perangkat lain.');
    } else if (error.response?.status === 404) {
      await message.reply('❌ *TUGAS TIDAK DITEMUKAN* ❌\n\nTugas dengan ID tersebut tidak ditemukan.\n\n💡 Gunakan */lihat-tugas* untuk melihat daftar tugas dengan ID yang valid.');
    } else {
      await message.reply('❌ *ERROR SISTEM* ❌\n\nTerjadi kesalahan saat menghapus tugas. Silakan coba lagi nanti.\n\n💡 Jika masalah berlanjut, hubungi administrator.');
    }
  }
}

// Inisialisasi client WhatsApp
client.initialize();