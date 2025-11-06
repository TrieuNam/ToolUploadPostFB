# ⏰ Scheduled Posting Feature

## Overview

Hệ thống hỗ trợ **lên lịch đăng video** tự động vào thời gian cụ thể.

---

## ✨ New Column: `scheduled_time`

### Format
```
DD/MM/YYYY, HH:mm:ss
```

### Examples
```
07/11/2025, 09:00:00  → Đăng lúc 9 giờ sáng ngày 7/11/2025
07/11/2025, 21:30:00  → Đăng lúc 9:30 tối ngày 7/11/2025
(empty)               → Đăng ngay khi status=READY
```

### Behavior
- **Empty/Blank**: Video đăng ngay khi status = READY
- **Future time**: Video chỉ đăng khi đã tới giờ scheduled
- **Past time**: Video đăng ngay (đã qua giờ schedule)

---

## 📊 Excel Usage

### Example 1: Đăng ngay lập tức
| id | title | scheduled_time | status | facebook_posted_at |
|----|-------|----------------|--------|-------------------|
| video_001 | Review phim | *(empty)* | READY | *(will post now)* |

### Example 2: Lên lịch đăng
| id | title | scheduled_time | status | facebook_posted_at |
|----|-------|----------------|--------|-------------------|
| video_002 | Unboxing | 07/11/2025, 09:00:00 | READY | *(will post at 9 AM)* |
| video_003 | Review | 07/11/2025, 21:00:00 | READY | *(will post at 9 PM)* |

### Example 3: Sau khi đã đăng
| id | title | scheduled_time | status | facebook_posted_at |
|----|-------|----------------|--------|-------------------|
| video_002 | Unboxing | 07/11/2025, 09:00:00 | POSTED | 07/11/2025, 09:00:15 |

---

## 🚀 How to Use

### Method 1: Manual Check
```bash
# Chạy 1 lần - chỉ đăng videos đã tới giờ
npm run post:facebook
```

**Console output:**
```
⏰ Skipping video_002: Scheduled for 07/11/2025, 09:00:00
   Current time: 06/11/2025, 23:45:30

✅ Success: video_001 posted to Facebook
   🕐 Posted at: 06/11/2025, 23:45:35
```

### Method 2: Run Scheduler (Cron/Loop)
```bash
# Run every 5 minutes
node scripts/scheduler.js
```

### Method 3: Windows Task Scheduler
1. Open Task Scheduler
2. Create Basic Task
3. Trigger: Daily at 00:00
4. Action: Start a program
   - Program: `node.exe`
   - Arguments: `D:\project\ToolAuto\tiktok-shopee-automation\scripts\scheduler.js`
   - Start in: `D:\project\ToolAuto\tiktok-shopee-automation`
5. Repeat task every: 5 minutes
6. Duration: 1 day

### Method 4: n8n Workflow
```javascript
// Schedule Node: Run every 5 minutes
// Execute Command Node: npm run post:facebook
```

---

## 🔧 API Usage

### Add video with schedule
```bash
curl -X POST http://localhost:3000/api/videos/add \
  -H "Content-Type: application/json" \
  -d '{
    "video_url": "https://vt.tiktok.com/...",
    "title": "Review sản phẩm",
    "scheduled_time": "07/11/2025, 09:00:00"
  }'
```

### Add video for immediate posting
```bash
curl -X POST http://localhost:3000/api/videos/add \
  -H "Content-Type: application/json" \
  -d '{
    "video_url": "https://vt.tiktok.com/...",
    "title": "Review sản phẩm"
  }'
```
*(No scheduled_time = post immediately)*

---

## 📝 Workflow Examples

### Example 1: Post immediately
1. Add video to Excel với `scheduled_time` = empty
2. Download: `npm run download:ytdlp`
3. Post: `npm run post:facebook` → Posts immediately

### Example 2: Schedule for tomorrow 9 AM
1. Add video với `scheduled_time` = "07/11/2025, 09:00:00"
2. Download: `npm run download:ytdlp`
3. Run scheduler every 5 minutes
4. At 9:00 AM → Video posts automatically

