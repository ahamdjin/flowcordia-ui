import React, { useEffect, useMemo, useRef, useState } from "react";
import { studioEdges, studioNodes, workflows } from "./data";
import { Icon } from "./ui";

const stages = [
  { id: "repository", label: "Repository", detail: "Saved in Git", icon: "GitBranch" },
  { id: "build", label: "Build", detail: "Draft editing", icon: "Workflow" },
  { id: "review", label: "Review", detail: "Proposal approval", icon: "GitPullRequest" },
  { id: "preview", label: "Preview", detail: "Exact test deploy", icon: "FlaskConical" },
  { id: "production", label: "Production", detail: "Live version", icon: "Rocket" },
];

const workflowProfiles = {
  customer_onboarding: {
    description: "Validate a new customer, enrich the account, request approval when needed, and provision the workspace.",
    stage: 1,
    updated: "8 minutes ago",
    runs: "248 runs today",
    owner: "Customer operations",
    tags: ["customer", "approval", "production"],
    source: "workflows/customer-onboarding.ts",
  },
  lead_qualification: {
    description: "Score inbound leads, enrich company data, route high-intent opportunities, and update the CRM.",
    stage: 3,
    updated: "17 minutes ago",
    runs: "1,842 runs today",
    owner: "Revenue operations",
    tags: ["sales", "ai", "crm"],
    source: "workflows/lead-qualification.ts",
  },
  invoice_approval: {
    description: "Inspect invoices, detect anomalies, collect a durable human decision, and release approved payments.",
    stage: 2,
    updated: "29 minutes ago",
    runs: "64 runs today",
    owner: "Finance operations",
    tags: ["finance", "approval", "durable"],
    source: "workflows/invoice-approval.ts",
  },
  weekly_operations_report: {
    description: "Collect operational metrics, summarize weekly changes, and publish a reviewed executive report.",
    stage: 4,
    updated: "2 hours ago",
    runs: "12 runs this week",
    owner: "Operations",
    tags: ["reporting", "scheduled", "ai"],
    source: "workflows/weekly-operations-report.ts",
  },
  production_webhook_intake: {
    description: "Receive production events, verify signatures, normalize payloads, and route work to bounded queues.",
    stage: 4,
    updated: "3 hours ago",
    runs: "3,914 runs today",
    owner: "Platform",
    tags: ["webhook", "critical", "production"],
    source: "workflows/production-webhook-intake.ts",
  },
};

const catalog = [
  { category: "Triggers", name: "Webhook", description: "Start from an authenticated HTTP request", icon: "Webhook", kind: "trigger", operation: "trigger.webhook", tone: "emerald" },
  { category: "Triggers", name: "Schedule", description: "Run on a cron or interval schedule", icon: "Clock3", kind: "trigger", operation: "trigger.schedule", tone: "emerald" },
  { category: "Triggers", name: "Form submission", description: "Start from a hosted or embedded form", icon: "PanelTop", kind: "trigger", operation: "trigger.form", tone: "emerald" },
  { category: "Core", name: "HTTP request", description: "Call any API with retries and credentials", icon: "Globe2", kind: "action", operation: "action.http", tone: "blue" },
  { category: "Core", name: "Transform data", description: "Map, rename, filter, and shape values", icon: "WandSparkles", kind: "action", operation: "data.map", tone: "blue" },
  { category: "Core", name: "Code", description: "Run typed TypeScript or JavaScript", icon: "Code2", kind: "code", operation: "code.run", tone: "violet" },
  { category: "Flow", name: "If", description: "Branch using a boolean condition", icon: "Split", kind: "control", operation: "control.condition", tone: "amber" },
  { category: "Flow", name: "Switch", description: "Route items across multiple conditions", icon: "GitFork", kind: "control", operation: "control.switch", tone: "amber" },
  { category: "Flow", name: "Merge", description: "Join two or more workflow branches", icon: "Merge", kind: "control", operation: "control.merge", tone: "amber" },
  { category: "Flow", name: "Wait", description: "Pause durably until time or callback", icon: "TimerReset", kind: "control", operation: "control.wait", tone: "orange" },
  { category: "Flow", name: "Human approval", description: "Request, remind, escalate, and resolve", icon: "UserCheck", kind: "approval", operation: "approval.human", tone: "orange" },
  { category: "Apps", name: "Slack", description: "Send messages and manage conversations", icon: "MessageSquare", kind: "action", operation: "app.slack", tone: "pink" },
  { category: "Apps", name: "GitHub", description: "Create issues, commits, and pull requests", icon: "Github", kind: "action", operation: "app.github", tone: "slate" },
  { category: "Apps", name: "Postgres", description: "Query and write PostgreSQL data", icon: "Database", kind: "action", operation: "app.postgres", tone: "cyan" },
  { category: "Apps", name: "OpenAI", description: "Use a governed model and prompt version", icon: "Sparkles", kind: "action", operation: "app.openai", tone: "violet" },
  { category: "Apps", name: "Email", description: "Send transactional or operational email", icon: "Mail", kind: "action", operation: "app.email", tone: "pink" },
  { category: "Advanced", name: "Sub-workflow", description: "Call a reusable repository workflow", icon: "Blocks", kind: "subflow", operation: "subflow.invoke", tone: "cyan" },
  { category: "Advanced", name: "Return output", description: "Return a typed workflow result", icon: "CornerDownLeft", kind: "output", operation: "output.return", tone: "pink" },
];

