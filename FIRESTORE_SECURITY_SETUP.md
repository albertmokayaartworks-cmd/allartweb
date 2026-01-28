# Firestore Security Rules & Admin Setup Guide

## Overview

This guide explains how to properly set up Firestore security rules and configure admin users so they can approve vendor applications and manage the platform.

---

## Part 1: Firestore Security Rules

### What's Included

The `firestore.rules` file contains comprehensive security rules for your application covering:
- **Public Collections**: Products, Categories (readable by all)
- **User Collections**: Users (own data readable/writable, admin can manage all)
- **Vendor System**: Applications and products (proper admin/vendor access)
- **Orders**: Users see their own, admins see all
- **Emails & Notifications**: Admin-only and user-specific
- **Settings**: Public read, admin write

### How to Deploy Rules

#### Option 1: Using Firebase CLI (Recommended)

```bash
# Install Firebase CLI if not already installed
npm install -g firebase-tools

# Login to Firebase
firebase login

# Deploy rules
firebase deploy --only firestore:rules
```

#### Option 2: Using Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Go to **Firestore Database** → **Rules** tab
4. Copy the contents of `firestore.rules` file
5. Paste into the editor
6. Click **Publish**

### Key Rules for Vendor System

```javascript
// Vendor Applications - users can read their own, admins can read/write all
match /vendor_applications/{appId} {
  allow read: if isAuth() && (resource.data.userId == userId() || isAdmin());
  allow create: if isAuth();
  allow update, delete: if isAdmin();
}

// Users - own data readable/writable, admin can read all and update
match /users/{uid} {
  allow read: if isAuth() && (userId() == uid || isAdmin());
  allow write: if isAuth() && userId() == uid;
  allow update: if isAdmin();
}
```

---

## Part 2: Making a User an Admin

### Method 1: Firebase Console (Easiest)

