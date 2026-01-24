# Email Integration Setup Guide

This guide will help you set up email notifications for order confirmations and status updates in Shopki.

## Current Implementation

The email service is currently configured to **log emails to the console** for development purposes. The infrastructure is in place to easily switch to a real email provider.

### Files Involved

- `src/services/firebase/emailService.js` - Email template and service functions
- `src/services/firebase/firestoreHelpers.js` - Updated to send emails on status change
- `src/pages/CheckoutPage.jsx` - Sends confirmation email on order creation
- `src/pages/OrdersPage.jsx` - Sends status update email when admin changes order status

## Features

✅ **Order Confirmation Emails** - Sent when user creates an order
✅ **Status Update Emails** - Sent to customer when admin changes order status
✅ **Email Templates** - Pre-formatted emails for different statuses:
  - Pending (order confirmed)
  - Processing (being prepared)
  - Shipped (on the way)
  - Completed (delivered)
  - Cancelled (order cancelled)
  - Returned (return processed)

## How It Works

### 1. When Order is Created
```javascript
// CheckoutPage.jsx
await sendOrderConfirmationEmail(
  user.email,
  user.displayName || 'Valued Customer',
  orderId,
  cartItems,
  total,
  shippingInfo
);
```

### 2. When Admin Updates Order Status
```javascript
// OrdersPage.jsx (handleStatusUpdate)
await updateOrderStatus(orderId, newStatus);
// This automatically sends email via firestoreHelpers.js
```

## Setting Up Real Email Service

### Option 1: Firebase Extensions (Recommended for Beginners)

Firebase Email Extension handles all email sending.

**Steps:**
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Navigate to **Extensions** (left sidebar)
4. Click **"Get extensions"** → Search for **"Email"**
5. Install **"Trigger Email from Firestore"** extension
6. Configure with your email provider (SendGrid, Mailgun, etc.)
7. Follow the setup wizard

### Option 2: SendGrid (Easy, Free Tier Available)

**Steps:**

1. **Create SendGrid Account**
   - Go to https://sendgrid.com
   - Sign up for free (100 emails/day)
   - Verify your sender email

2. **Get API Key**
   - Go to **Settings** → **API Keys**
   - Create a new API key
   - Copy the key

3. **Install SendGrid Package**
   ```bash
   npm install @sendgrid/mail
   ```

4. **Update emailService.js**
   ```javascript
   import sgMail from '@sendgrid/mail';

   sgMail.setApiKey(process.env.REACT_APP_SENDGRID_API_KEY);

   export const sendOrderStatusEmail = async (userEmail, userName, orderId, newStatus, items, total) => {
     try {
       const msg = {
         to: userEmail,
         from: process.env.REACT_APP_SENDGRID_FROM_EMAIL || 'support@shopki.com',
         subject: `Order Status Update - ${newStatus.toUpperCase()}`,
         html: `<h2>Order ${orderId} Status Update</h2>...` // HTML template
       };
       
       await sgMail.send(msg);
       return { success: true };
     } catch (error) {
       console.error('Email error:', error);
       return { success: false, error: error.message };
     }
   };
   ```

5. **Add to .env**
   ```
   REACT_APP_SENDGRID_API_KEY=your_api_key_here
   REACT_APP_SENDGRID_FROM_EMAIL=support@shopki.com
   ```

### Option 3: Gmail (SMTP)

**Note:** Gmail has restrictions for 3rd party apps. Use App Passwords instead.

**Steps:**

1. **Enable 2-Factor Authentication on Gmail**
   - Go to myaccount.google.com/security
   - Enable 2-Step Verification

2. **Create App Password**
   - Go to Security settings
   - Create an "App password" for "Mail" and "Windows"
   - Copy the generated password

3. **Install Nodemailer**
   ```bash
   npm install nodemailer
   ```

4. **Update emailService.js**
   ```javascript
   import nodemailer from 'nodemailer';

   const transporter = nodemailer.createTransport({
     service: 'gmail',
     auth: {
       user: process.env.REACT_APP_GMAIL_EMAIL,
       pass: process.env.REACT_APP_GMAIL_PASSWORD
     }
   });

   export const sendOrderStatusEmail = async (userEmail, userName, orderId, newStatus, items, total) => {
     try {
       await transporter.sendMail({
         from: process.env.REACT_APP_GMAIL_EMAIL,
         to: userEmail,
         subject: `Order Status Update - ${newStatus.toUpperCase()}`,
         html: `<h2>Order ${orderId}</h2>...` // HTML template
       });
       return { success: true };
     } catch (error) {
       console.error('Email error:', error);
       return { success: false, error: error.message };
     }
   };
   ```

