# Order Confirmation System - Quick Reference

## How It Works Now

### From Vendor Dashboard
1. Vendor logs in and goes to "My Orders"
2. Sees pending orders with a "Confirm Order" button
3. Clicks "Confirm Order" → Status changes to "confirmed"
4. Next button appears: "Mark as Processing"
5. Vendor can proceed: Processing → Shipped → Completed
6. Customer gets email at each step
7. Admin dashboard updates automatically in real-time

### From Admin Dashboard
1. Admin logs in and goes to Orders
2. Can update ANY order to any status
3. Clicks status button (e.g., "Processing")
4. Status updates immediately
5. Customer gets email notification
6. Vendor dashboard updates automatically in real-time

## Status Flow

### Vendor View
```
Order Placed (pending)
    ↓
    [Confirm Order] ← Vendor confirms
    ↓
Confirmed Status
    ↓
    [Mark as Processing]
    ↓
Processing
    ↓
    [Mark as Shipped]
    ↓
Shipped
    ↓
    [Mark as Completed]
    ↓
Completed (Delivered)
```

### Admin View
```
Can change to any status:
- Pending
- Processing
- Shipped
- Completed
- Cancelled
- Returned
```

## Real-Time Synchronization

The system is **fully real-time**:
- Open vendor dashboard + admin dashboard
- Make change in one
- Other updates automatically (no refresh needed)
- Uses Firebase Firestore real-time listeners

## Email Notifications

Customer receives email when:
1. ✅ Order placed (pending)
2. ✅ Order confirmed by vendor (confirmed)
3. ✅ Order is being processed (processing)
4. ✅ Order shipped (shipped)
5. ✅ Order delivered (completed)
6. ✅ Order cancelled (cancelled)
7. ✅ Return processed (returned)

Email includes:
- Order number
- Status message
- Tracking number (if available)
- Link to order details

## Authorization

- **Vendor**: Can only update THEIR OWN orders (system validates vendorId)
- **Admin**: Can update ANY order
- **System**: Returns clear error if unauthorized

## Troubleshooting

### Order not updating
- Check browser console for errors
- Verify vendor owns the order (vendorId matches)
- Ensure internet connection is active
- Reload page if stuck

### Email not sent
- Check spam folder
- Verify customer email in order
- Check BREVO/email service status
- Review console logs for email service errors

### Real-time not working
- Refresh browser
- Check Firebase connection
- Verify database rules allow read access
- Check browser console for permission errors

## Status Code Reference

| Status | User See | Vendor See | Admin Can Set |
|--------|----------|-----------|---|
| pending | ✓ Waiting for vendor | ✓ Confirm/Reject | ✓ |
| confirmed | ✓ Confirmed | ✓ Processing | ✓ |
| processing | ✓ Being prepared | ✓ Shipped | ✓ |
| shipped | ✓ In transit | ✓ Delivered | ✓ |
| completed | ✓ Arrived | ✓ Done | ✓ |
| cancelled | ✓ Cancelled | ✓ - | ✓ |
| returned | ✓ Returned | ✓ - | ✓ |

## Backend Functions

### updateOrderStatus (Main Function)
```javascript
import { updateOrderStatus } from 'src/services/firebase/firestoreHelpers';

// Admin update (no vendorId)
await updateOrderStatus(orderId, 'shipped');

// Vendor update (with vendorId)
await updateOrderStatus(orderId, 'confirmed', vendorId);
```

Returns: `{ success: true/false, error: message }`

### Vendor updateOrderStatus (Wrapper)
```javascript
import { updateOrderStatus } from 'src/services/vendor/vendorService';

await updateOrderStatus(orderId, 'confirmed', user.uid);
```

## Testing Commands (Browser Console)

```javascript
// Check order status
db.collection('orders').doc('ORDER_ID').get().then(doc => console.log(doc.data()));

// Listen to order changes
db.collection('orders').doc('ORDER_ID').onSnapshot(doc => {
  console.log('Order status:', doc.data().status);
});
```

## Common Issues & Solutions

### "Unauthorized: This is not your order"
- Vendor is trying to update another vendor's order
- Check that vendorId in order matches current vendor's ID

### Order updates but email doesn't send
- Verify customer email exists in order
- Check BREVO API key in environment
- Check console for email service errors
- Verify email template exists in admin

### Status button disabled after click
- Normal - prevents double-clicking
- Button re-enables after status updates
- If stuck, refresh page

### Can't see confirmed status in admin
- Admin doesn't need confirmed status
- Vendor confirms first, then processing
- Both statuses are valid, each dashboard uses different workflow
