/* === PPS Google-Translate-Loader v1 ===
   Fehlte seit dem Umstieg von pps-site.js auf jquery.min.js + divi-core.js:
   divi-core.js enthaelt zwar ppsSetLanguage()/ppsApplyTranslation(), aber
   ppsApplyTranslation() pollt bis zu 10 Sekunden lang nach dem von Google
   erzeugten <select class="goog-te-combo">-Element - das aber nie entsteht,
   wenn Googles eigenes Translate-Skript nie geladen wird. Deshalb wirkte
   die Sprachumschaltung "haengend": Klick tat scheinbar nichts, bis das
   Polling nach 10s aufgab.
   Dieses Skript laedt Googles Translate-Widget nach und ruft beim Laden
   automatisch googleTranslateElementInit() auf (Callback-Name per ?cb=
   Parameter), die Funktion selbst kommt weiterhin aus divi-core.js. */
(function () {
  var s = document.createElement('script');
  s.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
  s.async = true;
  document.head.appendChild(s);
})();
