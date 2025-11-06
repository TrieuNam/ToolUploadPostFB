const axios = require('axios');

console.log('\n🎛️  System Dashboard\n');
console.log('='.repeat(70));

async function checkService(name, url) {
  try {
    const response = await axios.get(url, { timeout: 3000 });
    console.log(`✅ ${name}: RUNNING`);
    console.log(`   URL: ${url}`);
    if (response.data) {
      console.log(`   Status: ${JSON.stringify(response.data).substring(0, 60)}...`);
    }
    return true;
  } catch (error) {
    console.log(`❌ ${name}: NOT RUNNING`);
    console.log(`   URL: ${url}`);
    console.log(`   Error: ${error.message}`);
    return false;
  }
}

async function main() {
  console.log('\n🔍 Checking Services...\n');
  
  // Check n8n
  const n8nRunning = await checkService('n8n', 'http://localhost:5678');
  console.log('');
  
  // Check API Server
  const apiRunning = await checkService('API Server', 'http://localhost:3000/health');
  console.log('');
  
  // Check Video Server (optional)
  // const videoRunning = await checkService('Video Server', 'http://localhost:8080/api/videos');
  // console.log('');
  
  console.log('='.repeat(70));
  console.log('\n📊 System Status:\n');
  
  if (n8nRunning && apiRunning) {
    console.log('🟢 ALL SYSTEMS OPERATIONAL');
    console.log('\n✨ Ready for automation!\n');
    
    console.log('📋 Quick Actions:\n');
    console.log('1. Access n8n:    http://localhost:5678');
    console.log('2. API Endpoints: http://localhost:3000/health');
    console.log('3. Import workflows from: n8n-workflows/');
    console.log('4. View logs:     npm run n8n:logs\n');
  } else {
    console.log('🟡 SOME SERVICES DOWN');
    console.log('\n🔧 Troubleshooting:\n');
    
    if (!n8nRunning) {
      console.log('❌ n8n not running:');
      console.log('   → npm run n8n');
    }
    
    if (!apiRunning) {
      console.log('❌ API Server not running:');
      console.log('   → npm run api');
    }
    console.log('');
  }
  
  console.log('='.repeat(70));
  console.log('\n📚 Documentation:\n');
  console.log('- N8N Setup:          docs/N8N_SETUP.md');
  console.log('- Scheduled Posting:  docs/SCHEDULED_POSTING.md');
  console.log('- Facebook Setup:     docs/FACEBOOK_SETUP.md');
  console.log('- Timestamps:         docs/TIMESTAMPS.md\n');
  
  console.log('='.repeat(70));
  console.log('\n🚀 Next Steps:\n');
  console.log('1. Open n8n: http://localhost:5678');
  console.log('2. Import workflow: n8n-workflows/tiktok-excel-scheduled.json');
  console.log('3. Configure & activate workflow');
  console.log('4. Add videos to Excel with scheduled_time');
  console.log('5. Let automation run!\n');
}

main().catch(console.error);
