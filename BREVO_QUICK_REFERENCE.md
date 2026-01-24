# ⚡ Brevo Email Automation - Quick Reference Card

## Setup (Do This First!)

```bash
# 1. Create account at https://www.brevo.com
# 2. Get API Key from: Account → SMTP & API
# 3. Create sender at: Account → Senders
# 4. Add to .env file:

REACT_APP_BREVO_API_KEY=paste_your_key_here
REACT_APP_BREVO_SENDER_EMAIL=orders@yourdomain.com
REACT_APP_BREVO_NEWSLETTER_LIST_ID=3
REACT_APP_BASE_URL=http://localhost:3000

# 5. Restart React app
# 6. Test!
```

---

## Automated Workflows

| Event | When | Email | Status |
|-------|------|-------|--------|
| Account Creation | User signs up | Welcome email | ✅ Active |
| Order Placed | Checkout complete | Order confirmation | ✅ Active |
| Order Status | Admin updates | Status update | ✅ Active |
| Newsletter | User subscribes | Confirmation | ✅ Active |
| Promo Campaign | Manual trigger | Promotional | ✅ Available |
| Abandoned Cart | Manual trigger | Reminder | ✅ Available |

---

## Email Functions

### Import
```javascript
import {
  sendAccountConfirmationEmail,
  sendOrderConfirmation,
  sendOrderStatusUpdate,
  registerForNewsletter,
  sendPromotionalEmail,
  sendAbandonedCartEmail
} from '../services/email/emailAutomation';
```

### Usage Examples

**Welcome Email**
```javascript
await sendAccountConfirmationEmail(email, 'John Doe');
```

**Order Confirmation**
```javascript
const orderData = {
  id: orderId,
  items: cartItems,
  total: 5000,
  createdAt: new Date().toISOString()
};
await sendOrderConfirmation(email, orderData);
```

**Order Status Update**
```javascript
const orderData = {
  id: orderId,
  status: 'shipped', // pending, processing, shipped, completed
  trackingNumber: 'ABC123' // optional
};
await sendOrderStatusUpdate(email, orderData);
```

**Newsletter Signup**
```javascript
await registerForNewsletter(email, 'John Doe');
```

**Promotional Email**
```javascript
const promo = {
  title: 'Summer Sale!',
  message: 'Get 50% off selected items',
  subject: 'Exclusive Offer Just For You',
  products: [
    { name: 'Product 1', price: 5000, discount: 50 },
    { name: 'Product 2', price: 3000, discount: 30 }
  ],
  expiryDate: '2025-12-31'
};
await sendPromotionalEmail(email, promo);
```

**Abandoned Cart**
```javascript
const items = [
  { name: 'Product', price: 5000, quantity: 2 },
  { name: 'Another', price: 3000, quantity: 1 }
];
await sendAbandonedCartEmail(email, items, 13000);
```

---

## File Locations

```
Email Functions
├── src/services/email/brevoService.js
│   └── Low-level API (sendTransactionalEmail, etc)
└── src/services/email/emailAutomation.js
    └── High-level workflows (sendOrderConfirmation, etc)

Auto-Triggered From
├── src/context/AuthContext.jsx (welcome email)
├── src/pages/CheckoutPage.jsx (order confirmation)
└── src/services/firebase/firestoreHelpers.js (status updates)

User Preferences
└── src/components/user/Profile/PreferencesSettings.jsx (newsletter)
```

---

## Testing

```javascript
// Test 1: Create Account
// Go to /signup → Create account → Check inbox

// Test 2: Place Order
// Go to /products → Add to cart → Checkout → Check inbox

// Test 3: Update Order Status
// Go to /admin → Orders tab → Change status → Check inbox

// Test 4: Subscribe Newsletter
// Go to /profile → Preferences → Toggle newsletter → Check inbox
```

---

## Verify in Brevo Dashboard

```
1. Login to https://app.brevo.com
2. Go to Transactional → Logs
3. Search for email address
4. Check Status: ✅ Success or ❌ Failed
5. If failed, click email to see error
```

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Emails not sent | Check API key in `.env` and restart app |
| Email to spam | Verify sender domain in Brevo |
| High bounce rate | Remove invalid emails from list |
| CORS error | Make sure `REACT_APP_BASE_URL` is set |
| Rate limit | Use Brevo paid plan for more sends |

---

## Common Errors

**"Brevo API error: Unauthorized"**
- Check API key is correct in `.env`
- Make sure you copied the full key

**"Sender not authenticated"**
- Go to Brevo → Senders → Verify sender email
- Click verification link sent to email

**"Email address is invalid"**
- Check email format is correct
- Make sure email is not blocked

---

## Email Status Codes

| Status | Meaning | Action |
|--------|---------|--------|
| Success | Email sent | ✅ No action |
| Bounce | Recipient not found | ❌ Remove from list |
| Complaint | Marked as spam | ❌ Stop sending |
| Deferred | Temporary issue | 🔄 Brevo retries |

---

## Production Checklist

- [ ] Brevo account created
- [ ] API key saved securely
- [ ] Sender domain verified
- [ ] All 6 email types tested
- [ ] Bounce handling implemented
- [ ] Unsubscribe links working
- [ ] Monitor metrics weekly
- [ ] Backup email service set up

---

## Useful Links

- **Brevo Dashboard:** https://app.brevo.com
- **API Docs:** https://developers.brevo.com
- **Setup Guide:** `BREVO_AUTOMATION_SETUP.md`
- **Full Guide:** `BREVO_INTEGRATION_GUIDE.md`

---

## Quick Commands

```bash
# Check API key is set
echo $REACT_APP_BREVO_API_KEY

# View environment variables
npm run env

# Test specific function
node -e "const brevo = require('./src/services/email/brevoService'); brevo.sendTransactionalEmail({email: 'test@example.com', subject: 'Test', htmlContent: '<p>Test</p>'})"
```

---

## Support

- Email: support@brevo.com
- Docs: https://developers.brevo.com/docs
- Dashboard: https://app.brevo.com

---

**Last Updated:** December 24, 2025  
**Version:** 1.0 - Production Ready
