# 📧 Gmail SMTP Setup for n8n

## 🎯 Quick Config

```
User:     trieuphunongnam97@gmail.com
Password: [Get from Step 2 below]
Host:     smtp.gmail.com
Port:     465
SSL/TLS:  ON ✓
```

---

## 🔐 Get Gmail App Password (Required)

### Step 1: Enable 2-Factor Authentication

1. **Open Gmail Security:**
   👉 https://myaccount.google.com/security

2. **Find "2-Step Verification":**
   - Scroll down to "How you sign in to Google"
   - Click "2-Step Verification"

3. **Enable 2FA:**
   - Click "Get Started"
   - Follow the setup wizard
   - Use your phone number for verification

### Step 2: Create App Password

1. **Go to App Passwords:**
   👉 https://myaccount.google.com/apppasswords
   
   (Or: Security → 2-Step Verification → App passwords at bottom)

2. **Generate Password:**
   - Select app: **"Mail"**
   - Select device: **"Windows Computer"**
   - Click **"Generate"**

3. **Copy the Password:**
   ```
   Example: abcd efgh ijkl mnop
   (16 characters, spaces optional)
   ```

4. **Important:**
   - ⚠️ Save this password! You can't see it again
   - ⚠️ Don't use your regular Gmail password
   - ⚠️ Each app password is unique

---

## 📝 Fill in n8n Form

### Connection Tab:

| Field | Value |
|-------|-------|
| **User** | `trieuphunongnam97@gmail.com` |
| **Password** | `[16-digit app password]` |
| **Host** | `smtp.gmail.com` |
| **Port** | `465` |
| **SSL/TLS** | `ON` ✓ |
| **Client Host Name** | (leave empty) |

### Screenshot Reference:
```
┌─────────────────────────────────┐
│ User                            │
│ trieuphunongnam97@gmail.com     │
├─────────────────────────────────┤
│ Password                        │
│ ••••••••••••••••                │  ← Paste app password here
├─────────────────────────────────┤
│ Host                            │
│ smtp.gmail.com                  │
├─────────────────────────────────┤
│ Port                            │
│ 465                             │
├─────────────────────────────────┤
│ SSL/TLS                         │
│ ●━━━━━━━ ON                     │  ← Toggle ON
└─────────────────────────────────┘
```

---

## ✅ Test Connection

1. Click **"Test"** button in n8n
2. Should see: **"Connection test successful"**
3. If failed, check:
   - ✓ 2FA enabled?
   - ✓ App password correct?
   - ✓ Port 465?
   - ✓ SSL/TLS ON?

---

## 🐛 Troubleshooting

### Error: "Username and Password not accepted"
**Solution:** 
- Make sure 2FA is enabled
- Use **App Password**, not regular Gmail password
- Regenerate App Password if needed

### Error: "Connection timeout"
**Solution:**
- Try Port **587** instead of 465
- Keep SSL/TLS ON

### Error: "Authentication failed"
**Solution:**
- Double-check email: `trieuphunongnam97@gmail.com`
- Re-copy App Password (no spaces)
- Generate new App Password

### Gmail blocks login?
**Solution:**
1. Check: https://myaccount.google.com/notifications
2. Allow the login attempt
3. Or regenerate App Password

---

## 🎯 Alternative Ports

| Port | SSL/TLS | Use Case |
|------|---------|----------|
| **465** | ON | Recommended (SMTPS) |
| **587** | ON | Alternative (StartTLS) |

**Recommended:** Port **465** with SSL/TLS **ON**

---

## 📧 Send Test Email

After setup, test with n8n Email node:

```javascript
{
  "to": "trieuphunongnam97@gmail.com",
  "subject": "n8n Test Email",
  "text": "If you receive this, SMTP setup is successful! 🎉"
}
```

---

## 🔒 Security Notes

1. **App Passwords are safer:**
   - No 2FA prompt each time
   - Can be revoked without changing main password
   - Limited to one app/device

2. **Keep it secure:**
   - Don't commit App Password to Git
   - Store in n8n credentials (encrypted)
   - Revoke if compromised

3. **Revoke App Password:**
   - Go to: https://myaccount.google.com/apppasswords
   - Click "Remove" next to the password
   - Generate new one if needed

---

## 📚 References

- **Gmail SMTP Settings:** https://support.google.com/mail/answer/7126229
- **App Passwords:** https://support.google.com/accounts/answer/185833
- **2FA Setup:** https://support.google.com/accounts/answer/185839

---

## ✨ Quick Links

- Enable 2FA: https://myaccount.google.com/security
- Get App Password: https://myaccount.google.com/apppasswords
- Check Security: https://myaccount.google.com/notifications

---

**Ready? Fill in the form and click Test! 🚀**
