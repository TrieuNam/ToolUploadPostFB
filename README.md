# 🚀 TikTok to Facebook Auto-Post System

Hệ thống tự động download videos từ TikTok (không watermark) và đăng lên Facebook Page với Shopee affiliate links.

## ✨ Features

- ✅ Download TikTok videos **không watermark** (yt-dlp)
- ✅ Tự động post lên Facebook Page
- ✅ Thêm Shopee affiliate links vào description
- ✅ Quản lý bằng Excel file
- ✅ REST API để tích hợp
- ✅ n8n workflow automation
- ✅ Video server để serve files locally

---

## 🎯 Quick Start

### 1. Cài đặt

```bash
cd D:\project\ToolAuto\tiktok-shopee-automation
npm install
pip install yt-dlp
```

### 2. Cấu hình

Copy và edit file `.env`:

```env
# Facebook
FACEBOOK_PAGE_ID=your_page_id
FACEBOOK_PAGE_ACCESS_TOKEN=your_token

# Paths
VIDEO_PUBLIC_PATH=d:\project\ToolAuto\tiktok-shopee-automation\videos\public
EXCEL_FILE_PATH=d:\project\ToolAuto\tiktok-shopee-automation\data\posts.xlsx
```

### 3. Workflow Cơ Bản

```bash
# Bước 1: Tạo Excel template
node scripts/create-excel-template.js

# Bước 2: Thêm TikTok URLs vào Excel (data/posts.xlsx)

# Bước 3: Download videos (không watermark)
npm run download:ytdlp

# Bước 4: Post lên Facebook
npm run post:facebook
```

---

## 📚 Available Commands

```bash
# Video Server
npm start                 # Start video server (port 8080)

# Downloading
npm run download          # Download với axios (có watermark)
npm run download:ytdlp    # Download với yt-dlp (KHÔNG watermark) ⭐

# Facebook Posting
npm run post:facebook     # Post videos lên Facebook

# API Server (Automation)
npm run api              # Start API server (port 3000)

# n8n Workflow
npm run n8n              # Start n8n với Docker
npm run n8n:stop         # Stop n8n
npm run n8n:logs         # View logs
```

---

## 🔄 Full Automation với n8n

### Option 1: API Server (Recommended)

```bash
# Start API server
npm run api

# Thêm video qua API
curl -X POST http://localhost:3000/api/videos/add \
  -H "Content-Type: application/json" \
  -d '{
    "video_url": "https://vt.tiktok.com/ZSyagys6Q/",
    "title": "Review sản phẩm hot",
    "shopee_links": "https://s.shopee.vn/6AczLK8L0D"
  }'

# Trigger full workflow (Download + Post)
curl -X POST http://localhost:3000/api/trigger/full-workflow
```

### Option 2: n8n Workflow

```bash
# Start n8n
npm run n8n

# Truy cập: http://localhost:5678
# Username: admin | Password: admin

# Import workflow từ: n8n-workflows/
```

Chi tiết: [N8N_SETUP.md](docs/N8N_SETUP.md)

---

## 📁 Project Structure

```
tiktok-shopee-automation/
├── data/
│   └── posts.xlsx              # Excel database
├── videos/
│   └── public/                 # Downloaded videos
├── scripts/
│   ├── create-excel-template.js    # Tạo Excel
│   ├── video-downloader-ytdlp.js   # Download (yt-dlp)
│   ├── facebook-publisher-simple.js # Post Facebook
│   ├── api-server.js              # REST API
│   └── video-server.js            # Serve videos
├── n8n-workflows/
│   ├── tiktok-facebook-auto.json      # Webhook workflow
│   └── tiktok-excel-scheduled.json    # Scheduled workflow
├── docs/
│   ├── FACEBOOK_SETUP.md          # Facebook API setup
│   └── N8N_SETUP.md               # n8n automation guide
├── .env                           # Config
├── docker-compose.yml             # n8n Docker setup
└── package.json
```

---

## 📊 Excel Structure

File: `data/posts.xlsx`

| Column | Description | Auto-filled |
|--------|-------------|-------------|
| id | Video ID | ❌ Manual |
| video_download_url | TikTok URL | ❌ Manual |
| title | Video title | ❌ Manual |
| description | Description | ❌ Manual |
| hashtags | Hashtags | ❌ Manual |
| shopee_links | Affiliate links | ❌ Manual |
| **scheduled_time** | **Lên lịch đăng (DD/MM/YYYY, HH:mm:ss)** | ❌ Manual |
| status | NEW/DOWNLOADING/READY/POSTED | ✅ Auto |
| local_video_path | Saved path | ✅ Auto |
| local_video_url | HTTP URL | ✅ Auto |
| facebook_post_id | FB Post ID | ✅ Auto |
| facebook_post_url | FB Post URL | ✅ Auto |
| **facebook_posted_at** | **Thời gian đăng (DD/MM/YYYY, HH:mm:ss)** | ✅ Auto |

