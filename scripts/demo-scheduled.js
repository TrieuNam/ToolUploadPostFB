const XLSX = require('xlsx');
const path = require('path');

const EXCEL_PATH = path.join(__dirname, '../data/posts.xlsx');

console.log('\n⏰ Scheduled Posting Demo\n');
console.log('='.repeat(70));

// Current time
const now = new Date();
const nowStr = now.toLocaleString('en-GB', { 
  timeZone: 'Asia/Ho_Chi_Minh', 
  hour12: false 
});

console.log(`🕐 Current time: ${nowStr}\n`);

// Read Excel
const workbook = XLSX.readFile(EXCEL_PATH);
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];
const data = XLSX.utils.sheet_to_json(worksheet);

console.log('📊 Videos in Excel:\n');

data.forEach((row, index) => {
  console.log(`${index + 1}. ${row.id} - "${row.title || 'Untitled'}"`);
  console.log(`   Status: ${row.status}`);
  console.log(`   Scheduled: ${row.scheduled_time || '(none - post immediately)'}`);
  
  if (row.scheduled_time && row.scheduled_time.trim() !== '') {
    // Parse scheduled time
    const [datePart, timePart] = row.scheduled_time.split(', ');
    const [day, month, year] = datePart.split('/');
    const [hour, minute, second] = timePart.split(':');
    
    const scheduledDate = new Date(
      parseInt(year),
      parseInt(month) - 1,
      parseInt(day),
      parseInt(hour),
      parseInt(minute),
      parseInt(second || 0)
    );
    
    const diff = scheduledDate - now;
    const diffMinutes = Math.floor(diff / (1000 * 60));
    const diffHours = Math.floor(diffMinutes / 60);
    
    if (diff > 0) {
      console.log(`   ⏰ Status: WAITING (in ${diffHours}h ${diffMinutes % 60}m)`);
    } else {
      console.log(`   ✅ Status: READY TO POST (time passed)`);
    }
  } else {
    if (row.status === 'READY') {
      console.log(`   ✅ Status: READY TO POST IMMEDIATELY`);
    }
  }
  
  if (row.facebook_posted_at) {
    console.log(`   📘 Posted at: ${row.facebook_posted_at}`);
  }
  
  console.log('');
});

console.log('='.repeat(70));
console.log('\n💡 To schedule a video:\n');
console.log('1. Open data/posts.xlsx');
console.log('2. Find video with status=READY');
console.log('3. Set scheduled_time = "07/11/2025, 09:00:00"');
console.log('4. Run: npm run post:facebook');
console.log('   → Video will skip until scheduled time\n');

console.log('💡 Example scheduled_time values:\n');
const tomorrow = new Date(now);
tomorrow.setDate(tomorrow.getDate() + 1);
tomorrow.setHours(9, 0, 0, 0);
const tomorrowStr = tomorrow.toLocaleString('en-GB', { 
  timeZone: 'Asia/Ho_Chi_Minh', 
  hour12: false 
});
console.log(`   Tomorrow 9 AM:  ${tomorrowStr}`);

const tonight = new Date(now);
tonight.setHours(21, 0, 0, 0);
const tonightStr = tonight.toLocaleString('en-GB', { 
  timeZone: 'Asia/Ho_Chi_Minh', 
  hour12: false 
});
console.log(`   Tonight 9 PM:   ${tonightStr}`);

const nextWeek = new Date(now);
nextWeek.setDate(nextWeek.getDate() + 7);
nextWeek.setHours(12, 0, 0, 0);
const nextWeekStr = nextWeek.toLocaleString('en-GB', { 
  timeZone: 'Asia/Ho_Chi_Minh', 
  hour12: false 
});
console.log(`   Next week noon: ${nextWeekStr}`);
console.log('');
