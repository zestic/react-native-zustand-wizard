export const colors = {
  // Primary colors
  primary: '#007AFF',
  primaryDark: '#0062CC',
  primaryLight: '#E6F2FF',

  // Secondary colors
  secondary: '#4CAF50',
  secondaryDark: '#388E3C',
  secondaryLight: '#C8E6C9',

  // Accent colors
  accent: '#2196F3',
  accentDark: '#1976D2',
  accentLight: '#BBDEFB',

  // Status colors
  success: '#4CAF50',
  error: '#FF3B30',
  warning: '#FF9500',
  info: '#2196F3',

  // Grayscale
  white: '#FFFFFF',
  gray100: '#F8F8F8',
  gray200: '#F0F0F0',
  gray300: '#E0E0E0',
  gray400: '#CCCCCC',
  gray500: '#999999',
  gray600: '#666666',
  gray700: '#444444',
  gray800: '#222222',
  black: '#000000',

  // Transparent
  transparent: 'transparent',
} as const;

export type ColorName = keyof typeof colors;

export const getColor = (name: ColorName): string => colors[name];
