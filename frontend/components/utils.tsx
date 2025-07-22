export const lightTheme = {
  background: '#000000',
  text: '#0e0f0c',
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

export const lightColorCode = "#9fe870"

export const darkColorCode = "#163300"

export const googleBlue = "#4285F4"
export const googleRed = "#DB4437"
export const googleYellow = "#F4B400"
export const googleGreen = "#0F9D58"