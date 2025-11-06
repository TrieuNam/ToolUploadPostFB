require('dotenv').config();
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const FormData = require('form-data');
const XLSX = require('xlsx');

const EXCEL_PATH = process.env.EXCEL_FILE_PATH || path.join(__dirname, '../data/posts.xlsx');

// Facebook API Configuration
const FB_PAGE_ID = process.env.FACEBOOK_PAGE_ID;
const FB_PAGE_ACCESS_TOKEN = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;
const FB_API_VERSION = 'v12.0'; // Dùng version cũ hơn để bypass Business Verification

// Parse Vietnamese datetime format: "DD/MM/YYYY, HH:mm:ss"
function parseVietnameseDateTime(dateTimeStr) {
  try {
    const [datePart, timePart] = dateTimeStr.split(', ');
    if (!datePart || !timePart) return null;
    
    const [day, month, year] = datePart.split('/');
    const [hour, minute, second] = timePart.split(':');
    
    if (!day || !month || !year || !hour || !minute) return null;
    
    // Create date object (month is 0-indexed in JS)
    const date = new Date(
      parseInt(year),
      parseInt(month) - 1,
      parseInt(day),
      parseInt(hour),
      parseInt(minute),
      parseInt(second || 0)
    );
    
    return isNaN(date.getTime()) ? null : date;
  } catch (error) {
    return null;
  }
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

// Lấy hoặc tạo playlist
async function getOrCreatePlaylist(playlistName = 'Videos from TikTok') {
  console.log(`\n🎬 Checking for playlist: "${playlistName}"...`);
  
  try {
    // Lấy danh sách playlists hiện có
    const response = await axios.get(
      `https://graph.facebook.com/${FB_API_VERSION}/${FB_PAGE_ID}/video_lists`,
      {
        params: {
          access_token: FB_PAGE_ACCESS_TOKEN
        }
      }
    );

    // Tìm playlist với tên tương ứng
    const existingPlaylist = response.data.data?.find(
      list => list.title === playlistName
    );

    if (existingPlaylist) {
      console.log(`   ✅ Found existing playlist: ${existingPlaylist.id}`);
      return existingPlaylist.id;
    }

    // Nếu chưa có, tạo mới
    console.log(`   📝 Creating new playlist...`);
    const createResponse = await axios.post(
      `https://graph.facebook.com/${FB_API_VERSION}/${FB_PAGE_ID}/video_lists`,
      {
        title: playlistName,
        description: 'Automatically curated videos from TikTok',
        access_token: FB_PAGE_ACCESS_TOKEN
      }
    );

    console.log(`   ✅ Created new playlist: ${createResponse.data.id}`);
    return createResponse.data.id;
  } catch (error) {
    console.log(`   ⚠️ Could not get/create playlist:`, error.response?.data?.error?.message || error.message);
    return null;
  }
}

// Thêm video vào playlist
async function addVideoToPlaylist(videoId, playlistId) {
  if (!playlistId) return false;
  
  try {
    console.log(`   📂 Adding to playlist...`);
    await axios.post(
      `https://graph.facebook.com/${FB_API_VERSION}/${playlistId}/videos`,
      {
        video_id: videoId,
        access_token: FB_PAGE_ACCESS_TOKEN
      }
    );
    console.log(`   ✅ Added to playlist successfully!`);
    return true;
  } catch (error) {
    console.log(`   ⚠️ Could not add to playlist:`, error.response?.data?.error?.message || error.message);
    return false;
  }
}

// Simple Upload Method (for files < 1GB)
async function uploadToFacebookSimple(videoPath, title, description, hashtags = '', shopeeLinks = '') {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`📘 Uploading to Facebook: ${path.basename(videoPath)}`);
  console.log('='.repeat(60));

  const stats = fs.statSync(videoPath);
  const fileSize = stats.size;
  const fileName = path.basename(videoPath);

  console.log(`   📤 Uploading video...`);
  console.log(`   File: ${fileName}`);
  console.log(`   Size: ${(fileSize / (1024 * 1024)).toFixed(2)} MB`);

  try {
    // Build full description with Title at the top + Shopee links
    let fullDescription = '';
    
    // Add title at the top if exists
    if (title) {
      fullDescription += `📌 ${title}\n\n`;
    }
    
    if (description) {
      fullDescription += description + '\n\n';
    }
    if (hashtags) {
      fullDescription += hashtags + '\n\n';
    }
    if (shopeeLinks) {
      fullDescription += '🛒 Mua ngay:\n' + shopeeLinks;
    }
    
    const form = new FormData();
    form.append('source', fs.createReadStream(videoPath));
    // Note: Facebook Video API doesn't support 'title' field directly
    // We include it in description instead
    if (fullDescription.trim()) {
      form.append('description', fullDescription.trim());
    }
    form.append('access_token', FB_PAGE_ACCESS_TOKEN);

    const response = await axios.post(
      `https://graph-video.facebook.com/${FB_API_VERSION}/${FB_PAGE_ID}/videos`,
      form,
      {
        headers: {
          ...form.getHeaders()
        },
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            process.stdout.write(`\r   Progress: ${percentCompleted}%`);
          }
        }
      }
    );

    console.log('\n   ✅ Video uploaded successfully!');
    console.log(`   🔗 Post ID: ${response.data.id}`);
    console.log(`   🔗 URL: https://www.facebook.com/${response.data.id}`);

    return {
      success: true,
      videoId: response.data.id,
      postUrl: `https://www.facebook.com/${response.data.id}`
    };
  } catch (error) {
    console.error('\n   ❌ Failed to upload video:',error.response?.data || error.message);
    return {
      success: false,
      error: error.response?.data?.error?.message || error.message
    };
  }
}

