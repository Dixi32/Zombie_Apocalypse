import { getText, Language, TranslationKey } from './i18n.js';

// Render the homepage with welcome content and navigation links
export function renderHome(lang: Language): string {
  return `
    <div class="page-content">
      <header class="page-header">
        <h1>${getText(lang, 'home_title')}</h1>
        <h2>${getText(lang, 'home_subtitle')}</h2>
      </header>
      
      <section class="intro-section">
        <p>${getText(lang, 'home_intro')}</p>
      </section>
      
      <nav class="home-navigation">
        <div class="nav-cards">
          <a href="#/guides" class="nav-card">
            <h3>${getText(lang, 'nav_guides')}</h3>
            <p>${getText(lang, 'home_guides_link')}</p>
          </a>
          
          <a href="#/entertainment" class="nav-card">
            <h3>${getText(lang, 'nav_entertainment')}</h3>
            <p>${getText(lang, 'home_entertainment_link')}</p>
          </a>
          
          <a href="#/about" class="nav-card">
            <h3>${getText(lang, 'nav_about')}</h3>
            <p>${getText(lang, 'home_about_link')}</p>
          </a>
        </div>
      </nav>
    </div>
  `;
}

// Render survival guides with information organized by category
export function renderGuides(lang: Language): string {
  return `
    <div class="page-content">
      <header class="page-header">
        <h1>${getText(lang, 'guides_title')}</h1>
        <p class="page-intro">${getText(lang, 'guides_intro')}</p>
      </header>
      
      <div class="guides-grid">
        <section class="guide-category">
          <h2>${getText(lang, 'guides_water_title')}</h2>
          <ul class="guide-tips">
            <li>${getText(lang, 'guides_water_purify')}</li>
            <li>${getText(lang, 'guides_water_filter')}</li>
            <li>${getText(lang, 'guides_water_storage')}</li>
            <li>${getText(lang, 'guides_food_canned')}</li>
            <li>${getText(lang, 'guides_food_hunting')}</li>
            <li>${getText(lang, 'guides_food_preservation')}</li>
          </ul>
        </section>
        
        <section class="guide-category">
          <h2>${getText(lang, 'guides_shelter_title')}</h2>
          <ul class="guide-tips">
            <li>${getText(lang, 'guides_shelter_location')}</li>
            <li>${getText(lang, 'guides_shelter_fortify')}</li>
            <li>${getText(lang, 'guides_shelter_noise')}</li>
            <li>${getText(lang, 'guides_shelter_supplies')}</li>
            <li>${getText(lang, 'guides_shelter_group')}</li>
          </ul>
        </section>
        
        <section class="guide-category">
          <h2>${getText(lang, 'guides_health_title')}</h2>
          <ul class="guide-tips">
            <li>${getText(lang, 'guides_health_kit')}</li>
            <li>${getText(lang, 'guides_health_hygiene')}</li>
            <li>${getText(lang, 'guides_health_wounds')}</li>
            <li>${getText(lang, 'guides_health_medicine')}</li>
            <li>${getText(lang, 'guides_health_fitness')}</li>
          </ul>
        </section>
        
        <section class="guide-category">
          <h2>${getText(lang, 'guides_defense_title')}</h2>
          <ul class="guide-tips">
            <li>${getText(lang, 'guides_defense_weapons')}</li>
            <li>${getText(lang, 'guides_defense_escape')}</li>
            <li>${getText(lang, 'guides_defense_travel')}</li>
            <li>${getText(lang, 'guides_defense_group')}</li>
            <li>${getText(lang, 'guides_defense_stealth')}</li>
          </ul>
        </section>
      </div>
    </div>
  `;
}

// Render entertainment content with zombie media overviews
export function renderEntertainment(lang: Language): string {
  return `
    <div class="page-content">
      <header class="page-header">
        <h1>${getText(lang, 'entertainment_title')}</h1>
        <p class="page-intro">${getText(lang, 'entertainment_intro')}</p>
      </header>
      
      <div class="entertainment-sections">
        <section class="entertainment-category">
          <h2>${getText(lang, 'entertainment_movies_title')}</h2>
          <p class="category-intro">${getText(lang, 'entertainment_movies_intro')}</p>
          <ul class="entertainment-list">
            <li>${getText(lang, 'entertainment_movies_outbreak')}</li>
            <li>${getText(lang, 'entertainment_movies_survival')}</li>
            <li>${getText(lang, 'entertainment_movies_classics')}</li>
          </ul>
        </section>
        
        <section class="entertainment-category">
          <h2>${getText(lang, 'entertainment_games_title')}</h2>
          <p class="category-intro">${getText(lang, 'entertainment_games_intro')}</p>
          <ul class="entertainment-list">
            <li>${getText(lang, 'entertainment_games_mechanics')}</li>
            <li>${getText(lang, 'entertainment_games_coop')}</li>
            <li>${getText(lang, 'entertainment_games_strategy')}</li>
          </ul>
        </section>
        
        <section class="entertainment-category">
          <h2>${getText(lang, 'entertainment_books_title')}</h2>
          <p class="category-intro">${getText(lang, 'entertainment_books_intro')}</p>
          <ul class="entertainment-list">
            <li>${getText(lang, 'entertainment_books_worlds')}</li>
            <li>${getText(lang, 'entertainment_books_psychology')}</li>
            <li>${getText(lang, 'entertainment_books_diaries')}</li>
          </ul>
        </section>
      </div>
    </div>
  `;
}

// Render about page with project information and goals
export function renderAbout(lang: Language): string {
  return `
    <div class="page-content">
      <header class="page-header">
        <h1>${getText(lang, 'about_title')}</h1>
        <p class="page-intro">${getText(lang, 'about_intro')}</p>
      </header>
      
      <div class="about-sections">
        <section class="about-section">
          <h2>${getText(lang, 'about_purpose_title')}</h2>
          <p>${getText(lang, 'about_purpose_text')}</p>
        </section>
        
        <section class="about-section">
          <h2>${getText(lang, 'about_goals_title')}</h2>
          <ul class="goals-list">
            <li>${getText(lang, 'about_goals_visitors')}</li>
            <li>${getText(lang, 'about_goals_entertainment')}</li>
            <li>${getText(lang, 'about_goals_community')}</li>
          </ul>
        </section>
        
        <section class="about-section">
          <h2>${getText(lang, 'about_disclaimer_title')}</h2>
          <p>${getText(lang, 'about_disclaimer_text')}</p>
        </section>
      </div>
    </div>
  `;
}

// Main render dispatcher function that calls appropriate view renderer
export function render(route: string, lang: Language): string {
  try {
    switch (route) {
      case 'home':
        return renderHome(lang);
      case 'guides':
        return renderGuides(lang);
      case 'entertainment':
        return renderEntertainment(lang);
      case 'about':
        return renderAbout(lang);
      default:
        // Fallback to home for unknown routes
        console.warn(`Unknown route: ${route}, falling back to home`);
        return renderHome(lang);
    }
  } catch (error) {
    console.error(`Error rendering route "${route}":`, error);
    // Return a basic error message in case of rendering failure
    return `
      <div class="page-content">
        <header class="page-header">
          <h1>Error</h1>
          <p>Sorry, there was an error loading this page. Please try again.</p>
        </header>
      </div>
    `;
  }
}