### Example 3: Batch schedule
| video_id | scheduled_time | Description |
|----------|----------------|-------------|
| video_001 | 07/11/2025, 09:00:00 | Morning post |
| video_002 | 07/11/2025, 12:00:00 | Lunch time |
| video_003 | 07/11/2025, 18:00:00 | Evening post |
| video_004 | 07/11/2025, 21:00:00 | Night post |

→ Run scheduler → All post at scheduled times

---

## 🔍 Check Schedule

### View all scheduled videos
```bash
node -e "const XLSX = require('xlsx'); const wb = XLSX.readFile('data/posts.xlsx'); const data = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]); const scheduled = data.filter(r => r.scheduled_time && r.status === 'READY'); console.log('Scheduled videos:', scheduled.length); scheduled.forEach(r => console.log(`  ${r.id}: ${r.scheduled_time} - ${r.title}`));"
```

### View pending schedules
```bash
node scripts/view-timestamps.js
```

---

## ⚠️ Important Notes

1. **Timezone**: All times in Asia/Ho_Chi_Minh (UTC+7)
2. **Format**: Must match exactly: `DD/MM/YYYY, HH:mm:ss`
3. **Status**: Video must be READY (downloaded) before scheduled time
4. **Scheduler**: Run scheduler frequently (every 5 mins) for accurate timing
5. **Past times**: Videos with past scheduled_time post immediately
6. **Empty**: Empty scheduled_time = post immediately when READY

---

## 🐛 Troubleshooting

### Video not posting at scheduled time
**Check:**
1. Status = READY? (not NEW or POSTED)
2. scheduled_time format correct?
3. Scheduler running?
4. Video file exists?

**Debug:**
```bash
# Run manually to see skip reason
npm run post:facebook
```

### Wrong timezone
```bash
# Check current time
node -e "console.log(new Date().toLocaleString('en-GB', { timeZone: 'Asia/Ho_Chi_Minh', hour12: false }))"
```

### Format error
**Correct:** `07/11/2025, 09:00:00`  
**Wrong:** `11/07/2025 09:00:00` (no comma)  
**Wrong:** `07-11-2025, 09:00:00` (dash instead of slash)  
**Wrong:** `7/11/2025, 9:00:00` (no leading zeros)

---

## 📊 Example Schedule Plan

### Daily Morning + Evening Posts
```
| Day | Time | Video | scheduled_time |
|-----|------|-------|----------------|
| Mon | 9 AM | Morning news | 07/11/2025, 09:00:00 |
| Mon | 9 PM | Evening review | 07/11/2025, 21:00:00 |
| Tue | 9 AM | Morning news | 08/11/2025, 09:00:00 |
| Tue | 9 PM | Evening review | 08/11/2025, 21:00:00 |
```

### Hourly Posts (Peak Hours)
```
| Time | Video | scheduled_time |
|------|-------|----------------|
| 12 PM | Lunch content | 07/11/2025, 12:00:00 |
| 1 PM | Post-lunch | 07/11/2025, 13:00:00 |
| 6 PM | Evening rush | 07/11/2025, 18:00:00 |
| 9 PM | Prime time | 07/11/2025, 21:00:00 |
```

---

## 🎯 Best Practices

1. **Plan ahead**: Schedule videos 1-2 days in advance
2. **Peak hours**: Post at 9 AM, 12 PM, 6 PM, 9 PM
3. **Consistent timing**: Post at same times daily
4. **Buffer time**: Schedule with 5-minute intervals
5. **Monitor**: Check scheduler logs regularly
6. **Backup**: Keep scheduler running as Windows service

---

## 📚 Related Documentation

- [Excel Structure](../README.md#excel-structure)
- [Timestamps](./TIMESTAMPS.md)
- [n8n Setup](./N8N_SETUP.md)

---

**Updated**: November 6, 2025
