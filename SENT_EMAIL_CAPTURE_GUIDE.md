# Sent Email Capture Guide

## Overview
All emails sent through your application are automatically captured and stored in the Admin Email Inbox. This allows admins to:
- View all outgoing communications in one place
- Track sent emails by type (order, vendor, notifications, etc.)
- Monitor email delivery status
- Archive or delete sent emails for compliance

## How It Works

### 1. **Automatic Capture on Send**
When any email is sent via `sendTransactionalEmail()`, it automatically:
- Sends through Brevo SMTP service
- Saves a copy to Firebase `admin_emails` collection with `isSent: true`
- Appears in Admin Email Inbox "Sent" section within seconds

### 2. **Email Routing**
```
Application Email Trigger
        ↓
sendTransactionalEmail()
        ├─→ Brevo API (actual send)
        └─→ Firebase (admin inbox save)
        
Result: Email appears in both recipient's inbox AND admin inbox "Sent"
```

## Usage Examples

### Example 1: Order Confirmation Email

```javascript
import { sendTransactionalEmail } from '../services/email/brevoService';

async function sendOrderConfirmation(order, customer) {
  const result = await sendTransactionalEmail({
    email: customer.email,
    subject: `Order Confirmation #${order.id}`,
    htmlContent: orderConfirmationHTML,
    senderName: 'Aruviah Orders',
    senderEmail: process.env.REACT_APP_BREVO_SENDER_EMAIL,
    
    // AUTO-SAVE TO ADMIN INBOX (default: true)
    saveToAdminInbox: true,
    emailType: 'order',
    relatedData: {
      orderId: order.id,
      customerName: customer.firstName + ' ' + customer.lastName,
      customerEmail: customer.email,
      orderTotal: order.total,
      itemCount: order.items.length
    }
  });
  
  if (result.success) {
    console.log('✅ Email sent and saved to admin inbox');
    console.log('📧 Admin email ID:', result.adminEmailId);
  }
  
  return result;
}
```

### Example 2: Vendor Application Notification

```javascript
import { sendTransactionalEmail } from '../services/email/brevoService';
import { saveEmailToAdminInbox } from '../services/email/adminEmailService';

async function notifyNewVendorApplication(application) {
  // Send to vendor
  const vendorResult = await sendTransactionalEmail({
    email: application.email,
    subject: 'Your Vendor Application - Status Update',
    htmlContent: vendorConfirmationHTML,
    saveToAdminInbox: true,
    emailType: 'vendor_application',
    relatedData: {
      vendorId: application.id,
      vendorName: application.businessName,
      vendorEmail: application.email,
      status: 'under_review'
    }
  });
  
  // Also save admin notification (received email)
  await saveEmailToAdminInbox({
    to: process.env.REACT_APP_ADMIN_EMAIL,
    from: 'noreply@aruviah.com',
    subject: `[NEW] Vendor Application: ${application.businessName}`,
    htmlContent: adminNotificationHTML,
    type: 'vendor_application',
    relatedData: {
      vendorId: application.id,
      vendorName: application.businessName,
      applicationDate: new Date().toISOString()
    },
    isSent: false // This is received, not sent
  });
  
  return vendorResult;
}
```

### Example 3: Disable Auto-Save (Manual Save)

```javascript
// If you DON'T want automatic save to admin inbox:
const result = await sendTransactionalEmail({
  email: customer.email,
  subject: 'Test Email',
  htmlContent: testHTML,
  saveToAdminInbox: false, // Disable auto-save
  emailType: 'test'
});

// Then manually save with custom data if needed:
if (result.success) {
  await saveEmailToAdminInbox({
    to: customer.email,
    from: 'noreply@aruviah.com',
    subject: 'Test Email',
    htmlContent: testHTML,
    type: 'test',
    relatedData: {
      testId: 'test-123',
      customField: 'custom-value'
    },
    isSent: true
  });
}
```

## Email Types Supported

The system automatically captures these email types:

| Type | Usage | Example |
|------|-------|---------|
| `order` | Order confirmations, updates | Order #12345 Confirmed |
| `order_status` | Order status changes | Your Order is Shipped |
| `order_shipped` | Shipping notifications | Your Order Has Shipped |
| `vendor_application` | Vendor program emails | Application Received |
| `password_reset` | Password reset links | Reset Your Password |
| `email_verification` | Email verification codes | Verify Your Email |
| `welcome` | Welcome emails | Welcome to Aruviah |
| `notification` | General notifications | Important Update |
| `general` | Default/uncategorized | N/A |

## Admin Inbox Features

### Viewing Sent Emails
1. **Go to Admin Dashboard** → Email Inbox
2. **Click "Sent"** section to view all sent emails
3. **Search** by recipient, subject, or content
4. **Sort** by date, sender, or type
5. **Filter** by email type using search

### Email Information Displayed
For each sent email:
- **Recipient** - Who received it
- **Subject** - Email subject line
- **Type** - Category (Order, Vendor, etc.)
- **Date/Time** - When it was sent
- **Preview** - First 100 characters of content
- **Metadata** - Related order ID, customer name, etc.

### Actions Available
- ⭐ **Star** - Mark important emails
- 🔔 **Snooze** - Hide until later today, tomorrow, next week, or month
- 🗑️ **Delete** - Permanently delete (after confirmation)
- 👁️ **Read/Unread** - Mark read status
- 🔍 **Preview** - View full email HTML

## Monitoring Sent Emails

### Real-Time Updates
The inbox auto-refreshes when:
- Emails are sent by the system
- You click the Refresh button
- You navigate between sections

### Email Counts
Section badges show:
- **Inbox** - All unread, unsnoozed, sent emails
- **Sent** - All outgoing emails
- **Unread** - Emails not yet read
- **Starred** - Flagged important emails
- **Snoozed** - Hidden until snooze date

### Search & Filter
```javascript
// The search bar automatically searches:
- Subject line
- Recipient email
- Sender name
- Email type
- Related data (customer name, order ID, etc.)
```

## Database Schema

### admin_emails Collection
```javascript
{
  id: "doc-id",
  to: "customer@example.com",
  from: "noreply@aruviah.com",
  subject: "Order Confirmation #12345",
  htmlContent: "<html>...</html>",
  type: "order",
  relatedData: {
    orderId: "order-123",
    customerName: "John Doe",
    customerEmail: "john@example.com",
    orderTotal: 4500
  },
  
  // Flags
  isRead: false,
  isStarred: false,
  isDraft: false,
  isSent: true,      // TRUE for sent emails
  isSnoozed: false,
  
  // Dates
  createdAt: Timestamp,
  snoozeUntil: null,
  updatedAt: Timestamp,
  
  // Organization
  labels: []
}
```

## Best Practices

### 1. Always Include Related Data
```javascript
// ✅ GOOD - Full context
relatedData: {
  orderId: order.id,
  customerId: customer.id,
  customerName: customer.firstName + ' ' + customer.lastName,
  customerEmail: customer.email,
  orderTotal: order.total,
  itemCount: order.items.length,
  status: 'confirmed'
}

