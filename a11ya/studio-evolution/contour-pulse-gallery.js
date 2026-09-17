/* Local comparison entry for three unselected Contour × Pulse directions. */
(() => {
  const query = new URLSearchParams(location.search);
  let locale = query.get('lang') === 'fr' ? 'fr' : 'en';
  let view = query.get('view') || 'dashboard';
  const copy = (en, fr) => locale === 'fr' ? fr : en;
  const viewNames = () => ({
    dashboard: copy('Overview', 'Vue d’ensemble'),
    projects: copy('Projects', 'Projets'),
    audits: copy('Audit history', 'Historique des audits'),
    new: copy('New audit', 'Nouvel audit'),
    live: copy('Live audit', 'Audit en cours'),
    results: copy('Results & evidence', 'Résultats et preuves'),
    organization: copy('Organization', 'Organisation'),
    settings: copy('Settings', 'Paramètres'),
    account: copy('Account & preferences', 'Compte et préférences'),
    states: copy('State gallery', 'Galerie des états')
  });
  const directions = [
    {
      id: 'flux', number: '01', name: 'Flux',
      line: ['Marine precision, electrically clear.', 'Précision marine, clarté électrique.'],
      detail: ['A deep marine rail and ice-blue contour light sharpen the original stacked geometry. Energy comes from active edges, not a dark canvas.', 'Un rail marine profond et un contour bleu glacier affûtent la géométrie empilée d’origine. L’énergie vient des bords actifs, pas d’un canevas sombre.'],
      tags: [['Marine rail', 'Rail marine'], ['Electric contour', 'Contour électrique'], ['Light canvas', 'Canevas clair']]
    },
    {
      id: 'vector', number: '02', name: 'Vector',
      line: ['Cobalt momentum, held in place.', 'Un élan cobalt, bien cadré.'],
      detail: ['The closest translation of Pulse: confident indigo navigation and a saturated review plane, balanced by cleaner white working surfaces.', 'La traduction la plus directe de Pulse : navigation indigo affirmée et plan de revue saturé, équilibrés par des surfaces de travail blanches et nettes.'],
      tags: [['Cobalt focus', 'Focus cobalt'], ['Active saturation', 'Saturation active'], ['Clean surfaces', 'Surfaces nettes']]
    },
    {
      id: 'halo', number: '03', name: 'Halo',
      line: ['Atmosphere where evidence has depth.', 'De l’atmosphère là où la preuve prend corps.'],
      detail: ['Blue-violet light and selective translucent layers mark review and evidence depth. Opaque surfaces stay calm, precise and recognizably Contour.', 'Une lumière bleu-violet et quelques couches translucides marquent la profondeur de la revue et des preuves. Les surfaces opaques restent calmes, précises et typiquement Contour.'],
      tags: [['Selective halo', 'Halo sélectif'], ['Layered evidence', 'Preuves superposées'], ['Blue-violet', 'Bleu-violet']]
    }
  ];

  function updateURL() {
    const url = new URL(location.href);
    url.searchParams.set('lang', locale);
    url.searchParams.set('view', view);
    history.replaceState(null, '', url);
  }

  function stage() {
    return '<span class="pulse-stage" aria-hidden="true"><i class="pulse-stage-rail"></i><i class="pulse-stage-main"><i class="pulse-stage-bar"></i><i class="pulse-stage-panels"><i></i><i></i></i></i></span>';
  }

  function renderGallery() {
    const names = viewNames();
    if (!names[view]) view = 'dashboard';
    document.documentElement.lang = locale;
    document.title = copy('Contour × Pulse — three unselected directions', 'Contour × Pulse — trois directions non sélectionnées');
    document.querySelector('#pulse-gallery').innerHTML = `
      <header class="pulse-gallery-topbar">
        <a class="pulse-gallery-brand" href="contour-blue.html?lang=${locale}#dashboard"><img src="a11ya-logo.png" alt=""><span>a11ya.</span></a>
        <div class="pulse-gallery-tools"><span>${copy('STUDIO / CONTOUR × PULSE', 'STUDIO / CONTOUR × PULSE')}</span><label><span class="pulse-sr-only">${copy('Language', 'Langue')}</span><select id="pulse-gallery-language"><option value="en" ${locale === 'en' ? 'selected' : ''}>EN</option><option value="fr" ${locale === 'fr' ? 'selected' : ''}>FR</option></select></label></div>
      </header>
      <main class="pulse-gallery-main">
        <header class="pulse-gallery-intro">
          <div><p class="pulse-gallery-kicker">${copy('Unselected visual studies · September 2026', 'Études visuelles non sélectionnées · septembre 2026')}</p><h1>${copy('Contour discipline.<br><em>Pulse energy.</em>', 'La rigueur Contour.<br><em>L’énergie Pulse.</em>')}</h1></div>
          <div class="pulse-gallery-intro-copy"><p>${copy('Three ways to make the selected Contour Blue identity feel more alive and futuristic while keeping its light working canvas, evidence hierarchy and restrained tool character.', 'Trois façons de rendre l’identité Contour Blue sélectionnée plus vivante et futuriste, tout en conservant son canevas clair, sa hiérarchie des preuves et son caractère d’outil mesuré.')}</p><a href="contour-blue.html?lang=${locale}#${view}">${copy('Open selected Contour Blue at this view', 'Ouvrir Contour Blue sélectionné sur cette vue')} ↗</a></div>
        </header>
        <section class="pulse-gallery-picker" aria-labelledby="pulse-picker-title"><div><p id="pulse-picker-title">${copy('Compare the same workflow moment', 'Comparer le même instant du parcours')}</p><span>${copy('Choose one of the ten canonical views.', 'Choisissez l’une des dix vues de référence.')}</span></div><label>${copy('View', 'Vue')}<select id="pulse-gallery-view">${Object.entries(names).map(([id, label]) => `<option value="${id}" ${id === view ? 'selected' : ''}>${label}</option>`).join('')}</select></label></section>
        <div class="pulse-gallery-cards">${directions.map(item => `
          <article class="pulse-gallery-card pulse-gallery-${item.id}">
            <a class="pulse-gallery-preview" data-pulse-entry="${item.id}" href="contour-${item.id}.html?lang=${locale}#${view}" aria-label="${copy('Open', 'Ouvrir')} ${item.name}"><span>${item.number} / ${item.name}</span>${stage()}<span>${copy('Open full prototype', 'Ouvrir le prototype')} ↗</span></a>
            <div class="pulse-gallery-card-body"><h2>${item.name}</h2><h3>${item.line[locale === 'fr' ? 1 : 0]}</h3><p>${item.detail[locale === 'fr' ? 1 : 0]}</p><ul>${item.tags.map(tag => `<li>${tag[locale === 'fr' ? 1 : 0]}</li>`).join('')}</ul><div class="pulse-gallery-actions"><a class="pulse-gallery-open" data-pulse-entry="${item.id}" href="contour-${item.id}.html?lang=${locale}#${view}">${copy('Explore', 'Explorer')} ${item.name}<span>↗</span></a><a href="contour-${item.id}.html?lang=${locale}#results">${copy('Results', 'Résultats')}</a><a href="contour-${item.id}.html?lang=${locale}#new">${copy('Launch', 'Lancement')}</a></div></div>
          </article>`).join('')}</div>
        <section class="pulse-gallery-scope"><div><p class="pulse-gallery-kicker">${copy('Fixed workflow and limits', 'Parcours et limites fixes')}</p><h2>${copy('Fictional evidence. Four procedures. No score, compliance claim or production capability.', 'Preuves fictives. Quatre procédures. Aucun score, aucune allégation de conformité ni fonction de production.')}</h2></div><p>${copy('All three entries reuse the complete Contour interaction and content runtime: ten views, EN/FR, filters, popovers, visit-only drafts, explicit browser-control states and results beside evidence. Air and Ledger are rejected directions; Pulse is an energy reference. Contour Blue remains selected, and Flux, Vector and Halo remain unselected explorations.', 'Les trois entrées réutilisent l’intégralité du contenu et des interactions Contour : dix vues, EN/FR, filtres, fenêtres contextuelles, brouillons limités à la visite, états explicites du contrôle du navigateur et résultats avec preuves. Air et Ledger sont rejetés ; Pulse sert de référence énergétique. Contour Blue reste sélectionné, et Flux, Vector et Halo restent des explorations non sélectionnées.')}</p></section>
      </main>`;

    document.querySelector('#pulse-gallery-language').addEventListener('change', event => {
      locale = event.target.value;
      updateURL();
      renderGallery();
      document.querySelector('#pulse-gallery-language').focus();
    });
    document.querySelector('#pulse-gallery-view').addEventListener('change', event => {
      view = event.target.value;
      updateURL();
      document.querySelectorAll('[data-pulse-entry]').forEach(link => {
        link.href = `contour-${link.dataset.pulseEntry}.html?lang=${locale}#${view}`;
      });
    });
  }

  renderGallery();
})();
