/* Static adaptation of the Live audit 10 design. No browser service or network actions. */
(() => {
  if (!document.body.hasAttribute('data-horizon')) return;
  const route10 = () => location.hash.split('?')[0] === '#live-audit-10';
  const ui = {state:'connected', preview:'real', control:false, controlPending:false, focused:false, actual:false, follow:true, unread:0, events:[], selected:null, collapsedLab:false};
  let mounted = false, seq = 0, originalBrand = null;
  const copy = pair => t(...pair);
  const labels = {
    starting:['Preparing your space','Préparation de votre espace'],
    loading:['Opening a new world','Ouverture d’un nouveau monde'],
    connected:['Browser connected','Navigateur connecté'],
    disconnected:['Signal lost. Space held.','Signal perdu. Espace préservé.'],
    error:['A small detour in orbit','Un détour sur notre orbite'],
    closed:['Until the next exploration','À la prochaine exploration']
  };
  const descriptions = {
    starting:['The browser is getting ready. Your session will appear here.','Le navigateur se prépare. Votre session apparaîtra ici.'],
    loading:['Connecting to the page. Just a moment.','Connexion à la page. Encore un instant.'],
    disconnected:['The live image is unavailable. Reconnect to check the session.','L’image en direct est indisponible. Reconnectez-vous pour vérifier la session.'],
    error:['We couldn’t open the browser. Try a fresh session.','Le navigateur n’a pas pu s’ouvrir. Essayez une nouvelle session.'],
    closed:['This browser session has ended. You can open a new one.','Cette session est terminée. Vous pouvez en ouvrir une nouvelle.']
  };
  const glyph = name => ({expand:'<path d="M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5"/>',reduce:'<path d="M3 8h5V3m13 5h-5V3M8 21v-5H3m13 5v-5h5"/>',pointer:'<path d="m5 3 14 9-7 1-3 7Z"/>',info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v6m0-10v1"/>',close:'<path d="m6 6 12 12M6 18 18 6"/>',globe:'<circle cx="12" cy="12" r="9"/><ellipse cx="12" cy="12" rx="4" ry="9"/><path d="M3 12h18"/>',spark:'<path d="m12 3 2.6 6.4L21 12l-6.4 2.6L12 21l-2.6-6.4L3 12l10.4-2.6Z"/>'}[name] || '');
  const svg = name => `<svg viewBox="0 0 24 24" aria-hidden="true">${glyph(name)}</svg>`;
  const button = (action,label,shape='',extra='') => `<button type="button" data-l10="${action}" ${extra}>${shape ? svg(shape) : ''}<span>${label}</span></button>`;

  function constellation(state) {
    const stars = '<g class="l10-stars" fill="#d7dcff"><circle cx="38" cy="72" r="2"/><circle cx="246" cy="40" r="2"/><circle cx="273" cy="128" r="1.5"/><circle cx="69" cy="174" r="1.5"/><circle cx="210" cy="186" r="2"/><path d="m82 33 2 5 5 2-5 2-2 5-2-5-5-2 5-2Zm161 123 2 4 4 2-4 2-2 4-2-4-4-2 4-2Z"/></g>';
    const art = {
      starting:'<g class="l10-drift"><ellipse cx="156" cy="180" rx="49" ry="7" fill="#9a8af0" opacity=".16"/><path d="m135 131-6 31 24-17 22 10-3-32" fill="#8075d8"/><path d="M132 131c-5-36 11-65 28-78 24 22 31 49 12 78l-20 9Z" fill="#e9e9ff"/><circle cx="156" cy="98" r="12" fill="#96d8d1" stroke="#6762af" stroke-width="5"/><path d="m146 141 7 28 10-31" fill="#ffc99b"/><path d="m143 142 10 48 15-52" stroke="#ffc99b" opacity=".3" stroke-width="6"/></g>',
      loading:'<g class="l10-drift"><circle cx="153" cy="110" r="49" fill="#8b82d1"/><path d="M122 75c17-10 32-5 46 3m-57 44c20-12 38-8 71 7" stroke="#c4b6f1" stroke-width="9" fill="none"/><ellipse cx="153" cy="110" rx="94" ry="27" transform="rotate(-25 153 110)" fill="none" stroke="#b8e4d7" stroke-width="5"/><circle cx="235" cy="67" r="7" fill="#ffcfaa"/></g>',
      disconnected:'<g class="l10-drift" transform="rotate(-17 150 110)"><path d="M117 93H75v36h42m67-36h42v36h-42" fill="#777cbb" stroke="#b8c2f3" stroke-width="2"/><path d="M90 94v34m16-34v34m93-34v34m14-34v34M76 111h39m70 0h40" stroke="#bccbf5"/><rect x="120" y="84" width="62" height="55" rx="14" fill="#e0e5ff"/><path d="m151 83 14-27m-25 0c4 16 20 24 34 19" fill="none" stroke="#bce3de" stroke-width="5"/><path d="m176 44 12-9m-1 22 16-1" stroke="#e4b598" stroke-width="3" stroke-linecap="round"/><circle cx="151" cy="112" r="8" fill="#8f8aba"/></g><path d="m201 48 7 8-8 7 7 8" fill="none" stroke="#ffcda7" stroke-width="2"/>',
      error:'<path d="m235 35-99 83m113-66-97 88m109-67-98 80" stroke="#a295e1" stroke-width="12" opacity=".25" stroke-linecap="round"/><g class="l10-drift"><path d="m108 95 33-7 30 26-7 38-37 14-28-31Z" fill="#aca2d6"/><path d="m108 95 20 22 43-3-27 24 20 14-37 14 1-49" fill="#7c75ab"/><circle cx="113" cy="137" r="6" fill="#d1c3eb"/></g><path d="m65 71 14-8 9 17-17 7Z" fill="#b9dcd5"/>',
      closed:'<g class="l10-drift"><path d="M177 61a58 58 0 1 0 28 93 61 61 0 0 1-28-93Z" fill="#cdc4ee"/><circle cx="130" cy="144" r="10" fill="#aaa0d3"/><circle cx="112" cy="112" r="5" fill="#b3a9db"/><path d="M170 158q12 8 22-4" fill="none" stroke="#8274a8" stroke-width="3" stroke-linecap="round"/></g>'
    };
    return `<svg class="l10-cosmos" viewBox="0 0 310 220" aria-hidden="true">${stars}<ellipse cx="155" cy="116" rx="118" ry="80" fill="none" stroke="#b6b6ee" opacity=".14" transform="rotate(-15 155 116)"/>${art[state] || art.loading}</svg>`;
  }

  function summary() {
    return `<section class="l10-summary" aria-labelledby="view-title"><div class="l10-summary-top"><div class="l10-summary-mark">${svg('globe')}</div><div class="l10-target"><p>${t('LIVE AUDIT 10 / EXPLORATION','AUDIT EN DIRECT 10 / EXPLORATION')}</p><h1 id="view-title" tabindex="-1">${t('Browser','Navigateur')} <span>/ ${t('Live desktop','Bureau en direct')}</span></h1></div><details class="l10-meta"><summary aria-label="${t('Session details','Détails de la session')}">${svg('info')}</summary><dl><div><dt>${t('Runtime','Environnement')}</dt><dd>${t('Static browser mockup','Maquette statique du navigateur')}</dd></div><div><dt>${t('Desktop resolution','Résolution du bureau')}</dt><dd>1440 × 900 · 16:10</dd></div><div><dt>${t('Audit engine','Moteur d’audit')}</dt><dd>${t('Not connected','Non connecté')}</dd></div></dl></details></div><div class="l10-summary-bottom"><div><span class="l10-signal"></span><strong id="l10-summary-status"></strong></div><span>${t('Browser preview · no audit running','Aperçu du navigateur · aucun audit en cours')}</span></div></section>`;
  }

  function journal() {
    return `<aside class="l10-journal" aria-labelledby="l10-journal-title"><header><div><p>${t('SESSION','SESSION')}</p><h2 id="l10-journal-title">${t('Activity','Activité')}</h2></div>${button('follow',t('Follow','Suivre'),'','aria-pressed="true"')}</header><button class="l10-unread" data-l10="newest" hidden></button><ol id="l10-events"></ol><footer>${t('Select an event to see its details.','Sélectionnez un événement pour voir ses détails.')}</footer></aside>`;
  }

  function stage() {
    return `<section class="l10-sandbox" aria-label="${t('Live sandbox','Sandbox en direct')}"><header class="l10-sandbox-head"><div class="l10-sandbox-title">${svg('globe')}<div><h2>Sandbox</h2><span id="l10-browser-status" role="status"></span></div></div><div class="l10-sandbox-tools">${button('size','100%','','aria-pressed="false" title="'+t('Show actual browser pixels','Afficher les pixels réels du navigateur')+'"')}${button('expand',t('Enlarge','Agrandir'),'expand','aria-pressed="false"')}${button('control',t('Take control','Prendre le contrôle'),'pointer','class="primary"')}</div></header><div class="l10-stage"><div id="l10-viewer" class="l10-demo-browser" role="img" aria-label="${t('Fictional Atlas sign-in page in a browser mockup','Page de connexion Atlas fictive dans une maquette de navigateur')}"><div class="l10-demo-tab">Atlas / ${t('Sign in','Connexion')} <span aria-hidden="true">×</span></div><div class="l10-demo-address"><span aria-hidden="true">← → ↻</span><span>atlas.example/sign-in</span><span aria-hidden="true">⋮</span></div><div class="l10-demo-page"><strong class="l10-demo-wordmark">Atlas</strong><div class="l10-demo-card"><p>ATLAS / WORKSPACE</p><h2>${t('Welcome back','Bon retour')}</h2><span>${t('Sign in to your workspace','Connectez-vous à votre espace')}</span><div class="l10-demo-label">${t('Email address','Adresse e-mail')}</div><div class="l10-demo-field">camille@example.com</div><div class="l10-demo-label">${t('Password','Mot de passe')}</div><div class="l10-demo-field">••••••••</div><div class="l10-demo-submit">${t('Continue','Continuer')} →</div></div></div></div><div id="l10-state" class="l10-state" role="status" aria-live="polite"></div></div><footer class="l10-sandbox-foot"><span id="l10-input-status" tabindex="-1"></span><button data-l10="close" type="button">${t('Close session','Fermer la session')}</button></footer></section>`;
  }

  function lab() {
    return `<aside class="l10-lab" aria-label="${t('Temporary state preview controls','Commandes temporaires de prévisualisation')}"><button class="l10-lab-toggle" data-l10="lab" aria-expanded="${!ui.collapsedLab}">${svg('spark')}<span>${t('Preview lab','Atelier aperçu')}</span><span aria-hidden="true">${ui.collapsedLab ? '+' : '−'}</span></button><div class="l10-lab-options" ${ui.collapsedLab ? 'hidden' : ''}><label for="l10-preview">${t('Sandbox state','État de la sandbox')}</label><select id="l10-preview"><option value="real">${t('Browser mockup','Maquette du navigateur')}</option>${Object.entries(labels).filter(([key])=>key!=='connected').map(([key,val])=>`<option value="${key}">${copy(val)}</option>`).join('')}</select><span id="l10-preview-note">${t('Only changes the preview','Modifie uniquement l’aperçu')}</span></div></aside>`;
  }

  function navigation() {
    const original = document.querySelector('.project-nav [data-nav="live-audit-9"]') || document.querySelector('.project-nav [data-nav="live"]');
    if (!original || document.querySelector('[data-nav="live-audit-10"]')) return;
    original.insertAdjacentHTML('afterend', `<a href="#live-audit-10" data-nav="live-audit-10" title="${t('Live audit 10','Audit en direct 10')}">${icon('live')}<span class="nav-text">${t('Live audit 10','Audit en direct 10')}</span></a>`);
  }

  function addEvent(title,detail) {
    ui.events.unshift({id:++seq,time:new Date().toLocaleTimeString(lang,{hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:false}),title,detail});
    ui.events = ui.events.slice(0,40);
    if (!ui.follow) ui.unread++;
    drawJournal();
  }

  function drawJournal() {
    const list=document.querySelector('#l10-events'); if(!list)return;
    const oldTop=list.scrollTop, oldHeight=list.scrollHeight;
    list.innerHTML=ui.events.map(ev=>`<li><button data-l10-event="${ev.id}" aria-expanded="${ui.selected===ev.id}"><time>${ev.time}</time><span>${copy(ev.title)}</span><b aria-hidden="true">${ui.selected===ev.id?'−':'+'}</b></button>${ui.selected===ev.id?`<p>${copy(ev.detail)}</p>`:''}</li>`).join('');
    list.scrollTop=ui.follow?0:oldTop+Math.max(0,list.scrollHeight-oldHeight);
    const unread=document.querySelector('.l10-unread');unread.hidden=!ui.unread;unread.textContent=t(`${ui.unread} new · Show latest`,`${ui.unread} nouveaux · Afficher`);
    document.querySelector('[data-l10="follow"]').setAttribute('aria-pressed',ui.follow);
  }

  function drawState() {
    if(!mounted || !route10())return;
    const state=ui.preview==='real'?ui.state:ui.preview;
    const overlay=document.querySelector('#l10-state');
    overlay.hidden=state==='connected';
    overlay.dataset.state=state;
    overlay.innerHTML=state==='connected'?'':`<div class="l10-state-inner">${ui.preview!=='real'?`<span class="l10-preview-label">${t('State preview','Aperçu d’état')}</span>`:''}${constellation(state)}<h3>${copy(labels[state]||labels.error)}</h3><p>${copy(descriptions[state]||descriptions.error)}</p>${['disconnected','error','closed'].includes(state)?button('retry',state==='closed'?t('Open a session','Ouvrir une session'):t('Reconnect','Reconnecter')):''}</div>`;
    const real=ui.preview==='real', ready=real&&ui.state==='connected';
    const compact={starting:['Starting session','Démarrage de la session'],loading:['Loading the page','Chargement de la page'],connected:['Ready to explore','Prêt à explorer'],disconnected:['Connection interrupted','Connexion interrompue'],error:['Browser unavailable','Navigateur indisponible'],closed:['Session closed','Session fermée']};
    document.querySelector('#l10-summary-status').textContent=ui.control&&ready?t('You’re exploring','Vous explorez'):copy(compact[state]||compact.error);
    document.querySelector('#l10-browser-status').textContent=real?(ready?(ui.control?t('You have control','Vous avez le contrôle'):t('Observation mode','Mode observation')):copy(labels[state]||labels.error)):t('Visual preview','Aperçu visuel');
    const control=document.querySelector('[data-l10="control"]');control.disabled=true;control.title=t('Browser control is unavailable in this static preview','Le contrôle du navigateur est indisponible dans cet aperçu statique');control.innerHTML=svg('pointer')+`<span>${ui.controlPending?t('Connecting controls…','Connexion des commandes…'):ui.control?t('Release control','Libérer le contrôle'):t('Take control','Prendre le contrôle')}</span>`;
    const frame=document.querySelector('#l10-viewer');frame.setAttribute('aria-hidden',String(!ready));
    document.querySelector('#l10-input-status').textContent=t('Static browser mockup · no website is opened','Maquette statique du navigateur · aucun site n’est ouvert');
    document.querySelector('[data-l10="close"]').disabled=!real||['starting','closed','error'].includes(ui.state);
    document.querySelector('#l10-preview').value=ui.preview;
    document.querySelector('#l10-preview-note').textContent=real?t('Static design controls','Commandes de maquette statique'):t('Illustrated demo state','État de démonstration illustré');
  }

  function mount() {
    mounted=true;ui.state='connected';ui.control=false;ui.controlPending=false;
    const main=document.querySelector('#main');main.classList.remove('horizon-live');main.classList.add('horizon-live10');
    main.insertAdjacentHTML('beforebegin', `<div class="l10-banner">${summary()}${lab()}</div>`);
    main.innerHTML=`<div class="l10-layout">${journal()}${stage()}</div>`;
    document.body.setAttribute('data-live10','');active='live-audit-10';
    const brand=document.querySelector('.brand');
    originalBrand=brand.innerHTML;
    brand.innerHTML='<span class="l10-brand-mark" aria-hidden="true"><img src="icon_v4.png" width="1254" height="1254" alt=""></span>';
    brand.title='a11ya';
    document.title=`a11ya Studio — Horizon / ${t('Live audit 10','Audit en direct 10')}`;
    document.querySelector('#crumb-view').textContent=t('Live audit 10','Audit en direct 10');
    document.querySelectorAll('[data-nav]').forEach(a=>a.dataset.nav==='live-audit-10'?a.setAttribute('aria-current','page'):a.removeAttribute('aria-current'));
    if(!ui.events.length)addEvent(['Design preview ready','Aperçu prêt'],['Fictional Atlas page. No browser or audit service is connected.','Page Atlas fictive. Aucun navigateur ni moteur d’audit n’est connecté.']);
    drawJournal();drawState();applyFocus();moveNavIndicator();

  }

  function applyFocus() {
    const main=document.querySelector('.horizon-live10');if(!main)return;
    main.classList.toggle('l10-focused',ui.focused);
    document.body.toggleAttribute('data-live10-focused',ui.focused);
    const banner=document.querySelector('.l10-banner');
    (ui.focused?main:banner).append(document.querySelector('.l10-lab'));
    banner.hidden=ui.focused;
    document.querySelector('[data-l10="expand"]').setAttribute('aria-pressed',ui.focused);
    document.querySelector('[data-l10="expand"]').innerHTML=svg(ui.focused?'reduce':'expand')+`<span>${ui.focused?t('Restore','Réduire'):t('Enlarge','Agrandir')}</span>`;
  }

  const previousRender=render;
  render=function(...args){
    if(originalBrand!==null){const brand=document.querySelector('.brand');if(brand?.querySelector('.l10-brand-mark'))brand.innerHTML=originalBrand;originalBrand=null;}
    document.querySelector('.l10-banner')?.remove();
    document.body.removeAttribute('data-live10-focused');
    mounted=false;document.body.removeAttribute('data-live10');document.querySelector('#main')?.classList.remove('horizon-live10','l10-focused');
    previousRender(...args);navigation();if(route10())mount();
  };

  document.addEventListener('change',event=>{
    if(event.target.id!=='l10-preview')return;
    ui.preview=event.target.value;ui.control=false;ui.controlPending=false;drawState();
  });
  document.addEventListener('click',event=>{
    if(!route10())return;
    const selected=event.target.closest('[data-l10-event]');
    if(selected){const id=Number(selected.dataset.l10Event);ui.selected=ui.selected===id?null:id;drawJournal();document.querySelector(`[data-l10-event="${id}"]`)?.focus({preventScroll:true});return;}
    const trigger=event.target.closest('[data-l10]');if(!trigger)return;
    const action=trigger.dataset.l10;
    if(action==='expand'){ui.focused=!ui.focused;applyFocus();}
    if(action==='size'){ui.actual=!ui.actual;trigger.setAttribute('aria-pressed',ui.actual);trigger.querySelector('span').textContent=ui.actual?t('Fit','Ajuster'):'100%';document.querySelector('#l10-viewer').classList.toggle('l10-actual',ui.actual);}
    if(action==='retry'){ui.preview='real';ui.state='connected';drawState();addEvent(['Preview reopened','Aperçu rouvert'],['Static example restored. No remote session was started.','Exemple statique rétabli. Aucune session distante n’a été lancée.']);}
    if(action==='close'){ui.control=false;ui.controlPending=false;ui.state='closed';addEvent(labels.closed,descriptions.closed);drawState();}
    if(action==='follow'||action==='newest'){ui.follow=action==='newest'||!ui.follow;if(ui.follow)ui.unread=0;drawJournal();}
    if(action==='lab'){ui.collapsedLab=!ui.collapsedLab;trigger.setAttribute('aria-expanded',!ui.collapsedLab);trigger.lastElementChild.textContent=ui.collapsedLab?'+':'−';document.querySelector('.l10-lab-options').hidden=ui.collapsedLab;}
  });
  document.addEventListener('keydown',event=>{
    if(!route10()||event.key!=='Escape')return;
    if(ui.control||ui.controlPending){ui.control=false;ui.controlPending=false;drawState();document.querySelector('[data-l10="control"]').focus();}
    else if(ui.focused){ui.focused=false;applyFocus();document.querySelector('[data-l10="expand"]').focus();}
  });
  render(false);
})();
