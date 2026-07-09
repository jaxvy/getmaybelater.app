// Maybe Later: minimal progressive enhancement.
// The site is fully functional without JS; this only adds niceties.
(function () {
  "use strict";

  // Mobile nav toggle
  var nav = document.querySelector("[data-nav]");
  var toggle = document.querySelector("[data-nav-toggle]");
  if (nav && toggle) {
    toggle.addEventListener("click", function () {
      var open = nav.getAttribute("data-open") === "true";
      nav.setAttribute("data-open", String(!open));
      toggle.setAttribute("aria-expanded", String(!open));
    });
    // Close the menu after following an in-page link
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) {
        nav.setAttribute("data-open", "false");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  // Auto-fill current year in footers
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = String(new Date().getFullYear());
  });

  // ---------------------------------------------------------------------------
  // Language / translations
  // Picks a default from (1) a saved choice, (2) the visitor's country via a
  // lightweight IP lookup, (3) the browser's language, then falls back to
  // English. The flag picker in the header lets visitors override it, and the
  // choice is remembered. Strings live in assets/js/i18n.js.
  // ---------------------------------------------------------------------------
  var DICT = window.I18N;
  var META = window.I18N_META;
  if (!DICT || !META) return;

  var STORE_KEY = "ml_lang";
  var DEFAULT_LANG = "en";
  var select = document.querySelector("[data-lang-select]");
  var current = DEFAULT_LANG;

  function translate(lang, key) {
    var table = DICT[lang];
    if (table && table[key] != null) return table[key];
    var en = DICT[DEFAULT_LANG];
    return en ? en[key] : null;
  }

  function apply(lang) {
    if (!DICT[lang]) lang = DEFAULT_LANG;
    current = lang;
    document.documentElement.setAttribute("lang", lang);

    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var v = translate(lang, el.getAttribute("data-i18n"));
      if (v != null) el.textContent = v;
    });
    document.querySelectorAll("[data-i18n-html]").forEach(function (el) {
      var v = translate(lang, el.getAttribute("data-i18n-html"));
      if (v != null) el.innerHTML = v;
    });
    document.querySelectorAll("[data-i18n-aria]").forEach(function (el) {
      var v = translate(lang, el.getAttribute("data-i18n-aria"));
      if (v != null) el.setAttribute("aria-label", v);
    });

    if (select && select.value !== lang) select.value = lang;
  }

  // Best-effort language guess from the browser's configured languages.
  function fromNavigator() {
    var langs = navigator.languages || (navigator.language ? [navigator.language] : []);
    for (var i = 0; i < langs.length; i++) {
      var code = String(langs[i] || "").toLowerCase().split("-")[0];
      if (code === "zh") return "zh"; // any Chinese variant -> Simplified
      if (DICT[code]) return code;
    }
    return null;
  }

  // Look up the visitor's country (IP-based) and map it to a language.
  // Non-blocking, times out quickly, and fails silently to the fallback.
  function fromGeo(cb) {
    var done = false;
    function finish(lang) {
      if (done) return;
      done = true;
      clearTimeout(timer);
      cb(lang || null);
    }
    var timer = setTimeout(function () { finish(null); }, 2500);
    try {
      fetch("https://ipapi.co/country/")
        .then(function (r) { return r.ok ? r.text() : ""; })
        .then(function (cc) {
          cc = String(cc || "").trim().toUpperCase();
          finish(META.countryToLang[cc] || null);
        })
        .catch(function () { finish(null); });
    } catch (e) {
      finish(null);
    }
  }

  // React to a manual choice from the picker (and remember it).
  if (select) {
    select.addEventListener("change", function () {
      var lang = select.value;
      try { localStorage.setItem(STORE_KEY, lang); } catch (e) {}
      apply(lang);
    });
  }

  var saved = null;
  try { saved = localStorage.getItem(STORE_KEY); } catch (e) {}

  if (saved && DICT[saved]) {
    // Honor the visitor's explicit choice; no geo lookup needed.
    apply(saved);
  } else {
    // Show something sensible immediately (browser language or English),
    // then refine by geolocation once it resolves. Geo wins because the
    // request is for a geo-based default.
    apply(fromNavigator() || DEFAULT_LANG);
    fromGeo(function (geoLang) {
      if (geoLang && DICT[geoLang]) apply(geoLang);
    });
  }
})();
