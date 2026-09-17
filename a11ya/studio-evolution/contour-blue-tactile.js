/* Additive identity only. Workbench still owns composition, evidence and actions. */
(() => {
  if (!document.body.hasAttribute('data-blue-tactile')) return;
  function identify() {
    const view = active || 'dashboard';
    document.title = `a11ya Studio — Contour Blue Tactile / ${navNames()[view]}`;
    document.querySelector('.labbar b').textContent = 'Contour Blue Tactile';
    const links = document.querySelector('.contour-comparisons');
    if (links) links.innerHTML = `<span class="synthesis-current">${t('Unselected','Non sélectionné')}</span><a id="compare" href="contour-blue-synthesis.html?lang=${lang}&view=${view}">${t('Blue comparison','Comparaison Blue')}</a><a data-comparison="contour-blue.html" href="contour-blue.html?lang=${lang}${location.hash || '#dashboard'}">${t('Original Blue','Blue original')}</a><a data-comparison="contour-blue-workbench.html" href="contour-blue-workbench.html?lang=${lang}${location.hash || '#dashboard'}">Workbench</a>`;
  }
  const workbenchRender = render;
  render = function (...args) { workbenchRender(...args); identify(); };
  identify();
})();
