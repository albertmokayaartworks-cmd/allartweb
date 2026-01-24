import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../services/firebase/config';

const SETTINGS_DOC = 'settings';
const SETTINGS_ID = 'branding';

export const useLogoSettings = () => {
  const [logo, setLogo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch logo from Firestore
  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const docRef = doc(db, SETTINGS_DOC, SETTINGS_ID);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists() && docSnap.data().logoUrl) {
          setLogo(docSnap.data().logoUrl);
        } else {
          // Default to public logo if not found
          setLogo('/logo.png');
        }
      } catch (err) {
        console.error('Error fetching logo:', err);
        setError(err);
        setLogo('/logo.png'); // Fallback
      } finally {
        setLoading(false);
      }
    };

    fetchLogo();
  }, []);

  // Update logo URL in Firestore
  const updateLogo = async (logoUrl) => {
    try {
      const docRef = doc(db, SETTINGS_DOC, SETTINGS_ID);
      await setDoc(docRef, { logoUrl }, { merge: true });
      setLogo(logoUrl);
      return { success: true };
    } catch (err) {
      console.error('Error updating logo:', err);
      setError(err);
      return { success: false, error: err.message };
    }
  };

  return {
    logo,
    loading,
    error,
    updateLogo
  };
};
