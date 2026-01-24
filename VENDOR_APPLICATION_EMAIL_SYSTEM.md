# Vendor Application Email System - Complete Implementation Guide

## Overview

This document explains the complete implementation of the vendor application email notification system. When a new vendor applies, the admin automatically receives an email notification AND the application details are stored in the admin dashboard email inbox.

---

## Features Implemented

### 1. **Email Notification on Vendor Application**
- When a vendor submits an application, an email is automatically sent to the admin
- Email includes all vendor application details
- Email is sent via Brevo (your email service provider)
- Email is also stored in the admin inbox for record-keeping

### 2. **Admin Email Inbox**
- View all emails received in one centralized location
- Filter emails by type (Vendor Application, Order, General)
- Search emails by subject, sender, business name, or email
- Mark emails as read/unread
- Delete emails
- Batch operations (mark multiple emails as read, delete multiple)
- Email preview with full details
- See unread email count

### 3. **Email Template for Vendor Applications**
- Professional HTML email template
- Displays all vendor application information
- Includes direct link to admin dashboard for quick review
- Color-coded branding (orange/Aruviah theme)

---

## File Structure

### New Files Created

```
src/
├── services/email/
│   └── adminEmailService.js          (Email storage & retrieval)
│
└── components/admin/AdminEmailInbox/
    ├── AdminEmailInbox.jsx           (Main inbox component)
    └── AdminEmailInbox.css           (Styling)
```

### Modified Files

```
src/
├── utils/
│   └── defaultEmailTemplates.js      (Added vendorApplication template)
├── services/
│   ├── email/brevoService.js         (Added sendBrevEmail alias)
│   └── vendor/vendorService.js       (Added sendAdminVendorApplicationNotification)
└── components/admin/AdminSettings/
    └── AdminSettings.jsx              (Added Email Inbox tab)
```

---

## How It Works

### Step 1: Vendor Submits Application
```
User visits /vendor-signup page
↓
User fills out vendor application form
↓
User clicks "Submit Application"
↓
VendorSignupForm.jsx sends request to submitVendorApplication()
```

### Step 2: Application is Created
```
vendorService.js creates application document in Firestore
↓
Application stored in 'vendor_applications' collection
↓
sendApplicationReceivedNotification() is called
```

### Step 3: Admin Gets Notification
```
sendAdminVendorApplicationNotification() is triggered
↓
Email composed using vendorApplication template
↓
Email sent to admin via Brevo API
↓
Email also saved to admin_emails collection (inbox)
```

### Step 4: Admin Views in Dashboard
```
Admin logs in to dashboard
↓
Goes to Settings → Email Inbox
↓
Sees all vendor applications and other emails
↓
Can click to view full details, mark as read, or delete
```

---

## Service Documentation

### adminEmailService.js

#### `saveEmailToAdminInbox(emailData)`
Saves an email to the admin inbox for storage and tracking.

**Parameters:**
```javascript
{
  to: 'admin@aruviah.com',              // Recipient
  from: 'vendor@example.com',           // Sender
  subject: 'New Vendor Application',    // Subject
  htmlContent: '<html>...</html>',      // HTML content
  type: 'vendor_application',           // Type: 'vendor_application', 'order', 'general'
  relatedId: 'app123',                  // Reference ID (application ID)
  relatedData: {                        // Additional context
    firstName: 'John',
    email: 'vendor@example.com',
    businessName: 'Tech Solutions',
    // ... more fields
  }
}
```

**Returns:**
```javascript
{ success: true, emailId: 'email_doc_id' }
{ success: false, error: 'error message' }
```

#### `getAdminEmails(filters)`
Retrieves emails from admin inbox with optional filtering.

**Parameters:**
```javascript
{
  type: 'vendor_application',  // Filter by type
  isRead: false,               // Filter by read status
  limit: 50                    // Max results
}
```

**Returns:**
```javascript
{
  success: true,
  emails: [
    {
      id: 'email_id',
      to: 'admin@aruviah.com',
      from: 'vendor@example.com',
      subject: 'New Vendor Application',
      type: 'vendor_application',
      isRead: false,
      createdAt: Date,
      relatedData: { ... }
    }
  ]
}
```

#### `markEmailAsRead(emailId)`
Marks a single email as read.

#### `markEmailsAsRead(emailIds)`
Marks multiple emails as read (batch operation).

#### `deleteAdminEmail(emailId)`
Deletes a single email from inbox.

#### `deleteAdminEmails(emailIds)`
Deletes multiple emails from inbox (batch operation).

#### `getEmailCountByType()`
Returns statistics about emails by type and read status.

**Returns:**
```javascript
{
  success: true,
  counts: {
    total: 42,
    vendor_application: 5,
    order: 30,
    general: 7,
    unread: 8
  }
}
```

#### `searchAdminEmails(searchTerm)`
Searches emails by subject, sender, or business name.

