/* Arc changes the spatial layout and adds local review tools, never audit evidence. */
(() => {
  if (!document.body.hasAttribute('data-arc')) return;
  let lensMode = 'context';
  let focused = false;
  const lens = i => {
    const d = data()[i];
    if (!d) return '';
    const context = i === 0
      ? `<div class="arc-page-fragment" role="img" aria-label="${t('Illustration of the example email input, not a captured screenshot','Illustration du champ e-mail fictif, pas une capture d’écran')}"><div class="arc-fragment-heading"><b>Maison</b><span>Contact</span></div><div class="arc-email-fragment"><span>${t('Email placeholder','Texte indicatif e-mail')}</span><div>Email <i>${icon('arrow')}</i></div></div><p>${t('No associated label in the example markup','Aucune étiquette associée dans le code fictif')}</p></div>`
      : `<div class="arc-context-record"><span>RGAA ${esc(d.id)}</span><h3>${i===1?t('A human review is needed','Une revue humaine est nécessaire'):esc(d.outcome)}</h3><p>${esc(d.detail)}</p></div>`;
    return `<div class="arc-lens-tools"><span>${t('Evidence lens','Vue de la preuve')}</span><div role="group" aria-label="${t('Evidence presentation','Présentation de la preuve')}"><button type="button" data-arc-mode="context" aria-pressed="${lensMode==='context'}">${t('Context','Contexte')}</button><button type="button" data-arc-mode="markup" aria-pressed="${lensMode==='markup'}">${t('Markup','Code')}</button></div></div><div class="arc-lens-body">${lensMode==='context'?context:`<div class="arc-markup"><span>${t('RECORDED EXCERPT','EXTRAIT ENREGISTRÉ')} / ${esc(d.id)}</span><code>${esc(d.code)}</code><small>${t('Immutable demo fixture','Exemple fictif immuable')}</small></div>`}</div><div class="arc-lens-caption">${lensMode==='context'?t('Illustrative context · not a captured screenshot','Contexte illustratif · pas une capture d’écran'):t('Illustrative evidence · run 024','Preuve illustrative · audit 024')}</div>`;
  };
  function paintLenses(animate = false) {
    const current = active==='dashboard' ? Number(document.querySelector('[data-lucent-preview][aria-pressed=true]')?.dataset.lucentPreview || 0) : selected;
    document.querySelectorAll('.lucent-excerpt,.indigo-evidence').forEach(el => {
      el.innerHTML = lens(current);
      if (animate && !reduced()) el.querySelector('.arc-lens-body')?.animate([{opacity:.45,transform:'translateY(4px)'},{opacity:1,transform:'none'}],{duration:210,easing:'cubic-bezier(.2,.75,.2,1)'});
    });
  }
  const originalInspector = inspector;
  inspector = function () {
    const holder = document.createElement('div');
    holder.innerHTML = originalInspector();
    holder.querySelector('.indigo-evidence').innerHTML = lens(selected);
    return holder.innerHTML;
  };
  function updateScope() {
    const input = document.querySelector('#launch-url');
    const output = document.querySelector('.arc-scope-target');
    if (!input || !output) return;
    let host = t('Your page','Votre page'), path = '/', valid = false;
    try { const url = new URL(input.value); valid = ['http:','https:'].includes(url.protocol); if(valid){host=url.host;path=url.pathname+url.search;} } catch {}
    const project=document.querySelector('#launch-project').value;
    document.querySelector('.heading .eyebrow').textContent=project+' / '+t('NEW AUDIT','NOUVEL AUDIT');
    output.innerHTML = `<span>${esc(project)}</span><h3>${esc(host)}</h3><code>${esc(path)}</code><p>${valid?t('Target entered · not visited','Cible saisie · non visitée'):t('Enter an HTTP(S) page URL','Saisissez l’URL HTTP(S) d’une page')}</p>`;
  }
  function setFocus() {
    const row=document.querySelector(`[data-finding="${selected}"]`);
    const available=Boolean(row && !row.hidden);
    if(!available)focused=false;
    document.body.classList.toggle('arc-review-focus',active==='results' && focused);
    document.querySelector('.results-grid')?.classList.toggle('arc-focused',focused);
    const button = document.querySelector('[data-arc-focus]');
    if (button) { button.textContent=focused?t('Show decisions','Afficher les décisions'):t('Focus evidence','Agrandir la preuve');button.setAttribute('aria-pressed',String(focused));button.disabled=!available; }
  }
  const originalFilter=filterResults;
  filterResults=function(...args){originalFilter(...args);if(active==='results')setFocus();};
  function enhance() {
    document.body.dataset.collapsed='false';
    document.title=`a11ya Studio — Silk Arc / ${navNames()[active]}`;
    document.querySelector('.labbar b').textContent='Silk Arc';
    const query='?lang='+lang+(location.hash||'#dashboard');
    document.querySelector('.indigo-comparison').innerHTML=`<span>${t('Unselected','Non sélectionné')}</span><a id="compare" href="../index.html">${t('Design index','Index des maquettes')}</a><a href="silk-lucent-vivid.html${query}">Vivid</a><a href="silk-lucent.html${query}">Lucent</a>`;
    // Recompose existing, working navigation into a horizontal dock.
    const identity=document.createElement('div');identity.className='arc-identity';
    identity.append(document.querySelector('.brand'),document.querySelector('.org-select'));
    document.querySelector('.topbar').prepend(identity);
    document.querySelector('.nav-indicator')?.remove();
    if(active==='dashboard') {
      const attention=document.querySelector('.attention');
      const hero=document.createElement('div');hero.className='arc-review-heading';
      hero.append(attention.querySelector('.lucent-review-head'),attention.querySelector('p:not(.eyebrow)'));
      attention.prepend(hero);
      attention.querySelector('h2').textContent=t('Two decisions. One closer look.','Deux décisions à examiner.');
      attention.querySelector('.eyebrow').textContent=t('MAISON / CONTACT · REVIEW','MAISON / CONTACT · REVUE');
      const projectSection=document.querySelector('.project-grid');
      projectSection?.classList.add('arc-projects');
      paintLenses();
    }
    if(active==='results') {
      const toolbar=document.querySelector('.review-toolbar');
      toolbar.insertAdjacentHTML('beforeend',`<button type="button" data-arc-focus aria-pressed="${focused}"></button>`);
      setFocus();paintLenses();
    } else {focused=false;document.body.classList.remove('arc-review-focus');}
    if(active==='live') {
      document.querySelector('.target-strip').after(document.querySelector('.desktop-control'));
    }
    if(active==='new') {
      const aside=document.querySelector('.aside-note');
      aside.innerHTML=`<div class="arc-scope-heading"><span>${icon('live')}</span><p class="eyebrow">${t('YOUR NEXT AUDIT','VOTRE PROCHAIN AUDIT')}</p><h2>${t('One page.<br>Defined scope.','Une page.<br>Un périmètre défini.')}</h2></div><div class="arc-scope-target" aria-live="polite"></div><div class="arc-scope-facts"><span><b>01</b>${t('Page','Page')}</span><span><b>RGAA</b>4.1.2</span><span><b>${t('Demo','Démo')}</b>${t('No connection','Sans connexion')}</span></div><p class="arc-scope-note">${t('Confirm the target, follow the manual journal, then explore the separate example findings. This prototype never visits the URL.','Confirmez la cible, suivez le journal manuel, puis explorez les résultats fictifs distincts. Ce prototype ne visite jamais l’URL.')}</p>`;
      updateScope();
    }
  }
  const lucentRender=render;
  render=function(...args){lucentRender(...args);enhance();};
  document.addEventListener('click',e=>{
    const mode=e.target.closest('[data-arc-mode]');
    if(mode){lensMode=mode.dataset.arcMode;paintLenses(true);document.querySelector(`[data-arc-mode="${lensMode}"]`)?.focus({preventScroll:true});return;}
    if(e.target.closest('[data-lucent-preview]'))paintLenses(true);
    if(e.target.closest('[data-arc-focus]')){focused=!focused;detailOpen=true;updateDetail(false);setFocus();}
    if(e.target.closest('#detail-toggle') && !detailOpen){focused=false;setFocus();}
    if(e.target.closest('[data-action="close-detail"]')){focused=false;setFocus();document.querySelector(`[data-finding="${selected}"]`)?.focus({preventScroll:true});}
  });
  document.addEventListener('input',e=>{if(e.target.id==='launch-url')updateScope();});
  document.addEventListener('change',e=>{if(e.target.id==='launch-project')updateScope();});
  render(false);
})();
