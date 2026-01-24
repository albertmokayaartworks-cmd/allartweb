# Vendor Application Email System - Code Examples

## How to Use the Email Service

### Example 1: Basic Usage - Triggering When Vendor Applies

This happens automatically when vendor submits application in VendorSignupForm.jsx:

```javascript
import { sendApplicationReceivedNotification } from '../../services/vendor/vendorService';

// When vendor submits form
const handleSubmit = async (e) => {
  // ... form submission logic ...
  
  // After successful application submission
  await sendApplicationReceivedNotification({
    userId: user.uid,
    email: user.email,
    businessName: formData.businessName,
    firstName: user.displayName || 'Vendor'
  }, applicationId);
  
  // Done! Email sent to admin automatically
};
```

### Example 2: View Admin Emails in Component

```javascript
import { getAdminEmails } from '../../services/email/adminEmailService';

export default function MyComponent() {
  const [emails, setEmails] = useState([]);
  
  useEffect(() => {
    const fetchEmails = async () => {
      const result = await getAdminEmails({
        type: 'vendor_application',
        limit: 50
      });
      
      if (result.success) {
        setEmails(result.emails);
        console.log('Emails:', result.emails);
      }
    };
    
    fetchEmails();
  }, []);
  
  return (
    <div>
      {emails.map(email => (
        <div key={email.id}>
          <h3>{email.subject}</h3>
          <p>From: {email.from}</p>
          <p>Read: {email.isRead ? 'Yes' : 'No'}</p>
        </div>
      ))}
    </div>
  );
}
```

### Example 3: Search Emails

```javascript
import { searchAdminEmails } from '../../services/email/adminEmailService';

const handleSearch = async (searchTerm) => {
  const result = await searchAdminEmails(searchTerm);
  
  if (result.success) {
    console.log('Found emails:', result.emails);
    setSearchResults(result.emails);
  } else {
    console.error('Search failed:', result.error);
  }
};
```

### Example 4: Mark Emails as Read

```javascript
import { 
  markEmailAsRead, 
  markEmailsAsRead 
} from '../../services/email/adminEmailService';

// Mark single email
const handleMarkRead = async (emailId) => {
  const result = await markEmailAsRead(emailId);
  if (result.success) {
    console.log('Email marked as read');
  }
};

// Mark multiple emails
const handleMarkAllRead = async (emailIds) => {
  const result = await markEmailsAsRead(emailIds);
  if (result.success) {
    console.log(`${emailIds.length} emails marked as read`);
  }
};
```

### Example 5: Delete Emails

```javascript
import { 
  deleteAdminEmail, 
  deleteAdminEmails 
} from '../../services/email/adminEmailService';

// Delete single email
const handleDeleteEmail = async (emailId) => {
  const result = await deleteAdminEmail(emailId);
  if (result.success) {
    console.log('Email deleted');
  }
};

// Delete multiple emails
const handleDeleteMultiple = async (emailIds) => {
  const result = await deleteAdminEmails(emailIds);
  if (result.success) {
    console.log(`${emailIds.length} emails deleted`);
  }
};
```

### Example 6: Get Email Statistics

```javascript
import { getEmailCountByType } from '../../services/email/adminEmailService';

const loadStats = async () => {
  const result = await getEmailCountByType();
  
  if (result.success) {
    console.log('Email statistics:');
    console.log('Total:', result.counts.total);
    console.log('Unread:', result.counts.unread);
    console.log('Vendor Apps:', result.counts.vendor_application);
    console.log('Orders:', result.counts.order);
  }
};
```

---

## Email Template Usage

### Using Default Template

The system automatically uses the default vendorApplication template from `defaultEmailTemplates.js`.

Template variables available:
```javascript
{
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  phone: '+254712345678',
  businessName: 'Tech Solutions',
  businessCategory: 'electronics',
  businessAddress: 'Nairobi, Kenya',
  businessDescription: 'We sell electronics',
  applicationId: 'app123',
  submittedDate: 'December 25, 2025, 10:30 AM',
  adminDashboardLink: 'https://yoursite.com/admin?tab=vendors'
}
```

### Custom Template in Firestore

Create a custom template in Firestore:

