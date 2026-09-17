/* Prototype-only extension of original Silk. No production calls or changes to immutable demo evidence. */
(() => {
  // Selected a11ya blue colors are fixed in silk-final.css.
  const groupNames = [ ['Images','Images'],['Frames','Cadres'],['Colors','Couleurs'],['Multimedia','Multimédia'],['Tables','Tableaux'],['Links','Liens'],['Scripts','Scripts'],['Mandatory elements','Éléments obligatoires'],['Information structure','Structuration de l’information'],['Presentation','Présentation de l’information'],['Forms','Formulaires'],['Navigation','Navigation'],['Consultation','Consultation'] ];
  const groupFor = [11,3,8,4];
  const outcomes = () => [['bad',t('Non-conformant','Non conforme')],['warn',t('Not tested','Non testé')],['good',t('Conformant','Conforme')],['neutral',t('Not applicable','Non applicable')]];
  let groups = new Set(groupNames.map((_,i)=>i+1));
  let statuses = new Set(['bad','warn','good','neutral']);
  let grouped = false, trigger = null, popKind = '', noteIndex = -1;
  const pop = document.createElement('section');
  pop.id='silk-popover';pop.className='silk-popover';pop.setAttribute('popover','auto');pop.setAttribute('aria-labelledby','pop-title');
  document.body.append(pop);
  function closePop(restore=false) {
    if(pop.matches(':popover-open'))pop.hidePopover();
    if(restore&&trigger?.isConnected)trigger.focus();
  }
  pop.addEventListener('toggle', e => {if(trigger?.isConnected)trigger.setAttribute('aria-expanded',String(e.newState==='open'));});
  function positionPop() {
    if(!trigger?.isConnected)return;
    const rect=trigger.getBoundingClientRect(), width=pop.offsetWidth;
    const below=innerHeight-rect.bottom-20,above=rect.top-20;
    const down=below>=360||below>=above;
    pop.style.maxHeight=`${Math.max(160,down?below:above)}px`;
    const height=pop.offsetHeight;
    const left=Math.max(12,Math.min(rect.right-width,innerWidth-width-12));
    const top=down?rect.bottom+8:Math.max(12,rect.top-height-8);
    pop.style.left=`${left}px`;pop.style.top=`${top}px`;
  }
  const head = title => `<header class="pop-head"><h2 id="pop-title">${title}</h2><button class="quiet" type="button" data-pop-close aria-label="${t('Close popover','Fermer le panneau')}">×</button></header>`;
  const footer = () => `<footer class="pop-footer"><button class="quiet" data-pop-clear>${t('Reset','Réinitialiser')}</button><button data-pop-close>${t('Done','Terminé')}</button></footer>`;
  function accountBody() {
    return head(t('Your account','Votre compte'))+`<div class="account-identity"><span class="avatar" aria-hidden="true">CL</span><div><strong>${esc(saved.name)}</strong><small>camille@example.com</small></div></div><p>Northstar · ${t('Owner · demo identity','Propriétaire · identité fictive')}</p><fieldset class="pop-section"><legend>${t('Quick preferences','Préférences rapides')}</legend><label class="pop-row"><input type="checkbox" data-quick-motion ${preference('reduced')?'checked':''}><span>${t('Reduce motion','Réduire les animations')}</span></label><label class="pop-row"><input type="checkbox" data-quick-density ${preference('density')==='compact'?'checked':''}><span>${t('Compact density','Densité compacte')}</span></label></fieldset><p class="group-help">${t('Stored on this device. System reduced motion remains respected.','Enregistré sur cet appareil. La réduction système reste respectée.')}</p><nav class="pop-links" aria-label="${t('Account destinations','Navigation du compte')}"><a href="#account">${t('Preferences & profile','Préférences et profil')} ↗</a><a href="#settings">${t('Workspace settings','Paramètres de l’espace')} ↗</a><a href="#organization">${t('Organization & access','Organisation et accès')} ↗</a></nav>`;
  }
  function groupsBody() {
    return head(t('RGAA groups','Groupes RGAA'))+`<p>${t('Filter this four-procedure demo. Counts describe this excerpt, not the RGAA registry.','Filtrez les quatre procédures fictives. Les nombres décrivent cet extrait, pas le référentiel RGAA.')}</p><input class="group-search" type="search" aria-label="${t('Find an RGAA group','Rechercher un groupe RGAA')}" placeholder="${t('Find a group…','Rechercher un groupe…')}" data-group-search><div class="pop-footer"><button data-groups-all>${t('Select all','Tout sélectionner')}</button><button class="quiet" data-groups-none>${t('Clear selection','Tout désélectionner')}</button></div><fieldset class="pop-section"><legend>${t('Groups included','Groupes inclus')}</legend><div class="group-options">${groupNames.map((names,i)=>`<label class="pop-row" data-group-row><input type="checkbox" data-group="${i+1}" ${groups.has(i+1)?'checked':''}><span>${String(i+1).padStart(2,'0')} · ${names[lang==='fr'?1:0]}</span><small>${groupFor.filter(n=>n===i+1).length}</small></label>`).join('')}<p class="group-empty" hidden>${t('No matching group','Aucun groupe correspondant')}</p></div></fieldset>${footer()}`;
  }
  function statusBody() {
    return head(t('Recorded outcomes','Résultats enregistrés'))+`<p>${t('Combine outcomes. Uncertainty remains separate from conformance.','Combinez les résultats. L’incertitude reste distincte de la conformité.')}</p><fieldset class="pop-section"><legend>${t('Show outcomes','Afficher les résultats')}</legend>${outcomes().map(([key,label])=>`<label class="pop-row"><input type="checkbox" data-outcome="${key}" ${statuses.has(key)?'checked':''}><span>${badge(label,key)}</span><small>1</small></label>`).join('')}</fieldset>${footer()}`;
  }
  function displayBody() {
    return head(t('Display options','Options d’affichage'))+`<label class="pop-row"><input type="checkbox" data-grouped ${grouped?'checked':''}><span>${t('Group by RGAA topic','Regrouper par thème RGAA')}</span></label><label class="pop-row"><input type="checkbox" data-evidence ${detailOpen?'checked':''}><span>${t('Show evidence beside results','Afficher les preuves à côté')}</span></label><p>${t('Desktop keeps the list and evidence together. Narrow screens show one at a time.','Sur ordinateur, liste et preuves restent côte à côte. Un petit écran les affiche séparément.')}</p>`;
  }
  function showPop(kind, source) {
    if(pop.matches(':popover-open')&&trigger===source){closePop(true);return;}
    closePop();trigger=source;popKind=kind;
    trigger.setAttribute('aria-controls',pop.id);trigger.setAttribute('aria-expanded','true');
    let body='';
    if(kind==='account')body=accountBody();
    if(kind==='groups')body=groupsBody();
    if(kind==='outcomes')body=statusBody();
    if(kind==='display')body=displayBody();
    if(kind==='workspace')body=head(t('Workspace','Espace de travail'))+`<p>${t('Northstar · personal demo workspace','Northstar · espace personnel fictif')}</p><nav class="pop-links"><a href="#dashboard">${t('Workspace overview','Vue d’ensemble')} ↗</a><a href="#organization">${t('Organization & access','Organisation et accès')} ↗</a><a href="#settings">${t('Workspace settings','Paramètres de l’espace')} ↗</a></nav>`;
    if(kind==='actions')body=head(t('Run actions','Actions de l’audit'))+`<p>Maison / Contact · 024</p><div class="pop-links"><button data-export-demo>${t('Download demo JSON','Télécharger le JSON fictif')}</button><a href="#audits">${t('View audit history','Voir l’historique')} ↗</a><a href="#new">${t('Prepare another audit','Préparer un autre audit')} ↗</a></div>`;
    if(kind==='note'){
      noteIndex=selected;
      body=head(t('Review note','Note de revue'))+`<p>${esc(data()[noteIndex].id)} · ${esc(data()[noteIndex].outcome)}</p><label>${t('Note','Note')}<textarea id="quick-note">${esc(notes[noteIndex]||'')}</textarea></label><p class="pop-note-hint">${t('This visit only. Notes do not modify evidence. Closing without keeping discards edits.','Cette visite uniquement. Les notes ne modifient pas les preuves. Fermer sans conserver abandonne les modifications.')}</p><div class="pop-footer"><button data-pop-close>${t('Cancel','Annuler')}</button><button class="primary" data-keep-note>${t('Keep note','Conserver la note')}</button></div>`;
    }
    pop.innerHTML=body;pop.showPopover();positionPop();
    (pop.querySelector('input[type=search],textarea')||pop.querySelector('button,a,input'))?.focus({preventScroll:true});
    if(!reduced())pop.animate([{opacity:0,transform:'translateY(-3px)'},{opacity:1,transform:'none'}],{duration:130,easing:'ease-out'});
  }
  function updateChips() {
    const chips=$('#review-chips');if(!chips)return;
    const tags=[];
    if(groups.size!==13){if(groups.size===0)tags.push(`<button data-reset-groups>${t('No groups','Aucun groupe')} ×</button>`);else groups.forEach(n=>tags.push(`<button data-remove-group="${n}" aria-label="${t('Remove group','Retirer le groupe')} ${n}">${esc(groupNames[n-1][lang==='fr'?1:0])} ×</button>`));}
    if(statuses.size!==4){if(statuses.size===0)tags.push(`<button data-reset-outcomes>${t('No outcomes','Aucun résultat')} ×</button>`);else outcomes().forEach(([key,label])=>{if(statuses.has(key))tags.push(`<button data-remove-outcome="${key}">${esc(label)} ×</button>`);});}
    chips.innerHTML=tags.join('');
    const gb=$('[data-pop="groups"]'),ob=$('[data-pop="outcomes"]');
    if(gb)gb.textContent=`${t('RGAA groups','Groupes RGAA')} · ${groups.size}/13 ⌄`;
    if(ob)ob.textContent=`${t('Outcomes','Résultats')} · ${statuses.size}/4 ⌄`;
  }
  filterResults = function() {
    if(active!=='results')return;
    const rows=$$('[data-finding]'), visible=[];
    rows.forEach(b=>{const i=Number(b.dataset.finding);b.hidden=!(b.textContent.toLocaleLowerCase(lang).includes(resultQuery.toLocaleLowerCase(lang))&&groups.has(groupFor[i])&&statuses.has(b.dataset.kind));if(!b.hidden)visible.push(i);});
    if(!visible.includes(selected)){selected=visible.length?visible[0]:-1;if(selected>=0)$('#inspector').outerHTML=inspector();}
    rows.forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.finding)===selected)));
    $('#result-empty').hidden=Boolean(visible.length);
    $$('.group-heading').forEach(e=>e.remove());
    const list=$('.finding-list');
    if(grouped){[3,4,8,11].forEach(n=>{const members=rows.filter(b=>groupFor[Number(b.dataset.finding)]===n);if(members.some(b=>!b.hidden))list.insertAdjacentHTML('beforeend',`<h3 class="group-heading"><span>${String(n).padStart(2,'0')}</span>${esc(groupNames[n-1][lang==='fr'?1:0])}</h3>`);members.forEach(b=>list.append(b));});}
    else rows.sort((a,b)=>Number(a.dataset.finding)-Number(b.dataset.finding)).forEach(b=>list.append(b));
    const count=$('#review-count');if(count)count.textContent=t(`${visible.length} of 4 demo procedures · totals above describe the full excerpt`,`${visible.length} procédures fictives sur 4 · les totaux ci-dessus décrivent l’extrait complet`);
    updateChips();updateDetail(false);
  };
  function enhance() {
    const mark=$('.brandmark');if(mark)mark.outerHTML='<img class="real-logo" src="a11ya-logo.png" width="38" height="38" alt="">';
    const account=$('.account-link');if(account?.tagName==='A')account.outerHTML=`<button class="quiet account-link" data-pop="account" aria-label="${t('Account menu','Menu du compte')}" aria-expanded="false"><span class="avatar" aria-hidden="true">CL</span></button>`;
    const org=$('.org-select');if(org){org.removeAttribute('data-modal');org.dataset.pop='workspace';org.setAttribute('aria-expanded','false');}
    if(active==='results'){
      $('#result-filters').hidden=true;
      $('#result-filters').insertAdjacentHTML('beforebegin',`<div class="review-toolbar"><label>${t('Search results','Rechercher les résultats')}<input type="search" id="review-search" value="${esc(resultQuery)}" placeholder="${t('Criterion, finding, evidence…','Critère, résultat, preuve…')}"></label><button data-pop="groups" aria-expanded="false"></button><button data-pop="outcomes" aria-expanded="false"></button><button class="quiet" data-pop="display" aria-expanded="false">${t('Display','Affichage')} ⌄</button><button class="quiet" data-review-reset>${t('Reset','Réinitialiser')}</button></div><div class="active-filters" id="review-chips" aria-label="${t('Active filters','Filtres actifs')}"></div><p class="review-count" id="review-count" role="status"></p>`);
      $('#review-search').addEventListener('input',e=>{resultQuery=e.target.value;$('#result-search').value=resultQuery;filterResults();});
      const exp=$('[data-action="export"]');
      if(exp){exp.hidden=true;exp.insertAdjacentHTML('afterend',`<button data-pop="actions" aria-expanded="false">${t('Run actions','Actions de l’audit')} ⌄</button>`);}
      filterResults();
    }
  }
  const silkRender=render;
  render=function(focus=true){closePop();silkRender(focus);enhance();};
  document.addEventListener('click',e=>{
    const el=e.target.closest('button,a');if(!el)return;
    const kind=el.dataset.pop||(el.matches('[data-modal="note"]')?'note':null);
    if(kind){e.preventDefault();e.stopImmediatePropagation();showPop(kind,el);return;}
    if(pop.contains(el)){
      if(el.hasAttribute('data-pop-close')){e.preventDefault();closePop(true);return;}
      if(el.hasAttribute('data-pop-clear')){if(popKind==='groups')groups=new Set(groupNames.map((_,i)=>i+1));if(popKind==='outcomes')statuses=new Set(outcomes().map(r=>r[0]));pop.querySelectorAll('input[type=checkbox]').forEach(c=>c.checked=true);filterResults();return;}
      if(el.hasAttribute('data-groups-all')||el.hasAttribute('data-groups-none')){groups=new Set(el.hasAttribute('data-groups-all')?groupNames.map((_,i)=>i+1):[]);pop.querySelectorAll('[data-group]').forEach(c=>c.checked=groups.has(Number(c.dataset.group)));filterResults();return;}
      if(el.hasAttribute('data-export-demo')){closePop(true);$('[data-action="export"]')?.click();return;}
      if(el.hasAttribute('data-keep-note')){notes[noteIndex]=$('#quick-note').value;closePop(true);$('#inspector').outerHTML=inspector();updateDetail(false);$('#inspector [data-modal="note"]')?.focus();toast(t('Note kept for this visit','Note conservée pour cette visite'));return;}
      if(el.tagName==='A')closePop();
    }
    if(el.hasAttribute('data-review-reset')){groups=new Set(groupNames.map((_,i)=>i+1));statuses=new Set(outcomes().map(r=>r[0]));resultQuery='';$('#review-search').value='';$('#result-search').value='';filterResults();$('#review-search').focus();}
    if(el.hasAttribute('data-remove-group')){groups.delete(Number(el.dataset.removeGroup));filterResults();$('[data-pop="groups"]').focus();}
    if(el.hasAttribute('data-remove-outcome')){statuses.delete(el.dataset.removeOutcome);filterResults();$('[data-pop="outcomes"]').focus();}
    if(el.hasAttribute('data-reset-groups')){groups=new Set(groupNames.map((_,i)=>i+1));filterResults();$('[data-pop="groups"]').focus();}
    if(el.hasAttribute('data-reset-outcomes')){statuses=new Set(outcomes().map(r=>r[0]));filterResults();$('[data-pop="outcomes"]').focus();}
  },true);
  pop.addEventListener('input',e=>{
    if(!e.target.hasAttribute('data-group-search'))return;
    let count=0;pop.querySelectorAll('[data-group-row]').forEach(row=>{row.hidden=!row.textContent.toLocaleLowerCase(lang).includes(e.target.value.toLocaleLowerCase(lang));if(!row.hidden)count++;});pop.querySelector('.group-empty').hidden=!!count;
  });
  pop.addEventListener('change',e=>{
    const el=e.target;
    if(el.hasAttribute('data-group')){const n=Number(el.dataset.group);el.checked?groups.add(n):groups.delete(n);filterResults();}
    if(el.hasAttribute('data-outcome')){el.checked?statuses.add(el.dataset.outcome):statuses.delete(el.dataset.outcome);filterResults();}
    if(el.hasAttribute('data-grouped')){grouped=el.checked;filterResults();}
    if(el.hasAttribute('data-evidence')){detailOpen=el.checked;updateDetail(false);}
    if(el.hasAttribute('data-quick-motion')||el.hasAttribute('data-quick-density')){
      const key=el.hasAttribute('data-quick-motion')?'reduced':'density',value=key==='reduced'?el.checked:el.checked?'compact':'comfortable';
      saved[key]=value;if(drafts.account)drafts.account[key]=value;const ok=persist();applyPreferences();toast(ok?t('Preference saved on this device','Préférence enregistrée sur cet appareil'):t('Preference kept for this visit only','Préférence conservée pour cette visite uniquement'));
    }
  });
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&pop.matches(':popover-open')){e.preventDefault();e.stopImmediatePropagation();closePop(true);}},true);
  addEventListener('resize',()=>{if(pop.matches(':popover-open'))positionPop();});
  document.addEventListener('scroll',e=>{if(pop.matches(':popover-open')&&!pop.contains(e.target))positionPop();},true);
  enhance();
})();
