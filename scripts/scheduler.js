const { exec } = require('child_process');
const path = require('path');

console.log('\n⏰ Facebook Scheduled Poster\n');
console.log('='.repeat(60));
console.log('📅 Checking for scheduled videos...');
console.log('🕐 Current time:', new Date().toLocaleString('en-GB', { 
  timeZone: 'Asia/Ho_Chi_Minh', 
  hour12: false 
}));
console.log('='.repeat(60));

// Run facebook publisher
exec('node scripts/facebook-publisher-simple.js', { 
  cwd: path.join(__dirname, '..')
}, (error, stdout, stderr) => {
  if (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
  
  if (stderr) {
    console.error('⚠️ Stderr:', stderr);
  }
  
  console.log(stdout);
  console.log('\n✅ Scheduler run completed');
});
