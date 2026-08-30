/* === PPS Universal Site JS ===
   Sprachumschaltung (Google Translate Integration) + PPS-Cookie/State-Handling.
   Extrahiert aus dem Original-JS-Bundle. Universal fuer alle Seiten unter /content/ nutzbar.
   Voraussetzung im HTML: <div id="google_translate_element"></div> irgendwo im <body>
   und die Google-Translate-Ladezeile ganz unten in dieser Datei (per <script> im HTML
   oder hier als dynamischer Loader). */

var PPS_ORIGINAL="de";var PPS_SUPPORTED=["de","en","fr","es","pt","it","el","ja"];var PPS_COOKIE_DOMAIN=".prophotoskills.com";function ppsGetCookie(name){var match=document.cookie.match(new RegExp("(^| )"+name+"=([^;]+)"));return match?decodeURIComponent(match[2]):null}
function ppsSetLanguage(lang){if(lang===PPS_ORIGINAL){document.cookie="googtrans=; path=/; domain="+PPS_COOKIE_DOMAIN+"; expires=Thu, 01 Jan 1970 00:00:00 GMT";document.cookie="googtrans=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";localStorage.setItem("pps_lang","de");location.reload();return}
document.cookie="googtrans=/de/"+lang+"; path=/; domain="+PPS_COOKIE_DOMAIN;localStorage.setItem("pps_lang",lang);ppsApplyTranslation(lang);ppsUpdateActiveFlag(lang)}
function ppsApplyTranslation(lang){var tries=0;var interval=setInterval(function(){var combo=document.querySelector("select.goog-te-combo");if(combo){combo.value=lang;combo.dispatchEvent(new Event("change"));clearInterval(interval)}
if(++tries>40)clearInterval(interval);},250)}
function ppsUpdateActiveFlag(lang){document.querySelectorAll(".flags .flag-btn").forEach(function(btn){btn.classList.toggle("active",btn.getAttribute("data-lang")===lang)})}
function ppsToggleNav(){var nav=document.querySelector(".pps-site-header nav");var btn=document.querySelector(".pps-site-header .nav-toggle");if(!nav||!btn)return;var isOpen=nav.classList.toggle("open");btn.classList.toggle("open",isOpen);btn.setAttribute("aria-expanded",isOpen?"true":"false");btn.setAttribute("aria-label",isOpen?"Menü schließen":"Menü öffnen")}
document.addEventListener("click",function(e){var nav=document.querySelector(".pps-site-header nav");var btn=document.querySelector(".pps-site-header .nav-toggle");if(!nav||!nav.classList.contains("open"))return;if(nav.contains(e.target)||btn.contains(e.target))return;nav.classList.remove("open");btn.classList.remove("open");btn.setAttribute("aria-expanded","false");btn.setAttribute("aria-label","Menü öffnen")});function ppsDetectLang(){var stored=localStorage.getItem("pps_lang")||ppsGetCookie("googtrans");if(stored){var m=stored.match(/\/([a-z]{2})$/);if(m&&PPS_SUPPORTED.includes(m[1]))return m[1];if(PPS_SUPPORTED.includes(stored))return stored}
var browserLang=(navigator.language||"en").toLowerCase().split("-")[0];return PPS_SUPPORTED.includes(browserLang)?browserLang:"en"}
function googleTranslateElementInit(){new google.translate.TranslateElement({pageLanguage:"de",includedLanguages:PPS_SUPPORTED.join(","),autoDisplay:!1},"google_translate_element");var lang=ppsDetectLang();ppsUpdateActiveFlag(lang);if(lang!==PPS_ORIGINAL){ppsApplyTranslation(lang)}}


/* Google Translate Widget laden + Callback registrieren */
(function() {
  var s = document.createElement('script');
  s.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
  s.async = true;
  document.head.appendChild(s);
})();
