// Theme configuration for the app

export const colors = {
  primary: '#10b981',      // Green
  primaryDark: '#059669',
  primaryLight: '#34d399',
  secondary: '#f59e0b',    // Orange
  success: '#10b981',
  warning: '#f97316',
  error: '#ef4444',
  info: '#3b82f6',
  
  background: '#f9fafb',
  surface: '#ffffff',
  
  textPrimary: '#111827',
  textSecondary: '#6b7280',
  textDisabled: '#9ca3af',
  
  border: '#e5e7eb',
  divider: '#f3f4f6',
  
  statusActive: '#10b981',
  statusInactive: '#ef4444',
  statusPending: '#f97316',
  statusCompleted: '#10b981',

  // Priority colors
  priorityHigh: '#ef4444',
  priorityMedium: '#f59e0b',
  priorityLow: '#10b981',

  // Status badges
  badgeGreen: '#d1fae5',
  badgeOrange: '#fed7aa',
  badgeRed: '#fee2e2',
  badgeBlue: '#dbeafe',
  badgeGray: '#f3f4f6',
};

export const typography = {
  h1: { fontSize: 32, fontWeight: 'bold' as const },
  h2: { fontSize: 24, fontWeight: 'bold' as const },
  h3: { fontSize: 20, fontWeight: '600' as const },
  h4: { fontSize: 18, fontWeight: '600' as const },
  body: { fontSize: 16, fontWeight: 'normal' as const },
  caption: { fontSize: 14, fontWeight: 'normal' as const },
  small: { fontSize: 12, fontWeight: 'normal' as const },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const borderRadius = {
  small: 8,
  medium: 12,
  large: 16,
  xl: 20,
  full: 9999,
};

export const shadows = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
};
