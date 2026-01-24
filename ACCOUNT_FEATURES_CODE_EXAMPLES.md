# Code Examples & Usage Guide

## 🔧 Implementation Examples

### Example 1: How to Use the Profile Page

```javascript
// In your App.jsx or Router
import ProfilePage from './pages/ProfilePage';
import ProtectedRoute from './routes/ProtectedRoute';

<Routes>
  {/* ... other routes ... */}
  
  {/* Profile page - protected route */}
  <Route 
    path="/profile" 
    element={
      <ProtectedRoute>
        <ProfilePage />
      </ProtectedRoute>
    } 
  />
</Routes>
```

### Example 2: Accessing User Data in Components

```javascript
import { useAuth } from '../context/AuthContext';

function MyComponent() {
  const { user, userData } = useAuth();
  
  // userData contains all user info including preferences
  console.log(userData.preferences.theme); // 'light'
  console.log(userData.phone); // '+254712345678'
  console.log(userData.address); // '123 Main St'
  
  return (
    <div>
      <h1>Welcome, {userData?.displayName}</h1>
      <p>Theme: {userData?.preferences?.theme}</p>
    </div>
  );
}
```

### Example 3: Using Account Settings Data

```javascript
// Anywhere in your app
import { useAuth } from '../context/AuthContext';

function ShippingForm() {
  const { userData } = useAuth();
  
  // Pre-fill form with saved address
  const [address, setAddress] = useState(userData?.address || '');
  const [city, setCity] = useState(userData?.city || '');
  const [zipCode, setZipCode] = useState(userData?.zipCode || '');
  
  return (
    <form>
      <input value={address} onChange={e => setAddress(e.target.value)} />
      <input value={city} onChange={e => setCity(e.target.value)} />
      <input value={zipCode} onChange={e => setZipCode(e.target.value)} />
    </form>
  );
}
```

### Example 4: Checking User Preferences

```javascript
import { useAuth } from '../context/AuthContext';

function NotificationCenter() {
  const { userData } = useAuth();
  
  // Check if user wants newsletter emails
  if (userData?.preferences?.newsletter) {
    // Send newsletter email
  }
  
  // Check language preference
  if (userData?.preferences?.language === 'sw') {
    // Show Swahili content
  }
  
  // Check if recommendations should be shown
  if (userData?.preferences?.showRecommendations) {
    return <RecommendedProducts />;
  }
  
  return null;
}
```

### Example 5: Conditional Features Based on 2FA Status

```javascript
import { useAuth } from '../context/AuthContext';

function AccountSecurityStatus() {
  const { userData } = useAuth();
  
  return (
    <div>
      {userData?.twoFactorEnabled ? (
        <div className="security-badge secure">
          ✓ Two-Factor Authentication Enabled
        </div>
      ) : (
        <div className="security-badge warning">
          ⚠ Two-Factor Authentication Not Enabled
        </div>
      )}
    </div>
  );
}
```

---

## 📝 Database Query Examples

### Example 1: Query User Preferences

```javascript
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../services/firebase/config';

async function getUserPreferences(uid) {
  try {
    const userDocRef = doc(db, 'users', uid);
    const userDoc = await getDoc(userDocRef);
    
    if (userDoc.exists()) {
      return userDoc.data().preferences;
    }
  } catch (error) {
    console.error('Error fetching preferences:', error);
  }
}

// Usage
const prefs = await getUserPreferences(user.uid);
console.log(prefs.theme); // 'light' | 'dark' | 'auto'
```

### Example 2: Update User Address

```javascript
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../services/firebase/config';

async function updateUserAddress(uid, address, city, state, zipCode, country) {
  try {
    const userDocRef = doc(db, 'users', uid);
    await updateDoc(userDocRef, {
      address,
      city,
      state,
      zipCode,
      country,
      updatedAt: new Date().toISOString()
    });
    return { success: true };
  } catch (error) {
    console.error('Error updating address:', error);
    return { success: false, error };
  }
}

// Usage
await updateUserAddress(
  user.uid,
  '123 Main St',
  'Kisii',
  'Kisii County',
  '40200',
  'Kenya'
);
```

