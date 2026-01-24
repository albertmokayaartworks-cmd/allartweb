# Firebase Phone Authentication Setup Guide

## Overview
Phone authentication is now fully integrated into your Aruviah e-commerce platform. This guide will help you enable and configure it.

## What's Included

### 1. **Phone Auth Service** (`src/services/firebase/phoneAuth.js`)
- `initRecaptchaVerifier()` - Initialize reCAPTCHA verification
- `sendPhoneOTP()` - Send OTP to phone number
- `verifyPhoneOTP()` - Verify the 6-digit code
- `completePhoneSignup()` - Create user profile in Firestore
- `formatPhoneNumber()` - Format phone numbers with country code
- Automatic error handling with user-friendly messages

### 2. **Phone Auth Context** (`src/context/AuthContext.jsx`)
Added two new methods:
- `sendPhoneVerificationOTP(phoneNumber)` - Send OTP
- `verifyPhoneCode(confirmationResult, otp, displayName)` - Verify OTP and complete signup

### 3. **Phone Auth UI Component** (`src/components/auth/PhoneAuthForm.jsx`)
A complete 3-step phone authentication form:
- **Step 1**: Enter phone number (+254712345678 or 0712345678)
- **Step 2**: Enter 6-digit OTP code with auto-focus between inputs
- **Step 3**: Enter display name to complete profile
- Features: Resend OTP, progress indicator, error handling

### 4. **AuthModal Integration** (`src/components/auth/AuthModal.jsx`)
Added phone authentication option alongside Email and Google:
- "Continue with Phone" button on both Login and Signup views
- Seamless navigation between auth methods
- Phone tab in the modal

## Enable Phone Authentication in Firebase Console

