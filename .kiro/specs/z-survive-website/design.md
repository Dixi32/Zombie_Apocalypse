# Design Document

## Overview

Z-Survive is a minimal single-page application built with vanilla TypeScript that provides zombie apocalypse survival information. The design emphasizes simplicity, using basic web technologies without frameworks or external dependencies. The application features hash-based routing, internationalization, theme switching, and comprehensive testing coverage.

## Architecture

### High-Level Architecture

The application follows a simple modular architecture with clear separation of concerns:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   index.html    │    │   main.ts       │    │   router.ts     │
│   (UI Shell)    │◄───┤   (Bootstrap)   │◄───┤   (Navigation)  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   CSS Variables │    │   pages.ts      │    │   i18n.ts       │
│   (Theming)     │    │   (Views)       │    │   (Translation) │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   theme.ts      │    │   localStorage  │    │   DOM Updates   │
│   (Theme Logic) │    │   (Persistence) │    │   (Rendering)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### File Structure

```
project/
├── public/
│   ├── index.html          # Single HTML file with inline CSS
│   └── js/                 # Compiled JavaScript output
│       ├── main.js
│       ├── router.js
│       ├── i18n.js
│       ├── pages.js
│       └── theme.js
├── src/
│   ├── main.ts            # Application bootstrap
│   ├── router.ts          # Hash routing logic
│   ├── i18n.ts            # Translation dictionary and helpers
│   ├── pages.ts           # View rendering functions
│   └── theme.ts           # Theme management
├── tests/
│   └── e2e.spec.ts        # Playwright tests
├── package.json           # Dependencies and scripts
└── tsconfig.json          # TypeScript configuration
```

## Components and Interfaces

### Core Interfaces

```typescript
// Route definition
interface Route {
  path: string;
  key: string;
}

// Translation dictionary structure
interface TranslationDict {
  [key: string]: {
    [translationKey: string]: string;
  };
}

// Application state
interface AppState {
  currentRoute: string;
  currentLang: string;
  currentTheme: string;
}
```

### Router Component

**Purpose:** Handle hash-based navigation and route resolution

**Key Functions:**
- `parseHash()`: Extract route from window.location.hash
- `navigateTo(route: string)`: Update hash and trigger view change
- `getCurrentRoute()`: Get current route key
- `initRouter()`: Set up hashchange event listeners

