/* Same-view comparison and clarity support for the unselected Contour calibration family. */
(() => {
  const key = document.body.dataset.contourCalibration;
  const calibrations = {
    harbor: {
      file: 'contour-harbor.html',
      name: 'Harbor',
      note: ['Calm marine, assured structure', 'Marine calme, structure assurée']
    },
    cadence: {
      file: 'contour-cadence.html',
      name: 'Cadence',
      note: ['Muted indigo, confident rhythm', 'Indigo sourd, rythme affirmé']
    },
    alloy: {
      file: 'contour-alloy.html',
      name: 'Alloy',
      note: ['Mineral precision, quiet state contrast', 'Précision minérale, contraste d’état calme']
    },
    signal: {
      file: 'contour-signal.html',
      name: 'Signal',
      note: ['Modular planes, technical clarity', 'Plans modulaires, clarté technique']
    },
    span: {
      file: 'contour-span.html',
      name: 'Span',
      note: ['Continuous workspace, spatial calm', 'Espace continu, calme spatial']
    }
  };
  const current = calibrations[key];
  if (!current) return;

  function currentView() {
    return typeof active === 'string' && active
      ? active
      : location.hash.slice(1).split('?')[0] || 'dashboard';
  }

  function motionText() {
    if (mediaMotion.matches) return t('Motion: system', 'Mouvement : système');
    return reduced()
      ? t('Motion: reduced', 'Mouvement : réduit')
      : t('Motion: standard', 'Mouvement : standard');
  }

  function updateMotionLabel() {
    const control = document.querySelector('#motion');
    if (!control) return;
    let label = control.querySelector('.calibration-motion-label');
    if (!label) {
      label = document.createElement('span');
      label.className = 'calibration-motion-label';
      control.append(label);
    }
    const labelText = motionText();
    label.textContent = labelText;
    control.setAttribute('aria-label', labelText);
    control.title = labelText;
  }

  function updateComparison() {
    const view = currentView();
    document.title = `a11ya Studio — ${current.name} / ${navNames()[view] || view}`;

    const name = document.querySelector('.labbar b');
    if (name) name.textContent = current.name;
    const caption = document.querySelector('.sidebar-caption');
    if (caption) {
      caption.innerHTML = `Studio / ${current.name}<span>${current.note[lang === 'fr' ? 1 : 0]}</span>`;
    }

    let comparison = document.querySelector('.contour-calibration-links');
    if (!comparison) {
      const previous = document.querySelector('#compare');
      if (!previous) return;
      comparison = document.createElement('nav');
      comparison.className = 'contour-calibration-links';
      previous.replaceWith(comparison);
    }
    comparison.setAttribute('aria-label', t('Compare Contour calibrations', 'Comparer les calibrations Contour'));
    comparison.innerHTML = `<a id="compare" class="calibration-gallery-link" href="contour-calibrations.html?lang=${lang}&view=${view}">${t('Five Contour calibrations', 'Cinq calibrations Contour')}</a><label><span>${t('Same view', 'Même vue')}</span><select id="calibration-jump" aria-label="${t('Open this view in another calibration', 'Ouvrir cette vue dans une autre calibration')}"><option value="contour-blue.html">${t('Contour Blue · selected', 'Contour Blue · sélectionné')}</option>${Object.entries(calibrations).map(([id, item]) => `<option value="${item.file}" ${id === key ? 'selected' : ''}>${item.name}</option>`).join('')}</select></label>`;
    comparison.querySelector('#calibration-jump').addEventListener('change', event => {
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
  ['input', 'change', 'click', 'toggle'].forEach(type => popover?.addEventListener(type, schedulePosition));
})();
