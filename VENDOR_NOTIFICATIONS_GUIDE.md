# Vendor Notifications & Email System Guide

## Overview

The vendor system now includes comprehensive email notifications and in-app notifications for all vendor application status updates. Users are kept informed at every stage of their vendor application journey.

## Email Notifications

### 1. Application Received Confirmation Email

**Triggered:** When user submits vendor application
**Recipients:** Applicant (user email)
**Includes:**
- Confirmation that application was received
- Expected review timeline (3-5 business days)
- Note about potential contact for additional information
- Link to account to check application status

**Implementation:**
```javascript
// In VendorSignupForm.jsx
await sendApplicationReceivedNotification({
  userId: user.uid,
  email: user.email,
  businessName: formData.businessName.trim(),
  firstName: user.displayName || formData.businessName.trim().split(' ')[0]
}, result.applicationId);
```

### 2. Application Approved Email

**Triggered:** When admin clicks "Approve" on vendor application
**Recipients:** Approved vendor (user email)
**Includes:**
- Celebration message
- Confirmation of approval
- List of vendor features now available:
  - Post and manage products
  - View sales analytics
  - Manage customer orders
  - Track revenue
  - Update business information
- Direct link to vendor dashboard
- Vendor support contact information

**Implementation:**
```javascript
// In VendorApplications.jsx
await approveVendorWithNotification(applicationId, user.uid, appData);
```

### 3. Application Rejected Email

**Triggered:** When admin clicks "Reject" on vendor application
**Recipients:** Rejected applicant (user email)
**Includes:**
- Professional rejection notification
- **Specific reason for rejection** (admin-provided)
- Suggestions for improvement
- Option to reapply after 30 days
- Link to vendor program information
- Support contact information

**Implementation:**
```javascript
// In VendorApplications.jsx
const rejectionReason = rejectionReason[applicationId] || 'No specific reason provided';
await rejectVendorWithNotification(applicationId, user.uid, appData, rejectionReason);
```

## In-App Notifications

All status updates also create notifications in the notification panel.

### Notification Types

| Type | Title | Message | Trigger |
|------|-------|---------|---------|
| `vendor_application_received` | ✓ Application Received | Application received and under review | User submits application |
| `vendor_approved` | ✅ Vendor Application Approved! | Can access vendor dashboard | Admin approves application |
| `vendor_rejected` | ⚠️ Application Status Update | Check email for details | Admin rejects application |

### Notification Storage

Notifications are stored in Firestore collection: `notifications`

**Notification Document Structure:**
```javascript
{
  userId: "user-id",
  type: "vendor_approved|vendor_rejected|vendor_application_received",
  title: "Display title with emoji",
  message: "Detailed message",
  relatedId: "application-id",
  relatedType: "vendor_application",
  isRead: false,
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

### Notification Panel Integration

Notifications appear in the notification panel (usually top-right or sidebar):
- Listed in reverse chronological order (newest first)
- Show timestamp of when notification was created
- Can be marked as read
- Linked to related application

## Firestore Collections & Schema

### `notifications` Collection

Created automatically when first notification is added.

**Document Fields:**
- `userId` (string): User who receives notification
- `type` (string): Notification type (enum)
- `title` (string): Display title
- `message` (string): Notification message
- `relatedId` (string): Related application ID
- `relatedType` (string): Type of related resource
- `isRead` (boolean): Whether user has read notification
- `createdAt` (Timestamp): Creation time
- `updatedAt` (Timestamp): Last update time

### `vendor_applications` Collection

Updated with status and admin details.

**Fields Modified:**
- `status`: "pending" → "approved" OR "rejected"
- `reviewedBy`: Admin user ID who made decision
- `rejectionReason`: Reason if rejected
- `updatedAt`: Timestamp of status change

### `users` Collection

Updated when vendor is approved.

**Fields Added on Approval:**
```javascript
{
  isVendor: true,
  vendorStatus: "approved",
  vendorApplicationId: "application-id",
  vendorApprovedAt: Timestamp,
  businessName: "string",
  businessDescription: "string",
  businessCategory: "string",
  contactPhone: "string",
  businessAddress: "string"
}
```

## Vendor Access Control (Whitelisting)

### Authorization Flow

1. **User submits vendor application**
   - Application created with `status: "pending"`
   - User gets `isVendor: false` (remains unchanged)
   - Cannot access vendor dashboard

2. **Admin approves application**
   - Application status changes to `"approved"`
   - User document updated: `isVendor: true`
   - User is now "whitelisted" as vendor
   - Can access `/vendor/dashboard`

3. **User accesses vendor dashboard**
   - `VendorDashboard` checks `user.isVendor === true`
   - `getVendorProfile()` verifies vendor status in Firestore
   - If not vendor: redirected to home page
   - If vendor: full dashboard access

### Protected Routes

**Route Definition (in App.jsx):**
```jsx
<Route 
  path="/vendor/dashboard" 
  element={
    <ProtectedRoute>
      <VendorDashboard />
    </ProtectedRoute>
  } 
