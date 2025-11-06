# 📊 Excel Timestamp Feature

## Overview

Hệ thống đã được cập nhật để tự động ghi lại **thời gian đăng post** lên Facebook.

---

## ✨ New Column

### `facebook_posted_at`
- **Type**: Vietnamese Date/Time String
- **Format**: `DD/MM/YYYY HH:mm:ss`
- **Auto-filled**: ✅ Yes (khi post thành công)
- **Example**: `06/11/2025, 21:30:45`
- **Timezone**: Asia/Ho_Chi_Minh (UTC+7)

---

## 📋 Updated Excel Schema

| # | Column | Type | Auto-filled | Description |
|---|--------|------|-------------|-------------|
| 1 | id | String | ❌ Manual | Video ID (video_001, video_002, ...) |
| 2 | video_download_url | String | ❌ Manual | TikTok URL để download |
| 3 | title | String | ❌ Manual | Tiêu đề video |
| 4 | description | String | ❌ Manual | Mô tả chi tiết |
| 5 | hashtags | String | ❌ Manual | Hashtags (#tag1 #tag2) |
| 6 | shopee_links | String | ❌ Manual | Shopee affiliate links |
| 7 | status | String | ✅ Auto | NEW/DOWNLOADING/READY/POSTING/POSTED/ERROR |
| 8 | local_video_url | String | ✅ Auto | HTTP URL to video (localhost:8080) |
| 9 | local_video_path | String | ✅ Auto | Full local path to video file |
| 10 | video_size | Number | ✅ Auto | File size in bytes |
| 11 | tiktok_url | String | ✅ Auto | Original TikTok URL |
| 12 | tiktok_post_id | String | ❌ Manual | TikTok post ID (if reposting) |
| 13 | facebook_post_id | String | ✅ Auto | Facebook video ID |
| 14 | facebook_post_url | String | ✅ Auto | Facebook post URL |
| 15 | **facebook_posted_at** | String | ✅ Auto | **Timestamp khi post thành công** |
| 16 | error_message | String | ✅ Auto | Error message nếu có |

---

## 🔄 How It Works

### Automatic Timestamp Recording

Khi script `facebook-publisher-simple.js` post video thành công:

```javascript
// Automatically saved when post succeeds
const now = new Date();
row.facebook_posted_at = now.toLocaleString('vi-VN', {
  timeZone: 'Asia/Ho_Chi_Minh',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: false
});
// Example: "06/11/2025, 21:30:45"
```

### Timestamp Format

- **Vietnamese Format**: DD/MM/YYYY, HH:mm:ss
- **Timezone**: Asia/Ho_Chi_Minh (UTC+7)
- **24-hour format**: Không dùng AM/PM
- **Example**: `06/11/2025, 21:30:45`
- **Easy to read**: ✅ Dễ đọc cho người Việt

---

## 📝 Usage

### 1. View All Timestamps

```bash
node scripts/view-timestamps.js
```

**Output:**
```
⏰ Facebook Post Timestamps Report
================================================================================
📊 Total videos: 5

✅ Posted Videos (3):

1. video_001 - "Review sản phẩm hot"
   📘 Facebook Post ID: 759184587141608
   🕐 Posted at: 06/11/2025, 21:23:15

2. video_002 - "Mở hộp điện thoại"
   📘 Facebook Post ID: 2586384751743051
   🕐 Posted at: 06/11/2025, 21:45:30
```

### 2. Add Timestamp Column to Existing Excel

```bash
node scripts/add-timestamp-column.js
```

Sẽ thêm cột `facebook_posted_at` vào Excel hiện tại (giá trị empty cho videos đã post trước đó).

### 3. Check Timestamps via API

```bash
curl http://localhost:3000/api/videos
```

**Response:**
```json
[
  {
    "id": "video_001",
    "title": "Review sản phẩm",
    "status": "POSTED",
    "facebook_post_id": "759184587141608",
    "facebook_posted_at": "06/11/2025, 21:23:15"
  }
]
```

---

## 🛠️ Scripts Updated

### ✅ `facebook-publisher-simple.js`
- Automatically saves timestamp when post succeeds
- Format: ISO 8601 UTC timestamp
- Displays human-readable time in console

### ✅ `api-server.js`
- Includes `facebook_posted_at` field when adding new videos
- Returns timestamp in `/api/videos` endpoint

### ✅ `create-excel-template.js`
- New Excel templates include `facebook_posted_at` column
- Column width: 20 characters

### ✅ New Scripts
- **`add-timestamp-column.js`**: Add timestamp column to existing Excel
- **`view-timestamps.js`**: View report of all timestamps

---

## 📊 Analytics Use Cases

### 1. Track Posting Activity

```javascript
const XLSX = require('xlsx');
const wb = XLSX.readFile('data/posts.xlsx');
const data = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);

// Count posts per day
const postsByDay = {};
data.forEach(row => {
  if (row.facebook_posted_at) {
    // Format: "06/11/2025, 21:23:15"
    const day = row.facebook_posted_at.split(',')[0]; // "06/11/2025"
    postsByDay[day] = (postsByDay[day] || 0) + 1;
  }
});

console.log('Posts per day:', postsByDay);
```

### 2. Find Last Posted Video

```javascript
const postedVideos = data
  .filter(row => row.facebook_posted_at)
  .sort((a, b) => {
    // Parse Vietnamese format: "06/11/2025, 21:23:15"
    const parseVN = (str) => {
      const [date, time] = str.split(', ');
      const [day, month, year] = date.split('/');
      return new Date(`${year}-${month}-${day}T${time}`);
    };
    return parseVN(b.facebook_posted_at) - parseVN(a.facebook_posted_at);
  });

const lastPosted = postedVideos[0];
console.log('Last posted:', lastPosted.title);
console.log('Time:', lastPosted.facebook_posted_at);
```

### 3. Calculate Posting Frequency

```javascript
// Parse Vietnamese format helper
const parseVN = (str) => {
  const [date, time] = str.split(', ');
  const [day, month, year] = date.split('/');
  return new Date(`${year}-${month}-${day}T${time}`);
};

const timestamps = data
  .filter(row => row.facebook_posted_at)
  .map(row => parseVN(row.facebook_posted_at))
  .sort((a, b) => a - b);

if (timestamps.length >= 2) {
  const intervals = [];
  for (let i = 1; i < timestamps.length; i++) {
    const diff = timestamps[i] - timestamps[i-1];
    intervals.push(diff / (1000 * 60 * 60)); // hours
  }
  
  const avgInterval = intervals.reduce((a, b) => a + b) / intervals.length;
  console.log(`Average posting interval: ${avgInterval.toFixed(1)} hours`);
}
```

---

## 🔍 Query Examples

### Excel Filter

Open Excel → Click column header `facebook_posted_at` → Filter:
- **Not empty**: Show only posted videos
- **Empty**: Show videos not yet posted

### PowerShell Query

```powershell
# View all timestamps
node -e "const XLSX = require('xlsx'); const wb = XLSX.readFile('data/posts.xlsx'); const data = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]); data.forEach(row => { if (row.facebook_posted_at) console.log(`${row.id}: ${row.facebook_posted_at}`); });"
```

---

## ⚠️ Notes

1. **Old Posts**: Videos posted before this feature have empty `facebook_posted_at`
2. **Timezone**: All timestamps in Vietnam time (UTC+7)
3. **Format**: Vietnamese format DD/MM/YYYY, HH:mm:ss - easy to read
4. **Excel**: Stored as text, not Excel date format
5. **API**: Timestamp included in all API responses
6. **24-hour**: Uses 24-hour format (21:30, not 9:30 PM)

---

## 🎯 Benefits

✅ **Track posting history**: Know exactly when each video was posted
✅ **Analytics**: Calculate posting frequency, patterns
✅ **Debugging**: Trace timeline of events
✅ **Compliance**: Audit trail for automated posts
✅ **Scheduling**: Plan future posts based on past activity
✅ **Performance**: Measure time between download and post

---

## 📚 Related Documentation

- [Excel Schema](../README.md#excel-structure)
- [Facebook API Setup](./FACEBOOK_SETUP.md)
- [API Endpoints](./N8N_SETUP.md#api-endpoints)

---

**Updated**: November 6, 2025