// ❌ BAD - Incomplete context
relatedData: {}
```

### 2. Use Correct Email Types
```javascript
// ✅ GOOD - Specific type
emailType: 'order_status'

// ❌ BAD - Too generic
emailType: 'general'
```

### 3. Handle Errors Gracefully
```javascript
const result = await sendTransactionalEmail({...});

if (!result.success) {
  console.error('Email failed:', result.error);
  // Email wasn't sent OR saved
  // Notify user to try again
} else {
  // Email sent successfully
  console.log('Admin email ID:', result.adminEmailId);
}
```

### 4. Don't Save Drafts as Sent
```javascript
// ✅ CORRECT for drafts
await saveEmailToAdminInbox({
  ...emailData,
  isDraft: true,
  isSent: false  // Not sent yet
});

// For actual sent:
await sendTransactionalEmail({
  ...emailData,
  saveToAdminInbox: true  // Auto-sets isSent: true
});
```

## Troubleshooting

### Sent Emails Not Appearing

**Problem:** Email was sent but doesn't appear in admin inbox "Sent"

**Solutions:**
1. Check email type is correct
2. Verify `isSent: true` flag is set
3. Ensure Firebase admin_emails collection exists
4. Check Firebase permissions allow write to admin_emails
5. Look at browser console for error messages

```javascript
// Debug: Check result
const result = await sendTransactionalEmail({...});
console.log('Success:', result.success);
console.log('Admin Email ID:', result.adminEmailId);
console.log('Error:', result.error);
```

### Missing Related Data

**Problem:** Recipient/order info not showing in admin inbox

**Solution:** Always pass complete relatedData:

```javascript
relatedData: {
  orderId: order?.id,
  customerId: customer?.id,
  customerName: customer?.firstName + ' ' + customer?.lastName,
  customerEmail: customer?.email
}
```

### Emails Marked as Unread

**Problem:** Sent emails showing as unread in admin inbox

**Solution:** This is normal - sent emails are marked as read automatically. If not:

```javascript
// Manual fix
await markEmailAsRead(emailId);
```

## API Reference

### sendTransactionalEmail()
```javascript
const result = await sendTransactionalEmail({
  email,              // Required: recipient email
  subject,            // Required: email subject
  htmlContent,        // Required: HTML email body
  senderName,         // Optional: defaults to 'Aruviah'
  senderEmail,        // Optional: uses REACT_APP_BREVO_SENDER_EMAIL
  saveToAdminInbox,   // Optional: defaults to true
  emailType,          // Optional: defaults to 'general'
  relatedData         // Optional: defaults to {}
});

// Returns: { success, messageId, adminEmailId, error }
```

### saveEmailToAdminInbox()
```javascript
const result = await saveEmailToAdminInbox({
  to,           // Required: recipient email
  from,         // Required: sender email
  subject,      // Required: email subject
  htmlContent,  // Required: HTML content
  type,         // Optional: email category
  relatedData,  // Optional: context data
  isSent        // Optional: true for outgoing, false for received
});

// Returns: { success, emailId, error }
```

## Performance Notes

- Admin inbox loads emails on-demand (not preloaded)
- Typically <2 seconds for sent emails to appear
- Search/filter happens in-memory after loading
- Real-time updates via Firestore listener (future enhancement)

## Security Notes

- Email content is stored in Firestore (encrypted at rest)
- HTML is sanitized before display to prevent XSS
- Admin users only - restricted by Firebase rules
- Deleted emails are permanently removed
- Related data doesn't contain sensitive info (passwords, tokens, etc.)
