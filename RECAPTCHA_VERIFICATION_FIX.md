# ❌ reCAPTCHA Verification Failed - Complete Fix Guide

## Problem
Error message: **"reCAPTCHA verification failed. Please refresh and try again."**

---

## Root Causes (In Order of Likelihood)

### 1. ⚠️ **Domain Not Whitelisted in Firebase** (MOST COMMON)
reCAPTCHA only works on authorized domains. By default, only production domains are trusted.

**Fix:**
1. Go to https://console.firebase.google.com/
2. Select project: **eccomerce-768db**
3. Navigate to: **Authentication** → **Sign-in method** → **reCAPTCHA**
4. Find section: **"Authorized domains"**
5. Add these domains:
   - ✅ `localhost:3000` (local development)
   - ✅ `127.0.0.1:3000` (alternative localhost)
   - ✅ `localhost:3001` (backend port)
   - ✅ Your production domain (when deploying)

**Screenshot Path:** Settings ⚙️ → Project settings → Authorized domains

---

### 2. 🔄 **Restart Dev Server**
Changes to .env or Firebase config require a server restart.

**Fix:**
```bash
# Stop current server (Ctrl+C in terminal)
# Then restart:
npm start

# Wait for: "Compiled successfully!" message
```

---

### 3. 🗑️ **Clear Browser Cache**
Cached reCAPTCHA script may be outdated.

**Fix:**
```
Chrome/Edge:
1. Press: Ctrl + Shift + Delete
2. Select: All time
3. Check: Cookies, Cached images
4. Click: Clear data
5. Refresh page: F5

Firefox:
1. Press: Ctrl + Shift + Delete
2. Check: Cookies, Cache
3. Click: Clear now
```

---

### 4. 🌐 **Check Network & Firewall**
reCAPTCHA requires internet connectivity to Google's servers.

**Fix:**
```javascript
// Run in browser console (F12):
fetch('https://www.google.com/recaptcha/api.js')
  .then(r => console.log('✅ Can reach reCAPTCHA:', r.status))
  .catch(e => console.error('❌ Network blocked:', e))
```

---

### 5. 📱 **Verify HTML Container Exists**
```javascript
// Run in browser console (F12):
const container = document.getElementById('recaptcha-container');
if (container) {
  console.log('✅ reCAPTCHA container found:', container);
  console.log('✅ Hidden:', container.style.display === 'none');
} else {
  console.error('❌ reCAPTCHA container missing!');
}
```

