# 🌐 Cài TikTok Video Extractor trên Microsoft Edge

## ✅ HƯỚNG DẪN CÀI ĐẶT

### Bước 1: Bật Developer Mode

1. Mở Edge
2. Vào: `edge://extensions/`
3. Bật **Developer mode** (toggle ở góc trái dưới)

### Bước 2: Load Extension

1. Click **"Load unpacked"** (góc trên)
2. Chọn folder: `D:\project\ToolAuto\tiktok-shopee-automation\browser-extension`
3. Click **"Select Folder"**
4. Extension sẵn sàng! ✅

---

## 🎯 SỬ DỤNG

### Cách 1: Button trên trang (Dễ nhất!)

1. Mở TikTok profile: https://www.tiktok.com/@cartonvn
2. Scroll xuống để load nhiều video
3. Thấy button **"📋 Extract Videos"** ở góc phải màn hình
4. Click vào → Modal hiện ra với danh sách videos
5. Click **"Copy All"** hoặc **"Download JSON"**

### Cách 2: Click icon extension

1. Mở TikTok profile
2. Click icon extension trên toolbar Edge
3. Click **"Extract Videos from Current Page"**

---

## 📸 SCREENSHOT

```
Edge Browser
├── Address bar: tiktok.com/@cartonvn
├── [Góc phải màn hình]
│   └── 📋 Extract Videos (button tím)
│
└── Click button → Modal hiện ra:
    ┌────────────────────────────────┐
    │  🎬 Tìm thấy 24 video         │
    │                                │
    │  [Textarea với links]          │
    │  https://tiktok.com/...        │
    │  https://tiktok.com/...        │
    │                                │
    │  [📋 Copy All]                 │
    │  [💾 Download JSON]            │
    │  [❌ Close]                    │
    └────────────────────────────────┘
```

---

## 🔧 TROUBLESHOOTING

### Extension không hiện button?

1. **Refresh trang TikTok:** F5
2. **Check extension đã enable:** 
   - Vào `edge://extensions/`
   - Đảm bảo toggle ON
3. **Reload extension:**
   - Click "Reload" trong `edge://extensions/`

### Không tìm thấy video?

- **Scroll xuống trước!** TikTok dùng lazy loading
- Load khoảng 50-100 videos trước khi extract

### Button bị che?

- Extension đặt button ở `top: 100px, right: 20px`
- Có thể scroll lên trên để thấy rõ hơn

---

## 💡 SO SÁNH CHROME VS EDGE

| Feature | Chrome | Edge |
|---------|--------|------|
| Extension hoạt động | ✅ | ✅ |
| Cài đặt | `chrome://extensions/` | `edge://extensions/` |
| Developer mode | Góc phải trên | Góc trái dưới |
| Performance | Tốt | Tốt |
| Tích hợp Windows | 🔶 | ✅ Better |

**KẾT LUẬN:** Edge và Chrome đều work 100%, chọn browser nào cũng OK! 🎉

---

## 🚀 QUICK START (Edge)

```powershell
# 1. Mở Edge Extensions
edge://extensions/

# 2. Bật Developer mode (góc trái dưới)

# 3. Load unpacked
→ Chọn: D:\project\ToolAuto\tiktok-shopee-automation\browser-extension

# 4. Test
→ Vào: https://www.tiktok.com/@cartonvn
→ Click button "📋 Extract Videos"
→ Copy links!
```

---

## 📦 OUTPUT

### Plain Text (Copy All)
```
https://www.tiktok.com/@cartonvn/video/7569580062823922583
https://www.tiktok.com/@cartonvn/video/7569343141856447781
https://www.tiktok.com/@cartonvn/video/7569265799479774469
...
```

### JSON (Download)
```json
{
  "extracted_at": "2025-11-07T01:10:00.000Z",
  "total": 24,
  "videos": [
    {
      "id": 1,
      "url": "https://www.tiktok.com/@cartonvn/video/7569580062823922583",
      "video_id": "7569580062823922583"
    }
  ]
}
```

---

## 🎯 WORKFLOW HOÀN CHỈNH

```
1. Mở Edge → TikTok profile @cartonvn
   ↓
2. Scroll load 50-100 videos
   ↓
3. Click "📋 Extract Videos"
   ↓
4. Copy All (Ctrl+A, Ctrl+C)
   ↓
5. Mở Excel: data/posts.xlsx
   ↓
6. Paste vào column B (video_download_url)
   ↓
7. Fill các columns: title, description, hashtags, status=NEW
   ↓
8. Save Excel
   ↓
9. Chạy automation:
   - Option A: n8n workflow (auto 30 phút)
   - Option B: npm run download:ytdlp + facebook-publisher
   ↓
10. Done! Videos posted to Facebook 🎉
```

---

## 🆚 EXTENSION vs PYTHON SCRIPT

| | Chrome/Edge Extension | Python Script |
|---|---|---|
| **Tốc độ** | ⚡ Nhanh (1 click) | 🐌 Chậm (nhập từng link) |
| **Dễ dùng** | ✅ Rất dễ | 🔶 Cần biết Python |
| **Số lượng** | 📊 Unlimited | 📝 Manual input |
| **Output** | 📋 Copy + JSON | 💾 Trực tiếp Excel |
| **Setup** | 🚀 2 phút | 📦 Cài dependencies |

**KHUYẾN NGHỊ:** Dùng Extension cho nhanh! 🎯

---

## 📞 HỖ TRỢ

**Lỗi extension không load:**
```powershell
# Check Edge version
edge://settings/help

# Edge phải >= 88 (2021+)
```

**Lỗi "Cannot load extension":**
- Check folder path đúng chưa
- Folder phải có file `manifest.json`

**Button không xuất hiện:**
```javascript
// Mở Console (F12) → Check logs
// Should see: "✅ TikTok Video Extractor loaded!"
```

---

## 📚 XEM THÊM

- **Full documentation:** `docs/TIKTOK_LINK_EXTRACTOR.md`
- **Python alternative:** `scripts/tiktok-scraper.py`
- **Extension code:** `browser-extension/tiktok-extractor.js`

---

**🎉 Extension hoạt động 100% trên Edge! Cài đặt và test ngay!**
