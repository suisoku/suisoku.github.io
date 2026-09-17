/* Live audit 11 adapts the original Horizon live view within its original shell.
   Run controls remain local simulations; only the three workspace regions remain. */
(() => {
  if (!document.body.hasAttribute('data-minimal-live')) return;
  if (!location.hash) history.replaceState(null,'',location.pathname+location.search+'#live');

  const routeCopy = {
    live: {
      menu: ['Live audit 11', 'Audit en direct 11'],
      title: ['Minimal workspace', 'Espace minimal']
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
    return value === 'live' || value === 'live-audit-3' ? 'live' : '';
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
    const link = document.querySelector('.project-nav [data-nav="live"]');
    if (!link) return;
    const label = local(routeCopy.live.menu);
    link.title = label;
    link.setAttribute('aria-label', label);
    link.querySelector('.nav-text').textContent = label;
    if (route) {
      document.querySelectorAll('[data-nav]').forEach(item => item.removeAttribute('aria-current'));
      link.setAttribute('aria-current', 'page');
    }
  }

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

  function axes() {
    const interrupted = study.control !== 'engine';
    const closed = study.control === 'closed';
    const execution = interrupted
      ? [t('Interrupted · terminal', 'Interrompue · état terminal'), t('Human control ended automation', 'Le contrôle humain a arrêté l’automatisation')]
      : [t('Running', 'En cours'), t('Reading form structure', 'Lecture de la structure du formulaire')];
    const connection = closed
      ? [t('Session closed', 'Session fermée'), t('No live image or input', 'Aucune image ni saisie en direct')]
      : study.connection === 'reconnecting'
        ? [t('Reconnecting', 'Reconnexion'), t('Last frame is stale', 'La dernière image n’est plus actuelle')]
        : [t('Connected', 'Connecté'), t('Live image available', 'Image en direct disponible')];
    const input = study.control === 'engine'
      ? [t('Monitor only', 'Observation seule'), t('Automation owns input', 'La saisie appartient à l’automatisation')]
      : study.control === 'human'
        ? [t('Human input', 'Saisie humaine'), t('Retained browser session', 'Session de navigateur conservée')]
        : [t('Ended', 'Terminée'), t('No controller', 'Aucun contrôle')];
    const results = interrupted
      ? [t('Partial results saved', 'Résultats partiels enregistrés'), t('Unfinished checks stay incomplete', 'Les vérifications inachevées restent incomplètes')]
      : [t('Not final', 'Non définitifs'), t('Outcomes remain separate from execution', 'Les décisions restent distinctes de l’exécution')];
    const item = (label, value, detail, tone) => `<div data-tone="${tone}"><dt>${label}</dt><dd><strong>${value}</strong><span>${detail}</span></dd></div>`;
    return `<dl class="live-axes" aria-label="${t('Run state', 'État de l’audit')}">
      ${item(t('Execution', 'Exécution'), execution[0], execution[1], interrupted ? 'warning' : 'active')}
      ${item(t('Connection', 'Connexion'), connection[0], connection[1], closed || study.connection === 'reconnecting' ? 'warning' : 'good')}
      ${item(t('Input', 'Saisie'), input[0], input[1], study.control === 'human' ? 'control' : 'neutral')}
      ${item(t('Recorded results', 'Résultats enregistrés'), results[0], results[1], interrupted ? 'warning' : 'neutral')}
    </dl>`;
  }

  function controlBar() {
    const connectionAction = study.connection === 'reconnecting'
      ? t('Restore viewer', 'Rétablir l’affichage')
      : t('Preview connection loss', 'Aperçu d’une perte de connexion');
    let message;
    let actions;
    if (study.control === 'engine') {
      message = t(
        'You are monitoring. Watching does not interrupt automation. Taking control permanently ends this run.',
        'Vous observez l’audit. L’observation n’interrompt pas l’automatisation. Prendre le contrôle met définitivement fin à cet audit.'
      );
      actions = `<button type="button" data-live-action="toggle-connection">${connectionAction}</button>
        <button type="button" class="primary" data-live-action="open-takeover">${t('Take human control', 'Prendre le contrôle')}</button>`;
    } else if (study.control === 'human') {
      message = study.connection === 'reconnecting'
        ? t('Automation has ended and partial results are saved. The retained browser is reconnecting; its last frame is stale.', 'L’automatisation est terminée et les résultats partiels sont enregistrés. Le navigateur conservé se reconnecte ; sa dernière image n’est plus actuelle.')
        : t('Automation has ended and partial results are saved. The browser remains open for your input.', 'L’automatisation est terminée et les résultats partiels sont enregistrés. Le navigateur reste ouvert pour votre saisie.');
      actions = `<button type="button" data-live-action="toggle-connection">${connectionAction}</button>
        <button type="button" data-live-action="enter-input" ${study.connection === 'reconnecting' ? 'disabled aria-describedby="remote-input-status"' : ''}>${t('Enter remote input', 'Activer la saisie distante')}</button>
        <button type="button" class="primary" data-live-action="close-session">${t('Close retained session', 'Fermer la session conservée')}</button>`;
    } else {
      message = t(
        'The retained browser is closed. Run 025 remains interrupted; closing never resumes or retries it.',
        'Le navigateur conservé est fermé. L’audit 025 reste interrompu ; la fermeture ne le reprend ni ne le relance.'
      );
      actions = `<button type="button" class="primary" data-live-action="reset-study">${t('Reset demo', 'Réinitialiser la démo')}</button>`;
    }
    return `<section class="live-control-bar" id="remote-input-status" tabindex="-1" aria-label="${t('Browser responsibility and controls', 'Responsabilité et commandes du navigateur')}">
      <div><span class="live-responsibility">${study.control === 'engine' ? t('Automation has input', 'L’automatisation contrôle la saisie') : study.control === 'human' ? t('You have input · automation ended', 'Vous contrôlez la saisie · automatisation terminée') : t('Session ended', 'Session terminée')}</span><p>${message}</p></div>
      <div class="live-control-actions">${actions}</div>
    </section>`;
  }

  function remoteCanvas() {
    const closed = study.control === 'closed';
    const stale = study.connection === 'reconnecting';
    const browserState = closed
      ? t('Session closed', 'Session fermée')
      : stale ? t('Reconnecting · stale frame', 'Reconnexion · image non actuelle') : t('Static preview · connected', 'Aperçu statique · connecté');
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

  function selectedEventDetail() {
    const event = study.events.find(item => item.id === study.selectedEvent) || study.events[0];
    return `<section class="live-event-detail" aria-live="polite" aria-labelledby="selected-event-title">
      <p class="eyebrow">${t('Selected journal event', 'Événement du journal sélectionné')}</p>
      <div><time>${event.time}</time><span>${local(event.phase)}</span></div>
      <h2 id="selected-event-title">${local(event.title)}</h2>
      <p>${local(event.detail)}</p>
    </section>`;
  }

  function takeoverDialog() {
    return `<dialog id="horizon-takeover" aria-labelledby="takeover-title">
      <form method="dialog">
        <div class="dialog-head"><div><p class="eyebrow">${t('Run 025', 'Audit 025')}</p><h2 id="takeover-title">${t('End automation and take control?', 'Arrêter l’automatisation et prendre le contrôle ?')}</h2></div><button value="cancel" aria-label="${t('Close without taking control', 'Fermer sans prendre le contrôle')}">×</button></div>
        <div class="dialog-body">
          <p>${t('Taking control permanently interrupts this audit. Work already completed is saved; unfinished checks remain incomplete.', 'Prendre le contrôle interrompt définitivement cet audit. Le travail déjà terminé est enregistré ; les vérifications inachevées restent incomplètes.')}</p>
          <ul><li>${t('The browser stays open for your manual input.', 'Le navigateur reste ouvert pour votre saisie manuelle.')}</li><li>${t('Closing it later never resumes or retries this run.', 'Le fermer ensuite ne reprend ni ne relance cet audit.')}</li><li>${t('Watching without control never stops automation.', 'Observer sans prendre le contrôle n’arrête jamais l’automatisation.')}</li></ul>
        </div>
        <div class="dialog-actions"><button value="cancel">${t('Keep observing', 'Continuer à observer')}</button><button type="button" class="primary" data-live-action="confirm-takeover">${t('End automation & take control', 'Arrêter et prendre le contrôle')}</button></div>
      </form>
    </dialog>`;
  }

  function page() {
    const controls=controlBar().replace('<section class="live-control-bar"','<div class="minimal-run-actions"').replace('</section>','</div>');
    const run=runContext().replace('</section>',controls+'</section>');
    return '<h1 class="live-view-title" id="view-title" tabindex="-1">'+local(routeCopy.live.menu)+'</h1>'+run+'<div class="minimal-workspace">'+journal()+remoteCanvas()+'</div>'+takeoverDialog();
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
    document.title = `a11ya Studio — Horizon / ${local(routeCopy[route].menu)} · ${local(routeCopy[route].title)}`;
    const crumb = document.querySelector('#crumb-view');
    if (crumb) crumb.textContent = local(routeCopy[route].menu);
    installNavigation(route);
    const main = document.querySelector('#main');
    main.classList.add('horizon-live');

    main.innerHTML = page();
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
    const dialog = document.querySelector('#horizon-takeover');
    dialog.addEventListener('close', () => takeoverReturn?.isConnected && takeoverReturn.focus({preventScroll: true}), {once: true});
    dialog.showModal();
    dialog.querySelector('button[value="cancel"]')?.focus();
  }

  function confirmTakeover() {
    const dialog = document.querySelector('#horizon-takeover');
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
    renderStudy({focusSelector: '#remote-input-status'});
  }

  function enterRemoteInput() {
    const canvas = document.querySelector('#horizon-remote-canvas');
    if (!canvas || study.control !== 'human' || study.connection !== 'connected') return;
    canvas.tabIndex = 0;
    canvas.dataset.capturing = 'true';
    canvas.setAttribute('aria-label', t('Remote input simulation active. Press Escape to return to audit status. No input is sent.', 'Simulation de saisie distante active. Appuyez sur Échap pour revenir à l’état de l’audit. Aucune saisie n’est envoyée.'));
    canvas.focus({preventScroll: true});
    const status = document.querySelector('#remote-key-status');
    status.textContent = t('Remote input simulation active · press Escape to return to audit status', 'Simulation de saisie distante active · appuyez sur Échap pour revenir à l’état de l’audit');
  }

  const horizonRender = render;
  render = function (...args) {
    horizonRender(...args);
    const route = liveRoute();
    document.body.toggleAttribute('data-live-view', Boolean(route));
    installNavigation(route);
    if (route) renderStudy({focusTitle: args[0] !== false});
    else {
      const main = document.querySelector('#main');
      main?.classList.remove('horizon-live');
      if (main) delete main.dataset.liveLayout;
    }
  };

  document.addEventListener('click', event => {
    if (!isLiveStudy()) return;
    const selectedEvent = event.target.closest('[data-live-event]');
    if (selectedEvent) {
      study.selectedEvent = study.selectedEvent === selectedEvent.dataset.liveEvent ? null : selectedEvent.dataset.liveEvent;
      renderStudy({focusSelector: `[data-live-event="${study.selectedEvent}"]`, preserveJournal: true});
      return;
    }
    const trigger = event.target.closest('[data-live-action]');
    if (!trigger) return;
    event.preventDefault();
    const action = trigger.dataset.liveAction;
    if (action === 'display-fit' || action === 'display-actual') {
      study.presentation = action === 'display-fit' ? 'fit' : 'actual';
      renderStudy({focusSelector: `[data-live-action="${action}"]`, preserveJournal: true});
      return;
    }
    if (action === 'toggle-follow') {
      study.follow = !study.follow;
      if (study.follow) study.unread = 0;
      renderStudy({focusSelector: '[data-live-action="toggle-follow"]', preserveJournal: true});
      return;
    }
    if (action === 'show-newest') {
      study.follow = true; study.unread = 0;
      renderStudy({focusSelector: '[data-live-action="toggle-follow"]'});
      return;
    }
    if (action === 'incoming-event') {
      const incoming = incomingFixtures[study.incomingIndex % incomingFixtures.length];
      study.incomingIndex += 1;
      const copy = {...incoming, id: `${incoming.id}-${study.incomingIndex}`};
      if (!study.follow) study.unread += 1;
      addStateEvent(copy, false);
      renderStudy({focusSelector: '[data-live-action="incoming-event"]', preserveJournal: true, prepended: true});
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
      renderStudy({focusSelector: '[data-live-action="toggle-connection"]', preserveJournal: true, prepended: true});
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
      renderStudy({focusSelector: '#remote-input-status'});
      return;
    }
    if (action === 'reset-study') {
      resetStudy();
      renderStudy({focusSelector: '#remote-input-status'});
    }
  });

  document.addEventListener('keydown', event => {
    const canvas = event.target.closest?.('#horizon-remote-canvas[data-capturing="true"]');
    if (!canvas) return;
    event.preventDefault();
    if (event.key === 'Escape') {
      canvas.dataset.capturing = 'false';
      canvas.removeAttribute('tabindex');
      document.querySelector('#remote-key-status').textContent = t('Remote input simulation released. Audit controls are active again.', 'Simulation de saisie distante libérée. Les commandes de l’audit sont de nouveau actives.');
      document.querySelector('#remote-input-status')?.focus({preventScroll: true});
    } else {
      document.querySelector('#remote-key-status').textContent = t('Demo only · no key was sent to the sample page', 'Démo uniquement · aucune touche n’a été envoyée à la page fictive');
    }
  }, true);

  render(false);
})();
