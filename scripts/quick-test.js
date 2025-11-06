require('dotenv').config();
const axios = require('axios');

const BASE_URL = 'http://localhost:8080';

async function runTests() {
  console.log('\n🧪 Running Quick Tests...\n');

  try {
    // Test 1: Health
    console.log('1️⃣ Testing /health');
    const health = await axios.get(`${BASE_URL}/health`);
    console.log('   ✅ Status:', health.data.status);
    console.log('   📁 Videos Path:', health.data.videos_path);
    console.log('   📊 Excel Path:', health.data.excel_path);

    // Test 2: List videos
    console.log('\n2️⃣ Testing /api/videos');
    const videos = await axios.get(`${BASE_URL}/api/videos`);
    console.log('   ✅ Found', videos.data.count, 'video(s)');
    
    if (videos.data.videos.length > 0) {
      videos.data.videos.forEach(v => {
        console.log(`   📹 ${v.name} (${v.size_mb} MB)`);
        console.log(`      URL: ${v.url}`);
      });
    } else {
      console.log('   💡 No videos yet. Run: npm run download');
    }

    // Test 3: List Excel posts
    console.log('\n3️⃣ Testing /api/posts');
    const posts = await axios.get(`${BASE_URL}/api/posts`);
    console.log('   ✅ Total:', posts.data.total, 'posts');
    console.log('   📊 Status breakdown:');
    
    const statusCount = {};
    posts.data.data.forEach(post => {
      statusCount[post.status] = (statusCount[post.status] || 0) + 1;
    });
    
    Object.entries(statusCount).forEach(([status, count]) => {
      console.log(`      ${status}: ${count}`);
    });

    // Test 4: Filter by READY
    console.log('\n4️⃣ Testing /api/posts?status=READY');
    const ready = await axios.get(`${BASE_URL}/api/posts?status=READY`);
    console.log('   ✅ Ready videos:', ready.data.filtered);

    if (ready.data.data.length > 0) {
      ready.data.data.forEach(post => {
        console.log(`   📹 ${post.id}: ${post.title}`);
        console.log(`      Video URL: ${post.local_video_url}`);
      });
    }

    console.log('\n' + '='.repeat(60));
    console.log('✅ All tests passed!');
    console.log('='.repeat(60) + '\n');

  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.error('   → Make sure server is running: npm start');
    } else if (error.response) {
      console.error('   → Response:', error.response.data);
    }
    process.exit(1);
  }
}

runTests();
