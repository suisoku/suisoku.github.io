/* Local comparison entry for the three unselected Contour directions. */
(() => {
  const query = new URLSearchParams(location.search);
  let locale = query.get('lang') === 'fr' ? 'fr' : 'en';
  let view = query.get('view') || 'dashboard';
  const copy = (en,fr) => locale === 'fr' ? fr : en;
  const views = () => ({
    dashboard:copy('Overview','Vue d’ensemble'), projects:copy('Projects','Projets'),
    audits:copy('Audit history','Historique des audits'), new:copy('New audit','Nouvel audit'),
    live:copy('Live audit','Audit en cours'), results:copy('Results & evidence','Résultats et preuves'),
    organization:copy('Organization','Organisation'), settings:copy('Settings','Paramètres'),
    account:copy('Account & preferences','Compte et préférences'), states:copy('State gallery','Galerie des états')
  });
  const variants = [
    {
      id:'air', number:'01', name:'Air',
      line:['Quiet structure, room to think.','Une structure calme, de l’espace pour réfléchir.'],
      detail:['Cool near-whites, softened boundaries and one layer of depth. The workspace recedes so decisions and evidence lead.','Des blancs froids, des limites adoucies et un seul niveau de profondeur. L’espace s’efface pour laisser les décisions et les preuves guider.'],
      tags:[['Low edge noise','Peu de contours'],['Balanced desktop','Bureau équilibré'],['Blue-teal accent','Accent bleu pétrole']]
    },
    {
      id:'pulse', number:'02', name:'Pulse',
      line:['A stronger rhythm, without visual noise.','Un rythme plus affirmé, sans bruit visuel.'],
      detail:['Ink-blue navigation, a saturated review surface and measured violet and ember accents create energy around active work.','Une navigation bleu encre, une surface de revue saturée et des accents violets et braise mesurés donnent de l’énergie au travail actif.'],
      tags:[['Richer color','Couleur plus riche'],['Dark rail','Rail sombre'],['Event-led motion','Mouvement ponctuel']]
    },
    {
      id:'ledger', number:'03', name:'Ledger',
      line:['An audit tool with an editorial voice.','Un outil d’audit à la voix éditoriale.'],
      detail:['Warm paper, graphite navigation, serif headings and rule-led grouping make dense review feel deliberate and legible.','Papier chaud, navigation graphite, titres sérif et regroupements par filets rendent la revue dense plus délibérée et lisible.'],
      tags:[['Warm neutral','Neutre chaud'],['Editorial type','Typographie éditoriale'],['Rule-led layout','Mise en page structurée']]
    }
  ];

  function updateURL() {
    const url = new URL(location.href);
    url.searchParams.set('lang', locale);
    url.searchParams.set('view', view);
    history.replaceState(null,'',url);
  }

  function renderGallery() {
    const names = views();
    if (!names[view]) view = 'dashboard';
    document.documentElement.lang = locale;
    document.title = copy('Contour Blue — three unselected directions','Contour Blue — trois directions non sélectionnées');
    document.querySelector('#variation-gallery').innerHTML = `
      <header class="variation-topbar">
        <a class="variation-brand" href="contour-blue.html?lang=${locale}#dashboard"><img src="a11ya-logo.png" alt=""><span>a11ya.</span></a>
        <div class="variation-toptools"><span>${copy('STUDIO / CONTOUR EXPLORATIONS','STUDIO / EXPLORATIONS CONTOUR')}</span><label><span class="sr-only">${copy('Language','Langue')}</span><select id="variation-language"><option value="en" ${locale === 'en' ? 'selected' : ''}>EN</option><option value="fr" ${locale === 'fr' ? 'selected' : ''}>FR</option></select></label></div>
      </header>
      <main class="variation-gallery-main">
        <header class="variation-intro">
          <div><p class="variation-kicker">${copy('Unselected visual studies · September 2026','Études visuelles non sélectionnées · septembre 2026')}</p><h1>${copy('Three ways to make<br>Contour feel more alive.','Trois façons de rendre<br>Contour plus vivant.')}</h1></div>
          <div class="variation-intro-copy"><p>${copy('The workflow stays fixed: stable navigation, projects, audit history, results beside evidence, filters, drafts and explicit browser-control states. Only the visual rhythm changes.','Le parcours reste fixe : navigation stable, projets, historique, résultats avec preuves, filtres, brouillons et états explicites du contrôle du navigateur. Seul le rythme visuel change.')}</p><a href="contour-blue.html?lang=${locale}#${view}">${copy('Open selected Contour Blue at this view','Ouvrir Contour Blue sélectionné sur cette vue')} ↗</a></div>
        </header>
        <section class="variation-picker" aria-labelledby="picker-title"><div><p id="picker-title">${copy('Compare the same moment','Comparer le même instant')}</p><span>${copy('Choose a view before opening a direction.','Choisissez une vue avant d’ouvrir une direction.')}</span></div><label>${copy('View','Vue')}<select id="variation-view">${Object.entries(names).map(([id,label]) => `<option value="${id}" ${id === view ? 'selected' : ''}>${label}</option>`).join('')}</select></label></section>
        <div class="variation-cards">${variants.map(item => `
          <article class="variation-card variation-${item.id}">
            <a class="variation-preview" data-entry="${item.id}" href="contour-${item.id}.html?lang=${locale}#${view}" aria-label="${copy('Open','Ouvrir')} ${item.name}">
              <span class="variation-number">${item.number}</span><span class="variation-swatch" aria-hidden="true"><i></i><i></i><i></i></span><span>${copy('Open full prototype','Ouvrir le prototype')} ↗</span>
            </a>
            <div class="variation-card-body"><h2>${item.name}</h2><h3>${item.line[locale === 'fr' ? 1 : 0]}</h3><p>${item.detail[locale === 'fr' ? 1 : 0]}</p><ul>${item.tags.map(tag => `<li>${tag[locale === 'fr' ? 1 : 0]}</li>`).join('')}</ul><div class="variation-actions"><a class="variation-open" data-entry="${item.id}" href="contour-${item.id}.html?lang=${locale}#${view}">${copy('Explore','Explorer')} ${item.name} <span>↗</span></a><a href="contour-${item.id}.html?lang=${locale}#results">${copy('Results','Résultats')}</a><a href="contour-${item.id}.html?lang=${locale}#new">${copy('Launch','Lancement')}</a></div></div>
          </article>`).join('')}</div>
        <section class="variation-scope"><div><p class="variation-kicker">${copy('Shared limits','Limites communes')}</p><h2>${copy('Fictional evidence. No score. No production capability.','Preuves fictives. Aucun score. Aucune fonction de production.')}</h2></div><p>${copy('Each direction includes the same four-procedure excerpt and all ten local views in English and French. No target is visited, no invitation is sent and completion never implies conformity. Contour Blue remains the selected direction.','Chaque direction comprend le même extrait de quatre procédures et les dix vues locales en anglais et en français. Aucune cible n’est visitée, aucune invitation n’est envoyée et l’achèvement n’implique jamais la conformité. Contour Blue reste la direction sélectionnée.')}</p></section>
      </main>`;
    document.querySelector('#variation-language').addEventListener('change', event => { locale = event.target.value; updateURL(); renderGallery(); document.querySelector('#variation-language').focus(); });
    document.querySelector('#variation-view').addEventListener('change', event => { view = event.target.value; updateURL(); document.querySelectorAll('[data-entry]').forEach(link => { link.href = `contour-${link.dataset.entry}.html?lang=${locale}#${view}`; }); });
  }
  renderGallery();
})();
