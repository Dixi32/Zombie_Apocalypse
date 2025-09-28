import { test, expect } from '@playwright/test';

// Extend Window interface to include our custom i18n functions
declare global {
  interface Window {
    i18n: {
      getText: (lang: string, key: string) => string;
      getLanguage: () => string;
      setLanguage: (lang: string) => void;
      initI18n: () => string;
      translations: any;
    };
  }
}

test.describe('i18n Unit Tests', () => {
  test('can load i18n module', async ({ page }) => {
    // Go to the homepage first to ensure server is working
    await page.goto('/');
    
    // Now test the i18n module by injecting it into the page
    await page.addScriptTag({ 
      type: 'module',
      content: `
        import { getText, getLanguage, setLanguage, initI18n, translations } from '/js/i18n.js';
        
        window.i18n = {
          getText,
          getLanguage, 
          setLanguage,
          initI18n,
          translations
        };
      `
    });
    
    // Wait for the module to load
    await page.waitForFunction(() => window.i18n !== undefined, { timeout: 10000 });
    
    // Test basic functionality
    const result = await page.evaluate(() => {
      return window.i18n.getText('en', 'nav_home');
    });
    
    expect(result).toBe('Homepage');
  });

  test('getText returns correct Czech translations', async ({ page }) => {
    await page.goto('/');
    
    await page.addScriptTag({ 
      type: 'module',
      content: `
        import { getText, getLanguage, setLanguage, initI18n, translations } from '/js/i18n.js';
        window.i18n = { getText, getLanguage, setLanguage, initI18n, translations };
      `
    });
    
    await page.waitForFunction(() => window.i18n !== undefined);
    
    const result = await page.evaluate(() => {
      return window.i18n.getText('cs', 'nav_home');
    });
    
    expect(result).toBe('Domov');
  });

  test('getLanguage and setLanguage work with localStorage', async ({ page }) => {
    await page.goto('/');
    
    await page.addScriptTag({ 
      type: 'module',
      content: `
        import { getText, getLanguage, setLanguage, initI18n, translations } from '/js/i18n.js';
        window.i18n = { getText, getLanguage, setLanguage, initI18n, translations };
      `
    });
    
    await page.waitForFunction(() => window.i18n !== undefined);
    
    // Clear localStorage and test default
    await page.evaluate(() => localStorage.clear());
    
    let result = await page.evaluate(() => {
      return window.i18n.getLanguage();
    });
    
    expect(result).toBe('en');
    
    // Set Czech and test persistence
    await page.evaluate(() => {
      window.i18n.setLanguage('cs');
    });
    
    result = await page.evaluate(() => {
      return window.i18n.getLanguage();
    });
    
    expect(result).toBe('cs');
    
    // Verify localStorage
    const storedValue = await page.evaluate(() => {
      return localStorage.getItem('lang');
    });
    
    expect(storedValue).toBe('cs');
  });

  test('initI18n returns current language', async ({ page }) => {
    await page.goto('/');
    
    await page.addScriptTag({ 
      type: 'module',
      content: `
        import { getText, getLanguage, setLanguage, initI18n, translations } from '/js/i18n.js';
        window.i18n = { getText, getLanguage, setLanguage, initI18n, translations };
      `
    });
    
    await page.waitForFunction(() => window.i18n !== undefined);
    
    await page.evaluate(() => localStorage.clear());
    
    let result = await page.evaluate(() => {
      return window.i18n.initI18n();
    });
    
    expect(result).toBe('en');
    
    await page.evaluate(() => {
      window.i18n.setLanguage('cs');
    });
    
    result = await page.evaluate(() => {
      return window.i18n.initI18n();
    });
    
    expect(result).toBe('cs');
  });

  test('translation dictionary has complete coverage', async ({ page }) => {
    await page.goto('/');
    
    await page.addScriptTag({ 
      type: 'module',
      content: `
        import { getText, getLanguage, setLanguage, initI18n, translations } from '/js/i18n.js';
        window.i18n = { getText, getLanguage, setLanguage, initI18n, translations };
      `
    });
    
    await page.waitForFunction(() => window.i18n !== undefined);
    
    const { englishKeys, czechKeys, missingInCzech, missingInEnglish } = await page.evaluate(() => {
      const englishKeys = Object.keys(window.i18n.translations.en);
      const czechKeys = Object.keys(window.i18n.translations.cs);
      
      const missingInCzech = englishKeys.filter(key => !(key in window.i18n.translations.cs));
      const missingInEnglish = czechKeys.filter(key => !(key in window.i18n.translations.en));
      
      return { englishKeys, czechKeys, missingInCzech, missingInEnglish };
    });
    
    expect(missingInCzech).toEqual([]);
    expect(missingInEnglish).toEqual([]);
    expect(englishKeys.length).toBeGreaterThan(20);
    expect(czechKeys.length).toBe(englishKeys.length);
  });
});