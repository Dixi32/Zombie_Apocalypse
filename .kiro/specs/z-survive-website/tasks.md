# Implementation Plan

- [x] 1. Set up project structure and TypeScript configuration

  - Create directory structure (src/, public/, tests/)
  - Write tsconfig.json with ES2020 target and proper output configuration
  - Create package.json with build, dev, and test scripts
  - _Requirements: 9.1, 9.2, 9.4_

- [x] 2. Create HTML shell with inline CSS and theme variables

  - Write index.html with navigation menu, language selector, theme toggle, and app container
  - Implement inline CSS with CSS variables for dark and light themes
  - Add basic responsive layout using normal document flow
  - _Requirements: 1.1, 3.6, 10.1, 10.2, 9.5_

- [x] 3. Implement translation dictionary and i18n system

  - Create i18n.ts with complete translation dictionary as TypeScript constant
  - Write getText() function for key-based translation lookup
  - Implement getLanguage() and setLanguage() functions with localStorage persistence
  - Write unit tests for translation functions
  - _Requirements: 2.6, 2.1, 2.4, 2.5_

- [x] 4. Build hash-based routing system

  - Create router.ts with parseHash() function to extract route from URL
  - Implement getCurrentRoute() with fallback to homepage for unknown hashes
  - Write initRouter() to set up hashchange event listeners
  - Add navigateTo() function for programmatic navigation
  - Write unit tests for routing logic
  - _Requirements: 1.2, 1.3, 1.4_

- [x] 5. Create theme management system



  - Write theme.ts with setTheme() function using data-theme attribute
  - Implement toggleTheme() to switch between dark and light themes
  - Add getTheme() function with localStorage persistence and dark default
  - Write initTheme() to apply saved theme on page load
  - Write unit tests for theme functions
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_
-



- [x] 6. Implement page rendering system






  - Create pages.ts with render functions for each view (home, guides, entertainment, about)
  - Write renderHome() with welcome content and navigation links using i18n keys
  - Implement renderGuides() with survival information organized by category
  - Create renderEntertainment() with zombie media overviews
  - Write renderAbout() with project information and goals
  - Add main render() dispatcher function that calls appropriate view renderer
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 6.1, 6.2, 6.3, 6.4_

- [ ] 7. Create main application bootstrap





  - Write main.ts with init() function to initialize all systems on DOMContentLoaded
  - Implement handleRouteChange() to respond to navigation events
  - Add updateView() function to re-render current view with selected language
  - Create setupEventListeners() for language selector and theme toggle
  - Wire together router, i18n, theme, and pages modules
  - _Requirements: 9.3, 2.3, 3.2_

- [ ] 8. Add localStorage persistence and error handling

  - Implement try-catch blocks around all localStorage operations
  - Add fallback values for missing or invalid stored preferences
  - Create error logging for debugging while maintaining user experience
  - Test persistence across page reloads for language and theme
  - _Requirements: 2.4, 2.5, 3.4, 3.5, 7.1, 7.2, 7.3_

- [ ] 9. Write comprehensive Playwright tests

  - Create e2e.spec.ts with test for homepage loading with correct English heading
  - Write navigation tests to verify each menu item displays correct heading
  - Implement deep link test for direct hash URL access
  - Add language switching test to verify text updates to Czech
  - Create language persistence test to verify saved language after reload
  - Write theme toggle test to verify data-theme attribute changes
  - Implement theme persistence test to verify saved theme after reload
  - Configure Playwright for Chromium-only testing
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7, 8.8_

- [ ] 10. Build and test complete application
  - Run TypeScript compilation to generate JavaScript files in public/js/
  - Start development server and verify all functionality works
  - Execute all Playwright tests and ensure they pass
  - Test offline functionality by disconnecting network
  - Verify no external resources are loaded
  - _Requirements: 9.2, 9.4, 7.1, 7.2, 7.3_
