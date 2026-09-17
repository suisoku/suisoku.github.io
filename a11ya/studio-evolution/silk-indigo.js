/* Shared only by the two additive Silk Indigo studies.
   Existing fixtures, forms, notes, filters and browser-control transitions are inherited. */
(() => {
  const variant = document.body.dataset.silkStudy;
  if (!variant) return;
  const name = variant === 'precision' ? 'Silk Indigo Precision' : 'Silk Indigo';
  let journalStep = 0;
  let journalTarget = '';
  const steps = () => [
    [t('Page prepared','Page préparée'),t('Demo session is ready','La session fictive est prête')],
    [t('Read page structure','Lire la structure de la page'),t('Illustrate the observation stage','Illustrer la phase d’observation')],
    [t('Keep the context','Conserver le contexte'),t('Illustrate a captured page state','Illustrer un état capturé de la page')],
    [t('Ready for review','Prêt pour la revue'),t('End of this manual walkthrough','Fin de ce parcours manuel')]
  ];
  inspector = function () {
    const d = data()[selected];
    return `<aside class="inspector" id="inspector" aria-label="${t('Selected evidence','Preuve sélectionnée')}">
      ${badge(d.outcome,d.kind)}<h2>${esc(d.title)}</h2><p>${esc(d.detail)}</p>
      <dl><div><dt>${t('Procedure / scope','Procédure / périmètre')}</dt><dd>RGAA 4.1.2 · ${esc(d.id)}<br>maison.example/contact</dd></div><div><dt>${t('Method','Méthode')}</dt><dd>${esc(d.method)}</dd></div></dl>
      <section class="indigo-evidence"><h3>${t('OBSERVED EVIDENCE','PREUVE OBSERVÉE')}</h3><code>${esc(d.code)}</code></section>
      <p class="evidence-source">10 Sep 2026 · 10:42 Europe/Paris<br>${t('Illustrative data, not audit evidence','Données illustratives, pas des preuves d’audit')}</p>
      <div class="actionrow"><button data-modal="note">${t('Add review note','Ajouter une note de revue')}</button><button data-back>${t('Back to selected result','Retour au résultat sélectionné')}</button></div>
    </aside>`;
  };
  live = function () {
    const targetKey = liveProject + '|' + liveTarget;
    if (journalTarget !== targetKey) { journalStep = 0; journalTarget = targetKey; }
    const status = runCancelled ? t('Demo cancelled','Démo annulée') : control === 'requested' ? t('Awaiting a safe checkpoint','En attente d’un point sûr') : control === 'granted' ? t('You have control · demo paused','Vous avez le contrôle · démo en pause') : t('Engine has control','Le moteur a le contrôle');
    const paused = runCancelled || control !== 'observe';
    const titles = steps();
    const title = runCancelled ? t('Session ended','Session terminée') : control !== 'observe' ? t('Waiting for control handback','En attente du retour du contrôle') : titles[journalStep][0];
    const controls = runCancelled ? '' : control === 'observe'
      ? `<button data-action="request-control">${t('Request control','Demander le contrôle')}</button>`
      : control === 'requested'
        ? `<button class="primary" data-action="checkpoint">${t('Demo: reach safe checkpoint','Démo : atteindre un point sûr')}</button><button data-action="release">${t('Withdraw request','Retirer la demande')}</button>`
        : `<button class="primary" data-action="release">${t('Return control & resume','Rendre le contrôle et reprendre')}</button>`;
    return heading(esc(liveProject) + ' / ' + t('browser run · demo','audit navigateur · démo'),
      t('Live audit','Audit en cours'),
      t('Follow the desktop and journal. Advance this local simulation at your own pace.','Suivez le bureau et le journal. Faites avancer cette simulation locale à votre rythme.'),
      runCancelled ? link('new',t('Prepare another audit','Préparer un autre audit'),'button primary') : `<button class="danger" data-modal="cancel">${t('Cancel audit','Annuler l’audit')}</button>`)
      + `<nav class="tablinks" aria-label="${t('Audit views','Vues de l’audit')}"><a href="#live" aria-current="page">${t('Desktop & journal','Bureau et journal')}</a><a href="#results">${t('Example results (run 024)','Exemple de résultats (audit 024)')}</a></nav>
      <div class="indigo-run">
        <section class="run-desktop" aria-label="${t('Demo desktop','Bureau fictif')}">
          <header class="desktop-tools"><strong>${icon('live')} ${t('Desktop','Bureau')}</strong><span>${runCancelled?t('Session ended','Session terminée'):t('Local specimen · no connection','Spécimen local · aucune connexion')}</span></header>
          <div class="target-strip"><span>${t('Target','Cible')}</span><code>${esc(liveTarget)}</code></div>
          <div class="portal-specimen" role="img" aria-label="${t('Fictional Atlas sign-in page. This is an illustration, not the target URL.','Page de connexion Atlas fictive. Illustration, pas l’URL cible.')}">
            <div class="portal-bar"><b>Atlas</b><span>${t('Sample portal','Portail fictif')}</span></div>
            <div class="portal-body"><div class="portal-context"><span>${t('Your workspace','Votre espace')}</span><h3>${t('Everything you need.<br>In one place.','Tout le nécessaire.<br>Au même endroit.')}</h3><div class="portal-item"><span>${t('Projects','Projets')}</span><span>↗</span></div><div class="portal-item"><span>${t('Shared documents','Documents partagés')}</span><span>↗</span></div><div class="portal-item"><span>${t('Your team','Votre équipe')}</span><span>↗</span></div></div>
            <div class="portal-form"><h3>${t('Welcome back.','Bon retour.')}</h3><p>${t('Sign in to your workspace.','Connectez-vous à votre espace.')}</p><div class="portal-field">${t('Email address','Adresse e-mail')}</div><div class="portal-submit">${t('Continue','Continuer')} →</div></div></div>
          </div>
          <p class="portal-caption">${t('Illustrative Atlas page · entered URLs are never loaded · no keyboard input','Page Atlas illustrative · les URL saisies ne sont jamais chargées · aucune saisie clavier')}</p>
          <div class="desktop-control"><div class="control-summary"><strong>${status}</strong><span>${t('Control / execution','Contrôle / exécution')}</span></div>
          <p>${runCancelled ? t('Last illustrative frame. No audit was created.','Dernière image illustrative. Aucun audit n’a été créé.') : control === 'granted' ? t('Journal advancement is paused. Return control to continue the walkthrough.','Le journal est en pause. Rendez le contrôle pour poursuivre le parcours.') : control === 'requested' ? t('The engine keeps control until you simulate a safe checkpoint.','Le moteur garde le contrôle jusqu’au point sûr que vous simulez.') : t('Request control to pause at a safe checkpoint. No remote browser is connected.','Demandez le contrôle pour mettre en pause à un point sûr. Aucun navigateur distant n’est connecté.')}</p><div class="actionrow">${controls}</div></div>
        </section>
        <aside class="run-journal" aria-label="${t('Run journal','Journal d’exécution')}">
          <header class="journal-head"><p class="eyebrow">${t('RUN JOURNAL','JOURNAL D’EXÉCUTION')} · ${String(journalStep+1).padStart(2,'0')} / 04</p><h2 aria-live="polite">${title}</h2><p>${t('Manual demo steps. No background execution or completion estimate.','Étapes fictives manuelles. Aucune exécution en arrière-plan ni estimation de fin.')}</p></header>
          <ol class="journal-stages">${titles.map((step,i)=>`<li ${i===journalStep?'aria-current="step"':''} class="${i<journalStep?'done':''}"><span>${i<journalStep?'✓':String(i+1).padStart(2,'0')}</span><div><b>${step[0]}</b><small>${step[1]}</small></div></li>`).join('')}</ol>
          <div class="journal-actions"><button class="primary" data-journal-next ${paused||journalStep===3?'disabled':''}>${t('Advance demo','Avancer la démo')} ${icon('arrow')}</button><button class="quiet" data-journal-reset ${paused||journalStep===0?'disabled':''}>${t('Restart walkthrough','Recommencer le parcours')}</button>
          ${journalStep===3&&!runCancelled?`<p class="journal-state">${t('Walkthrough complete. No findings or conformity decisions were generated.','Parcours terminé. Aucun résultat ni décision de conformité n’a été généré.')}</p>`:''}
          <p>${t('Simulation only. The separate Contact results remain an immutable example from run 024.','Simulation uniquement. Les résultats Contact restent un exemple immuable de l’audit 024.')}</p></div>
        </aside>
      </div>`;
  };
  // Reset only for a newly confirmed run; ordinary navigation preserves the manual journal.
  document.addEventListener('submit', e => {
    if (e.target.id === 'dialog-form' && dialogKind === 'confirm') journalStep = 0;
  }, true);
  document.addEventListener('click', e => {
    if (e.target.closest('[data-finding]') && active === 'results' && !reduced()) {
      const panel = document.querySelector('#inspector');
      panel.getAnimations().forEach(animation => animation.cancel());
      panel.animate([{opacity:.65,transform:'translateY(3px)'},{opacity:1,transform:'none'}],{duration:150,easing:'cubic-bezier(.2,.7,.2,1)'});
    }
    const next = e.target.closest('[data-journal-next]');
    const reset = e.target.closest('[data-journal-reset]');
    if (!next && !reset) return;
    if (active !== 'live' || runCancelled || control !== 'observe') return;
    journalStep = reset ? 0 : Math.min(3, journalStep + 1);
    render(false);
    document.querySelector(journalStep===3?'[data-journal-reset]':'[data-journal-next]')?.focus({preventScroll:true});
  });
  function enhance() {
    document.body.dataset.indigoView = active;
    document.title = `a11ya Studio — ${name} / ${navNames()[active]}`;
    document.querySelector('.labbar b').textContent = name;
    document.querySelector('.sidebar-caption').textContent = 'Studio / ' + name;
    let comparisons = document.querySelector('.indigo-comparison');
    if (!comparisons) {
      comparisons = document.createElement('nav');
      comparisons.className = 'indigo-comparison';
      document.querySelector('#compare').replaceWith(comparisons);
    }
    comparisons.setAttribute('aria-label',t('Compare prototypes','Comparer les prototypes'));
    const other = variant === 'precision' ? 'silk-indigo.html' : 'silk-indigo-precision.html';
    comparisons.innerHTML = `<span>${t('Unselected','Non sélectionné')}</span><a id="compare" href="silk-indigo-comparison.html?lang=${lang}&view=${active}">${t('Compare variations','Comparer les variantes')}</a><a href="${other}?lang=${lang}${location.hash||'#dashboard'}">${variant==='precision'?'Indigo':'Precision'}</a><a href="silk-final.html?lang=${lang}${location.hash||'#dashboard'}">Silk</a>`;
  }
  const silkRender = render;
  render = function (...args) {
    const previous = active;
    silkRender(...args);
    enhance();
    if (previous !== active && !reduced()) {
      [...document.querySelector('#main').children].forEach(el => {
        el.getAnimations().forEach(animation => animation.cancel());
        if (!el.classList.contains('page-footer')) el.animate([{opacity:.7},{opacity:1}],{duration:150,easing:'ease-out'});
      });
    }
  };
  render(false);
})();
