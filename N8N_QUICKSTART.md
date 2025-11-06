# 🚀 n8n Quick Start Guide

## ✅ Current Status

```
🟢 n8n:        http://localhost:5678  (RUNNING)
🟢 API Server: http://localhost:3000  (RUNNING)
```

---

## 📋 Import Workflow trong 3 bước

### Bước 1: Truy cập n8n
👉 **http://localhost:5678**

### Bước 2: Import Workflow

#### **Option A: Scheduled Workflow** (Khuyến nghị)

1. Click **"Workflows"** → **"Add workflow"** → **"Import from file"**
2. Chọn file: `n8n-workflows/tiktok-excel-scheduled.json`
3. Click **"Import"**

**Workflow này:**
- ⏰ Chạy tự động mỗi 30 phút
- 📊 Đọc Excel tìm videos status=NEW
- 📥 Download videos bằng yt-dlp
- 📘 Post lên Facebook tự động
- ✉️ Gửi email thông báo (optional)

#### **Option B: Webhook Workflow** (Real-time)

1. Import file: `n8n-workflows/tiktok-facebook-auto.json`
2. Nhận webhook URL sau khi import
3. Trigger bằng HTTP POST

**Workflow này:**
- 🔗 Trigger bằng webhook
- ⚡ Xử lý real-time
- 🔄 Trả về kết quả ngay

### Bước 3: Cấu hình Workflow

#### Edit các nodes:

**1. Execute Command (Download):**
```javascript
// Command đã đúng, không cần sửa
npm run download:ytdlp
```

**2. Execute Command (Post Facebook):**
```javascript
// Command đã đúng, không cần sửa
node scripts/facebook-publisher-simple.js
```

**3. Email Node (Optional):**
- SMTP Server: smtp.gmail.com
- Port: 587
- From: your-email@gmail.com
- Password: App Password

#### Test Workflow:

1. Click **"Execute Workflow"** button
2. Xem kết quả real-time trong n8n UI
3. Check Excel để xem status updates

#### Activate Workflow:

1. Toggle **"Active"** switch ở góc trên phải
2. Workflow sẽ tự động chạy theo lịch

---

## 🎯 Test Flow hoàn chỉnh

### Chuẩn bị:

```powershell
# 1. Đảm bảo services đang chạy
node scripts/dashboard.js

# 2. Mở Excel
start data/posts.xlsx
```

### Thêm video test:

**Trong Excel (data/posts.xlsx):**
```
| id        | video_download_url              | title      | scheduled_time        | status |
|-----------|---------------------------------|------------|-----------------------|--------|
| video_003 | https://vt.tiktok.com/ZSya...  | Test Video | (empty or future time)| NEW    |
```

Save Excel và đóng file.

### Option 1: Manual Run

```powershell
# Download video
npm run download:ytdlp

# Check status (should be READY now)
node scripts/demo-scheduled.js

# Post to Facebook
npm run post:facebook
```

### Option 2: Auto với n8n

1. Activate workflow trong n8n
2. Wait 30 minutes (hoặc trigger manual)
3. Check Excel → Status sẽ tự động update: NEW → DOWNLOADING → READY → POSTED

---

## 📊 Monitor Workflow

### View n8n Logs:
```powershell
npm run n8n:logs
```

### View Execution History:
1. Trong n8n UI
2. Click **"Executions"** tab
3. Xem chi tiết mỗi execution

### Check System Status:
```powershell
node scripts/dashboard.js
```

---

## 🔧 Troubleshooting

### Workflow không chạy?

**Check 1: Workflow đã Active?**
```
n8n UI → Workflow → Toggle "Active" = ON
```

**Check 2: Schedule đúng không?**
```
Schedule Node → Interval: 30 minutes
```

**Check 3: Paths đúng không?**
```javascript
// Trong Execute Command node:
Working Directory: /data
Command: npm run download:ytdlp
```

### Videos không download?

```powershell
# Test manual
npm run download:ytdlp

# Check Excel status
node -e "const XLSX = require('xlsx'); const wb = XLSX.readFile('data/posts.xlsx'); const data = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]); console.log(data.filter(r => r.status === 'NEW'));"
```

### Facebook post failed?

```powershell
# Test permissions
node scripts/test-fb-permissions.js

# Check .env
cat .env | Select-String "FACEBOOK"
```

---

## 🎛️ Advanced: Multiple Workflows

### Setup cho production:

1. **Morning Workflow** - Runs at 9 AM
   - Schedule: `0 9 * * *` (cron format)
   - Post morning videos

2. **Afternoon Workflow** - Runs at 3 PM
   - Schedule: `0 15 * * *`
   - Post afternoon videos

3. **Evening Workflow** - Runs at 9 PM
   - Schedule: `0 21 * * *`
   - Post evening videos

### Clone workflow:
1. Open workflow
2. Click "..." menu → "Duplicate"
3. Edit schedule
4. Activate

---

## 📈 Success Checklist

- ✅ n8n running (http://localhost:5678)
- ✅ API Server running (http://localhost:3000)
- ✅ Workflow imported
- ✅ Workflow configured
- ✅ Workflow activated
- ✅ Test execution successful
- ✅ Excel tracking works
- ✅ Facebook posting works
- ✅ Scheduled posting works

---

## 🎉 You're Done!

Hệ thống đã sẵn sàng tự động:
- ⏰ Download videos theo lịch
- 📘 Post lên Facebook tự động
- 📊 Track timestamps trong Excel
- 🔄 Retry nếu có lỗi

**Chỉ cần:**
1. Thêm TikTok URLs vào Excel
2. Set scheduled_time nếu muốn
3. Let it run! 🚀

---

## 📞 Support

- 📚 Full docs: `docs/N8N_SETUP.md`
- 🐛 Issues: Check `docs/TROUBLESHOOTING.md`
- 💬 Questions: Open GitHub issue

---

**Happy Automating! 🤖**
