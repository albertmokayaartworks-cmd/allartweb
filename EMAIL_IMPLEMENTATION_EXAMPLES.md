# Email System - Implementation Examples

## Example 1: Send Order Status Email

```javascript
// In your order status update function
import { sendTransactionalEmail } from '../services/email/brevoService';
import { replaceTemplateVariables, getEmailTemplate } from '../services/email/brevoService';

async function updateOrderStatus(orderId, newStatus, customer) {
  try {
    // Get order status email template
    const template = await getEmailTemplate('orderStatus');
    
    // Prepare variables
    const variables = {
      customerName: customer.firstName,
      orderId: orderId,
      orderStatus: newStatus.charAt(0).toUpperCase() + newStatus.slice(1),
      statusDate: new Date().toLocaleDateString(),
      trackingNumber: customer.trackingNumber || 'Coming soon',
      estimatedDelivery: getEstimatedDeliveryDate(newStatus)
    };
    
    // Fill template
    const htmlContent = replaceTemplateVariables(template.html, variables);
    
    // Send email with automatic admin inbox save
    const result = await sendTransactionalEmail({
      email: customer.email,
      subject: `Your Order #${orderId} is ${newStatus}`,
      htmlContent,
      senderName: 'Aruviah Orders',
      senderEmail: process.env.REACT_APP_BREVO_SENDER_EMAIL,
      
      // Auto-save to admin inbox
      saveToAdminInbox: true,
      emailType: 'order_status',
      relatedData: {
        orderId,
        customerId: customer.id,
        customerName: customer.firstName + ' ' + customer.lastName,
        customerEmail: customer.email,
        status: newStatus,
        statusDate: new Date().toISOString()
      }
    });
    
    if (result.success) {
      console.log('✅ Status email sent:', result.messageId);
      console.log('📧 Saved to admin inbox:', result.adminEmailId);
      
      // Store admin email ID with order for reference
      await updateOrderInDatabase(orderId, {
        lastStatusEmailId: result.adminEmailId,
        lastStatusEmailTime: new Date()
      });
    } else {
      console.error('❌ Failed to send status email:', result.error);
    }
    
    return result;
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
}

function getEstimatedDeliveryDate(status) {
  const now = new Date();
  let days = 0;
  
  switch(status.toLowerCase()) {
    case 'processing':
      days = 2;
      break;
    case 'shipped':
      days = 5;
      break;
    case 'in transit':
      days = 3;
      break;
    case 'out for delivery':
      days = 1;
      break;
    default:
      return 'TBD';
  }
  
  const date = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
  return date.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
}
```

## Example 2: Send Vendor Application Received Email

```javascript
// In your vendor application handler
import { sendTransactionalEmail } from '../services/email/brevoService';
import { saveEmailToAdminInbox } from '../services/email/adminEmailService';

