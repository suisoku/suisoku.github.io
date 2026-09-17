/* Additive prototype composition. Original Blue and its runtime are unchanged. */
(() => {
  const kind = document.body.dataset.blueSynthesis;
  const name = kind === 'workbench' ? 'Contour Blue Workbench' : 'Contour Blue Refined';
  const originalInspector = inspector;
  if (kind === 'workbench') {
    inspector = function () {
      const d = data()[selected];
      if (!d) return originalInspector();
      const nextSteps = {
        '11.1.1': t('Associate a visible label with the email input, then recheck this procedure.', 'Associez une étiquette visible au champ e-mail, puis vérifiez cette procédure.'),
        '3.2.1': t('Inspect the rendered text against its background. Record a measurement or keep the result untested.', 'Examinez le texte sur son fond réel. Consignez une mesure ou conservez le résultat non testé.'),
        '8.1.1': t('No change is indicated by this procedure. Continue reviewing the other decisions.', 'Cette procédure ne demande pas de modification. Poursuivez la revue des autres décisions.'),
        '4.1.1': t('Revisit applicability if the page gains media or its captured state changes.', 'Réévaluez l’applicabilité si des médias sont ajoutés ou si l’état capturé change.')
      };
      return `<aside class="inspector" id="inspector" aria-label="${t('Selected evidence','Preuve sélectionnée')}">
        <div class="inspector-head"><span class="eyebrow">${t('Selected finding / evidence','Résultat sélectionné / preuves')}</span><button class="quiet" data-action="close-detail" aria-label="${t('Close evidence and return to result','Fermer les preuves et revenir au résultat')}">×</button></div>
        <div class="wb-selected"><span>${esc(d.id)} · ${esc(d.theme)}</span>${badge(d.outcome,d.kind)}</div>
        <h2>${esc(d.title)}</h2><p class="wb-observation">${esc(d.detail)}</p>
        <section class="wb-evidence"><div class="wb-evidence-heading"><strong>${t('Observed evidence','Preuve observée')}</strong><span>${t('Demo excerpt','Extrait fictif')}</span></div><code>${esc(d.code)}</code><p class="wb-evidence-context">${t('Page context','Contexte de la page')} · maison.example/contact</p></section>
        <dl class="wb-meta"><div><dt>${t('Reference / procedure','Référentiel / procédure')}</dt><dd>RGAA 4.1.2 · ${esc(d.id)}</dd></div><div><dt>${t('Method','Méthode')}</dt><dd>${esc(d.method)}</dd></div></dl>
        <section class="wb-next"><h3>${t('Next review step','Prochaine étape de revue')}</h3><p>${nextSteps[d.id]}</p></section>
        <p class="wb-demo-source">10 Sep 2026 · 10:42 Europe/Paris · ${t('Illustrative data, not audit evidence','Données illustratives, pas des preuves d’audit')}</p>
        <div class="actionrow"><button data-modal="note">${t('Add review note','Ajouter une note de revue')}</button><button data-back>${t('Back to selected result','Retour au résultat sélectionné')}</button></div>
      </aside>`;
    };
  }
  function enhance() {
    const view = active || 'dashboard';
    document.body.dataset.synthesisView = view;
    document.title = `a11ya Studio — ${name} / ${navNames()[view]}`;
    document.querySelector('.labbar b').textContent = name;
    const caption = document.querySelector('.sidebar-caption');
    if (caption) caption.textContent = 'Studio / Contour Blue';
    const links = document.querySelector('.contour-comparisons');
    if (links) {
      links.className = 'contour-comparisons synthesis-comparisons';
      links.innerHTML = `<span class="synthesis-current">${t('Unselected','Non sélectionné')}</span><a id="compare" href="contour-blue-synthesis.html?lang=${lang}&view=${view}">${t('Compare three','Comparer les trois')}</a><a data-comparison="contour-blue.html" href="contour-blue.html?lang=${lang}${location.hash || '#dashboard'}">${t('Original Blue','Blue original')}</a><a data-comparison="contour-blue-${kind === 'refined' ? 'workbench' : 'refined'}.html" href="contour-blue-${kind === 'refined' ? 'workbench' : 'refined'}.html?lang=${lang}${location.hash || '#dashboard'}">${kind === 'refined' ? 'Workbench' : 'Refined'}</a>`;
    }
    if (kind !== 'workbench') return;
    if (view === 'dashboard') {
      document.querySelector('#main>.grid')?.classList.add('wb-activity');
      document.querySelector('#main>.project-grid')?.classList.add('wb-projects');
    }
    if (view === 'results') {
      const metrics = document.querySelector('#main>.metrics');
      if (metrics) {
        const frame = document.createElement('section');
        frame.className = 'wb-review';
        frame.setAttribute('aria-label', t('Procedure review','Revue des procédures'));
        metrics.before(frame);
        const toolbar = document.querySelector('.detail-toolbar');
        const filterbar = document.createElement('div');
        filterbar.className = 'wb-filterbar';
        [document.querySelector('.review-toolbar'), document.querySelector('.active-filters')].forEach(el => filterbar.append(el));
        filterbar.querySelector('.review-toolbar').append(document.querySelector('#detail-toggle'));
        toolbar.querySelector('span').replaceWith(document.querySelector('.review-count'));
        [metrics, filterbar, toolbar, document.querySelector('.results-grid')].forEach(el => frame.append(el));
      }
    }
    if (view === 'new') document.querySelector('.form-layout')?.classList.add('wb-launch');
  }
  const baseRender = render;
  render = function (...args) { baseRender(...args); enhance(); };
  // Re-render once so Workbench uses the new inspector on direct #results entry.
  render(false);
})();
