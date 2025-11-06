# 🚀 N8N Workflow - Hướng dẫn chạy hoàn chỉnh

## ✅ TRẠNG THÁI HIỆN TẠI

```
✅ n8n container: RUNNING (port 5678)
✅ Excel file: EXISTS (data/posts.xlsx)
❌ Videos NEW: 0 (cần thêm videos mới)
```

---

## 📋 BƯỚC 1: CHUẨN BỊ DATA

### Option A: Import videos mới từ TikTok

```powershell
# 1. Dùng Edge extension extract videos
# 2. Download JSON
# 3. Import vào Excel
python scripts\import-json-to-excel.py data\tiktok-videos-*.json
```

### Option B: Reset status videos cũ (để test)

```powershell
# Tạo script reset status
python -c "from openpyxl import load_workbook; wb = load_workbook('data/posts.xlsx'); ws = wb.active; [ws.cell(i, 7).value := 'NEW' for i in range(2, min(6, ws.max_row+1))]; wb.save('data/posts.xlsx'); print('✅ Reset 5 videos to NEW')"
```

Hoặc **mở Excel thủ công** và đổi cột "status" của vài videos thành "NEW".

---

## 🌐 BƯỚC 2: MỞ N8N

1. **Mở browser:**
   ```
   http://localhost:5678
   ```

2. **Login (nếu cần):**
   - Username: `admin`
   - Password: `admin`

---

## 📥 BƯỚC 3: IMPORT WORKFLOW

### 3.1. Tìm workflow file

```
File: n8n-workflows/tiktok-excel-scheduled-v2.json
```

### 3.2. Import vào n8n

1. Click **"Workflows"** (menu trái)
2. Click **"Add workflow"** (button góc phải)
3. Click **menu 3 chấm** → **"Import from file"**
4. Chọn file: `n8n-workflows/tiktok-excel-scheduled-v2.json`
5. Click **"Import"**

### 3.3. Kiểm tra workflow

Workflow sẽ có **8 nodes**:

```
1. Schedule Trigger (*/30 * * * *)
   ↓
2. Read Excel (Execute Command)
   ↓
3. Parse Excel Data (Code)
   ↓
4. Filter NEW Status (IF)
   ↓
5. Download Videos (Execute Command)
   ↓
6. Wait for Download (60s)
   ↓
7. Post to Facebook (Execute Command)
   ↓
8. Email Notification (Send Email)
```

---

## 🔧 BƯỚC 4: CONFIGURE SMTP CREDENTIALS

### 4.1. Lấy Gmail App Password

1. **Enable 2FA:**
   - Vào: https://myaccount.google.com/security
   - Enable 2-Step Verification

2. **Generate App Password:**
   - Vào: https://myaccount.google.com/apppasswords
   - App: "Mail"
   - Device: "Other" → nhập "n8n"
   - Copy password (16 ký tự)

### 4.2. Configure trong n8n

1. **Click node "Email Notification"**
2. **Click "Credentials"**
3. **Create New Credential:**
   - **Name:** `Gmail SMTP`
   - **User:** `trieuphunongnam97@gmail.com`
   - **Password:** `[App Password vừa lấy]`
   - **Host:** `smtp.gmail.com`
   - **Port:** `465`
   - **SSL/TLS:** `ON` ✅
   - **From Email:** `trieuphunongnam97@gmail.com`

4. **Click "Save"**

---

## 🧪 BƯỚC 5: TEST WORKFLOW

### 5.1. Kiểm tra từng node

1. **Node "Read Excel":**
   - Click vào node
   - Click **"Execute node"**
   - Xem output có JSON data không

2. **Node "Parse Excel Data":**
   - Click vào node
   - Click **"Execute node"**
   - Xem có videos array không

3. **Node "Filter NEW Status":**
   - Click vào node
   - Click **"Execute node"**
   - Xem có filter đúng status=NEW không

### 5.2. Test full workflow

1. **Click button "Execute Workflow"** (góc trên phải)
2. **Xem execution log:**
   - ✅ Green: Success
   - ❌ Red: Error (click để xem chi tiết)

3. **Check kết quả:**
   - Videos đã download vào `videos/public/`
   - Videos đã post lên Facebook
   - Email notification đã gửi
   - Excel status đã update thành `POSTED`

---

## ⚡ BƯỚC 6: ACTIVATE WORKFLOW

### 6.1. Activate

1. **Toggle "Active"** switch (góc trên phải)
2. Workflow sẽ tự chạy **mỗi 30 phút**

### 6.2. Monitor