async function sendVendorApplicationConfirmation(application) {
  try {
    const { 
      email, 
      firstName, 
      lastName, 
      businessName,
      businessCategory,
      businessAddress,
      businessDescription,
      phone,
      applicationId
    } = application;
    
    // Create HTML email with custom styling
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                    color: white; padding: 30px; text-align: center;">
          <h1>Application Received</h1>
          <p style="margin: 0; font-size: 14px; opacity: 0.9;">We've received your vendor application</p>
        </div>
        
        <div style="padding: 30px; background: white; border: 1px solid #eee;">
          <p>Dear ${firstName},</p>
          
          <p>Thank you for applying to become a vendor on Aruviah. We have received your application and we are reviewing it.</p>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #667eea;">Application Details</h3>
            <p><strong>Application ID:</strong> ${applicationId}</p>
            <p><strong>Business Name:</strong> ${businessName}</p>
            <p><strong>Category:</strong> ${businessCategory}</p>
            <p><strong>Contact:</strong> ${phone}</p>
          </div>
          
          <p>We will review your application and contact you within 3-5 business days with a decision.</p>
          
          <p>
            <a href="https://aruviah.com/vendor/status/${applicationId}" 
               style="display: inline-block; background: #667eea; color: white; 
                      padding: 12px 30px; border-radius: 4px; text-decoration: none; 
                      font-weight: bold;">
              Check Application Status
            </a>
          </p>
          
          <p style="margin-top: 40px; color: #999; font-size: 12px;">
            <strong>Aruviah Team</strong><br>
            support@aruviah.com<br>
            +254 XXX XXX XXX
          </p>
        </div>
      </div>
    `;
    
    // Send to vendor
    const customerResult = await sendTransactionalEmail({
      email,
      subject: `Application Received - ${businessName}`,
      htmlContent,
      senderName: 'Aruviah Vendor Program',
      senderEmail: process.env.REACT_APP_BREVO_SENDER_EMAIL,
      saveToAdminInbox: true,
      emailType: 'vendor_application',
      relatedData: {
        applicationId,
        vendorName: `${firstName} ${lastName}`,
        vendorEmail: email,
        businessName,
        businessCategory,
        businessAddress,
        phone,
        applicationStatus: 'pending_review'
      }
    });
    
    // Also send notification to admin
    const adminEmailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px;">
        <h2>New Vendor Application</h2>
        
        <table style="width: 100%; border-collapse: collapse;">
          <tr style="background: #f5f5f5;">
            <td style="padding: 10px; font-weight: bold; border: 1px solid #ddd;">Name</td>
            <td style="padding: 10px; border: 1px solid #ddd;">${firstName} ${lastName}</td>
          </tr>
          <tr>
            <td style="padding: 10px; font-weight: bold; border: 1px solid #ddd;">Email</td>
            <td style="padding: 10px; border: 1px solid #ddd;">${email}</td>
          </tr>
          <tr style="background: #f5f5f5;">
            <td style="padding: 10px; font-weight: bold; border: 1px solid #ddd;">Business Name</td>
            <td style="padding: 10px; border: 1px solid #ddd;">${businessName}</td>
          </tr>
          <tr>
            <td style="padding: 10px; font-weight: bold; border: 1px solid #ddd;">Category</td>
            <td style="padding: 10px; border: 1px solid #ddd;">${businessCategory}</td>
          </tr>
          <tr style="background: #f5f5f5;">
            <td style="padding: 10px; font-weight: bold; border: 1px solid #ddd;">Address</td>
            <td style="padding: 10px; border: 1px solid #ddd;">${businessAddress}</td>
          </tr>
          <tr>
            <td style="padding: 10px; font-weight: bold; border: 1px solid #ddd;">Phone</td>
            <td style="padding: 10px; border: 1px solid #ddd;">${phone}</td>
          </tr>
          <tr style="background: #f5f5f5;">
            <td style="padding: 10px; font-weight: bold; border: 1px solid #ddd;">Description</td>
            <td style="padding: 10px; border: 1px solid #ddd;">${businessDescription}</td>
          </tr>
        </table>
        
        <p style="margin-top: 20px;">
          <a href="https://aruviah.com/admin/vendor-applications/${applicationId}" 
             style="display: inline-block; background: #4caf50; color: white; 
                    padding: 10px 20px; border-radius: 4px; text-decoration: none;">
            Review Application
          </a>
        </p>
      </div>
    `;
    
    // Save admin notification
    await saveEmailToAdminInbox({
      to: process.env.REACT_APP_ADMIN_EMAIL,
      from: 'noreply@aruviah.com',
      subject: `[VENDOR APP] ${businessName} - ${firstName} ${lastName}`,
      htmlContent: adminEmailContent,
      type: 'vendor_application',
      relatedData: {
        applicationId,
        vendorName: `${firstName} ${lastName}`,
        vendorEmail: email,
        businessName,
        applicationStatus: 'pending_review'
      },
      isSent: false // This is received, not sent
    });
    
    console.log('✅ Both emails sent successfully');
    return { success: true, customerEmailId: customerResult.adminEmailId };
  } catch (error) {
    console.error('Error sending application confirmation:', error);
    throw error;
  }
}
```

## Example 3: Email Preview Component

```javascript
// Component to display email in admin inbox
import React from 'react';
import { useEmailRenderer, extractEmailMetadata } from '../hooks/useEmailRenderer';
import { sanitizeEmailContent } from '../services/email/adminEmailService';

