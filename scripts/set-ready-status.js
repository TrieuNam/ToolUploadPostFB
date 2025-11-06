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

// Set status về READY cho videos đã download thành công
data.forEach(row => {
  if (row.local_video_path && fs.existsSync(row.local_video_path)) {
    row.status = 'READY';
    row.error_message = '';
    console.log(`✅ Set ${row.id}: ${row.status} → READY (video exists)`);
  }
});

// Ghi lại Excel
const newWorkbook = XLSX.utils.book_new();
const newWorksheet = XLSX.utils.json_to_sheet(data);
XLSX.utils.book_append_sheet(newWorkbook, newWorksheet, 'Posts');
XLSX.writeFile(newWorkbook, EXCEL_PATH);

console.log('✅ Status updated successfully!');
