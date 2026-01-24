# Real Email Setup Guide - SendGrid Integration

This guide will help you set up SendGrid for real email sending in Shopki.

## What's New

✅ **Full Email Integration** - Orders now send real emails  
✅ **Beautiful HTML Templates** - Professional order confirmation & status emails  
✅ **Backend API** - Express.js server handles email sending  
✅ **Status Updates** - Admins can update order status and customers get notified  

## Prerequisites

- SendGrid Account (free tier available)
- Node.js and npm installed
- Shopki project running

## Step 1: Create SendGrid Account

1. Visit https://sendgrid.com
2. Click **"Sign Up"**
3. Create a free account (100 emails/day)
4. Verify your email address
5. Verify a sender email (or use noreply@sendgrid.net for testing)

## Step 2: Get SendGrid API Key

1. Login to SendGrid Dashboard
2. Go to **Settings** → **API Keys** (left sidebar)
3. Click **"Create API Key"**
4. Name it: `Shopki Development`
5. Select **Full Access**
6. Click **"Create & View"**
7. **Copy the API Key** (you'll need this)

⚠️ **Important:** Save this key somewhere safe. You won't be able to see it again!

## Step 3: Set Up Frontend (.env)

1. In the project root, create a `.env` file (or copy from `.env.example`):

```bash
cp .env.example .env
```

2. Add your API URL:

```env
REACT_APP_API_URL=http://localhost:3001
```

## Step 4: Set Up Backend

1. **Navigate to backend folder:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create .env file:**
   ```bash
   cp .env.example .env
   ```

4. **Add your SendGrid credentials to `backend/.env`:**
   ```env
   SENDGRID_API_KEY=your_api_key_here
   SENDGRID_FROM_EMAIL=your_verified_email@example.com
   PORT=3001
   NODE_ENV=development
   ```

5. **Start the backend server:**
   ```bash
   npm start
   # Or with auto-reload:
   npm run dev
   ```

   You should see:
   ```
   🚀 Email API server running on port 3001
   📧 SendGrid API Key: ✅ Configured
   📧 From Email: your_verified_email@example.com
   ```

## Step 5: Start Frontend

In a new terminal window (from project root):

```bash
npm start
```

## Step 6: Test Email Sending

### Test Order Confirmation Email

1. Open the app in browser: http://localhost:3000
2. Login or sign up
3. Add products to cart
4. Go to checkout
5. Fill in shipping info
6. Place order
7. **Check your email** for order confirmation!

### Test Order Status Update Email (Admin)

1. Login as admin user
2. Go to Orders page
3. Click status buttons below an order
4. **Check customer's email** for status update!

## Troubleshooting

### Email Not Sending?

1. **Check backend is running**
   ```bash
   curl http://localhost:3001/api/health
   ```
   Should return: `{"status":"ok","message":"Email API server is running"}`

2. **Check SendGrid API Key**
   - Go to SendGrid Dashboard → API Keys
   - Verify key is correct in `backend/.env`
   - Make sure it hasn't been revoked

3. **Check sender email is verified**
   - Go to SendGrid → Settings → Sender Authentication
   - Verify the email in `SENDGRID_FROM_EMAIL` is verified
   - For free tier, use noreply@sendgrid.net

4. **Check browser console for errors**
   - Open DevTools (F12)
   - Look for CORS or API errors
   - Check Network tab for failed requests to `/api/send-email`

5. **Check backend logs**
   - Look for error messages in backend terminal
   - Common errors: API key invalid, sender not verified

### CORS Error?

If you see CORS errors, make sure:
- Backend `.env` has `PORT=3001`
- Frontend `REACT_APP_API_URL=http://localhost:3001`
- Backend server is running
- Check `backend/server.js` has `cors()` enabled

### Email Goes to Spam?

This is normal for new SendGrid accounts. To improve deliverability:

1. **Verify Domain** (DKIM/SPF)
   - SendGrid Dashboard → Settings → Sender Authentication
   - Add your domain
   - Follow DNS setup instructions

2. **Use Professional Email**
   - Don't use generic emails like `noreply@domain.com`
   - Use a real business email: `orders@yourdomain.com`

3. **Add Unsubscribe Links**
   - Update email templates in `emailService.js`
   - Add: `<a href="...">Unsubscribe</a>`

## Production Deployment

### For Vercel/Netlify (Frontend)

Add environment variables:
```
REACT_APP_API_URL=https://your-backend-url.com
```

### For Backend Deployment

**Option 1: Heroku**

```bash
# Install Heroku CLI, then:
heroku login
heroku create your-app-name
git push heroku main
```

Add environment variables:
```bash
heroku config:set SENDGRID_API_KEY=your_key
heroku config:set SENDGRID_FROM_EMAIL=your_email
```

**Option 2: AWS Lambda**
- Use AWS Lambda function with SendGrid
- Or use Firebase Cloud Functions

**Option 3: Railway.app**
```bash
# Simple deployment platform
# Add repo, set env vars, auto deploys
```

Then update frontend:
```env
REACT_APP_API_URL=https://your-backend-deployed-url.com
```

## Email Features

### Order Confirmation
- Sent when user creates an order
- Shows order details, items, total, shipping address
- Includes order tracking link

### Status Update Emails
- **Pending:** Order confirmed, processing
- **Processing:** Being prepared for shipment
- **Shipped:** On the way to customer
- **Completed:** Delivered successfully
- **Cancelled:** Order cancelled
- **Returned:** Return processed, refund initiated

Each email has:
- ✅ Professional HTML template
- ✅ Color-coded status badge
- ✅ Order details
- ✅ Item list with prices
- ✅ Shopki branding
- ✅ Support contact info

## API Endpoint

**POST** `/api/send-email`

Request:
```json
{
  "to": "customer@example.com",
  "subject": "Order Confirmation",
  "html": "<h1>Your Order</h1>...",
  "text": "Optional plain text version"
}
```

Response:
```json
{
  "success": true,
  "message": "Email sent to customer@example.com"
}
```

## Files Structure

```
shopki/
├── backend/
│   ├── server.js              # Email API server
│   ├── package.json           # Backend dependencies
│   └── .env.example           # Environment template
├── src/
│   └── services/
│       └── firebase/
│           ├── emailService.js      # Email functions
│           └── firestoreHelpers.js  # Database + email
├── .env.example               # Frontend env template
└── .env                       # Your actual env (gitignored)
```

## Next Steps

1. ✅ Set up SendGrid account
2. ✅ Configure environment variables
3. ✅ Start backend server
4. ✅ Test email sending
5. Deploy to production
6. Monitor email delivery in SendGrid dashboard

## Support

For issues:
- **SendGrid Docs:** https://sendgrid.com/docs
- **Backend Error Logs:** Check backend terminal
- **Frontend Error Logs:** Check browser console (F12)

---

**Last Updated:** November 30, 2025  
**Status:** ✅ Ready for use
