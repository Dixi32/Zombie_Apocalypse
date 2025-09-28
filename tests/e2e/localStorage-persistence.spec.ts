/**
 * E2E tests for localStorage persistence and error handling
 * Tests the enhanced error handling and fallback behavior across the full application
 */

import { test, expect } from '@playwright/test';

// Extend Window interface to include our custom functions
declare global {
  interface Window {
    i18n: {
      getText: (lang: string, key: string) => string;
      getLanguage: () => string;
      setLanguage: (lang: string) => void;
      initI18n: () => string;
    };
    theme: {
      getTheme: () => string;
      setTheme: (theme: string) => void;
      toggleTheme: () => void;
      initTheme: () => void;
    };
    // Temporary test functions
    testGetLanguage?: () => string;
    testGetTheme?: () => string;
  }
}

test.describe('localStorage persistence E2E tests', () => {
  test.beforeEach(async ({ page }) => {
    // Go to the homepage to load the application
    await page.goto('/');
    
    // Load the i18n and theme modules
    await page.addScriptTag({ 
      type: 'module',
      content: `
        import { getText, getLanguage, setLanguage, initI18n } from '/js/i18n.js';
        import { getTheme, setTheme, toggleTheme, initTheme } from '/js/theme.js';
        
        window.i18n = { getText, getLanguage, setLanguage, initI18n };
        window.theme = { getTheme, setTheme, toggleTheme, initTheme };
      `
    });
    
    // Wait for modules to load
    await page.waitForFunction(() => window.i18n !== undefined && window.theme !== undefined);
    
    // Clear localStorage for clean test state
    await page.evaluate(() => localStorage.clear());
  });

  test.describe('Cross-page persistence', () => {
    test('should persist language preference across page navigation', async ({ page }) => {
      // Set language to Czech
      await page.evaluate(() => window.i18n.setLanguage('cs'));
      
      // Navigate to different pages
      await page.goto('/#/guides');
      await page.goto('/#/entertainment');
      await page.goto('/#/about');
      await page.goto('/#/');
      
      // Check that language persisted
      const result = await page.evaluate(() => window.i18n.getLanguage());
      expect(result).toBe('cs');
      
      // Verify localStorage
      const stored = await page.evaluate(() => localStorage.getItem('lang'));
      expect(stored).toBe('cs');
    });

    test('should persist theme preference across page navigation', async ({ page }) => {
      // Toggle to light theme
      await page.evaluate(() => window.theme.toggleTheme());
      
      // Navigate to different pages
      await page.goto('/#/guides');
      await page.goto('/#/entertainment');
      await page.goto('/#/about');
      await page.goto('/#/');
      
      // Check that theme persisted
      const result = await page.evaluate(() => window.theme.getTheme());
      expect(result).toBe('light');
      
      // Verify localStorage
      const stored = await page.evaluate(() => localStorage.getItem('theme'));
      expect(stored).toBe('light');
    });

    test('should persist preferences across page reloads', async ({ page }) => {
      // Set preferences
      await page.evaluate(() => {
        window.i18n.setLanguage('cs');
        window.theme.toggleTheme();
      });
      
      // Reload the page
      await page.reload();
      
      // Re-inject the modules after reload
      await page.addScriptTag({ 
        type: 'module',
        content: `
          import { getLanguage } from '/js/i18n.js';
          import { getTheme } from '/js/theme.js';
          window.testGetLanguage = getLanguage;
          window.testGetTheme = getTheme;
        `
      });
      
      await page.waitForFunction(() => window.testGetLanguage !== undefined && window.testGetTheme !== undefined);
      
      // Check that preferences persisted
      const lang = await page.evaluate(() => window.testGetLanguage!());
      const theme = await page.evaluate(() => window.testGetTheme!());
      
      expect(lang).toBe('cs');
      expect(theme).toBe('light');
    });
  });

  test.describe('User interaction scenarios', () => {
    test('should maintain preferences during typical user workflow', async ({ page }) => {
      // Simulate typical user workflow
      
      // 1. User changes language on homepage
      await page.evaluate(() => window.i18n.setLanguage('cs'));
      
      // 2. User navigates to guides (hash navigation, same page)
      await page.goto('/#/guides');
      let lang = await page.evaluate(() => window.i18n.getLanguage());
      expect(lang).toBe('cs');
      
      // 3. User changes theme on guides page
      await page.evaluate(() => window.theme.toggleTheme());
      
      // 4. User navigates to entertainment
      await page.goto('/#/entertainment');
      lang = await page.evaluate(() => window.i18n.getLanguage());
      let theme = await page.evaluate(() => window.theme.getTheme());
      expect(lang).toBe('cs');
      expect(theme).toBe('light');
      
      // 5. User navigates to about
      await page.goto('/#/about');
      lang = await page.evaluate(() => window.i18n.getLanguage());
      theme = await page.evaluate(() => window.theme.getTheme());
      expect(lang).toBe('cs');
      expect(theme).toBe('light');
      
      // 6. User returns to homepage
      await page.goto('/#/');
      lang = await page.evaluate(() => window.i18n.getLanguage());
      theme = await page.evaluate(() => window.theme.getTheme());
      expect(lang).toBe('cs');
      expect(theme).toBe('light');
      
      // Verify localStorage contains correct values
      const storedLang = await page.evaluate(() => localStorage.getItem('lang'));
      const storedTheme = await page.evaluate(() => localStorage.getItem('theme'));
      expect(storedLang).toBe('cs');
      expect(storedTheme).toBe('light');
    });
  });

  test.describe('Error handling and recovery', () => {
    test('should handle localStorage quota exceeded gracefully', async ({ page }) => {
      const consoleMessages: string[] = [];
      page.on('console', msg => {
        if (msg.type() === 'error' || msg.type() === 'warning') {
          consoleMessages.push(msg.text());
        }
      });
      
      // Mock localStorage to throw quota exceeded error
      await page.evaluate(() => {
        const originalSetItem = localStorage.setItem;
        localStorage.setItem = function(key: string, value: string) {
          if (key === 'lang' || key === 'theme') {
            const error = new DOMException('localStorage quota exceeded', 'QuotaExceededError');
            throw error;
          }
          return originalSetItem.call(this, key, value);
        };
        
        // Try to set preferences - should handle gracefully
        window.i18n.setLanguage('cs');
        window.theme.toggleTheme();
      });
      
      // Should have logged appropriate error messages
      const hasStorageErrors = consoleMessages.some(msg => 
        msg.includes('Error saving') && msg.includes('localStorage')
      );
      expect(hasStorageErrors).toBe(true);
      
      // Should have logged warnings about persistence
      const hasPersistenceWarnings = consoleMessages.some(msg => 
        msg.includes('will not persist across page reloads')
      );
      expect(hasPersistenceWarnings).toBe(true);
    });

    test('should recover from corrupted localStorage data', async ({ page }) => {
      const consoleMessages: string[] = [];
      page.on('console', msg => {
        if (msg.type() === 'warning') {
          consoleMessages.push(msg.text());
        }
      });
      
      // Set invalid values in localStorage
      await page.evaluate(() => {
        localStorage.setItem('lang', 'corrupted_value');
        localStorage.setItem('theme', 'invalid_theme');
      });
      
      // Application should recover with defaults
      const lang = await page.evaluate(() => window.i18n.getLanguage());
      const theme = await page.evaluate(() => window.theme.getTheme());
      
      expect(lang).toBe('en'); // Default fallback
      expect(theme).toBe('dark'); // Default fallback
      
      // Should have logged warnings about invalid values
      const hasWarnings = consoleMessages.some(msg => 
        msg.includes('Invalid') && (msg.includes('language') || msg.includes('theme'))
      );
      expect(hasWarnings).toBe(true);
    });
  });

  test.describe('Visual feedback', () => {
    test('should apply theme changes to document element', async ({ page }) => {
      // Start with default dark theme
      let themeAttr = await page.getAttribute('html', 'data-theme');
      expect(themeAttr).toBe('dark');
      
      // Toggle to light theme
      await page.evaluate(() => window.theme.toggleTheme());
      
      themeAttr = await page.getAttribute('html', 'data-theme');
      expect(themeAttr).toBe('light');
      
      // Navigate to another page - theme should persist
      await page.goto('/#/guides');
      
      themeAttr = await page.getAttribute('html', 'data-theme');
      expect(themeAttr).toBe('light');
      
      // Toggle back to dark
      await page.evaluate(() => window.theme.toggleTheme());
      
      themeAttr = await page.getAttribute('html', 'data-theme');
      expect(themeAttr).toBe('dark');
    });
  });
});