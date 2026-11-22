// PPS Sprachumschaltung + Hamburger-Menü – 1:1 aus dem bisherigen Content (divi-core.js), nur lesbar formatiert.
// Hinweis: die gewählte Sprache wird per Cookie für ".prophotoskills.com" gemerkt.
// Auf workers.dev oder localhost klappt die Übersetzung, das Merken über Seiten hinweg aber nur per localStorage (siehe Checkliste).
// v43 (21.11.2026): Sprache der Seite steht jetzt in <html lang> – Deutsch oder eine echte Sprachfassung (/en/ …).
// Gibt es die Seite in einer Sprache wirklich (Verweis <link rel="alternate" hreflang>), führt die Fahne dorthin;
// sonst übersetzt Google wie bisher – von der Sprache der Seite aus.
var PPS_ORIGINAL = (document.documentElement.getAttribute("lang") || "de").slice(0, 2);
var PPS_ECHT = {};
document.querySelectorAll('link[rel="alternate"][hreflang]').forEach(function (l) {
  var h = l.getAttribute("hreflang");
  if (h !== "x-default") PPS_ECHT[h] = l.getAttribute("href");
});
var PPS_MENUE = { de: ["Menü öffnen", "Menü schließen"], en: ["Open menu", "Close menu"], fr: ["Ouvrir le menu", "Fermer le menu"], es: ["Abrir menú", "Cerrar menú"], pt: ["Abrir menu", "Fechar menu"], it: ["Apri menu", "Chiudi menu"], el: ["Άνοιγμα μενού", "Κλείσιμο μενού"], ja: ["メニューを開く", "メニューを閉じる"] };
var PPS_SUPPORTED = ["de", "en", "fr", "es", "pt", "it", "el", "ja"];
var PPS_COOKIE_DOMAIN = ".prophotoskills.com";

// v44: Wohin eine echte Sprachfassung führt – immer auf DIESER Adresse (live prophotoskills.com, beim Ansehen localhost),
// sonst sprang die Vorschau auf die Live-Seite (Eric 21.11.: „ein Skript, was irgendwie was abfragt“)
function ppsHier(href) {
  var u = new URL(href, location.href);
  return u.pathname + location.hash;
}

function ppsGetCookie(name) {
  var match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? decodeURIComponent(match[2]) : null;
}

function ppsGoogleAus() {
  document.cookie = "googtrans=; path=/; domain=" + PPS_COOKIE_DOMAIN + "; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  document.cookie = "googtrans=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
}

function ppsSetLanguage(lang) {
  if (PPS_ECHT[lang]) {
    // echte Sprachfassung: merken und hingehen (keine Google-Übersetzung)
    ppsGoogleAus();
    localStorage.setItem("pps_lang", lang);
    if (lang === PPS_ORIGINAL) { location.reload(); return; }
    location.href = ppsHier(PPS_ECHT[lang]);
    return;
  }
  if (lang === PPS_ORIGINAL) {
    document.cookie = "googtrans=; path=/; domain=" + PPS_COOKIE_DOMAIN + "; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    document.cookie = "googtrans=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    localStorage.setItem("pps_lang", PPS_ORIGINAL);
    location.reload();
    return;
  }
  document.cookie = "googtrans=/" + PPS_ORIGINAL + "/" + lang + "; path=/; domain=" + PPS_COOKIE_DOMAIN;
  localStorage.setItem("pps_lang", lang);
  ppsApplyTranslation(lang);
  ppsUpdateActiveFlag(lang);
}

function ppsApplyTranslation(lang) {
  var tries = 0;
  var interval = setInterval(function () {
    var combo = document.querySelector("select.goog-te-combo");
    if (combo) {
      combo.value = lang;
      combo.dispatchEvent(new Event("change"));
      clearInterval(interval);
    }
    if (++tries > 40) clearInterval(interval);
  }, 250);
}

function ppsUpdateActiveFlag(lang) {
  document.querySelectorAll(".flags .flag-btn").forEach(function (btn) {
    btn.classList.toggle("active", btn.getAttribute("data-lang") === lang);
  });
}

