/* Arc's local tools and surfaces, composed inside Lucent Vivid's original shell. */
(() => {
  if (!document.body.hasAttribute('data-vivid-arc')) return;
  function enhance() {
    document.querySelector('#sidebar').prepend(document.querySelector('.brand'),document.querySelector('.org-select'));
    document.querySelectorAll('.arc-identity').forEach(identity=>identity.remove());
    // Arc deliberately uses a permanent horizontal dock; this entry restores the
    // inherited collapsible left rail without changing the saved preference.
    document.body.dataset.collapsed=String(Boolean(saved.collapsed));
    document.title=`a11ya Studio — Lucent Vivid Arc / ${navNames()[active]}`;
    document.querySelector('.labbar b').textContent='Lucent Vivid Arc';
    document.querySelector('.sidebar-caption').textContent='Studio / Lucent Vivid Arc';
    const query='?lang='+lang+(location.hash||'#dashboard');
    document.querySelector('.indigo-comparison').innerHTML=`<span>${t('Unselected','Non sélectionné')}</span><a id="compare" href="../index.html">${t('Design index','Index des maquettes')}</a><a href="silk-lucent-vivid.html${query}">Lucent Vivid</a><a href="silk-arc.html${query}">Silk Arc</a>`;
  }
  const arcRender=render;
  render=function(...args){arcRender(...args);enhance();};
  render(false);
})();
