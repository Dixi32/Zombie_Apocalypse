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
        const target = event.target as HTMLSelectElement;
        const newLanguage = target.value as Language;
        
        if (newLanguage === 'en' || newLanguage === 'cs') {
          currentLanguage = newLanguage;
          setLanguage(newLanguage);
          updateView();
          updateNavigationText();
        }
      });
      
      // Set initial language selector value
      languageSelector.value = currentLanguage;
    } else {
      console.warn('Language selector not found');
    }
    
    // Theme toggle event listener
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
      themeToggle.addEventListener('click', () => {
        toggleTheme();
        updateNavigationText(); // Update theme toggle text
      });
    } else {
      console.warn('Theme toggle not found');
    }
  } catch (error) {
    console.error('Error setting up event listeners:', error);
  }
}

/**
 * Initialize all systems on DOMContentLoaded
 */
function init(): void {
  try {
    // Initialize all systems
    currentLanguage = initI18n();
    initTheme();
    
    // Set up event listeners
    setupEventListeners();
    
    // Initialize router with route change handler
    initRouter(handleRouteChange);
    
    // Update navigation text with current language
    updateNavigationText();
    
    console.log('Z-Survive application initialized successfully');
  } catch (error) {
    console.error('Error initializing application:', error);
  }
}

// Initialize the application when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  // DOM is already ready
  init();
}