1. **Tab "Executions"** (menu trái)
2. Xem lịch sử chạy:
   - Execution time
   - Status (success/error)
   - Output của từng node

---

## 📊 WORKFLOW SCHEDULE

```
Cron: */30 * * * *
Nghĩa là: Chạy mỗi 30 phút

Ví dụ:
- 00:00
- 00:30
- 01:00
- 01:30
- ...
```

**Muốn thay đổi?**
- Click node "Schedule Trigger"
- Đổi cron expression

---

## 🎯 EXPECTED BEHAVIOR

### Khi workflow chạy:

1. **00:00** - Schedule trigger
2. **00:00:01** - Read Excel → Find 3 videos NEW
3. **00:00:02** - Filter videos
4. **00:00:03** - Download videos (yt-dlp)
5. **00:02:00** - Videos downloaded (2 phút)
6. **00:02:01** - Wait 60s
7. **00:03:01** - Post to Facebook
8. **00:05:00** - Post complete (2 phút)
9. **00:05:01** - Send email notification ✅
10. **00:05:02** - Update Excel status → POSTED

### Next run: **00:30** (30 phút sau)

---

## 📧 EMAIL NOTIFICATION

### Khi post thành công, bạn sẽ nhận email:

**Subject:** `✅ Videos Posted to Facebook - [timestamp]`

**Content:**
- ✅ Success message
- 📊 Execution details
- 🕐 Timestamp
- 📁 Excel file info

---

## ⚠️ TROUBLESHOOTING

### Error: "Cannot find Excel file"

**Fix:**
```javascript
// Node "Read Excel" - Command:
node D:\project\ToolAuto\tiktok-shopee-automation\scripts\read-excel-for-n8n.js
```

### Error: "No videos with status=NEW"

**Fix:**
```powershell
# Thêm videos mới hoặc reset status
python scripts\import-json-to-excel.py [JSON_FILE]
```

### Error: "SMTP authentication failed"

**Fix:**
- Check App Password (không phải regular password)
- Enable 2FA trên Gmail
- Regenerate App Password

### Error: "Facebook API error"

**Fix:**
```powershell
# Check Facebook token
node -e "console.log(process.env.FACEBOOK_PAGE_ACCESS_TOKEN)"

# Test API
node scripts/facebook-publisher-simple.js
```

### Workflow không chạy tự động

**Check:**
1. Toggle "Active" có ON không?
2. n8n container có đang chạy không?
3. Schedule trigger config đúng không?

---

## 🔍 MONITORING

### View logs

```powershell
# n8n container logs
docker logs n8n -f

# Script logs
Get-Content logs\automation.log -Wait
```

### Check Excel

```powershell
python scripts\check-excel.py
```

### Check videos

```powershell
dir videos\public\*.mp4 | measure
```

---

## 📝 MANUAL TESTING (không dùng n8n)

Nếu muốn test thủ công:

```powershell
# 1. Download videos
npm run download:ytdlp

# 2. Post to Facebook
node scripts/facebook-publisher-simple.js

# 3. Check results
python scripts/check-excel.py
```

---

## 🎉 SUCCESS INDICATORS

✅ **Workflow đã chạy thành công khi:**

1. ✅ n8n execution log = green
2. ✅ Videos downloaded vào `videos/public/`
3. ✅ Videos posted lên Facebook
4. ✅ Excel status = POSTED
5. ✅ Excel có facebook_post_url
6. ✅ Excel có facebook_posted_at timestamp
7. ✅ Email notification nhận được

---

## 📚 DOCUMENTS

- **n8n Setup:** `docs/FIX_N8N_READ_EXCEL.md`
- **SMTP Setup:** `docs/GMAIL_SMTP_SETUP.md`
- **Excel Structure:** `docs/TIMESTAMPS.md`
- **TikTok Extractor:** `docs/TIKTOK_LINK_EXTRACTOR.md`

---

## 🚀 QUICK START CHECKLIST

```
□ 1. n8n container running (docker ps)
□ 2. Excel có videos NEW (check-excel.py)
□ 3. Open n8n (localhost:5678)
□ 4. Import workflow v2
□ 5. Configure SMTP credentials
□ 6. Test workflow (Execute Workflow)
□ 7. Activate workflow (Toggle Active)
□ 8. Monitor executions
□ 9. Check email notifications
□ 10. Verify Facebook posts
```

---

**🎉 Bây giờ workflow sẽ tự động chạy mỗi 30 phút!**

**Bạn chỉ cần:**
- Thêm videos mới vào Excel (status=NEW)
- n8n sẽ tự động download và post lên Facebook
- Nhận email notification khi xong

**Automation hoàn chỉnh! 🚀**
