// File ini menjalankan server API dan bot WhatsApp secara bersamaan
require('dotenv').config();
const { spawn } = require('child_process');

// Fungsi untuk menjalankan server API
function startAPIServer() {
  console.log('Memulai server API...');
  const serverProcess = spawn('node', ['server.js'], { stdio: 'inherit' });
  
  serverProcess.on('close', (code) => {
    console.log(`Server API berhenti dengan kode: ${code}`);
    // Restart server jika berhenti dengan error
    if (code !== 0) {
      console.log('Mencoba memulai ulang server API...');
      setTimeout(startAPIServer, 5000);
    }
  });
  
  return serverProcess;
}

// Fungsi untuk menjalankan bot WhatsApp
function startWhatsAppBot() {
  console.log('Memulai bot WhatsApp...');
  const botProcess = spawn('node', ['whatsapp-bot.js'], { stdio: 'inherit' });
  
  botProcess.on('close', (code) => {
    console.log(`Bot WhatsApp berhenti dengan kode: ${code}`);
    // Restart bot jika berhenti dengan error
    if (code !== 0) {
      console.log('Mencoba memulai ulang bot WhatsApp...');
      setTimeout(startWhatsAppBot, 5000);
    }
  });
  
  return botProcess;
}

// Jalankan server API dan bot WhatsApp
const apiServer = startAPIServer();

// Tunggu 5 detik sebelum memulai bot WhatsApp untuk memastikan server API sudah berjalan
setTimeout(() => {
  const whatsappBot = startWhatsAppBot();
  
  // Tangani sinyal SIGINT (Ctrl+C)
  process.on('SIGINT', () => {
    console.log('Mematikan aplikasi...');
    apiServer.kill();
    whatsappBot.kill();
    process.exit(0);
  });
}, 5000);

console.log('Aplikasi sedang dimulai...');