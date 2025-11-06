require('dotenv').config();
const express = require('express');
const { exec } = require('child_process');
const path = require('path');
const XLSX = require('xlsx');
const fs = require('fs');

const app = express();
const PORT = process.env.API_PORT || 3000;

app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'TikTok Auto-Post API'
  });
});

// Trigger download workflow
app.post('/api/trigger/download', async (req, res) => {
  console.log('📥 Triggering video download...');
  
  exec('npm run download:ytdlp', { 
    cwd: __dirname + '/..' 
  }, (error, stdout, stderr) => {
    if (error) {
      console.error('❌ Download error:', error);
      return res.status(500).json({ 
        success: false, 
        error: error.message,
        stderr 
      });
    }
    
    console.log('✅ Download completed');
    res.json({ 
      success: true, 
      message: 'Videos downloaded successfully',
      output: stdout 
    });
  });
});

// Trigger Facebook post workflow
app.post('/api/trigger/post-facebook', async (req, res) => {
  console.log('📘 Triggering Facebook post...');
  
  exec('node scripts/facebook-publisher-simple.js', { 
    cwd: __dirname + '/..' 
  }, (error, stdout, stderr) => {
    if (error) {
      console.error('❌ Post error:', error);
      return res.status(500).json({ 
        success: false, 
        error: error.message,
        stderr 
      });
    }
    
    console.log('✅ Facebook post completed');
    res.json({ 
      success: true, 
      message: 'Videos posted to Facebook',
      output: stdout 
    });
  });
});

// Full workflow: Download + Post
app.post('/api/trigger/full-workflow', async (req, res) => {
  console.log('🚀 Triggering full workflow...');
  
  // Step 1: Download
  exec('npm run download:ytdlp', { 
    cwd: __dirname + '/..' 
  }, (error1, stdout1, stderr1) => {
    if (error1) {
      console.error('❌ Download failed:', error1);
      return res.status(500).json({ 
        success: false, 
        step: 'download',
        error: error1.message 
      });
    }
    
    console.log('✅ Step 1: Download completed');
    
    // Step 2: Post to Facebook
    setTimeout(() => {
      exec('node scripts/facebook-publisher-simple.js', { 
        cwd: __dirname + '/..' 
      }, (error2, stdout2, stderr2) => {
        if (error2) {
          console.error('❌ Post failed:', error2);
          return res.status(500).json({ 
            success: false, 
            step: 'post',
            error: error2.message 
          });
        }
        
        console.log('✅ Step 2: Post completed');
        res.json({ 
          success: true, 
          message: 'Full workflow completed successfully',
          steps: {
            download: stdout1,
            post: stdout2
          }
        });
      });
    }, 5000); // Wait 5 seconds between steps
  });
});

// Get Excel data
app.get('/api/videos', (req, res) => {
  try {
    const EXCEL_PATH = path.join(__dirname, '../data/posts.xlsx');
    const workbook = XLSX.readFile(EXCEL_PATH);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet);
    
    res.json({
      total: data.length,
      videos: data
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Add new video URL to Excel
app.post('/api/videos/add', (req, res) => {
  try {
    const { video_url, title, description, hashtags, shopee_links } = req.body;
    
    if (!video_url) {
      return res.status(400).json({ 
        success: false, 
        error: 'video_url is required' 
      });
    }
    
    const EXCEL_PATH = path.join(__dirname, '../data/posts.xlsx');
    const workbook = XLSX.readFile(EXCEL_PATH);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet);
    
    // Generate new ID
    const newId = `video_${String(data.length + 1).padStart(3, '0')}`;
    
    // Add new row
    data.push({
      id: newId,
      video_download_url: video_url,
      title: title || 'New Video',
      description: description || '',
      hashtags: hashtags || '',
      shopee_links: shopee_links || '',
      scheduled_time: req.body.scheduled_time || '',
      status: 'NEW',
      local_video_url: '',
      local_video_path: '',
      video_size: '',
      tiktok_url: '',
      tiktok_post_id: '',
      facebook_post_id: '',
      facebook_post_url: '',
      facebook_posted_at: '',
      error_message: ''
    });
    
    // Save Excel
    const newWorkbook = XLSX.utils.book_new();
    const newWorksheet = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(newWorkbook, newWorksheet, 'Posts');
    XLSX.writeFile(newWorkbook, EXCEL_PATH);
    
    console.log(`✅ Added new video: ${newId}`);
    res.json({ 
      success: true, 
      message: 'Video added to queue',
      video_id: newId 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log('\n' + '='.repeat(60));
  console.log('🤖 TikTok Auto-Post API Server');
  console.log('='.repeat(60));
  console.log(`📍 Server: http://localhost:${PORT}`);
  console.log('\n📋 Available Endpoints:');
  console.log(`   GET    /health                    - Health check`);
  console.log(`   GET    /api/videos                - List all videos`);
  console.log(`   POST   /api/videos/add            - Add new video to queue`);
  console.log(`   POST   /api/trigger/download      - Trigger download`);
  console.log(`   POST   /api/trigger/post-facebook - Trigger Facebook post`);
  console.log(`   POST   /api/trigger/full-workflow - Run full workflow`);
  console.log('='.repeat(60) + '\n');
});

module.exports = app;
