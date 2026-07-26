const ICONS = {
  activity: '<path d="M3 12h4l3-8 4 16 3-8h4"/>',
  blocks: '<rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/><path d="M17.5 14v7M14 17.5h7"/>',
  bug: '<path d="m8 2 1.88 1.88M14.12 3.88 16 2M9 7.13V6a3 3 0 0 1 6 0v1.13M12 20c-3.87 0-7-2.69-7-6v-3h14v3c0 3.31-3.13 6-7 6ZM5 10 2 8M19 10l3-2M5 15H2M22 15h-3"/>',
  'chart-no-axes-combined': '<path d="M12 16v5M16 14v7M20 10v11M4 18v3M8 14v7"/><path d="m3 11 3-3 4 4 5-5 3 3 3-3"/>',
  'chevron-down': '<path d="m6 9 6 6 6-6"/>',
  'chevron-right': '<path d="m9 18 6-6-6-6"/>',
  'chevrons-up-down': '<path d="m7 15 5 5 5-5M7 9l5-5 5 5"/>',
  'circle-check-big': '<path d="M21.8 10A10 10 0 1 1 17 3.3"/><path d="m9 11 3 3L22 4"/>',
  'circle-dot': '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="1"/>',
  'circle-help': '<circle cx="12" cy="12" r="10"/><path d="M9.1 9a3 3 0 1 1 5.8 1c0 2-3 2-3 4M12 18h.01"/>',
  'clock-3': '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16.5 12"/>',
  'code-2': '<path d="m18 16 4-4-4-4M6 8l-4 4 4 4M14.5 4l-5 16"/>',
  ellipsis: '<circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/>',
  'flask-conical': '<path d="M10 2v7.31M14 9.3V2M8.5 2h7M14 9.3l5.74 9.64A2 2 0 0 1 18 22H6a2 2 0 0 1-1.74-3.06L10 9.3"/><path d="M6.5 17h11"/>',
  'git-branch': '<line x1="6" x2="6" y1="3" y2="15"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M18 9a9 9 0 0 1-9 9"/>',
  'git-fork': '<circle cx="12" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><circle cx="18" cy="6" r="3"/><path d="M18 9a6 6 0 0 1-6 6M6 9a6 6 0 0 0 6 6"/>',
  'git-pull-request': '<circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><path d="M13 6h3a2 2 0 0 1 2 2v7M6 9v12"/><line x1="13" x2="16" y1="3" y2="6"/><line x1="16" x2="13" y1="6" y2="9"/>',
  'globe-2': '<circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 0 20M12 2a15.3 15.3 0 0 0 0 20"/>',
  'key-round': '<path d="M2.6 11.4a6.5 6.5 0 1 0 11.8 4.2L22 8V4h-4l-1.5 1.5H14L12.5 7l1 1-1.5 1.5-1-1-.6.6a6.5 6.5 0 0 0-7.8 2.3Z"/><circle cx="7" cy="15" r="1"/>',
  'list-tree': '<path d="M21 12h-8M21 6H8M21 18h-8M3 6h.01M3 12h.01M3 18h.01M8 12H5v6h3"/>',
  'messages-square': '<path d="M14 4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v16l-4-4h-2a2 2 0 0 1-2-2Z"/><path d="M12 4H4a2 2 0 0 0-2 2v14l4-4h6"/>',
  'panel-left-close': '<rect width="18" height="18" x="3" y="3" rx="2"/><path d="M9 3v18m7-6-3-3 3-3"/>',
  'panel-left-open': '<rect width="18" height="18" x="3" y="3" rx="2"/><path d="M9 3v18m5-12 3 3-3 3"/>',
  plus: '<path d="M5 12h14M12 5v14"/>',
  'refresh-cw': '<path d="M20 11a8.1 8.1 0 0 0-15.5-2M4 4v5h5M4 13a8.1 8.1 0 0 0 15.5 2M20 20v-5h-5"/>',
  rocket: '<path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09Z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.7 12.7 0 0 1 22 2c0 2.72-.78 7.5-6.05 11a22.4 22.4 0 0 1-3.95 2Z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>',
  search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
  'scroll-text': '<path d="M15 12h-5M15 8h-5M19 17V5a2 2 0 0 0-2-2H4"/><path d="M8 21h12a2 2 0 0 0 2-2v-1H10v1a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v2h4"/>',
  'settings-2': '<path d="M20 7h-9M14 17H5"/><circle cx="17" cy="17" r="3"/><circle cx="7" cy="7" r="3"/>',
  'shield-check': '<path d="M20 13c0 5-3.5 7.5-8 9-4.5-1.5-8-4-8-9V5l8-3 8 3Z"/><path d="m9 12 2 2 4-4"/>',
  sparkles: '<path d="m12 3-1.9 5.1L5 10l5.1 1.9L12 17l1.9-5.1L19 10l-5.1-1.9ZM5 3v4M3 5h4M19 17v4M17 19h4"/>',
};

