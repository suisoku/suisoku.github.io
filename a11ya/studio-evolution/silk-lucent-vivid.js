/* Additive color/depth study. Lucent owns all evidence and interaction state. */
(() => {
  if (!document.body.hasAttribute('data-vivid')) return;
  function enhance() {
    document.title = `a11ya Studio — Silk Lucent Vivid / ${navNames()[active]}`;
    document.querySelector('.labbar b').textContent = 'Silk Lucent Vivid';
    document.querySelector('.sidebar-caption').textContent = 'Studio / Lucent Vivid';
    document.querySelector('.real-logo').src = 'icon_v2.png';
    const query = '?lang=' + lang + (location.hash || '#dashboard');
    document.querySelector('.indigo-comparison').innerHTML = `<span>${t('Previous theme','Thème précédent')}</span><a id="compare" href="../index.html">${t('Design index','Index des maquettes')}</a><a href="silk-lucent.html${query}">Lucent</a><a href="silk-indigo.html${query}">Indigo</a><a href="silk-final.html${query}">Silk</a>`;
    if (active === 'dashboard') {
      const attention = document.querySelector('.attention');
      const banner = document.createElement('div');
      banner.className = 'vivid-review-banner';
      banner.append(attention.querySelector('.lucent-review-head'),attention.querySelector('p:not(.eyebrow)'));
      attention.prepend(banner);
    }
  }
  const lucentRender = render;
  render = function (...args) { lucentRender(...args); enhance(); };
  render(false);
})();