const githubRoot = "https://github.com/ahamdjin/Flowcordia/tree/main";
const nodeWidth = 214;
const nodeHeight = 88;

function initialWorkflowId() {
  const match = window.location.pathname.match(/^\/studio\/([^/]+)/);
  return match && workflows.some((workflow) => workflow.id === match[1]) ? match[1] : null;
}

function workflowSource(nodes, edges, workflow) {
  const nodeLines = nodes.map((node) => `    ${node.id}: node("${node.operation}", { name: "${node.name}" }),`).join("\n");
  const edgeLines = edges.map((edge) => `    connect("${edge.from}", "${edge.to}"${edge.label ? `, { when: "${edge.label}" }` : ""}),`).join("\n");
  return `import { defineWorkflow, node, connect } from "@flowcordia/sdk";\n\nexport default defineWorkflow({\n  id: "${workflow.id}",\n  version: "0.5",\n  nodes: {\n${nodeLines}\n  },\n  edges: [\n${edgeLines}\n  ],\n  runtime: {\n    queue: "flowcordia-critical",\n    retries: 3,\n    timeout: "5m",\n  },\n});\n`;
}

function StageBadge({ index }) {
  const stage = stages[index];
  return <span className={`studio-stage-badge stage-${stage.id}`}><Icon name={stage.icon} size={12} />{stage.label}</span>;
}

