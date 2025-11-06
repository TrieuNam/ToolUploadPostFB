require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const fs = require('fs');
const XLSX = require('xlsx');

const app = express();
const PORT = process.env.VIDEO_SERVER_PORT || 8080;
const VIDEO_PUBLIC_PATH = process.env.VIDEO_PUBLIC_PATH || path.join(__dirname, '../videos/public');
const EXCEL_PATH = process.env.EXCEL_FILE_PATH || path.join(__dirname, '../data/posts.xlsx');

// Tạo thư mục nếu chưa tồn tại
if (!fs.existsSync(VIDEO_PUBLIC_PATH)) {
  fs.mkdirSync(VIDEO_PUBLIC_PATH, { recursive: true });
}

// Middleware
app.use(cors());
app.use(express.json());

// Logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK',
    timestamp: new Date().toISOString(),
    videos_path: VIDEO_PUBLIC_PATH,
    excel_path: EXCEL_PATH,
    server_url: process.env.VIDEO_SERVER_URL
  });
});

// Serve video files
app.use('/videos', express.static(VIDEO_PUBLIC_PATH, {
  setHeaders: (res, filePath) => {
    res.set('Accept-Ranges', 'bytes');
    res.set('Cache-Control', 'public, max-age=3600');
    res.set('Access-Control-Allow-Origin', '*');
    if (filePath.endsWith('.mp4')) {
      res.set('Content-Type', 'video/mp4');
    }
  }
}));

// List all videos
app.get('/api/videos', (req, res) => {
  try {
    if (!fs.existsSync(VIDEO_PUBLIC_PATH)) {
      return res.json({ count: 0, videos: [] });
    }

    const files = fs.readdirSync(VIDEO_PUBLIC_PATH)
      .filter(file => file.endsWith('.mp4'))
      .map(file => {
        const stats = fs.statSync(path.join(VIDEO_PUBLIC_PATH, file));
        return {
          name: file,
          url: `${process.env.VIDEO_SERVER_URL}/${file}`,
          size: stats.size,
          size_mb: (stats.size / (1024 * 1024)).toFixed(2),
          created: stats.birthtime
        };
      });
    
    res.json({ 
      count: files.length,
      videos: files
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Read Excel data
app.get('/api/posts', (req, res) => {
  try {
    if (!fs.existsSync(EXCEL_PATH)) {
      return res.status(404).json({ 
        error: 'Excel file not found',
        path: EXCEL_PATH,
        tip: 'Run: node scripts/create-excel-template.js'
      });
    }

    const workbook = XLSX.readFile(EXCEL_PATH);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet);

    // Filter by status nếu có query param
    const status = req.query.status;
    const filtered = status ? data.filter(row => row.status === status) : data;

    res.json({
      total: data.length,
      filtered: filtered.length,
      status_filter: status || 'ALL',
      data: filtered
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update video status
app.patch('/api/posts/:id', (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const workbook = XLSX.readFile(EXCEL_PATH);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet);

    const index = data.findIndex(row => row.id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'Video not found' });
    }

    // Update row
    data[index] = { ...data[index], ...updates };

    // Write back
    const newWorksheet = XLSX.utils.json_to_sheet(data);
    const newWorkbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(newWorkbook, newWorksheet, 'Posts');
    XLSX.writeFile(newWorkbook, EXCEL_PATH);

    res.json({
      success: true,
      updated: data[index]
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start server
const server = app.listen(PORT, () => {
  console.log('\n' + '='.repeat(60));
  console.log('✅ Video Server + Excel API Started!');
  console.log('='.repeat(60));
  console.log(`📍 Server: http://localhost:${PORT}`);
  console.log(`📁 Videos: ${VIDEO_PUBLIC_PATH}`);
  console.log(`📊 Excel: ${EXCEL_PATH}`);
  console.log(`🔗 Public URL: ${process.env.VIDEO_SERVER_URL}`);
  console.log('\n📋 Endpoints:');
  console.log(`   GET  /health           - Health check`);
  console.log(`   GET  /api/videos       - List videos`);
  console.log(`   GET  /api/posts        - List Excel data`);
  console.log(`   GET  /api/posts?status=NEW - Filter by status`);
  console.log(`   PATCH /api/posts/:id   - Update status`);
  console.log('='.repeat(60) + '\n');
}).on('error', (err) => {
  console.error('❌ Server error:', err);
});

// Error handling
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
});

process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Rejection:', err);
});

// Graceful shutdown (only on Ctrl+C)
process.on('SIGINT', () => {
  console.log('\n⚠️ Shutting down...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

module.exports = server;
