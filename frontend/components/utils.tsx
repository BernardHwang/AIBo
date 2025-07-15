export const lightTheme = {
  background: '#f2f2f2',
  text: '#000000',
};

export const darkTheme = {
  background: '#1c1c1c',
  text: '#ffffff',
};

export type ThemeContextType = {
  theme: typeof lightTheme;
  mode: 'light' | 'dark';
  toggleTheme: () => void;
};