# 📊 Setup Read Excel in n8n

## 🎯 Goal
Read Excel file: `D:\project\ToolAuto\tiktok-shopee-automation\data\posts.xlsx`

---

## 🔧 Method 1: Use Spreadsheet File Node (Recommended)

### Step 1: Add "Read Binary Files" node

1. **Click "+"** → Search: **"Read Binary Files"**
2. **Configure:**
   ```
   File Selector: D:\project\ToolAuto\tiktok-shopee-automation\data\posts.xlsx
   Property Name: data
   ```

### Step 2: Add "Spreadsheet File" node

1. **Click "+"** → Search: **"Spreadsheet File"**
2. **Connect** from "Read Binary Files"
3. **Configure:**
   ```
   Operation: Read from file
   File Format: Autodetect
   Binary Property: data
   Options: (leave default)
   ```

### Step 3: Test

1. Click **"Execute Node"**
2. Should see Excel data in JSON format
3. Check output: Array of objects with columns

---

## 🔧 Method 2: Use Execute Command (Simpler) ⭐

### Add "Execute Command" node

```javascript
Command: node
Arguments: 
  -e
  const XLSX = require('xlsx'); const wb = XLSX.readFile('D:\\project\\ToolAuto\\tiktok-shopee-automation\\data\\posts.xlsx'); const data = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]); console.log(JSON.stringify(data));

Working Directory: /data
```

**Output:** JSON array of Excel rows

---

## 📋 Config trong n8n Workflow

### Workflow đã có sẵn:

File: `n8n-workflows/tiktok-excel-scheduled.json`

```json
{
  "parameters": {
    "operation": "read",
    "filePath": "D:\\project\\ToolAuto\\tiktok-shopee-automation\\data\\posts.xlsx",
    "options": {}
  },
  "name": "Read Excel",
  "type": "n8n-nodes-base.spreadsheetFile"
}
```

### Import workflow:

1. **Open n8n:** http://localhost:5678
2. **Import:** n8n-workflows/tiktok-excel-scheduled.json
3. **Node "Read Excel" đã config sẵn!** ✓

---

## 🎯 Workflow Flow:

```
Schedule (30 min)
    ↓
Read Excel ← D:\project\ToolAuto\tiktok-shopee-automation\data\posts.xlsx
    ↓
Filter (status=NEW)
    ↓
Execute Download
    ↓
Wait 60s
    ↓
Execute Post Facebook
    ↓
Send Email Notification
```

---

## ✅ Test Excel Reading

### Manual Test:

```powershell
# Test read Excel
node scripts/test-read-excel-n8n.js
```

**Output:**
```
✅ File found: D:\project\ToolAuto\tiktok-shopee-automation\data\posts.xlsx
📋 Sheet: Posts
📝 Total rows: 2
🆕 Videos with status=NEW: 0
```

### Add test video:

1. **Open Excel:** `data/posts.xlsx`
2. **Add row:**
   ```
   id: video_003
   video_download_url: https://vt.tiktok.com/...
   title: Test Video
   status: NEW
   ```
3. **Save & close Excel**
4. **Test again:** `node scripts/test-read-excel-n8n.js`

---

## 🐛 Troubleshooting

### Error: "File not found"

**Check path:**
```powershell
Test-Path "D:\project\ToolAuto\tiktok-shopee-automation\data\posts.xlsx"
```

**Fix in n8n:**
- Use **double backslashes:** `D:\\project\\ToolAuto\\...`
- Or use **forward slashes:** `D:/project/ToolAuto/...`

### Error: "Permission denied"

**Close Excel file** - Excel locks file when open

### Error: "Cannot read property"

**Check Excel format:**
- Must be `.xlsx` format
- Must have header row
- Column names match exactly

---

## 📝 Expected Excel Columns

| Column | Type | Required |
|--------|------|----------|
| id | String | ✓ |
| video_download_url | String | ✓ |
| title | String | ✓ |
| status | String | ✓ (NEW/READY/POSTED) |
| scheduled_time | String | Optional |
| description | String | Optional |
| hashtags | String | Optional |
| shopee_links | String | Optional |

---

## 🔄 Filter Logic in n8n

### Filter node config:

```javascript
Conditions:
  Field: {{ $json.status }}
  Operation: equals
  Value: NEW
```

**Only videos with status=NEW will pass through!**

---

## 🎯 Complete Workflow Setup

### 1. Import workflow:
```
n8n-workflows/tiktok-excel-scheduled.json
```

### 2. Nodes already configured:
- ✅ Schedule Every 30 min
- ✅ Read Excel (path set)
- ✅ Filter NEW Status
- ✅ Execute Download
- ✅ Execute Post Facebook

### 3. Activate workflow:
Toggle "Active" switch

### 4. Add videos to Excel:
Add rows with status=NEW

### 5. Wait or trigger manually:
Workflow runs automatically!

---

## 📊 Monitor Execution

### View in n8n:

1. **Executions tab**
2. Click on execution
3. See data flow through nodes

### Check node output:

```json
[
  {
    "id": "video_003",
    "video_download_url": "https://vt.tiktok.com/...",
    "title": "Test Video",
    "status": "NEW",
    "scheduled_time": ""
  }
]
```

---

## 🚀 Quick Start Commands

```powershell
# Test Excel reading
node scripts/test-read-excel-n8n.js

# View current Excel data
node -e "const XLSX = require('xlsx'); const wb = XLSX.readFile('data/posts.xlsx'); console.log(XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]));"

# Add test video
node scripts/create-excel-template.js

# Check n8n workflow
curl http://localhost:5678/rest/workflows
```

---

## 📚 References

- **n8n Spreadsheet File:** https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.spreadsheetfile/
- **Excel structure:** README.md#excel-structure
- **Workflow guide:** N8N_QUICKSTART.md

---

**✅ Excel path trong workflow đã đúng rồi! Chỉ cần import và activate!** 🎉