function WorkflowOverview({ onOpen }) {
  const [query, setQuery] = useState("");
  const filtered = workflows.filter((workflow) => {
    const profile = workflowProfiles[workflow.id];
    return `${workflow.name} ${profile.description} ${profile.tags.join(" ")}`.toLowerCase().includes(query.toLowerCase());
  });

  return <main className="workflow-overview">
    <section className="workflow-overview-hero">
      <div>
        <span className="studio-eyebrow">Flowcordia Studio</span>
        <h1>Workflows</h1>
        <p>Choose a workflow to enter its dedicated visual and code workspace. Repository source remains visible and reviewable at every stage.</p>
      </div>
      <div className="overview-actions">
        <a href={`${githubRoot}/workflows`} target="_blank" rel="noreferrer"><Icon name="Github" size={15} />Browse source<Icon name="ExternalLink" size={13} /></a>
        <button className="primary-button"><Icon name="Plus" size={15} />New workflow</button>
      </div>
    </section>

    <section className="workflow-overview-summary">
      <div><span>All workflows</span><strong>{workflows.length}</strong><small>Repository indexed</small></div>
      <div><span>In build</span><strong>{workflows.filter((item) => workflowProfiles[item.id].stage === 1).length}</strong><small>Editable drafts</small></div>
      <div><span>In review</span><strong>{workflows.filter((item) => workflowProfiles[item.id].stage === 2).length}</strong><small>Proposal required</small></div>
      <div><span>Live</span><strong>{workflows.filter((item) => workflowProfiles[item.id].stage === 4).length}</strong><small>Production workflows</small></div>
    </section>

    <section className="workflow-library">
      <header>
        <div><h2>Your workflows</h2><p>Descriptions are shown here before you enter the focused workflow editor.</p></div>
        <label><Icon name="Search" size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search workflows" /></label>
      </header>
      <div className="workflow-card-grid">
        {filtered.map((workflow) => {
          const profile = workflowProfiles[workflow.id];
          return <article className="workflow-card" key={workflow.id} onDoubleClick={() => onOpen(workflow.id)}>
            <div className="workflow-card-top">
              <span className="workflow-symbol"><Icon name="Workflow" size={18} /></span>
              <StageBadge index={profile.stage} />
              <button title="More actions"><Icon name="Ellipsis" size={16} /></button>
            </div>
            <div className="workflow-card-copy">
              <h3>{workflow.name}</h3>
              <p>{profile.description}</p>
            </div>
            <div className="workflow-tags">{profile.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
            <div className="workflow-card-meta">
              <span><Icon name="GitBranch" size={12} /><code>{profile.source}</code></span>
              <span><Icon name="Activity" size={12} />{profile.runs}</span>
              <span><Icon name="Clock3" size={12} />{profile.updated}</span>
            </div>
            <footer>
              <a href={`${githubRoot}/${profile.source}`} onClick={(event) => event.stopPropagation()} target="_blank" rel="noreferrer"><Icon name="Code2" size={14} />Source<Icon name="ExternalLink" size={12} /></a>
              <button onClick={() => onOpen(workflow.id)}>Open workflow<Icon name="ArrowRight" size={14} /></button>
            </footer>
          </article>;
        })}
        <button className="new-workflow-card"><span><Icon name="Plus" size={22} /></span><strong>Create workflow</strong><small>Start from a trigger, template, or source file.</small></button>
      </div>
    </section>
  </main>;
}

function LifecycleStatus({ stageIndex, onChange }) {
  const current = stages[stageIndex];
  return <section className="lifecycle-status">
    <div className="current-stage">
      <span className={`current-stage-icon stage-${current.id}`}><Icon name={current.icon} size={17} /></span>
      <div><small>Current stage</small><strong>{current.label}</strong><span>{current.detail}</span></div>
    </div>
    <div className="stage-track">
      {stages.map((stage, index) => <React.Fragment key={stage.id}>
        {index > 0 && <i className={index <= stageIndex ? "complete" : ""} />}
        <button className={`${index < stageIndex ? "complete" : ""} ${index === stageIndex ? "current" : ""}`} title={stage.detail} onClick={() => onChange(index)}>
          <span>{index < stageIndex ? <Icon name="Check" size={12} /> : index + 1}</span>
          <b>{stage.label}</b>
        </button>
      </React.Fragment>)}
    </div>
    <div className="stage-actions">
      <button disabled={stageIndex === 0} onClick={() => onChange(Math.max(0, stageIndex - 1))}><Icon name="ArrowLeft" size={13} />Move back</button>
      <button className="primary-button" disabled={stageIndex === stages.length - 1} onClick={() => onChange(Math.min(stages.length - 1, stageIndex + 1))}>
        {stageIndex === 0 ? "Start building" : stageIndex === 1 ? "Send to review" : stageIndex === 2 ? "Create preview" : stageIndex === 3 ? "Promote to production" : "In production"}<Icon name="ArrowRight" size={13} />
      </button>
    </div>
  </section>;
}

function NodeCreator({ open, onClose, onAdd }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const categories = ["All", ...new Set(catalog.map((item) => item.category))];
  const filtered = catalog.filter((item) => (category === "All" || item.category === category) && `${item.name} ${item.description} ${item.category}`.toLowerCase().includes(query.toLowerCase()));

  return <aside className={`node-creator ${open ? "open" : ""}`} aria-hidden={!open}>
    <header><div><strong>Add a node</strong><small>Search actions, triggers, logic, and apps</small></div><button onClick={onClose}><Icon name="X" size={17} /></button></header>
    <label className="node-search"><Icon name="Search" size={16} /><input autoFocus={open} value={query} onChange={(event) => setQuery(event.target.value)} placeholder="What happens next?" /><kbd>Esc</kbd></label>
    <div className="node-categories">{categories.map((item) => <button className={category === item ? "active" : ""} key={item} onClick={() => setCategory(item)}>{item}</button>)}</div>
    <div className="node-results">
      {filtered.map((item) => <button key={`${item.category}-${item.name}`} onClick={() => onAdd(item)}>
        <span className={`catalog-icon ${item.tone}`}><Icon name={item.icon} size={18} /></span>
        <b><strong>{item.name}</strong><small>{item.description}</small></b>
        <Icon name="Plus" size={15} />
      </button>)}
      {!filtered.length && <div className="node-empty"><Icon name="SearchX" size={25} /><strong>No nodes found</strong><small>Try a different name or category.</small></div>}
    </div>
    <footer><span><kbd>↑</kbd><kbd>↓</kbd> navigate</span><span><kbd>↵</kbd> add</span></footer>
  </aside>;
}

function NodePanel({ node, onClose, onUpdate, onDelete }) {
  const [tab, setTab] = useState("parameters");
  if (!node) return null;
  return <aside className="node-panel">
    <header>
      <div><span className={`catalog-icon ${node.tone}`}><Icon name={catalog.find((item) => item.operation === node.operation)?.icon || "Workflow"} size={17} /></span><b><strong>{node.name}</strong><small>{node.operation}</small></b></div>
      <button onClick={onClose}><Icon name="X" size={17} /></button>
    </header>
    <nav><button className={tab === "parameters" ? "active" : ""} onClick={() => setTab("parameters")}>Parameters</button><button className={tab === "settings" ? "active" : ""} onClick={() => setTab("settings")}>Settings</button><button className={tab === "output" ? "active" : ""} onClick={() => setTab("output")}>Test output</button></nav>
    <div className="node-panel-body">
      {tab === "parameters" && <>
        <label>Node name<input value={node.name} onChange={(event) => onUpdate({ ...node, name: event.target.value })} /></label>
        <label>Operation<select value={node.operation} onChange={(event) => onUpdate({ ...node, operation: event.target.value })}>{catalog.map((item) => <option key={item.operation}>{item.operation}</option>)}</select></label>
        <label>Input expression<textarea defaultValue={'{{ $json.customerId }}'} /></label>
        <div className="parameter-box"><span>Credential</span><button><Icon name="KeyRound" size={14} />CRM production credential<Icon name="ChevronDown" size={13} /></button></div>
      </>}
      {tab === "settings" && <>
        <label>Retry attempts<input defaultValue="3" /></label>
        <label>Timeout<input defaultValue="300 seconds" /></label>
        <label>Failure behavior<select defaultValue="stop"><option value="stop">Stop workflow</option><option value="continue">Continue branch</option></select></label>
      </>}
      {tab === "output" && <div className="test-output"><header><span className="studio-status success"><Icon name="CircleCheckBig" size={12} />Last test passed</span><code>842ms</code></header><pre>{`{\n  "customerId": "cus_1042",\n  "status": "validated",\n  "plan": "enterprise"\n}`}</pre></div>}
    </div>
    <footer><button onClick={onDelete} className="danger-button"><Icon name="Trash2" size={14} />Delete node</button><button className="primary-button"><Icon name="Play" size={14} />Test step</button></footer>
  </aside>;
}

function ContextMenu({ menu, onAction }) {
  if (!menu) return null;
  const nodeItems = menu.nodeId ? [["PanelRightOpen", "Open", "open"], ["CopyPlus", "Duplicate", "duplicate"], ["Unplug", "Disconnect", "disconnect"], ["Trash2", "Delete", "delete"]] : [["Plus", "Add node", "add"], ["Clipboard", "Paste", "paste"], ["Scan", "Fit workflow", "fit"]];
  return <div className="canvas-context" style={{ left: menu.x, top: menu.y }}>
    {nodeItems.map(([icon, label, action]) => <button className={action === "delete" ? "danger" : ""} key={action} onClick={() => onAction(action)}><Icon name={icon} size={14} />{label}{action === "open" && <kbd>Enter</kbd>}{action === "delete" && <kbd>⌫</kbd>}</button>)}
  </div>;
}

function WorkflowCanvas({ nodes, setNodes, edges, setEdges, selectedNode, setSelectedNode, openNode, openCreator, toast }) {
  const viewport = useRef(null);
  const [zoom, setZoom] = useState(.82);
  const [pan, setPan] = useState({ x: 80, y: 90 });
  const [drag, setDrag] = useState(null);
  const [panning, setPanning] = useState(null);
  const [connecting, setConnecting] = useState(null);
  const [selectedEdge, setSelectedEdge] = useState(null);
  const [menu, setMenu] = useState(null);
  const map = useMemo(() => new Map(nodes.map((node) => [node.id, node])), [nodes]);

  const worldPoint = (clientX, clientY) => {
    const rect = viewport.current.getBoundingClientRect();
    return { x: (clientX - rect.left - pan.x) / zoom, y: (clientY - rect.top - pan.y) / zoom };
  };
  const fit = () => {
    if (!nodes.length || !viewport.current) return;
    const rect = viewport.current.getBoundingClientRect();
    const minX = Math.min(...nodes.map((node) => node.x));
    const minY = Math.min(...nodes.map((node) => node.y));
    const maxX = Math.max(...nodes.map((node) => node.x + nodeWidth));
    const maxY = Math.max(...nodes.map((node) => node.y + nodeHeight));
    const nextZoom = Math.max(.35, Math.min(1, (rect.width - 180) / (maxX - minX), (rect.height - 160) / (maxY - minY)));
    setZoom(nextZoom);
    setPan({ x: (rect.width - (maxX - minX) * nextZoom) / 2 - minX * nextZoom, y: (rect.height - (maxY - minY) * nextZoom) / 2 - minY * nextZoom });
  };
  const pathFor = (from, to) => {
    const x1 = from.x + nodeWidth;
    const y1 = from.y + nodeHeight / 2;
    const x2 = to.x;
    const y2 = to.y + nodeHeight / 2;
    const bend = Math.max(70, Math.abs(x2 - x1) * .48);
    return `M ${x1} ${y1} C ${x1 + bend} ${y1}, ${x2 - bend} ${y2}, ${x2} ${y2}`;
  };
  const removeEdge = (id) => {
    setEdges((current) => current.filter((edge) => edge.id !== id));
    setSelectedEdge(null);
    toast("Connection removed");
  };
  const removeNode = (id) => {
    setNodes((current) => current.filter((node) => node.id !== id));
    setEdges((current) => current.filter((edge) => edge.from !== id && edge.to !== id));
    setSelectedNode(null);
    toast("Node removed");
  };
  const startConnect = (event, node) => {
    event.stopPropagation();
    const pointer = worldPoint(event.clientX, event.clientY);
    setConnecting({ from: node.id, pointer });
  };
  const completeConnect = (event, node) => {
    event.stopPropagation();
    if (!connecting || connecting.from === node.id) return setConnecting(null);
    const exists = edges.some((edge) => edge.from === connecting.from && edge.to === node.id);
    if (!exists) {
      setEdges((current) => [...current, { id: `edge-${Date.now()}`, from: connecting.from, to: node.id, label: "" }]);
      toast("Nodes connected");
    }
    setConnecting(null);
  };

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === "Escape") { setMenu(null); setConnecting(null); }
      if ((event.key === "Delete" || event.key === "Backspace") && !event.target.matches("input,textarea")) {
        if (selectedEdge) removeEdge(selectedEdge);
        else if (selectedNode) removeNode(selectedNode);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedEdge, selectedNode, edges]);

  return <div className={`workflow-canvas ${panning ? "panning" : ""}`} ref={viewport}
    onPointerDown={(event) => {
      if (event.button !== 0 || event.target.closest(".canvas-node,.canvas-tools,.canvas-context,.edge-delete")) return;
      setSelectedNode(null); setSelectedEdge(null); setMenu(null);
      setPanning({ pointerId: event.pointerId, startX: event.clientX, startY: event.clientY, x: pan.x, y: pan.y });
      event.currentTarget.setPointerCapture(event.pointerId);
    }}
    onPointerMove={(event) => {
      if (panning?.pointerId === event.pointerId) setPan({ x: panning.x + event.clientX - panning.startX, y: panning.y + event.clientY - panning.startY });
      if (connecting) setConnecting((current) => ({ ...current, pointer: worldPoint(event.clientX, event.clientY) }));
    }}
    onPointerUp={(event) => { if (panning?.pointerId === event.pointerId) setPanning(null); if (connecting && !event.target.closest(".node-target")) setConnecting(null); }}
    onPointerCancel={() => { setPanning(null); setConnecting(null); }}
    onContextMenu={(event) => { event.preventDefault(); const rect = viewport.current.getBoundingClientRect(); setMenu({ x: event.clientX - rect.left, y: event.clientY - rect.top }); }}
    onWheel={(event) => {
      event.preventDefault();
      if (event.ctrlKey || event.metaKey) setZoom((current) => Math.max(.3, Math.min(1.45, current + (event.deltaY < 0 ? .08 : -.08))));
      else setPan((current) => ({ x: current.x - event.deltaX, y: current.y - event.deltaY }));
    }}>
    <div className="canvas-hint"><Icon name="MousePointer2" size={13} />Drag to move · double-click to edit · right-click for actions</div>
    <div className="canvas-tools">
      <button title="Undo"><Icon name="Undo2" size={15} /></button><button title="Redo"><Icon name="Redo2" size={15} /></button><i />
      <button onClick={() => setZoom((value) => Math.max(.3, value - .1))}>−</button><button onClick={() => { setZoom(1); setPan({ x: 40, y: 50 }); }}>{Math.round(zoom * 100)}%</button><button onClick={() => setZoom((value) => Math.min(1.45, value + .1))}>+</button><i />
      <button onClick={fit}><Icon name="Scan" size={14} />Fit</button>
    </div>
    <button className="canvas-add" onClick={openCreator}><Icon name="Plus" size={18} /><span>Add node</span></button>
    <div className="canvas-world" style={{ transform: `translate3d(${pan.x}px,${pan.y}px,0) scale(${zoom})` }}>
      <svg width="2200" height="1200">
        <defs>
          <linearGradient id="edgeGradient"><stop offset="0" stopColor="#818cf8" /><stop offset="1" stopColor="#38bdf8" /></linearGradient>
          <filter id="edgeGlow"><feGaussianBlur stdDeviation="3" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
        </defs>
        {edges.map((edge) => {
          const from = map.get(edge.from), to = map.get(edge.to);
          if (!from || !to) return null;
          const path = pathFor(from, to);
          const midX = (from.x + nodeWidth + to.x) / 2;
          const midY = (from.y + nodeHeight / 2 + to.y + nodeHeight / 2) / 2;
          return <g className={`canvas-edge ${selectedEdge === edge.id ? "selected" : ""}`} key={edge.id}>
            <path className="edge-hit" d={path} onClick={(event) => { event.stopPropagation(); setSelectedEdge(edge.id); setSelectedNode(null); }} />
            <path className="edge-line" d={path} />
            {edge.label && <text x={midX} y={midY - 9}>{edge.label}</text>}
            {selectedEdge === edge.id && <g className="edge-delete" transform={`translate(${midX - 12} ${midY - 12})`} onClick={(event) => { event.stopPropagation(); removeEdge(edge.id); }}><circle cx="12" cy="12" r="11" /><path d="M8 8 L16 16 M16 8 L8 16" /></g>}
          </g>;
        })}
        {connecting && map.get(connecting.from) && <path className="edge-preview" d={`M ${map.get(connecting.from).x + nodeWidth} ${map.get(connecting.from).y + nodeHeight / 2} C ${map.get(connecting.from).x + nodeWidth + 100} ${map.get(connecting.from).y + nodeHeight / 2}, ${connecting.pointer.x - 100} ${connecting.pointer.y}, ${connecting.pointer.x} ${connecting.pointer.y}`} />}
      </svg>
      {nodes.map((node) => <article className={`canvas-node compact ${node.tone} ${selectedNode === node.id ? "selected" : ""}`} key={node.id} style={{ left: node.x, top: node.y }}
        onPointerDown={(event) => {
          if (event.target.closest(".node-source,.node-target")) return;
          event.stopPropagation(); setSelectedNode(node.id); setSelectedEdge(null); setMenu(null);
          setDrag({ pointerId: event.pointerId, id: node.id, startX: event.clientX, startY: event.clientY, x: node.x, y: node.y });
          event.currentTarget.setPointerCapture(event.pointerId);
        }}
        onPointerMove={(event) => {
          if (drag?.pointerId !== event.pointerId || drag.id !== node.id) return;
          setNodes((current) => current.map((item) => item.id === node.id ? { ...item, x: Math.round((drag.x + (event.clientX - drag.startX) / zoom) / 16) * 16, y: Math.round((drag.y + (event.clientY - drag.startY) / zoom) / 16) * 16 } : item));
        }}
        onPointerUp={(event) => { if (drag?.pointerId === event.pointerId) setDrag(null); }}
        onDoubleClick={(event) => { event.stopPropagation(); openNode(node.id); }}
        onContextMenu={(event) => { event.preventDefault(); event.stopPropagation(); const rect = viewport.current.getBoundingClientRect(); setSelectedNode(node.id); setMenu({ x: event.clientX - rect.left, y: event.clientY - rect.top, nodeId: node.id }); }}>
        <button className="node-target" title="Connect here" onPointerUp={(event) => completeConnect(event, node)} />
        <span className={`node-icon ${node.tone}`}><Icon name={catalog.find((item) => item.operation === node.operation)?.icon || "Workflow"} size={18} /></span>
        <b><strong>{node.name}</strong><small>{node.operation}</small></b>
        <span className="node-state"><Icon name="Check" size={11} /></span>
        <button className="node-source" title="Drag to connect" onPointerDown={(event) => startConnect(event, node)}><Icon name="Plus" size={11} /></button>
      </article>)}
    </div>
    <ContextMenu menu={menu} onAction={(action) => {
      const nodeId = menu?.nodeId;
      setMenu(null);
      if (action === "add") openCreator();
      if (action === "fit") fit();
      if (action === "open" && nodeId) openNode(nodeId);
      if (action === "delete" && nodeId) removeNode(nodeId);
      if (action === "disconnect" && nodeId) { setEdges((current) => current.filter((edge) => edge.from !== nodeId && edge.to !== nodeId)); toast("Node disconnected"); }
      if (action === "duplicate" && nodeId) {
        const source = map.get(nodeId);
        const copy = { ...source, id: `${source.id}_${Date.now().toString().slice(-4)}`, name: `${source.name} copy`, x: source.x + 80, y: source.y + 120 };
        setNodes((current) => [...current, copy]); toast("Node duplicated");
      }
    }} />
  </div>;
}

