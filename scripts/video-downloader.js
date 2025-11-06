require('dotenv').config();
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const XLSX = require('xlsx');

const EXCEL_PATH = process.env.EXCEL_FILE_PATH || path.join(__dirname, '../data/posts.xlsx');
const VIDEO_PUBLIC_PATH = process.env.VIDEO_PUBLIC_PATH || path.join(__dirname, '../videos/public');

// Tạo thư mục nếu chưa tồn tại
if (!fs.existsSync(VIDEO_PUBLIC_PATH)) {
  fs.mkdirSync(VIDEO_PUBLIC_PATH, { recursive: true });
}

/**
 * Đọc dữ liệu từ Excel
 */
function readExcel() {
  if (!fs.existsSync(EXCEL_PATH)) {
    throw new Error(`Excel file not found: ${EXCEL_PATH}`);
  }

  const workbook = XLSX.readFile(EXCEL_PATH);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const data = XLSX.utils.sheet_to_json(worksheet);

  console.log(`📊 Read ${data.length} rows from Excel`);
  return data;
}

/**
 * Ghi lại Excel sau khi update status
 */
function writeExcel(data) {
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(data);
  
  // Auto-size columns
  const colWidths = [
    { wch: 12 }, { wch: 50 }, { wch: 30 }, { wch: 40 },
    { wch: 50 }, { wch: 12 }, { wch: 50 }, { wch: 60 },
    { wch: 12 }, { wch: 50 }, { wch: 30 }
  ];
  worksheet['!cols'] = colWidths;
  
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Posts');
  XLSX.writeFile(workbook, EXCEL_PATH);
  console.log('✅ Excel updated');
}

/**
 * Download video từ URL
 */
async function downloadVideo(url, videoId) {
  console.log(`📥 Downloading: ${url}`);

  try {
    const response = await axios({
      method: 'GET',
      url: url,
      responseType: 'stream',
      timeout: 120000, // 2 phút timeout
      maxContentLength: 500 * 1024 * 1024, // Max 500MB
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    // Tạo filename
    const timestamp = Date.now();
    const ext = path.extname(url).split('?')[0] || '.mp4';
    const filename = `${videoId}_${timestamp}${ext}`;
    const filepath = path.join(VIDEO_PUBLIC_PATH, filename);

    // Download file
    const writer = fs.createWriteStream(filepath);
    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on('finish', () => {
        const stats = fs.statSync(filepath);
        const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);
        console.log(`   ✅ Downloaded: ${filename} (${sizeMB} MB)`);
        resolve({
          success: true,
          filename: filename,
          filepath: filepath,
          size: stats.size,
          url: `${process.env.VIDEO_SERVER_URL}/${filename}`
        });
      });

      writer.on('error', (err) => {
        reject(err);
      });
    });

  } catch (error) {
    console.error(`   ❌ Download failed: ${error.message}`);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Process tất cả video có status = NEW
 */
async function processVideos() {
  console.log('\n' + '='.repeat(60));
  console.log('🎬 Video Downloader - Processing Excel File');
  console.log('='.repeat(60) + '\n');

  // Đọc Excel
  let data;
  try {
    data = readExcel();
  } catch (error) {
    console.error('❌ Error reading Excel:', error.message);
    console.log('\n💡 Tip: Run "node scripts/create-excel-template.js" first\n');
    return;
  }

  // Lọc videos cần download (status = NEW)
  const newVideos = data.filter(row => 
    row.status === 'NEW' && row.video_download_url
  );

  if (newVideos.length === 0) {
    console.log('✅ No new videos to download');
    console.log('💡 Tip: Add rows with status=NEW in Excel\n');
    return;
  }

  console.log(`📋 Found ${newVideos.length} video(s) to download\n`);

  // Download từng video
  for (const row of newVideos) {
    console.log(`\n📹 Processing: ${row.id}`);
    console.log(`   Title: ${row.title}`);
    console.log(`   URL: ${row.video_download_url}`);

    // Update status = DOWNLOADING
    row.status = 'DOWNLOADING';
    writeExcel(data);

    // Download video
    const result = await downloadVideo(row.video_download_url, row.id);

    if (result.success) {
      // Update status = READY
      row.status = 'READY';
      row.local_video_url = result.url;
      row.local_video_path = result.filepath;
      row.video_size = result.size;
      row.error_message = '';
    } else {
      // Update status = ERROR
      row.status = 'ERROR';
      row.error_message = result.error;
    }

    // Ghi lại Excel
    writeExcel(data);

    // Delay 2s giữa các video
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  console.log('\n' + '='.repeat(60));
  console.log('✅ Video Download Complete!');
  console.log('='.repeat(60) + '\n');

  // Summary
  const ready = data.filter(r => r.status === 'READY').length;
  const errors = data.filter(r => r.status === 'ERROR').length;
  console.log(`📊 Summary:`);
  console.log(`   ✅ Ready: ${ready}`);
  console.log(`   ❌ Errors: ${errors}`);
  console.log(`   📁 Videos saved to: ${VIDEO_PUBLIC_PATH}`);
  console.log('\n🚀 Next step: npm start\n');
}

// CLI usage
if (require.main === module) {
  processVideos().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

module.exports = { downloadVideo, readExcel, writeExcel };
