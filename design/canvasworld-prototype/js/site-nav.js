(function () {
  var nav = document.querySelector('[data-od-id="site-nav"]');
  var toggle = document.querySelector('[data-od-id="nav-toggle"]');
  var menu = document.querySelector('[data-od-id="nav-links"]');
  if (!nav || !toggle || !menu) return;

  function setOpen(open) {
    nav.classList.toggle('is-menu-open', open);
    toggle.setAttribute('aria-expanded', String(open));
  }

  toggle.addEventListener('click', function () {
    setOpen(!nav.classList.contains('is-menu-open'));
  });

  menu.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      setOpen(false);
    });
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && nav.classList.contains('is-menu-open')) {
      setOpen(false);
    }
  });
})();
