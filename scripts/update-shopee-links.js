require('dotenv').config();
const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

const EXCEL_PATH = process.env.EXCEL_FILE_PATH || path.join(__dirname, '../data/posts.xlsx');

// Đọc Excel
const workbook = XLSX.readFile(EXCEL_PATH);
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];
const data = XLSX.utils.sheet_to_json(worksheet);

console.log(`📊 Found ${data.length} records`);

// Update shopee links nếu chưa có
data.forEach(row => {
  if (!row.shopee_links || row.shopee_links === '') {
    row.shopee_links = 'https://s.shopee.vn/6AczLK8L0D';
    console.log(`🛒 Added Shopee link to ${row.id}`);
  }
  
  // Reset status về READY để test lại
  if (row.status === 'POSTED') {
    row.status = 'READY';
    row.facebook_post_id = '';
    row.facebook_post_url = '';
    console.log(`🔄 Reset ${row.id} status to READY`);
  }
});

// Ghi lại Excel
const newWorkbook = XLSX.utils.book_new();
const newWorksheet = XLSX.utils.json_to_sheet(data);
XLSX.utils.book_append_sheet(newWorkbook, newWorksheet, 'Posts');
XLSX.writeFile(newWorkbook, EXCEL_PATH);

console.log('✅ Excel updated successfully!');
console.log('\nData preview:');
data.forEach(row => {
  console.log(`  ${row.id}: ${row.shopee_links} (${row.status})`);
});