function iconSvg(name) {
  const paths = ICONS[name] || '<circle cx="12" cy="12" r="9"/>';
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;
}

function hydrateIcons(root = document) {
  root.querySelectorAll('[data-icon]').forEach((element) => {
    element.innerHTML = iconSvg(element.dataset.icon);
  });
}

hydrateIcons();

const appShell = document.getElementById('appShell');
const sidebarToggle = document.getElementById('sidebarToggle');
const studioPage = document.getElementById('studioPage');
const genericPage = document.getElementById('genericPage');
const pageTitle = document.getElementById('pageTitle');
const genericTitle = document.getElementById('genericTitle');
const genericDescription = document.getElementById('genericDescription');
const toastRegion = document.getElementById('toastRegion');

const GENERIC_PAGES = {
  tasks: ['Tasks', 'Registered tasks and their current deployment state.'],
  runs: ['Runs', 'Execution history, status, timing, and operational evidence.'],
  sessions: ['Sessions', 'Long-running AI and workflow sessions in one place.'],
  proposals: ['Proposals', 'Governed GitHub proposals awaiting review or promotion.'],
  logs: ['Logs', 'Searchable execution and control-plane logs.'],
  errors: ['Errors', 'Grouped failures with bounded operational context.'],
  queues: ['Queues', 'Queue utilization, concurrency, and saturation signals.'],
  dashboards: ['Dashboards', 'Project-level health and performance views.'],
  deploys: ['Deploys', 'Immutable deployment history by environment.'],
  variables: ['Environment variables', 'Write-only configuration and credential references.'],
  branches: ['Preview branches', 'Ephemeral branch environments and exact revisions.'],
  regions: ['Regions', 'Deployment regions and capacity boundaries.'],
  settings: ['Project settings', 'Project identity, integrations, members, and policies.'],
};

function showToast(message, tone = 'success') {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `${iconSvg(tone === 'success' ? 'circle-check-big' : 'circle-help')}<span>${message}</span>`;
  toastRegion.appendChild(toast);
  window.setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(8px)';
    window.setTimeout(() => toast.remove(), 180);
  }, 2600);
}

function setButtonLoading(button, loading) {
  if (!button) return;
  button.classList.toggle('spin', loading);
  const icon = button.querySelector('[data-icon]');
  if (icon) icon.innerHTML = iconSvg('refresh-cw');
  button.disabled = loading;
}

sidebarToggle.addEventListener('click', () => {
  appShell.classList.toggle('sidebar-collapsed');
  const collapsed = appShell.classList.contains('sidebar-collapsed');
  sidebarToggle.setAttribute('aria-label', collapsed ? 'Expand sidebar' : 'Collapse sidebar');
  sidebarToggle.title = collapsed ? 'Expand sidebar' : 'Collapse sidebar';
  sidebarToggle.innerHTML = iconSvg(collapsed ? 'panel-left-open' : 'panel-left-close');
});

for (const section of document.querySelectorAll('.nav-section')) {
  const heading = section.querySelector('.section-heading');
  heading.addEventListener('click', () => {
    section.classList.toggle('is-open');
    const icon = heading.querySelector('[data-icon]');
    icon.dataset.icon = section.classList.contains('is-open') ? 'chevron-down' : 'chevron-right';
    icon.innerHTML = iconSvg(icon.dataset.icon);
  });
}

function openPage(page) {
  const isStudio = page === 'studio';
  studioPage.hidden = !isStudio;
  genericPage.hidden = isStudio;
  document.querySelectorAll('.nav-item[data-page]').forEach((item) => {
    item.classList.toggle('active', item.dataset.page === page);
  });

  if (isStudio) {
    pageTitle.textContent = 'Flowcordia Studio';
    return;
  }

  const [title, description] = GENERIC_PAGES[page] || ['Flowcordia', 'A lightweight product shell view.'];
  pageTitle.textContent = title;
  genericTitle.textContent = title;
  genericDescription.textContent = description;
}

