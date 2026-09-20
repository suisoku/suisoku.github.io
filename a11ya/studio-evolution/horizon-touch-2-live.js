/* Horizon Touch: Live audit 13's browser-first composition and journal disclosure,
   adapted to the retained Horizon shell. All browser activity is a local simulation. */
(() => {
  if (!document.body.hasAttribute('data-horizon-touch')) return;
  // Test-only controls stay available on an explicit preview URL. The default
  // view presents the application controls while retaining its fixture notice.
  document.body.toggleAttribute('data-preview-controls', new URLSearchParams(location.search).get('preview') === '1');

  const routeCopy = {
    'live-audit-2': {
      menu: ['Live audit 2', 'Audit en direct 2'],
      title: ['Browser first', 'Navigateur au premier plan']
    }
  };

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
    journalOpen: false, pinned: true,
    follow: true,
    unread: 0,
    connection: 'connected',
    control: 'engine',
    olderLoaded: false,
    incomingIndex: 0,
    selectedEvent: 'structure',
    events: [...eventFixtures]
  };

  let takeoverReturn = null;
  const local = pair => t(pair[0], pair[1]);
  const hashRoute = () => location.hash.slice(1).split('?')[0];
  const liveRoute = () => {
    const value = hashRoute();
    return value === 'live-audit-2' ? value : '';
  };
  const isLiveStudy = () => Boolean(liveRoute());

  function resetStudy() {
    Object.assign(study, {
      presentation: 'fit', follow: true, unread: 0, connection: 'connected',
      control: 'engine', olderLoaded: false, incomingIndex: 0,
      selectedEvent: 'structure', events: [...eventFixtures]
    });
  }

  function installNavigation(route) {
    const nav = document.querySelector('.project-nav .navgroup');
    let link = nav.querySelector('[data-nav="live-audit-2"]');
    const label = local(routeCopy['live-audit-2'].menu);
    if (!link) {
      link = document.createElement('a');
      link.href = '#live-audit-2';
      link.dataset.nav = 'live-audit-2';
      link.innerHTML = icon('live') + '<span class="nav-text"></span>';
      nav.append(link);
    }
    link.title = label;
    link.setAttribute('aria-label', label);
    link.querySelector('.nav-text').textContent = label;
    if (route) {
      document.querySelectorAll('[data-nav]').forEach(item => item.removeAttribute('aria-current'));
      link.setAttribute('aria-current', 'page');
    } else link.removeAttribute('aria-current');
    requestAnimationFrame(moveNavIndicator);
  }

  function headerActions() {
    const connectionAction = study.connection === 'reconnecting'
      ? t('Restore viewer','Rétablir l’affichage') : t('Simulate disconnect','Simuler une coupure');
    let actions;
    if (study.control === 'engine') {
      actions=`<button type="button" data-touch-live-action="toggle-connection">${connectionAction}</button><button type="button" class="primary" data-touch-live-action="open-takeover">${t('Take control','Prendre le contrôle')}</button>`;
    } else if (study.control === 'human') {
      actions=`<button type="button" data-touch-live-action="toggle-connection">${connectionAction}</button><button type="button" data-touch-live-action="enter-input" ${study.connection === 'reconnecting' ? 'disabled aria-describedby="touch-remote-status"' : ''}>${t('Enter remote input','Activer la saisie distante')}</button><button type="button" class="primary" data-touch-live-action="close-session">${t('Close session','Fermer la session')}</button>`;
    } else {
      actions=`<button type="button" class="primary" data-touch-live-action="reset-study">${t('Reset demo','Réinitialiser la démo')}</button>`;
    }
    return `<div class="touch-session-actions" role="group" aria-label="${t('Browser controls · local simulation','Commandes du navigateur · simulation locale')}">${actions}</div>`;
  }

  function remoteCanvas() {
    const closed = study.control === 'closed';
    const stale = study.connection === 'reconnecting';
    const browserState = closed
      ? t('Session closed', 'Session fermée')
      : stale ? t('Reconnecting · stale frame', 'Reconnexion · image non actuelle') : t('Static preview · connected', 'Aperçu statique · connecté');
    const displayLabel = study.presentation === 'fit' ? t('Fit', 'Ajusté') : '100%';
    return `<section class="horizon-remote" data-presentation="${study.presentation}" data-connection="${study.connection}" data-controller="${study.control}" aria-label="${t('Illustrative remote browser', 'Navigateur distant illustratif')} · ${browserState}">
      <div class="remote-scrollport">
        ${closed ? `<div class="remote-closed"><div><span aria-hidden="true">×</span><strong>${t('Browser session closed', 'Session du navigateur fermée')}</strong><p>${t('Partial results remain available in the run record.', 'Les résultats partiels restent disponibles dans l’audit.')}</p></div></div>` : `<div class="remote-canvas" id="touch-remote-canvas" role="img" aria-label="${t('Fictional Atlas sign-in page shown as remote pixels. No accessible target-page semantics are available in this image.', 'Page de connexion Atlas fictive affichée sous forme de pixels distants. Aucune sémantique accessible de la page cible n’est disponible dans cette image.')}" data-capturing="false">
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
      <p class="remote-key-status" id="touch-remote-keys" role="status" aria-live="polite"></p>
    </section>`;
  }

  function journalControls() {
    return `<div class="journal-controls">
      <button type="button" data-touch-live-action="toggle-follow" aria-pressed="${study.follow}">${study.follow ? t('Auto-follow', 'Suivi auto') : t('Follow paused', 'Suivi en pause')}</button>
      <button type="button" data-touch-live-action="incoming-event">${t('Add event', 'Ajouter un événement')}</button>
      <button type="button" data-touch-live-action="show-newest" class="journal-unread" ${study.unread ? '' : 'hidden'}>${t(`${study.unread} new event${study.unread === 1 ? '' : 's'} · Show newest`, `${study.unread} nouvel${study.unread === 1 ? '' : 's'} événement${study.unread === 1 ? '' : 's'} · Afficher`)}</button>
    </div>`;
  }

  function eventItem(event, selectable = false) {
    const body = `<span class="event-time">${event.time}</span><span class="event-copy"><small>${local(event.phase)}</small><strong>${local(event.title)}</strong><span>${local(event.detail)}</span></span>`;
    return selectable
      ? `<li><button type="button" data-touch-live-event="${event.id}" aria-expanded="${study.selectedEvent === event.id}">${body}</button>${study.selectedEvent === event.id ? `<p class="minimal-event-detail">${local(event.detail)}</p>` : ''}</li>`
      : `<li data-event-id="${event.id}">${body}</li>`;
  }

  function journal() {
    const selectable = true;
    return `<section class="live-journal live-journal-inspection" id="touch-journal" aria-labelledby="journal-title">
      <header><h2 id="journal-title" tabindex="-1">${t('Journal', 'Journal')}</h2><span>${t('Newest first', 'Plus récent en premier')}</span></header>
      ${journalControls()}
      <ol class="live-event-list" aria-label="${t('Newest events first', 'Événements du plus récent au plus ancien')}">${study.events.map(event => eventItem(event, selectable)).join('')}</ol>
      <div class="journal-footer"><button type="button" data-touch-live-action="load-older" ${study.olderLoaded ? 'disabled' : ''}>${study.olderLoaded ? t('Earlier activity loaded', 'Activité antérieure chargée') : t('Load earlier activity', 'Charger l’activité antérieure')}</button></div>
    </section>`;
  }

  function takeoverDialog() {
    return `<dialog id="touch-takeover" aria-labelledby="takeover-title">
      <form method="dialog">
        <div class="dialog-head"><div><p class="eyebrow">${t('Run 025', 'Audit 025')}</p><h2 id="takeover-title">${t('End automation and take control?', 'Arrêter l’automatisation et prendre le contrôle ?')}</h2></div><button value="cancel" aria-label="${t('Close without taking control', 'Fermer sans prendre le contrôle')}">×</button></div>
        <div class="dialog-body">
          <p>${t('Taking control permanently interrupts this audit. Work already completed is saved; unfinished checks remain incomplete.', 'Prendre le contrôle interrompt définitivement cet audit. Le travail déjà terminé est enregistré ; les vérifications inachevées restent incomplètes.')}</p>
          <ul><li>${t('The browser stays open for your manual input.', 'Le navigateur reste ouvert pour votre saisie manuelle.')}</li><li>${t('Closing it later never resumes or retries this run.', 'Le fermer ensuite ne reprend ni ne relance cet audit.')}</li><li>${t('Watching without control never stops automation.', 'Observer sans prendre le contrôle n’arrête jamais l’automatisation.')}</li></ul>
        </div>
        <div class="dialog-actions"><button value="cancel">${t('Keep observing', 'Continuer à observer')}</button><button type="button" class="primary" data-touch-live-action="confirm-takeover">${t('End automation & take control', 'Arrêter et prendre le contrôle')}</button></div>
      </form>
    </dialog>`;
  }

  function page() {
    const actions = '<div class="touch-journal-actions"><button type="button" data-touch-live-action="pin-journal" aria-pressed="'+study.pinned+'">'+(study.pinned?t('Unpin','Détacher'):t('Pin beside browser','Épingler à côté'))+'</button><button type="button" data-touch-live-action="close-journal">'+t('Close','Fermer')+'</button></div>';
    const state = study.control === 'human' ? t('You have control','Vous avez le contrôle') : study.control === 'closed' ? t('Session ended','Session terminée') : t('Observing · automation active','Observation · automatisation active');
    const connection = study.connection === 'reconnecting' ? ' · '+t('Reconnecting · stale frame','Reconnexion · image non actuelle') : '';
    return '<header class="touch-browser-toolbar"><div class="touch-browser-target"><h1 id="view-title" tabindex="-1">atlas.example/sign-in</h1><span id="touch-remote-status" tabindex="-1">'+state+connection+'</span></div><div class="touch-browser-actions"><button type="button" id="journal-toggle" data-touch-live-action="open-journal" aria-expanded="'+(study.pinned||study.journalOpen)+'" aria-controls="'+(study.pinned?'touch-journal':'touch-journal-dialog')+'" '+(study.pinned?'':'aria-haspopup="dialog"')+'>'+t('Journal','Journal')+' <span class="touch-event-count">'+study.events.length+'</span></button>'+headerActions()+'</div></header>'+
      '<div class="touch-browser-stage '+(study.pinned?'is-pinned':'')+'">'+(study.pinned?'<aside class="touch-pinned-journal">'+journal().replace('</header>',actions+'</header>')+'</aside>':'')+remoteCanvas()+'</div>'+
      '<footer class="touch-browser-footer"><span>'+t('Illustrative session · 025','Session illustrative · 025')+'</span><button type="button" data-touch-live-action="open-journal">'+t('Latest: ','Dernier : ')+local(study.events[0].title)+'</button></footer>'+
      (study.pinned?'':'<dialog id="touch-journal-dialog" aria-label="'+t('Activity journal','Journal d’activité')+'">'+actions+journal()+'</dialog>')+takeoverDialog();
  }

  function captureJournalPosition() {
    return [...document.querySelectorAll('.live-event-list')].map(list => ({scrollTop: list.scrollTop, scrollHeight: list.scrollHeight}));
  }

  function restoreJournalPosition(savedPositions, prepended = false) {
    document.querySelectorAll('.live-event-list').forEach((list, index) => {
      const savedPosition = savedPositions[index];
      if (!savedPosition) return;
      if (study.follow) list.scrollTop = 0;
      else list.scrollTop = savedPosition.scrollTop + (prepended ? list.scrollHeight - savedPosition.scrollHeight : 0);
    });
  }

  function renderStudy(options = {}) {
    const route = liveRoute();
    if (!route) return;
    const positions = options.preserveJournal ? captureJournalPosition() : [];
    active = route;
    document.documentElement.lang = lang;
    document.title = `a11ya — Horizon Poise / ${local(routeCopy[route].menu)} · ${local(routeCopy[route].title)}`;
    document.querySelector('.indigo-comparison a:last-child').href = `horizon.html?lang=${lang}#live`;
    const crumb = document.querySelector('#crumb-view');
    if (crumb) crumb.textContent = local(routeCopy[route].menu);
    installNavigation(route);
    const main = document.querySelector('#main');
    main.classList.add('horizon-live-browser');

    main.innerHTML = page();
    const viewport = main.querySelector('.remote-scrollport');
    viewport.tabIndex = 0;
    viewport.setAttribute('aria-label', t('Browser preview','Aperçu du navigateur'));
    if (study.journalOpen && !study.pinned) {
      const drawer=document.querySelector('#touch-journal-dialog');
      drawer.showModal();
      drawer.addEventListener('cancel',()=>{study.journalOpen=false; document.querySelector('#journal-toggle').setAttribute('aria-expanded','false'); requestAnimationFrame(()=>document.querySelector('#journal-toggle')?.focus());});
    }
    restoreJournalPosition(positions, options.prepended);
    applyPreferences();
    moveNavIndicator();
    if (options.focusTitle) document.querySelector('#view-title')?.focus({preventScroll: true});
    if (options.focusSelector) requestAnimationFrame(() => document.querySelector(options.focusSelector)?.focus({preventScroll: true}));
  }

  function addStateEvent(event, selected = true) {
    study.events = [event, ...study.events.filter(item => item.id !== event.id)];
    if (selected) study.selectedEvent = event.id;
  }

  function openTakeover(trigger) {
    takeoverReturn = trigger;
    const dialog = document.querySelector('#touch-takeover');
    dialog.addEventListener('close', () => takeoverReturn?.isConnected && takeoverReturn.focus({preventScroll: true}), {once: true});
    dialog.showModal();
    dialog.querySelector('button[value="cancel"]')?.focus();
  }

  function confirmTakeover() {
    const dialog = document.querySelector('#touch-takeover');
    dialog?.close('confirmed');
    study.control = 'human';
    addStateEvent({
      id: 'takeover', time: '11:09:03', phase: ['Control', 'Contrôle'],
      title: ['Automation interrupted for human control', 'Automatisation interrompue pour le contrôle humain'],
      detail: [
        'Completed and partial results were saved before the retained browser became available for input. This run will not resume.',
        'Les résultats terminés et partiels ont été enregistrés avant l’ouverture de la saisie dans le navigateur conservé. Cet audit ne reprendra pas.'
      ]
    });
    renderStudy({focusSelector: '#touch-remote-status'});
  }

  function enterRemoteInput() {
    const canvas = document.querySelector('#touch-remote-canvas');
    if (!canvas || study.control !== 'human' || study.connection !== 'connected') return;
    canvas.tabIndex = 0;
    canvas.dataset.capturing = 'true';
    canvas.setAttribute('aria-label', t('Remote input simulation active. Press Escape to return to audit status. No input is sent.', 'Simulation de saisie distante active. Appuyez sur Échap pour revenir à l’état de l’audit. Aucune saisie n’est envoyée.'));
    canvas.focus({preventScroll: true});
    const status = document.querySelector('#touch-remote-keys');
    status.textContent = t('Remote input simulation active · press Escape to return to audit status', 'Simulation de saisie distante active · appuyez sur Échap pour revenir à l’état de l’audit');
  }

  const horizonRender = render;
  render = function (...args) {
    document.body.removeAttribute('data-touch-live-browser');
    document.querySelector('#main')?.classList.remove('horizon-live-browser');
    horizonRender(...args);
    const route = liveRoute();
    installNavigation(route);
    document.body.toggleAttribute('data-touch-live-browser', Boolean(route));
    if (route) renderStudy({focusTitle: args[0] !== false});
  };

  // A confirmed launch represents a fresh local simulation. Navigation back to
  // Live still preserves the current visit, but a new launch cannot inherit a
  // disconnected or closed browser from the previous demo.
  document.addEventListener('submit', event => {
    if (event.target.id === 'dialog-form' && dialogKind === 'confirm') resetStudy();
  }, true);

  document.addEventListener('click', event => {
    if (!isLiveStudy()) return;
    const selectedEvent = event.target.closest('[data-touch-live-event]');
    if (selectedEvent) {
      study.selectedEvent = study.selectedEvent === selectedEvent.dataset.touchLiveEvent ? null : selectedEvent.dataset.touchLiveEvent;
      renderStudy({focusSelector: `[data-touch-live-event="${selectedEvent.dataset.touchLiveEvent}"]`, preserveJournal: true});
      return;
    }
    const trigger = event.target.closest('[data-touch-live-action]');
    if (!trigger) return;
    event.preventDefault();
    const action = trigger.dataset.touchLiveAction;
    if (action === 'open-journal') {study.journalOpen=true;renderStudy({focusSelector:'#journal-title'});return;}
    if (action === 'close-journal') {study.journalOpen=false;study.pinned=false;renderStudy({focusSelector:'#journal-toggle'});return;}
    if (action === 'pin-journal') {study.pinned=!study.pinned;study.journalOpen=!study.pinned;renderStudy({focusSelector:'[data-touch-live-action="pin-journal"]'});return;}
    if (action === 'toggle-follow') {
      study.follow = !study.follow;
      if (study.follow) study.unread = 0;
      renderStudy({focusSelector: '[data-touch-live-action="toggle-follow"]', preserveJournal: true});
      return;
    }
    if (action === 'show-newest') {
      study.follow = true; study.unread = 0;
      renderStudy({focusSelector: '[data-touch-live-action="toggle-follow"]'});
      return;
    }
    if (action === 'incoming-event') {
      const incoming = incomingFixtures[study.incomingIndex % incomingFixtures.length];
      study.incomingIndex += 1;
      const copy = {...incoming, id: `${incoming.id}-${study.incomingIndex}`};
      if (!study.follow) study.unread += 1;
      addStateEvent(copy, false);
      renderStudy({focusSelector: '[data-touch-live-action="incoming-event"]', preserveJournal: true, prepended: true});
      return;
    }
    if (action === 'load-older') {
      if (!study.olderLoaded) study.events = [...study.events, ...olderFixtures];
      study.olderLoaded = true;
      renderStudy({focusSelector: '#journal-title', preserveJournal: true});
      return;
    }
    if (action === 'toggle-connection') {
      study.connection = study.connection === 'connected' ? 'reconnecting' : 'connected';
      addStateEvent({
        id: `connection-${study.connection}`, time: study.connection === 'connected' ? '11:08:58' : '11:08:53', phase: ['Connection', 'Connexion'],
        title: study.connection === 'connected' ? ['Live image restored', 'Image en direct rétablie'] : ['Viewer reconnecting', 'Reconnexion de l’affichage'],
        detail: study.connection === 'connected'
          ? ['The viewer is current again. Execution and result state did not change.', 'L’affichage est de nouveau actuel. Les états d’exécution et de résultat n’ont pas changé.']
          : ['The last frame is stale. A viewer transport problem does not by itself mean the audit failed.', 'La dernière image n’est plus actuelle. Un problème de transport de l’affichage ne signifie pas à lui seul que l’audit a échoué.']
      }, false);
      renderStudy({focusSelector: '[data-touch-live-action="toggle-connection"]', preserveJournal: true, prepended: true});
      return;
    }
    if (action === 'open-takeover') { openTakeover(trigger); return; }
    if (action === 'confirm-takeover') { confirmTakeover(); return; }
    if (action === 'enter-input') { enterRemoteInput(); return; }
    if (action === 'close-session') {
      study.control = 'closed';
      study.connection = 'closed';
      addStateEvent({
        id: 'session-closed', time: '11:09:28', phase: ['Control', 'Contrôle'],
        title: ['Retained browser closed', 'Navigateur conservé fermé'],
        detail: ['The interrupted run remains terminal. Releasing the browser does not resume or retry it.', 'L’audit interrompu reste terminal. Libérer le navigateur ne reprend ni ne relance l’audit.']
      });
      renderStudy({focusSelector: '#touch-remote-status'});
      return;
    }
    if (action === 'reset-study') {
      resetStudy();
      renderStudy({focusSelector: '#touch-remote-status'});
    }
  });

  document.addEventListener('keydown', event => {
    if (!isLiveStudy()) return;
    const canvas = event.target.closest?.('#touch-remote-canvas[data-capturing="true"]');
    if (!canvas) return;
    event.preventDefault();
    if (event.key === 'Escape') {
      canvas.dataset.capturing = 'false';
      canvas.removeAttribute('tabindex');
      document.querySelector('#touch-remote-keys').textContent = t('Remote input simulation released. Audit controls are active again.', 'Simulation de saisie distante libérée. Les commandes de l’audit sont de nouveau actives.');
      document.querySelector('#touch-remote-status')?.focus({preventScroll: true});
    } else {
      document.querySelector('#touch-remote-keys').textContent = t('Demo only · no key was sent to the sample page', 'Démo uniquement · aucune touche n’a été envoyée à la page fictive');
    }
  }, true);

  render(false);
})();
