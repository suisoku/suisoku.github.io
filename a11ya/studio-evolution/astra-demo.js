/* Independent Astra studies. All runs and review state are visit-only demonstrations. */
const icons = {
  arrow: '<path d="M4 12h15m-6-6 6 6-6 6"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  grid: '<rect x="4" y="4" width="6" height="6" rx="1"/><rect x="14" y="4" width="6" height="6" rx="1"/><rect x="4" y="14" width="6" height="6" rx="1"/><rect x="14" y="14" width="6" height="6" rx="1"/>',
  scan: '<path d="M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5M7 12h10"/>',
  layers: '<path d="m3 8 9-5 9 5-9 5-9-5Zm0 5 9 5 9-5M3 18l9 5 9-5"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  globe: '<circle cx="12" cy="12" r="9"/><ellipse cx="12" cy="12" rx="4" ry="9"/><path d="M3 12h18"/>',
  chevron: '<path d="m9 5 7 7-7 7"/>',
  close: '<path d="m6 6 12 12M18 6 6 18"/>',
  code: '<path d="m8 6-6 6 6 6m8-12 6 6-6 6M14 3l-4 18"/>',
  play: '<path d="m8 4 13 8-13 8Z"/>',
  search: '<circle cx="10" cy="10" r="6"/><path d="m15 15 5 5"/>',
  pause: '<path d="M8 5v14M16 5v14"/>'
};
document.querySelectorAll('[data-icon]').forEach(el => {
  el.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[el.dataset.icon] || icons.arrow}</svg>`;
});

// This is a rendered local specimen, not a capture of a remote website.
const chair = `<svg viewBox="0 0 300 290" fill="none" aria-hidden="true"><ellipse cx="152" cy="259" rx="102" ry="13" fill="#354536" opacity=".09"/><path d="m97 157-13 104m118-104 17 104M113 171l7 79m60-79-5 79" stroke="#624532" stroke-width="10"/><path d="M86 153q62-27 124 0l-3 23q-60 27-118-2Z" fill="#b78660"/><path d="M98 149 80 62q-3-10 9-14 65-23 113 4 8 4 6 15l-13 78" stroke="#78543b" stroke-width="10"/><path d="M94 64q47-21 101 0l-10 57q-41-18-79 1Z" fill="#c99d75"/><path d="M112 124v22m67-23v24" stroke="#745038" stroke-width="7"/><path d="M98 157q50-18 100 0" stroke="#dfbb96" stroke-width="3"/></svg>`;
document.querySelectorAll('[data-capture]').forEach(el => {
  el.innerHTML = `<div class="specimen"><div class="specimen-nav"><b>fieldwork<span>®</span></b><span>Objects &nbsp;&nbsp; Our story &nbsp;&nbsp; Contact</span><span>Bag (0)</span></div><div class="specimen-body"><div class="specimen-editorial"><span class="specimen-eyebrow">GOOD OBJECTS. GOOD COMPANY.</span><h3>A little help,<br>closer to home.</h3><div class="specimen-chair">${chair}</div><p>Thoughtfully made. Here to stay.</p></div><div class="specimen-form"><span class="specimen-eyebrow">LET’S TALK</span><h4>Make yourself<br>at home.</h4><p>Questions about an object, an order,<br>or something else? We’re here.</p><div class="specimen-label">Your name</div><div class="specimen-input">Alex Morgan</div><div class="specimen-target"><div class="specimen-input">Your email</div><button class="capture-pin" data-finding="email" aria-label="Inspect email field evidence">1</button></div><div class="specimen-label">Your message</div><div class="specimen-input specimen-message">I’d love to know more about…</div><div class="specimen-submit">Send a message <span>↗</span></div><small>Usually back to you in two working days.</small></div></div><div class="specimen-footer"><span>Made with care, in Copenhagen.</span><span>Instagram &nbsp; · &nbsp; Privacy</span></div></div>`;
});

const findingData = {
  email: { eyebrow: 'FORMS / RGAA 11.1', title: 'Give this field a label.', status: 'Missing label', summary: 'The sample email field relies on placeholder text. There is no visible, associated label to identify it when the placeholder disappears.', code: '<input id="email" type="email"\n       placeholder="Your email">', recommendation: 'Add a visible “Email address” label and connect it to the input with for="email".', selector: 'form → input#email', category: 'Forms', number: '01' },
  keyboard: { eyebrow: 'SCRIPTS / RGAA 7.3', title: 'Check the full keyboard path.', status: 'Human review', summary: 'This specimen cannot establish keyboard behavior for a real browser run. A reviewer needs to check the complete interaction.', code: 'Evidence needed\nTab → form fields → submit\nShift + Tab → return path', recommendation: 'In a real run, inspect focus order, visibility and operation with the keyboard. Record what you observe.', selector: 'form → keyboard sequence', category: 'Keyboard', number: '02' },
  image: { eyebrow: 'IMAGES / RGAA 1.1', title: 'Decide what this image conveys.', status: 'Human review', summary: 'The chair illustration may be decorative in this contact page. Its purpose needs a human decision before choosing a text alternative.', code: '<svg aria-hidden="true">\n  <!-- chair illustration -->\n</svg>', recommendation: 'Confirm whether the illustration carries information that is not already available in nearby text.', selector: '.specimen-chair → svg', category: 'Images', number: '03' }
};
let currentFinding = 'email';
let runTarget = 'https://fieldwork.example/contact';
let runStep = 0;
let reviewed = new Set();
function selectFinding(key) {
  currentFinding = key in findingData ? key : 'email';
  const data = findingData[currentFinding];
  document.querySelectorAll('[data-detail]').forEach(el => { el.textContent = data[el.dataset.detail] || ''; });
  document.querySelectorAll('[data-finding]').forEach(el => {
    el.classList.toggle('is-selected', el.dataset.finding === currentFinding);
    if (el.matches('button') && !el.classList.contains('capture-pin')) el.setAttribute('aria-pressed', String(el.dataset.finding === currentFinding));
  });
  document.querySelectorAll('[data-capture]').forEach(el => { el.dataset.selected = currentFinding; });
  document.querySelectorAll('[data-review]').forEach(el => { el.textContent = reviewed.has(currentFinding) ? 'Reviewed in this demo ✓' : 'Mark reviewed'; });
}
function showView(view) {
  if (!['workspace', 'review', 'run'].includes(view)) view = 'workspace';
  document.querySelectorAll('[data-view]').forEach(el => { el.hidden = el.dataset.view !== view; });
  document.querySelectorAll('[data-nav]').forEach(el => {
    el.classList.toggle('active', el.dataset.nav === view);
    if (el.dataset.nav === view) el.setAttribute('aria-current', 'page'); else el.removeAttribute('aria-current');
  });
  document.body.dataset.activeView = view;
  document.title = `a11ya — ${document.body.dataset.concept} · ${view === 'workspace' ? 'Workspace' : view === 'review' ? 'Evidence review' : 'Browser run'}`;
}
window.addEventListener('hashchange', () => showView(location.hash.slice(1)));
document.addEventListener('click', event => {
  const finding = event.target.closest('[data-finding]');
  if (finding) { selectFinding(finding.dataset.finding); location.hash = 'review'; }
  if (event.target.closest('[data-launch]')) document.querySelector('#launch-dialog').showModal();
  if (event.target.closest('[data-close]')) document.querySelector('#launch-dialog').close();
  if (event.target.closest('[data-review]')) {
    if (reviewed.has(currentFinding)) reviewed.delete(currentFinding); else reviewed.add(currentFinding);
    selectFinding(currentFinding);
    document.querySelectorAll('[data-review-count]').forEach(el => { el.textContent = `${reviewed.size} of 3 reviewed in this demo`; });
  }
  if (event.target.closest('[data-step]')) {
    runStep = Math.min(runStep + 1, 3); renderRun();
  }
  if (event.target.closest('[data-run-reset]')) { runStep = 0; renderRun(); }
});
document.querySelector('#launch-form').addEventListener('submit', event => {
  event.preventDefault();
  const input = event.currentTarget.elements.target;
  let url;
  try { url = new URL(input.value); } catch { input.setCustomValidity('Enter a full URL, including https://.'); input.reportValidity(); return; }
  if (!['http:', 'https:'].includes(url.protocol)) { input.setCustomValidity('Use an HTTP or HTTPS page URL.'); input.reportValidity(); return; }
  runTarget = url.href; runStep = 0; renderRun();
  document.querySelector('#launch-dialog').close(); location.hash = 'run';
});
document.querySelector('#launch-form input').addEventListener('input', event => event.target.setCustomValidity(''));
function renderRun() {
  const steps = ['Ready to open the page', 'Page loaded · specimen displayed', 'Inspecting the sample form', 'Sample ready for review'];
  document.querySelectorAll('[data-run-target]').forEach(el => { el.textContent = runTarget; });
  document.querySelectorAll('[data-run-status]').forEach(el => { el.textContent = steps[runStep]; });
  document.querySelectorAll('[data-step]').forEach(el => { el.textContent = runStep === 3 ? 'Demo complete' : 'Advance demo →'; el.disabled = runStep === 3; });
  document.querySelectorAll('[data-run-stage]').forEach(el => {
    el.classList.toggle('stage-done', Number(el.dataset.runStage) < runStep);
    el.classList.toggle('stage-current', Number(el.dataset.runStage) === runStep);
  });
  document.querySelectorAll('[data-run-progress]').forEach(el => { el.style.width = `${(runStep + 1) * 25}%`; });
}
document.querySelectorAll('[data-search]').forEach(input => input.addEventListener('input', () => {
  const q = input.value.toLowerCase().trim(); let visible = 0;
  document.querySelectorAll('[data-searchable]').forEach(row => { row.hidden = !row.textContent.toLowerCase().includes(q); if (!row.hidden) visible++; });
  document.querySelectorAll('[data-empty]').forEach(el => { el.hidden = visible > 0; });
}));
selectFinding('email'); renderRun(); showView(location.hash.slice(1));