function navigateFromHash() {
  const page = window.location.hash.slice(1) || 'studio';
  openPage(page);
}

window.addEventListener('hashchange', navigateFromHash);
navigateFromHash();

document.querySelector('[data-action="source"]').addEventListener('click', () => {
  window.location.hash = 'variables';
});
document.querySelector('[data-action="proposals"]').addEventListener('click', () => {
  window.location.hash = 'proposals';
});

const refreshButton = document.getElementById('refreshButton');
refreshButton.addEventListener('click', () => {
  setButtonLoading(refreshButton, true);
  window.setTimeout(() => {
    setButtonLoading(refreshButton, false);
    showToast('Flowcordia shell refreshed.');
  }, 650);
});

const syncButton = document.getElementById('syncButton');
syncButton.addEventListener('click', () => {
  setButtonLoading(syncButton, true);
  window.setTimeout(() => {
    setButtonLoading(syncButton, false);
    showToast('Repository synchronization completed.');
  }, 850);
});

document.getElementById('publishButton').addEventListener('click', () => {
  showToast('Proposal shell created for Git review.');
});
document.getElementById('discardButton').addEventListener('click', () => {
  showToast('Draft reset in the UI shell.', 'neutral');
});

const workflowSearch = document.getElementById('workflowSearch');
workflowSearch.addEventListener('input', () => {
  const query = workflowSearch.value.trim().toLowerCase();
  document.querySelectorAll('.workflow-row').forEach((row) => {
    row.hidden = !row.textContent.toLowerCase().includes(query);
  });
});

const workflowTitle = document.getElementById('workflowTitle');
const workflowNameInput = document.getElementById('workflowNameInput');
const nodeCount = document.getElementById('nodeCount');

document.querySelectorAll('.workflow-row').forEach((row) => {
  row.addEventListener('click', () => {
    document.querySelectorAll('.workflow-row').forEach((item) => item.classList.remove('selected'));
    row.classList.add('selected');
    workflowTitle.textContent = row.dataset.workflow;
    workflowNameInput.value = row.dataset.workflow;
    const countText = row.querySelector('small span:first-child')?.textContent || '0 nodes';
    nodeCount.textContent = countText;
    showToast(`${row.dataset.workflow} selected.`, 'neutral');
  });
});

const operationsTitle = document.getElementById('operationsTitle');
const operationsBadge = document.getElementById('operationsBadge');

document.querySelectorAll('.lifecycle-step').forEach((step) => {
  step.addEventListener('click', () => {
    document.querySelectorAll('.lifecycle-step').forEach((item) => item.classList.remove('selected'));
    step.classList.add('selected');
    const id = step.dataset.step;
    document.querySelectorAll('.operations-content').forEach((content) => {
      content.classList.toggle('active', content.dataset.operation === id);
    });
    operationsTitle.textContent = step.querySelector('strong').textContent;
    operationsBadge.textContent = step.querySelector('small').textContent;
  });
});

const NODE_DETAILS = {
  trigger: {
    kind: 'trigger',
    name: 'Manual trigger',
    operation: 'trigger.manual',
    settings: 'None',
    credentials: 'None',
    connections: 'trigger → validate',
  },
  validate: {
    kind: 'action',
    name: 'Validate payload',
    operation: 'data.map',
    settings: 'expression, outputSchema',
    credentials: 'None',
    connections: 'trigger → validate · validate → condition',
  },
  condition: {
    kind: 'control',
    name: 'Is enterprise?',
    operation: 'control.condition',
    settings: 'expression',
    credentials: 'None',
    connections: 'validate → condition · true → enrich · false → approval',
  },
  enrich: {
    kind: 'action',
    name: 'Enrich account',
    operation: 'action.http',
    settings: 'method, url, headers, body, timeout',
    credentials: 'crm_api',
    connections: 'condition → enrich · enrich → output',
  },
  approval: {
    kind: 'approval',
    name: 'Manager approval',
    operation: 'approval.human',
    settings: 'prompt, timeout, reminder, escalation',
    credentials: 'None',
    connections: 'condition → approval · approval → output',
  },
  output: {
    kind: 'output',
    name: 'Return result',
    operation: 'output.return',
    settings: 'value',
    credentials: 'None',
    connections: 'enrich → output · approval → output',
  },
};

