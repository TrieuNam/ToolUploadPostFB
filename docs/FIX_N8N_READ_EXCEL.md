# 🔧 FIX: n8n "Operation read is not supported"

## ❌ VẤN ĐỀ
```
The operation "read" is not supported!
```

**Nguyên nhân:** Node `spreadsheetFile` của n8n KHÔNG hỗ trợ operation "read" trực tiếp.

---

## ✅ GIẢI PHÁP

### Thay vì dùng "Spreadsheet File" node, dùng workflow mới:

**Workflow v2:** `n8n-workflows/tiktok-excel-scheduled-v2.json`

### Cấu trúc mới:

```
Schedule Trigger (30 min)
    ↓
Execute Command: Read Excel Script
    ↓
Code Node: Parse JSON
    ↓
IF Node: Filter NEW Status
    ↓
Download Videos
    ↓
Wait 60s
    ↓
Post to Facebook
    ↓
Email Notification
```

---

## 🚀 HƯỚNG DẪN SETUP

### Bước 1: Test script đọc Excel

```powershell
node scripts\read-excel-for-n8n.js
```

**Expected output:**
```json
{
  "success": true,
  "total": 2,
  "newCount": 0,
  "videos": [],
  "timestamp": "07/11/2025, 00:40:10"
}
```

### Bước 2: Import workflow mới vào n8n

1. Open n8n: http://localhost:5678
2. Click **Workflows** → **Import from File**
3. Select: `n8n-workflows/tiktok-excel-scheduled-v2.json`
4. Workflow sẽ tự động setup với 8 nodes

### Bước 3: Kiểm tra nodes

**Node "Read Excel" (Execute Command):**
```
Command: node D:\project\ToolAuto\tiktok-shopee-automation\scripts\read-excel-for-n8n.js
```

**Node "Parse Excel Data" (Code):**
```javascript
// Parse JSON output from Excel reader
const output = items[0].json.stdout;
const data = JSON.parse(output);

// Return each video as separate item
return data.videos.map(video => ({
  json: video
}));
```

**Node "Email Notification":**
- To: `trieuphunongnam97@gmail.com`
- Subject: `✅ Videos Posted to Facebook - {{ $now.toLocaleString('vi-VN') }}`
- Format: **HTML** (template có sẵn trong workflow)

### Bước 4: Configure SMTP credentials

1. Click node **"Email Notification"**
2. Click **"Credentials"**
3. **Create New Credential:**
   - Name: `Gmail SMTP`
   - User: `trieuphunongnam97@gmail.com`
   - Password: *[App Password từ Google]*
   - Host: `smtp.gmail.com`
   - Port: `465`
   - SSL/TLS: **ON**

📚 **Hướng dẫn lấy App Password:** `docs/GMAIL_SMTP_SETUP.md`

### Bước 5: Test workflow

1. Click **"Execute Workflow"** (top right)
2. Xem output của từng node
3. Kiểm tra:
   - ✅ "Read Excel" có output JSON
   - ✅ "Parse Excel Data" convert được videos
   - ✅ "Filter NEW Status" chỉ giữ status=NEW

### Bước 6: Activate workflow

1. Toggle **"Active"** (top right)
2. Workflow sẽ chạy mỗi 30 phút
3. Check **"Executions"** tab để xem lịch sử

---

## 📊 SO SÁNH 2 WORKFLOWS

| Feature | v1 (OLD) | v2 (NEW) |
|---------|----------|----------|
| Read Excel | ❌ Spreadsheet File (không work) | ✅ Execute Command + Script |
| Parse Data | ❌ Trực tiếp | ✅ Code node parse JSON |
| Output | ❌ Không có data | ✅ Clean JSON format |
| Status | ❌ Lỗi "operation not supported" | ✅ Hoạt động tốt |

---

## 🧪 TEST COMMANDS

### Test Excel reader script:
```powershell
node scripts\read-excel-for-n8n.js
```

### Test với videos mới (thêm video có status=NEW):
```powershell
# Mở Excel, đổi 1 video từ POSTED → NEW
node scripts\read-excel-for-n8n.js
# Sẽ thấy newCount: 1
```

### Test full workflow trong n8n:
1. Thêm video có status=NEW vào Excel
2. Click "Execute Workflow" trong n8n
3. Xem từng node có data không

---

## 📁 FILES LIÊN QUAN

| File | Mô tả |
|------|-------|
| `scripts/read-excel-for-n8n.js` | Script đọc Excel, output JSON |
| `n8n-workflows/tiktok-excel-scheduled-v2.json` | Workflow mới (WORKING) |
| `n8n-workflows/tiktok-excel-scheduled.json` | Workflow cũ (BỊ LỖI) |
| `docs/GMAIL_SMTP_SETUP.md` | Setup SMTP credentials |
| `templates/email-notification.html` | HTML email template |

---

## 🎯 NEXT STEPS

1. ✅ **Import workflow v2 vào n8n**
2. ⏳ Configure SMTP credentials
3. ⏳ Test với video mới (status=NEW)
4. ⏳ Activate workflow
5. ⏳ Monitor executions tab

---

## 💡 TẠI SAO PHẢI LÀM VẬY?

n8n's **Spreadsheet File** node có những hạn chế:
- ❌ Không support "read" operation trực tiếp
- ❌ Cần binary data input (file upload)
- ❌ Không phù hợp với local file paths

**Giải pháp tốt hơn:**
- ✅ Dùng **Execute Command** chạy Node.js script
- ✅ Script đọc Excel bằng XLSX library
- ✅ Output JSON sạch sẽ cho n8n parse
- ✅ Dễ debug và maintain

---

## 📞 TROUBLESHOOTING

### Lỗi: "Cannot find module 'xlsx'"
```powershell
npm install
```

### Lỗi: "File not found"
Kiểm tra path trong script:
```javascript
const excelPath = path.join(__dirname, '..', 'data', 'posts.xlsx');
```

### Lỗi: "JSON parse error" trong Code node
Xem output của "Read Excel" node, đảm bảo là valid JSON.

### Email không gửi được
1. Check SMTP credentials
2. Verify App Password (không phải regular password)
3. Enable 2FA trên Gmail account

---

**🎉 Workflow v2 đã sẵn sàng! Import và test ngay!**
