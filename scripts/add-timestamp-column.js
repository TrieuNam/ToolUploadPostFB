const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');

const EXCEL_PATH = path.join(__dirname, '../data/posts.xlsx');

console.log('\n📊 Adding timestamp column to Excel...\n');

if (!fs.existsSync(EXCEL_PATH)) {
  console.log('❌ Excel file not found:', EXCEL_PATH);
  process.exit(1);
}

// Đọc Excel hiện tại
const workbook = XLSX.readFile(EXCEL_PATH);
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];
const data = XLSX.utils.sheet_to_json(worksheet);

console.log(`📋 Found ${data.length} records`);

// Thêm cột facebook_posted_at nếu chưa có
let updated = 0;
data.forEach(row => {
  if (!row.hasOwnProperty('facebook_posted_at')) {
    row.facebook_posted_at = '';
    updated++;
  }
});

// Ghi lại Excel
const newWorkbook = XLSX.utils.book_new();
const newWorksheet = XLSX.utils.json_to_sheet(data);

// Auto-size columns
const colWidths = [
  { wch: 12 },  // id
  { wch: 50 },  // video_download_url
  { wch: 30 },  // title
  { wch: 50 },  // description
  { wch: 40 },  // hashtags
  { wch: 50 },  // shopee_links
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
newWorksheet['!cols'] = colWidths;

XLSX.utils.book_append_sheet(newWorkbook, newWorksheet, 'Posts');
XLSX.writeFile(newWorkbook, EXCEL_PATH);

console.log(`✅ Updated ${updated} records`);
console.log(`✅ Excel file updated: ${EXCEL_PATH}\n`);
console.log('📌 New column: facebook_posted_at (ISO timestamp)');
console.log('   Format: 2025-11-06T14:30:45.123Z\n');