---

## Email Template Details

### Vendor Application Email Template

**Location:** `src/utils/defaultEmailTemplates.js`

**Template Name:** `vendorApplication`

**Variables:**
- `{{firstName}}` - Vendor's first name
- `{{lastName}}` - Vendor's last name
- `{{email}}` - Vendor's email
- `{{phone}}` - Contact phone
- `{{businessName}}` - Business name
- `{{businessCategory}}` - Business category
- `{{businessAddress}}` - Business address
- `{{businessDescription}}` - Business description
- `{{applicationId}}` - Application ID
- `{{submittedDate}}` - Submission date/time
- `{{adminDashboardLink}}` - Link to admin dashboard

**Features:**
- Professional gradient header (orange theme)
- Organized sections for applicant and business info
- Direct link to admin dashboard for quick review
- Responsive HTML design
- Clear call-to-action button

---

## AdminEmailInbox Component

### Features

1. **Email List View**
   - Checkbox selection (individual and bulk)
   - Email type badges with color coding
   - Unread indicators
   - Date formatting (Today, Yesterday, Month Day)
   - Action buttons for each email

2. **Filtering & Search**
   - Filter by email type (All, Vendor Applications, Orders, General)
   - Search by subject, sender, business name
   - Sort by newest or oldest first

3. **Batch Operations**
   - Mark selected emails as read
   - Delete selected emails
   - Shows count of selected emails

4. **Email Preview Panel**
   - Full email details in side panel
   - For vendor applications: Shows applicant and business info
   - Full HTML rendering of email content
   - Action buttons (mark read, delete)

5. **Responsive Design**
   - Desktop: List + Preview side-by-side
   - Tablet: Adjusted layout
   - Mobile: Preview opens in full-screen overlay

---

## Database Schema

### admin_emails Collection

```javascript
{
  id: 'document_id',
  to: 'admin@aruviah.com',           // Recipient email
  from: 'vendor@example.com',        // Sender email
  subject: 'New Vendor Application - Tech Solutions | Admin Review Required',
  htmlContent: '<html>...</html>',   // Full HTML email
  type: 'vendor_application',        // Type: vendor_application, order, general
  isRead: false,                     // Read status
  relatedId: 'app123',               // Reference to related document (application ID)
  relatedData: {                     // Contextual data
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    phone: '+254712345678',
    businessName: 'Tech Solutions Kenya',
    businessCategory: 'electronics',
    businessAddress: 'Nairobi, Kenya',
    businessDescription: 'We sell electronics and gadgets',
    applicationId: 'app123',
    submittedDate: 'December 25, 2025, 10:30 AM'
  },
  createdAt: Timestamp,              // Email creation time
  updatedAt: Timestamp               // Last update time
}
```

---

## Integration Points

### 1. VendorSignupForm.jsx
When vendor submits application:
```javascript
await sendApplicationReceivedNotification({
  userId: user.uid,
  email: user.email,
  businessName: formData.businessName.trim(),
  firstName: user.displayName || formData.businessName.trim().split(' ')[0]
}, result.applicationId);
```

This triggers:
- Email to vendor (confirmation)
- Email to admin (notification)
- Email stored in admin inbox
- Notification created for user

### 2. AdminSettings Component
Added new tab: "Email Inbox"
```javascript
{activeTab === 'emails-inbox' && (
  <AdminEmailInbox />
)}
```

### 3. vendorService.js
New function: `sendAdminVendorApplicationNotification()`
- Composes email from template
- Sends via Brevo
- Stores in Firestore inbox

---

## Configuration

### Required Environment Variables
```
REACT_APP_BREVO_API_KEY          # Brevo API key
REACT_APP_ADMIN_EMAIL             # Admin email address (optional, defaults to admin@aruviah.com)
REACT_APP_BASE_URL                # Your website base URL
```

### Optional Customization

#### Custom Email Template
Create a document in Firestore:
- Collection: `emailTemplates`
- Document ID: `vendorApplication`
- Fields: `subject` (string), `htmlContent` (string)

The system will use your custom template if it exists, otherwise falls back to the default.

#### Change Admin Email
Update in Firestore settings:
- Collection: `settings`
- Document ID: `emails`
- Field: `adminEmail: 'your-email@domain.com'`

---

## Usage Guide for Admins

### Accessing Email Inbox

1. Log in to admin dashboard
2. Click "Settings" in sidebar
3. Click "Email Inbox" tab
4. View all emails

### Finding Vendor Applications

1. Use the "Type" filter dropdown
2. Select "Vendor Applications"
3. View all pending vendor applications

### Reviewing a Vendor Application

1. Click on an email in the list
2. Preview panel opens on the right
3. See all applicant and business details
4. Review business description
5. Use admin dashboard "Vendor Apps" tab to approve/reject

### Organizing Emails

