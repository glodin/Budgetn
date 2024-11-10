import React from 'react';
import { Switch } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

export function ThemeToggle() {
  const { theme, toggleTheme, isDarkMode } = useTheme();
  
  return (
    <Switch
      value={isDarkMode}
      onValueChange={toggleTheme}
      trackColor={{ false: '#767577', true: theme.primary }}
      thumbColor="#f4f3f4"
      ios_backgroundColor="#767577"
    />
  );
} 