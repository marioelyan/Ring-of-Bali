(function () {
  "use strict";

  var navToggle = document.querySelector(".nav-toggle");
  var siteNav = document.querySelector(".site-nav");

  if (!navToggle || !siteNav) return;

  function label(key, fallback) {
    if (window.i18nT) return window.i18nT(key);
    return fallback;
  }

  navToggle.addEventListener("click", function () {
    var isOpen = siteNav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
    navToggle.setAttribute("aria-label", label(isOpen ? "nav.toggle.close" : "nav.toggle.open", isOpen ? "Close menu" : "Toggle menu"));
  });

  siteNav.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      siteNav.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
      navToggle.setAttribute("aria-label", label("nav.toggle.open", "Toggle menu"));
    });
  });

  window.addEventListener("resize", function () {
    if (window.innerWidth >= 980) {
      siteNav.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
      navToggle.setAttribute("aria-label", label("nav.toggle.open", "Toggle menu"));
    }
  });
})();