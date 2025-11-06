# 📧 Email Templates for n8n

## 🎨 Available Templates

### 1. **Full Template** (Recommended)
- File: `templates/email-notification.html`
- Features: Full design with gradient header, stats, buttons
- Size: ~4 KB
- Best for: Production use

### 2. **Simple Template**
- File: `templates/email-simple.html`
- Features: Clean design, lightweight
- Size: ~2 KB
- Best for: Quick setup

### 3. **Mini Template** (In clipboard)
- Features: Inline styles, one-liner
- Size: ~1 KB
- Best for: Copy-paste into n8n

---

## 📋 How to Use

### Option 1: Copy from File

```powershell
# Copy full template
Get-Content templates/email-notification.html | Set-Clipboard

# Copy simple template
Get-Content templates/email-simple.html | Set-Clipboard
```

Then paste into n8n HTML field.

### Option 2: Use Mini Version

Already in clipboard! Just:
1. Go to n8n Email node
2. Scroll to "HTML" field
3. Paste (Ctrl+V)

---

## 🎯 Template Variables

All templates support these n8n variables:

| Variable | Description | Example |
|----------|-------------|---------|
| `{{ $json.id }}` | Video ID | `video_001` |
| `{{ $json.title }}` | Video title | `Review sản phẩm` |
| `{{ $json.facebook_posted_at }}` | Post timestamp | `07/11/2025, 09:30:15` |
| `{{ $json.facebook_post_url }}` | Facebook URL | `https://facebook.com/...` |
| `{{ $json.facebook_post_id }}` | FB Post ID | `123456789` |
| `{{ $now.toLocaleString('vi-VN') }}` | Current time | `07/11/2025, 09:30:15` |

---

## 📸 Preview

### Full Template:
```
╔══════════════════════════════════════╗
║   🎉 Video Posted Successfully!     ║  ← Gradient header
╚══════════════════════════════════════╝
┌──────────────────────────────────────┐
│ ✅ Success! Video posted to Facebook │  ← Success box
├──────────────────────────────────────┤
│ 📹 Video Details:                    │
│   Title: Review sản phẩm             │
│   Status: POSTED ✓                   │
│   Posted at: 07/11/2025, 09:30:15    │
│   Link: View on Facebook →           │
├──────────────────────────────────────┤
│     [ 👉 View Post on Facebook ]     │  ← Button
├──────────────────────────────────────┤
│ 📊 Workflow Stats                    │
│ 🤖 Automated by n8n                  │
└──────────────────────────────────────┘
```

---

## 🎨 Customization

### Change Colors:

```html
<!-- Header gradient -->
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

<!-- Change to blue -->
background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);

<!-- Change to green -->
background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
```

### Change Button Color:

```html
<!-- Facebook blue (default) -->
background-color: #1877f2;

<!-- Change to green -->
background-color: #28a745;

<!-- Change to purple -->
background-color: #764ba2;
```

### Add More Fields:

```html
<div class="info-row">
    <span class="label">Your Field:</span>
    <span class="value">{{ $json.your_field }}</span>
</div>
```

---

## 📝 Example Email Content

### Subject:
```
✅ Videos Posted to Facebook
```

or with emoji:
```
🎉 {{ $json.title }} - Posted Successfully!
```

### Text (fallback):
```
{{ $json.stdout }}
```

This shows the console output from the script.

### HTML:
```html
<!-- Paste one of the templates here -->
```

---

## 🧪 Testing

### Test in n8n:

1. Configure Email node:
   - **To Email**: `trieuphunongnam85@gmail.com`
   - **Subject**: `✅ Test Email`
   - **HTML**: Paste template
   
2. Click **"Execute step"**

3. Check your email inbox

### Test Variables:

Add this before the email to see data:
```javascript
// In a "Set" node before email
return [
  {
    json: {
      id: 'video_001',
      title: 'Test Video',
      facebook_posted_at: new Date().toLocaleString('en-GB'),
      facebook_post_url: 'https://facebook.com/test',
      facebook_post_id: '123456789'
    }
  }
];
```

---

## 🐛 Troubleshooting

### HTML not showing?

**Check 1: Email client**
- Gmail: ✓ Supports HTML
- Outlook: ✓ Supports HTML (with limitations)
- Plain text clients: Will show "Text" field instead

**Check 2: Variables**
```javascript
// Test if variables work
{{ $json }}  // Shows all data
```

**Check 3: Inline styles**
- ✓ Use inline styles (not `<style>` tags)
- ✓ Avoid external CSS
- ✓ Use tables for layout (better compatibility)

### Email not sending?

**Check SMTP:**
```powershell
# Test SMTP connection
node scripts/dashboard.js
```

**Check credentials:**
- User: correct email?
- Password: App Password (not regular password)?
- Port: 465 or 587?

---

## 📚 Resources

- **HTML Email Guide**: https://templates.mailchimp.com/
- **Test Email HTML**: https://putsmail.com/
- **Inline CSS Tool**: https://htmlemail.io/inline/

---

## 🎯 Quick Reference

| Template | File | Size | Use Case |
|----------|------|------|----------|
| Full | `email-notification.html` | 4 KB | Production |
| Simple | `email-simple.html` | 2 KB | Quick setup |
| Mini | (in clipboard) | 1 KB | Copy-paste |

---

## 💡 Pro Tips

1. **Use Full template for production**
   - Best looking
   - Most information
   - Professional

2. **Use Simple for testing**
   - Faster to load
   - Easy to modify
   - Good for debugging

3. **Use Mini for quick prototypes**
   - One-liner
   - Easy to paste
   - Minimal setup

4. **Test with real data**
   - Run full workflow
   - Check all variables
   - Verify links work

5. **Mobile-friendly**
   - All templates responsive
   - Work on phones
   - Gmail mobile tested

---

**Created**: November 7, 2025  
**Author**: ToolUploadPostFB