### Step 1: Go to Firebase Console
1. Open [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **eccomerce-768db**

### Step 2: Enable Phone Authentication
1. In the left sidebar, go to **Authentication**
2. Click on the **Sign-in method** tab
3. Click **Phone** (or "Add new provider" if not visible)
4. Toggle **Enable** to turn on phone authentication
5. Click **Save**

### Step 3: Configure reCAPTCHA (Important)
Phone authentication requires reCAPTCHA v3 verification. This is usually auto-configured, but verify:

1. Still in Sign-in methods, check if **reCAPTCHA** shows as "Enabled"
2. If not enabled, follow the setup prompts
3. Your domain (localhost:3000) should be whitelisted automatically for development

### Step 4: Add reCAPTCHA Container to Your App

The phone auth form needs a container for reCAPTCHA. Make sure your public/index.html has:

```html
<div id="recaptcha-container" style="display: none;"></div>
```

This is typically already in your index.html. If not, add it inside the body tag.

### Step 5: Test Phone Authentication

1. Start your app: `npm start`
2. Go to Login page
3. Click "Continue with Phone"
4. Enter a test phone number:
   - For development: Use Firebase test phone numbers (if available)
   - For production: Use real phone numbers
5. You'll receive an OTP via SMS
6. Enter the OTP and complete signup

## Supported Countries

Currently configured for **Kenya** (+254):
- Format: +254712345678 or 0712345678
- Automatically converts formats

To add more countries, edit `src/services/firebase/phoneAuth.js` and modify the `formatPhoneNumber()` function.

## How It Works

### Phone Number Sign Up Flow:
```
User enters phone → Send OTP → User receives SMS → 
Enter OTP → Verify code → Enter name → Create account → 
Auto-login → Redirect home
```

### Key Features:
✅ Automatic phone number formatting
✅ 6-digit OTP input with auto-focus
✅ OTP resend with 60-second cooldown
✅ Progress indicator
✅ Real-time error handling
✅ User profile creation in Firestore
✅ Automatic reCAPTCHA handling
✅ Welcome email sent after signup
✅ Phone number stored in user profile
✅ Phone verified flag set to true

## Firestore User Document

After phone signup, users get this structure:
```javascript
{
  uid: "user-id",
  displayName: "User's Name",
  phoneNumber: "+254712345678",
  phoneVerified: true,
  email: null, // Optional, added later
  createdAt: Timestamp,
  isAdmin: false,
  role: "customer",
  signupMethod: "phone",
  verified: false,
  preferences: {
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: true, // Enabled for phone users
    newsletter: true,
    ...
  }
}
```

## API Endpoints Used

### Firebase Authentication:
- `signInWithPhoneNumber()` - Send OTP
- `RecaptchaVerifier` - reCAPTCHA verification
- `confirmationResult.confirm()` - Verify OTP

### Firestore:
- `users/{uid}` - Store user profile

### Brevo (Optional):
- Welcome email sent via your existing email service

## Troubleshooting

### Issue: "reCAPTCHA verification failed"
**Solution:** 
1. Check Firebase console > Sign-in methods > Phone is enabled
2. Make sure reCAPTCHA is also enabled
3. Clear browser cache and restart app
4. Ensure `recaptcha-container` div exists in index.html

### Issue: "Invalid phone number format"
**Solution:**
1. Use format: +254712345678 or 0712345678
2. Kenya country code: +254
3. Must have 9-10 digits after country code

### Issue: "OTP not received"
**Solution:**
1. Verify phone number format is correct
2. Check SMS quota in Firebase Console
3. In development, use test numbers if available
4. Some regions may have SMS delivery delays

### Issue: "Quota exceeded"
**Solution:**
1. Firebase has rate limits on OTP sending
2. Wait a few minutes before trying again
3. Implement backend verification for production

## Production Deployment

Before deploying to production:

1. **Add your domain to Firebase:**
   - Firebase Console > Authentication > Settings
   - Under "Authorized domains", add your domain

2. **Configure SMS template** (Optional):
   - Firebase Console > Authentication > Templates
   - Customize the SMS message template

3. **Set up backend verification** (Optional but recommended):
   - Move phone auth to backend for security
   - Validate OTP server-side

4. **Enable advanced security** (Optional):
   - Firebase Console > Security Rules
   - Restrict phone signup to specific regions

5. **Monitor usage:**
   - Firebase Console > Authentication > Usage
   - Track SMS costs

## Customization

### Change Resend Timer:
In `PhoneAuthForm.jsx`, line ~310:
```javascript
setResendTimer(60); // Change 60 to desired seconds
```

### Change Country Code:
In `phoneAuth.js`, line ~123:
```javascript
export const formatPhoneNumber = (phoneNumber, countryCode = '+254') => {
```

### Customize OTP Length:
In `PhoneAuthForm.jsx`, line ~65:
```javascript
const [otp, setOtp] = useState(['', '', '', '', '', '']); // Change array length
```

### Add More Countries:
In `src/components/auth/PhoneAuthForm.jsx`, line ~60:
```javascript
<p className="text-xs text-gray-500 mt-2">
  Works with Kenya (+254), other countries coming soon
</p>
```

Update to:
```javascript
<p className="text-xs text-gray-500 mt-2">
  Works with Kenya (+254), USA (+1), UK (+44), etc.
</p>
```

## Security Considerations

1. **reCAPTCHA**: Prevents automated OTP requests
2. **Rate Limiting**: Firebase limits OTP sends per phone/IP
3. **Temporary Session**: OTP is only valid for limited time
4. **SMS Delivery**: OTP never stored in frontend
5. **HTTPS Required**: Phone auth only works over HTTPS in production

## Cost

Firebase charges for phone authentication:
- SMS sending: ~$0.01 per SMS (varies by region)
- No charge for signup/authentication
- First 10,000 SMS free per month in Firebase Blaze plan

## Next Steps

1. Enable phone auth in Firebase Console ✅
2. Test on development: `npm start`
3. Try phone authentication flow
4. Monitor usage in Firebase Console
5. Deploy to production when ready

## Support Resources

- [Firebase Phone Auth Docs](https://firebase.google.com/docs/auth/web/phone-auth)
- [reCAPTCHA Documentation](https://www.google.com/recaptcha/about/)
- [Firebase Console](https://console.firebase.google.com/)

---

**Last Updated:** December 2025
**Status:** Ready for Development ✅