/>
```

**Vendor Status Check (in VendorDashboard.jsx):**
```javascript
const checkVendorStatus = async () => {
  const result = await getVendorProfile(user.uid);
  
  if (!result.success) {
    toast.error('You are not authorized as a vendor');
    navigate('/');
    return;
  }
  
  setVendorProfile(result.profile);
};
```

### Vendor Features Available After Approval

Once `isVendor: true`, approved vendors can:

✅ **Products Management**
- View all their products
- Add new products (when feature is implemented)
- Edit product details
- Delete products
- Track product sales

✅ **Orders Management**
- View all orders for their products
- Change order status (pending → confirmed → shipped → completed)
- Track order fulfillment
- Mark orders as completed

✅ **Analytics & Reporting**
- View sales metrics
- See total revenue
- Track order statistics by status
- View top-selling products
- Calculate performance metrics

✅ **Account Settings**
- Update business information
- Manage vendor profile
- View account details

## Email Service Integration

### Email Provider: Brevo (Sendinblue)

**Configuration Required:**
```javascript
// .env file
REACT_APP_BREVO_API_KEY=your_api_key
REACT_APP_BREVO_SENDER_EMAIL=noreply@yourdomain.com
REACT_APP_SITE_URL=https://yourdomain.com
```

### Email Functions

Located in: `src/services/email/emailAutomation.js`

```javascript
// Send approval email
export const sendVendorApprovedEmail = async (email, displayName, businessName)

// Send rejection email  
export const sendVendorRejectedEmail = async (email, displayName, businessName, rejectionReason)

// Send application received confirmation
export const sendVendorApplicationReceivedEmail = async (email, displayName, businessName)
```

### Email Templates

All templates are responsive HTML with:
- Professional styling
- Brand colors (orange #ff9800)
- Clear CTAs (Calls-to-action)
- Mobile-friendly design
- Current year in footer

## Service Functions

### Notification Service Functions

Located in: `src/services/vendor/vendorService.js`

```javascript
// Create notification
createNotification(notificationData: {
  userId: string,
  type: string,
  title: string,
  message: string,
  relatedId?: string,
  relatedType?: string
})

// Get user notifications
getUserNotifications(userId: string, limit?: number)

// Mark as read
markNotificationAsRead(notificationId: string)

// Approve with email & notification
approveVendorWithNotification(
  applicationId: string,
  adminId: string,
  appData: { userId, email, businessName, firstName }
)

// Reject with email & notification
rejectVendorWithNotification(
  applicationId: string,
  adminId: string,
  appData: { userId, email, businessName, firstName },
  rejectionReason: string
)

// Send application received notification
sendApplicationReceivedNotification(
  appData: { userId, email, businessName, firstName },
  applicationId: string
)
```

## User Experience Flow

### For Applicants

1. **Application Submission**
   ```
   Fill form → Submit → Receive confirmation email + notification
   ```

2. **Approval**
   ```
   Admin approves → Receive approval email + notification → Can access dashboard
   ```

3. **Rejection**
   ```
   Admin rejects with reason → Receive rejection email + notification → Option to reapply
   ```

### For Admins

1. **View Applications**
   ```
   Settings → Vendor Apps → View pending applications
   ```

2. **Approve or Reject**
   ```
   Click Approve/Reject button → Enter rejection reason if rejecting → 
   Automatic email and notification sent → User status updated
   ```

3. **Track Status**
   ```
   Filter by status (pending/approved/rejected) → Refresh to see updates
   ```

## Testing Checklist

- [ ] User can submit vendor application
- [ ] Application received email is sent
- [ ] Application received notification appears in notification panel
- [ ] Admin can see pending applications in Settings
- [ ] Admin can approve application
- [ ] Approval email is sent with dashboard link
- [ ] Approval notification appears in user panel
- [ ] Approved user can access `/vendor/dashboard`
- [ ] User can see their vendor products/orders/analytics
- [ ] Admin can reject with custom reason
- [ ] Rejection email includes the rejection reason
- [ ] Rejected user cannot access vendor dashboard
- [ ] Notifications persist in Firestore
- [ ] Notifications display correctly on multiple devices
- [ ] Email templates render properly in email clients

## Troubleshooting

### Email Not Sending

**Check:**
1. Brevo API key is configured in `.env`
2. Sender email is verified in Brevo
3. Email is valid format
4. Check browser console for errors

### Notifications Not Appearing

**Check:**
1. `notifications` collection exists in Firestore
2. User has read permissions on `notifications` collection
3. NotificationProvider wraps the app in index.js
4. User is logged in with correct ID

### Vendor Can't Access Dashboard

**Check:**
1. User document has `isVendor: true`
2. Application status is "approved"
3. User is logged in
4. Clear browser cache and reload

### Admin Can't See Applications

**Check:**
1. User is logged in as admin
2. Admin has Firestore read permissions on `vendor_applications`
3. Applications have been submitted
4. Collection exists in Firestore

## Future Enhancements

- [ ] Email templates customizable by admin
- [ ] Scheduled notifications (e.g., "Your application will be reviewed soon")
- [ ] SMS notifications option
- [ ] Application appeal system
- [ ] Automatic approval after verification
- [ ] Bulk notification sending to all vendors
- [ ] Notification preferences per user

## Support

For issues with vendor notifications:
1. Check Firestore collections are properly created
2. Verify Brevo API credentials
3. Check browser console for errors
4. Review Firestore security rules
5. Ensure user document structure is correct

---

**Last Updated:** December 25, 2025
**Version:** 1.0
**Status:** Production Ready