export function EmailPreviewModal({ email, onClose }) {
  const renderer = useEmailRenderer(email.htmlContent);
  const metadata = extractEmailMetadata(email.htmlContent);
  
  return (
    <div style={styles.modal}>
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>{email.subject}</h2>
          <div style={styles.meta}>
            <div>From: <strong>{email.from}</strong></div>
            <div>To: <strong>{email.to}</strong></div>
            <div>Date: {new Date(email.createdAt).toLocaleString()}</div>
            {email.type && <div>Type: <strong>{email.type}</strong></div>}
          </div>
        </div>
        <button onClick={onClose} style={styles.closeBtn}>✕</button>
      </div>
      
      <div style={styles.info}>
        <span>Words: {metadata.wordCount}</span>
        <span>Images: {metadata.imageCount}</span>
        <span>Links: {metadata.linkCount}</span>
        <span>Tables: {metadata.tableCount}</span>
        <span>Read time: ~{metadata.estimatedReadTime} min</span>
        {renderer.isTemplate && (
          <span style={styles.template}>Template: {renderer.templateType}</span>
        )}
      </div>
      
      <style>
        {renderer.getTemplateStyles()}
      </style>
      
      <div style={styles.content}>
        <div
          className="email-body"
          dangerouslySetInnerHTML={{ __html: renderer.safeHtml }}
        />
      </div>
    </div>
  );
}

const styles = {
  modal: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.5)',
    display: 'flex',
    flexDirection: 'column',
    zIndex: 1000
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: '20px',
    background: '#fff',
    borderBottom: '1px solid #eee'
  },
  title: {
    margin: '0 0 10px 0',
    fontSize: '20px',
    fontWeight: '600'
  },
  meta: {
    fontSize: '13px',
    color: '#666'
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    fontSize: '20px',
    cursor: 'pointer',
    color: '#999'
  },
  info: {
    display: 'flex',
    gap: '15px',
    padding: '10px 20px',
    background: '#f9f9f9',
    fontSize: '12px',
    color: '#666',
    borderBottom: '1px solid #eee',
    flexWrap: 'wrap'
  },
  template: {
    background: '#667eea',
    color: 'white',
    padding: '2px 8px',
    borderRadius: '3px'
  },
  content: {
    flex: 1,
    overflow: 'auto',
    padding: '20px',
    background: '#fff'
  }
};
```

## Example 4: Batch Send Order Confirmations

```javascript
// Send order confirmations to multiple customers
import { sendTransactionalEmail } from '../services/email/brevoService';
import { replaceTemplateVariables, getEmailTemplate } from '../services/email/brevoService';
import { batch } from 'firebase/firestore';

