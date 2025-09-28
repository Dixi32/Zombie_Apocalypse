# Requirements Document

## Introduction

Z-Survive is a minimal educational single-page application about surviving a zombie apocalypse designed for Chrome desktop browsers. The website provides practical survival guides, entertainment content, and project information. It will be implemented using the simplest possible approach with vanilla TypeScript and no frameworks, featuring basic internationalization (English/Czech), simple theme switching (Dark/Light), and straightforward hash-based routing. The application must be fully testable with Playwright using Chromium only and work offline without external dependencies. All implementation should prioritize simplicity over complexity with no mobile or tablet support required.

## Requirements

### Requirement 1

**User Story:** As a visitor, I want to navigate between different sections of the website, so that I can access various types of survival content.

#### Acceptance Criteria

1. WHEN the user loads the website THEN the system SHALL display a homepage with a simple top navigation menu containing Homepage, Survival Guides, Entertainment, and About the Project links
2. WHEN the user clicks on any navigation menu item THEN the system SHALL navigate to the corresponding view using basic hash routing (#/, #/guides, #/entertainment, #/about)
3. WHEN the user enters an unknown hash in the URL THEN the system SHALL fall back to the homepage view
4. WHEN the user navigates to a section THEN the system SHALL highlight the active menu item using simple CSS class toggling

### Requirement 2

**User Story:** As a user, I want to switch between English and Czech languages, so that I can read the content in my preferred language.

#### Acceptance Criteria

1. WHEN the user loads the website THEN the system SHALL display content in English by default
2. WHEN the user clicks the language selector THEN the system SHALL provide simple options for English (EN) and Czech (CS) using basic HTML select or buttons
3. WHEN the user selects a different language THEN the system SHALL immediately re-render the current view with translated content using simple DOM updates
4. WHEN the user switches language THEN the system SHALL save the selection to localStorage with key "lang" using basic localStorage.setItem
5. WHEN the user reloads the page THEN the system SHALL restore the previously selected language from localStorage using basic localStorage.getItem
6. WHEN displaying any UI text THEN the system SHALL source all text from a simple translation dictionary object by key lookup

### Requirement 3

**User Story:** As a user, I want to toggle between dark and light themes, so that I can customize the visual appearance according to my preference.

#### Acceptance Criteria

1. WHEN the user loads the website THEN the system SHALL display the dark theme by default
2. WHEN the user clicks the simple theme toggle control THEN the system SHALL switch between dark and light themes using basic event handling
3. WHEN the theme changes THEN the system SHALL update the data-theme attribute on the document element to "dark" or "light" using simple setAttribute
4. WHEN the user toggles theme THEN the system SHALL save the selection to localStorage with key "theme" using basic localStorage.setItem
5. WHEN the user reloads the page THEN the system SHALL restore the previously selected theme from localStorage using basic localStorage.getItem
6. WHEN applying themes THEN the system SHALL use simple CSS variables defined for each theme in inline styles

### Requirement 4

**User Story:** As a visitor, I want to read practical survival guides, so that I can learn essential zombie apocalypse survival skills.

#### Acceptance Criteria

1. WHEN the user navigates to the Survival Guides section THEN the system SHALL display organized survival information covering water & food, shelters, health, and defense
2. WHEN displaying guide content THEN the system SHALL present information as short, memorable practical points
3. WHEN the user views guides THEN the system SHALL show content in the currently selected language
4. WHEN displaying water & food guidance THEN the system SHALL include water purification, filtering, and food storage tips
5. WHEN displaying shelter guidance THEN the system SHALL include location selection, fortification, and security tips
6. WHEN displaying health guidance THEN the system SHALL include first aid, hygiene, and injury prevention tips
7. WHEN displaying defense guidance THEN the system SHALL include mobility, tools, and safety planning tips

### Requirement 5

**User Story:** As a visitor, I want to explore entertainment content, so that I can discover zombie-themed media for leisure.

#### Acceptance Criteria

1. WHEN the user navigates to the Entertainment section THEN the system SHALL display lightweight overviews of zombie-themed media
2. WHEN displaying entertainment content THEN the system SHALL include sections for movies, games, and books
3. WHEN showing movie content THEN the system SHALL describe classic outbreak and survival scenarios
4. WHEN showing game content THEN the system SHALL describe survival mechanics and co-op tactics
5. WHEN showing book content THEN the system SHALL describe post-apocalyptic worlds and diaries
6. WHEN displaying entertainment content THEN the system SHALL show content in the currently selected language

### Requirement 6

**User Story:** As a visitor, I want to learn about the project, so that I can understand the purpose and goals of Z-Survive.

#### Acceptance Criteria

1. WHEN the user navigates to the About section THEN the system SHALL display project information and goals
2. WHEN displaying project information THEN the system SHALL explain the balance between practical guidance and entertainment
3. WHEN showing project goals THEN the system SHALL include visitor and community targets
4. WHEN displaying about content THEN the system SHALL show content in the currently selected language

### Requirement 7

**User Story:** As a visitor, I want the website to work without internet connectivity, so that I can access survival information in emergency situations.

#### Acceptance Criteria

1. WHEN the website loads THEN the system SHALL function entirely with static content without requiring network calls
2. WHEN the user accesses any feature THEN the system SHALL work without external runtime dependencies
3. WHEN the website is accessed offline THEN the system SHALL maintain full functionality including navigation, language switching, and theme toggling

### Requirement 8

**User Story:** As a developer, I want the website to be thoroughly tested, so that I can ensure all functionality works correctly across different scenarios.

#### Acceptance Criteria

1. WHEN running tests THEN the system SHALL load the homepage by default with correct heading text in English using Chromium browser only
2. WHEN testing navigation THEN the system SHALL correctly navigate to each menu item and display the appropriate heading in Chromium browser
3. WHEN testing deep linking THEN the system SHALL load the correct view when accessing hash URLs directly in Chromium browser
4. WHEN testing language switching THEN the system SHALL update all text content to the selected language in Chromium browser
5. WHEN testing language persistence THEN the system SHALL maintain the selected language after page reload in Chromium browser
6. WHEN testing theme toggling THEN the system SHALL update the data-theme attribute correctly in Chromium browser
7. WHEN testing theme persistence THEN the system SHALL maintain the selected theme after page reload in Chromium browser
8. WHEN running Playwright tests THEN the system SHALL execute tests only in Chromium browser without cross-browser testing

### Requirement 9

**User Story:** As a developer, I want the website built with vanilla TypeScript, so that it remains lightweight and framework-independent.

#### Acceptance Criteria

1. WHEN building the project THEN the system SHALL use only vanilla TypeScript with the simplest possible approach, no frameworks or bundlers
2. WHEN compiling THEN the system SHALL use basic TypeScript compiler (tsc) to generate JavaScript files with minimal configuration
3. WHEN structuring code THEN the system SHALL organize functionality into simple, focused modules (main.ts, router.ts, i18n.ts, pages.ts, theme.ts) with clear separation of concerns
4. WHEN serving the application THEN the system SHALL work with any basic static file server without special configuration
5. WHEN implementing styling THEN the system SHALL use simple inline CSS in index.html with basic CSS variables for theming, avoiding complex selectors or layouts, and SHALL NOT use any external CSS files

### Requirement 10

**User Story:** As a desktop Chrome user, I want the website to display properly in my browser, so that I can access all functionality without compatibility issues.

#### Acceptance Criteria

1. WHEN viewing the website in Chrome desktop THEN the system SHALL display content properly using simple normal document flow without complex CSS
2. WHEN displaying content THEN the system SHALL use minimal CSS optimized for Chrome desktop browser without mobile breakpoints
3. WHEN loading the website THEN the system SHALL not require external images, web fonts, external CSS files, or any external resources
4. WHEN using the interface in Chrome desktop THEN the system SHALL maintain full usability without requiring mobile or tablet support