function SourceWorkspace({ workflow, nodes, edges, code, setCode, dirty, setDirty, onCanvas, onReview, toast }) {
  const profile = workflowProfiles[workflow.id];
  const files = [profile.source, `workflows/${workflow.id}.schema.json`, "flowcordia.config.ts", ".env.example"];
  return <section className="source-workspace">
    <aside className="source-explorer">
      <header><strong>EXPLORER</strong><button><Icon name="Ellipsis" size={14} /></button></header>
      <div className="source-repo"><Icon name="ChevronDown" size={13} /><Icon name="FolderGit2" size={15} /><strong>FLOWCORDIA</strong></div>
      <div className="source-files">{files.map((file, index) => <button className={index === 0 ? "active" : ""} key={file}><Icon name={file.endsWith(".json") ? "Braces" : file.startsWith(".") ? "FileKey" : "FileCode2"} size={14} /><span>{file}</span>{index === 0 && dirty && <i>M</i>}</button>)}</div>
      <a href={`${githubRoot}/${profile.source}`} target="_blank" rel="noreferrer"><Icon name="Github" size={14} />Open in GitHub<Icon name="ExternalLink" size={12} /></a>
    </aside>
    <div className="code-editor">
      <header>
        <div><span><Icon name="FileCode2" size={13} />{profile.source}</span><i className={`sync-state ${dirty ? "dirty" : ""}`}><Icon name={dirty ? "CircleDot" : "RefreshCw"} size={12} />{dirty ? "Modified" : "Synced with canvas"}</i></div>
        <span><button onClick={onCanvas}><Icon name="Workflow" size={14} />Canvas</button><button onClick={() => { setDirty(false); toast("Source applied and canvas marked as synced"); }} className="primary-button">Apply to canvas</button><button onClick={onReview}>Review changes<Icon name="ArrowRight" size={13} /></button></span>
      </header>
      <div className="editor-tabs"><button className="active"><Icon name="FileCode2" size={12} />{profile.source.split("/").pop()}<i /></button></div>
      <div className="editor-area"><div className="line-numbers">{code.split("\n").map((_, index) => <span key={index}>{index + 1}</span>)}</div><textarea spellCheck="false" value={code} onChange={(event) => { setCode(event.target.value); setDirty(true); }} /></div>
      <footer><span><Icon name="GitBranch" size={12} />main*</span><span><Icon name="Braces" size={12} />TypeScript</span><span>UTF-8</span><span>Spaces: 2</span><span><Icon name="CircleCheckBig" size={12} />0 problems</span></footer>
    </div>
  </section>;
}

