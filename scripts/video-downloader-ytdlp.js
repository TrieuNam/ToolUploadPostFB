require('dotenv').config();
const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

const EXCEL_PATH = process.env.EXCEL_FILE_PATH || path.join(__dirname, '../data/posts.xlsx');
const VIDEO_DIR = process.env.VIDEO_PUBLIC_PATH || path.join(__dirname, '../videos/public');

// Tạo thư mục nếu chưa tồn tại
if (!fs.existsSync(VIDEO_DIR)) {
  fs.mkdirSync(VIDEO_DIR, { recursive: true });
}

// Đọc Excel
function readExcel() {
  if (!fs.existsSync(EXCEL_PATH)) {
    console.log('❌ Excel file not found:', EXCEL_PATH);
    return [];
  }

  const workbook = XLSX.readFile(EXCEL_PATH);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const data = XLSX.utils.sheet_to_json(worksheet);
  
  return data;
}

// Ghi Excel
function writeExcel(data) {
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(data);
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Posts');
  XLSX.writeFile(workbook, EXCEL_PATH);
}

// Download video bằng yt-dlp
function downloadVideoWithYtDlp(url, outputPath, videoId) {
  return new Promise((resolve, reject) => {
    console.log(`\n📥 Downloading with yt-dlp: ${videoId}`);
    console.log(`   URL: ${url}`);
    
    // Tạo tên file tạm thời
    const tempOutput = path.join(VIDEO_DIR, `temp_${videoId}_%(id)s.%(ext)s`);
    
    // Lệnh yt-dlp với các tùy chọn tốt nhất
    const ytdlpArgs = [
      url,
      '-o', tempOutput,
      '--no-playlist',
      '--format', 'best',
      '--merge-output-format', 'mp4',
      '--no-check-certificate',
      '--quiet',
      '--progress',
      '--newline'
    ];

    const ytdlp = spawn('yt-dlp', ytdlpArgs, {
      stdio: ['ignore', 'pipe', 'pipe']
    });

    let downloadedFile = null;

    ytdlp.stdout.on('data', (data) => {
      const output = data.toString();
      
      // Parse progress
      if (output.includes('%')) {
        const match = output.match(/(\d+\.?\d*)%/);
        if (match) {
          process.stdout.write(`\r   Progress: ${match[1]}%`);
        }
      }
      
      // Detect downloaded file
      const fileMatch = output.match(/\[download\] Destination: (.+)/);
      if (fileMatch) {
        downloadedFile = fileMatch[1].trim();
      }
    });

    ytdlp.stderr.on('data', (data) => {
      console.error(`   Error: ${data.toString()}`);
    });

    ytdlp.on('close', (code) => {
      console.log(''); // New line after progress
      
      if (code !== 0) {
        reject(new Error(`yt-dlp exited with code ${code}`));
        return;
      }

      // Tìm file đã download
      const files = fs.readdirSync(VIDEO_DIR).filter(f => f.startsWith(`temp_${videoId}_`));
      
      if (files.length === 0) {
        reject(new Error('Downloaded file not found'));
        return;
      }

      const tempFile = path.join(VIDEO_DIR, files[0]);
      
      // Rename về tên cuối cùng
      try {
        fs.renameSync(tempFile, outputPath);
        console.log(`✅ Downloaded: ${path.basename(outputPath)}`);
        
        const stats = fs.statSync(outputPath);
        resolve({
          success: true,
          filePath: outputPath,
          size: stats.size,
          sizeMB: (stats.size / (1024 * 1024)).toFixed(2)
        });
      } catch (error) {
        reject(error);
      }
    });

    ytdlp.on('error', (error) => {
      reject(error);
    });
  });
}

// Xử lý download cho tất cả videos
async function processVideos() {
  console.log('\n' + '='.repeat(60));
  console.log('🎬 TikTok Video Downloader (yt-dlp)');
  console.log('='.repeat(60));
  console.log(`📊 Excel: ${EXCEL_PATH}`);
  console.log(`📁 Videos: ${VIDEO_DIR}\n`);

  const data = readExcel();
  
  if (data.length === 0) {
    console.log('❌ No data found in Excel file');
    return;
  }

  console.log(`📋 Found ${data.length} records`);

  let downloaded = 0;
  let errors = 0;
  let skipped = 0;

  for (let row of data) {
    // Chỉ download những video có status = NEW hoặc ERROR
    if (row.status !== 'NEW' && row.status !== 'ERROR') {
      skipped++;
      continue;
    }

    if (!row.video_download_url) {
      console.log(`\n⚠️ Skipping ${row.id}: No download URL`);
      skipped++;
      continue;
    }

    // Update status sang DOWNLOADING
    row.status = 'DOWNLOADING';
    row.error_message = '';
    writeExcel(data);

    const videoId = row.id;
    const timestamp = Date.now();
    const filename = `video_${videoId}_${timestamp}.mp4`;
    const outputPath = path.join(VIDEO_DIR, filename);

    try {
      const result = await downloadVideoWithYtDlp(row.video_download_url, outputPath, videoId);
      
      // Update Excel với thông tin video
      row.status = 'READY';
      row.local_video_path = outputPath;
      row.local_video_url = `${process.env.VIDEO_SERVER_URL}/${filename}`;
      row.video_size = result.size;
      row.error_message = '';
      
      console.log(`   Size: ${result.sizeMB} MB`);
      downloaded++;

    } catch (error) {
      console.log(`❌ Failed: ${error.message}`);
      
      row.status = 'ERROR';
      row.error_message = error.message;
      errors++;
    }

    writeExcel(data);
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 Summary:');
  console.log(`   ✅ Downloaded: ${downloaded}`);
  console.log(`   ⏭️  Skipped: ${skipped}`);
  console.log(`   ❌ Errors: ${errors}`);
  console.log('='.repeat(60) + '\n');
}

// Check if yt-dlp is installed
function checkYtDlp() {
  try {
    execSync('yt-dlp --version', { stdio: 'ignore' });
    return true;
  } catch (error) {
    console.log('❌ yt-dlp is not installed!');
    console.log('   Install with: pip install yt-dlp');
    return false;
  }
}

// Main
if (require.main === module) {
  if (!checkYtDlp()) {
    process.exit(1);
  }
  
  processVideos().catch(error => {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  });
}

module.exports = { processVideos, downloadVideoWithYtDlp };
