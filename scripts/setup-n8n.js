const fs = require('fs');
const path = require('path');

console.log('\n🚀 n8n Setup Guide\n');
console.log('='.repeat(70));

console.log('\n✅ n8n is running!\n');
console.log('📍 URL: http://localhost:5678');
console.log('👤 Username: admin');
console.log('🔑 Password: admin\n');

console.log('='.repeat(70));
console.log('\n📋 Setup Steps:\n');

console.log('1️⃣  Open n8n in browser:');
console.log('   👉 http://localhost:5678\n');

console.log('2️⃣  First-time setup:');
console.log('   - Create account with email/password');
console.log('   - Or skip and use basic auth (admin/admin)\n');

console.log('3️⃣  Import workflows:\n');

const workflowsDir = path.join(__dirname, '../n8n-workflows');
const workflows = fs.readdirSync(workflowsDir).filter(f => f.endsWith('.json'));

workflows.forEach((file, index) => {
  const filePath = path.join(workflowsDir, file);
  const workflow = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  
  console.log(`   ${index + 1}. ${workflow.name || file}`);
  console.log(`      File: n8n-workflows/${file}`);
  console.log(`      Description: ${workflow.meta?.description || 'Automated workflow'}`);
  console.log('');
});

console.log('   📝 How to import:');
console.log('   a) Click "New" → "Import from File"');
console.log('   b) Select workflow JSON file');
console.log('   c) Click "Import"\n');

console.log('4️⃣  Configure credentials:\n');
console.log('   - Edit each workflow');
console.log('   - Update HTTP Request nodes with correct URLs');
console.log('   - Test workflow with "Execute Workflow" button\n');

console.log('5️⃣  Activate workflows:\n');
console.log('   - Toggle "Active" switch in workflow');
console.log('   - Scheduled workflows will run automatically\n');

console.log('='.repeat(70));
console.log('\n🔧 Available Workflows:\n');

console.log('📅 Scheduled Workflow (tiktok-excel-scheduled.json):');
console.log('   - Runs every 30 minutes');
console.log('   - Reads Excel for NEW videos');
console.log('   - Downloads videos');
console.log('   - Posts to Facebook\n');

console.log('🔗 Webhook Workflow (tiktok-facebook-auto.json):');
console.log('   - Triggered by HTTP POST');
console.log('   - Real-time processing');
console.log('   - Returns result immediately\n');

console.log('='.repeat(70));
console.log('\n💡 Quick Test:\n');

console.log('1. Start API server:');
console.log('   npm run api\n');

console.log('2. Add test video:');
console.log('   curl -X POST http://localhost:3000/api/videos/add \\');
console.log('     -H "Content-Type: application/json" \\');
console.log('     -d \'{"video_url":"https://vt.tiktok.com/...", "title":"Test"}\'\n');

console.log('3. Trigger workflow from n8n:');
console.log('   - Open workflow in n8n');
console.log('   - Click "Execute Workflow"');
console.log('   - Watch execution in real-time\n');

console.log('='.repeat(70));
console.log('\n📊 Monitoring:\n');

console.log('View n8n logs:');
console.log('   npm run n8n:logs\n');

console.log('Check container status:');
console.log('   docker ps\n');

console.log('Stop n8n:');
console.log('   npm run n8n:stop\n');

console.log('Restart n8n:');
console.log('   npm run n8n:stop && npm run n8n\n');

console.log('='.repeat(70));
console.log('\n🎯 Next Steps:\n');

console.log('1. ✅ Access n8n: http://localhost:5678');
console.log('2. ✅ Import 2 workflows');
console.log('3. ✅ Configure & test');
console.log('4. ✅ Activate automated posting\n');

console.log('📚 Full documentation: docs/N8N_SETUP.md\n');
