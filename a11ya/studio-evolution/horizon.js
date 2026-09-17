/* A separate identity; the existing Vivid study retains its own appearance. */
(() => {
  if (!document.body.hasAttribute('data-horizon')) return;
  function enhance() {
    document.title = `a11ya Studio — Horizon / ${navNames()[active]}`;
    document.querySelector('.labbar b').textContent = 'Horizon';
    document.querySelector('.sidebar-caption').textContent = 'Studio / Horizon';
    const logo = document.querySelector('.real-logo');
    logo.src = 'icon_v2_without_bg.png';
    logo.width = 80;
    logo.height = 80;
    if (!logo.parentElement.classList.contains('horizon-emblem')) {
      const emblem = document.createElement('span');
      emblem.className = 'horizon-emblem';
      emblem.setAttribute('aria-hidden', 'true');
      logo.replaceWith(emblem);
      emblem.append(logo);
    }
    const query = '?lang=' + lang + (location.hash || '#dashboard');
    document.querySelector('.indigo-comparison').innerHTML = `<span>${t('Main theme','Thème principal')}</span><a id="compare" href="../index.html">${t('Design index','Index des maquettes')}</a><a href="silk-lucent-vivid.html${query}">Vivid</a><a href="silk-lucent-vivid-arc.html${query}">Arc</a>`;
  }
  const vividRender = render;
  render = function (...args) { vividRender(...args); enhance(); };
  render(false);
})();
