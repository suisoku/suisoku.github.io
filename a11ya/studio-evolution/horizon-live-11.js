/* Live audit 11: the original Horizon #live run bar, journal and browser only.
   Templates and fictional fixtures derive from horizon-live-audits.js, never Live audit 10. */
(() => {
  const lang=new URLSearchParams(location.search).get('lang')==='fr'?'fr':'en';
  const t=(en,fr)=>lang==='fr'?fr:en;
  const local=pair=>t(...pair);
  const icon=()=>'<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="13" rx="2"/><path d="M8 21h8m-4-5v5"/></svg>';
  const eventFixtures = [
    {
      id: 'structure', time: '11:08:26', phase: ['Observation', 'Observation'],
      title: ['Reading form structure', 'Lecture de la structure du formulaire'],
      detail: [
        'The engine is collecting page observations. No procedure outcome has been recorded yet.',
        'Le moteur collecte les observations de la page. Aucune décision de procédure n’est encore enregistrée.'
      ]
    },
    {
      id: 'document', time: '11:08:19', phase: ['Browser', 'Navigateur'],
      title: ['Document ready', 'Document prêt'],
      detail: [
        'The target document is available inside the fixed 1440 × 900 audit viewport.',
        'Le document cible est disponible dans la fenêtre d’audit fixe de 1 440 × 900.'
      ]
    },
    {
      id: 'connected', time: '11:08:08', phase: ['Connection', 'Connexion'],
      title: ['Browser connected', 'Navigateur connecté'],
      detail: [
        'Observation is available. Input remains with automation and watching does not interrupt the run.',
        'L’observation est disponible. La saisie reste réservée à l’automatisation et l’observation n’interrompt pas l’audit.'
      ]
    },
    {
      id: 'accepted', time: '11:08:02', phase: ['Run', 'Audit'],
      title: ['Run accepted', 'Audit accepté'],
      detail: [
        'Run 025 was accepted for one page under RGAA 4.1.2.',
        'L’audit 025 a été accepté pour une page selon le RGAA 4.1.2.'
      ]
    }
  ];

  const incomingFixtures = [
    {
      id: 'landmarks', time: '11:08:31', phase: ['Observation', 'Observation'],
      title: ['Landmarks inventoried', 'Repères inventoriés'],
      detail: [
        'Page landmarks were grouped by role for related checks. No outcome has been recorded yet.',
        'Les repères de la page ont été regroupés par rôle pour les vérifications associées. Aucune décision n’est encore enregistrée.'
      ]
    },
    {
      id: 'controls', time: '11:08:37', phase: ['Observation', 'Observation'],
      title: ['Form controls grouped', 'Champs de formulaire regroupés'],
      detail: [
        'Form controls were grouped by role and state for the next observation step. No outcome has been recorded yet.',
        'Les champs de formulaire ont été regroupés par rôle et par état pour la prochaine étape d’observation. Aucune décision n’est encore enregistrée.'
      ]
    },
    {
      id: 'focus', time: '11:08:44', phase: ['Procedure', 'Procédure'],
      title: ['Focus journey scheduled', 'Parcours du focus planifié'],
      detail: [
        'A keyboard journey was queued to observe forward and backward focus order. No outcome has been recorded yet.',
        'Un parcours au clavier a été planifié pour observer l’ordre du focus en avant et en arrière. Aucune décision n’est encore enregistrée.'
      ]
    }
  ];

  const olderFixtures = [
    {
      id: 'queued', time: '11:07:58', phase: ['Run', 'Audit'],
      title: ['Run queued', 'Audit mis en file'],
      detail: [
        'The request received its run identity and is waiting for execution.',
        'La demande a reçu son identité d’audit et attend son exécution.'
      ]
    },
    {
      id: 'scope', time: '11:07:54', phase: ['Scope', 'Périmètre'],
      title: ['Single-page scope recorded', 'Périmètre d’une page enregistré'],
      detail: [
        'The requested page, RGAA version, and viewport were recorded for this run.',
        'La page demandée, la version du RGAA et la fenêtre d’affichage ont été enregistrées pour cet audit.'
      ]
    }
  ];

  const study = {
    presentation: 'fit',
    follow: true,
    unread: 0,
    connection: 'connected',
    control: 'engine',
    olderLoaded: false,
    incomingIndex: 0,
    selectedEvent: 'structure',
    events: [...eventFixtures]
  };

  function runContext() {
    return `<section class="live-run-context" aria-label="${t('Illustrative run identity and scope', 'Identité et périmètre de l’audit illustratif')}">
      <div class="live-run-id"><span>${t('Run', 'Audit')}</span><strong>025</strong><small>${t('Illustrative demo', 'Démo illustrative')}</small></div>
      <dl>
        <div><dt>${t('Target page', 'Page cible')}</dt><dd><code>https://atlas.example/sign-in</code></dd></div>
        <div><dt>${t('Requested scope', 'Périmètre demandé')}</dt><dd>${t('One public page', 'Une page publique')}</dd></div>
        <div><dt>${t('Reference', 'Référentiel')}</dt><dd>RGAA 4.1.2</dd></div>
        <div><dt>${t('Audited viewport', 'Fenêtre auditée')}</dt><dd>1440 × 900 · 16:10</dd></div>
      </dl>
    </section>`;
  }

  function remoteCanvas() {
    const closed = study.control === 'closed';
    const stale = study.connection === 'reconnecting';
    const browserState = closed
      ? t('Session closed', 'Session fermée')
      : stale ? t('Reconnecting · stale frame', 'Reconnexion · image non actuelle') : t('Static browser specimen', 'Maquette statique du navigateur');
    const displayLabel = study.presentation === 'fit' ? t('Fit', 'Ajusté') : '100%';
    return `<section class="horizon-remote" data-presentation="${study.presentation}" data-connection="${study.connection}" data-controller="${study.control}" aria-label="${t('Illustrative remote browser', 'Navigateur distant illustratif')}">
      <header class="remote-chrome">
        <div><span class="remote-product">${icon('live')} ${t('Live browser', 'Navigateur en direct')}</span><strong>${browserState}</strong></div>
        <div class="remote-display-controls" role="group" aria-label="${t('Remote display size', 'Taille d’affichage du navigateur distant')}">
          <button type="button" data-live-action="display-fit" aria-pressed="${study.presentation === 'fit'}">${t('Fit', 'Ajuster')}</button>
          <button type="button" data-live-action="display-actual" aria-pressed="${study.presentation === 'actual'}">100%</button>
        </div>
      </header>
      <div class="remote-scrollport" tabindex="0" aria-label="${t('Browser image; scroll at 100%','Image du navigateur ; défilement à 100 %')}">
        ${closed ? `<div class="remote-closed"><div><span aria-hidden="true">×</span><strong>${t('Browser session closed', 'Session du navigateur fermée')}</strong><p>${t('Partial results remain available in the run record.', 'Les résultats partiels restent disponibles dans l’audit.')}</p></div></div>` : `<div class="remote-canvas" id="horizon-remote-canvas" role="img" aria-label="${t('Fictional Atlas sign-in page shown as remote pixels. No accessible target-page semantics are available in this image.', 'Page de connexion Atlas fictive affichée sous forme de pixels distants. Aucune sémantique accessible de la page cible n’est disponible dans cette image.')}" data-capturing="false">
          <div class="remote-page" aria-hidden="true">
            <div class="remote-window-bar"><span><i></i><i></i><i></i></span><b>atlas.example/sign-in</b><em>1440 × 900</em></div>
            <div class="remote-site-bar"><b>Atlas</b><span>Workspace&nbsp;&nbsp;&nbsp; Support</span></div>
            <div class="remote-page-body">
              <div class="remote-page-copy"><span>ATLAS WORKSPACE</span><h2>${t('Work together,<br>without the noise.', 'Travaillez ensemble,<br>sans le bruit.')}</h2><p>${t('A calm place for projects, files and decisions.', 'Un espace calme pour les projets, les fichiers et les décisions.')}</p><div class="remote-shape"></div></div>
              <div class="remote-login-card"><small>${t('WELCOME BACK', 'BON RETOUR')}</small><h3>${t('Sign in', 'Connexion')}</h3><label>${t('Email address', 'Adresse e-mail')}</label><div class="remote-field">camille@example.com</div><div class="remote-submit">${t('Continue', 'Continuer')} →</div><p>${t('Sample page', 'Page fictive')}</p></div>
            </div>
          </div>
        </div>`}
      </div>
      <footer class="remote-meta">
        <span><strong>${t('Audited canvas', 'Surface auditée')}:</strong> 1440 × 900 (16:10)</span>
        <span><strong>${t('Display', 'Affichage')}:</strong> ${displayLabel} · ${t('presentation only', 'présentation uniquement')}</span>
        <span>${stale ? t('The last image is not current. Execution state is shown separately.', 'La dernière image n’est plus actuelle. L’état d’exécution est indiqué séparément.') : t('Use the journal for a text view of activity', 'Consultez le journal pour une vue textuelle de l’activité')}</span>
      </footer>
      <p class="remote-key-status" id="remote-key-status" role="status" aria-live="polite"></p>
    </section>`;
  }

  function journalControls() {
    return `<div class="journal-controls">
      <button type="button" data-live-action="toggle-follow" aria-pressed="${study.follow}">${study.follow ? t('Following newest', 'Suivi du plus récent') : t('Follow newest', 'Suivre le plus récent')}</button>
      <button type="button" data-live-action="incoming-event">${t('Preview incoming event', 'Aperçu d’un nouvel événement')}</button>
      <button type="button" data-live-action="show-newest" class="journal-unread" ${study.unread ? '' : 'hidden'}>${t(`${study.unread} new event${study.unread === 1 ? '' : 's'} · Show newest`, `${study.unread} nouvel${study.unread === 1 ? '' : 's'} événement${study.unread === 1 ? '' : 's'} · Afficher`)}</button>
    </div>`;
  }

  function eventItem(event, selectable = false) {
    const body = `<span class="event-time">${event.time}</span><span class="event-copy"><small>${local(event.phase)}</small><strong>${local(event.title)}</strong><span>${local(event.detail)}</span></span>`;
    return selectable
      ? `<li><button type="button" data-live-event="${event.id}" aria-expanded="${study.selectedEvent === event.id}">${body}</button>${study.selectedEvent === event.id ? `<p class="minimal-event-detail">${local(event.detail)}</p>` : ''}</li>`
      : `<li data-event-id="${event.id}">${body}</li>`;
  }

  function journal() {
    const selectable = true;
    return `<section class="live-journal live-journal-inspection" aria-labelledby="journal-title">
      <header><div><p class="eyebrow">${t('Run activity', 'Activité de l’audit')}</p><h2 id="journal-title" tabindex="-1">${t('Execution journal', 'Journal d’exécution')}</h2><p>${t('Newest first. Pause follow to read without being moved.', 'Du plus récent au plus ancien. Suspendez le suivi pour lire sans déplacement.')}</p></div></header>
      ${journalControls()}
      <ol class="live-event-list" aria-label="${t('Newest events first', 'Événements du plus récent au plus ancien')}">${study.events.map(event => eventItem(event, selectable)).join('')}</ol>
      <div class="journal-footer"><button type="button" data-live-action="load-older" ${study.olderLoaded ? 'disabled' : ''}>${study.olderLoaded ? t('Earlier activity loaded', 'Activité antérieure chargée') : t('Load earlier activity', 'Charger l’activité antérieure')}</button></div>
    </section>`;
  }


  document.documentElement.lang=lang;
  document.title=t('a11ya — Live audit 11 / Minimal','a11ya — Audit en direct 11 / Minimal');
  function render(focusSelector,prepend=false){
    const list=document.querySelector('.live-event-list');
    const saved=list?{top:list.scrollTop,height:list.scrollHeight}:null;
    document.querySelector('#minimal-live').innerHTML='<h1 class="live-view-title">'+t('Live audit 11','Audit en direct 11')+'</h1>'+runContext()+'<div class="minimal-workspace">'+journal()+remoteCanvas()+'</div>';
    const next=document.querySelector('.live-event-list');
    if(saved)next.scrollTop=study.follow?0:saved.top+(prepend?next.scrollHeight-saved.height:0);
    if(focusSelector)document.querySelector(focusSelector)?.focus({preventScroll:true});
  }
  document.addEventListener('click',event=>{
    const selected=event.target.closest('[data-live-event]');
    if(selected){study.selectedEvent=study.selectedEvent===selected.dataset.liveEvent?null:selected.dataset.liveEvent;render('[data-live-event="'+selected.dataset.liveEvent+'"]');return;}
    const button=event.target.closest('[data-live-action]');if(!button)return;
    const action=button.dataset.liveAction;let focus='[data-live-action="'+action+'"]',prepend=false;
    if(action==='display-fit'||action==='display-actual')study.presentation=action==='display-fit'?'fit':'actual';
    else if(action==='toggle-follow'){study.follow=!study.follow;if(study.follow)study.unread=0;}
    else if(action==='show-newest'){study.follow=true;study.unread=0;focus='[data-live-action="toggle-follow"]';}
    else if(action==='incoming-event'){const sample=incomingFixtures[study.incomingIndex%incomingFixtures.length];study.incomingIndex++;study.events.unshift({...sample,id:sample.id+'-'+study.incomingIndex});if(!study.follow)study.unread++;prepend=true;}
    else if(action==='load-older'){if(!study.olderLoaded)study.events.push(...olderFixtures);study.olderLoaded=true;focus='#journal-title';}
    else return;
    render(focus,prepend);
  });
  render();
})();