```javascript
// Firestore Document: emailTemplates/vendorApplication
{
  subject: "New Vendor Application - {{businessName}}",
  htmlContent: `
    <h1>New Vendor Application</h1>
    <p>Business: {{businessName}}</p>
    <p>From: {{email}}</p>
    <!-- Add your custom HTML here -->
    <a href="{{adminDashboardLink}}">Review Application</a>
  `
}
```

### Template Variable Replacement

```javascript
import { replaceTemplateVariables } from '../../services/email/brevoService';

const template = "Welcome {{firstName}}, your business {{businessName}} has been received!";
const variables = {
  firstName: 'John',
  businessName: 'Tech Solutions'
};

const result = replaceTemplateVariables(template, variables);
// Result: "Welcome John, your business Tech Solutions has been received!"
```

---

## Sending Emails Programmatically

### Send Email via Brevo

```javascript
import { sendTransactionalEmail } from '../../services/email/brevoService';

const sendCustomEmail = async () => {
  const result = await sendTransactionalEmail({
    email: 'recipient@example.com',
    subject: 'Important Notification',
    htmlContent: '<h1>Hello!</h1><p>This is a custom email.</p>',
    senderName: 'Aruviah',
    senderEmail: 'noreply@aruviah.com'
  });
  
  if (result.success) {
    console.log('Email sent:', result.messageId);
  }
};
```

### Send and Store in Admin Inbox

```javascript
import { sendTransactionalEmail } from '../../services/email/brevoService';
import { saveEmailToAdminInbox } from '../../services/email/adminEmailService';

const sendAndStore = async () => {
  const htmlContent = '<h1>New Application</h1>';
  
  // Send email
  const emailResult = await sendTransactionalEmail({
    email: 'admin@aruviah.com',
    subject: 'New Vendor Application',
    htmlContent
  });
  
  // Also store in admin inbox
  const inboxResult = await saveEmailToAdminInbox({
    to: 'admin@aruviah.com',
    from: 'vendor@example.com',
    subject: 'New Vendor Application',
    htmlContent,
    type: 'vendor_application',
    relatedId: 'app123',
    relatedData: {
      businessName: 'My Business',
      email: 'vendor@example.com'
    }
  });
  
  return {
    emailSent: emailResult.success,
    emailStored: inboxResult.success
  };
};
```

---

## Component Integration Examples

### Using in React Component

```javascript
import React, { useState, useEffect } from 'react';
import { getAdminEmails, markEmailAsRead } from '../../services/email/adminEmailService';

export function VendorEmailDashboard() {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    loadEmails();
  }, []);
  
  const loadEmails = async () => {
    setLoading(true);
    const result = await getAdminEmails({ 
      type: 'vendor_application',
      limit: 20 
    });
    
    if (result.success) {
      setEmails(result.emails);
    }
    setLoading(false);
  };
  
  const handleEmailClick = async (email) => {
    if (!email.isRead) {
      await markEmailAsRead(email.id);
      setEmails(emails.map(e => 
        e.id === email.id ? { ...e, isRead: true } : e
      ));
    }
  };
  
  if (loading) return <div>Loading emails...</div>;
  
  return (
    <div className="email-dashboard">
      <h2>Vendor Applications ({emails.length})</h2>
      
      {emails.map(email => (
        <div 
          key={email.id} 
          className={`email-item ${email.isRead ? '' : 'unread'}`}
          onClick={() => handleEmailClick(email)}
        >
          <h3>{email.subject}</h3>
          <p>From: {email.from}</p>
          <p>{new Date(email.createdAt).toLocaleDateString()}</p>
          
          {email.relatedData?.businessName && (
            <p>Business: {email.relatedData.businessName}</p>
          )}
        </div>
      ))}
    </div>
  );
}
```

### With Filtering

```javascript
import React, { useState, useEffect } from 'react';
import { getAdminEmails } from '../../services/email/adminEmailService';

export function FilteredEmailList() {
  const [emails, setEmails] = useState([]);
  const [filterType, setFilterType] = useState('all');
  
  useEffect(() => {
    loadEmails();
  }, [filterType]);
  
  const loadEmails = async () => {
    const type = filterType === 'all' ? undefined : filterType;
    const result = await getAdminEmails({ 
      type,
      limit: 50 
    });
    
    if (result.success) {
      setEmails(result.emails);
    }
  };
  
  return (
    <div>
      <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
        <option value="all">All Types</option>
        <option value="vendor_application">Vendor Applications</option>
        <option value="order">Orders</option>
        <option value="general">General</option>
      </select>
      
      <div>
        {emails.map(email => (
          <div key={email.id}>
            <h3>{email.subject}</h3>
            <p>Type: {email.type}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

## Error Handling

### Safe Error Handling

```javascript
import { getAdminEmails } from '../../services/email/adminEmailService';

