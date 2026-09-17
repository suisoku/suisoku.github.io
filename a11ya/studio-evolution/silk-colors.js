/* One Silk layout; palette changes never rerender its working surface. */
(() => {
  const choices = {
    violet: ['White Violet', 'Violet sur blanc'],
    blue: ['Landing Blue', 'Bleu de la page publique'],
    mineral: ['Mineral', 'Minéral']
  };
  let palette = new URL(location.href).searchParams.get('palette');
  if (!choices[palette]) palette = 'violet';
  const host = document.getElementById('palette-tools');
  function syncUrl() {
    const url = new URL(location.href);
    url.searchParams.set('palette', palette);
    history.replaceState(history.state, '', url);
  }
  function renderTools() {
    const fr = document.documentElement.lang === 'fr';
    host.innerHTML = `<div class="palette-bar"><span class="palette-heading">SILK <span>${fr?'Étude des couleurs':'Color study'}</span></span><label for="silk-palette">${fr?'Palette':'Palette'}<select id="silk-palette">${Object.entries(choices).map(([key,names])=>`<option value="${key}" ${palette===key?'selected':''}>${names[fr?1:0]}</option>`).join('')}</select></label><a href="silk.html?lang=${fr?'fr':'en'}${location.hash || '#dashboard'}">${fr?'Silk original':'Original Silk'} ↗</a></div>`;
    host.querySelector('select').addEventListener('change', event => {
      palette = event.target.value;
      document.body.dataset.palette = palette;
      syncUrl();
    });
    document.body.dataset.palette = palette;
    syncUrl();
  }
  renderTools();
  new MutationObserver(renderTools).observe(document.documentElement, {attributes:true, attributeFilter:['lang']});
  addEventListener('hashchange', () => {
    syncUrl();
    const link = host.querySelector('a');
    link.hash = location.hash || '#dashboard';
  });
})();
