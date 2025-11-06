# 🎬 TikTok Video Link Extractor - Chrome Extension

## 🚀 Quick Install

1. Open Chrome → `chrome://extensions/`
2. Enable **Developer mode** (top right)
3. Click **"Load unpacked"**
4. Select this folder (`browser-extension`)
5. Done! ✅

## 📖 How to Use

### Method 1: On-page Button
1. Go to any TikTok profile (e.g., https://www.tiktok.com/@cartonvn)
2. Scroll down to load more videos
3. Click the **"📋 Extract Videos"** button (top-right corner)
4. Copy links or download JSON

### Method 2: Extension Popup
1. Go to TikTok profile
2. Click extension icon in toolbar
3. Click **"Extract Videos from Current Page"**

## ✨ Features

- ✅ Extract all video links from current page
- ✅ Copy all links to clipboard
- ✅ Download as JSON file
- ✅ Auto-detect video elements
- ✅ No API key needed
- ✅ 100% free & open source

## 📦 Output Formats

### Plain Text
```
https://www.tiktok.com/@user/video/123456789
https://www.tiktok.com/@user/video/987654321
...
```

### JSON
```json
{
  "extracted_at": "2025-11-07T00:50:00.000Z",
  "total": 24,
  "videos": [
    {
      "id": 1,
      "url": "https://www.tiktok.com/@user/video/123456789",
      "video_id": "123456789"
    }
  ]
}
```

## 🔧 Troubleshooting

**Extension not working?**
- Make sure you're on tiktok.com
- Refresh the page after installing
- Check Developer mode is enabled

**No videos found?**
- Scroll down to load more videos first
- TikTok uses lazy loading

**Button not showing?**
- Refresh the page
- Check extension is enabled at `chrome://extensions/`

## 📝 License

MIT - Free to use and modify

## 🤝 Integration

This extension is part of **ToolUploadPostFB** automation system.

**See:** `docs/TIKTOK_LINK_EXTRACTOR.md` for full documentation.