let selectedNode = document.querySelector('.workflow-node.selected');
const inspectorKind = document.getElementById('inspectorKind');
const inspectorName = document.getElementById('inspectorName');
const inspectorId = document.getElementById('inspectorId');
const inspectorOperation = document.getElementById('inspectorOperation');
const inspectorPosition = document.getElementById('inspectorPosition');
const inspectorSettings = document.getElementById('inspectorSettings');
const inspectorCredentials = document.getElementById('inspectorCredentials');
const inspectorConnections = document.getElementById('inspectorConnections');
const nodeNameInput = document.getElementById('nodeNameInput');

function nodePosition(node) {
  return {
    x: Number.parseFloat(node.style.left) || 0,
    y: Number.parseFloat(node.style.top) || 0,
  };
}

function detailsForNode(node) {
  const id = node.dataset.node;
  const card = node.querySelector('.node-card');
  const known = NODE_DETAILS[id];
  return known || {
    kind: node.classList.contains('control') ? 'control' : node.classList.contains('approval') ? 'approval' : node.classList.contains('subflow') ? 'subflow' : 'action',
    name: card.querySelector(':scope > strong')?.textContent || id,
    operation: card.querySelector(':scope > code')?.textContent || 'action.http',
    settings: 'configuration',
    credentials: 'None',
    connections: 'None',
  };
}

function updateInspector(node) {
  if (!node) return;
  const details = detailsForNode(node);
  const position = nodePosition(node);
  inspectorKind.textContent = details.kind;
  inspectorName.textContent = details.name;
  inspectorId.textContent = node.dataset.node;
  inspectorOperation.textContent = details.operation;
  inspectorPosition.textContent = `${Math.round(position.x)}, ${Math.round(position.y)}`;
  inspectorSettings.textContent = details.settings;
  inspectorCredentials.textContent = details.credentials;
  inspectorConnections.innerHTML = `<span class="connection-pill"><code>${details.connections}</code><button type="button">Inspect</button></span>`;
  nodeNameInput.value = details.name;
}

function selectNode(node) {
  if (!node) return;
  document.querySelectorAll('.workflow-node').forEach((item) => item.classList.remove('selected'));
  node.classList.add('selected');
  selectedNode = node;
  updateInspector(node);
}

const canvasViewport = document.getElementById('canvasViewport');
const canvasSurface = document.getElementById('canvasSurface');
const zoomReset = document.getElementById('zoomReset');
const zoomIn = document.getElementById('zoomIn');
const zoomOut = document.getElementById('zoomOut');
const fitButton = document.getElementById('fitButton');
const minimap = document.getElementById('minimap');

const viewportState = { scale: 1, x: 0, y: 0 };
const SCALE_MIN = 0.35;
const SCALE_MAX = 1.7;

function applyViewport() {
  canvasSurface.style.transform = `translate3d(${viewportState.x}px, ${viewportState.y}px, 0) scale(${viewportState.scale})`;
  zoomReset.textContent = `${Math.round(viewportState.scale * 100)}%`;
  zoomIn.disabled = viewportState.scale >= SCALE_MAX;
  zoomOut.disabled = viewportState.scale <= SCALE_MIN;
}

function clampScale(value) {
  return Math.max(SCALE_MIN, Math.min(SCALE_MAX, value));
}

function zoomTo(nextScale, origin) {
  const oldScale = viewportState.scale;
  const scale = clampScale(nextScale);
  if (scale === oldScale) return;
  const point = origin || { x: canvasViewport.clientWidth / 2, y: canvasViewport.clientHeight / 2 };
  const worldX = (point.x - viewportState.x) / oldScale;
  const worldY = (point.y - viewportState.y) / oldScale;
  viewportState.scale = scale;
  viewportState.x = point.x - worldX * scale;
  viewportState.y = point.y - worldY * scale;
  applyViewport();
}

function resetViewport() {
  viewportState.scale = 1;
  viewportState.x = 0;
  viewportState.y = 0;
  applyViewport();
}

