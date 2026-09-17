# a11ya design archive

Static design snapshot published at https://suisoku.github.io/a11ya/.

`index.html` lists 40 designs and presets and eight comparison galleries. The two
collections contain only the HTML, CSS, browser JavaScript and images needed to
view the designs. No build, package installation or application service is required.
GitHub Pages publishes this repository's `main` branch from its root.

Horizon live-browser experiments 4–9, sandbox viewers, server scripts, private
configuration and internal research documents are excluded. Forms and results are
fictional demonstrations. Some display preferences use browser local storage.

Live audit 10 (`studio-evolution/horizon.html?lang=en#live-audit-10`) retains the
committed Design layout, with a fictional Atlas browser specimen replacing the
runtime iframe. State previews, journal details, sizing and enlarge/restore are
local interactions; browser control is disabled. There are no runtime connections.

The public pages have no injected gallery/about banner. Reduced-motion support
and a content security policy block network connections, frames and form
submissions. Links to internal research documents point to the public demo guide.
Keep these adaptations when refreshing the archive; do not copy the entire source
repository or the runtime-dependent viewers. The homepage and main gallery remain
the entry points.

Live audit 11 (`studio-evolution/horizon-live-11.html`, also `?lang=fr`) is a
separate minimal variant derived from the original `horizon-live-audits.js`:
the original application shell, navigation, header and bars remain intact. Only
the workspace is reduced to the run identity bar, activity journal and fictional
Atlas browser. The run bar contains the original control actions: connection-loss
preview, takeover confirmation, simulated input, close session and reset. They
operate entirely locally; no browser service or real input is connected. Event
details expand inside the journal; Fit/100%, follow, incoming-event preview and
earlier-activity controls remain available. It does not load or modify Live audit
10 or any other prototype. No separate state, control or event-detail panel is shown.

Before publishing an update, check local HTML/CSS/JavaScript asset references,
render the linked designs, scan for credentials and private endpoints, and verify
the Pages deployment and public URLs after pushing.
