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

// Reset status về NEW để download lại
data.forEach(row => {
  if (row.status === 'READY' || row.status === 'ERROR') {
    row.status = 'NEW';
    row.error_message = '';
    row.local_video_path = '';
    row.local_video_url = '';
    row.video_size = '';
    console.log(`🔄 Reset ${row.id}: ${row.status} → NEW`);
  }
});

// Ghi lại Excel
const newWorkbook = XLSX.utils.book_new();
const newWorksheet = XLSX.utils.json_to_sheet(data);
XLSX.utils.book_append_sheet(newWorkbook, newWorksheet, 'Posts');
XLSX.writeFile(newWorkbook, EXCEL_PATH);

console.log('✅ Excel reset successfully!');
