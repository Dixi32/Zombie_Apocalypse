/**
 * Main application bootstrap for Z-Survive website
 * Initializes all systems and coordinates between router, i18n, theme, and pages modules
 */

import { initRouter, getCurrentRoute } from './router.js';
import { initI18n, getLanguage, setLanguage, getText, Language } from './i18n.js';
import { initTheme, toggleTheme, getTheme } from './theme.js';
import { render } from './pages.js';

// Application state
let currentLanguage: Language;

/**
 * Test localStorage availability and functionality
 * @returns true if localStorage is available and working, false otherwise
 */
function testLocalStorage(): boolean {
  try {
    const testKey = '__z_survive_test__';
    const testValue = 'test';
    
    // Test write
    localStorage.setItem(testKey, testValue);
    
    // Test read
    const retrieved = localStorage.getItem(testKey);
    
    // Test delete
    localStorage.removeItem(testKey);
    
    // Verify the test worked
    if (retrieved === testValue) {
      return true;
    } else {
      console.warn('localStorage test failed: retrieved value does not match');
      return false;
    }
  } catch (error) {
    console.error('localStorage is not available:', error);
    
    if (error instanceof DOMException) {
      if (error.code === DOMException.SECURITY_ERR) {
        console.error('localStorage access denied (security error)');
      } else if (error.code === DOMException.QUOTA_EXCEEDED_ERR) {
        console.error('localStorage quota exceeded');
      }
    }
    
    return false;
  }
}

/**
 * Handle route changes by updating the view and navigation highlighting
 */
function handleRouteChange(): void {
  try {
    const currentRoute = getCurrentRoute();
    updateView();
    updateActiveNavigation(currentRoute);
  } catch (error) {
    console.error('Error handling route change:', error);
  }
}

/**
 * Re-render the current view with the selected language
 */
function updateView(): void {
  try {
    const currentRoute = getCurrentRoute();
    const appContainer = document.getElementById('app');
    
    if (!appContainer) {
      console.error('App container not found');
      return;
    }
    
    // Render the current route with current language
    const content = render(currentRoute, currentLanguage);
    appContainer.innerHTML = content;
  } catch (error) {
    console.error('Error updating view:', error);
    // Show error message to user
    const appContainer = document.getElementById('app');
    if (appContainer) {
      appContainer.innerHTML = `
        <div class="page-content">
          <header class="page-header">
            <h1>Error</h1>
            <p>Sorry, there was an error loading this page. Please try again.</p>
          </header>
        </div>
      `;
    }
  }
}

/**
 * Update active navigation highlighting based on current route
 */
function updateActiveNavigation(route: string): void {
  try {
    // Remove active class from all nav links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => link.classList.remove('active'));
    
    // Add active class to current route link
    const activeLink = document.querySelector(`[data-route="${route}"]`);
    if (activeLink) {
      activeLink.classList.add('active');
    }
  } catch (error) {
    console.error('Error updating navigation:', error);
  }
}

/**
 * Update navigation text based on current language
 */
function updateNavigationText(): void {
  try {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      const route = link.getAttribute('data-route');
      if (route) {
        let textKey: string;
        switch (route) {
          case 'home':
            textKey = 'nav_home';
            break;
          case 'guides':
            textKey = 'nav_guides';
            break;
          case 'entertainment':
            textKey = 'nav_entertainment';
            break;
          case 'about':
            textKey = 'nav_about';
            break;
          default:
            return;
        }
        link.textContent = getText(currentLanguage, textKey as any);
      }
    });
    
    // Update theme toggle text
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
      const currentTheme = getTheme();
      const themeIcon = currentTheme === 'dark' ? '🌙' : '☀️';
      const themeText = currentTheme === 'dark' ? 'Dark' : 'Light';
      themeToggle.textContent = `${themeIcon} ${themeText}`;
    }
  } catch (error) {
    console.error('Error updating navigation text:', error);
  }
}

/**
 * Set up event listeners for language selector and theme toggle
 */
function setupEventListeners(): void {
  try {
    // Language selector event listener
    const languageSelector = document.getElementById('languageSelector') as HTMLSelectElement;
    if (languageSelector) {
      languageSelector.addEventListener('change', (event) => {
        try {
          const target = event.target as HTMLSelectElement;
          const newLanguage = target.value as Language;
          
          if (newLanguage === 'en' || newLanguage === 'cs') {
            currentLanguage = newLanguage;
            setLanguage(newLanguage);
            updateView();
            updateNavigationText();
            console.log(`Language changed to: ${newLanguage}`);
          } else {
            console.error(`Invalid language selection: ${newLanguage}`);
            // Reset to current language
            languageSelector.value = currentLanguage;
          }
        } catch (error) {
          console.error('Error handling language change:', error);
          // Reset to current language on error
          languageSelector.value = currentLanguage;
        }
      });
      
      // Set initial language selector value with error handling
      try {
        languageSelector.value = currentLanguage;
      } catch (error) {
        console.error('Error setting initial language selector value:', error);
      }
    } else {
      console.warn('Language selector element not found in DOM');
    }
    
    // Theme toggle event listener
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
      themeToggle.addEventListener('click', () => {
        try {
          toggleTheme();
          updateNavigationText(); // Update theme toggle text
          console.log('Theme toggled successfully');
        } catch (error) {
          console.error('Error toggling theme:', error);
        }
      });
    } else {
      console.warn('Theme toggle element not found in DOM');
    }
  } catch (error) {
    console.error('Critical error setting up event listeners:', error);
    // Application can still function without event listeners, but with reduced functionality
    console.warn('Some interactive features may not work properly');
  }
}

/**
 * Initialize all systems on DOMContentLoaded
 */
function init(): void {
  try {
    console.log('Initializing Z-Survive application...');
    
    // Test localStorage availability
    const localStorageAvailable = testLocalStorage();
    if (!localStorageAvailable) {
      console.warn('localStorage is not available - preferences will not persist across page reloads');
    } else {
      console.log('localStorage is available and working');
    }
    
    // Initialize all systems with error handling
    try {
      currentLanguage = initI18n();
      console.log(`Language system initialized with: ${currentLanguage}`);
    } catch (error) {
      console.error('Error initializing i18n system:', error);
      currentLanguage = 'en'; // Fallback to English
    }
    
    try {
      initTheme();
      console.log(`Theme system initialized with: ${getTheme()}`);
    } catch (error) {
      console.error('Error initializing theme system:', error);
    }
    
    // Set up event listeners
    setupEventListeners();
    
    // Initialize router with route change handler
    try {
      initRouter(handleRouteChange);
      console.log('Router initialized successfully');
    } catch (error) {
      console.error('Error initializing router:', error);
      // Try to render home page as fallback
      updateView();
    }
    
    // Update navigation text with current language
    updateNavigationText();
    
    console.log('Z-Survive application initialized successfully');
  } catch (error) {
    console.error('Critical error initializing application:', error);
    
    // Try to show a basic error page
    try {
      const appContainer = document.getElementById('app');
      if (appContainer) {
        appContainer.innerHTML = `
          <div class="page-content">
            <header class="page-header">
              <h1>Application Error</h1>
              <p>Sorry, there was an error starting the application. Please refresh the page to try again.</p>
              <p>If the problem persists, please check the browser console for more details.</p>
            </header>
          </div>
        `;
      }
    } catch (fallbackError) {
      console.error('Failed to show error page:', fallbackError);
    }
  }
}

// Initialize the application when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  // DOM is already ready
  init();
}