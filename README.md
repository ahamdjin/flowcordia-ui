# Flowcordia UI

A Vercel-ready, frontend-only recreation of the current Flowcordia application shell and Workflow Studio.

## Included

- Vite + React production build configured for Vercel
- Direct SPA routes such as `/studio`, `/runs`, `/logs`, and `/deploys`
- Full project and environment sidebar
- Dedicated demo screens for Tasks, Runs, Sessions, Proposals, Prompts, Models, Logs, Errors, Query, Queues, Dashboards, Deploys, Environment variables, Preview branches, Regions, Waitpoint tokens, Alerts, API keys, Integrations, and Project settings
- Full Workflow Studio shell with lifecycle rail, repository workflow list, node catalog, canvas, edges, draggable nodes, zoom, fit, minimap, inspector tabs, preview evidence, approvals, and operations workspace
- Responsive layouts for large desktop, laptop, tablet, and mobile widths
- Local demo records across every route

## Run locally

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
npm run preview
```

## Vercel

Import the GitHub repository into Vercel. The included `vercel.json` selects the Vite build, serves `dist`, and sends direct application routes back to `index.html` while preserving built assets.

## Boundary

This repository is a UI prototype only. Demo records are local fixture data. It does not include authentication, databases, GitHub mutations, Trigger.dev execution, credentials, provider calls, or real production actions.
