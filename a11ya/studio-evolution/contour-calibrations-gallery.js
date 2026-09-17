/* Local comparison entry for five unselected Contour calibration studies. */
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
  const calibrations = [
    {
      id: 'harbor', number: '01', name: 'Harbor',
      line: ['Marine confidence, without the glare.', 'Une assurance marine, sans éclat agressif.'],
      detail: ['Navy and denim structure meet a slightly warm-white canvas. Subtle state tint and firm perimeter contrast replace Flux’s bright cyan fields, while metrics and evidence stay in one steel-blue family.', 'Une structure marine et denim rencontre un canevas blanc légèrement chaud. Une teinte d’état subtile et un contour ferme remplacent les aplats cyan de Flux, tandis que mesures et preuves restent dans une même famille bleu acier.'],
      tags: [['Warm-white canvas', 'Canevas blanc chaud'], ['Denim structure', 'Structure denim'], ['Quiet states', 'États calmes']]
    },
    {
      id: 'cadence', number: '02', name: 'Cadence',
      line: ['Pulse confidence at a quieter volume.', 'L’assurance de Pulse, à volume réduit.'],
      detail: ['Charcoal-indigo navigation and softened cobalt details create rhythm through contrast and typography. Review stays white instead of becoming a large saturated plane.', 'La navigation indigo anthracite et les détails cobalt adoucis créent le rythme par le contraste et la typographie. La revue reste blanche au lieu de devenir un grand plan saturé.'],
      tags: [['Charcoal-indigo', 'Indigo anthracite'], ['Soft cobalt', 'Cobalt adouci'], ['White review plane', 'Plan de revue blanc']]
    },
    {
      id: 'alloy', number: '03', name: 'Alloy',
      line: ['Futuristic by precision, not effects.', 'Futuriste par la précision, pas par les effets.'],
      detail: ['Deep marine, mineral blue-grey and one desaturated blue-violet hairline create micro-depth. There is no blur, detached halo or ornamental glow.', 'Le marine profond, le bleu-gris minéral et un filet bleu-violet désaturé créent une micro-profondeur. Aucun flou, halo détaché ni éclat ornemental.'],
      tags: [['Mineral neutral', 'Neutre minéral'], ['Fine hairlines', 'Filets fins'], ['Micro-depth', 'Micro-profondeur']]
    },
    {
      id: 'signal', number: '04', name: 'Signal',
      line: ['A workspace assembled like an instrument.', 'Un espace assemblé comme un instrument.'],
      detail: ['Nested technical planes, connected modules and grouped controls make workflow relationships explicit. Crisp construction carries the energy; selection uses a quiet perimeter and compact marker.', 'Des plans techniques imbriqués, des modules connectés et des commandes groupées explicitent les relations du parcours. La construction nette porte l’énergie ; la sélection utilise un contour calme et un repère compact.'],
      tags: [['Nested planes', 'Plans imbriqués'], ['Grouped controls', 'Commandes groupées'], ['Compact marker', 'Repère compact']]
    },
    {
      id: 'span', number: '05', name: 'Span',
      line: ['One continuous field for careful review.', 'Un champ continu pour une revue attentive.'],
      detail: ['Sectional bands and shared planes reduce card boundaries so content emerges directly from the canvas. Marine-indigo contrast gives the workspace structure without detached surfaces or visual pressure.', 'Des bandes sectionnelles et des plans partagés réduisent les limites de cartes afin que le contenu émerge du canevas. Le contraste marine-indigo structure l’espace sans surfaces détachées ni pression visuelle.'],
      tags: [['Sectional bands', 'Bandes sectionnelles'], ['Shared planes', 'Plans partagés'], ['Continuous field', 'Champ continu']]
    }
  ];

  function updateURL() {
    const url = new URL(location.href);
    url.searchParams.set('lang', locale);
    url.searchParams.set('view', view);
    history.replaceState(null, '', url);
  }

  function stage() {
    return '<span class="calibration-stage" aria-hidden="true"><i class="calibration-stage-rail"></i><i class="calibration-stage-main"><i class="calibration-stage-bar"></i><i class="calibration-stage-panels"><i></i><i></i></i></i></span>';
  }

  function renderGallery() {
    const names = viewNames();
    if (!names[view]) view = 'dashboard';
    document.documentElement.lang = locale;
    document.title = copy('Contour calibration — five unselected directions', 'Calibration Contour — cinq directions non sélectionnées');
    document.querySelector('#calibration-gallery').innerHTML = `
      <header class="calibration-gallery-topbar">
        <a class="calibration-gallery-brand" href="contour-blue.html?lang=${locale}#dashboard"><img src="a11ya-logo.png" alt=""><span>a11ya.</span></a>
        <div class="calibration-gallery-tools"><span>${copy('STUDIO / CONTOUR CALIBRATION', 'STUDIO / CALIBRATION CONTOUR')}</span><label><span class="calibration-sr-only">${copy('Language', 'Langue')}</span><select id="calibration-gallery-language"><option value="en" ${locale === 'en' ? 'selected' : ''}>EN</option><option value="fr" ${locale === 'fr' ? 'selected' : ''}>FR</option></select></label></div>
      </header>
      <main class="calibration-gallery-main">
        <header class="calibration-gallery-intro">
          <div><p class="calibration-gallery-kicker">${copy('Unselected calibration studies · September 2026', 'Études de calibration non sélectionnées · septembre 2026')}</p><h1>${copy('More personality.<br><em>Less visual pressure.</em>', 'Plus de personnalité.<br><em>Moins de pression visuelle.</em>')}</h1></div>
          <div class="calibration-gallery-intro-copy"><p>${copy('Five Contour studies share one quieter state language. Harbor, Cadence and Alloy refine the calm set; Signal and Span test radically different modular and continuous surface construction without changing the workflow.', 'Cinq études Contour partagent un langage d’état plus calme. Harbor, Cadence et Alloy affinent l’ensemble sobre ; Signal et Span explorent des constructions de surface radicalement différentes, modulaires et continues, sans changer le parcours.')}</p><a href="contour-blue.html?lang=${locale}#${view}">${copy('Open selected Contour Blue at this view', 'Ouvrir Contour Blue sélectionné sur cette vue')} ↗</a></div>
        </header>
        <section class="calibration-gallery-picker" aria-labelledby="calibration-picker-title"><div><p id="calibration-picker-title">${copy('Compare the same workflow moment', 'Comparer le même instant du parcours')}</p><span>${copy('Choose one of the ten canonical views.', 'Choisissez l’une des dix vues de référence.')}</span></div><label>${copy('View', 'Vue')}<select id="calibration-gallery-view">${Object.entries(names).map(([id, label]) => `<option value="${id}" ${id === view ? 'selected' : ''}>${label}</option>`).join('')}</select></label></section>
        <div class="calibration-gallery-cards">${calibrations.map(item => `
          <article class="calibration-gallery-card calibration-gallery-${item.id}">
            <a class="calibration-gallery-preview" data-calibration-entry="${item.id}" href="contour-${item.id}.html?lang=${locale}#${view}" aria-label="${copy('Open', 'Ouvrir')} ${item.name}"><span>${item.number} / ${item.name}</span>${stage()}<span>${copy('Open full prototype', 'Ouvrir le prototype')} ↗</span></a>
            <div class="calibration-gallery-card-body"><h2>${item.name}</h2><h3>${item.line[locale === 'fr' ? 1 : 0]}</h3><p>${item.detail[locale === 'fr' ? 1 : 0]}</p><ul>${item.tags.map(tag => `<li>${tag[locale === 'fr' ? 1 : 0]}</li>`).join('')}</ul><div class="calibration-gallery-actions"><a class="calibration-gallery-open" data-calibration-entry="${item.id}" href="contour-${item.id}.html?lang=${locale}#${view}">${copy('Explore', 'Explorer')} ${item.name}<span>↗</span></a><a href="contour-${item.id}.html?lang=${locale}#results">${copy('Results', 'Résultats')}</a><a href="contour-${item.id}.html?lang=${locale}#new">${copy('Launch', 'Lancement')}</a></div></div>
          </article>`).join('')}</div>
        <section class="calibration-gallery-scope"><div><p class="calibration-gallery-kicker">${copy('Fixed workflow and limits', 'Parcours et limites fixes')}</p><h2>${copy('Contour bounds. Fictional evidence. Four procedures. No score or production capability.', 'Limites Contour. Preuves fictives. Quatre procédures. Aucun score ni fonction de production.')}</h2></div><p>${copy('All five studies reuse the complete Contour content and interaction runtime: ten views, EN/FR, filters, popovers, visit-only drafts, explicit browser-control states and results beside evidence. Signal and Span preserve the macro grid while changing surface construction. Earlier studies remain intact. Contour Blue remains selected; this family is explicitly unselected.', 'Les cinq études réutilisent l’intégralité du contenu et des interactions Contour : dix vues, EN/FR, filtres, fenêtres contextuelles, brouillons limités à la visite, états explicites du contrôle du navigateur et résultats avec preuves. Signal et Span préservent la grille globale tout en changeant la construction des surfaces. Les études antérieures restent intactes. Contour Blue reste sélectionné ; cette famille est explicitement non sélectionnée.')}</p></section>
      </main>`;

    document.querySelector('#calibration-gallery-language').addEventListener('change', event => {
      locale = event.target.value;
      updateURL();
      renderGallery();
      document.querySelector('#calibration-gallery-language').focus();
    });
    document.querySelector('#calibration-gallery-view').addEventListener('change', event => {
      view = event.target.value;
      updateURL();
      document.querySelectorAll('[data-calibration-entry]').forEach(link => {
        link.href = `contour-${link.dataset.calibrationEntry}.html?lang=${locale}#${view}`;
      });
    });
  }

  renderGallery();
})();
