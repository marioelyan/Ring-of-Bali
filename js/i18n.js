(function () {
  "use strict";

  var DEFAULT_LANG = "en";
  var SUPPORTED = ["en", "id", "ru", "zh"];
  var STORAGE_KEY = "ring-of-bali-lang";
  var LOCALE_PATH = "locales/";

  // Both WhatsApp numbers serve all services. The numbers are not final yet,
  // so only clearly marked placeholders are used.
  var WA = {
    numbers: {
      1: "REPLACE_WITH_WHATSAPP_NUMBER_1",
      2: "REPLACE_WITH_WHATSAPP_NUMBER_2"
    },
    // Main CTAs currently route to number 1 as a temporary fallback.
    // When the real numbers arrive, change this to a contact selector by
    // editing "ctaNumber" (or by driving selection per CTA from here).
    ctaNumber: "1",
    messageKey: "wa.message"
  };

  var cache = {};
  var current = DEFAULT_LANG;
  var switcherEl = null;

  function normalize(code) {
    return SUPPORTED.indexOf(code) > -1 ? code : DEFAULT_LANG;
  }

  function lookup(key) {
    var dict = cache[current] || {};
    return typeof dict[key] === "string" ? dict[key] : undefined;
  }

  function lookupDefault(key) {
    var dict = cache[DEFAULT_LANG] || {};
    return typeof dict[key] === "string" ? dict[key] : undefined;
  }

  function resolve(key) {
    var value = lookup(key);
    if (value !== undefined) return value;
    if (current !== DEFAULT_LANG) {
      value = lookupDefault(key);
      if (value !== undefined) return value;
    }
    console.warn("[i18n] Missing translation key: " + key + " (" + current + ")");
    return key;
  }

  function waNumber(num) {
    return WA.numbers[num] || WA.numbers[WA.ctaNumber];
  }

  function waHref(num, message) {
    return "https://wa.me/" + waNumber(num) + "?text=" + encodeURIComponent(message);
  }

  function updateWhatsAppLinks() {
    var message = resolve(WA.messageKey);
    document.querySelectorAll("[data-wa-cta]").forEach(function (a) {
      a.href = waHref(WA.ctaNumber, message);
    });
    document.querySelectorAll("[data-wa-number]").forEach(function (a) {
      a.href = waHref(a.getAttribute("data-wa-number"), message);
    });
  }

  function applyLanguage(lang) {
    current = normalize(lang);

    document.documentElement.setAttribute("lang", current);

    document.title = resolve("meta.title");

    var description = document.querySelector('meta[name="description"]');
    if (description) description.setAttribute("content", resolve("meta.description"));

    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      el.textContent = resolve(el.getAttribute("data-i18n"));
    });

    document.querySelectorAll("[data-i18n-alt]").forEach(function (el) {
      el.setAttribute("alt", resolve(el.getAttribute("data-i18n-alt")));
    });

    document.querySelectorAll("[data-i18n-aria-label]").forEach(function (el) {
      el.setAttribute("aria-label", resolve(el.getAttribute("data-i18n-aria-label")));
    });

    updateWhatsAppLinks();

    var currentLabel = document.querySelector(".lang-current");
    if (currentLabel) currentLabel.textContent = resolve("lang." + current);

    document.querySelectorAll(".lang-option").forEach(function (btn) {
      btn.classList.toggle("is-active", btn.getAttribute("data-lang") === current);
    });

    try {
      localStorage.setItem(STORAGE_KEY, current);
    } catch (e) {
      /* storage unavailable — language not persisted */
    }
  }

  function loadLocale(code) {
    return fetch(LOCALE_PATH + code + ".json").then(function (res) {
      if (!res.ok) throw new Error("HTTP " + res.status);
      return res.json();
    }).then(function (data) {
      cache[code] = data;
    });
  }

  function setLanguage(code) {
    var target = normalize(code);
    if (cache[target]) {
      applyLanguage(target);
      return;
    }
    loadLocale(target)
      .then(function () {
        applyLanguage(target);
      })
      .catch(function (err) {
        console.error("[i18n] Failed to load locale: " + target, err);
        if (target !== DEFAULT_LANG) applyLanguage(DEFAULT_LANG);
      });
  }

  function setMenuOpen(open) {
    var toggle = document.querySelector(".lang-toggle");
    var menu = document.querySelector(".lang-menu");
    if (menu) menu.classList.toggle("is-open", open);
    if (toggle) toggle.setAttribute("aria-expanded", String(open));
  }

  function setupSwitcher() {
    var toggle = document.querySelector(".lang-toggle");
    var menu = document.querySelector(".lang-menu");
    if (!toggle || !menu) return;

    toggle.addEventListener("click", function () {
      setMenuOpen(!menu.classList.contains("is-open"));
    });

    menu.querySelectorAll(".lang-option").forEach(function (btn) {
      btn.addEventListener("click", function () {
        setLanguage(btn.getAttribute("data-lang"));
        setMenuOpen(false);
      });
    });

    document.addEventListener("click", function (ev) {
      if (switcherEl && !switcherEl.contains(ev.target)) setMenuOpen(false);
    });

    document.addEventListener("keydown", function (ev) {
      if (ev.key === "Escape") setMenuOpen(false);
    });
  }

  function init() {
    switcherEl = document.querySelector(".lang-switcher");
    setupSwitcher();

    var stored = null;
    try {
      stored = localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      /* storage unavailable */
    }
    var target = normalize(stored || DEFAULT_LANG);

    loadLocale(DEFAULT_LANG)
      .then(function () {
        if (target === DEFAULT_LANG) {
          applyLanguage(DEFAULT_LANG);
        } else {
          setLanguage(target);
        }
      })
      .catch(function (err) {
        console.error(
          "[i18n] Could not load " + LOCALE_PATH + "en.json. " +
          "Serve the site over HTTP (e.g. VS Code Live Server, python3 -m http.server) " +
          "so fetch() can load the locale files; file:// will not work.",
          err
        );
      });
  }

  window.i18nT = resolve;

  window.i18nCheck = function () {
    var baseKeys = Object.keys(cache[DEFAULT_LANG] || {}).sort();
    SUPPORTED.forEach(function (code) {
      if (code === DEFAULT_LANG) return;
      var dict = cache[code];
      if (!dict) {
        console.warn("[i18n] locale not loaded: " + code);
        return;
      }
      var keys = Object.keys(dict).sort();
      var missing = baseKeys.filter(function (k) {
        return keys.indexOf(k) === -1;
      });
      var extra = keys.filter(function (k) {
        return baseKeys.indexOf(k) === -1;
      });
      if (missing.length) console.warn("[i18n] " + code + " — missing keys: " + missing.join(", "));
      if (extra.length) console.warn("[i18n] " + code + " — extra keys: " + extra.join(", "));
      if (!missing.length && !extra.length) {
        console.info("[i18n] " + code + " key set matches en.json");
      }
    });
  };

  document.addEventListener("DOMContentLoaded", init);
})();