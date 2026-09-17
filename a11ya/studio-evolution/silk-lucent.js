/* Lucent changes composition and identity only; Indigo owns evidence and demo state. */
(() => {
  if (!document.body.hasAttribute('data-lucent')) return;
  let lastJournalState = '';
  let pendingFinding = null;
  let previewFinding = 0;
  const excerpt = i => `<header><span>${i === 0 ? t('ELEMENT EXCERPT','EXTRAIT DE L’ÉLÉMENT') : t('EVIDENCE CONTEXT','CONTEXTE DE LA PREUVE')}</span><span>${esc(data()[i].id)}</span></header><code>${esc(data()[i].code)}</code><footer>${t('Illustrative evidence · run 024','Preuve illustrative · audit 024')}</footer>`;
  function updatePreview() {
    const preview = document.querySelector('.lucent-excerpt');
    if (!preview) return;
    preview.innerHTML = excerpt(previewFinding);
    document.querySelectorAll('[data-lucent-preview]').forEach(button => button.setAttribute('aria-pressed',String(Number(button.dataset.lucentPreview) === previewFinding)));
    document.querySelector('.lucent-review-footer .primary').dataset.lucentFinding = previewFinding;
    if (!reduced()) preview.animate([{opacity:.5,transform:'translateY(3px)'},{opacity:1,transform:'none'}],{duration:180,easing:'cubic-bezier(.2,.7,.2,1)'});
  }
  function enhance() {
    document.title = `a11ya Studio — Silk Lucent / ${navNames()[active]}`;
    document.querySelector('.labbar b').textContent = 'Silk Lucent';
    document.querySelector('.sidebar-caption').textContent = 'Studio / Silk Lucent';
    const query = '?lang=' + lang + (location.hash || '#dashboard');
    document.querySelector('.indigo-comparison').innerHTML = `<span>${t('Unselected','Non sélectionné')}</span><a id="compare" href="../index.html">${t('Design index','Index des maquettes')}</a><a href="silk-indigo.html${query}">Indigo</a><a href="silk-indigo-precision.html${query}">Precision</a><a href="silk-final.html${query}">Silk</a>`;
    if (active === 'dashboard') {
      document.querySelector('.heading h1').textContent = t('Workspace overview','Vue d’ensemble');
      const attention = document.querySelector('.attention');
      const eyebrow = attention.querySelector('.eyebrow');
      const count = attention.querySelector('.number');
      const heading = attention.querySelector('h2');
      const description = attention.querySelector('p:not(.eyebrow)');
      const action = attention.querySelector('.primary');
      const header = document.createElement('div');
      header.className = 'lucent-review-head';
      const text = document.createElement('div');
      text.append(eyebrow, heading);
      count.setAttribute('aria-label',t('Two decisions to review','Deux décisions à examiner'));
      header.append(text,count);
      attention.prepend(header);
      const links = document.createElement('div');
      links.className = 'lucent-review-targets';
      links.innerHTML = [0,1].map(i => {
        const d = data()[i];
        return `<button data-lucent-preview="${i}" aria-pressed="${i === previewFinding}" aria-controls="lucent-excerpt"><span class="lucent-target-top"><code>${esc(d.id)}</code>${badge(d.outcome,d.kind)}</span><span>${i === 0 ? t('Email label','Étiquette e-mail') : t('Text contrast','Contraste du texte')}${icon('arrow')}</span></button>`;
      }).join('');
      const review = document.createElement('div');
      review.className = 'lucent-review-workspace';
      const preview = document.createElement('div');
      preview.className = 'lucent-excerpt';
      preview.id = 'lucent-excerpt';
      preview.setAttribute('aria-live','polite');
      preview.innerHTML = excerpt(previewFinding);
      review.append(links,preview);
      description.after(review);
      const footer = document.createElement('div');
      footer.className = 'lucent-review-footer';
      footer.append(action);
      action.dataset.lucentFinding = previewFinding;
      const scope = document.createElement('span');
      scope.textContent = t('Maison / Contact · demo excerpt','Maison / Contact · extrait fictif');
      footer.append(scope);
      attention.append(footer);
      const browserPanel = document.querySelector('#main>.grid>.panel');
      browserPanel.querySelector('p:not(.eyebrow)').textContent = t('A local walkthrough of browser control and observation. Advance the journal yourself.','Un parcours local du contrôle et de l’observation. Faites avancer le journal vous-même.');
      browserPanel.querySelector('p:not(.eyebrow)').style.marginTop = '0';
      const desktop = document.createElement('a');
      desktop.href = '#live';
      desktop.className = 'lucent-run-preview';
      desktop.setAttribute('aria-label',t('Open the demo desktop and journal','Ouvrir le bureau et le journal fictifs'));
      desktop.innerHTML = `<span class="lucent-mini-bar">${icon('live')} <b>${t('Desktop','Bureau')}</b><span>${t('DEMO','DÉMO')} / 025</span></span><span class="lucent-mini-body"><span><b>Atlas</b><span>${t('Sign in','Connexion')}</span></span><span class="lucent-mini-field">${t('Email address','Adresse e-mail')}<i>↵</i></span></span>`;
      browserPanel.querySelector('.badge')?.remove();
      browserPanel.querySelector('p:not(.eyebrow)').after(desktop);
      const browserFooter = document.createElement('div');
      browserFooter.className = 'lucent-browser-link';
      browserFooter.append(browserPanel.querySelector('a.button'));
      const run = document.createElement('span');
      run.textContent = t('Example run 025','Audit illustratif 025');
      browserFooter.append(run);
      browserPanel.append(browserFooter);
    }
    if (active === 'results') {
      const controls = document.querySelector('.detail-toolbar');
      const filters = document.querySelector('.review-toolbar');
      const count = document.querySelector('.review-count');
      const chips = document.querySelector('.active-filters');
      if (filters) {
        controls.classList.add('lucent-result-controls');
        controls.querySelector('span').remove();
        filters.append(document.querySelector('#detail-toggle'));
        controls.append(filters, count, chips);
      }
      if (pendingFinding !== null) {
        const target = pendingFinding;
        pendingFinding = null;
        // A direct finding shortcut must remain useful after earlier filters.
        document.querySelector('[data-review-reset]').click();
        document.querySelector(`[data-finding="${target}"]`).click();
        document.querySelector('.heading h1').focus({preventScroll:true});
      }
      const evidence = document.querySelector('.indigo-evidence');
      const inspector = document.querySelector('#inspector');
      const inspectorBadge = inspector?.querySelector(':scope > .badge');
      if (inspectorBadge) inspector.querySelector('.inspector-head .eyebrow')?.replaceWith(inspectorBadge);
      if (evidence && !evidence.querySelector('.lucent-code-meta')) {
        evidence.insertAdjacentHTML('beforeend',`<div class="lucent-code-meta"><span>${t('Demo excerpt','Extrait fictif')}</span><span>RGAA ${esc(data()[selected].id)}</span></div>`);
      }
    }
    if (active === 'live') {
      const state = document.querySelector('.journal-head').textContent;
      if (lastJournalState && lastJournalState !== state && !reduced()) {
        for (const el of document.querySelectorAll('.journal-head h2,.journal-stages [aria-current=step]')) {
          el.animate([{opacity:.6,transform:'translateY(2px)'},{opacity:1,transform:'none'}],{duration:180,easing:'cubic-bezier(.2,.7,.2,1)'});
        }
      }
      lastJournalState = state;
    } else lastJournalState = '';
  }
  document.addEventListener('click', e => {
    const preview = e.target.closest('[data-lucent-preview]');
    if (preview) { previewFinding = Number(preview.dataset.lucentPreview); updatePreview(); return; }
    const link = e.target.closest('[data-lucent-finding]');
    if (!link) return;
    selected = Number(link.dataset.lucentFinding);
    pendingFinding = selected;
    detailOpen = true;
  },true);
  const indigoRender = render;
  render = function (...args) { indigoRender(...args); enhance(); };
  render(false);
})();
