// Demo script để test format timestamp mới
const now = new Date();

console.log('\n⏰ Timestamp Format Demo\n');
console.log('='.repeat(60));

// Format mới: Vietnamese readable
const vnFormat = now.toLocaleString('vi-VN', {
  timeZone: 'Asia/Ho_Chi_Minh',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: false
});

console.log('✅ Format mới (dễ đọc):');
console.log(`   ${vnFormat}`);
console.log(`   Format: DD/MM/YYYY, HH:mm:ss`);
console.log(`   Timezone: Asia/Ho_Chi_Minh (UTC+7)`);
console.log('');

// So sánh với ISO format cũ
const isoFormat = now.toISOString();
console.log('❌ Format cũ (khó đọc):');
console.log(`   ${isoFormat}`);
console.log(`   Format: ISO 8601`);
console.log(`   Timezone: UTC`);
console.log('');

console.log('='.repeat(60));
console.log('\n💡 Ví dụ trong Excel:\n');
console.log('   Cột: facebook_posted_at');
console.log(`   Giá trị: ${vnFormat}`);
console.log('   👁️  Dễ nhìn và hiểu ngay!');
console.log('');

// Parse examples
console.log('='.repeat(60));
console.log('\n🔧 Cách parse timestamp:\n');
console.log('```javascript');
console.log('// Input: "06/11/2025, 21:30:45"');
console.log('const [date, time] = timestamp.split(", ");');
console.log('// date = "06/11/2025"');
console.log('// time = "21:30:45"');
console.log('');
console.log('const [day, month, year] = date.split("/");');
console.log('// day = "06", month = "11", year = "2025"');
console.log('```');
console.log('');