### Example 3: Get Active Sessions

```javascript
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../services/firebase/config';

async function getActiveSessions(uid) {
  try {
    const q = query(
      collection(db, 'sessions'),
      where('userId', '==', uid),
      where('active', '==', true)
    );
    
    const querySnapshot = await getDocs(q);
    const sessions = [];
    
    querySnapshot.forEach(doc => {
      sessions.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return sessions;
  } catch (error) {
    console.error('Error fetching sessions:', error);
    return [];
  }
}
```

---

## 🎨 UI Integration Examples

### Example 1: Add Profile Link to Header

```javascript
import { Link } from 'react-router-dom';
import { FiUser } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

function Header() {
  const { isAuthenticated, userData } = useAuth();
  
  return (
    <header>
      {isAuthenticated && (
        <Link to="/profile" className="profile-link">
          <FiUser size={20} />
          <span>{userData?.displayName}</span>
        </Link>
      )}
    </header>
  );
}
```

### Example 2: Display User Theme Preference

```javascript
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';

function ThemeProvider({ children }) {
  const { userData } = useAuth();
  
  useEffect(() => {
    const theme = userData?.preferences?.theme || 'light';
    
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (theme === 'light') {
      document.documentElement.classList.remove('dark');
    } else if (theme === 'auto') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        document.documentElement.classList.add('dark');
      }
    }
  }, [userData?.preferences?.theme]);
  
  return children;
}
```

### Example 3: Conditional Notification Banner

```javascript
import { useAuth } from '../context/AuthContext';
import { Alert } from './common/Alert';

function NotificationCenter() {
  const { userData } = useAuth();
  
  return (
    <div>
      {userData?.preferences?.emailNotifications && (
        <Alert 
          type="info" 
          message="Email notifications are enabled" 
        />
      )}
      
      {!userData?.twoFactorEnabled && (
        <Alert 
          type="warning" 
          message="Consider enabling 2FA for better security" 
        />
      )}
    </div>
  );
}
```

---

## 🔑 Firestore Security Rules (Recommended)

```javascript
// firestore.rules

rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // User documents - each user can only read/write their own
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
      
      // Allow public read of certain fields (optional)
      allow read: if request.auth.uid != null && {
        'displayName': true,
        'email': true,
        'photoURL': true
      }.keys().hasAll(request.query.select);
    }
    
    // Sessions collection
    match /sessions/{sessionId} {
      allow read, write: if request.auth.uid == resource.data.userId;
    }
  }
}
```

---

## 🧪 Testing Examples

### Example 1: Test Account Update

```javascript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AccountSettings from '../AccountSettings';

describe('AccountSettings', () => {
  test('should update user name', async () => {
    render(<AccountSettings />);
    
    const editButton = screen.getByText('Edit Information');
    fireEvent.click(editButton);
    
    const nameInput = screen.getByPlaceholderText('Enter your full name');
    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    
    const saveButton = screen.getByText('Save Changes');
    fireEvent.click(saveButton);
    
    await waitFor(() => {
      expect(screen.getByText('Account information updated successfully!')).toBeInTheDocument();
    });
  });
});
```

### Example 2: Test Password Strength

```javascript
import { render, screen, fireEvent } from '@testing-library/react';
import PasswordChange from '../PasswordChange';

describe('PasswordChange - Strength Indicator', () => {
  test('should show weak for 6 character password', () => {
    render(<PasswordChange />);
    
    const input = screen.getByPlaceholderText('Enter a new password');
    fireEvent.change(input, { target: { value: 'abc123' } });
    
    expect(screen.getByText('Very Weak')).toBeInTheDocument();
  });
  
  test('should show strong for complex password', () => {
    render(<PasswordChange />);
    
    const input = screen.getByPlaceholderText('Enter a new password');
    fireEvent.change(input, { target: { value: 'SecurePass123!@#' } });
    
    expect(screen.getByText('Strong')).toBeInTheDocument();
  });
});
```

---

## 🚀 Advanced Usage

### Example 1: Custom Hook for User Settings

