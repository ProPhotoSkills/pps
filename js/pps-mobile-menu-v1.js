/* === PPS Mobile-Menü Toggle v1 ===
   Eigenstaendig, KEINE jQuery-Abhaengigkeit. Funktioniert unabhaengig davon,
   ob Divis eigenes jQuery-Bundle auf der jeweiligen Seite sauber initialisiert
   (auf komplexen Seiten mit vielen anderen Plugins/Skripten kann das
   kollidieren). Klont beim Laden das Desktop-Nav in ein mobiles Dropdown,
   oeffnet/schliesst es per Klick auf den Hamburger-Button.
   Kann parallel zu jquery.min.js/divi-core.js geladen werden, entfernt
   vorher etwaige bereits gebundene Klick-Handler, um Doppel-Toggle zu
   vermeiden. */
(function () {
  function initMobileMenu() {
    document.querySelectorAll('.et_pb_menu__wrap, .et_pb_menu').forEach(function (menuWrap) {
      var desktopList = menuWrap.querySelector('.et-menu, .et_pb_menu__menu nav ul');
      var mobileNavWrap = menuWrap.querySelector('.et_mobile_nav_menu');
      if (!desktopList || !mobileNavWrap) return;

      var mobileNav = mobileNavWrap.querySelector('.mobile_nav');
      var bar = mobileNavWrap.querySelector('.mobile_menu_bar');
      if (!mobileNav || !bar) return;

      if (bar.dataset.ppsMenuBound === '1') return; // schon initialisiert
      bar.dataset.ppsMenuBound = '1';

      var mobileMenu = mobileNavWrap.querySelector('.et_mobile_menu');
      if (!mobileMenu) {
        mobileMenu = desktopList.cloneNode(true);
        mobileMenu.classList.add('et_mobile_menu');
        mobileMenu.removeAttribute('id');
        mobileMenu.style.display = 'none';
        mobileNavWrap.appendChild(mobileMenu);

        mobileMenu.querySelectorAll('a').forEach(function (link) {
          link.addEventListener('click', function () {
            mobileNav.classList.remove('opened');
            mobileNav.classList.add('closed');
            mobileMenu.style.display = 'none';
          });
        });
      }

      // Klon des Buttons ersetzt das Original -> entfernt garantiert alle
      // zuvor (z.B. von Divis eigenem, evtl. nicht sauber laufendem Skript)
      // gebundenen Click-Handler, damit hier nur EIN Handler aktiv ist.
      var freshBar = bar.cloneNode(true);
      bar.parentNode.replaceChild(freshBar, bar);
      bar = freshBar;

      bar.addEventListener('click', function (e) {
        e.preventDefault();
        var isClosed = mobileNav.classList.contains('closed');
        if (isClosed) {
          mobileNav.classList.remove('closed');
          mobileNav.classList.add('opened');
          mobileMenu.style.display = 'block';
        } else {
          mobileNav.classList.remove('opened');
          mobileNav.classList.add('closed');
          mobileMenu.style.display = 'none';
        }
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMobileMenu);
  } else {
    initMobileMenu();
  }
})();