const loadEmailsSafely = async () => {
  try {
    const result = await getAdminEmails({ 
      type: 'vendor_application' 
    });
    
    if (result.success) {
      console.log('Emails loaded:', result.emails);
      return result.emails;
    } else {
      console.error('Failed to load emails:', result.error);
      return [];
    }
  } catch (error) {
    console.error('Exception:', error);
    return [];
  }
};
```

### With User Feedback

```javascript
import { deleteAdminEmail } from '../../services/email/adminEmailService';
import { toast } from 'react-toastify';

const handleDelete = async (emailId) => {
  try {
    const result = await deleteAdminEmail(emailId);
    
    if (result.success) {
      toast.success('Email deleted successfully');
      // Update UI
    } else {
      toast.error(result.error || 'Failed to delete email');
    }
  } catch (error) {
    toast.error('Error deleting email: ' + error.message);
  }
};
```

---

## Firestore Query Examples

### Get All Vendor Application Emails

```javascript
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../services/firebase/config';

const getVendorAppEmails = async () => {
  const q = query(
    collection(db, 'admin_emails'),
    where('type', '==', 'vendor_application')
  );
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};
```

### Get Unread Emails

```javascript
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../services/firebase/config';

const getUnreadEmails = async () => {
  const q = query(
    collection(db, 'admin_emails'),
    where('isRead', '==', false)
  );
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};
```

---

## Testing Examples

### Test Vendor Application Email

```javascript
import { sendApplicationReceivedNotification } from '../../services/vendor/vendorService';

async function testVendorEmailFlow() {
  const testData = {
    userId: 'test-user-123',
    email: 'testvendor@example.com',
    businessName: 'Test Business',
    businessDescription: 'Test description',
    businessCategory: 'electronics',
    contactPhone: '+254712345678',
    businessAddress: 'Test Address',
    firstName: 'Test',
    lastName: 'Vendor'
  };
  
  const result = await sendApplicationReceivedNotification(testData, 'test-app-id');
  
  if (result.success) {
    console.log('✅ Email sent successfully');
  } else {
    console.error('❌ Email failed:', result.error);
  }
}

// Run test
testVendorEmailFlow();
```

---

## Debugging Tips

### Check if Email is in Firestore

```javascript
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../services/firebase/config';

const checkFirestore = async () => {
  const snapshot = await getDocs(collection(db, 'admin_emails'));
  
  console.log('Total emails in Firestore:', snapshot.size);
  
  snapshot.forEach(doc => {
    console.log('Email:', {
      id: doc.id,
      subject: doc.data().subject,
      type: doc.data().type,
      isRead: doc.data().isRead,
      createdAt: doc.data().createdAt?.toDate()
    });
  });
};

checkFirestore();
```

### Console Logging

```javascript
// In vendorService.js sendAdminVendorApplicationNotification()
console.log('📧 Sending admin notification...');
console.log('Admin email:', adminEmail);
console.log('Application ID:', applicationId);
console.log('Business name:', businessName);

const sendResult = await sendBrevEmail(emailPayload);
console.log('Brevo result:', sendResult);

const inboxResult = await saveEmailToAdminInbox({...});
console.log('Inbox storage result:', inboxResult);
```

---

## API Reference Summary

### adminEmailService.js Functions

```javascript
// Save email
saveEmailToAdminInbox(emailData) → { success, emailId }

// Get emails
getAdminEmails(filters) → { success, emails }

// Mark as read
markEmailAsRead(emailId) → { success }
markEmailsAsRead(emailIds) → { success }

// Delete
deleteAdminEmail(emailId) → { success }
deleteAdminEmails(emailIds) → { success }

// Statistics
getEmailCountByType() → { success, counts }

// Search
searchAdminEmails(searchTerm) → { success, emails }
```

---

**More examples and use cases available in the full documentation.**