async function sendOrderConfirmationBatch(orders) {
  try {
    const template = await getEmailTemplate('orderConfirmation');
    const results = [];
    
    // Send emails in batches of 10 to avoid API rate limits
    for (let i = 0; i < orders.length; i += 10) {
      const batch = orders.slice(i, i + 10);
      
      const batchPromises = batch.map(order =>
        sendOrderConfirmationEmail(order, template)
      );
      
      const batchResults = await Promise.allSettled(batchPromises);
      results.push(...batchResults);
      
      // Wait 1 second between batches
      if (i + 10 < orders.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    // Summary
    const successful = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;
    
    console.log(`📧 Batch complete: ${successful} sent, ${failed} failed`);
    
    return {
      success: true,
      sent: successful,
      failed: failed,
      total: orders.length
    };
  } catch (error) {
    console.error('Batch send error:', error);
    throw error;
  }
}

async function sendOrderConfirmationEmail(order, template) {
  const variables = {
    customerName: order.customer.firstName,
    orderId: order.id,
    orderDate: new Date(order.createdAt).toLocaleDateString(),
    itemCount: order.items.length,
    orderTotal: `KES ${order.total.toLocaleString()}`,
    itemsList: order.items
      .map(item => `• ${item.name} (x${item.quantity}) - KES ${(item.price * item.quantity).toLocaleString()}`)
      .join('\n'),
    shippingAddress: formatAddress(order.shippingAddress),
    estimatedDelivery: addDays(new Date(), 5).toLocaleDateString()
  };
  
  const htmlContent = replaceTemplateVariables(template.html, variables);
  
  return sendTransactionalEmail({
    email: order.customer.email,
    subject: `Order Confirmation #${order.id}`,
    htmlContent,
    saveToAdminInbox: true,
    emailType: 'order',
    relatedData: {
      orderId: order.id,
      customerId: order.customer.id,
      customerName: `${order.customer.firstName} ${order.customer.lastName}`,
      customerEmail: order.customer.email,
      orderTotal: order.total,
      itemCount: order.items.length
    }
  });
}

function formatAddress(addr) {
  return `${addr.street}, ${addr.city}, ${addr.state} ${addr.zip}`;
}

function addDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}
```

## Example 5: Email Notification Service

```javascript
// Service to handle all email notifications
import { sendTransactionalEmail } from '../services/email/brevoService';
import { 
  replaceTemplateVariables, 
  getEmailTemplate 
} from '../services/email/brevoService';

export class EmailNotificationService {
  static async sendOrderNotification(order, type = 'confirmation') {
    const templateMap = {
      confirmation: 'orderConfirmation',
      shipped: 'orderShipped',
      delivered: 'orderDelivered',
      cancelled: 'orderCancelled'
    };
    
    const template = await getEmailTemplate(templateMap[type]);
    if (!template) throw new Error(`No template for ${type}`);
    
    const variables = this.prepareOrderVariables(order);
    const html = replaceTemplateVariables(template.html, variables);
    
    return sendTransactionalEmail({
      email: order.customer.email,
      subject: this.getSubject(type, order),
      htmlContent: html,
      saveToAdminInbox: true,
      emailType: type.includes('order') ? `order_${type}` : 'order',
      relatedData: {
        orderId: order.id,
        customerId: order.customer.id,
        type
      }
    });
  }
  
  static async sendVendorNotification(vendor, type = 'welcome') {
    const template = await getEmailTemplate(`vendor${type.charAt(0).toUpperCase() + type.slice(1)}`);
    if (!template) throw new Error(`No template for vendor ${type}`);
    
    const variables = {
      vendorName: vendor.businessName,
      contactName: vendor.firstName,
      vendorDashboard: `${process.env.REACT_APP_BASE_URL}/vendor/dashboard`
    };
    
    const html = replaceTemplateVariables(template.html, variables);
    
    return sendTransactionalEmail({
      email: vendor.email,
      subject: this.getVendorSubject(type),
      htmlContent: html,
      saveToAdminInbox: true,
      emailType: `vendor_${type}`,
      relatedData: {
        vendorId: vendor.id,
        vendorName: vendor.businessName,
        type
      }
    });
  }
  
  static prepareOrderVariables(order) {
    return {
      customerName: order.customer.firstName,
      orderId: order.id,
      orderDate: new Date(order.createdAt).toLocaleDateString(),
      items: order.items.map(i => `${i.name} (x${i.quantity})`).join(', '),
      orderTotal: `KES ${order.total.toLocaleString()}`,
      trackingNumber: order.tracking?.number || 'Coming soon'
    };
  }
  
  static getSubject(type, order) {
    const subjects = {
      confirmation: `Order Confirmation #${order.id}`,
      shipped: `Your Order #${order.id} Has Shipped!`,
      delivered: `Order #${order.id} Delivered`,
      cancelled: `Order #${order.id} Cancelled`
    };
    return subjects[type] || 'Order Update';
  }
  
  static getVendorSubject(type) {
    const subjects = {
      welcome: 'Welcome to Aruviah Vendor Program',
      approved: 'Your Vendor Application Approved',
      rejected: 'Vendor Application Status Update'
    };
    return subjects[type] || 'Vendor Notification';
  }
}

// Usage:
// await EmailNotificationService.sendOrderNotification(order, 'confirmation');
// await EmailNotificationService.sendVendorNotification(vendor, 'welcome');
```

---

These examples show how to integrate the email system into your application. All sent emails will automatically appear in the Admin Email Inbox with proper HTML rendering and categorization.
