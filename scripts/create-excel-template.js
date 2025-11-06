const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');

const DATA_DIR = path.join(__dirname, '../data');
const EXCEL_PATH = path.join(DATA_DIR, 'posts.xlsx');

// Sample data
const sampleData = [
  {
    id: 'video_001',
    video_download_url: 'https://vt.tiktok.com/ZSyagys6Q/',
    title: 'Review sản phẩm hot',
    description: 'Video review chi tiết sản phẩm mới nhất với giá ưu đãi',
    hashtags: '#review #shopee #giamgia',
    shopee_links: 'https://shope.ee/abc123',
    scheduled_time: '',  // Để trống = đăng ngay, hoặc "07/11/2025, 09:00:00" = lên lịch
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
  },
  {
    id: 'video_002',
    video_download_url: 'https://www.tiktok.com/@cartonvn/video/7558771739644202260',
    title: 'Mở hộp điện thoại mới',
    description: 'Unboxing và đánh giá chi tiết smartphone flagship 2025',
    hashtags: '#unboxing #tech #smartphone',
    shopee_links: 'https://shope.ee/def456,https://shope.ee/ghi789',
    scheduled_time: '',
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
  }
];

console.log('\n📊 Creating Excel Template...\n');

// Tạo thư mục data nếu chưa có
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  console.log('✅ Created directory: data/');
}

// Tạo Excel file
const worksheet = XLSX.utils.json_to_sheet(sampleData);
const workbook = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(workbook, worksheet, 'Posts');

// Auto-size columns
const colWidths = [
  { wch: 12 },  // id
  { wch: 50 },  // video_download_url
  { wch: 30 },  // title
  { wch: 50 },  // description
  { wch: 40 },  // hashtags
  { wch: 50 },  // shopee_links
  { wch: 20 },  // scheduled_time
  { wch: 12 },  // status
  { wch: 50 },  // local_video_url
  { wch: 60 },  // local_video_path
  { wch: 12 },  // video_size
  { wch: 50 },  // tiktok_url
  { wch: 30 },  // tiktok_post_id
  { wch: 30 },  // facebook_post_id
  { wch: 60 },  // facebook_post_url
  { wch: 20 },  // facebook_posted_at
  { wch: 50 }   // error_message
];
worksheet['!cols'] = colWidths;

// Write file
XLSX.writeFile(workbook, EXCEL_PATH);

console.log('✅ Excel template created successfully!');
console.log(`📁 Location: ${EXCEL_PATH}`);
console.log('\n📋 Sample Data:');
console.log('   - 2 sample videos with test download URLs');
console.log('   - Status: NEW (ready to download)');
console.log('\n📝 Columns:');
console.log('   - id: Unique video ID');
console.log('   - video_download_url: HTTP URL to download video');
console.log('   - title: Video title');
console.log('   - hashtags: Space-separated hashtags');
console.log('   - shopee_links: Comma-separated Shopee affiliate links');
console.log('   - status: NEW / DOWNLOADING / READY / POSTED / ERROR');
console.log('   - local_video_url: Auto-filled after download');
console.log('   - local_video_path: Auto-filled after download');
console.log('   - video_size: Auto-filled after download');
console.log('   - tiktok_url: Fill after posting to TikTok');
console.log('   - error_message: Auto-filled if error occurs');
console.log('\n🚀 Next step: npm run download\n');