📝 **View timestamps**: `node scripts/view-timestamps.js`  
⏰ **Scheduled posting**: Empty = đăng ngay, hoặc `07/11/2025, 09:00:00` = lên lịch  
📚 **Full docs**: [SCHEDULED_POSTING.md](docs/SCHEDULED_POSTING.md)

---

## 🔄 Workflow Status

```
NEW → DOWNLOADING → READY → POSTING → POSTED
                          ↓
                        ERROR
```

---

## 🎬 Video Server

Videos được serve qua HTTP server:

```bash
npm start

# Videos available at:
http://localhost:8080/videos/video_001_xxx.mp4
http://localhost:8080/videos/video_002_xxx.mp4

# API endpoints:
http://localhost:8080/api/videos      # List all
http://localhost:8080/api/posts       # Excel data
```

---

## 🔌 REST API Reference

### GET /health
Health check

### GET /api/videos
List all videos trong Excel

### POST /api/videos/add
Thêm video mới vào queue

**Body:**
```json
{
  "video_url": "https://vt.tiktok.com/...",
  "title": "Video title",
  "description": "Description",
  "hashtags": "#tag1 #tag2",
  "shopee_links": "https://s.shopee.vn/..."
}
```

### POST /api/trigger/download
Trigger download workflow

### POST /api/trigger/post-facebook
Trigger Facebook posting

### POST /api/trigger/full-workflow
Run full workflow (Download + Post)

---

## 🛠️ Advanced Configuration

### Facebook API Setup

Chi tiết: [FACEBOOK_SETUP.md](docs/FACEBOOK_SETUP.md)

1. Tạo Facebook App
2. Add Video API
3. Lấy Page Access Token với permissions:
   - `pages_manage_posts`
   - `pages_read_engagement`
   - `publish_video`
4. Chuyển App sang Development Mode

### yt-dlp Configuration

Tùy chỉnh download options trong `scripts/video-downloader-ytdlp.js`:

```javascript
const ytdlpArgs = [
  url,
  '-o', outputPath,
  '--format', 'best',              // Quality
  '--merge-output-format', 'mp4',  // Format
  '--no-playlist',                 // Single video
  '--quiet',                       // Silent
  '--progress'                     // Show progress
];
```

---

## 📝 Example Workflows

### 1. Manual Workflow

```bash
# 1. Edit Excel: Add TikTok URLs
# 2. Download
npm run download:ytdlp
# 3. Post
npm run post:facebook
```

### 2. API Workflow

```bash
# Start API server
npm run api

# Add videos via API
curl -X POST http://localhost:3000/api/videos/add -d '...'

# Trigger workflow
curl -X POST http://localhost:3000/api/trigger/full-workflow
```

### 3. Scheduled Workflow (n8n)

```bash
# Start n8n
npm run n8n

# Import workflow: n8n-workflows/tiktok-excel-scheduled.json
# Activate workflow → Runs every 30 minutes
```

---

## 🐛 Troubleshooting

### Video không download được

```bash
# Check yt-dlp
yt-dlp --version

# Update yt-dlp
pip install --upgrade yt-dlp

# Test manual
yt-dlp https://vt.tiktok.com/... -o test.mp4
```

### Facebook post failed

```bash
# Check token permissions
node scripts/test-fb-permissions.js

# Lấy token mới nếu cần
# See: docs/FACEBOOK_SETUP.md
```

### n8n không start

```bash
# Check Docker
docker ps

# Restart
npm run n8n:stop
npm run n8n
```

---

## 📊 Monitoring

### Check Logs

```bash
# API Server logs (real-time)
npm run api

# n8n logs
npm run n8n:logs

# Check Excel status
curl http://localhost:3000/api/videos
```

### Success Rate

```bash
# View summary trong Excel
# Count: POSTED vs ERROR status
```

---

## 🎯 Performance

- **Download speed**: Depends on TikTok + yt-dlp (~30MB/min)
- **Facebook upload**: ~1 video/30 seconds
- **Rate limits**: 
  - Facebook: 200 posts/day
  - TikTok: No official limit

---

## 📚 Documentation

- [Facebook API Setup](docs/FACEBOOK_SETUP.md)
- [n8n Automation Guide](docs/N8N_SETUP.md)
- [Facebook Video API Docs](https://developers.facebook.com/docs/video-api)
- [yt-dlp Documentation](https://github.com/yt-dlp/yt-dlp)

---

## 🤝 Contributing

Contributions welcome! Please:
1. Fork repo
2. Create feature branch
3. Commit changes
4. Push to branch
5. Open Pull Request

---

## 📄 License

MIT License

---

## 🙏 Credits

- **yt-dlp**: Video download without watermark
- **n8n**: Workflow automation
- **Facebook Graph API**: Video posting
- **Express**: API server

---

## 📞 Support

- Issues: GitHub Issues
- Documentation: [docs/](docs/)

---

**Made with ❤️ for automated content posting**

- n8n for providing a powerful workflow automation tool.
- TikTok and Shopee for their APIs that enable seamless integration.