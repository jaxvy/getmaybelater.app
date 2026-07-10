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
  // Picks a default from (1) a saved choice, (2) the browser's configured
  // languages, (3) the device timezone as a location proxy, then falls back to
  // English. Detection is fully on-device: no network requests are made. The
  // flag picker in the header lets visitors override it, and the choice is
  // remembered. Strings live in assets/js/i18n.js.
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

  // Location proxy with no network: map the device's IANA timezone to a
  // language (e.g. Europe/Istanbul -> Turkish, Asia/Tokyo -> Japanese).
  function fromTimezone() {
    try {
      var tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (tz && META.tzToLang[tz]) return META.tzToLang[tz];
    } catch (e) {}
    return null;
  }

  // A shareable language link: ?lang=tr (or a /tr path segment, which the 404
  // page rewrites to ?lang=tr). An explicit URL wins over a saved choice so a
  // shared link always opens in its intended language.
  function fromUrl() {
    try {
      var q = new URLSearchParams(location.search).get("lang");
      if (q) { q = q.toLowerCase(); if (DICT[q]) return q; }
      var seg = location.pathname.replace(/^\/+/, "").split("/")[0].toLowerCase();
      if (seg && DICT[seg]) return seg;
    } catch (e) {}
    return null;
  }

  // Keep the address bar's ?lang= in sync with the current language, so the URL
  // is always copy-shareable. English (the default) drops the param entirely.
  function syncUrl(lang) {
    try {
      var url = new URL(location.href);
      if (lang === DEFAULT_LANG) url.searchParams.delete("lang");
      else url.searchParams.set("lang", lang);
      history.replaceState(null, "", url);
    } catch (e) {}
  }

  // React to a manual choice from the picker (remember it and update the URL).
  if (select) {
    select.addEventListener("change", function () {
      var lang = select.value;
      try { localStorage.setItem(STORE_KEY, lang); } catch (e) {}
      apply(lang);
      syncUrl(lang);
    });
  }

  var saved = null;
  try { saved = localStorage.getItem(STORE_KEY); } catch (e) {}

  var fromLink = fromUrl();
  if (fromLink) {
    // An explicit ?lang= link: honor it, remember it, and normalize the URL.
    apply(fromLink);
    try { localStorage.setItem(STORE_KEY, fromLink); } catch (e) {}
    syncUrl(fromLink);
  } else if (saved && DICT[saved]) {
    // Honor the visitor's previous choice.
    apply(saved);
  } else {
    // The browser's language list is the most direct signal for which
    // language to show; fall back to the device timezone's region, then
    // English for everywhere outside the covered languages.
    apply(fromNavigator() || fromTimezone() || DEFAULT_LANG);
  }
})();