function WorkflowEditor({ workflow, onBack }) {
  const profile = workflowProfiles[workflow.id];
  const [stageIndex, setStageIndex] = useState(profile.stage);
  const [view, setView] = useState(() => new URLSearchParams(window.location.search).get("view") === "source" ? "source" : "canvas");
  const [nodes, setNodes] = useState(() => studioNodes.map((node) => ({ ...node })));
  const [edges, setEdges] = useState(() => studioEdges.map(([from, to, label], index) => ({ id: `edge-${index}`, from, to, label: label || "" })));
  const [selectedNode, setSelectedNode] = useState("condition");
  const [panelNode, setPanelNode] = useState(null);
  const [creatorOpen, setCreatorOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [code, setCode] = useState(() => workflowSource(studioNodes, studioEdges.map(([from, to, label], index) => ({ id: `edge-${index}`, from, to, label: label || "" })), workflow));
  const [sourceDirty, setSourceDirty] = useState(false);

  const toast = (message) => { setToastMessage(message); window.clearTimeout(window.__flowcordiaToast); window.__flowcordiaToast = window.setTimeout(() => setToastMessage(""), 2400); };
  useEffect(() => { if (!sourceDirty) setCode(workflowSource(nodes, edges, workflow)); }, [nodes, edges, workflow.id, sourceDirty]);
  useEffect(() => {
    const openSource = () => setView("source");
    window.addEventListener("flowcordia:source", openSource);
    return () => window.removeEventListener("flowcordia:source", openSource);
  }, []);
  useEffect(() => {
    const onKey = (event) => { if (event.key === "Escape") { setCreatorOpen(false); setPanelNode(null); } if ((event.key === "a" || event.key === "A") && (event.metaKey || event.ctrlKey)) { event.preventDefault(); setCreatorOpen(true); } };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const addNode = (item) => {
    const id = `${item.name.toLowerCase().replace(/[^a-z0-9]+/g, "_")}_${Date.now().toString().slice(-4)}`;
    const node = { id, kind: item.kind, name: item.name, operation: item.operation, tone: item.tone, settings: 1, credentials: 0, x: 740 + nodes.length * 12, y: 360 + (nodes.length % 3) * 120 };
    setNodes((current) => [...current, node]); setSelectedNode(id); setCreatorOpen(false); toast(`${item.name} added`);
  };
  const deletePanelNode = () => {
    if (!panelNode) return;
    setNodes((current) => current.filter((node) => node.id !== panelNode));
    setEdges((current) => current.filter((edge) => edge.from !== panelNode && edge.to !== panelNode));
    setPanelNode(null); setSelectedNode(null); toast("Node removed");
  };

  return <main className="workflow-editor">
    <header className="workflow-editor-header">
      <div className="editor-title"><button onClick={onBack}><Icon name="ArrowLeft" size={16} /></button><span className="workflow-symbol"><Icon name="Workflow" size={17} /></span><div><small>Workflow</small><strong>{workflow.name}</strong></div></div>
      <nav className="view-switch"><button className={view === "canvas" ? "active" : ""} onClick={() => setView("canvas")}><Icon name="Workflow" size={14} />Canvas</button><button className={view === "source" ? "active" : ""} onClick={() => setView("source")}><Icon name="Code2" size={14} />Source</button></nav>
      <div className="editor-actions"><span className="saved-state"><Icon name="CloudCheck" size={14} />Saved</span><a href={`${githubRoot}/${profile.source}`} target="_blank" rel="noreferrer"><Icon name="Github" size={14} />Source<Icon name="ExternalLink" size={12} /></a><button><Icon name="Play" size={14} />Test workflow</button><button className="primary-button">Save draft</button></div>
    </header>
    <LifecycleStatus stageIndex={stageIndex} onChange={(index) => { setStageIndex(index); toast(`Workflow moved to ${stages[index].label}`); }} />
    {view === "canvas" ? <section className="canvas-workspace">
      <WorkflowCanvas nodes={nodes} setNodes={setNodes} edges={edges} setEdges={setEdges} selectedNode={selectedNode} setSelectedNode={setSelectedNode} openNode={(id) => { setPanelNode(id); setSelectedNode(id); }} openCreator={() => setCreatorOpen(true)} toast={toast} />
      <NodeCreator open={creatorOpen} onClose={() => setCreatorOpen(false)} onAdd={addNode} />
      <NodePanel node={nodes.find((node) => node.id === panelNode)} onClose={() => setPanelNode(null)} onUpdate={(next) => setNodes((current) => current.map((node) => node.id === next.id ? next : node))} onDelete={deletePanelNode} />
    </section> : <SourceWorkspace workflow={workflow} nodes={nodes} edges={edges} code={code} setCode={setCode} dirty={sourceDirty} setDirty={setSourceDirty} onCanvas={() => setView("canvas")} onReview={() => { setStageIndex(2); toast("Workflow moved to Review"); }} toast={toast} />}
    {toastMessage && <div className="studio-toast"><Icon name="CircleCheckBig" size={15} />{toastMessage}</div>}
  </main>;
}

export default function Studio() {
  const [workflowId, setWorkflowId] = useState(initialWorkflowId);
  const openWorkflow = (id) => { window.history.pushState({}, "", `/studio/${id}`); setWorkflowId(id); };
  const back = () => { window.history.pushState({}, "", "/studio"); setWorkflowId(null); };
  useEffect(() => {
    const onPop = () => setWorkflowId(initialWorkflowId());
    const openSource = () => { if (!workflowId) { const id = workflows[0].id; window.history.pushState({}, "", `/studio/${id}?view=source`); setWorkflowId(id); } };
    window.addEventListener("popstate", onPop);
    window.addEventListener("flowcordia:source", openSource);
    return () => { window.removeEventListener("popstate", onPop); window.removeEventListener("flowcordia:source", openSource); };
  }, [workflowId]);
  const workflow = workflows.find((item) => item.id === workflowId);
  return workflow ? <WorkflowEditor key={workflow.id} workflow={workflow} onBack={back} /> : <WorkflowOverview onOpen={openWorkflow} />;
}
