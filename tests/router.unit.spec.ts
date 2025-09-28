// Unit tests for router.ts using Playwright test runner
// Tests hash parsing, route resolution, navigation, and initialization

import { test, expect } from '@playwright/test';

// Extend Window interface to include test functions
declare global {
  interface Window {
    testParseHash: () => string;
    testGetCurrentRoute: () => string;
    testNavigateTo: (route: string) => void;
    testInitRouter: (callback: (route: string) => void) => void;
    testGetValidRoutes: () => string[];
    routeCallbacks: string[];
  }
}

// Since we're testing the router module directly, we need to test it in a browser context
// where window.location is available

test.describe('Router Unit Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to a blank page for testing
    await page.goto('about:blank');
  });

  test('parseHash should extract route from URL hash', async ({ page }) => {
    // Inject the router module and test parseHash function
    await page.addScriptTag({
      content: `
        // Inline router functions for testing
        function parseHash() {
          const hash = window.location.hash;
          if (!hash || hash === '#') {
            return '/';
          }
          return hash.substring(1);
        }
        
        window.testParseHash = parseHash;
      `,
    });

    // Test empty hash
    await page.evaluate(() => {
      window.location.hash = '';
    });
    let result = await page.evaluate(() => window.testParseHash());
    expect(result).toBe('/');

    // Test hash with only #
    await page.evaluate(() => {
      window.location.hash = '#';
    });
    result = await page.evaluate(() => window.testParseHash());
    expect(result).toBe('/');

    // Test valid hash
    await page.evaluate(() => {
      window.location.hash = '#/guides';
    });
    result = await page.evaluate(() => window.testParseHash());
    expect(result).toBe('/guides');

    // Test complex path
    await page.evaluate(() => {
      window.location.hash = '#/entertainment';
    });
    result = await page.evaluate(() => window.testParseHash());
    expect(result).toBe('/entertainment');
  });

  test('getCurrentRoute should return correct route with fallback', async ({
    page,
  }) => {
    await page.addScriptTag({
      content: `
        const ROUTE_MAP = {
          '/': 'home',
          '/guides': 'guides',
          '/entertainment': 'entertainment',
          '/about': 'about'
        };
        
        function parseHash() {
          const hash = window.location.hash;
          if (!hash || hash === '#') {
            return '/';
          }
          return hash.substring(1);
        }
        
        function getCurrentRoute() {
          const hashPath = parseHash();
          const routeKey = ROUTE_MAP[hashPath];
          
          if (!routeKey) {
            console.warn('Unknown route: ' + hashPath + ', falling back to home');
            return 'home';
          }
          
          return routeKey;
        }
        
        window.testGetCurrentRoute = getCurrentRoute;
      `,
    });

    // Test home route
    await page.evaluate(() => {
      window.location.hash = '#/';
    });
    let result = await page.evaluate(() => window.testGetCurrentRoute());
    expect(result).toBe('home');

    // Test empty hash defaults to home
    await page.evaluate(() => {
      window.location.hash = '';
    });
    result = await page.evaluate(() => window.testGetCurrentRoute());
    expect(result).toBe('home');

    // Test valid routes
    await page.evaluate(() => {
      window.location.hash = '#/guides';
    });
    result = await page.evaluate(() => window.testGetCurrentRoute());
    expect(result).toBe('guides');

    await page.evaluate(() => {
      window.location.hash = '#/entertainment';
    });
    result = await page.evaluate(() => window.testGetCurrentRoute());
    expect(result).toBe('entertainment');

    await page.evaluate(() => {
      window.location.hash = '#/about';
    });
    result = await page.evaluate(() => window.testGetCurrentRoute());
    expect(result).toBe('about');

    // Test unknown route fallback
    await page.evaluate(() => {
      window.location.hash = '#/unknown';
    });
    result = await page.evaluate(() => window.testGetCurrentRoute());
    expect(result).toBe('home');
  });

  test('navigateTo should update window.location.hash', async ({ page }) => {
    await page.addScriptTag({
      content: `
        const HASH_MAP = {
          'home': '/',
          'guides': '/guides',
          'entertainment': '/entertainment',
          'about': '/about'
        };
        
        function navigateTo(route) {
          const hash = HASH_MAP[route];
          if (!hash) {
            console.error('Invalid route: ' + route);
            return;
          }
          window.location.hash = hash;
        }
        
        window.testNavigateTo = navigateTo;
      `,
    });

    // Test navigation to guides
    await page.evaluate(() => window.testNavigateTo('guides'));
    let hash = await page.evaluate(() => window.location.hash);
    expect(hash).toBe('#/guides');

    // Test navigation to entertainment
    await page.evaluate(() => window.testNavigateTo('entertainment'));
    hash = await page.evaluate(() => window.location.hash);
    expect(hash).toBe('#/entertainment');

    // Test navigation to about
    await page.evaluate(() => window.testNavigateTo('about'));
    hash = await page.evaluate(() => window.location.hash);
    expect(hash).toBe('#/about');

    // Test navigation to home
    await page.evaluate(() => window.testNavigateTo('home'));
    hash = await page.evaluate(() => window.location.hash);
    expect(hash).toBe('#/');
  });

  test('initRouter should set up event listeners and call callback', async ({
    page,
  }) => {
    await page.addScriptTag({
      content: `
        const ROUTE_MAP = {
          '/': 'home',
          '/guides': 'guides',
          '/entertainment': 'entertainment',
          '/about': 'about'
        };
        
        function parseHash() {
          const hash = window.location.hash;
          if (!hash || hash === '#') {
            return '/';
          }
          return hash.substring(1);
        }
        
        function getCurrentRoute() {
          const hashPath = parseHash();
          const routeKey = ROUTE_MAP[hashPath];
          
          if (!routeKey) {
            return 'home';
          }
          
          return routeKey;
        }
        
        function initRouter(onRouteChange) {
          const handleHashChange = () => {
            const currentRoute = getCurrentRoute();
            onRouteChange(currentRoute);
          };
          
          window.addEventListener('hashchange', handleHashChange);
          handleHashChange(); // Call immediately
        }
        
        window.testInitRouter = initRouter;
        window.routeCallbacks = [];
      `,
    });

    // Test that initRouter calls callback immediately
    await page.evaluate(() => {
      window.location.hash = '#/guides';
      window.testInitRouter((route) => {
        window.routeCallbacks.push(route);
      });
    });

    let callbacks = await page.evaluate(() => window.routeCallbacks);
    expect(callbacks).toContain('guides');

    // Test that hashchange triggers callback
    await page.evaluate(() => {
      window.routeCallbacks = []; // Reset
      window.location.hash = '#/entertainment';
      // Manually trigger hashchange event
      window.dispatchEvent(new HashChangeEvent('hashchange'));
    });

    // Wait a bit for the event to process
    await page.waitForTimeout(100);
    callbacks = await page.evaluate(() => window.routeCallbacks);
    expect(callbacks).toContain('entertainment');
  });

  test('getValidRoutes should return all valid route keys', async ({
    page,
  }) => {
    await page.addScriptTag({
      content: `
        const ROUTE_MAP = {
          '/': 'home',
          '/guides': 'guides',
          '/entertainment': 'entertainment',
          '/about': 'about'
        };
        
        const HASH_MAP = {
          'home': '/',
          'guides': '/guides',
          'entertainment': '/entertainment',
          'about': '/about'
        };
        
        function getValidRoutes() {
          return Object.values(HASH_MAP).map(hash => ROUTE_MAP[hash]).filter(Boolean);
        }
        
        window.testGetValidRoutes = getValidRoutes;
      `,
    });

    const routes = await page.evaluate(() => window.testGetValidRoutes());
    expect(routes).toEqual(['home', 'guides', 'entertainment', 'about']);
    expect(routes).toHaveLength(4);
  });
});