function fitWorkflow() {
  const nodes = [...document.querySelectorAll('.workflow-node')];
  if (!nodes.length) return;
  const bounds = nodes.reduce(
    (result, node) => {
      const pos = nodePosition(node);
      result.minX = Math.min(result.minX, pos.x);
      result.minY = Math.min(result.minY, pos.y);
      result.maxX = Math.max(result.maxX, pos.x + node.offsetWidth);
      result.maxY = Math.max(result.maxY, pos.y + node.offsetHeight);
      return result;
    },
    { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity }
  );
  const padding = 70;
  const width = Math.max(1, bounds.maxX - bounds.minX);
  const height = Math.max(1, bounds.maxY - bounds.minY);
  const scale = clampScale(Math.min((canvasViewport.clientWidth - padding * 2) / width, (canvasViewport.clientHeight - padding * 2) / height));
  viewportState.scale = scale;
  viewportState.x = (canvasViewport.clientWidth - width * scale) / 2 - bounds.minX * scale;
  viewportState.y = (canvasViewport.clientHeight - height * scale) / 2 - bounds.minY * scale;
  applyViewport();
}

zoomIn.addEventListener('click', () => zoomTo(viewportState.scale + 0.1));
zoomOut.addEventListener('click', () => zoomTo(viewportState.scale - 0.1));
zoomReset.addEventListener('click', resetViewport);
fitButton.addEventListener('click', fitWorkflow);
minimap.addEventListener('click', fitWorkflow);

canvasViewport.addEventListener('wheel', (event) => {
  event.preventDefault();
  if (event.ctrlKey || event.metaKey) {
    const bounds = canvasViewport.getBoundingClientRect();
    zoomTo(viewportState.scale + (event.deltaY < 0 ? 0.1 : -0.1), {
      x: event.clientX - bounds.left,
      y: event.clientY - bounds.top,
    });
  } else {
    viewportState.x -= event.deltaX;
    viewportState.y -= event.deltaY;
    applyViewport();
  }
}, { passive: false });

let panState = null;
canvasViewport.addEventListener('pointerdown', (event) => {
  if (event.target.closest('.workflow-node, button, input, textarea, select')) return;
  panState = { pointerId: event.pointerId, x: event.clientX, y: event.clientY, startX: viewportState.x, startY: viewportState.y };
  canvasViewport.setPointerCapture(event.pointerId);
  canvasViewport.classList.add('is-panning');
});
canvasViewport.addEventListener('pointermove', (event) => {
  if (!panState || panState.pointerId !== event.pointerId) return;
  viewportState.x = panState.startX + event.clientX - panState.x;
  viewportState.y = panState.startY + event.clientY - panState.y;
  applyViewport();
});
function endPan(event) {
  if (!panState || panState.pointerId !== event.pointerId) return;
  panState = null;
  canvasViewport.classList.remove('is-panning');
}
canvasViewport.addEventListener('pointerup', endPan);
canvasViewport.addEventListener('pointercancel', endPan);

canvasViewport.addEventListener('keydown', (event) => {
  if (event.key === '+' || event.key === '=') {
    event.preventDefault();
    zoomTo(viewportState.scale + 0.1);
  } else if (event.key === '-') {
    event.preventDefault();
    zoomTo(viewportState.scale - 0.1);
  } else if (event.key === '0') {
    event.preventDefault();
    resetViewport();
  } else if (event.key.toLowerCase() === 'f') {
    event.preventDefault();
    fitWorkflow();
  }
});

function wireNode(node) {
  const card = node.querySelector('.node-card');
  card.addEventListener('click', () => selectNode(node));

  let drag = null;
  card.addEventListener('pointerdown', (event) => {
    if (event.button !== 0) return;
    selectNode(node);
    const position = nodePosition(node);
    drag = {
      pointerId: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      startX: position.x,
      startY: position.y,
    };
    card.setPointerCapture(event.pointerId);
  });
  card.addEventListener('pointermove', (event) => {
    if (!drag || drag.pointerId !== event.pointerId) return;
    const x = drag.startX + (event.clientX - drag.x) / viewportState.scale;
    const y = drag.startY + (event.clientY - drag.y) / viewportState.scale;
    node.style.left = `${Math.round(x / 20) * 20}px`;
    node.style.top = `${Math.round(y / 20) * 20}px`;
    updateInspector(node);
  });
  const endDrag = (event) => {
    if (!drag || drag.pointerId !== event.pointerId) return;
    drag = null;
    updateInspector(node);
  };
  card.addEventListener('pointerup', endDrag);
  card.addEventListener('pointercancel', endDrag);
}

