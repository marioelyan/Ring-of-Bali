# Ring of Bali — Bali Car Rental & Private Driver Landing Page

## Project
Static landing page for a Bali car rental & private driver business. Offers self-drive (lepas kunci), cars with a driver, and airport/hotel delivery. Primary conversion is a WhatsApp inquiry.

## Technology
- Plain HTML, CSS, and vanilla JavaScript. No framework, no build step.
- Styling authored in `css/main.css` as custom properties + plain CSS. No CSS preprocessor, no utility framework.
- Site runs on a static server: VS Code Live Server or `python3 -m http.server`. Do **not** open via `file://` — the i18n system uses `fetch()` to load JSON, which is blocked on `file://`. Compatible with GitHub Pages.
- Multilingual support (no Google Translate):
  - ESLint-free vanilla JS in `js/i18n.js` (loader + single-page language switcher) and `js/main.js` (mobile nav toggle only).
  - Translations stored as flat dot-keys in `locales/en.json`, `locales/id.json`, `locales/ru.json`, `locales/zh.json`. `en.json` is the canonical key set.
  - English is the default language. Supported codes: `en`, `id`, `ru`, `zh`.
  - The active language is persisted in `localStorage` (`ring-of-bali-lang`) and applied to all `data-i18n` text, `data-i18n-alt` (img alt), `data-i18n-aria-label`, `<html lang>`, `<title>`, meta description, and all WhatsApp links.
  - Missing keys fall back to English and log a console warning. `window.i18nCheck()` audits all locales against `en.json` from the console.

## Structure
- `index.html` — single-page landing site: navbar + language switcher, hero, trust indicators, fleet showcase, services, why choose us, how it works, service areas, testimonials (empty until real ones exist), FAQ, final CTA, footer
- `css/main.css` — all styles (one file)
- `js/i18n.js` — language loader, switcher, and WhatsApp link builder
- `js/main.js` — vanilla JS: mobile nav toggle only
- `locales/` — `en.json`, `id.json`, `ru.json`, `zh.json` translation files
- `assets/images/` — local SVG placeholders (hero + fleet), `Ring of Bali.jpeg` brand logo

## WhatsApp numbers (IMPORTANT)
- There are TWO WhatsApp numbers, both serving ALL services. The numbers are not final yet.
- Use the literal placeholders in every `wa.me` link and CTA:
  - `REPLACE_WITH_WHATSAPP_NUMBER_1`
  - `REPLACE_WITH_WHATSAPP_NUMBER_2`
- The placeholders are managed in one place: the `WA.numbers` config in `js/i18n.js`. Do not hardcode a number anywhere else.
- Main CTAs (`data-wa-cta`) currently route to number 1 as a temporary fallback via `WA.ctaNumber`. When real numbers arrive, switch them to a WhatsApp contact selector by editing `WA.ctaNumber` / the CTA routing in `js/i18n.js`.
- The footer lists separate links for both numbers (`data-wa-number="1"` and `data-wa-number="2"`).
- Do NOT display the placeholders as visible phone numbers to visitors (e.g. footer shows "WhatsApp 1" / "WhatsApp 2" labels, not `REPLACE_WITH_WHATSAPP_NUMBER_...`).
- All WhatsApp links get a localized pre-filled message (`wa.message` key) rebuilt on every language switch.

## Content rules (IMPORTANT)
- The business is car rental & private driver, NOT a tour operator. No tour packages or tour cards.
- No booking form and no backend. All conversion happens via WhatsApp.
- Rental prices must NOT be displayed anywhere.
- Do not invent phone numbers, testimonials, reviews, ratings, customer numbers, awards, or dates (e.g. "since 2012").
- The testimonials section stays an empty placeholder until real reviews exist.
- Service areas are candidate areas only, never presented as confirmed coverage.
- Fleet categories (7): Brio/Agya, All New Avanza/Xenia, Suzuki XL7, Innova Reborn, Innova Zenix, New Alphard, Hiace Premio/Luxury.
- Services (4): self-drive / lepas kunci, car rental with driver, airport delivery, hotel delivery.

## Translation conventions
- Every translatable string lives as a flat dot-encoded key (e.g. `hero.title`, `faq.3.q`, `footer.wa1`) in all four locale files, identical key sets.
- `data-i18n` replaces text content; `data-i18n-alt` targets `alt`; `data-i18n-aria-label` targets `aria-label`; `meta.title`/`meta.description` are applied directly to `<title>` and the description meta tag.
- Brand and proper nouns (car model names, "Lepas Kunci" as a local term, area names like Kuta, the brand "Ring of Bali") stay untranslated across locales.

## Conventions
- Semantic HTML5; one `h1` per page.
- CSS custom properties for the palette in `:root`.
- Mobile-first responsive layout; breakpoints at 640px and 980px.
- No external libraries, CDNs, or fonts — offline-capable. `wa.me` links are the only external URLs.

## Verification
- No build/test tooling. Run a local HTTP server (Live Server, `python3 -m http.server`) and check the page in a browser, including switching across all four languages and reloading to confirm persistence.
- Keep JS errors out of the console; scripts loaded with `defer`, `js/i18n.js` before `js/main.js`.
- Images get meaningful alt text; use actual files under `assets/images/`, never hotlinked URLs.