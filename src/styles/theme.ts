import { createTheme, ThemeOptions } from '@mui/material/styles';

const tokens = {
  primary: {
    main: '#3a86ff',
    light: '#60a5fa',
    dark: '#1e429f',
    contrastText: '#ffffff',
  },
  secondary: {
    main: '#4ade80',
    light: '#86efac',
    dark: '#16a34a',
    contrastText: '#ffffff',
  },
  error: {
    main: '#ef4444',
    light: '#f87171',
    dark: '#b91c1c',
    contrastText: '#ffffff',
  },
  warning: {
    main: '#f59e0b',
    light: '#fbbf24',
    dark: '#d97706',
    contrastText: '#ffffff',
  },
  info: {
    main: '#0ea5e9',
    light: '#38bdf8',
    dark: '#0369a1',
    contrastText: '#ffffff',
  },
  success: {
    main: '#10b981',
    light: '#34d399',
    dark: '#059669',
    contrastText: '#ffffff',
  },
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
  },
};

export type ColorMode = 'light' | 'dark';
export type AccentColor = 'blue' | 'green' | 'purple' | 'orange' | 'teal';

// Base theme options
const getBaseTheme = (mode: ColorMode): ThemeOptions => ({
  palette: {
    mode,
    primary: tokens.primary,
    secondary: tokens.secondary,
    error: tokens.error,
    warning: tokens.warning,
    info: tokens.info,
    success: tokens.success,
    background: {
      default: mode === 'light' ? tokens.gray[100] : tokens.gray[900],
      paper: mode === 'light' ? '#ffffff' : tokens.gray[800],
    },
    text: {
      primary: mode === 'light' ? tokens.gray[900] : tokens.gray[100],
      secondary: mode === 'light' ? tokens.gray[600] : tokens.gray[400],
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
    },
    subtitle1: {
      fontSize: '1rem',
      fontWeight: 500,
    },
    subtitle2: {
      fontSize: '0.875rem',
      fontWeight: 500,
    },
    body1: {
      fontSize: '1rem',
    },
    body2: {
      fontSize: '0.875rem',
    },
    button: {
      fontWeight: 600,
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: 'none',
          padding: '8px 16px',
          '&:hover': {
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
          },
        },
        contained: {
          '&:hover': {
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.05)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.05)',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRight: 'none',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          },
        },
      },
    },
  },
});

// Function to update primary color
export const updateAccentColor = (theme: ThemeOptions, accent: AccentColor): ThemeOptions => {
  const accentColors = {
    blue: tokens.primary,
    green: tokens.success,
    purple: {
      main: '#8b5cf6',
      light: '#a78bfa',
      dark: '#6d28d9',
      contrastText: '#ffffff',
    },
    orange: {
      main: '#f97316',
      light: '#fb923c',
      dark: '#c2410c',
      contrastText: '#ffffff',
    },
    teal: {
      main: '#14b8a6',
      light: '#2dd4bf',
      dark: '#0f766e',
      contrastText: '#ffffff',
    },
  };

  return {
    ...theme,
    palette: {
      ...theme.palette,
      primary: accentColors[accent],
    },
  };
};

// Create theme with mode and accent color
export const createAppTheme = (mode: ColorMode, accent: AccentColor = 'blue') => {
  const baseTheme = getBaseTheme(mode);
  const themeWithAccent = updateAccentColor(baseTheme, accent);
  return createTheme(themeWithAccent);
};

// Default themes
export const lightTheme = createAppTheme('light');
export const darkTheme = createAppTheme('dark');

export default createAppTheme;