// Process videos from Excel
async function processExcelVideos() {
  console.log('\n' + '='.repeat(60));
  console.log('📘 Facebook Video Publisher (Simple Upload)');
  console.log('='.repeat(60));
  console.log(`📊 Excel: ${EXCEL_PATH}`);
  console.log(`📄 Page ID: ${FB_PAGE_ID}\n`);

  if (!FB_PAGE_ID || !FB_PAGE_ACCESS_TOKEN) {
    console.log('❌ Missing Facebook credentials!');
    console.log('   Please set FACEBOOK_PAGE_ID and FACEBOOK_PAGE_ACCESS_TOKEN in .env file');
    return;
  }

  const data = readExcel();
  
  if (data.length === 0) {
    console.log('❌ No data found in Excel file');
    return;
  }

  console.log(`📋 Found ${data.length} records\n`);

  // Lấy hoặc tạo playlist
  const playlistId = await getOrCreatePlaylist('Videos from TikTok');

  let posted = 0;
  let errors = 0;
  let skipped = 0;

  for (let row of data) {
    // Chỉ post những video có status = READY và chưa có facebook_post_id
    if (row.status !== 'READY') {
      skipped++;
      continue;
    }

    if (row.facebook_post_id) {
      console.log(`\n⏭️  Skipping ${row.id}: Already posted to Facebook`);
      skipped++;
      continue;
    }

    // Kiểm tra scheduled_time nếu có
    if (row.scheduled_time && row.scheduled_time.trim() !== '') {
      const now = new Date();
      const scheduledDate = parseVietnameseDateTime(row.scheduled_time);
      
      if (scheduledDate && now < scheduledDate) {
        console.log(`\n⏰ Skipping ${row.id}: Scheduled for ${row.scheduled_time}`);
        console.log(`   Current time: ${now.toLocaleString('en-GB', { timeZone: 'Asia/Ho_Chi_Minh', hour12: false })}`);
        skipped++;
        continue;
      }
    }

    if (!row.local_video_path || !fs.existsSync(row.local_video_path)) {
      console.log(`\n⚠️ Skipping ${row.id}: Video file not found`);
      row.status = 'ERROR';
      row.error_message = 'Video file not found';
      writeExcel(data);
      errors++;
      continue;
    }

    // Update status sang POSTING
    row.status = 'POSTING';
    writeExcel(data);

    const title = row.title || 'Untitled Video';
    const description = row.description || '';
    const hashtags = row.hashtags || '';
    const shopeeLinks = row.shopee_links || '';

    try {
      const result = await uploadToFacebookSimple(
        row.local_video_path,
        title,
        description,
        hashtags,
        shopeeLinks
      );

      if (result.success) {
        const now = new Date();
        
        row.status = 'POSTED';
        row.facebook_post_id = result.videoId;
        row.facebook_post_url = result.postUrl;
        // Lưu định dạng dễ đọc: DD/MM/YYYY, HH:mm:ss (giờ Việt Nam)
        row.facebook_posted_at = now.toLocaleString('en-GB', {
          timeZone: 'Asia/Ho_Chi_Minh',
          hour12: false
        });
        row.error_message = '';
        
        // Thêm vào playlist
        if (playlistId) {
          await addVideoToPlaylist(result.videoId, playlistId);
        }
        
        posted++;
        console.log(`\n✅ Success: ${row.id} posted to Facebook`);
        console.log(`   🕐 Posted at: ${row.facebook_posted_at}`);
      } else {
        row.status = 'ERROR';
        row.error_message = result.error;
        errors++;
        
        console.log(`\n❌ Failed: ${row.id} - ${result.error}`);
      }

    } catch (error) {
      row.status = 'ERROR';
      row.error_message = error.message;
      errors++;
      
      console.log(`\n❌ Failed: ${row.id} - ${error.message}`);
    }

    writeExcel(data);

    // Delay để tránh rate limit
    if (posted > 0 && posted % 5 === 0) {
      console.log('\n⏳ Waiting 60 seconds to avoid rate limit...');
      await new Promise(resolve => setTimeout(resolve, 60000));
    }
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 Summary:');
  console.log(`   ✅ Posted: ${posted}`);
  console.log(`   ⏭️  Skipped: ${skipped}`);
  console.log(`   ❌ Errors: ${errors}`);
  console.log('='.repeat(60) + '\n');
}

// Main
if (require.main === module) {
  processExcelVideos().catch(error => {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  });
}

module.exports = { uploadToFacebookSimple, processExcelVideos };