```javascript
import { useAuth } from '../context/AuthContext';
import { useCallback } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../services/firebase/config';

export function useUserSettings() {
  const { user, userData } = useAuth();
  
  const updateSetting = useCallback(async (key, value) => {
    try {
      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, {
        [`preferences.${key}`]: value,
        updatedAt: new Date().toISOString()
      });
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  }, [user.uid]);
  
  const getSetting = useCallback((key, defaultValue) => {
    return userData?.preferences?.[key] ?? defaultValue;
  }, [userData]);
  
  return { updateSetting, getSetting };
}

// Usage
function MyComponent() {
  const { updateSetting, getSetting } = useUserSettings();
  
  const theme = getSetting('theme', 'light');
  
  const handleThemeChange = async () => {
    await updateSetting('theme', 'dark');
  };
  
  return <button onClick={handleThemeChange}>Change Theme</button>;
}
```

### Example 2: Batch Update Multiple Settings

```javascript
async function updateMultipleSettings(uid, updates) {
  const userDocRef = doc(db, 'users', uid);
  
  const updateObj = {
    updatedAt: new Date().toISOString()
  };
  
  // Flatten nested preferences
  Object.entries(updates).forEach(([key, value]) => {
    if (typeof value === 'object') {
      Object.entries(value).forEach(([subKey, subValue]) => {
        updateObj[`${key}.${subKey}`] = subValue;
      });
    } else {
      updateObj[key] = value;
    }
  });
  
  await updateDoc(userDocRef, updateObj);
}

// Usage
await updateMultipleSettings(user.uid, {
  displayName: 'John Doe',
  phone: '+254712345678',
  preferences: {
    theme: 'dark',
    language: 'sw',
    newsletter: true
  }
});
```

---

## 📊 Real-World Scenarios

### Scenario 1: E-commerce Checkout with Saved Address

```javascript
function CheckoutForm() {
  const { userData } = useAuth();
  const [useShipped, setUseSavedAddress] = useState(true);
  
  if (useShipped) {
    return (
      <div>
        <h3>Shipping Address</h3>
        <p>{userData.address}</p>
        <p>{userData.city}, {userData.state} {userData.zipCode}</p>
        <p>{userData.country}</p>
        <button onClick={() => setUseSavedAddress(false)}>
          Use Different Address
        </button>
      </div>
    );
  }
  
  return <AddressForm />;
}
```

### Scenario 2: Notification Preferences Control

```javascript
function NotificationSettings() {
  const { user, userData } = useAuth();
  const [prefs, setPrefs] = useState(userData?.preferences || {});
  
  const handleToggle = async (key) => {
    const updated = !prefs[key];
    setPrefs(prev => ({ ...prev, [key]: updated }));
    
    const userDocRef = doc(db, 'users', user.uid);
    await updateDoc(userDocRef, {
      [`preferences.${key}`]: updated
    });
  };
  
  return (
    <div>
      <label>
        <input
          type="checkbox"
          checked={prefs.emailNotifications}
          onChange={() => handleToggle('emailNotifications')}
        />
        Email Notifications
      </label>
    </div>
  );
}
```

### Scenario 3: Language-based Content Display

```javascript
function ProductDescription({ product }) {
  const { userData } = useAuth();
  const language = userData?.preferences?.language || 'en';
  
  const descriptions = {
    en: product.descriptionEn,
    sw: product.descriptionSw,
    es: product.descriptionEs
  };
  
  return <p>{descriptions[language]}</p>;
}
```

---

## 🔗 Related Documentation

- Firestore Documentation: https://firebase.google.com/docs/firestore
- React Icons: https://react-icons.github.io/react-icons/
- React Toastify: https://fkhadra.github.io/react-toastify/introduction
- Firebase Auth: https://firebase.google.com/docs/auth

---

## ✅ Checklist for Implementation

- [ ] All 5 files created successfully
- [ ] Route added to AppRoutes
- [ ] Dependencies installed (react-icons, react-toastify)
- [ ] Firestore security rules updated
- [ ] Tested account info editing
- [ ] Tested password change
- [ ] Tested preferences saving
- [ ] Tested 2FA enable/disable
- [ ] Verified responsive design
- [ ] Verified Firestore updates

---

**You're ready to go! Happy coding! 🎉**

