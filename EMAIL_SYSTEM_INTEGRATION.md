# Email System Integration Guide

## Overview

The admin email system now captures **all sent emails** (like order confirmations, status updates, etc.) and displays them in the Admin Email Inbox with **proper HTML template rendering**.

## Features

### 1. **Automatic Email Capture**
- Any email sent via Brevo is automatically saved to the admin inbox
- Emails are marked as "Sent" and "Read" for easy tracking
- Includes recipient, subject, content, and metadata

### 2. **HTML Template Rendering**
- Emails are sanitized to remove malicious content
- Templates are properly rendered with styling
- Supports tables, images, links, and formatting

### 3. **Email Categorization**
- Automatically detects email type (Order, Vendor, Status, etc.)
- Supports custom email types
- Organizes emails in different sections

### 4. **Template Detection**
- Identifies incomplete templates (with `{{variables}}`)
- Detects specific template types (orderConfirmation, orderStatus, etc.)
- Extracts text previews automatically

## Implementation Guide

### Step 1: Update Email Sending Code

When sending emails via Brevo, the system automatically saves them. Here's an example:

```javascript
import { sendTransactionalEmail } from '../services/email/brevoService';

// Send order confirmation email
const result = await sendTransactionalEmail({
  email: 'customer@example.com',
  subject: 'Order Confirmation #12345',
  htmlContent: orderConfirmationTemplate,
  senderName: 'Aruviah',
  senderEmail: process.env.REACT_APP_BREVO_SENDER_EMAIL,
  
  // NEW: Auto-save to admin inbox
  saveToAdminInbox: true,        // Default: true
  emailType: 'order',            // Type for categorization
  relatedData: {
    orderId: '12345',
    customerName: 'John Doe',
    orderTotal: 5000
  }
});

// Result includes both Brevo messageId and adminEmailId
console.log(result.messageId);   // Brevo ID
console.log(result.adminEmailId); // Admin inbox ID
```

### Step 2: Email Type Classification

Use these predefined types for consistent categorization:

```javascript
const emailTypes = {
  'order': 'Order',                      // Order confirmations
  'order_status': 'Order Status',       // Status updates (shipped, delivered, etc.)
  'order_shipped': 'Order Shipped',     // Shipping notifications
  'vendor_application': 'Vendor App',   // Vendor applications
  'password_reset': 'Password Reset',   // Password reset emails
  'email_verification': 'Email Verify', // Verification emails
  'welcome': 'Welcome',                 // Welcome emails
  'notification': 'Notification',       // General notifications
  'general': 'General'                  // Miscellaneous
};
```

### Step 3: Using the Email Renderer Hook

The system provides a hook to render emails properly:

```javascript
import { useEmailRenderer } from '../hooks/useEmailRenderer';

function EmailPreview({ email }) {
  const renderer = useEmailRenderer(email.htmlContent);
  
  return (
    <div>
      {/* Safe HTML with sanitization */}
      <div dangerouslySetInnerHTML={{ __html: renderer.safeHtml }} />
      
      {/* Template info */}
      {renderer.isTemplate && (
        <p>This is a {renderer.templateType} template</p>
      )}
      
      {/* Preview text */}
      <p>{renderer.preview}</p>
      
      {/* Content features */}
      <div>
        Images: {renderer.features.imageCount}
        Tables: {renderer.features.hasTables ? 'Yes' : 'No'}
        Links: {renderer.features.linkCount}
      </div>
    </div>
  );
}
```

### Step 4: Manual Admin Email Saving

You can also manually save emails to the inbox:

```javascript
import { saveEmailToAdminInbox } from '../services/email/adminEmailService';

// Save an email to admin inbox
const result = await saveEmailToAdminInbox({
  to: 'customer@example.com',
  from: 'noreply@aruviah.com',
  subject: 'Email Subject',
  htmlContent: '<h1>Hello</h1><p>Email body</p>',
  type: 'order',                    // Email type
  relatedId: 'order_123',          // Link to related record
  relatedData: {                   // Additional context
    orderId: 'order_123',
    customerName: 'John Doe'
  },
  isSent: true                     // Mark as sent email
});
```

## Email Properties

### saveEmailToAdminInbox() Options

```javascript
{
  to: string,              // Recipient email (required)
  from: string,           // Sender email (default: noreply@aruviah.com)
  subject: string,        // Email subject (required)
  htmlContent: string,    // HTML body (required)
  type: string,          // Email type (default: 'general')
  relatedId: string,     // Optional: ID of related object
  relatedData: object,   // Optional: Additional data to store
  isSent: boolean       // Mark as sent (default: false)
}
```

### sendTransactionalEmail() New Options

```javascript
{
  email: string,                // Recipient (required)
  subject: string,             // Subject (required)
  htmlContent: string,         // HTML body (required)
  senderName: string,         // Sender name (default: 'Aruviah')
  senderEmail: string,        // Sender email
  
  // NEW OPTIONS:
  saveToAdminInbox: boolean,  // Auto-save to inbox (default: true)
  emailType: string,         // Email type (default: 'general')
  relatedData: object       // Related data (default: {})
}
```

## Admin Inbox Features

### Email Sections
The inbox automatically organizes emails into:
- **Inbox**: All received emails
- **Unread**: Unread emails only
- **Starred**: Starred/bookmarked emails
- **Snoozed**: Temporarily hidden emails
- **Draft**: Saved drafts
- **Sent**: Outgoing emails (includes all emails sent via system)

### Actions Available
- **Mark Read/Unread**: Track which emails you've reviewed
- **Star**: Bookmark important emails
- **Snooze**: Hide until later (Today, Tomorrow, Next week, Next month)
- **Delete**: Remove from inbox
- **Compose**: Create and save draft emails

## Email Content Rendering

