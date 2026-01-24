# Vendor Application Email System - Quick Start Guide

## What's New?

When a vendor applies to sell on your platform:
1. ✅ **Admin gets an email notification** (via Brevo)
2. ✅ **Email appears in admin dashboard inbox** (under Settings → Email Inbox)
3. ✅ **Admin can review all details in one place**

---

## How to Use

### For Admins

#### Access Email Inbox
```
Dashboard → Settings → Email Inbox
```

#### View Vendor Applications
1. Click the "Type" filter dropdown
2. Select "Vendor Applications"
3. All pending vendor apps appear

#### Review Application Details
1. Click on an email in the list
2. Side panel shows:
   - Applicant name & email
   - Business name & category
   - Business address
   - Business description
3. Click "Review Application" link to approve/reject in Vendor Apps tab

#### Manage Emails
- **Mark as Read:** Click the eye icon
- **Delete:** Click trash icon
- **Search:** Type in search box
- **Batch Actions:** Check multiple emails, then use bulk buttons

---

## How It Works Behind the Scenes

### Step-by-Step Process

1. **Vendor submits application** → `/vendor-signup` form
2. **Application saved** → Firestore `vendor_applications` collection
3. **Confirmation email sent** → Sent to vendor's email
4. **Admin notification email sent** → Sent via Brevo
5. **Email stored in inbox** → Saved to Firestore `admin_emails` collection
6. **Admin views in dashboard** → Settings → Email Inbox

### Email Content

Admin receives professional email with:
- Vendor's name, email, phone
- Business name & category
- Business address
- Business description
- Direct link to admin dashboard
- Application ID & submission date

---

## File Changes Summary

### New Files Created

| File | Purpose |
|------|---------|
| `src/services/email/adminEmailService.js` | Email storage and retrieval |
| `src/components/admin/AdminEmailInbox/AdminEmailInbox.jsx` | Email inbox UI component |
| `src/components/admin/AdminEmailInbox/AdminEmailInbox.css` | Email inbox styling |

### Modified Files

| File | Change |
|------|--------|
| `src/utils/defaultEmailTemplates.js` | Added vendor application email template |
| `src/services/email/brevoService.js` | Added sendBrevEmail alias function |
| `src/services/vendor/vendorService.js` | Added sendAdminVendorApplicationNotification() |
| `src/components/admin/AdminSettings/AdminSettings.jsx` | Added Email Inbox tab |

---

## Setup Requirements

### Environment Variables (Already Set)
```
REACT_APP_BREVO_API_KEY          # Email service API key
REACT_APP_BASE_URL                # Your website URL
```

### Optional Customization

#### Set Admin Email Address
Add to Firestore settings:
```
Collection: settings
Document: emails
Field: adminEmail = "your-email@domain.com"
```

#### Custom Email Template
Create in Firestore:
```
Collection: emailTemplates
Document: vendorApplication
Fields: 
  - subject: string
  - htmlContent: string (HTML email content)
```

---

## Quick Test

### Test Vendor Application Email

1. Create a test user account (if you don't have one)
2. Log out
3. Go to `/vendor-signup` or find "Become a Vendor" link
4. Fill out vendor application form:
   - Business Name: Test Business
   - Description: Test description
   - Category: Select any
   - Phone: +254712345678
   - Address: Test address
5. Click "Submit Application"
6. You should see success message
7. Log in as admin
8. Go to Settings → Email Inbox
9. You should see the new vendor application email
10. Click on it to view all details

---

## Features

### Email Inbox Features
- ✅ View all emails in one place
- ✅ Filter by type (Vendor Apps, Orders, General)
- ✅ Search by subject, sender, business name
- ✅ Mark as read/unread
- ✅ Delete emails
- ✅ Batch mark as read
- ✅ Batch delete
- ✅ Email preview panel
- ✅ Unread count badge
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Date formatting (Today, Yesterday, relative dates)

---

## Email Types

### Vendor Application
- **When sent:** When vendor submits application
- **Recipient:** Admin
- **Info includes:** Applicant details, business info, description

### Future Types
- Order notifications
- Customer inquiries
- System alerts
- Newsletter updates

---

## Database Schema

### admin_emails Collection
```javascript
{
  to: "admin@aruviah.com",
  from: "vendor@example.com",
  subject: "New Vendor Application - Tech Solutions",
  htmlContent: "<html>...",
  type: "vendor_application",
  isRead: false,
  relatedId: "app123",
  relatedData: {
    firstName: "John",
    businessName: "Tech Solutions",
    email: "john@example.com",
    // ... more fields
  },
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

---

## Common Tasks

### Finding a Specific Vendor Application
1. Go to Email Inbox
2. Type vendor name in search box
3. Results update in real-time

### Archiving Old Emails
1. Filter by "Vendor Applications"
2. Sort by "Oldest First"
3. Select old emails
4. Click "Delete" button

### Checking Unread Emails
- Unread count shows in header
- Unread emails have orange dot indicator
- Mark as read when reviewed

### Bulk Operations
1. Check the checkbox next to multiple emails
2. Actions appear: "Mark Read" and "Delete"
3. Click action to apply to all selected

---

## Troubleshooting

### Email Not Appearing in Inbox?
1. Check email was submitted successfully (no error message)
2. Refresh the Email Inbox page
3. Check Firestore: `admin_emails` collection should have documents
4. Verify email filter isn't hiding it

### Email Content Not Showing?
1. Try marking as read/unread
2. Close and reopen email preview
3. Refresh the page
4. Check browser console for errors (F12)

### Admin Email Not Being Sent?
1. Verify `REACT_APP_BREVO_API_KEY` is set
2. Check admin email address is correct
3. Check Brevo account has credits
4. Check browser console for error messages

---

## Tips & Best Practices

### Organizing Vendor Applications
1. Set up a workflow in your process
2. Review new applications regularly
3. Mark as read when reviewed
4. Delete after approval/rejection (or keep for records)

### Responsive Design
- **Desktop:** Inbox list on left, preview on right
- **Tablet:** List takes more space, preview smaller
- **Mobile:** List full width, preview opens overlay

### Mobile Tips
- Swipe to close preview panel
- Use search to find applications quickly
- Batch operations are mobile-friendly

---

## Next Steps

1. **Test the system:** Follow "Quick Test" above
2. **Customize if needed:** Set admin email or custom template
3. **Train team:** Show staff how to access Email Inbox
4. **Monitor:** Check Email Inbox regularly for new applications
5. **Optimize:** Delete old emails to keep inbox clean

---

## Contact & Support

For issues or questions:
1. Check this quick start guide
2. Read full documentation: `VENDOR_APPLICATION_EMAIL_SYSTEM.md`
3. Check Firestore for data integrity
4. Review browser console for error messages

---

## Version Info

- **Version:** 1.0
- **Release Date:** December 25, 2025
- **Status:** Production Ready ✅

---

## What You Get

✅ Professional vendor application email template
✅ Automatic email storage in admin inbox
✅ Search and filter capabilities
✅ Batch operations
✅ Mobile-responsive design
✅ Unread tracking
✅ Email preview
✅ Real-time updates

All working automatically with your existing vendor system!