function ppsToggleNav() {
  var nav = document.querySelector(".pps-site-header nav");
  var btn = document.querySelector(".pps-site-header .nav-toggle");
  if (!nav || !btn) return;
  var isOpen = nav.classList.toggle("open");
  btn.classList.toggle("open", isOpen);
  btn.setAttribute("aria-expanded", isOpen ? "true" : "false");
  btn.setAttribute("aria-label", (PPS_MENUE[PPS_ORIGINAL] || PPS_MENUE.de)[isOpen ? 1 : 0]);
}

document.addEventListener("click", function (e) {
  var nav = document.querySelector(".pps-site-header nav");
  var btn = document.querySelector(".pps-site-header .nav-toggle");
  if (!nav || !nav.classList.contains("open")) return;
  if (nav.contains(e.target) || btn.contains(e.target)) return;
  nav.classList.remove("open");
  btn.classList.remove("open");
  btn.setAttribute("aria-expanded", "false");
  btn.setAttribute("aria-label", (PPS_MENUE[PPS_ORIGINAL] || PPS_MENUE.de)[0]);
});

function ppsGemerkt() {
  var s = localStorage.getItem("pps_lang");
  return s && PPS_SUPPORTED.includes(s) ? s : null;
}

function ppsDetectLang() {
  var stored = localStorage.getItem("pps_lang") || ppsGetCookie("googtrans");
  if (stored) {
    var m = stored.match(/\/([a-z]{2})$/);
    if (m && PPS_SUPPORTED.includes(m[1])) return m[1];
    if (PPS_SUPPORTED.includes(stored)) return stored;
  }
  var browserLang = (navigator.language || "en").toLowerCase().split("-")[0];
  return PPS_SUPPORTED.includes(browserLang) ? browserLang : "en";
}

function googleTranslateElementInit() {
  new google.translate.TranslateElement(
    { pageLanguage: PPS_ORIGINAL, includedLanguages: PPS_SUPPORTED.join(","), autoDisplay: false },
    "google_translate_element"
  );
  var lang = ppsDetectLang();
  // v43: Hat der Besucher selbst eine Sprache gewählt (Fahne) und gibt es diese Seite darin echt → dorthin.
  // Kommt die Sprache nur vom Browser und gibt es sie echt → nichts übersetzen (Seite bleibt, wie sie ist; Fahnen zeigen den Weg).
  if (PPS_ECHT[lang]) {
    // v44: weitergeleitet wird nur von einer deutschen Seite aus – wer eine Sprachseite (/en/ …) aufruft, bleibt dort
    if (PPS_ORIGINAL === "de" && lang !== "de" && ppsGemerkt() === lang) { location.replace(ppsHier(PPS_ECHT[lang])); return; }
    ppsUpdateActiveFlag(PPS_ORIGINAL);
    return;
  }
  ppsUpdateActiveFlag(lang);
  if (lang !== PPS_ORIGINAL) ppsApplyTranslation(lang);
}

// v44: Wer eine echte Sprachseite (/en/ …) aufruft, hat diese Sprache gewählt – sie wird gemerkt, eine alte Google-Übersetzung
// wird abgeschaltet. Ausnahme: gemerkt ist eine Sprache, die es für diese Seite noch nicht echt gibt (z. B. fr) – dann übersetzt Google weiter.
(function () {
  if (PPS_ORIGINAL === "de") {
    // v45 (Eric 21.11.: „Besucher mit englischem Browser sofort auf die englische Seite“):
    // Auf einer deutschen Seite geht es sofort zur echten Sprachfassung – nach gemerkter Wahl (Fahne) oder, beim ersten Besuch,
    // nach der Browser-Sprache. Wer selbst Deutsch gewählt hat, bleibt. Suchmaschinen und Prüf-Programme werden nie umgeleitet,
    // damit Google die deutschen Seiten weiter als deutsch findet.
    var bot = /bot|crawl|spider|slurp|google|bing|yandex|baidu|duckduck|facebookexternal|lighthouse|headless|preview/i.test(navigator.userAgent || "");
    var g = ppsGemerkt();
    var b = (navigator.language || "").toLowerCase().split("-")[0];
    var ziel = g || (bot ? null : b);
    if (ziel && ziel !== "de" && PPS_ECHT[ziel]) location.replace(ppsHier(PPS_ECHT[ziel]));
    return;
  }
  var g = ppsGemerkt();
  if (!g || PPS_ECHT[g]) {
    localStorage.setItem("pps_lang", PPS_ORIGINAL);
    ppsGoogleAus();
  }
})();
