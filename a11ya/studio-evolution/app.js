/* Shared interaction contract for three local Studio evolutions. No network calls. */
const evolution = document.body.dataset.evolution;
const evolutionName = evolution[0].toUpperCase() + evolution.slice(1);
const storageKey = 'a11ya-studio-evolution-v1';
const defaults = {density:'comfortable', reduced:false, collapsed:false, name:'Camille Laurent', organization:'Northstar', description:'', project:'Maison'};
let saved = {...defaults};
try {
  const stored = JSON.parse(localStorage.getItem(storageKey) || '{}');
  for (const key of Object.keys(defaults)) if (typeof stored[key] === typeof defaults[key]) saved[key] = stored[key];
  if (!['comfortable','compact'].includes(saved.density)) saved.density = 'comfortable';
  if (!['Maison','Atlas','Service public'].includes(saved.project)) saved.project = 'Maison';
} catch { /* Storage may be unavailable under file:// or private browsing. */ }
const mediaMotion = matchMedia('(prefers-reduced-motion: reduce)');
const mobile = matchMedia('(max-width: 760px)');
let active = '', detailOpen = !mobile.matches, menuOpen = false;
let resultQuery = '', resultOutcome = '', historyQuery = '', historyStatus = '', projectContext = '';
let launchDraft = {url:target, project:saved.project};
let drafts = {}, notes = {}, dialogReturn = null, dialogKind = '', commandIndex = 0;
let dialogNavigated = false;
const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];
const preference = key => drafts.account?.[key] ?? saved[key];
const reduced = () => mediaMotion.matches || preference('reduced');
function persist() {
  try { localStorage.setItem(storageKey, JSON.stringify(saved)); return true; }
  catch { return false; }
}
function toast(message) {
  $('#toast').textContent = message;
  clearTimeout(window.toastTimer);
  window.toastTimer = setTimeout(() => { $('#toast').textContent = ''; }, 6000);
}
function applyPreferences() {
  document.body.dataset.density = preference('density');
  document.body.dataset.reduced = String(reduced());
  document.body.dataset.collapsed = String(saved.collapsed);
  if(reduced())document.getAnimations().forEach(animation=>animation.cancel());
  const collapse = $('#collapse');
  if (collapse) {
    collapse.setAttribute('aria-expanded', String(mobile.matches ? menuOpen : !saved.collapsed));
    collapse.setAttribute('aria-label', t(mobile.matches ? 'Toggle navigation' : saved.collapsed ? 'Expand sidebar' : 'Collapse sidebar', mobile.matches ? 'Afficher la navigation' : saved.collapsed ? 'Déployer la barre latérale' : 'Réduire la barre latérale'));
    collapse.title = collapse.getAttribute('aria-label');
  }
  $('#motion')?.setAttribute('aria-pressed', String(reduced()));
  if ($('#motion')) $('#motion').title = mediaMotion.matches ? t('Reduced motion follows your system','Les animations réduites suivent votre système') : t('Reduce motion','Réduire les animations');
  requestAnimationFrame(moveNavIndicator);
}
mediaMotion.addEventListener('change', applyPreferences);
mobile.addEventListener('change', () => { menuOpen=false; $('.app').classList.remove('menu-open'); applyPreferences(); updateDetail(false); });
function route() {
  const [name, query=''] = location.hash.slice(1).split('?');
  const aliases = {overview:'dashboard',history:'audits',launch:'new',org:'organization'};
  return {name: aliases[name] || (navNames()[name] ? name : 'dashboard'), project:new URLSearchParams(query).get('project') || ''};
}
function projects() {
  return `<div class="project-grid">${[['M','Maison',t('Public website','Site public'),'maison.example'],['A','Atlas',t('Customer portal','Portail client'),'atlas.example'],['S','Service public',t('Application forms','Formulaires de demande'),'service.example']].map((p,i)=>`<article class="project"><div class="project-top"><div class="monogram" aria-hidden="true">${p[0]}</div><span class="project-index">0${i+1}</span></div><div><h3>${link('audits?project='+encodeURIComponent(p[1]),p[1],'')}</h3><p>${p[2]}<br>${p[3]}</p></div><footer>${badge(i===0?t('Review needed','À examiner'):i===1?t('Audit running','Audit en cours'):t('No audits yet','Aucun audit'),i===0?'warn':i===1?'active':'neutral')}${link('audits?project='+encodeURIComponent(p[1]),t('Open','Ouvrir'),'quiet button','arrow')}</footer></article>`).join('')}</div>`;
}
function auditHistory() {
  const rows = [
    [t('Contact','Contact'),'Maison','done','results','10:42'],
    [t('Sign in','Connexion'),'Atlas','running','live','11:08'],
    [t('Account','Compte'),'Maison','failed','states','09 Sep, 16:20'],
    [t('Home','Accueil'),'Maison','done',null,'08 Sep, 14:10']
  ];
  return heading(t('Workspace / audits','Espace de travail / audits'),t('Audit history','Historique des audits'),t('Each run preserves its own page, scope and recorded evidence.','Chaque audit conserve sa page, son périmètre et ses preuves enregistrées.'),link('new',t('New audit','Nouvel audit'),'button primary','plus')) + `<form class="filters" id="history-filters"><label>${t('Search audits','Rechercher un audit')}<input id="history-search" type="search" value="${esc(historyQuery)}" placeholder="${t('Page or project…','Page ou projet…')}"></label><label>${t('Project','Projet')}<select id="history-project"><option value="">${t('All projects','Tous les projets')}</option>${['Maison','Atlas','Service public'].map(p=>`<option ${p===projectContext?'selected':''}>${p}</option>`).join('')}</select></label><label>${t('Status','État')}<select id="history-status">${[['',t('All statuses','Tous les états')],['done',t('Completed','Terminé')],['running',t('Running','En cours')],['failed',t('Failed','Échec')]].map(([v,l])=>`<option value="${v}" ${v===historyStatus?'selected':''}>${l}</option>`).join('')}</select></label><button type="button" data-action="clear-history">${t('Clear','Effacer')}</button></form><div class="table-wrap" tabindex="0" role="region" aria-label="${t('Audit history; scroll for more columns','Historique ; faites défiler pour voir les colonnes')}"><table><caption>${t('Illustrative runs · each target stays distinct','Audits illustratifs · chaque cible reste distincte')}</caption><thead><tr><th>${t('Page / project','Page / projet')}</th><th>${t('Execution','Exécution')}</th><th>${t('Recorded results','Résultats enregistrés')}</th><th>${t('Started','Début')}</th><th>${t('Open','Ouvrir')}</th></tr></thead><tbody>${rows.map(r=>`<tr data-history="${r[2]}" data-project="${r[1]}"><td><strong>${r[0]}</strong><small>${r[1]} · ${r[1].toLowerCase()}.example</small></td><td>${badge(r[2]==='done'?t('Completed','Terminé'):r[2]==='running'?t('Running','En cours'):t('Failed','Échec'),r[2]==='running'?'active':r[2]==='failed'?'bad':'neutral')}</td><td>${r[3]==='results'?t('4-row demo excerpt','Extrait fictif de 4 lignes'):r[3]===null?t('Not included in this study','Absent de cette étude'):t('Not final','Non définitifs')}</td><td>${r[4]}</td><td>${r[3]?`<a href="#${r[3]}" ${r[3]==='live'?'data-example-live':''}>${r[3]==='states'?t('Failure example','Exemple d’échec'):t('Open','Ouvrir')}</a>`:`<button class="quiet" data-modal="unavailable">${t('Details','Détails')}</button>`}</td></tr>`).join('')}</tbody></table></div><div class="empty" id="history-empty" hidden><h2>${t('No matching audits','Aucun audit correspondant')}</h2><p>${t('Clear the filters or prepare a page audit for this project.','Effacez les filtres ou préparez un audit de page pour ce projet.')}</p>${link('new',t('Prepare an audit','Préparer un audit'),'button')}</div><p class="meta filter-count" id="history-count" role="status"></p>`;
}
function settings(account=false) {
  const d = drafts[account?'account':'settings'] || saved;
  return heading(account?t('Personal preferences','Préférences personnelles'):t('Northstar / administration','Northstar / administration'),account?t('Your account','Votre compte'):t('Organization settings','Paramètres de l’organisation'),t('Changes stay in this browser. Drafts remain available as you move between views.','Les modifications restent dans ce navigateur. Les brouillons sont conservés pendant votre navigation.')) + `<nav class="tablinks" aria-label="${t('Settings views','Vues des paramètres')}"><a href="#settings" ${!account?'aria-current="page"':''}>${t('Organization','Organisation')}</a><a href="#account" ${account?'aria-current="page"':''}>${t('My account','Mon compte')}</a></nav><div class="form-layout"><form id="settings-form" class="panel form-grid"><fieldset><legend>${account?t('Profile & reading','Profil et lecture'):t('General','Général')}</legend><div class="form-grid"><label>${account?t('Display name','Nom affiché'):t('Organization name','Nom de l’organisation')}<input name="${account?'name':'organization'}" required value="${esc(account?d.name:d.organization)}"></label>${account?`<label>${t('Email','E-mail')}<input type="email" value="camille@example.com" readonly><small>${t('Illustrative identity. No connected account.','Identité illustrative. Aucun compte connecté.')}</small></label><label>${t('Reading density','Densité de lecture')}<select name="density"><option value="comfortable" ${d.density==='comfortable'?'selected':''}>${t('Comfortable','Confortable')}</option><option value="compact" ${d.density==='compact'?'selected':''}>${t('Compact','Compacte')}</option></select></label><label class="check"><input name="reduced" type="checkbox" ${d.reduced?'checked':''}>${t('Reduce motion','Réduire les animations')}</label><small>${t('System reduced motion is always respected. Density and motion preview immediately.','La réduction des animations du système est toujours respectée. Densité et animations sont prévisualisées immédiatement.')}</small>`:`<label>${t('Organization description','Description de l’organisation')}<textarea name="description">${esc(d.description)}</textarea></label><label>${t('Default project for new audits','Projet par défaut des nouveaux audits')}<select name="project">${['Maison','Atlas','Service public'].map(p=>`<option ${d.project===p?'selected':''}>${p}</option>`).join('')}</select></label>`}</div></fieldset><p class="save-state" id="save-state" role="status">${drafts[active]?t('Unsaved draft · kept for this visit','Brouillon non enregistré · conservé pendant cette visite'):t('Local preferences · no backend account is changed','Préférences locales · aucun compte distant modifié')}</p><div class="form-footer"><button type="reset">${t('Discard draft','Abandonner le brouillon')}</button><button class="primary" type="submit">${t('Save on this device','Enregistrer sur cet appareil')}</button></div></form><aside class="aside-note"><p class="eyebrow">${t('Your working rhythm','Votre rythme de travail')}</p><h2>${t('A little more room. Or a little more focus.','Plus d’espace. Ou plus de concentration.')}</h2><p>${t('Comfortable gives each decision breathing room. Compact brings more rows into view, while keeping controls easy to reach.','La densité confortable laisse respirer chaque décision. La densité compacte montre plus de lignes, tout en gardant des commandes faciles à atteindre.')}</p><p>${t('Only preferences are stored locally, shared by these three studies. Notes and audit drafts last until this page closes. Never enter sensitive information.','Seules les préférences sont enregistrées localement et partagées par ces trois études. Notes et brouillons d’audit durent jusqu’à la fermeture de cette page. Ne saisissez aucune donnée sensible.')}</p>${link('organization',t('View members','Voir les membres'),'button')}</aside></div>`;
}
function playground() {
  return `<section class="playground"><div class="section-head"><div><p class="eyebrow">${t('Feel the response','Ressentir la réponse')}</p><h2>${t('Small interactions, considered together','De petites interactions, pensées ensemble')}</h2></div><a class="button quiet" href="index.html?lang=${lang}&view=states">${t('Compare this view','Comparer cette vue')} ↗</a></div><div class="playground-grid"><div class="playground-cell"><h3>${t('Action / press / disabled','Action / pression / désactivé')}</h3><div class="actionrow"><button class="primary" data-action="sample-press">${t('Try a local action','Essayer une action locale')}</button><button disabled>${t('Unavailable','Indisponible')}</button></div><p id="sample-feedback" class="playground-output" role="status">${t('Feedback appears here, beside its trigger.','Le retour apparaît ici, près de sa commande.')}</p><label>${t('A field that keeps your place','Un champ qui conserve votre place')}<input placeholder="${t('Try typing, then Tab…','Saisissez, puis appuyez sur Tab…')}"></label></div><div class="playground-cell"><h3>${t('Selection / focus / disclosure','Sélection / focus / déploiement')}</h3><button class="demo-toggle" data-action="sample-toggle" aria-pressed="false">${t('Pin this example','Épingler cet exemple')}</button><details><summary>${t('Unfold contextual detail','Déployer le détail contextuel')}</summary><p>${t('The summary stays in place. Enter, Space and touch work as well as a pointer. Static reading text keeps a quiet surface.','Le résumé reste en place. Entrée, Espace et le toucher fonctionnent comme le pointeur. Le texte de lecture conserve une surface calme.')}</p><button data-modal="note-example">${t('Open a dialog','Ouvrir une boîte de dialogue')}</button></details><div class="actionrow"><button data-modal="command">${t('Try command search','Essayer la recherche rapide')}</button><a href="#results" class="button quiet">${t('Try evidence selection','Essayer la sélection des preuves')}</a></div></div></div></section>`;
}
function shell() {
  const names = navNames();
  const nav = (key,symbol) => `<a href="#${key}" data-nav="${key}" title="${names[key]}" aria-label="${names[key]}">${icon(symbol)}<span class="nav-text">${names[key]}</span></a>`;
  $('#root').innerHTML = `<a class="skip" href="#main">${t('Skip to content','Aller au contenu')}</a><div class="labbar"><span>STUDIO <b>${evolutionName}</b><span class="lab-detail"> / ${t('Local study · fictional data','Étude locale · données fictives')}</span></span><a id="compare" href="index.html?lang=${lang}">${t('Compare surfaces','Comparer les surfaces')} ↗</a></div><div class="app"><aside class="sidebar" id="sidebar"><a class="brand" href="#dashboard" aria-label="a11ya"><span class="brandmark" aria-hidden="true">a</span><span class="nav-text">a11ya<span class="brand-dot">.</span></span></a><button class="org-select" data-modal="switch" title="Northstar"><span class="org-initial" aria-hidden="true">N</span><span class="nav-text">Northstar</span><span class="nav-text" aria-hidden="true">⌄</span></button><div class="navigation-region"><span class="nav-indicator" aria-hidden="true"></span><div><p class="navlabel">${t('Workspace','Espace de travail')}</p><nav class="navgroup" aria-label="${t('Main navigation','Navigation principale')}">${nav('dashboard','home')}${nav('projects','projects')}${nav('audits','audits')}</nav></div><div class="project-nav"><p class="navlabel">${t('Example runs','Audits illustratifs')}</p><nav class="navgroup" aria-label="${t('Example audits','Audits illustratifs')}">${nav('results','audits')}${nav('live','live')}</nav></div><div class="sidebar-foot"><nav class="navgroup" aria-label="${t('Administration','Administration')}">${nav('organization','org')}${nav('settings','settings')}</nav></div></div><div class="sidebar-caption nav-text">Studio / ${evolutionName}<span>${t('A space for careful work','Un espace pour le travail attentif')}</span></div></aside><div class="work"><header class="topbar"><div class="location-tools"><button id="collapse" class="quiet icon-button" data-action="collapse" aria-controls="sidebar">${icon('menu')}</button><div class="crumb"><span>Northstar</span><span aria-hidden="true">/</span><strong id="crumb-view"></strong></div></div><div class="tools"><button id="command-trigger" class="search-trigger" data-modal="command" aria-label="${t('Search and navigate','Rechercher et naviguer')}">${icon('search')}<span>${t('Go to…','Aller à…')}</span><kbd>⌘ / Ctrl K</kbd></button><button id="motion" class="quiet icon-button" data-action="motion" aria-label="${t('Reduce motion','Réduire les animations')}" aria-pressed="false"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 8h14M8 12h11M11 16h8"/></svg></button><select id="language" aria-label="${t('Language','Langue')}"><option value="en" ${lang==='en'?'selected':''}>EN</option><option value="fr" ${lang==='fr'?'selected':''}>FR</option></select><a href="#account" class="button quiet account-link" aria-label="${t('My account','Mon compte')}"><span class="avatar" aria-hidden="true">CL</span></a></div></header><div class="draft-banner" id="draft-banner" hidden></div><main class="main" id="main" tabindex="-1"></main></div></div><dialog id="modal" aria-labelledby="modal-title"></dialog><div class="toast" role="status" aria-live="polite" id="toast"></div>`;
  $('#language').addEventListener('change', e => {
    captureDraft(); lang=e.target.value;
    const url=new URL(location.href); url.searchParams.set('lang',lang); window.history.replaceState(null,'',url);
    shell(); render(false); $('#language').focus();
  });
  applyPreferences();
}
function moveNavIndicator() {
  const selectedNav=$('[data-nav][aria-current="page"]'), indicator=$('.nav-indicator');
  if (!indicator) return;
  indicator.hidden=!selectedNav;
  if (selectedNav) { indicator.style.top=selectedNav.offsetTop+'px'; indicator.style.height=selectedNav.offsetHeight+'px'; }
}
function captureDraft() {
  if ($('#launch-url')) launchDraft={url:$('#launch-url').value,project:$('#launch-project').value};
}
function updateDraftBanner() {
  const keys=Object.keys(drafts);
  $('#draft-banner').hidden=!keys.length;
  $('#draft-banner').innerHTML=keys.length?`${t('Unsaved preferences are kept for this visit.','Les préférences non enregistrées sont conservées pendant cette visite.')} ${keys.map(key=>link(key,navNames()[key],'')).join(' · ')}`:'';
}
function render(focus=true) {
  captureDraft();
  const next=route(); const previous=active;
  active=next.name;
  if (active==='audits') projectContext=next.project;
  document.documentElement.lang=lang;
  document.title=`a11ya Studio — ${evolutionName} / ${navNames()[active]}`;
  $('#crumb-view').textContent=navNames()[active];
  $('#compare').href=`index.html?lang=${lang}&view=${active}`;
  $$('[data-nav]').forEach(a=>a.dataset.nav===active?a.setAttribute('aria-current','page'):a.removeAttribute('aria-current'));
  const main=$('#main');
  if(active==='results'&&selected<0)selected=0;
  main.innerHTML=({dashboard,projects:projectView,audits:auditHistory,results,new:newAudit,live,organization,settings,account:()=>settings(true),states}[active])()+`<footer class="page-footer"><span>${t('Illustrative data · local interactions only','Données illustratives · interactions locales uniquement')}</span><a href="#states">${t('Empty, loading & error states','États vides, chargement et erreurs')}</a></footer>`;
  menuOpen=false; $('.app').classList.remove('menu-open');
  if(active==='states') $('.heading').insertAdjacentHTML('afterend',playground());
  if (active==='new') { $('#launch-url').value=launchDraft.url; $('#launch-project').value=launchDraft.project; }
  if (active==='results') {
    $('#result-search').value=resultQuery; $('#result-outcome').value=resultOutcome;
    $('#result-filters').insertAdjacentHTML('beforeend',`<button type="button" data-action="clear-results">${t('Clear','Effacer')}</button>`);
    $('.results-grid').insertAdjacentHTML('beforebegin',`<div class="detail-toolbar"><span>${t('Procedure decisions','Décisions par procédure')}</span><button id="detail-toggle" class="quiet" aria-controls="inspector" data-action="detail"></button></div>`);
    filterResults(); updateDetail(false);
  }
  if (active==='audits') filterHistory();
  bindForms(); applyPreferences(); updateDraftBanner();
  if (focus) { $('#view-title').focus({preventScroll:true}); window.scrollTo(0,0); }
  if (previous!==active && !reduced()) {
    const children=[...main.children].filter(e=>!e.classList.contains('page-footer')).slice(0,7);
    children.forEach((el,i)=>el.animate(evolution==='opal'?[{opacity:.25,transform:'translateY(8px)'},{opacity:1,transform:'none'}]:evolution==='silk'?[{opacity:.4,transform:'translateY(4px)'},{opacity:1,transform:'none'}]:[{opacity:.45},{opacity:1}],{duration:evolution==='opal'?280:evolution==='silk'?220:130,delay:Math.min(i*22,88),easing:'cubic-bezier(.2,.7,.2,1)'}));
  }
}
function updateDetail(focus=false) {
  if (active!=='results') return;
  const panel=$('#inspector'), toggle=$('#detail-toggle');
  const row=$(`[data-finding="${selected}"]`);
  const available=row&&!row.hidden;
  panel.hidden=!detailOpen || !available;
  $('.results-grid').classList.toggle('detail-closed',panel.hidden);
  $('.results-grid').classList.toggle('detail-open',!panel.hidden);
  toggle.disabled=!available;
  toggle.setAttribute('aria-expanded',String(!panel.hidden));
  toggle.textContent=t(panel.hidden?'Show evidence':'Hide evidence',panel.hidden?'Afficher les preuves':'Masquer les preuves');
  $$('[data-finding]').forEach(b=>b.setAttribute('aria-expanded',String(!panel.hidden&&Number(b.dataset.finding)===selected)));
  if (!panel.hidden) {
    if (!panel.querySelector('.inspector-head')) panel.insertAdjacentHTML('afterbegin',`<div class="inspector-head"><span class="eyebrow">${t('Context / evidence','Contexte / preuves')}</span><button class="quiet" data-action="close-detail" aria-label="${t('Close evidence and return to result','Fermer les preuves et revenir au résultat')}">×</button></div>`);
    panel.tabIndex=-1;
    const back=panel.querySelector('[data-back]'); if(back) back.dataset.action='close-detail';
    if (!panel.querySelector('.local-note')) panel.insertAdjacentHTML('beforeend',`<section class="local-note" ${notes[selected]?'':'hidden'}><h3>${t('Local review note','Note de revue locale')}</h3><p>${esc(notes[selected]||'')}</p><small>${t('This visit only · evidence unchanged','Cette visite uniquement · preuves inchangées')}</small></section>`);
    if(focus)panel.focus({preventScroll:!mobile.matches});
  }
}
function closeDetail() {
  detailOpen=false; updateDetail(false);
  const row=$(`[data-finding="${selected}"]`);
  (row&&!row.hidden?row:$('#result-search'))?.focus({preventScroll:!mobile.matches});
}
function filterResults() {
  const visible=[];
  $$('[data-finding]').forEach(b=>{
    b.hidden=!(b.textContent.toLocaleLowerCase(lang).includes(resultQuery.toLocaleLowerCase(lang))&&(!resultOutcome||b.dataset.kind===resultOutcome));
    if(!b.hidden)visible.push(Number(b.dataset.finding));
  });
  // Clear stale context without moving keyboard focus away from the filter.
  if(!visible.includes(selected)) {
    selected=visible.length?visible[0]:-1;
    if(selected>=0)$('#inspector').outerHTML=inspector();
  }
  $$('[data-finding]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.finding)===selected)));
  $('#result-empty').hidden=Boolean(visible.length);
  updateDetail(false);
}
function filterHistory() {
  let count=0;
  $$('[data-history]').forEach(row=>{
    row.hidden=!(row.textContent.toLocaleLowerCase(lang).includes(historyQuery.toLocaleLowerCase(lang))&&(!historyStatus||row.dataset.history===historyStatus)&&(!projectContext||row.dataset.project===projectContext));
    if(!row.hidden)count++;
  });
  $('#history-empty').hidden=!!count;
  $('#history-count').textContent=t(`${count} of 4 illustrative runs`,`${count} audits illustratifs sur 4`);
}
function bindForms() {
  $$('.filters').forEach(form=>form.addEventListener('submit',e=>e.preventDefault()));
  $('#result-search')?.addEventListener('input',e=>{resultQuery=e.target.value;filterResults();});
  $('#result-outcome')?.addEventListener('change',e=>{resultOutcome=e.target.value;filterResults();});
  $('#history-search')?.addEventListener('input',e=>{historyQuery=e.target.value;filterHistory();});
  $('#history-status')?.addEventListener('change',e=>{historyStatus=e.target.value;filterHistory();});
  $('#history-project')?.addEventListener('change',e=>{projectContext=e.target.value;window.history.replaceState(null,'','#audits'+(projectContext?'?project='+encodeURIComponent(projectContext):''));filterHistory();});
  $('#launch-form')?.addEventListener('submit',e=>{
    e.preventDefault();captureDraft();const input=$('#launch-url');let valid=false;
    try { const u=new URL(input.value);valid=['http:','https:'].includes(u.protocol)&&!u.username&&!u.password; } catch {}
    input.setCustomValidity(valid?'':t('Enter an HTTP(S) URL without embedded credentials.','Saisissez une adresse HTTP(S) sans identifiants intégrés.'));
    if(!valid){input.reportValidity();return;}
    target=input.value; modal('confirm');
  });
  $('#launch-url')?.addEventListener('input',e=>e.target.setCustomValidity(''));
  const form=$('#settings-form');
  form?.addEventListener('input',()=>{
    const d={...saved};
    form.querySelectorAll('[name]').forEach(input=>d[input.name]=input.type==='checkbox'?input.checked:input.value);
    const dirty=[...form.querySelectorAll('[name]')].some(input=>d[input.name]!==saved[input.name]);
    if(dirty)drafts[active]=d;else delete drafts[active];
    $('#save-state').textContent=dirty?t('Unsaved draft · preview applied','Brouillon non enregistré · aperçu appliqué'):t('No unsaved changes','Aucune modification non enregistrée');
    applyPreferences();updateDraftBanner();
  });
  form?.addEventListener('reset',e=>{e.preventDefault();delete drafts[active];render(false);$('#settings-form button[type="reset"]').focus();});
  form?.addEventListener('submit',e=>{
    e.preventDefault();
    form.querySelectorAll('[name]').forEach(input=>saved[input.name]=input.type==='checkbox'?input.checked:input.value);
    delete drafts[active];const stored=persist();
    $('#save-state').textContent=stored?t('Saved on this device · no backend change','Enregistré sur cet appareil · aucun changement distant'):t('Applied for this visit · browser storage unavailable','Appliqué pour cette visite · stockage du navigateur indisponible');
    updateDraftBanner();applyPreferences();
    if(active==='settings')launchDraft.project=saved.project;
  });
}
function modal(kind) {
  const d=$('#modal');if(d.open)return;
  dialogReturn=document.activeElement;dialogKind=kind;dialogNavigated=false;
  let title='',body='',action='';
  if(kind==='command') {
    title=t('Where would you like to go?','Où souhaitez-vous aller ?');
    body=`<label class="command-search">${t('Search views','Rechercher une vue')}<input id="command-search" type="search" autocomplete="off" placeholder="${t('Results, projects, settings…','Résultats, projets, paramètres…')}" aria-controls="command-results"></label><div id="command-results" class="command-results"></div><p class="meta">${t('↑ ↓ to choose · Enter to open · Esc to close','↑ ↓ pour choisir · Entrée pour ouvrir · Échap pour fermer')}</p>`;
  } else if(kind==='confirm') {
    title=t('Confirm this demo audit','Confirmer cet audit fictif');
    body=`<p class="eyebrow">${esc(launchDraft.project)} / RGAA 4.1.2</p><strong class="target-url">${esc(target)}</strong><div class="notice info">${t('One page. A simulated run opens; this URL is never visited.','Une page. Un audit simulé s’ouvre ; cette adresse n’est jamais visitée.')}</div>`;
    action=t('Start demo audit','Lancer l’audit fictif');
  } else if(kind==='cancel') {
    title=t('Cancel the demo audit?','Annuler l’audit fictif ?');
    body=`<p>${t('The local run changes to Cancelled. Its last illustrative frame remains visible. This does not cancel a real job.','L’audit local passe à Annulé. Sa dernière image illustrative reste visible. Aucun audit réel n’est annulé.')}</p><p>${t('Recorded evidence is not rewritten. An incomplete run never implies conformity.','Les preuves enregistrées ne sont pas réécrites. Un audit incomplet n’implique jamais la conformité.')}</p>`;
    action=t('Cancel demo audit','Annuler l’audit fictif');
  } else if(kind==='invite') {
    title=t('Preview an invitation','Prévisualiser une invitation');
    body=`<label>${t('Email address','Adresse e-mail')}<input type="email" required placeholder="colleague@example.com"></label><label>${t('Role','Rôle')}<select><option>${t('Viewer','Lecteur')}</option><option>${t('Auditor','Auditeur')}</option></select></label><label>${t('Project access','Accès au projet')}<select><option>Maison</option><option>Atlas</option></select></label><p class="muted">${t('Nothing is sent. No access is granted. Values are discarded when closed.','Aucun envoi. Aucun accès accordé. Les valeurs sont effacées à la fermeture.')}</p>`;
    action=t('Preview invitation','Prévisualiser l’invitation');
  } else if(kind==='note') {
    title=t('Review note','Note de revue');
    body=`<p>${data()[selected].id} · ${data()[selected].outcome}</p><label>${t('Note','Note')}<textarea id="note-text" required>${esc(notes[selected]||'')}</textarea></label><p class="muted">${t('Kept only for this visit. Your note is separate from immutable evidence. Closing without applying discards edits.','Conservée uniquement pendant cette visite. La note reste distincte des preuves immuables. Fermer sans appliquer abandonne les modifications.')}</p>`;
    action=t('Keep note for this visit','Garder la note pour cette visite');
  } else if(kind==='switch') {
    title=t('Workspace','Espace de travail');
    body=`<p>Northstar · ${t('Current demo workspace','Espace fictif actuel')}</p>${link('organization',t('Manage organization','Gérer l’organisation'),'button')}<p class="muted">${t('No other workspace is connected in this study.','Aucun autre espace n’est connecté dans cette étude.')}</p>`;
  } else if(kind==='project') {
    title=t('Preview a project','Prévisualiser un projet');
    body=`<label>${t('Project name','Nom du projet')}<input required></label><label>${t('Service domain','Domaine du service')}<input placeholder="service.example"></label><p class="muted">${t('This preview creates no project. Values are discarded when closed.','Cet aperçu ne crée aucun projet. Les valeurs sont effacées à la fermeture.')}</p>`;
    action=t('Preview project','Prévisualiser le projet');
  } else if(kind==='note-example') {
    title=t('A layer with a clear return','Une fenêtre avec un retour clair');
    body=`<p>${t('Focus moves into this dialog. Escape or Close returns you to its trigger. The backdrop quiets the workspace without making the text translucent.','Le focus entre dans cette fenêtre. Échap ou Fermer le ramène à la commande. L’arrière-plan atténue l’espace de travail sans rendre le texte translucide.')}</p>`;
  } else {
    title=t('This run has no detailed fixture','Cet audit ne possède pas de détail fictif');
    body=`<p>${t('The Home run is a separate target. This study includes evidence only for Maison / Contact (024).','L’audit Accueil est une cible distincte. Cette étude inclut uniquement les preuves de Maison / Contact (024).')}</p>${link('results',t('Open Contact example (024)','Ouvrir l’exemple Contact (024)'),'button')}`;
  }
  d.className=kind==='command'?'command-dialog':'';
  d.innerHTML=`<form id="dialog-form"><header class="dialog-head"><h2 id="modal-title">${title}</h2><button type="button" class="quiet" data-close aria-label="${t('Close dialog','Fermer la boîte de dialogue')}">×</button></header><div class="dialog-body">${body}</div>${kind==='command'?'':`<footer class="dialog-actions"><button type="button" data-close>${t('Close','Fermer')}</button>${action?`<button class="primary" type="submit">${action}</button>`:''}</footer>`}</form>`;
  d.onclose=()=>{
    if(dialogNavigated){$('#view-title')?.focus({preventScroll:true});dialogKind='';return;}
    const fallback=active==='live'?$('#main [data-modal="cancel"], #main a.button'):$('#view-title');
    if(dialogReturn?.isConnected)dialogReturn.focus({preventScroll:true});else fallback?.focus({preventScroll:true});
    dialogKind='';
  };
  d.querySelector('form').onsubmit=e=>{
    e.preventDefault();
    if(kind==='command') { const button=$$('#command-results button')[commandIndex];button?.click();return; }
    if(kind==='note')notes[selected]=$('#note-text').value;
    if(kind==='confirm')dialogNavigated=true;
    d.close();
    if(kind==='confirm') { runCancelled=false;control='observe';liveTarget=target;liveProject=launchDraft.project;location.hash='live'; }
    else if(kind==='cancel') { runCancelled=true;render(false);dialogReturn=$('#main a.button');dialogReturn?.focus(); }
    else if(kind==='note') { $('#inspector').outerHTML=inspector();updateDetail(false);dialogReturn=$('#inspector [data-modal="note"]');dialogReturn.focus();toast(t('Note kept for this visit · evidence unchanged','Note conservée pour cette visite · preuves inchangées')); }
    else toast(t('Preview complete · nothing created or sent','Aperçu terminé · aucune création ni aucun envoi'));
  };
  d.showModal();
  if(kind==='command') {
    commandIndex=0;updateCommands();$('#command-search').focus();
    $('#command-search').addEventListener('input',()=>{commandIndex=0;updateCommands();});
    d.onkeydown=e=>{
      if(!['ArrowDown','ArrowUp'].includes(e.key))return;
      e.preventDefault();const buttons=$$('#command-results button');if(!buttons.length)return;
      commandIndex=(commandIndex+(e.key==='ArrowDown'?1:-1)+buttons.length)%buttons.length;
      markCommand();buttons[commandIndex].focus();
    };
  } else {
    d.onkeydown=null;
    d.querySelector('input,textarea,button[data-close]')?.focus();
    if(!reduced())d.animate(evolution==='opal'?[{opacity:0,transform:'translateY(10px) scale(.98)'},{opacity:1,transform:'none'}]:evolution==='silk'?[{opacity:0,transform:'translateY(18px)'},{opacity:1,transform:'none'}]:[{opacity:0,transform:'translateY(3px)'},{opacity:1,transform:'none'}],{duration:evolution==='contour'?140:240,easing:'cubic-bezier(.2,.8,.2,1)'});
  }
}
function updateCommands() {
  const q=$('#command-search').value.toLocaleLowerCase(lang);
  const entries=Object.entries(navNames()).filter(([key,label])=>(key+' '+label).toLocaleLowerCase(lang).includes(q));
  $('#command-results').innerHTML=entries.length?entries.map(([key,label])=>`<button type="button" data-command="${key}">${icon(key==='live'?'live':key==='projects'?'projects':key==='settings'||key==='account'?'settings':'arrow')}<span>${label}</span><small>${active===key?t('Current','Actuelle'):'↵'}</small></button>`).join(''):`<p class="result-empty">${t('No matching views','Aucune vue correspondante')}</p>`;
  markCommand();
}
function markCommand() { $$('#command-results button').forEach((b,i)=>b.classList.toggle('command-current',i===commandIndex)); }
document.addEventListener('click',e=>{
  const button=e.target.closest('button,a');if(!button)return;
  if(button.matches('[data-close]')) { $('#modal').close();return; }
  if(button.dataset.command) {
    const key=button.dataset.command;dialogNavigated=true;$('#modal').close();
    if(active===key)$('#view-title').focus();else location.hash=key;
    return;
  }
  if(button.dataset.modal) { modal(button.dataset.modal);return; }
  if(button.matches('[data-finding]')) {
    selected=Number(button.dataset.finding);detailOpen=true;
    $('#inspector').outerHTML=inspector();
    $$('[data-finding]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
    updateDetail(mobile.matches);
    if(!reduced())$('#inspector').animate(evolution==='silk'?[{opacity:.5,transform:'translateX(12px)'},{opacity:1,transform:'none'}]:evolution==='opal'?[{opacity:.4,transform:'translateY(5px)'},{opacity:1,transform:'none'}]:[{opacity:.6},{opacity:1}],{duration:evolution==='contour'?120:230,easing:'cubic-bezier(.2,.8,.2,1)'});
    return;
  }
  const action=button.dataset.action;
  if(action==='sample-press') { $('#sample-feedback').textContent=t('Local action received · nothing sent or saved','Action locale reçue · aucun envoi ni enregistrement');return; }
  if(action==='sample-toggle') { const pinned=button.getAttribute('aria-pressed')!=='true';button.setAttribute('aria-pressed',String(pinned));button.textContent=pinned?t('Pinned · click to release','Épinglé · cliquez pour libérer'):t('Pin this example','Épingler cet exemple');return; }
  if(action==='collapse') {
    if(mobile.matches){menuOpen=!menuOpen;$('.app').classList.toggle('menu-open',menuOpen);}
    else {saved.collapsed=!saved.collapsed;persist();}
    applyPreferences();return;
  }
  if(action==='motion') {
    if(mediaMotion.matches){toast(t('Your system requests reduced motion. It remains enabled.','Votre système demande une réduction des animations. Elle reste activée.'));return;}
    saved.reduced=!preference('reduced');if(drafts.account)drafts.account.reduced=saved.reduced;
    const stored=persist();applyPreferences();if($('#settings-form [name="reduced"]'))$('#settings-form [name="reduced"]').checked=saved.reduced;
    toast(t(saved.reduced?'Reduced motion enabled':'Motion follows your system',saved.reduced?'Animations réduites activées':'Les animations suivent votre système')+(stored?'':t(' · this visit only',' · cette visite uniquement')));return;
  }
  if(action==='detail') {detailOpen=!detailOpen;updateDetail(detailOpen&&mobile.matches);return;}
  if(action==='close-detail'){closeDetail();return;}
  if(action==='clear-results'){resultQuery='';resultOutcome='';$('#result-search').value='';$('#result-outcome').value='';filterResults();$('#result-search').focus();return;}
  if(action==='clear-history'){historyQuery='';historyStatus='';projectContext='';$('#history-search').value='';$('#history-status').value='';$('#history-project').value='';window.history.replaceState(null,'','#audits');filterHistory();$('#history-search').focus();return;}
  if(action==='export') {
    const url=URL.createObjectURL(new Blob([JSON.stringify({demo:true,notAuditEvidence:true,scope:'four illustrative procedure rows for Maison / Contact (024)',items:data()},null,2)],{type:'application/json'}));
    const a=document.createElement('a');a.href=url;a.download='a11ya-studio-demo-results.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);return;
  }
  if(['request-control','checkpoint','release'].includes(action)) {
    control=action==='request-control'?'requested':action==='checkpoint'?'granted':'observe';render(false);
    $('#main [data-action="checkpoint"], #main [data-action="release"], #main [data-action="request-control"]')?.focus();return;
  }
  if(button.tagName==='A') {
    if(button.getAttribute('href')==='#main'){e.preventDefault();$('#main').focus();return;}
    if(button.hasAttribute('data-example-live') || (button.getAttribute('href')==='#live'&&active!=='new'&&active!=='live')) {
      liveTarget='https://atlas.example/sign-in';liveProject='Atlas';runCancelled=false;control='observe';
    }
    if(button.getAttribute('href')==='#new'&&active==='audits'&&projectContext)launchDraft.project=projectContext;
    if($('#modal').open){dialogNavigated=true;$('#modal').close();}
    if(button.getAttribute('href')===location.hash){e.preventDefault();render();}
  }
});
document.addEventListener('keydown',e=>{
  if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='k') {e.preventDefault();modal('command');}
  if(e.key==='Escape'&&!$('#modal').open) {
    if(menuOpen){menuOpen=false;$('.app').classList.remove('menu-open');applyPreferences();$('#collapse').focus();}
    else if(active==='results'&&detailOpen&&$('#inspector').contains(document.activeElement))closeDetail();
  }
});
window.addEventListener('hashchange',()=>{if($('#modal').open){dialogNavigated=true;$('#modal').close();}render();});
window.addEventListener('beforeunload',e=>{if(Object.keys(drafts).length){e.preventDefault();e.returnValue='';}});
window.addEventListener('resize',moveNavIndicator);
shell();render(false);