### HTML Sanitization
All emails are sanitized to remove:
- JavaScript code and event handlers
- Dangerous HTML tags (script, iframe, object, embed)
- Malicious attributes (onclick, onload, etc.)

### Supported HTML Elements
- Headings (h1-h6)
- Paragraphs and text formatting (b, i, u, strong, em)
- Lists (ul, ol, li)
- Tables with styling
- Images with src validation
- Links (a tags)
- Blockquotes and code blocks
- Line breaks and horizontal rules

## Example: Order Confirmation Email

```javascript
// In your order confirmation function
import { sendTransactionalEmail } from '../services/email/brevoService';
import { getEmailTemplate } from '../services/email/brevoService';

async function sendOrderConfirmation(order, customer) {
  // Get the order confirmation template
  const template = await getEmailTemplate('orderConfirmation');
  
  // Fill in template variables
  const htmlContent = replaceTemplateVariables(template.html, {
    customerName: customer.name,
    orderId: order.id,
    orderTotal: order.total,
    // ... other variables
  });
  
  // Send email (automatically saved to admin inbox)
  const result = await sendTransactionalEmail({
    email: customer.email,
    subject: `Order Confirmation #${order.id}`,
    htmlContent,
    saveToAdminInbox: true,
    emailType: 'order',
    relatedData: {
      orderId: order.id,
      customerId: customer.id,
      customerName: customer.name,
      orderTotal: order.total
    }
  });
  
  return result;
}
```

## Viewing Sent Emails in Admin Inbox

1. Open Admin Email Inbox
2. Navigate to "Sent" section
3. View all outgoing emails
4. Click email to see full content with proper formatting
5. Use search, star, snooze, or delete as needed

## Email Templates in Preview

The system automatically detects and styles different email types:

### Order Confirmation Template
- Shows order items in formatted table
- Displays order total and status
- Includes shipping information

### Order Status Template
- Status box with current state
- Timeline of status updates
- Tracking information

### Vendor Application Template
- Applicant information section
- Business details section
- Application status

## Best Practices

### 1. Use Proper Email Types
```javascript
// Good: Specific type for better organization
emailType: 'order_status'

// Avoid: Generic type when specific exists
emailType: 'general'
```

### 2. Include Related Data
```javascript
// Good: Rich context
relatedData: {
  orderId: 'ORD-123',
  customerId: 'CUST-456',
  customerName: 'John Doe',
  orderTotal: 5000,
  items: 3
}

// Avoid: Empty or minimal data
relatedData: {}
```

### 3. Use HTML Templates
```javascript
// Good: Use templates for consistency
const template = await getEmailTemplate('orderConfirmation');
const html = replaceTemplateVariables(template.html, data);

// Avoid: Building HTML manually
const html = '<h1>Order #' + orderId + '</h1>...';
```

### 4. Handle Errors Gracefully
```javascript
const result = await sendTransactionalEmail({...});

if (result.success) {
  console.log('Email sent:', result.messageId);
  // Store adminEmailId if needed
  await updateOrderRecord({
    adminEmailId: result.adminEmailId
  });
} else {
  console.error('Failed to send:', result.error);
  // Handle error
}
```

## Utilities Available

### Email Service Functions
```javascript
// Get emails by section
getEmailsBySection(section, limit)

// Search emails
searchAdminEmails(searchTerm)

// Sanitize HTML
sanitizeEmailContent(htmlContent)

// Detect template type
detectTemplateType(htmlContent)

// Extract text preview
extractTextPreview(htmlContent)

// Get sent emails
getSentEmails(limit)

// Email management
deleteAdminEmail(emailId)
toggleEmailStar(emailId, starred)
snoozeEmail(emailId, snoozeDate)
markEmailAsRead(emailId)
```

### Email Renderer Hook
```javascript
const renderer = useEmailRenderer(htmlContent);

// Properties:
renderer.safeHtml              // Sanitized HTML
renderer.isTemplate            // Is it a template?
renderer.templateType          // Detected type
renderer.preview               // Text preview
renderer.features              // hasImages, hasTables, linkCount, isEmpty
renderer.getTemplateStyles()   // Get CSS styles
renderer.render(options)       // Render with custom styles
renderer.needsApproval()       // Check if incomplete template
```

## Troubleshooting

### Email Not Appearing in Inbox
1. Check if `saveToAdminInbox: true` is set
2. Verify email data is complete (to, subject, htmlContent)
3. Check Firestore permissions for `admin_emails` collection
4. Check browser console for errors

### HTML Not Rendering Properly
1. Ensure HTML is valid
2. Check if content is being sanitized (remove problematic elements)
3. Verify inline CSS is being applied
4. Use browser DevTools to inspect rendered element

### Template Variables Not Being Replaced
1. Check variable names match template format `{{variableName}}`
2. Verify variables object contains the keys
3. Check for typos in variable names
4. Log the template before and after replacement

## Database Schema

The admin emails are stored in Firestore collection `admin_emails` with structure:

```javascript
{
  id: string,                    // Document ID
  to: string,                    // Recipient email
  from: string,                  // Sender email
  subject: string,               // Email subject
  htmlContent: string,           // Full HTML body
  type: string,                  // Email type
  relatedId: string,            // Related object ID
  relatedData: object,          // Additional context
  isRead: boolean,              // Read status
  isStarred: boolean,           // Starred status
  isDraft: boolean,             // Is draft?
  isSent: boolean,              // Is sent email?
  isSnoozed: boolean,           // Is snoozed?
  snoozeUntil: date,           // Snooze expiration
  labels: array,               // Email labels
  createdAt: timestamp,        // Creation date
  updatedAt: timestamp         // Last update
}
```

---

**Version**: 1.0  
**Last Updated**: December 2024  
**Status**: ✅ Production Ready
