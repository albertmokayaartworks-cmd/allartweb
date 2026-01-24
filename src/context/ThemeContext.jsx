// src/context/ThemeContext.jsx

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const { userData } = useAuth();
  const [theme, setTheme] = useState('light');
  const [mounted, setMounted] = useState(false);

  // Load theme preference from user data or system preference
  useEffect(() => {
    if (!mounted) {
      setMounted(true);
      return;
    }

    let currentTheme = 'light';

    // Get user's theme preference or use system preference
    if (userData?.preferences?.theme) {
      if (userData.preferences.theme === 'auto') {
        // Check system preference
        currentTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light';
      } else {
        currentTheme = userData.preferences.theme;
      }
    } else {
      // Check system preference as fallback
      currentTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
    }

    setTheme(currentTheme);
    applyTheme(currentTheme);
  }, [userData?.preferences?.theme, mounted]);

  // Apply theme to document
  const applyTheme = (themeValue) => {
    const htmlElement = document.documentElement;
    
    if (themeValue === 'dark') {
      htmlElement.classList.add('dark');
    } else {
      htmlElement.classList.remove('dark');
    }
  };

  // Listen for system theme changes when in 'auto' mode
  useEffect(() => {
    if (userData?.preferences?.theme !== 'auto') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e) => {
      const newTheme = e.matches ? 'dark' : 'light';
      setTheme(newTheme);
      applyTheme(newTheme);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [userData?.preferences?.theme]);

  const value = {
    theme,
    isDark: theme === 'dark',
    isLight: theme === 'light'
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;
