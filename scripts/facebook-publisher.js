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
const FB_API_VERSION = 'v21.0';

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

// Step 1: Start Upload Session
async function startUploadSession(videoPath) {
  const stats = fs.statSync(videoPath);
  const fileSize = stats.size;
  const fileName = path.basename(videoPath);

  console.log(`   📤 Starting upload session...`);
  console.log(`   File: ${fileName}`);
  console.log(`   Size: ${(fileSize / (1024 * 1024)).toFixed(2)} MB`);

  try {
    const response = await axios.post(
      `https://graph.facebook.com/${FB_API_VERSION}/${FB_PAGE_ID}/videos`,
      {
        upload_phase: 'start',
        file_size: fileSize,
        access_token: FB_PAGE_ACCESS_TOKEN
      }
    );

    console.log(`   ✅ Upload session created: ${response.data.video_id}`);
    return {
      videoId: response.data.video_id,
      uploadSessionId: response.data.upload_session_id
    };
  } catch (error) {
    console.error('   ❌ Failed to start upload session:', error.response?.data || error.message);
    throw error;
  }
}

// Step 2: Upload Video File
async function uploadVideoFile(videoPath, uploadSessionId, startOffset = 0) {
  const stats = fs.statSync(videoPath);
  const fileSize = stats.size;

  console.log(`   📤 Uploading video file...`);

  try {
    const fileStream = fs.createReadStream(videoPath, { start: startOffset });
    
    const response = await axios.post(
      `https://graph.facebook.com/${FB_API_VERSION}/${FB_PAGE_ID}/videos`,
      fileStream,
      {
        params: {
          upload_phase: 'transfer',
          upload_session_id: uploadSessionId,
          start_offset: startOffset,
          access_token: FB_PAGE_ACCESS_TOKEN
        },
        headers: {
          'Content-Type': 'application/octet-stream'
        },
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / fileSize);
          process.stdout.write(`\r   Progress: ${percentCompleted}%`);
        }
      }
    );

    console.log('\n   ✅ Video uploaded successfully');
    return response.data;
  } catch (error) {
    console.error('\n   ❌ Failed to upload video:', error.response?.data || error.message);
    throw error;
  }
}

// Step 3: Finish Upload & Publish
async function publishVideo(videoId, title, description, hashtags = '') {
  console.log(`   📢 Publishing video...`);

  try {
    const fullDescription = `${description}\n\n${hashtags}`;
    
    const response = await axios.post(
      `https://graph.facebook.com/${FB_API_VERSION}/${FB_PAGE_ID}/videos`,
      {
        upload_phase: 'finish',
        video_id: videoId,
        title: title,
        description: fullDescription,
        access_token: FB_PAGE_ACCESS_TOKEN
      }
    );

    console.log(`   ✅ Video published!`);
    console.log(`   🔗 Post ID: ${response.data.id}`);
    console.log(`   🔗 URL: https://www.facebook.com/${response.data.id}`);
    
    return response.data;
  } catch (error) {
    console.error('   ❌ Failed to publish video:', error.response?.data || error.message);
    throw error;
  }
}

// Main Upload Function
async function uploadToFacebook(videoPath, title, description, hashtags = '') {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`📘 Uploading to Facebook: ${path.basename(videoPath)}`);
  console.log('='.repeat(60));

  try {
    // Step 1: Start upload session
    const { videoId, uploadSessionId } = await startUploadSession(videoPath);

    // Step 2: Upload video file
    await uploadVideoFile(videoPath, uploadSessionId);

    // Step 3: Publish video
    const result = await publishVideo(videoId, title, description, hashtags);

    return {
      success: true,
      videoId: result.id,
      postUrl: `https://www.facebook.com/${result.id}`
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

// Process videos from Excel
async function processExcelVideos() {
  console.log('\n' + '='.repeat(60));
  console.log('📘 Facebook Video Publisher');
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

    try {
      const result = await uploadToFacebook(
        row.local_video_path,
        title,
        description,
        hashtags
      );

      if (result.success) {
        row.status = 'POSTED';
        row.facebook_post_id = result.videoId;
        row.facebook_post_url = result.postUrl;
        row.error_message = '';
        posted++;
        
        console.log(`\n✅ Success: ${row.id} posted to Facebook`);
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

module.exports = { uploadToFacebook, processExcelVideos };
