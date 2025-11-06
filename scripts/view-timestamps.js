const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');

const EXCEL_PATH = path.join(__dirname, '../data/posts.xlsx');

console.log('\n⏰ Facebook Post Timestamps Report\n');
console.log('='.repeat(80));

if (!fs.existsSync(EXCEL_PATH)) {
  console.log('❌ Excel file not found:', EXCEL_PATH);
  process.exit(1);
}

// Đọc Excel
const workbook = XLSX.readFile(EXCEL_PATH);
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];
const data = XLSX.utils.sheet_to_json(worksheet);

console.log(`📊 Total videos: ${data.length}\n`);

// Group by status
const statusGroups = {};
data.forEach(row => {
  const status = row.status || 'UNKNOWN';
  if (!statusGroups[status]) {
    statusGroups[status] = [];
  }
  statusGroups[status].push(row);
});

// Print summary
console.log('📈 Status Summary:');
Object.keys(statusGroups).forEach(status => {
  console.log(`   ${status}: ${statusGroups[status].length} videos`);
});

console.log('\n' + '='.repeat(80));

// Print posted videos with timestamps
const postedVideos = data.filter(row => row.status === 'POSTED' && row.facebook_post_id);

if (postedVideos.length === 0) {
  console.log('\n📭 No videos posted yet\n');
} else {
  console.log(`\n✅ Posted Videos (${postedVideos.length}):\n`);
  
  postedVideos.forEach((row, index) => {
    console.log(`${index + 1}. ${row.id} - "${row.title || 'Untitled'}"`);
    console.log(`   📘 Facebook Post ID: ${row.facebook_post_id}`);
    console.log(`   🔗 URL: ${row.facebook_post_url || 'N/A'}`);
    
    if (row.facebook_posted_at) {
      console.log(`   🕐 Posted at: ${row.facebook_posted_at}`);
    } else {
      console.log(`   ⚠️  Posted at: Not recorded (old post)`);
    }
    console.log('');
  });
}

// Print pending videos
const pendingVideos = data.filter(row => 
  row.status === 'READY' && !row.facebook_post_id
);

if (pendingVideos.length > 0) {
  console.log('='.repeat(80));
  console.log(`\n⏳ Pending Videos (${pendingVideos.length}):\n`);
  
  pendingVideos.forEach((row, index) => {
    console.log(`${index + 1}. ${row.id} - "${row.title || 'Untitled'}"`);
    console.log(`   📥 Video: ${path.basename(row.local_video_path || 'N/A')}`);
    console.log(`   📊 Size: ${(row.video_size / (1024 * 1024)).toFixed(2)} MB`);
    console.log('');
  });
}

console.log('='.repeat(80) + '\n');