1. **Go to Firestore**:
   - Open [Firebase Console](https://console.firebase.google.com)
   - Select your project
   - Go to **Firestore Database**

2. **Navigate to Users Collection**:
   - Click on `users` collection
   - Find the user document you want to make admin
   - Click to open the document

3. **Update the User**:
   - Click **Edit** (pencil icon)
   - Find the `isAdmin` field
   - Change value from `false` to `true`
   - Add `role` field with value `'admin'` if not present
   - Click **Save**

### Method 2: Using Firestore Script (Advanced)

Create a file `src/utils/adminSetup.js`:

```javascript
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../services/firebase/config';

/**
 * Make a user an admin (Use carefully!)
 * @param {string} userId - The user ID to make admin
 * @returns {Promise<Object>} - { success, error }
 */
export const makeUserAdmin = async (userId) => {
  try {
    const userRef = doc(db, 'users', userId);
    
    await updateDoc(userRef, {
      isAdmin: true,
      role: 'admin'
    });

    console.log('✅ User is now an admin:', userId);
    return { success: true };
  } catch (error) {
    console.error('❌ Error making user admin:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Remove admin privileges from a user
 * @param {string} userId - The user ID to remove admin from
 * @returns {Promise<Object>} - { success, error }
 */
export const removeAdminRole = async (userId) => {
  try {
    const userRef = doc(db, 'users', userId);
    
    await updateDoc(userRef, {
      isAdmin: false,
      role: 'customer'
    });

    console.log('✅ Admin privileges removed from user:', userId);
    return { success: true };
  } catch (error) {
    console.error('❌ Error removing admin role:', error);
    return { success: false, error: error.message };
  }
};
```

Then use in a React component (for testing only):

```javascript
import { makeUserAdmin } from '../utils/adminSetup';

// In your component
const handleMakeAdmin = async () => {
  const result = await makeUserAdmin('user-id-here');
  if (result.success) {
    console.log('Admin created!');
  }
};
```

### Method 3: Bulk Update Script

To make multiple users admins, create `scripts/makeAdmins.js` in your backend:

```javascript
// This would run via Node.js/Firebase Admin SDK
const admin = require('firebase-admin');

// Initialize Firebase Admin
const serviceAccount = require('./firebase-key.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

async function makeUsersAdmins(userIds) {
  const batch = db.batch();
  
  userIds.forEach(userId => {
    const userRef = db.collection('users').doc(userId);
    batch.update(userRef, {
      isAdmin: true,
      role: 'admin'
    });
  });
  
  await batch.commit();
  console.log(`✅ Made ${userIds.length} users admins`);
}

// Usage
makeUsersAdmins(['user-id-1', 'user-id-2', 'user-id-3']);
```

---

## Part 3: Testing the Setup

### Verify Admin Can See Vendor Applications

1. **Log in as Admin**:
   - Use the admin user's credentials
   - Navigate to admin dashboard

2. **Check Settings**:
   - Click **Settings** in sidebar
   - Click **Vendor Apps** tab
   - Should see all pending vendor applications

3. **Test Approval**:
   - Click **Approve** on a vendor application
   - Confirm in browser console: no permission errors
   - User document should update with `isVendor: true`

### Verify Normal Users Cannot Approve

1. **Log in as Regular User**:
   - Use a non-admin account
   - Should NOT see vendor applications in settings
   - Trying to access directly should fail silently

### Check Browser Console

When admin performs actions, you should see:

```
✅ Approved vendor application: app-123
```

NOT:

```
❌ Error approving application: PERMISSION_DENIED
```

---

## Part 4: Firestore Rules Explained

### Key Components

#### 1. Helper Functions
```javascript
function isAdmin() {
  return request.auth != null && 
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.get('isAdmin', false) == true;
}
```

**What it does**: Checks if the authenticated user has `isAdmin: true` in their Firestore user document.

#### 2. Vendor Applications Access
```javascript
match /vendor_applications/{appId} {
  allow read: if isAuth() && (resource.data.userId == userId() || isAdmin());
  allow update, delete: if isAdmin();
}
```

**What it allows**:
- Any authenticated user can read their own application
- Admins can read ALL applications
- Only admins can update/delete applications

#### 3. User Document Updates
```javascript
match /users/{uid} {
  allow update: if isAdmin();
}
```

**What it allows**:
- Only admins can update user documents (setting `isVendor`, `role`, etc.)

---

## Part 5: Troubleshooting

### Issue: "Admin can't see vendor applications"

**Cause**: User doesn't have `isAdmin: true` in Firestore

**Solution**:
1. Go to Firebase Console
2. Find user in `users` collection
3. Add/update `isAdmin` field to `true`
4. Refresh admin dashboard

### Issue: "Admin can't approve vendors - Permission Denied"

**Cause**: 
- Rules not deployed yet
- User is not marked as admin
- Rule syntax error

**Solution**:
1. Verify `isAdmin: true` in user document
2. Redeploy rules: `firebase deploy --only firestore:rules`
3. Clear browser cache: Ctrl+Shift+Delete
4. Check browser console for specific error

### Issue: "Vendor applications list is empty"

**Cause**: 
- No applications exist yet
- Rules prevent access
- Applications in different collection

**Solution**:
1. Submit test vendor application
2. Check Firestore console for `vendor_applications` collection
3. Verify admin has read access to that collection
4. Check that documents have correct structure

---

## Part 6: Security Best Practices

### ✅ DO:

1. **Be selective with admin rights**:
   - Only make trusted users admins
   - Review who has admin access regularly

2. **Monitor with Firebase Security Insights**:
   - Firebase Console → Security Rules
   - Review security warnings

3. **Test rules in Sandbox Mode First**:
   - Deploy with `rules_version = '2'`
   - Test with real user IDs

4. **Keep rules updated**:
   - Review when adding new collections
   - Update when changing user roles

### ❌ DON'T:

1. **Don't use overly permissive rules**:
   ```javascript
   // BAD ❌
   allow read, write: if true;
   
   // GOOD ✅
   allow read: if isAuth() && (userId() == uid || isAdmin());
   ```

2. **Don't store sensitive data without protection**:
   - Payment info should be admin-only
   - Personal data should be user-private

3. **Don't forget to test**:
   - Always test with Firestore emulator
   - Test with different user roles

---

## Quick Reference

### Files Created
- `firestore.rules` - Security rules file

### Key Firestore Collections
- `users` - User profiles with `isAdmin` flag
- `vendor_applications` - Vendor signup applications
- `admin_emails` - Email inbox for admins

### Key User Fields
```javascript
{
  uid: "user-id",
  email: "user@example.com",
  isAdmin: true,      // Controls admin access
  role: "admin",      // "admin", "vendor", "customer"
  isVendor: false,    // Controls vendor dashboard access
  // ... other fields
}
```

### Useful Firebase CLI Commands

```bash
# Deploy only rules
firebase deploy --only firestore:rules

# Test rules locally
firebase emulators:start

# View deployed rules
firebase firestore:indexes

# Export data
firebase firestore:export ./backup
```

---

## Summary

1. ✅ **Deploy `firestore.rules`** to Firebase
2. ✅ **Make at least one user an admin** via Firebase Console
3. ✅ **Test vendor application workflow**
4. ✅ **Monitor for permission errors** in browser console
5. ✅ **Secure your admin accounts** - they control the platform

Once these steps are complete, your admin should be able to:
- View all vendor applications
- Approve vendors (updating both vendor_applications and users collections)
- Reject vendors with reasons
- Manage all platform settings

---

**Status**: Ready for deployment  
**Last Updated**: January 28, 2026
