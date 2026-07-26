# Flowcordia UI

A Vercel-ready, frontend-only recreation of the current Flowcordia application shell and Workflow Studio.

## Included

- Vite + React production build configured for Vercel
- Direct SPA routes such as `/studio`, `/runs`, `/logs`, and `/deploys`
- Full project and environment sidebar
- Dedicated demo screens for Tasks, Runs, Sessions, Proposals, Prompts, Models, Logs, Errors, Query, Queues, Dashboards, Deploys, Environment variables, Preview branches, Regions, Waitpoint tokens, Alerts, API keys, Integrations, and Project settings
- Open workflow library with dedicated workflow editor routes
- Five-stage Repository → Build → Review → Preview → Production lifecycle UI
- `@xyflow/react` workflow canvas with custom nodes and edges, selection, reconnecting, insertion, node toolbars, node details, minimap, viewport controls, and a searchable node creator
- Monaco workbench with Explorer, search, source control, run/debug, extensions, tabs, breadcrumbs, outline, diff view, Problems/Output/Terminal panels, command palette, and status bar
- Shared visual/source workflow fixture state
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

## Design provenance

The workflow canvas is an independent React implementation built on `@xyflow/react`. It studies established workflow-editor interaction patterns, including n8n's canvas proportions and hierarchy, without copying or translating n8n's Vue source. The source workspace uses the MIT-licensed Monaco Editor and is presented through a custom VS Code-inspired web workbench shell.

## Boundary

This repository is a UI prototype only. Demo records are local fixture data. It does not include authentication, databases, GitHub mutations, Trigger.dev execution, credentials, provider calls, a real visual-to-code compiler, or real production actions.
