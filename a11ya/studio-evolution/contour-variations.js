/* Shared navigation and clarity improvements for the three unselected Contour studies. */
(() => {
  const key = document.body.dataset.contourVariant;
  const variants = {
    air: {file:'contour-air.html', name:'Air', note:['Quiet light, fewer edges','Lumière calme, moins de contours']},
    pulse: {file:'contour-pulse.html', name:'Pulse', note:['Richer color, controlled energy','Couleur riche, énergie maîtrisée']},
    ledger: {file:'contour-ledger.html', name:'Ledger', note:['Editorial precision, warm paper','Précision éditoriale, papier chaud']}
  };
  const current = variants[key];
  if (!current) return;

  function currentView() {
    return typeof active === 'string' && active ? active : ((location.hash.slice(1).split('?')[0]) || 'dashboard');
  }

  function motionText() {
    if (mediaMotion.matches) return t('Motion: system','Mouvement : système');
    return reduced() ? t('Motion: reduced','Mouvement : réduit') : t('Motion: standard','Mouvement : standard');
  }

  function updateMotionLabel() {
    const control = document.querySelector('#motion');
    if (!control) return;
    let label = control.querySelector('.motion-label');
    if (!label) {
      label = document.createElement('span');
      label.className = 'motion-label';
      control.append(label);
    }
    const text = motionText();
    label.textContent = text;
    control.setAttribute('aria-label', text);
    control.title = text;
  }

  function updateComparison() {
    const view = currentView();
    document.title = `a11ya Studio — ${current.name} / ${navNames()[view] || view}`;
    const name = document.querySelector('.labbar b');
    if (name) name.textContent = current.name;
    const caption = document.querySelector('.sidebar-caption');
    if (caption) caption.innerHTML = `Studio / ${current.name}<span>${current.note[lang === 'fr' ? 1 : 0]}</span>`;

    let comparison = document.querySelector('.contour-variation-links');
    if (!comparison) {
      const previous = document.querySelector('#compare');
      if (!previous) return;
      comparison = document.createElement('nav');
      comparison.className = 'contour-variation-links';
      previous.replaceWith(comparison);
    }
    comparison.setAttribute('aria-label', t('Compare Contour directions','Comparer les directions Contour'));
    comparison.innerHTML = `<a id="compare" class="variation-gallery-link" href="contour-variations.html?lang=${lang}&view=${view}">${t('All three directions','Les trois directions')}</a><label><span>${t('Same view','Même vue')}</span><select id="variation-jump" aria-label="${t('Open this view in another direction','Ouvrir cette vue dans une autre direction')}"><option value="contour-blue.html">${t('Contour Blue · selected','Contour Blue · sélectionné')}</option>${Object.entries(variants).map(([id,item]) => `<option value="${item.file}" ${id === key ? 'selected' : ''}>${item.name}</option>`).join('')}</select></label>`;
    comparison.querySelector('#variation-jump').addEventListener('change', event => {
      location.href = `${event.target.value}?lang=${lang}${location.hash || '#dashboard'}`;
    });
    updateMotionLabel();
  }

  const basePreferences = applyPreferences;
  applyPreferences = function (...args) {
    basePreferences(...args);
    updateMotionLabel();
  };

  const baseRender = render;
  render = function (...args) {
    baseRender(...args);
    updateComparison();
  };

  updateComparison();

  // Filters can change the results columns and move their trigger while a popover is open.
  const popover = document.querySelector('#silk-popover');
  let positionFrame = 0;
  function schedulePosition() {
    cancelAnimationFrame(positionFrame);
    positionFrame = requestAnimationFrame(() => {
      if (!popover?.matches(':popover-open')) return;
      const source = document.querySelector('[aria-controls="silk-popover"][aria-expanded="true"]');
      if (!source) return;
      const rect = source.getBoundingClientRect();
      const below = innerHeight - rect.bottom - 20;
      const above = rect.top - 20;
      const down = below >= 360 || below >= above;
      popover.style.maxHeight = `${Math.max(160, down ? below : above)}px`;
      popover.style.left = `${Math.max(12, Math.min(rect.right - popover.offsetWidth, innerWidth - popover.offsetWidth - 12))}px`;
      popover.style.top = `${down ? rect.bottom + 8 : Math.max(12, rect.top - popover.offsetHeight - 8)}px`;
    });
  }
  ['input','change','click','toggle'].forEach(type => popover?.addEventListener(type, schedulePosition));
})();
