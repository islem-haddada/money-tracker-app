import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';

type ThemeContextType = {
  isDarkMode: boolean;
  toggleTheme: (value: boolean) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_KEY = 'app_theme';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(systemColorScheme === 'dark');

  useEffect(() => {
    (async () => {
      const savedTheme = await AsyncStorage.getItem(THEME_KEY);
      if (savedTheme !== null) {
        setIsDarkMode(savedTheme === 'dark');
      }
    })();
  }, []);

  const toggleTheme = async (value: boolean) => {
    setIsDarkMode(value);
    await AsyncStorage.setItem(THEME_KEY, value ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useAppTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useAppTheme must be used within ThemeProvider');
  return context;
};
