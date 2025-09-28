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
  saveTheme(newTheme);
}

/**
 * Save theme preference to localStorage with comprehensive error handling
 * @param theme - The theme to save
 */
function saveTheme(theme: Theme): void {
  // Validate input parameter
  if (theme !== 'dark' && theme !== 'light') {
    console.error(`Invalid theme parameter: "${theme}", must be 'dark' or 'light'`);
    return;
  }
  
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
    console.log(`Theme preference saved: ${theme}`);
  } catch (error) {
    console.error('Failed to save theme to localStorage:', error);
    
    // Provide specific error context
    if (error instanceof DOMException) {
      if (error.code === DOMException.QUOTA_EXCEEDED_ERR) {
        console.error('localStorage quota exceeded - unable to save theme preference');
      } else if (error.code === DOMException.SECURITY_ERR) {
        console.error('localStorage access denied - unable to save theme preference');
      }
    }
    
    // Continue execution - theme will still work for current session
    console.warn('Theme preference will not persist across page reloads');
  }
}

/**
 * Get the current theme from localStorage or return default
 * @returns The current theme ('dark' or 'light')
 */
export function getTheme(): Theme {
  try {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    
    // Validate stored value
    if (savedTheme === 'dark' || savedTheme === 'light') {
      return savedTheme;
    }
    
    // Log invalid stored value for debugging
    if (savedTheme !== null) {
      console.warn(`Invalid theme value in localStorage: "${savedTheme}", falling back to default`);
    }
  } catch (error) {
    console.error('Failed to read theme from localStorage:', error);
    // Log additional context for debugging
    console.error('localStorage may be unavailable or corrupted');
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