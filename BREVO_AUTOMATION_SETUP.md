# 🚀 Brevo Email Automation Setup Guide

Complete guide to set up automated emails using Brevo (formerly Sendinblue) for account creation, order confirmations, status updates, and newsletters.

## What's Automated

✅ **Account Confirmation Email** - Sent when user creates an account  
✅ **Order Confirmation Email** - Sent when customer places an order  
✅ **Order Status Updates** - Sent when admin updates order status  
✅ **Newsletter Confirmations** - Sent when user subscribes  
✅ **Promotional Emails** - Send targeted campaigns  
✅ **Abandoned Cart Reminders** - Sent when cart is abandoned  
✅ **Welcome Emails** - First email to new users  

---

## Step 1: Create Brevo Account

1. Visit https://www.brevo.com
2. Click **"Sign Up"** 
3. Create free account (300 emails/day free tier)
4. Verify your email address
5. Complete account setup

---

## Step 2: Get Brevo API Key

1. Login to Brevo Dashboard
2. Go to **Account** → **SMTP & API** (left sidebar)
3. Copy your **API Key** for Email Sending
4. Save it somewhere safe

---

## Step 3: Create Sender Address

1. Go to **Senders** → **Sender List**
2. Click **"Add a New Sender"**
3. Enter your information:
   - Name: `Shopki`
   - Email: `orders@yourdomain.com` (or use personal email)
4. Verify the email by clicking the verification link
5. Copy the sender email

---

## Step 4: Create Newsletter List (Optional)

