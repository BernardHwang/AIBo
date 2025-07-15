import React, { createContext, useContext, useState } from 'react';
import { useColorScheme } from 'react-native';
import { darkTheme, lightTheme, ThemeContextType } from './utils';

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: any) {
  const [mode, setMode] = useState<'light' | 'dark'>('dark'); // ✅ default dark

  const toggleTheme = () => {
    setMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const theme = mode === 'light' ? lightTheme : darkTheme;

  return (
    <ThemeContext.Provider value={{ theme, mode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useAppTheme = () => useContext(ThemeContext);