**Implementation Strategy:**
- Use `window.addEventListener('hashchange')` for route changes
- Map hash values to route keys (#/ → 'home', #/guides → 'guides')
- Fallback to 'home' for unknown routes
- Update active menu highlighting via CSS class manipulation

### Internationalization Component

**Purpose:** Manage language switching and text translation

**Key Functions:**
- `getText(lang: string, key: string)`: Retrieve translated text
- `setLanguage(lang: string)`: Change current language
- `getLanguage()`: Get current language from localStorage or default
- `initI18n()`: Initialize language system

**Implementation Strategy:**
- Embed complete translation dictionary in TypeScript
- Use simple object property access for translations
- Store language preference in localStorage with key "lang"
- Re-render current view when language changes

### Theme Component

**Purpose:** Handle dark/light theme switching

**Key Functions:**
- `setTheme(theme: string)`: Apply theme via data-theme attribute
- `toggleTheme()`: Switch between dark and light themes
- `getTheme()`: Get current theme from localStorage or default
- `initTheme()`: Initialize theme system

**Implementation Strategy:**
- Use `document.documentElement.setAttribute('data-theme', theme)`
- Define CSS variables for each theme in inline styles
- Store theme preference in localStorage with key "theme"
- Apply theme immediately on toggle

### Pages Component

**Purpose:** Render view content for each route

**Key Functions:**
- `renderHome(lang: string)`: Generate homepage HTML
- `renderGuides(lang: string)`: Generate survival guides HTML
- `renderEntertainment(lang: string)`: Generate entertainment HTML
- `renderAbout(lang: string)`: Generate about page HTML
- `render(route: string, lang: string)`: Main render dispatcher

**Implementation Strategy:**
- Return HTML strings using template literals
- Use i18n.getText() for all text content
- Inject rendered HTML into `#app` container
- Keep templates simple with basic HTML structure

### Main Application Component

**Purpose:** Bootstrap application and coordinate components

**Key Functions:**
- `init()`: Initialize all systems on DOMContentLoaded
- `handleRouteChange()`: Respond to navigation events
- `updateView()`: Re-render current view
- `setupEventListeners()`: Bind UI event handlers

## Data Models

### Translation Dictionary

The translation dictionary is embedded as a TypeScript constant:

```typescript
export const translations = {
  en: {
    nav_home: "Homepage",
    nav_guides: "Survival Guides",
    // ... complete dictionary as provided
  },
  cs: {
    nav_home: "Domov",
    nav_guides: "Průvodce přežitím",
    // ... complete Czech translations
  }
} as const;
```

### Application State

State is managed through:
- **Current Route**: Derived from window.location.hash
- **Current Language**: Stored in localStorage, default 'en'
- **Current Theme**: Stored in localStorage, default 'dark'

No complex state management is needed - each component manages its own concerns.

### Local Storage Schema

```typescript
// localStorage keys and expected values
{
  "lang": "en" | "cs",
  "theme": "dark" | "light"
}
```

## Error Handling

### Route Handling
- **Unknown Hash**: Fallback to homepage (#/)
- **Missing Hash**: Default to homepage
- **Invalid Route**: Log warning, display homepage

### Translation Handling
- **Missing Translation Key**: Return key as fallback text
- **Invalid Language**: Fallback to English
- **Empty Translation**: Return key as visible text

### Theme Handling
- **Invalid Theme Value**: Fallback to dark theme
- **localStorage Unavailable**: Use default values
- **CSS Variable Issues**: Rely on browser defaults

### General Error Strategy
- Use try-catch blocks around localStorage operations
- Provide sensible defaults for all operations
- Log errors to console for debugging
- Never break the user experience due to errors

## Testing Strategy

### Playwright Test Coverage

**Test File**: `tests/e2e.spec.ts`

**Test Scenarios:**

1. **Homepage Load Test**
   - Navigate to base URL
   - Verify h1 contains "Welcome to Z-Survive"
   - Verify default language is English

2. **Navigation Tests**
   - Click each menu item
   - Verify correct h1 for each page
   - Verify URL hash updates correctly

3. **Deep Link Test**
   - Navigate directly to `/#/entertainment`
   - Verify entertainment page loads
   - Verify correct h1 content

4. **Language Switch Test**
   - Switch to Czech language
   - Verify h1 changes to "Vítejte na Z-Survive"
   - Verify all menu items update to Czech

5. **Language Persistence Test**
   - Switch to Czech
   - Reload page
   - Verify language remains Czech

6. **Theme Toggle Test**
   - Click theme toggle
   - Verify `data-theme` attribute changes
   - Verify visual changes occur

7. **Theme Persistence Test**
   - Toggle to light theme
   - Reload page
   - Verify theme remains light

### Test Configuration

```typescript
// playwright.config.ts
export default {
  testDir: './tests',
  use: {
    browserName: 'chromium', // Chrome only
    baseURL: 'http://localhost:3000',
    headless: true
  },
  webServer: {
    command: 'npm run dev',
    port: 3000
  }
};
```

### Build and Development

**TypeScript Configuration** (`tsconfig.json`):
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ES2020",
    "outDir": "./public/js",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "tests"]
}
```

**Package.json Scripts**:
```json
{
  "scripts": {
    "build": "tsc",
    "dev": "http-server public -p 3000",
    "test": "playwright test"
  }
}
```

## Implementation Approach

### Phase 1: Core Structure
1. Create HTML shell with inline CSS
2. Set up TypeScript compilation
3. Implement basic routing system
4. Create simple view rendering

### Phase 2: Content and Features
1. Implement translation system
2. Add theme switching
3. Create all page content
4. Add localStorage persistence

### Phase 3: Testing and Polish
1. Write comprehensive Playwright tests
2. Test all user interactions
3. Verify persistence across reloads
4. Ensure Chrome compatibility

### Key Design Decisions

1. **No Build Complexity**: Use simple `tsc` compilation without bundlers
2. **Inline Styles**: All CSS in index.html using CSS variables
3. **Hash Routing**: Simple `hashchange` event handling
4. **Direct DOM Manipulation**: Use `innerHTML` for view updates
5. **Embedded Translations**: No external JSON files
6. **Chrome-Only**: No cross-browser compatibility code
7. **Desktop-Only**: No mobile responsive design

This design prioritizes simplicity and maintainability while meeting all functional requirements for the Z-Survive educational website.