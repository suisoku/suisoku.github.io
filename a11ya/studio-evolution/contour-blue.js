/* Local comparison navigation only. Product interactions reuse the accepted Silk extension. */
(() => {
  function updateComparison() {
    document.title = document.title.replace('Contour /', 'Contour Blue /');
    document.querySelector('.labbar b').textContent = 'Contour Blue';
    let links = document.querySelector('.contour-comparisons');
    if (!links) {
      const previous = document.querySelector('#compare');
      links = document.createElement('nav');
      links.className = 'contour-comparisons';
      previous.replaceWith(links);
      for (const file of ['contour.html', 'silk-final.html']) {
        const link = document.createElement('a');
        if (file === 'contour.html') link.id = 'compare';
        link.dataset.comparison = file;
        links.append(link);
      }
    }
    links.setAttribute('aria-label', t('Compare prototypes', 'Comparer les prototypes'));
    links.querySelectorAll('a').forEach(link => {
      const original = link.dataset.comparison === 'contour.html';
      link.textContent = original ? t('Original Contour', 'Contour original') : t('Current Silk', 'Silk actuel');
      link.href = link.dataset.comparison + '?lang=' + lang + location.hash;
    });
  }
  const renderBase = render;
  render = function (...args) {
    renderBase(...args);
    updateComparison();
  };
  updateComparison();

  // Filters can hide/restore the evidence column and move their own trigger.
  // Re-anchor after that layout change without replacing the shared interaction code.
  const popover = document.querySelector('#silk-popover');
  let positionFrame = 0;
  function schedulePosition() {
    cancelAnimationFrame(positionFrame);
    positionFrame = requestAnimationFrame(() => {
      if (!popover.matches(':popover-open')) return;
      const source = document.querySelector('[aria-controls="silk-popover"][aria-expanded="true"]');
      if (!source) return;
      const rect = source.getBoundingClientRect();
      const below = innerHeight - rect.bottom - 20;
      const above = rect.top - 20;
      const down = below >= 360 || below >= above;
      popover.style.maxHeight = Math.max(160, down ? below : above) + 'px';
      popover.style.left = Math.max(12, Math.min(rect.right - popover.offsetWidth, innerWidth - popover.offsetWidth - 12)) + 'px';
      popover.style.top = (down ? rect.bottom + 8 : Math.max(12, rect.top - popover.offsetHeight - 8)) + 'px';
    });
  }
  popover.addEventListener('input', schedulePosition);
  popover.addEventListener('change', schedulePosition);
  popover.addEventListener('click', schedulePosition);
  popover.addEventListener('toggle', schedulePosition);
})();