- **Mark as Read:** Click eye icon or bulk action
- **Delete:** Click trash icon or bulk action
- **Search:** Type in search box to find specific emails
- **Filter:** Use dropdown to filter by type

---

## Email Flow Diagram

```
┌──────────────────────────────────────────────────────────┐
│  Vendor Submits Application at /vendor-signup           │
└────────────────────┬─────────────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────────────────┐
│  submitVendorApplication() - Creates Firestore Doc      │
└────────────────────┬─────────────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────────────────┐
│  sendApplicationReceivedNotification()                   │
└────────────────────┬─────────────────────────────────────┘
                     │
         ┌───────────┴───────────┐
         │                       │
         ▼                       ▼
    Send to Vendor          sendAdminVendorApplicationNotification()
    (Confirmation Email)    │
                            │
                    ┌───────┴─────────┐
                    │                 │
                    ▼                 ▼
                Brevo API        saveEmailToAdminInbox()
                (Send Email)     │
                    │            │
                    │            ▼
                    │      Firestore admin_emails
                    │      (Store for Inbox)
                    │
                    ▼
            Admin Email Inbox
            (View in Dashboard)
```

---

## Testing

### Test Vendor Application Flow

1. Create test user account
2. Visit `/vendor-signup`
3. Fill out vendor application form with test data
4. Submit application
5. Check admin email (should receive notification)
6. Log in to admin dashboard
7. Go to Settings → Email Inbox
8. Verify email appears in list
9. Click to view details
10. Verify all information is correct
11. Go back to "Vendor Apps" tab to approve/reject

### Test Email Inbox Features

1. **Filter by Type:**
   - Select "Vendor Applications" from dropdown
   - Verify only vendor app emails show

2. **Search:**
   - Type vendor name or email in search box
   - Verify results filter correctly

3. **Mark as Read:**
   - Click unread email
   - Click "✓ Mark as Read" button
   - Verify unread indicator disappears

4. **Delete:**
   - Click email
   - Click "🗑 Delete" button
   - Confirm deletion
   - Verify email removed from list

5. **Batch Operations:**
   - Check multiple emails
   - Click "Mark Read" or "Delete" button
   - Verify bulk operation works

---

## Troubleshooting

### Email Not Sent
- Check `REACT_APP_BREVO_API_KEY` environment variable
- Verify admin email is configured
- Check browser console for errors
- Check Firestore for admin_emails collection creation

### Email Not Appearing in Inbox
- Check if email was saved: Look in Firestore `admin_emails` collection
- Verify `type` field is set to `'vendor_application'`
- Check filters are not hiding the email

### Template Variables Not Replacing
- Check template syntax: `{{variableName}}`
- Verify variable names match exactly
- Check for typos in variable names

### Email Not Received by Admin
- Verify SMTP configuration in Brevo account
- Check Brevo bounce/suppression list
- Check spam/junk folder
- Verify sender email is authorized in Brevo

---

## Future Enhancements

1. **Email Scheduling**
   - Schedule emails to send at specific times
   - Retry failed emails automatically

2. **Email Templates Management**
   - UI for creating/editing email templates
   - Email preview before sending
   - Template variables auto-detection

3. **Email Analytics**
   - Track email open rates
   - Track link clicks
   - Email delivery status

4. **Automated Responses**
   - Auto-responder for vendor applications
   - Scheduled follow-up emails
   - Email automation workflows

5. **Email Categories**
   - More email types and filtering
   - Color-coded categories
   - Custom categories

6. **Email Export**
   - Export emails to CSV
   - Email archives
   - Backup functionality

---

## API Reference

### Send Email to Admin Inbox

```javascript
import { saveEmailToAdminInbox } from '@/services/email/adminEmailService';

const result = await saveEmailToAdminInbox({
  to: 'admin@aruviah.com',
  from: 'customer@example.com',
  subject: 'New Vendor Application',
  htmlContent: emailHTML,
  type: 'vendor_application',
  relatedId: 'app_123',
  relatedData: {
    businessName: 'My Business',
    email: 'vendor@example.com'
    // ... more data
  }
});

if (result.success) {
  console.log('Email saved:', result.emailId);
}
```

### Get Admin Emails

```javascript
import { getAdminEmails } from '@/services/email/adminEmailService';

const result = await getAdminEmails({
  type: 'vendor_application',
  limit: 50
});

if (result.success) {
  console.log('Emails:', result.emails);
}
```

### Search Emails

```javascript
import { searchAdminEmails } from '@/services/email/adminEmailService';

const result = await searchAdminEmails('tech solutions');

if (result.success) {
  console.log('Search results:', result.emails);
}
```

---

## Support & Maintenance

For questions or issues:
1. Check browser console for error messages
2. Review Firestore for data structure
3. Check Brevo account for email delivery status
4. Review this documentation for setup steps

---

**Last Updated:** December 25, 2025
**Version:** 1.0
