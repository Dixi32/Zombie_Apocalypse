// Hash-based routing system for Z-Survive website
// Handles navigation between different sections: home, guides, entertainment, about

// Valid route keys that map to hash values
type RouteKey = 'home' | 'guides' | 'entertainment' | 'about';

// Route mapping from hash to route key
const ROUTE_MAP: Record<string, RouteKey> = {
  '/': 'home',
  '/guides': 'guides',
  '/entertainment': 'entertainment',
  '/about': 'about'
};

// Reverse mapping from route key to hash
const HASH_MAP: Record<RouteKey, string> = {
  'home': '/',
  'guides': '/guides',
  'entertainment': '/entertainment',
  'about': '/about'
};

/**
 * Extract route from current URL hash
 * @returns The hash path without the # symbol, or '/' if no hash
 */
export function parseHash(): string {
  const hash = window.location.hash;
  if (!hash || hash === '#') {
    return '/';
  }
  // Remove the # symbol and return the path
  return hash.substring(1);
}

/**
 * Get current route key with fallback to homepage for unknown routes
 * @returns Route key corresponding to current hash, defaults to 'home'
 */
export function getCurrentRoute(): RouteKey {
  const hashPath = parseHash();
  const routeKey = ROUTE_MAP[hashPath];
  
  if (!routeKey) {
    // Unknown route, fallback to home
    console.warn(`Unknown route: ${hashPath}, falling back to home`);
    return 'home';
  }
  
  return routeKey;
}

/**
 * Navigate to a specific route programmatically
 * @param route - The route key to navigate to
 */
export function navigateTo(route: RouteKey): void {
  const hash = HASH_MAP[route];
  if (!hash) {
    console.error(`Invalid route: ${route}`);
    return;
  }
  
  // Update the URL hash, which will trigger hashchange event
  window.location.hash = hash;
}

/**
 * Initialize the router by setting up event listeners
 * @param onRouteChange - Callback function to execute when route changes
 */
export function initRouter(onRouteChange: (route: RouteKey) => void): void {
  // Handle hash changes
  const handleHashChange = () => {
    const currentRoute = getCurrentRoute();
    onRouteChange(currentRoute);
  };
  
  // Listen for hash changes
  window.addEventListener('hashchange', handleHashChange);
  
  // Handle initial route on page load
  handleHashChange();
}

/**
 * Get all valid route keys
 * @returns Array of valid route keys
 */
export function getValidRoutes(): RouteKey[] {
  return Object.values(HASH_MAP).map(hash => ROUTE_MAP[hash]).filter(Boolean) as RouteKey[];
}