1. Go to **Contacts** → **Lists**
2. Click **"Create List"**
3. Name: `Shopki Newsletter`
4. Click **"Create"**
5. Note the **List ID** (you'll need this)

---

## Step 5: Configure Environment Variables

### Frontend (.env)

In project root, create or update `.env`:

```env
# Brevo Email Configuration
REACT_APP_BREVO_API_KEY=your_brevo_api_key_here
REACT_APP_BREVO_SENDER_EMAIL=orders@yourdomain.com
REACT_APP_BREVO_NEWSLETTER_LIST_ID=3

# Base URL for email links
REACT_APP_BASE_URL=http://localhost:3000
```

**Important:** Never commit `.env` file! Add to `.gitignore`:

```gitignore
.env
.env.local
```

---

## Step 6: Test Email Sending

### Test 1: Create Account

1. Go to http://localhost:3000/signup
2. Sign up with a test email
3. Check your inbox for welcome email
4. Check browser console for confirmation message

### Test 2: Check Brevo Dashboard

1. Login to Brevo
2. Go to **Transactional** → **Logs**
3. You should see your test email listed
4. Check status: **Success** ✅ or **Failed** ❌

### Test 3: Newsletter Subscription

1. Go to your profile preferences
2. Enable "Newsletter" preference
3. Click "Save Preferences"
4. Check inbox for newsletter confirmation

---

## Features Implemented

### 1. Account Confirmation Email

**When:** User signs up (email or Google login)  
**Template:** Welcome message + account info  
**Location:** `emailAutomation.js` → `sendAccountConfirmationEmail()`

```javascript
// Example - automatically triggered in AuthContext
await sendAccountConfirmationEmail(email, displayName);
```

### 2. Order Confirmation Email

**When:** Customer places an order  
**Template:** Order details, items, total, estimated delivery  
**Location:** `emailAutomation.js` → `sendOrderConfirmation()`

```javascript
// Example usage (from checkout)
const orderData = {
  id: order.id,
  createdAt: order.createdAt,
  items: order.items,
  total: order.total
};
await sendOrderConfirmation(email, orderData);
```

### 3. Order Status Update Email

**When:** Admin updates order status  
**Template:** Status message, tracking number, order details  
**Location:** `emailAutomation.js` → `sendOrderStatusUpdate()`

```javascript
// Example usage (from admin dashboard)
const orderData = {
  id: order.id,
  status: 'shipped', // pending, processing, shipped, completed
  trackingNumber: 'ABC123XYZ'
};
await sendOrderStatusUpdate(email, orderData);
```

### 4. Newsletter Confirmation Email

**When:** User subscribes to newsletter  
**Template:** Welcome to newsletter + benefits  
**Location:** `emailAutomation.js` → `sendNewsletterConfirmation()`

```javascript
// Example usage (from preferences)
await registerForNewsletter(email, displayName);
```

### 5. Promotional Email

**When:** Admin sends campaign  
**Template:** Custom promotion with products  
**Location:** `emailAutomation.js` → `sendPromotionalEmail()`

```javascript
// Example usage
const promoData = {
  title: 'Summer Sale - 50% Off!',
  message: 'Check out our amazing deals...',
  products: [
    { name: 'Product 1', price: 5000, discount: 50 },
    { name: 'Product 2', price: 3000, discount: 30 }
  ],
  expiryDate: '2025-12-31'
};
await sendPromotionalEmail(email, promoData);
```

### 6. Abandoned Cart Email

**When:** Customer abandons cart for 24+ hours (manual trigger)  
**Template:** Cart items, total, urgency message  
**Location:** `emailAutomation.js` → `sendAbandonedCartEmail()`

```javascript
// Example usage (from cart recovery)
await sendAbandonedCartEmail(email, cartItems, cartTotal);
```

---

## Integration Points

### 1. SignUp (AuthContext.jsx)

```javascript
// Automatically sends welcome email on signup
const signup = async (email, password, displayName) => {
  // ... create user ...
  await sendAccountConfirmationEmail(email, displayName);
};
```

### 2. Order Placement (CheckoutPage or firestoreHelpers)

```javascript
// Send confirmation when order is created
const createOrder = async (orderData) => {
  // ... save order to Firestore ...
  await sendOrderConfirmation(customerEmail, orderData);
};
```

### 3. Order Status Update (AdminDashboard)

```javascript
// Send update when admin changes status
const handleOrderStatusUpdate = async (orderId, newStatus) => {
  // ... update Firestore ...
  const orderData = { id: orderId, status: newStatus };
  await sendOrderStatusUpdate(customerEmail, orderData);
};
```

### 4. Preferences Save (PreferencesSettings)

```javascript
// Send confirmation when user opts in to newsletter
const handleSavePreferences = async (preferences) => {
  if (preferences.newsletter) {
    await registerForNewsletter(email, displayName);
  }
};
```

---

## File Structure

```
src/
├── services/
│   └── email/
│       ├── brevoService.js          # Low-level Brevo API functions
│       └── emailAutomation.js        # High-level automation workflows
├── context/
│   └── AuthContext.jsx              # Sends email on signup
└── pages/
    ├── CheckoutPage.jsx             # Sends order confirmation
    └── admin/AdminDashboard.jsx      # Sends order status updates
```

---

## Available Email Functions

### From `emailAutomation.js`

```javascript
// Account emails
sendAccountConfirmationEmail(email, displayName, confirmationLink)

// Newsletter emails
sendNewsletterConfirmation(email, displayName)
registerForNewsletter(email, displayName)

// Order emails
sendOrderConfirmation(email, orderData)
sendOrderStatusUpdate(email, orderData)

// Marketing emails
sendPromotionalEmail(email, promoData)
sendAbandonedCartEmail(email, cartItems, cartTotal)
```

### From `brevoService.js` (Low-level)

```javascript
// Direct API access
sendTransactionalEmail({ email, subject, htmlContent, senderName, senderEmail })
sendPasswordResetEmail(email, resetLink)
sendOrderConfirmationEmail(email, orderData)
sendOrderStatusEmail(email, orderData)
sendWelcomeEmail(email)
subscribeToNewsletter({ email, firstName, lastName })
```

---

## Troubleshooting

### Emails Not Sending?

**1. Check API Key is correct**
```bash
# In browser console
console.log(process.env.REACT_APP_BREVO_API_KEY)
# Should show your key, not undefined
```

**2. Check sender email is verified**
- Go to Brevo Dashboard → Senders
- Verify your sender email address

**3. Check Brevo dashboard for errors**
- Login to https://app.brevo.com
- Go to Transactional → Logs
- Look for failed emails
- Check error message

**4. Check browser console for errors**
- Press F12 to open DevTools
- Look for error messages in Console tab
- Check Network tab for API errors

**5. Verify environment variables**
```javascript
// In App.jsx or any component
console.log('API Key:', process.env.REACT_APP_BREVO_API_KEY);
console.log('Sender Email:', process.env.REACT_APP_BREVO_SENDER_EMAIL);
console.log('Base URL:', process.env.REACT_APP_BASE_URL);
```

### Email Going to Spam?

1. **Verify sender domain** (Brevo Dashboard → Senders → Verify Domain)
2. **Use professional email** (not noreply or generic)
3. **Add unsubscribe links** (already included in templates)
4. **Warm up** sending reputation (start with small volume)
5. **Monitor bounce rates** (Brevo Dashboard → Statistics)

### High Bounce Rates?

1. Check email list quality
2. Remove invalid emails
3. Implement double opt-in for newsletter
4. Monitor complaints in Brevo dashboard

---

## Production Checklist

- [ ] Brevo account created with paid plan (if needed)
- [ ] API key stored in production `.env`
- [ ] Sender domain verified
- [ ] Newsletter list created (if using)
- [ ] Email templates tested
- [ ] Bounce handling implemented
- [ ] Unsubscribe links added
- [ ] Monitor email delivery metrics
- [ ] Set up email authentication (SPF, DKIM)

---

## Next Steps

1. ✅ Create Brevo account
2. ✅ Get API key and sender email
3. ✅ Add to `.env`
4. ✅ Test email sending
5. ✅ Integrate with order system
6. Create email templates in Brevo (optional)
7. Set up automation rules in Brevo (optional)
8. Monitor analytics in Brevo dashboard

---

## Additional Resources

- **Brevo Docs:** https://developers.brevo.com
- **API Reference:** https://developers.brevo.com/docs/getting-started
- **Email Templates:** Customize in `emailAutomation.js`
- **Support:** support@brevo.com

---

## Support

For issues:
1. Check Brevo dashboard → Transactional → Logs
2. Review error messages in browser console (F12)
3. Verify environment variables are set
4. Check sender email is verified in Brevo
5. Contact Brevo support for API issues

---

**Last Updated:** December 24, 2025  
**Status:** ✅ Ready for production use
