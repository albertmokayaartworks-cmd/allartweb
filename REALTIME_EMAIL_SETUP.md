# Real-Time Email Notifications Setup

Your app now has automatic email notifications when order statuses change. Follow this guide to enable it:

## What's Included

✅ **Automatic Emails** - When admin changes order status, customer gets notified  
✅ **Beautiful Templates** - Professional HTML emails  
✅ **Multiple Status Updates** - Pending, Processing, Shipped, Delivered, Cancelled, Returned  
✅ **Jumia-Style Notifications** - Real-time customer updates  

## How It Works

1. **Admin updates order status** in the admin dashboard
2. **System detects the change** in Firestore
3. **Email is sent automatically** via SendGrid
4. **Customer receives notification** in their inbox
5. **Real-time toast notification** appears in the app

## Setup Instructions

### Step 1: Start the Backend Server

The email backend server is required:

```bash
cd backend
npm install
npm start
```

Backend will run on `http://localhost:3001`

### Step 2: Configure SendGrid (Optional but Recommended)

For real email sending (currently emails log to console):

1. Go to https://sendgrid.com and create a free account
2. Create an API Key in SendGrid dashboard
3. Create `backend/.env`:

```env
SENDGRID_API_KEY=your_sendgrid_api_key_here
SENDGRID_FROM_EMAIL=noreply@shopki.com
```

4. Restart backend server

### Step 3: Check Console Logs

When you update an order status:

**Browser Console (F12):**
- Shows real-time notification toast
- Shows bell icon update
- Shows debug logs

**Backend Console:**
- Shows email sending logs
- Shows SendGrid response

**Check Order Emails:**

When creating an order, ensure the order has:
- `userEmail` field (customer email)
- `userName` field (customer name)
- `items` field (array of products)
- `total` field (order amount)

## Testing Real-Time Emails

1. **Create an order** (customer's email is captured)
2. **Go to Admin Dashboard → Orders**
3. **Change order status** (e.g., pending → shipped)
4. **Watch notifications:**
   - Toast appears in app (if logged in)
   - Email logs appear in backend console
   - Customer receives email (if SendGrid configured)

## Email Templates

The system sends different templates based on status:

### 📦 Pending
- "Order Confirmed - Pending Processing"
- Confirmation email

### 🔄 Processing  
- "Order Processing"
- Item is being prepared

### 🚚 Shipped
- "Order Shipped"
- Tracking info (if available)

### ✅ Delivered/Completed
- "Order Delivered"
- Thank you message

### ❌ Cancelled
- "Order Cancelled"
- Support contact info

### ↩️ Returned
- "Order Returned"
- Refund timeline

## Debugging

**Emails not sending?**

1. Check backend console logs
2. Verify order has `userEmail` field
3. Check browser console for errors
4. Ensure REACT_APP_API_URL matches backend URL

**Not seeing toast notifications?**

1. Verify you're logged in
2. Check browser console for errors
3. Verify order belongs to your user (correct `userId`)

**Backend issues?**

```bash
# Check backend is running
curl http://localhost:3001/api/status

# View logs
npm run dev  # in backend folder
```

## Files Modified

- `src/services/firebase/firestoreHelpers.js` - Added detailed logging
- `src/services/firebase/emailService.js` - Email templates & sending
- `backend/server.js` - Email endpoint

## Customization

Edit email templates in `src/services/firebase/emailService.js`:
- Change sender name
- Modify HTML templates
- Add custom styling
- Include tracking links

Enjoy real-time order notifications! 🎉