5. **Add to .env**
   ```
   REACT_APP_GMAIL_EMAIL=your-email@gmail.com
   REACT_APP_GMAIL_PASSWORD=your_app_password
   ```

### Option 4: Mailgun (Reliable, Free Tier)

**Steps:**

1. **Create Mailgun Account**
   - Go to https://www.mailgun.com
   - Sign up (free tier: 100 emails/day)

2. **Get Credentials**
   - Domain: Look for your Mailgun domain (e.g., `mg.yourdomain.com`)
   - API Key: Found in account settings

3. **Install Mailgun SDK**
   ```bash
   npm install mailgun.js
   ```

4. **Update emailService.js**
   ```javascript
   import mailgun from 'mailgun.js';
   import FormData from 'form-data';

   const mg = mailgun.client({
     username: 'api',
     key: process.env.REACT_APP_MAILGUN_API_KEY
   });

   export const sendOrderStatusEmail = async (userEmail, userName, orderId, newStatus, items, total) => {
     try {
       await mg.messages.create(process.env.REACT_APP_MAILGUN_DOMAIN, {
         from: `Shopki <support@${process.env.REACT_APP_MAILGUN_DOMAIN}>`,
         to: userEmail,
         subject: `Order Status Update - ${newStatus.toUpperCase()}`,
         html: `<h2>Order ${orderId}</h2>...` // HTML template
       });
       return { success: true };
     } catch (error) {
       console.error('Email error:', error);
       return { success: false, error: error.message };
     }
   };
   ```

5. **Add to .env**
   ```
   REACT_APP_MAILGUN_API_KEY=your_api_key
   REACT_APP_MAILGUN_DOMAIN=mg.yourdomain.com
   ```

## Testing Email Service

### In Development

1. Check the browser console when:
   - Creating an order (should log confirmation email)
   - Admin changes order status (should log status update email)

2. Look for logs like:
   ```
   📧 Email would be sent to: customer@example.com
   📧 Subject: Order Status Update
   📧 Content: [email content]
   ```

### In Production

1. Ensure `.env` variables are set in your hosting environment
2. Monitor email delivery in your provider's dashboard
3. Set up webhook handlers for bounce/complaint management

## Email Templates Customization

Edit the email templates in `emailService.js`:

```javascript
const statusMessages = {
  pending: {
    subject: 'Order Confirmed - Pending Processing',
    message: 'Your order has been confirmed and is pending processing.'
  },
  processing: {
    subject: 'Order Processing',
    message: 'Your order is now being processed and will be shipped soon.'
  },
  // ... more statuses
};
```

## Troubleshooting

### Emails not sending?

1. **Check if email service is configured**
   - Look at `emailService.js` - is it using a real provider?
   - Check `.env` file for provider credentials

2. **Check browser console logs**
   - Look for error messages in Developer Tools (F12)

3. **Verify Firestore data**
   - Check that orders have `userEmail` field
   - View in Firebase Console → Firestore → orders collection

4. **Test with simple email**
   - Start with just one recipient
   - Verify email address is correct

5. **Check rate limits**
   - Some providers have sending limits
   - Upgrade to paid plan if needed

## Database Requirements

Ensure your Firestore orders collection has these fields:

```javascript
{
  userId: "firebase_user_id",
  userEmail: "customer@example.com",      // ✅ Required for email
  userName: "John Doe",                    // ✅ Required for email
  items: [],
  total: 100,
  status: "pending",
  shippingAddress: {},
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

## Best Practices

1. **Always include user email in order data**
   ```javascript
   const orderData = {
     userId: user.uid,
     userEmail: user.email,  // ✅ Important
     userName: user.displayName,  // ✅ Important
     // ... other fields
   };
   ```

2. **Use transactional emails**
   - SendGrid, Mailgun support transactional emails
   - Better deliverability than marketing emails

3. **Implement unsubscribe links**
   - Required by law (CAN-SPAM, GDPR)
   - Add to email templates

4. **Monitor bounce rates**
   - Check invalid emails
   - Remove bounced emails from future sends

5. **Log all email sends**
   - Save to Firestore for audit trail
   ```javascript
   await addDoc(collection(db, 'emailLogs'), {
     recipient: userEmail,
     orderId: orderId,
     status: 'sent',
     timestamp: serverTimestamp()
   });
   ```

## Next Steps

1. Choose your email provider (SendGrid recommended for beginners)
2. Update `src/services/firebase/emailService.js`
3. Add environment variables to `.env`
4. Test by creating an order
5. Monitor email delivery in provider dashboard
6. Set up production environment variables

## Support Email

For customer support inquiries, update `support@shopki.com` to your actual support email.

---

**Last Updated:** November 30, 2025
**Status:** ✅ Infrastructure ready, awaiting provider configuration
