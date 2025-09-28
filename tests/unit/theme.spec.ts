/**
 * Unit tests for theme management system
 */

import { test, expect } from '@playwright/test';

// Extend Window interface to include our custom functions
declare global {
  interface Window {
    setTheme: (theme: string) => void;
    getTheme: () => string;
    toggleTheme: () => void;
    initTheme: () => void;
    mockStorage: {
      data: Record<string, string>;
      getItem: (key: string) => string | null;
      setItem: (key: string, value: string) => void;
      clear: () => void;
    };
  }
}

test.describe('Theme Management System', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to a simple data URL
    await page.goto(
      'data:text/html,<!DOCTYPE html><html><head><title>Test</title></head><body></body></html>'
    );

    // Add the theme functions with localStorage mock
    await page.addScriptTag({
      content: `
        // Mock localStorage for testing
        const mockStorage = {
          data: {},
          getItem: function(key) {
            return this.data[key] || null;
          },
          setItem: function(key, value) {
            this.data[key] = value;
          },
          clear: function() {
            this.data = {};
          }
        };

        const THEME_STORAGE_KEY = 'theme';
        const DEFAULT_THEME = 'dark';

        function setTheme(theme) {
          document.documentElement.setAttribute('data-theme', theme);
        }

        function getTheme() {
          try {
            const savedTheme = mockStorage.getItem(THEME_STORAGE_KEY);
            if (savedTheme === 'dark' || savedTheme === 'light') {
              return savedTheme;
            }
          } catch (error) {
            console.warn('Failed to read theme from localStorage:', error);
          }
          return DEFAULT_THEME;
        }

        function toggleTheme() {
          const currentTheme = getTheme();
          const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
          
          setTheme(newTheme);
          
          try {
            mockStorage.setItem(THEME_STORAGE_KEY, newTheme);
          } catch (error) {
            console.warn('Failed to save theme to localStorage:', error);
          }
        }

        function initTheme() {
          const theme = getTheme();
          setTheme(theme);
        }

        // Make functions and mock available globally
        window.setTheme = setTheme;
        window.getTheme = getTheme;
        window.toggleTheme = toggleTheme;
        window.initTheme = initTheme;
        window.mockStorage = mockStorage;
      `,
    });
  });

  test.describe('setTheme', () => {
    test('should set data-theme attribute to dark', async ({ page }) => {
      await page.evaluate(() => window.setTheme('dark'));

      const dataTheme = await page.getAttribute('html', 'data-theme');
      expect(dataTheme).toBe('dark');
    });

    test('should set data-theme attribute to light', async ({ page }) => {
      await page.evaluate(() => window.setTheme('light'));

      const dataTheme = await page.getAttribute('html', 'data-theme');
      expect(dataTheme).toBe('light');
    });
  });

  test.describe('getTheme', () => {
    test('should return dark as default theme when localStorage is empty', async ({
      page,
    }) => {
      // Clear mock storage
      await page.evaluate(() => window.mockStorage.clear());

      const theme = await page.evaluate(() => window.getTheme());
      expect(theme).toBe('dark');
    });

    test('should return saved theme from localStorage when valid', async ({
      page,
    }) => {
      await page.evaluate(() => {
        window.mockStorage.clear();
        window.mockStorage.setItem('theme', 'light');
      });

      const theme = await page.evaluate(() => window.getTheme());
      expect(theme).toBe('light');
    });

    test('should return dark theme when saved theme is valid dark', async ({
      page,
    }) => {
      await page.evaluate(() => {
        window.mockStorage.clear();
        window.mockStorage.setItem('theme', 'dark');
      });

      const theme = await page.evaluate(() => window.getTheme());
      expect(theme).toBe('dark');
    });

    test('should return default theme when localStorage contains invalid value', async ({
      page,
    }) => {
      await page.evaluate(() => {
        window.mockStorage.clear();
        window.mockStorage.setItem('theme', 'invalid');
      });

      const theme = await page.evaluate(() => window.getTheme());
      expect(theme).toBe('dark');
    });
  });

  test.describe('toggleTheme', () => {
    test('should toggle from dark to light', async ({ page }) => {
      await page.evaluate(() => {
        window.mockStorage.clear();
        window.mockStorage.setItem('theme', 'dark');
        window.toggleTheme();
      });

      const dataTheme = await page.getAttribute('html', 'data-theme');
      const savedTheme = await page.evaluate(() =>
        window.mockStorage.getItem('theme')
      );

      expect(dataTheme).toBe('light');
      expect(savedTheme).toBe('light');
    });

    test('should toggle from light to dark', async ({ page }) => {
      await page.evaluate(() => {
        window.mockStorage.clear();
        window.mockStorage.setItem('theme', 'light');
        window.toggleTheme();
      });

      const dataTheme = await page.getAttribute('html', 'data-theme');
      const savedTheme = await page.evaluate(() =>
        window.mockStorage.getItem('theme')
      );

      expect(dataTheme).toBe('dark');
      expect(savedTheme).toBe('dark');
    });

    test('should toggle from default dark to light when no theme is saved', async ({
      page,
    }) => {
      await page.evaluate(() => {
        window.mockStorage.clear();
        window.toggleTheme();
      });

      const dataTheme = await page.getAttribute('html', 'data-theme');
      const savedTheme = await page.evaluate(() =>
        window.mockStorage.getItem('theme')
      );

      expect(dataTheme).toBe('light');
      expect(savedTheme).toBe('light');
    });
  });

  test.describe('initTheme', () => {
    test('should apply default dark theme when no theme is saved', async ({
      page,
    }) => {
      await page.evaluate(() => {
        window.mockStorage.clear();
        window.initTheme();
      });

      const dataTheme = await page.getAttribute('html', 'data-theme');
      expect(dataTheme).toBe('dark');
    });

    test('should apply saved light theme from localStorage', async ({
      page,
    }) => {
      await page.evaluate(() => {
        window.mockStorage.clear();
        window.mockStorage.setItem('theme', 'light');
        window.initTheme();
      });

      const dataTheme = await page.getAttribute('html', 'data-theme');
      expect(dataTheme).toBe('light');
    });

    test('should apply saved dark theme from localStorage', async ({
      page,
    }) => {
      await page.evaluate(() => {
        window.mockStorage.clear();
        window.mockStorage.setItem('theme', 'dark');
        window.initTheme();
      });

      const dataTheme = await page.getAttribute('html', 'data-theme');
      expect(dataTheme).toBe('dark');
    });
  });
});
