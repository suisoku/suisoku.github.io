(() => {
  const params = new URLSearchParams(location.search);
  const views = ['dashboard','projects','results','live','new'];
  const names = {dashboard:'overview',projects:'projects',results:'results and evidence',live:'desktop and run journal',new:'new audit'};
  const locale = params.get('lang') === 'fr' ? 'fr' : 'en';
  const select = document.querySelector('#view');
  select.value = views.includes(params.get('view')) ? params.get('view') : 'dashboard';
  function update() {
    const view = select.value;
    document.querySelectorAll('[data-open]').forEach(a => a.href = a.dataset.open + '.html?lang=' + locale + '#' + view);
    document.querySelectorAll('[data-source]').forEach(a => a.href = a.dataset.source + '.html?lang=' + locale + '#' + view);
    document.querySelectorAll('[data-preview]').forEach(img => {
      img.src = 'silk-indigo-preview-' + img.dataset.preview + '-' + view + '.png';
      img.alt = (img.dataset.preview === 'precision' ? 'Silk Indigo Precision' : 'Silk Indigo') + ' ' + names[view] + ' at 1440 by 1000';
    });
    const next = new URL(location.href);
    next.searchParams.set('view',view);
    next.searchParams.set('lang',locale);
    history.replaceState(null,'',next);
  }
  select.addEventListener('change',update);
  update();
})();
