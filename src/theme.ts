/**
 * Theme management system for Z-Survive website
 * Handles dark/light theme switching with localStorage persistence
 */

export type Theme = 'dark' | 'light';

const THEME_STORAGE_KEY = 'theme';
const DEFAULT_THEME: Theme = 'dark';

/**
 * Set the theme by updating the data-theme attribute on document element
 * @param theme - The theme to apply ('dark' or 'light')
 */
export function setTheme(theme: Theme): void {
  document.documentElement.setAttribute('data-theme', theme);
}

/**
 * Toggle between dark and light themes
 * Switches from current theme to the opposite theme
 */
export function toggleTheme(): void {
  const currentTheme = getTheme();
  const newTheme: Theme = currentTheme === 'dark' ? 'light' : 'dark';
  
  setTheme(newTheme);
  
  // Save the new theme to localStorage
  try {
    localStorage.setItem(THEME_STORAGE_KEY, newTheme);
  } catch (error) {
    console.warn('Failed to save theme to localStorage:', error);
  }
}

/**
 * Get the current theme from localStorage or return default
 * @returns The current theme ('dark' or 'light')
 */
export function getTheme(): Theme {
  try {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    if (savedTheme === 'dark' || savedTheme === 'light') {
      return savedTheme;
    }
  } catch (error) {
    console.warn('Failed to read theme from localStorage:', error);
  }
  
  return DEFAULT_THEME;
}

/**
 * Initialize the theme system by applying the saved theme on page load
 * Should be called when the application starts
 */
export function initTheme(): void {
  const theme = getTheme();
  setTheme(theme);
}