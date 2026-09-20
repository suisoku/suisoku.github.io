/* Second pass, isolated from Horizon Touch. Shared Horizon scripts still own
   fixtures, filtering, notes, dialogs and preferences. No product API calls. */
(() => {
  if (!document.body.hasAttribute('data-horizon-touch-refined')) return;

  const closeIcon = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m7 7 10 10M17 7 7 17"/></svg>';

  // Generate the complete inspector on every selection, including filtered and
  // note-saving updates. This avoids a different header after the first click.
  inspector = function () {
    const d = data()[selected];
    return `<aside class="inspector" id="inspector" aria-label="${t('Selected evidence','Preuve sélectionnée')}">
      <header class="inspector-head">
        <div class="inspector-context"><span class="inspector-symbol" aria-hidden="true">${icon('audits')}</span><div>
          <span class="eyebrow">${t('Selected evidence','Preuve sélectionnée')}</span>
          <span class="inspector-procedure"><b>${esc(d.id)}</b><span aria-hidden="true">/</span>${esc(d.theme)}</span>
        </div></div>
        <button class="quiet icon-button" data-action="close-detail" aria-label="${t('Close evidence and return to result','Fermer les preuves et revenir au résultat')}">${closeIcon}</button>
      </header>
      <section class="inspector-summary">${badge(d.outcome,d.kind)}<h2>${esc(d.title)}</h2><p>${esc(d.detail)}</p></section>
      <dl class="evidence-facts"><div><dt>${t('Procedure / scope','Procédure / périmètre')}</dt><dd>RGAA 4.1.2 · ${esc(d.id)}<span>maison.example/contact</span></dd></div><div><dt>${t('Method','Méthode')}</dt><dd>${esc(d.method)}</dd></div></dl>
      <section class="indigo-evidence"><h3><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m8 7-5 5 5 5m8-10 5 5-5 5m-3-13-2 16"/></svg>${t('Observed evidence','Preuve observée')}</h3><code>${esc(d.code)}</code><div class="lucent-code-meta"><span>${t('Demo excerpt','Extrait fictif')}</span><span>RGAA ${esc(d.id)}</span></div></section>
      <p class="evidence-source"><span>10 Sep 2026 · 10:42 Europe/Paris</span><span>${t('Illustrative data, not audit evidence','Données illustratives, pas des preuves d’audit')}</span></p>
      <div class="actionrow inspector-actions"><button data-modal="note">${icon('plus')}${t('Add review note','Ajouter une note de revue')}</button><button class="quiet" data-back>${t('Back to selected result','Retour au résultat sélectionné')}</button></div>
    </aside>`;
  };

  // Keep the command dialog fast while exposing its visually active result to
  // assistive technology. Focus stays on the combobox during arrow navigation.
  updateCommands = function () {
    const input = $('#command-search');
    const results = $('#command-results');
    const q = input.value.toLocaleLowerCase(lang);
    const entries = Object.entries(navNames()).map(([key,label]) => key === 'live'
      ? ['live-audit-2',t('Live audit 2','Audit en direct 2')] : [key,label])
      .filter(([key,label]) => (key + ' ' + label).toLocaleLowerCase(lang).includes(q));
    commandIndex = Math.min(commandIndex, Math.max(entries.length - 1, 0));
    input.setAttribute('role','combobox');
    input.setAttribute('aria-autocomplete','list');
    input.setAttribute('aria-expanded','true');
    input.setAttribute('aria-haspopup','listbox');
    results.setAttribute('role','listbox');
    results.setAttribute('aria-label',t('Available views','Vues disponibles'));
    results.innerHTML = entries.length ? entries.map(([key,label],index) => `<button type="button" role="option" tabindex="-1" id="command-option-${index}" data-command="${key}">${icon(key === 'live-audit-2' ? 'live' : key === 'projects' ? 'projects' : key === 'settings' || key === 'account' ? 'settings' : 'arrow')}<span>${label}</span><small>${active === key ? t('Current','Actuelle') : '↵'}</small></button>`).join('') : `<p class="result-empty">${t('No matching views','Aucune vue correspondante')}</p>`;
    markCommand();
  };

  markCommand = function () {
    const input = $('#command-search');
    const buttons = $$('#command-results button');
    buttons.forEach((button,index) => {
      const current = index === commandIndex;
      button.classList.toggle('command-current',current);
      button.setAttribute('aria-selected',String(current));
    });
    if (!input) return;
    const current = buttons[commandIndex];
    if (current) input.setAttribute('aria-activedescendant',current.id);
    else input.removeAttribute('aria-activedescendant');
  };

  function syncNavTooltips() {
    const showTooltips = !mobile.matches && saved.collapsed;
    document.querySelectorAll('[data-nav]').forEach(link => {
      if (showTooltips) link.title = link.getAttribute('aria-label');
      else link.removeAttribute('title');
    });
  }

  function enhance() {
    document.title = `a11ya — Horizon Poise / ${navNames()[active] || t('Live audit 2','Audit en direct 2')}`;
    // The inherited renderers address these nodes, so retain their hooks while
    // removing the study chrome from both layout and the accessibility tree.
    document.querySelector('.labbar').hidden = true;
    document.querySelector('.sidebar-caption').hidden = true;
    const brand = document.querySelector('.brand');
    const logo = brand.querySelector('img');
    logo.src = 'icon_v4.png';
    logo.width = logo.height = 1254;
    logo.alt = '';
    brand.title = 'a11ya';
    brand.querySelector('.nav-text').textContent = 'a11ya';
    document.querySelector('[data-nav="live"]')?.remove();
    document.querySelector('.project-nav .navlabel').textContent = t('Audits','Audits');
    document.querySelector('.project-nav .navgroup').setAttribute('aria-label',t('Audits','Audits'));
    syncNavTooltips();
    document.querySelectorAll('a[href="#live"]').forEach(a => { a.href = '#live-audit-2'; });
    document.querySelector('.page-footer a')?.remove();
    document.querySelector('.search-trigger kbd').textContent = /Mac|iPhone|iPad/.test(navigator.platform) ? '⌘ K' : 'Ctrl K';
    document.querySelector('.skip')?.setAttribute('aria-controls','main');

    if (active === 'dashboard') {
      document.querySelector('.attention .eyebrow').textContent = t('Maison / Contact · review','Maison / Contact · revue');
    }
    if (active === 'results') {
      document.querySelectorAll('.finding').forEach(row => {
        if (!row.querySelector('.finding-selection')) row.insertAdjacentHTML('beforeend','<span class="finding-selection" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="m6 12 4 4 8-8"/></svg></span>');
      });
    }
    requestAnimationFrame(moveNavIndicator);
  }

  const horizonRender = render;
  render = function (...args) {
    // Old entry points, including the existing new-audit confirmation, resolve
    // to the retained page rather than opening the removed design.
    if (location.hash.slice(1).split('?')[0] === 'live') {
      history.replaceState(null,'',location.pathname + location.search + '#live-audit-2');
    }
    horizonRender(...args);
    enhance();
    if (args[0] !== false) document.querySelector('.work').scrollTo(0,0);
  };

  const stackedEvidence = matchMedia('(min-width:761px) and (max-width:1000px)');
  document.addEventListener('click', event => {
    if (event.target.closest('[data-action="collapse"]')) requestAnimationFrame(syncNavTooltips);
    const skip = event.target.closest('.skip');
    if (skip) {
      event.preventDefault();
      event.stopImmediatePropagation();
      const destination = document.querySelector('#view-title') || document.querySelector('#main');
      destination?.focus({preventScroll:true});
      destination?.scrollIntoView({block:'start'});
      return;
    }
    if (stackedEvidence.matches && event.target.closest('[data-finding],#detail-toggle')) {
      const panel = document.querySelector('#inspector');
      if (panel && !panel.hidden) panel.focus({preventScroll:true});
    }
  }, true);
  document.addEventListener('keydown', event => {
    const dialog = event.target.closest?.('#modal.command-dialog[open]');
    if (!dialog) return;
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      const buttons = $$('#command-results button');
      if (!buttons.length) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      commandIndex = (commandIndex + (event.key === 'ArrowDown' ? 1 : -1) + buttons.length) % buttons.length;
      markCommand();
      $('#command-search').focus();
      return;
    }
    if (event.key !== 'Tab') return;
    const focusable = [...dialog.querySelectorAll('button:not([disabled]):not([tabindex="-1"]),input:not([disabled])')]
      .filter(element => element.getClientRects().length);
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && (document.activeElement === first || !dialog.contains(document.activeElement))) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && (document.activeElement === last || !dialog.contains(document.activeElement))) {
      event.preventDefault();
      first.focus();
    }
  }, true);
  document.addEventListener('focusin', event => {
    if (!event.target.matches('.inspector,.finding')) return;
    requestAnimationFrame(() => {
      if (!event.target.isConnected) return;
      const rect = event.target.getBoundingClientRect();
      const bar = document.querySelector('.topbar').getBoundingClientRect();
      if (rect.top < bar.bottom || rect.bottom > innerHeight) {
        event.target.scrollIntoView({block:event.target.matches('.inspector') ? 'start' : 'nearest',behavior:'instant'});
      }
    });
  });
  render(false);
})();
