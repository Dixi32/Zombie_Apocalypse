/**
 * Comprehensive E2E tests for Z-Survive website
 * Tests all core functionality including navigation, language switching, theme toggling, and persistence
 */

import { test, expect } from '@playwright/test';

test.describe('Z-Survive Website E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage for clean test state
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
  });

  test.describe('Homepage Loading', () => {
    test('should load homepage with correct English heading', async ({ page }) => {
      await page.goto('/');
      
      // Wait for the page to load and render
      await page.waitForSelector('h1');
      
      // Verify the homepage loads with correct English heading
      const heading = await page.locator('h1').textContent();
      expect(heading).toBe('Welcome to Z-Survive');
      
      // Verify default language is English
      const langSelector = page.locator('#languageSelector');
      await expect(langSelector).toHaveValue('en');
    });
  });

  test.describe('Navigation Tests', () => {
    test('should navigate to Survival Guides and display correct heading', async ({ page }) => {
      await page.goto('/');
      
      // Click on Survival Guides menu item
      await page.click('a[href="#/guides"]');
      
      // Wait for navigation and content update
      await page.waitForSelector('h1');
      
      // Verify correct heading is displayed
      const heading = await page.locator('h1').textContent();
      expect(heading).toBe('Survival Guides');
      
      // Verify URL hash is correct
      expect(page.url()).toContain('#/guides');
    });

    test('should navigate to Entertainment and display correct heading', async ({ page }) => {
      await page.goto('/');
      
      // Click on Entertainment menu item
      await page.click('a[href="#/entertainment"]');
      
      // Wait for navigation and content update
      await page.waitForSelector('h1');
      
      // Verify correct heading is displayed
      const heading = await page.locator('h1').textContent();
      expect(heading).toBe('Entertainment');
      
      // Verify URL hash is correct
      expect(page.url()).toContain('#/entertainment');
    });

    test('should navigate to About and display correct heading', async ({ page }) => {
      await page.goto('/');
      
      // Click on About menu item
      await page.click('a[href="#/about"]');
      
      // Wait for navigation and content update
      await page.waitForSelector('h1');
      
      // Verify correct heading is displayed
      const heading = await page.locator('h1').textContent();
      expect(heading).toBe('About the Project');
      
      // Verify URL hash is correct
      expect(page.url()).toContain('#/about');
    });

    test('should navigate back to Homepage and display correct heading', async ({ page }) => {
      await page.goto('/#/guides');
      
      // Click on Homepage menu item
      await page.click('a[href="#/"]');
      
      // Wait for navigation and content update
      await page.waitForSelector('h1');
      
      // Verify correct heading is displayed
      const heading = await page.locator('h1').textContent();
      expect(heading).toBe('Welcome to Z-Survive');
      
      // Verify URL hash is correct (should be #/ or empty)
      expect(page.url()).toMatch(/(#\/|#)$/);
    });

    test('should navigate to homepage when clicking Z-Survive logo', async ({ page }) => {
      // Start from a different page
      await page.goto('/#/guides');
      
      // Wait for the guides page to load
      await page.waitForSelector('h1');
      let heading = await page.locator('h1').textContent();
      expect(heading).toBe('Survival Guides');
      
      // Click on the Z-Survive logo
      await page.click('a.logo[data-route="home"]');
      
      // Wait for navigation and content update
      await page.waitForSelector('h1');
      
      // Verify we're back on the homepage
      heading = await page.locator('h1').textContent();
      expect(heading).toBe('Welcome to Z-Survive');
      
      // Verify URL hash is correct
      expect(page.url()).toMatch(/(#\/|#)$/);
    });
  });

  test.describe('Deep Link Test', () => {
    test('should load correct view when accessing hash URL directly', async ({ page }) => {
      // Navigate directly to entertainment page via hash URL
      await page.goto('/#/entertainment');
      
      // Wait for the page to load and render
      await page.waitForSelector('h1');
      
      // Verify entertainment page loads correctly
      const heading = await page.locator('h1').textContent();
      expect(heading).toBe('Entertainment');
      
      // Verify URL hash is correct
      expect(page.url()).toContain('#/entertainment');
    });

    test('should fallback to homepage for unknown hash URLs', async ({ page }) => {
      // Navigate to unknown hash URL
      await page.goto('/#/unknown-page');
      
      // Wait for the page to load and render
      await page.waitForSelector('h1');
      
      // Should fallback to homepage
      const heading = await page.locator('h1').textContent();
      expect(heading).toBe('Welcome to Z-Survive');
    });
  });

  test.describe('Language Switching Test', () => {
    test('should update text to Czech when language is switched', async ({ page }) => {
      await page.goto('/');
      
      // Verify initial English heading
      let heading = await page.locator('h1').textContent();
      expect(heading).toBe('Welcome to Z-Survive');
      
      // Switch to Czech language
      await page.selectOption('#languageSelector', 'cs');
      
      // Wait for content to update
      await page.waitForFunction(() => {
        const h1 = document.querySelector('h1');
        return h1 && h1.textContent === 'Vítejte na Z-Survive';
      });
      
      // Verify heading changed to Czech
      heading = await page.locator('h1').textContent();
      expect(heading).toBe('Vítejte na Z-Survive');
      
      // Verify menu items are also in Czech
      const guidesLink = await page.locator('.nav-menu a[href="#/guides"]').textContent();
      expect(guidesLink).toBe('Průvodce přežitím');
    });

    test('should update all page content when switching languages', async ({ page }) => {
      await page.goto('/#/guides');
      
      // Switch to Czech
      await page.selectOption('#languageSelector', 'cs');
      
      // Wait for content to update
      await page.waitForFunction(() => {
        const h1 = document.querySelector('h1');
        return h1 && h1.textContent === 'Průvodce přežitím';
      });
      
      // Verify guides page heading is in Czech
      const heading = await page.locator('h1').textContent();
      expect(heading).toBe('Průvodce přežitím');
    });
  });

  test.describe('Language Persistence Test', () => {
    test('should maintain selected language after page reload', async ({ page }) => {
      await page.goto('/');
      
      // Switch to Czech language
      await page.selectOption('#languageSelector', 'cs');
      
      // Wait for content to update
      await page.waitForFunction(() => {
        const h1 = document.querySelector('h1');
        return h1 && h1.textContent === 'Vítejte na Z-Survive';
      });
      
      // Reload the page
      await page.reload();
      
      // Wait for page to load
      await page.waitForSelector('h1');
      
      // Verify language persisted after reload
      const heading = await page.locator('h1').textContent();
      expect(heading).toBe('Vítejte na Z-Survive');
      
      // Verify language selector shows Czech
      const langSelector = page.locator('#languageSelector');
      await expect(langSelector).toHaveValue('cs');
    });

    test('should persist language across different pages', async ({ page }) => {
      await page.goto('/');
      
      // Switch to Czech
      await page.selectOption('#languageSelector', 'cs');
      
      // Navigate to guides page
      await page.click('a[href="#/guides"]');
      await page.waitForSelector('h1');
      
      // Verify language persisted
      let heading = await page.locator('h1').textContent();
      expect(heading).toBe('Průvodce přežitím');
      
      // Navigate to entertainment page
      await page.click('a[href="#/entertainment"]');
      await page.waitForSelector('h1');
      
      // Verify language still persisted
      heading = await page.locator('h1').textContent();
      expect(heading).toBe('Zábava');
    });
  });

  test.describe('Theme Toggle Test', () => {
    test('should update data-theme attribute when theme is toggled', async ({ page }) => {
      await page.goto('/');
      
      // Verify initial dark theme
      let themeAttr = await page.getAttribute('html', 'data-theme');
      expect(themeAttr).toBe('dark');
      
      // Click theme toggle button
      await page.click('#themeToggle');
      
      // Wait for theme to change
      await page.waitForFunction(() => {
        return document.documentElement.getAttribute('data-theme') === 'light';
      });
      
      // Verify theme changed to light
      themeAttr = await page.getAttribute('html', 'data-theme');
      expect(themeAttr).toBe('light');
      
      // Toggle back to dark
      await page.click('#themeToggle');
      
      // Wait for theme to change back
      await page.waitForFunction(() => {
        return document.documentElement.getAttribute('data-theme') === 'dark';
      });
      
      // Verify theme changed back to dark
      themeAttr = await page.getAttribute('html', 'data-theme');
      expect(themeAttr).toBe('dark');
    });

    test('should apply visual changes when theme is toggled', async ({ page }) => {
      await page.goto('/');
      
      // Get initial background color (dark theme)
      const initialBgColor = await page.evaluate(() => {
        return getComputedStyle(document.body).backgroundColor;
      });
      
      // Toggle to light theme
      await page.click('#themeToggle');
      
      // Wait for theme change
      await page.waitForFunction(() => {
        return document.documentElement.getAttribute('data-theme') === 'light';
      });
      
      // Get new background color (light theme)
      const newBgColor = await page.evaluate(() => {
        return getComputedStyle(document.body).backgroundColor;
      });
      
      // Colors should be different
      expect(newBgColor).not.toBe(initialBgColor);
    });
  });

  test.describe('Theme Persistence Test', () => {
    test('should maintain selected theme after page reload', async ({ page }) => {
      await page.goto('/');
      
      // Toggle to light theme
      await page.click('#themeToggle');
      
      // Wait for theme change
      await page.waitForFunction(() => {
        return document.documentElement.getAttribute('data-theme') === 'light';
      });
      
      // Reload the page
      await page.reload();
      
      // Wait for page to load
      await page.waitForSelector('body');
      
      // Verify theme persisted after reload
      const themeAttr = await page.getAttribute('html', 'data-theme');
      expect(themeAttr).toBe('light');
    });

    test('should persist theme across different pages', async ({ page }) => {
      await page.goto('/');
      
      // Toggle to light theme
      await page.click('#themeToggle');
      
      // Wait for theme change
      await page.waitForFunction(() => {
        return document.documentElement.getAttribute('data-theme') === 'light';
      });
      
      // Navigate to guides page
      await page.click('a[href="#/guides"]');
      await page.waitForSelector('h1');
      
      // Verify theme persisted
      let themeAttr = await page.getAttribute('html', 'data-theme');
      expect(themeAttr).toBe('light');
      
      // Navigate to entertainment page
      await page.click('a[href="#/entertainment"]');
      await page.waitForSelector('h1');
      
      // Verify theme still persisted
      themeAttr = await page.getAttribute('html', 'data-theme');
      expect(themeAttr).toBe('light');
      
      // Navigate to about page
      await page.click('a[href="#/about"]');
      await page.waitForSelector('h1');
      
      // Verify theme still persisted
      themeAttr = await page.getAttribute('html', 'data-theme');
      expect(themeAttr).toBe('light');
    });
  });

  test.describe('Combined Functionality', () => {
    test('should maintain both language and theme preferences together', async ({ page }) => {
      await page.goto('/');
      
      // Switch to Czech and light theme
      await page.selectOption('#languageSelector', 'cs');
      await page.click('#themeToggle');
      
      // Wait for both changes
      await page.waitForFunction(() => {
        const h1 = document.querySelector('h1');
        const theme = document.documentElement.getAttribute('data-theme');
        return h1 && h1.textContent === 'Vítejte na Z-Survive' && theme === 'light';
      });
      
      // Navigate to different pages
      await page.click('a[href="#/guides"]');
      await page.waitForSelector('h1');
      
      // Verify both preferences persisted
      let heading = await page.locator('h1').textContent();
      let themeAttr = await page.getAttribute('html', 'data-theme');
      expect(heading).toBe('Průvodce přežitím');
      expect(themeAttr).toBe('light');
      
      // Reload page
      await page.reload();
      await page.waitForSelector('h1');
      
      // Verify both preferences persisted after reload
      heading = await page.locator('h1').textContent();
      themeAttr = await page.getAttribute('html', 'data-theme');
      expect(heading).toBe('Průvodce přežitím');
      expect(themeAttr).toBe('light');
    });
  });
});