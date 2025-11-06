# 📘 Hướng Dẫn Đăng Video lên Facebook

## 🔑 Bước 1: Lấy Facebook Credentials

### 1.1. Tạo Facebook App
1. Truy cập: https://developers.facebook.com/apps
2. Click **"Create App"**
3. Chọn **"Business"** type
4. Điền tên app và email
5. Click **"Create App"**

### 1.2. Thêm Video API
1. Trong Dashboard app, tìm **"Video API"**
2. Click **"Add to App"**
3. Hoặc vào **"Add Product"** → Chọn **"Video API"**

### 1.3. Lấy Page Access Token
1. Vào **Graph API Explorer**: https://developers.facebook.com/tools/explorer
2. Chọn app của bạn trong dropdown
3. Click **"Generate Access Token"**
4. Chọn Page của bạn
5. Grant permissions:
   - `pages_show_list`
   - `pages_read_engagement`
   - `pages_manage_posts`
   - `pages_manage_metadata`
6. Copy **Page Access Token**

### 1.4. Lấy Page ID
Cách 1: Từ Facebook Page Settings
1. Vào Facebook Page của bạn
2. Settings → About
3. Copy **Page ID**

Cách 2: Từ Graph API Explorer
1. Gõ: `me/accounts` trong Graph API Explorer
2. Click Submit
3. Tìm page của bạn và copy `id`

### 1.5. Extend Token (Optional - để token không expire)
```bash
curl -i -X GET "https://graph.facebook.com/v21.0/oauth/access_token?grant_type=fb_exchange_token&client_id={app-id}&client_secret={app-secret}&fb_exchange_token={short-lived-token}"
```

## ⚙️ Bước 2: Cấu hình .env

Mở file `.env` và điền:

```env
# === Facebook API Configuration ===
FACEBOOK_PAGE_ID=123456789012345
FACEBOOK_PAGE_ACCESS_TOKEN=EAABsbCS1iHgBO...your_token_here...
```

## 🚀 Bước 3: Chạy Script

### 3.1. Đảm bảo đã download video
```bash
npm run download:ytdlp
```

### 3.2. Post lên Facebook
```bash
npm run post:facebook
```

## 📊 Excel Structure

File Excel cần có các columns sau:

| Column | Description | Required | Example |
|--------|-------------|----------|---------|
| `id` | Video ID | ✅ | video_001 |
| `video_download_url` | TikTok URL | ✅ | https://vt.tiktok.com/... |
| `title` | Video title | ✅ | Review sản phẩm hot |
| `description` | Video description | ❌ | Video review chi tiết... |
| `hashtags` | Hashtags | ❌ | #review #shopee |
| `shopee_links` | Shopee affiliate links | ❌ | https://shope.ee/abc |
| `status` | Processing status | ✅ | NEW/READY/POSTED |
| `local_video_path` | Downloaded file path | Auto | d:\...\video.mp4 |
| `facebook_post_id` | FB Post ID | Auto | 123456789012345 |
| `facebook_post_url` | FB Post URL | Auto | https://facebook.com/... |

## 🔄 Status Flow

```
NEW → DOWNLOADING → READY → POSTING → POSTED
                           ↓
                         ERROR
```

- **NEW**: Video chưa download
- **DOWNLOADING**: Đang download
- **READY**: Đã download, sẵn sàng post
- **POSTING**: Đang đăng lên Facebook
- **POSTED**: Đã đăng thành công
- **ERROR**: Có lỗi xảy ra

## 🎬 Full Workflow

```bash
# 1. Tạo Excel template (nếu chưa có)
node scripts/create-excel-template.js

# 2. Thêm TikTok URLs vào Excel
# Edit file: data/posts.xlsx

# 3. Download videos từ TikTok (không watermark)
npm run download:ytdlp

# 4. Start video server (optional - để test videos)
npm start

# 5. Post videos lên Facebook
npm run post:facebook
```

## ⚠️ Lưu ý

### Rate Limits
- Facebook có giới hạn số lượng posts/videos per hour
- Script tự động delay 60s sau mỗi 5 videos

### Video Requirements
- Format: MP4
- Max size: 10GB (recommended < 4GB)
- Resolution: Min 720p recommended
- Duration: 3s - 240 min

### Permissions
- Cần quyền **CREATE_CONTENT** trên Page
- Access token phải có các permissions:
  - `pages_manage_posts`
  - `pages_read_engagement`
  - `pages_show_list`

### Error Handling
- Nếu upload fail, status sẽ chuyển sang **ERROR**
- Check `error_message` column trong Excel
- Có thể retry bằng cách set status về **READY**

## 🔍 Troubleshooting

### Error: "Invalid OAuth access token"
→ Token đã expire hoặc không đúng. Lấy token mới từ Graph API Explorer.

### Error: "Permissions error"
→ Token thiếu permissions. Phải grant đầy đủ 3 permissions ở trên.

### Error: "(#100) The parameter video_file_chunk is required"
→ File không tồn tại hoặc đường dẫn sai. Check `local_video_path` trong Excel.

### Error: "Video upload failed"
→ Video có thể bị corrupt. Download lại bằng `npm run download:ytdlp`.

### Video không chạy trên Facebook
→ Kiểm tra codec và format. Facebook chỉ support MP4 với H.264 codec.

## 📚 Resources

- Facebook Video API: https://developers.facebook.com/docs/video-api
- Graph API Explorer: https://developers.facebook.com/tools/explorer
- Access Token Tool: https://developers.facebook.com/tools/accesstoken
- Facebook Page Settings: https://www.facebook.com/settings?tab=pages

## 💡 Tips

1. **Test với 1 video trước**: Set status = READY cho 1 video, chạy script test
2. **Backup Excel**: Copy file Excel trước khi chạy script
3. **Monitor logs**: Xem console output để track progress
4. **Use long-lived token**: Extend token để không phải lấy lại thường xuyên
5. **Schedule posts**: Có thể tích hợp với cron job để auto-post theo giờ
