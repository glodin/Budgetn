import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define theme colors and properties
export const lightTheme: Theme = {
  primary: '#007AFF',
  background: '#F2F2F7',
  surface: '#FFFFFF',
  border: 'rgba(0,0,0,0.1)',
  shadowColor: '#000000',
  text: {
    primary: '#000000',
    secondary: '#666666',
  },
  statusBar: 'dark',
  shadow: '#000000',
};

export const darkTheme: Theme = {
  primary: '#0A84FF',
  background: '#000000',
  surface: '#1C1C1E',
  border: 'rgba(255,255,255,0.1)',
  shadowColor: '#FFFFFF',
  text: {
    primary: '#FFFFFF',
    secondary: '#EBEBF5',
  },
  statusBar: 'light',
  shadow: '#FFFFFF',
};

export type Theme = {
  primary: string;
  background: string;
  surface: string;
  border: string;
  shadowColor: string;
  text: {
    primary: string;
    secondary: string;
  };
  statusBar: 'light' | 'dark';
  shadow: string;
};

interface ThemeContextType {
  theme: Theme;
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = '@theme_preference';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDarkMode, setIsDark] = useState(false);

  // Load saved theme preference on mount
  useEffect(() => {
    loadThemePreference();
  }, []);

  // Load theme from AsyncStorage
  const loadThemePreference = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      if (savedTheme !== null) {
        setIsDark(savedTheme === 'dark');
      }
    } catch (error) {
      console.error('Error loading theme preference:', error);
    }
  };

  // Save theme preference
  const saveThemePreference = async (isDark: boolean) => {
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, isDark ? 'dark' : 'light');
    } catch (error) {
      console.error('Error saving theme preference:', error);
    }
  };

  // Toggle theme function
  const toggleTheme = useCallback(() => {
    setIsDark(prevIsDark => {
      const newIsDark = !prevIsDark;
      saveThemePreference(newIsDark);
      return newIsDark;
    });
  }, []);

  // Get current theme based on isDark state
  const theme = isDarkMode ? darkTheme : lightTheme;

  const value = {
    theme,
    isDarkMode,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

// Custom hook to use theme
export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
} 