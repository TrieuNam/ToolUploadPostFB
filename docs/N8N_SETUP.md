# 🤖 n8n Automation Setup Guide

## 🚀 Quick Start

### 1. Start n8n với Docker

```bash
# Start n8n
npm run n8n

# Xem logs
npm run n8n:logs

# Stop n8n
npm run n8n:stop
```

### 2. Truy cập n8n UI

Mở browser: **http://localhost:5678**

- Username: `admin`
- Password: `admin`

---

## 📋 Workflow Options

### Option 1: Manual Trigger (Webhook)

Import workflow: `n8n-workflows/tiktok-facebook-auto.json`

**Cách dùng:**
1. Activate workflow trong n8n
2. Copy webhook URL từ n8n
3. Gọi webhook để trigger:

```bash
curl -X POST http://localhost:5678/webhook/tiktok-video \
  -H "Content-Type: application/json" \
  -d '{
    "video_url": "https://vt.tiktok.com/ZSyagys6Q/",
    "title": "Video mới",
    "shopee_link": "https://s.shopee.vn/abc"
  }'
```

### Option 2: Scheduled (Every 30 minutes)

Import workflow: `n8n-workflows/tiktok-excel-scheduled.json`

**Cách dùng:**
1. Import workflow vào n8n
2. Activate workflow
3. Thêm videos vào Excel (status = NEW)
4. Workflow tự động chạy mỗi 30 phút:
   - Check Excel
   - Download videos NEW
   - Post lên Facebook
   - Send email notification

---

## 🔌 API Server (Alternative)

Nếu không muốn dùng n8n, dùng API server:

### Start API Server

```bash
npm run api
```

Server chạy tại: **http://localhost:3000**

### API Endpoints

#### 1. Add Video to Queue

```bash
POST http://localhost:3000/api/videos/add

Body:
{
  "video_url": "https://vt.tiktok.com/ZSyagys6Q/",
  "title": "Review sản phẩm hot",
  "description": "Video review chi tiết",
  "hashtags": "#review #shopee",
  "shopee_links": "https://s.shopee.vn/6AczLK8L0D"
}
```

#### 2. Trigger Download

```bash
POST http://localhost:3000/api/trigger/download
```

#### 3. Trigger Facebook Post

```bash
POST http://localhost:3000/api/trigger/post-facebook
```

#### 4. Full Workflow (Download + Post)

```bash
POST http://localhost:3000/api/trigger/full-workflow
```

#### 5. List All Videos

```bash
GET http://localhost:3000/api/videos
```

---

## 🔄 Full Automation Workflow

### Workflow 1: Excel-based (Recommended)

```
1. Thêm TikTok URLs vào Excel (status=NEW)
   ↓
2. n8n Schedule chạy mỗi 30 phút
   ↓
3. n8n đọc Excel, filter status=NEW
   ↓
4. n8n trigger download script
   ↓
5. Wait 60 seconds
   ↓
6. n8n trigger Facebook post script
   ↓
7. Send email notification
```

### Workflow 2: API-based

```
1. Call API: POST /api/videos/add
   ↓
2. Video added to Excel (status=NEW)
   ↓
3. Call API: POST /api/trigger/full-workflow
   ↓
4. Download → Post → Done
```

### Workflow 3: Webhook-based (Real-time)

```
1. External system POST to webhook
   ↓
2. n8n receives webhook
   ↓
3. n8n adds to Excel
   ↓
4. n8n triggers download
   ↓
5. n8n triggers Facebook post
   ↓
6. n8n responds with success
```

---

## 📊 Monitoring & Logs

### Check n8n Logs

```bash
npm run n8n:logs
```

### Check API Server Logs

```bash
# Terminal sẽ hiển thị real-time logs
npm run api
```

### Check Excel Status

```bash
# Mở Excel file
data/posts.xlsx

# Hoặc dùng API
curl http://localhost:3000/api/videos
```

---

## 🎯 Advanced: n8n Custom Nodes

### Tạo Custom Node cho TikTok Download

1. Vào n8n: Settings → Community Nodes
2. Install: `n8n-nodes-execute-command`
3. Sử dụng trong workflow

### Tạo Error Handling

1. Add **Error Trigger** node
2. Connect to **Send Email** node
3. Nhận thông báo khi có lỗi

---

## 💡 Tips & Best Practices

### 1. Test từng bước

```bash
# Test download
npm run download:ytdlp

# Test post
npm run post:facebook

# Test full
POST http://localhost:3000/api/trigger/full-workflow
```

### 2. Backup Excel

```bash
# Backup trước khi chạy workflow
cp data/posts.xlsx data/posts.backup.xlsx
```

### 3. Monitor rate limits

- Facebook: Max 200 posts/day
- Thêm delay giữa các posts (60s)

### 4. Use environment variables

Update `.env` cho các config:
- `API_PORT=3000`
- `N8N_PORT=5678`
- Schedule timing, etc.

---

## 🔧 Troubleshooting

### n8n không start được

```bash
# Check Docker
docker ps

# Restart
npm run n8n:stop
npm run n8n
```

### Workflow không chạy

1. Check workflow có Active không
2. Check Execute Workflow Manually
3. Check n8n logs: `npm run n8n:logs`

### API Server lỗi

```bash
# Check port 3000 có bị chiếm không
netstat -ano | findstr :3000

# Đổi port trong .env
API_PORT=3001
```

---

## 📚 Resources

- n8n Docs: https://docs.n8n.io
- n8n Community: https://community.n8n.io
- Facebook API: https://developers.facebook.com/docs/video-api

---

## 🎉 Example Use Cases

### Use Case 1: Daily Video Posting

```bash
# Setup cron trong n8n: Chạy hàng ngày 9:00 AM
0 9 * * *

# Workflow sẽ:
- Check Excel cho videos mới
- Download
- Post lên Facebook
- Email summary
```

### Use Case 2: Batch Processing

```bash
# Thêm nhiều videos cùng lúc
curl -X POST http://localhost:3000/api/videos/add -d '{"video_url":"..."}'
curl -X POST http://localhost:3000/api/videos/add -d '{"video_url":"..."}'
curl -X POST http://localhost:3000/api/videos/add -d '{"video_url":"..."}'

# Trigger batch process
curl -X POST http://localhost:3000/api/trigger/full-workflow
```

### Use Case 3: Integration với hệ thống khác

```javascript
// Từ website/app khác
fetch('http://localhost:3000/api/videos/add', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    video_url: tiktokUrl,
    title: title,
    shopee_links: shopeeLink
  })
});
```