document.querySelectorAll('.workflow-node').forEach(wireNode);
updateInspector(selectedNode);

document.getElementById('renameNodeButton').addEventListener('click', () => {
  if (!selectedNode) return;
  const value = nodeNameInput.value.trim();
  if (!value) return;
  const cardTitle = selectedNode.querySelector('.node-card > strong');
  cardTitle.textContent = value;
  const id = selectedNode.dataset.node;
  if (NODE_DETAILS[id]) NODE_DETAILS[id].name = value;
  updateInspector(selectedNode);
  showToast('Node display name updated.');
});

const nodeTemplate = document.getElementById('nodeTemplate');
const addNodeButton = document.getElementById('addNodeButton');
let addedNodeIndex = 0;

const TEMPLATE_META = {
  'HTTP request': ['action', 'action.http'],
  'Map data': ['action', 'data.map'],
  Condition: ['control', 'control.condition'],
  'Human approval': ['approval', 'approval.human'],
  Subflow: ['subflow', 'subflow.invoke'],
};

addNodeButton.addEventListener('click', () => {
  addedNodeIndex += 1;
  const label = nodeTemplate.value;
  const [kind, operation] = TEMPLATE_META[label] || ['action', 'action.http'];
  const id = `node_${Date.now().toString(36)}`;
  const node = document.createElement('article');
  node.className = `workflow-node ${kind}`;
  node.dataset.node = id;
  node.style.left = `${360 + (addedNodeIndex % 4) * 260}px`;
  node.style.top = `${700 + Math.floor(addedNodeIndex / 4) * 160}px`;
  node.innerHTML = `
    <button class="node-target" tabindex="-1"></button>
    <button class="node-card" type="button">
      <span class="node-meta"><span class="node-kind">${kind}</span><code>${id}</code></span>
      <strong>${label}</strong>
      <code>${operation}</code>
      <small><span>1 setting</span><span>0 credentials</span></small>
    </button>
    ${kind === 'output' ? '' : '<button class="node-handle" aria-label="Connect from node">→</button>'}
  `;
  canvasSurface.appendChild(node);
  NODE_DETAILS[id] = { kind, name: label, operation, settings: 'configuration', credentials: 'None', connections: 'None' };
  wireNode(node);
  selectNode(node);
  const total = document.querySelectorAll('.workflow-node').length;
  nodeCount.textContent = `${total} nodes`;
  showToast(`${label} added to the shell.`);
});

const nodeSearch = document.getElementById('nodeSearch');
nodeSearch.addEventListener('input', () => {
  const query = nodeSearch.value.trim().toLowerCase();
  const options = [...nodeTemplate.options];
  const match = options.find((option) => option.textContent.toLowerCase().includes(query));
  if (match) nodeTemplate.value = match.value;
});

function wireResize(handle) {
  handle.addEventListener('pointerdown', (event) => {
    event.preventDefault();
    handle.setPointerCapture(event.pointerId);
    handle.classList.add('is-dragging');
    const type = handle.dataset.resize;
    const startX = event.clientX;
    const styles = getComputedStyle(document.documentElement);
    const startWorkflow = Number.parseFloat(styles.getPropertyValue('--workflow-width')) || 290;
    const startInspector = Number.parseFloat(styles.getPropertyValue('--inspector-width')) || 310;

    const move = (moveEvent) => {
      const delta = moveEvent.clientX - startX;
      if (type === 'workflow') {
        const width = Math.max(220, Math.min(430, startWorkflow + delta));
        document.documentElement.style.setProperty('--workflow-width', `${width}px`);
      } else {
        const width = Math.max(250, Math.min(480, startInspector - delta));
        document.documentElement.style.setProperty('--inspector-width', `${width}px`);
      }
    };
    const end = () => {
      handle.classList.remove('is-dragging');
      handle.removeEventListener('pointermove', move);
      handle.removeEventListener('pointerup', end);
      handle.removeEventListener('pointercancel', end);
    };
    handle.addEventListener('pointermove', move);
    handle.addEventListener('pointerup', end);
    handle.addEventListener('pointercancel', end);
  });
}

document.querySelectorAll('[data-resize]').forEach(wireResize);

window.addEventListener('resize', () => {
  if (viewportState.scale < 1) fitWorkflow();
});

applyViewport();
