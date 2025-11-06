# 🎬 TikTok Video Link Extractor - Hướng dẫn đầy đủ

## 📋 MỤC LỤC

1. [Python Script](#python-script)
2. [Chrome Extension](#chrome-extension)
3. [Import vào Excel](#import-vào-excel)

---

## 🐍 PYTHON SCRIPT

### Setup

1. **Install Python dependencies:**

```powershell
cd D:\project\ToolAuto\tiktok-shopee-automation
pip install -r requirements.txt
```

2. **Chạy script:**

```powershell
python scripts/tiktok-scraper.py
```

### Sử dụng

Script sẽ hỏi:

```
👤 Nhập TikTok username (vd: cartonvn):
```

Nhập username (có hoặc không có @)

```
📊 Số video cần lấy (mặc định 10):
```

Nhập số lượng video cần lấy

**LƯU Ý:** Do TikTok hạn chế scraping, script sẽ yêu cầu bạn nhập link thủ công:

```
📝 NHẬP LINK VIDEO THỦ CÔNG
Hướng dẫn:
1. Mở TikTok profile trong browser
2. Copy link từng video (right click → Copy link)
3. Paste vào đây (mỗi link 1 dòng)
4. Gõ 'done' khi xong

Video 1 (hoặc 'done'): https://www.tiktok.com/@cartonvn/video/7569580062823922583
✅ Đã thêm video 1

Video 2 (hoặc 'done'): https://www.tiktok.com/@cartonvn/video/7569343141856447781
✅ Đã thêm video 2

Video 3 (hoặc 'done'): done
```

Sau đó nhập thông tin chung:

```
📌 Title template (mặc định: 'Video từ TikTok'): Thor phim hay
📄 Description chung: Video về phim Marvel
🏷️  Hashtags (vd: #viral #trending): #thor #marvel #phimhay
🛒 Shopee links (cách nhau bởi dấu phẩy): https://shopee.vn/product1
```

Script sẽ tự động thêm vào Excel:

```
✅ Đã thêm: Thor phim hay #1 (https://www.tiktok.com/@cartonvn/video/7569580...)
✅ Đã thêm: Thor phim hay #2 (https://www.tiktok.com/@cartonvn/video/7569343...)

🎉 Hoàn thành! Đã thêm 2 video vào Excel
📁 File: D:\project\ToolAuto\tiktok-shopee-automation\data\posts.xlsx
```

---

## 🌐 CHROME EXTENSION (KHUYẾN NGHỊ)

### Cài đặt Extension

1. **Mở Chrome → Extensions:**
   - Vào: `chrome://extensions/`
   - Bật **Developer mode** (góc trên phải)

2. **Load extension:**
   - Click **"Load unpacked"**
   - Chọn folder: `D:\project\ToolAuto\tiktok-shopee-automation\browser-extension`

3. **Extension sẵn sàng!** 🎉

### Sử dụng Extension

#### Cách 1: Dùng button trên trang

1. Mở TikTok profile (vd: https://www.tiktok.com/@cartonvn)
2. Scroll xuống để load nhiều video
3. Click button **"📋 Extract Videos"** ở góc phải màn hình
4. Modal sẽ hiện ra với danh sách videos

#### Cách 2: Dùng popup extension

1. Mở TikTok profile
2. Click icon extension trên toolbar
3. Click **"Extract Videos from Current Page"**

### Kết quả

Modal hiện ra với:

```
🎬 Tìm thấy 24 video

[Textarea với danh sách links]
https://www.tiktok.com/@cartonvn/video/7569580062823922583
https://www.tiktok.com/@cartonvn/video/7569343141856447781
...

[Buttons]
📋 Copy All    💾 Download JSON    ❌ Close
```

**Options:**

- **Copy All:** Copy tất cả links vào clipboard
- **Download JSON:** Tải file JSON với format:

```json
{
  "extracted_at": "2025-11-07T00:50:00.000Z",
  "total": 24,
  "videos": [
    {
      "id": 1,
      "url": "https://www.tiktok.com/@cartonvn/video/7569580062823922583",
      "video_id": "7569580062823922583"
    },
    ...
  ]
}
```

---

## 📊 IMPORT VÀO EXCEL

### Cách 1: Dùng Python script (Tự động)

Python script tự động import vào Excel khi bạn nhập xong links.

### Cách 2: Paste thủ công

1. **Copy links** từ extension
2. **Mở Excel:** `data/posts.xlsx`
3. **Paste vào cột B** (video_download_url)
4. **Điền các thông tin khác:**
   - Column C: `title`
   - Column D: `description`
   - Column E: `hashtags`
   - Column F: `shopee_links`
   - Column H: `status` = `NEW`

### Cách 3: Import từ JSON (Advanced)

Nếu bạn download JSON từ extension:

```python
import json
import openpyxl

# Load JSON
with open('tiktok-videos-123456.json', 'r') as f:
    data = json.load(f)

# Load Excel
wb = openpyxl.load_workbook('data/posts.xlsx')
ws = wb.active

# Add videos
for video in data['videos']:
    ws.append([
        video['id'],           # id
        video['url'],          # video_download_url
        f"Video #{video['id']}", # title
        '',                    # description
        '',                    # hashtags
        '',                    # shopee_links
        '',                    # scheduled_time
        'NEW',                 # status
        '', '', '', video['url'], video['video_id'], '', '', '', ''
    ])

wb.save('data/posts.xlsx')
print('✅ Imported!')
```

---

## 🎯 WORKFLOW HOÀN CHỈNH

### 1. Lấy links từ TikTok

**Option A: Chrome Extension (Nhanh)**
```
1. Mở TikTok profile
2. Scroll load videos
3. Click "Extract Videos"
4. Copy hoặc Download JSON
```

**Option B: Python Script**
```powershell
python scripts/tiktok-scraper.py
```

### 2. Import vào Excel

- Python script: Tự động ✅
- Extension: Copy → Paste vào Excel

### 3. Run automation workflow

```powershell
# Option 1: API
curl http://localhost:3000/api/trigger/full-workflow

# Option 2: n8n (auto every 30 min)
# n8n workflow sẽ tự chạy

# Option 3: Manual
npm run download:ytdlp
node scripts/facebook-publisher-simple.js
```

---

## 🔧 TROUBLESHOOTING

### Python: "No module named 'openpyxl'"

```powershell
pip install openpyxl requests
```

### Extension không hoạt động

1. Check Developer mode đã bật chưa
2. Reload extension: `chrome://extensions/` → Click "Reload"
3. Refresh TikTok page

### Không tìm thấy videos

1. Scroll xuống trang TikTok để load thêm video
2. TikTok dùng lazy loading, cần scroll trước khi extract

### Video bị duplicate

Python script và extension đều check duplicate dựa trên URL.

---

## 📚 BEST PRACTICES

### 1. Số lượng videos

- Scroll load **50-100 videos** trước khi extract
- TikTok load khoảng 6-12 videos mỗi lần scroll

### 2. Batch processing

Thêm videos theo batch:
- 10-20 videos/batch dễ quản lý
- Tránh overload Facebook API

### 3. Metadata

Luôn điền đầy đủ:
- ✅ Title (unique cho mỗi video)
- ✅ Description
- ✅ Hashtags (tăng reach)
- ✅ Shopee links (monetization)

### 4. Scheduled posting

Dùng `scheduled_time` để schedule posts:
```
07/11/2025, 18:00:00  → Post vào 6PM
08/11/2025, 09:00:00  → Post ngày mai 9AM
(empty)                → Post ngay lập tức
```

---

## 🚀 QUICK START

**Fastest way (Chrome Extension):**

```bash
# 1. Install extension
chrome://extensions/ → Load unpacked → Select browser-extension folder

# 2. Extract videos
Open TikTok profile → Click "Extract Videos" → Copy

# 3. Import to Excel
Open data/posts.xlsx → Paste links → Fill metadata → Set status=NEW

# 4. Run automation
npm run download:ytdlp
node scripts/facebook-publisher-simple.js
```

**Hoặc dùng n8n (auto):**
```
Import workflow → Activate → Relax 😎
```

---

## 📖 XEM THÊM

- **Python API:** `scripts/tiktok-scraper.py`
- **Chrome Extension:** `browser-extension/`
- **n8n Workflow:** `docs/FIX_N8N_READ_EXCEL.md`
- **Excel Format:** `docs/EXCEL_FORMAT.md`

---

**🎉 Bây giờ việc lấy links video từ TikTok đã dễ dàng hơn rất nhiều!**
