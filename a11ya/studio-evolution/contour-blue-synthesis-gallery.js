/* Same-view comparison; previews cover the three commissioned desktop screens. */
(() => {
  const params = new URLSearchParams(location.search);
  const language = params.get('lang') === 'fr' ? 'fr' : 'en';
  const select = document.querySelector('#view');
  const allowed = [...select.options].map(option => option.value);
  select.value = allowed.includes(params.get('view')) ? params.get('view') : 'dashboard';
  function update() {
    const view = select.value;
    const title = select.selectedOptions[0].textContent;
    const hasPreview = ['dashboard','results','new'].includes(view);
    document.querySelectorAll('[data-design]').forEach(card => {
      card.querySelectorAll('[data-open]').forEach(link => { link.href = card.dataset.file + '?lang=' + language + '#' + view; });
      card.querySelector('[data-view-label]').textContent = title;
      const img = card.querySelector('img');
      img.src = 'contour-blue-synthesis-' + card.dataset.design + '-' + (hasPreview ? view : 'dashboard') + '.png';
      img.alt = card.querySelector('h2').textContent + ' — ' + (hasPreview ? title : 'Overview preview');
    });
    document.querySelector('#preview-note').textContent = hasPreview
      ? 'Actual desktop previews · 1440 × 1000 · English'
      : 'Overview previews · links open ' + title;
    const url = new URL(location.href);
    url.searchParams.set('view',view);
    history.replaceState(null,'',url);
  }
  select.addEventListener('change',update);
  update();
})();
