# Flowcordia UI Shell

A lightweight, zero-build recreation of the current Flowcordia application shell and Workflow Studio interface.

## What is included

- The compact dark Flowcordia/Trigger.dev-style application frame
- Collapsible project and environment sidebar
- Studio header and repository workflow controls
- Repository → Build → Review → Preview → Production lifecycle rail
- Resizable workflow list, canvas, and inspector panes
- Responsive workflow operations workspace
- Workflow filtering and selection
- Canvas pan, wheel navigation, zoom, reset, fit, and minimap controls
- Selectable and draggable workflow nodes
- Node inspector updates and display-name editing
- Lightweight node-catalog interactions
- Representative shell pages for Tasks, Runs, Logs, Deployments, and settings
- Responsive layouts for desktop, lower-resolution, tablet, and narrow screens

## Deliberate boundary

This repository contains the UI shell only. It has no authentication, Remix loaders, database, GitHub App, Trigger.dev execution, workflow compiler, credential storage, proposal mutations, provider calls, or production operations.

All displayed repository state, runs, approvals, metrics, and deployment information are representative local sample data.

## Run locally

No install or build is required.

```bash
python -m http.server 4173
```

Then open `http://localhost:4173`.

You can also open `index.html` directly, although a local server is preferable.

## Files

- `index.html` — complete semantic application and Studio shell
- `styles.css` — design tokens, responsive layout, canvas, navigation, and component styling
- `app.js` — icons and local UI interactions

## Customization

The main dimensions and colors are CSS variables at the top of `styles.css`:

```css
--sidebar-width: 224px;
--workflow-width: 290px;
--inspector-width: 310px;
--operations-width: 390px;
```

The shell intentionally uses plain HTML, CSS, and JavaScript so visual changes remain small, direct, and easy to compare with the main Flowcordia application.