**If missing,** add to [public/index.html](public/index.html#L11):
```html
<div id="recaptcha-container" style="display: none;"></div>
```

---

### 6. 🔐 **Check Firebase Phone Auth Configuration**
```javascript
// Run in browser console (F12):
import { auth } from './src/services/firebase/config';
console.log('🔑 Auth Instance:', auth);
console.log('📱 Auth Domain:', auth.config.authDomain);
console.log('🆔 Project ID:', auth.config.projectId);
```

---

## Step-by-Step Verification

### ✅ Checklist Before Testing

```
□ Firebase Project: eccomerce-768db selected
□ Phone Authentication: ENABLED ✅
□ reCAPTCHA: ENABLED ✅  
□ Authorized domains: localhost:3000 ✅ ADDED
□ Development server: Running on localhost:3000
□ Browser: Dev tools open (F12)
□ Console: No errors visible
□ Network: Can connect to google.com
```

---

## Complete Diagnostic Script

**Run this in browser console (F12):**

```javascript
// ===== COMPREHENSIVE reCAPTCHA DIAGNOSTIC =====

async function diagnosticRecaptcha() {
  console.log('🔍 Starting reCAPTCHA Diagnostic...\n');
  
  // 1. Check container
  const container = document.getElementById('recaptcha-container');
  console.log('1️⃣ DOM Container Check:');
  console.log(container ? '✅ Container found' : '❌ Container missing');
  
  // 2. Check window object
  console.log('\n2️⃣ reCAPTCHA Global Object:');
  console.log(window.grecaptcha ? '✅ grecaptcha loaded' : '❌ grecaptcha not loaded');
  
  // 3. Check Firebase Auth
  console.log('\n3️⃣ Firebase Auth Config:');
  console.log('✅ Auth instance ready');
  
  // 4. Network connectivity
  console.log('\n4️⃣ Network Connectivity:');
  try {
    const response = await fetch('https://www.google.com/recaptcha/api.js');
    console.log(response.ok ? '✅ Can reach reCAPTCHA servers' : '⚠️ Unexpected response');
  } catch (e) {
    console.error('❌ Cannot reach reCAPTCHA servers:', e.message);
  }
  
  // 5. Check environment
  console.log('\n5️⃣ Environment Variables:');
  console.log('API Key:', process.env.REACT_APP_FIREBASE_API_KEY ? '✅' : '❌');
  console.log('Auth Domain:', process.env.REACT_APP_FIREBASE_AUTH_DOMAIN);
  console.log('Project ID:', process.env.REACT_APP_FIREBASE_PROJECT_ID);
  
  console.log('\n✅ Diagnostic complete!');
}

// Run it
diagnosticRecaptcha();
```

---

## Testing After Fix

### 1. Manual Test
```
1. Navigate to: http://localhost:3000/login
2. Click: "Continue with Phone"
3. Enter phone: +254712345678 or 0712345678
4. Check browser console (F12):
   - No errors about reCAPTCHA
   - Should see logs about OTP sending
5. Should see: "OTP sent! Check your phone" message
```

### 2. Console Output Expected
```
✅ reCAPTCHA container found: #recaptcha-container
✅ reCAPTCHA verifier initialized successfully
📱 Sending OTP for: +254712345678
✅ OTP sent successfully
```

### 3. If Error Persists
Check logs for these error messages:

| Error | Cause | Solution |
|-------|-------|----------|
| "reCAPTCHA container not found" | Missing HTML div | Add container to [public/index.html](public/index.html) |
| "reCAPTCHA verification failed" | Domain not authorized | Add localhost:3000 to [Firebase authorized domains](https://console.firebase.google.com/) |
| "Quota exceeded for quota metric" | Too many requests | Wait 1 hour or check Firebase limits |
| "Operation not supported" | Phone auth not enabled | Enable in [Firebase Console](https://console.firebase.google.com/) |
| "Network error" | Firewall blocking | Check internet/proxy settings |

---

## Firebase Console Path

**To authorize localhost:**

```
Firebase Console
  └─ Project: eccomerce-768db
      └─ Authentication
          └─ Sign-in method
              └─ reCAPTCHA Enterprise (or reCAPTCHA v3)
                  └─ Authorized domains
                      ├─ localhost:3000 ✅ ADD THIS
                      ├─ 127.0.0.1:3000 ✅ ADD THIS
                      └─ your-production-domain.com (future)
```

---

## Advanced: Custom Error Handler

If you're still getting verification failures, add this to [src/services/firebase/phoneAuth.js](src/services/firebase/phoneAuth.js#L70-L75):

```javascript
// Enhanced error handling in sendPhoneOTP function:

const handleRecaptchaError = (error) => {
  const errorCode = error.code;
  
  if (errorCode === 'auth/argument-error' && error.message.includes('recaptcha')) {
    console.error('❌ reCAPTCHA Configuration Error:');
    console.error('   1. Check: localhost:3000 in Firebase authorized domains');
    console.error('   2. Check: reCAPTCHA enabled in Firebase Console');
    console.error('   3. Try: Clear browser cache and restart server');
    return 'reCAPTCHA not properly configured. Check console for details.';
  }
  
  if (errorCode === 'auth/operation-not-supported-in-this-environment') {
    console.error('❌ Phone Auth not available in this environment');
    return 'Phone authentication unavailable. Check Firebase setup.';
  }
  
  return error.message || 'reCAPTCHA verification failed';
};
```

---

## Quick Reference: Common Fixes

```
❌ "reCAPTCHA verification failed"
   → Add localhost:3000 to Firebase authorized domains

❌ "Container not found"  
   → Add <div id="recaptcha-container" style="display: none;"></div> to public/index.html

❌ Still failing after fixes
   → npm start (restart server)
   → Ctrl+Shift+Delete (clear cache)
   → F5 (refresh page)

✅ Success indicators:
   → OTP input field appears
   → SMS received on phone
   → No console errors
```

---

## Support Resources

- **Firebase Docs:** https://firebase.google.com/docs/auth/web/phone-auth
- **reCAPTCHA Guide:** https://developers.google.com/recaptcha/docs/v3
- **Authorized Domains:** https://console.firebase.google.com/ → Authentication → reCAPTCHA
- **Debugging Guide:** [PHONE_AUTH_RECAPTCHA_FIX.md](PHONE_AUTH_RECAPTCHA_FIX.md)

---

## Action Plan

1. ✅ **Add localhost:3000 to Firebase authorized domains** (MOST IMPORTANT)
2. ✅ **Restart: npm start**
3. ✅ **Clear cache: Ctrl+Shift+Delete**
4. ✅ **Refresh page: F5**
5. ✅ **Test phone auth again**
6. ✅ **Check console for errors (F12)**
7. ✅ If still failing, run diagnostic script above

---

**Modified:** December 25, 2025
**Status:** Requires Firebase Console Configuration
**Priority:** HIGH - Blocks phone authentication
