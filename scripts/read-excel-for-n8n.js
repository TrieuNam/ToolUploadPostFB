#!/usr/bin/env node
/**
 * Read Excel for n8n workflow
 * Outputs JSON that n8n can parse
 */

const XLSX = require('xlsx');
const path = require('path');

// Path to Excel file
const excelPath = path.join(__dirname, '..', 'data', 'posts.xlsx');

try {
    // Read Excel
    const workbook = XLSX.readFile(excelPath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    // Convert to JSON
    const data = XLSX.utils.sheet_to_json(worksheet);
    
    // Filter only NEW status videos
    const newVideos = data.filter(row => row.status === 'NEW');
    
    // Output as JSON for n8n
    const output = {
        success: true,
        total: data.length,
        newCount: newVideos.length,
        videos: newVideos,
        timestamp: new Date().toLocaleString('vi-VN', { 
            timeZone: 'Asia/Ho_Chi_Minh',
            day: '2-digit',
            month: '2-digit', 
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        })
    };
    
    // Output JSON to stdout (n8n will capture this)
    console.log(JSON.stringify(output, null, 2));
    
    process.exit(0);
    
} catch (error) {
    // Output error as JSON
    const errorOutput = {
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
    };
    
    console.log(JSON.stringify(errorOutput, null, 2));
    process.exit(1);
}
