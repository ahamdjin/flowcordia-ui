import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ReactFlowProvider, useEdgesState, useNodesState } from "@xyflow/react";
import { studioEdges, studioNodes, workflows } from "./data";
import N8nCanvas from "./studio/N8nCanvas";
import CodeWorkbench from "./studio/CodeWorkbench";
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
    tags: ["customer", "approval", "production"],
    source: "workflows/customer-onboarding.ts",
  },
  lead_qualification: {
    description: "Score inbound leads, enrich company data, route high-intent opportunities, and update the CRM.",
    stage: 3,
    updated: "17 minutes ago",
    runs: "1,842 runs today",
    tags: ["sales", "ai", "crm"],
    source: "workflows/lead-qualification.ts",
  },
  invoice_approval: {
    description: "Inspect invoices, detect anomalies, collect a durable human decision, and release approved payments.",
    stage: 2,
    updated: "29 minutes ago",
    runs: "64 runs today",
    tags: ["finance", "approval", "durable"],
    source: "workflows/invoice-approval.ts",
  },
  weekly_operations_report: {
    description: "Collect operational metrics, summarize changes, and distribute a reliable weekly report.",
    stage: 4,
    updated: "1 hour ago",
    runs: "12 runs this week",
    tags: ["reporting", "schedule", "operations"],
    source: "workflows/weekly-operations-report.ts",
  },
  production_webhook_intake: {
    description: "Accept signed production events, suppress duplicates, and safely route each event into its workflow.",
    stage: 0,
    updated: "2 hours ago",
    runs: "3,914 runs today",
    tags: ["webhook", "reliability", "api"],
    source: "workflows/production-webhook-intake.ts",
  },
};

const catalog = [
  ["Webhook trigger", "Start from a signed HTTP request", "Triggers", "Webhook", "trigger.webhook", "trigger", "emerald"],
  ["Schedule trigger", "Run on a durable schedule", "Triggers", "CalendarClock", "trigger.schedule", "trigger", "emerald"],
  ["Manual trigger", "Start a workflow manually", "Triggers", "MousePointerClick", "trigger.manual", "trigger", "emerald"],
  ["HTTP request", "Call any external API", "Actions", "Globe2", "action.http", "action", "blue"],
  ["Send email", "Deliver an email notification", "Actions", "Mail", "action.email", "action", "violet"],
  ["Slack message", "Send a message to Slack", "Apps", "MessageSquare", "action.slack", "action", "violet"],
  ["Map data", "Transform and shape structured data", "Data", "Braces", "data.map", "action", "cyan"],
  ["Condition", "Branch using expressions", "Flow", "GitFork", "control.condition", "control", "amber"],
  ["Loop", "Repeat steps for every item", "Flow", "Repeat2", "control.loop", "control", "amber"],
  ["Merge", "Combine two workflow branches", "Flow", "Merge", "control.merge", "control", "amber"],
  ["Human approval", "Pause for a durable decision", "Human", "UserCheck", "approval.human", "approval", "orange"],
  ["Wait", "Pause until a time or event", "Human", "TimerReset", "wait.durable", "approval", "orange"],
  ["Code", "Run typed TypeScript", "Developer", "Code2", "code.typescript", "code", "pink"],
  ["Subflow", "Invoke another workflow", "Developer", "Boxes", "subflow.invoke", "subflow", "cyan"],
  ["AI agent", "Run a governed agent step", "AI", "Bot", "ai.agent", "action", "violet"],
  ["OpenAI", "Call a configured model", "AI", "Sparkles", "ai.openai", "action", "violet"],
].map(([name, description, category, icon, operation, kind, tone]) => ({ name, description, category, icon, operation, kind, tone }));

const githubRoot = "https://github.com/ahamdjin/Flowcordia";
const profileFor = (workflow) => workflowProfiles[workflow.id] || workflowProfiles.customer_onboarding;
const sourceUrl = (workflow) => `${githubRoot}/search?q=${encodeURIComponent(workflow.id)}&type=code`;

const canvasPositions = {
  trigger: [48, 208],
  validate: [272, 208],
  condition: [496, 208],
  enrich: [720, 64],
  approval: [720, 352],
  subflow: [944, 64],
  notify: [944, 352],
  output: [1168, 208],
};

function initialFlowNodes() {
  return studioNodes.map((node, index) => {
    const item = catalog.find((entry) => entry.operation === node.operation);
    const [x, y] = canvasPositions[node.id] || [48 + index * 224, 208];
    return {
      id: node.id,
      type: "flowcordia",
      position: { x, y },
      data: {
        label: node.name,
        operation: node.operation,
        kind: node.kind,
        tone: node.tone,
        icon: item?.icon || "Workflow",
        subtitle: item?.description || node.operation,
        status: index < 4 ? "success" : undefined,
        pinned: node.id === "condition",
      },
    };
  });
}

function initialFlowEdges() {
  return studioEdges.map(([source, target, label], index) => ({
    id: `edge-${index}`,
    source,
    target,
    label: label || undefined,
    type: "flowcordia",
    reconnectable: true,
  }));
}

function workflowSource(nodes, edges, workflow) {
  const nodeLines = nodes.map((node) => `    ${node.id}: node("${node.data.operation}", { name: "${node.data.label}" }),`).join("\n");
  const edgeLines = edges.map((edge) => `    connect("${edge.source}", "${edge.target}"${edge.label ? `, { when: "${edge.label}" }` : ""}),`).join("\n");
  return `import { defineWorkflow, node, connect } from "@flowcordia/sdk";\n\nexport default defineWorkflow({\n  id: "${workflow.id}",\n  version: "0.5",\n  nodes: {\n${nodeLines}\n  },\n  edges: [\n${edgeLines}\n  ],\n  runtime: {\n    queue: "flowcordia-critical",\n    retries: 3,\n    timeout: "5m",\n  },\n});\n`;
}

function StageBadge({ index }) {
  const stage = stages[index];
  return <span className={`studio-stage-badge stage-${stage.id}`}><Icon name={stage.icon} size={12} />{stage.label}</span>;
}

function WorkflowOverview({ onOpen }) {
  const [query, setQuery] = useState("");
  const filtered = workflows.filter((workflow) => {
    const profile = profileFor(workflow);
    return `${workflow.name} ${profile.description} ${profile.tags.join(" ")}`.toLowerCase().includes(query.toLowerCase());
  });

  return (
    <main className="workflow-overview">
      <section className="workflow-overview-hero">
        <div>
          <span className="studio-eyebrow">Flowcordia Studio</span>
          <h1>Workflows</h1>
          <p>Choose a workflow to enter its dedicated visual and source workspace. Every workflow stays connected to its repository identity and lifecycle stage.</p>
        </div>
        <div className="overview-actions">
          <a href={githubRoot} target="_blank" rel="noreferrer"><Icon name="Github" size={15} />Browse source<Icon name="ExternalLink" size={13} /></a>
          <button className="primary-button"><Icon name="Plus" size={15} />New workflow</button>
        </div>
      </section>

      <section className="workflow-overview-summary">
        <div><span>All workflows</span><strong>{workflows.length}</strong><small>Repository indexed</small></div>
        <div><span>In build</span><strong>{workflows.filter((item) => profileFor(item).stage === 1).length}</strong><small>Editable drafts</small></div>
        <div><span>In review</span><strong>{workflows.filter((item) => profileFor(item).stage === 2).length}</strong><small>Proposal required</small></div>
        <div><span>Live</span><strong>{workflows.filter((item) => profileFor(item).stage === 4).length}</strong><small>Production workflows</small></div>
      </section>

      <section className="workflow-library">
        <header>
          <div><h2>Your workflows</h2><p>Descriptions stay here so the workflow editor can remain open and focused.</p></div>
          <label><Icon name="Search" size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search workflows" /></label>
        </header>
        <div className="workflow-card-grid">
          {filtered.map((workflow) => {
            const profile = profileFor(workflow);
            return (
              <article className="workflow-card" key={workflow.id} onDoubleClick={() => onOpen(workflow.id)}>
                <div className="workflow-card-top"><span className="workflow-symbol"><Icon name="Workflow" size={18} /></span><StageBadge index={profile.stage} /><button title="More actions"><Icon name="Ellipsis" size={16} /></button></div>
                <div className="workflow-card-copy"><h3>{workflow.name}</h3><p>{profile.description}</p></div>
                <div className="workflow-tags">{profile.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
                <div className="workflow-card-meta"><span><Icon name="GitBranch" size={12} /><code>{profile.source}</code></span><span><Icon name="Activity" size={12} />{profile.runs}</span><span><Icon name="Clock3" size={12} />{profile.updated}</span></div>
                <footer><a href={sourceUrl(workflow)} onClick={(event) => event.stopPropagation()} target="_blank" rel="noreferrer"><Icon name="Code2" size={14} />Source<Icon name="ExternalLink" size={12} /></a><button onClick={() => onOpen(workflow.id)}>Open workflow<Icon name="ArrowRight" size={14} /></button></footer>
              </article>
            );
          })}
          <button className="new-workflow-card"><span><Icon name="Plus" size={22} /></span><strong>Create workflow</strong><small>Start from a trigger, template, or source file.</small></button>
        </div>
      </section>
    </main>
  );
}

function LifecycleStatus({ stageIndex, onChange }) {
  const current = stages[stageIndex];
  const nextLabel = stageIndex === 0 ? "Start building" : stageIndex === 1 ? "Send to review" : stageIndex === 2 ? "Create preview" : stageIndex === 3 ? "Promote to production" : "In production";

  return (
    <section className="lifecycle-status">
      <div className="current-stage"><span className={`current-stage-icon stage-${current.id}`}><Icon name={current.icon} size={17} /></span><div><small>Current stage</small><strong>{current.label}</strong><span>{current.detail}</span></div></div>
      <div className="stage-track">
        {stages.map((stage, index) => <React.Fragment key={stage.id}>{index > 0 && <i className={index <= stageIndex ? "complete" : ""} />}<button className={`${index < stageIndex ? "complete" : ""} ${index === stageIndex ? "current" : ""}`} title={stage.detail} onClick={() => onChange(index)}><span>{index < stageIndex ? <Icon name="Check" size={12} /> : index + 1}</span><b>{stage.label}</b></button></React.Fragment>)}
      </div>
      <div className="stage-actions"><button disabled={stageIndex === 0} onClick={() => onChange(Math.max(0, stageIndex - 1))}><Icon name="ArrowLeft" size={13} />Move back</button><button className="primary-button" disabled={stageIndex === stages.length - 1} onClick={() => onChange(Math.min(stages.length - 1, stageIndex + 1))}>{nextLabel}<Icon name="ArrowRight" size={13} /></button></div>
    </section>
  );
}

function WorkflowEditor({ workflow, onBack }) {
  const profile = profileFor(workflow);
  const initialNodes = useMemo(initialFlowNodes, []);
  const initialEdges = useMemo(initialFlowEdges, []);
  const originalCode = useMemo(() => workflowSource(initialNodes, initialEdges, workflow), [initialEdges, initialNodes, workflow]);
  const [stageIndex, setStageIndex] = useState(profile.stage);
  const [view, setView] = useState(() => new URLSearchParams(window.location.search).get("view") === "source" ? "source" : "canvas");
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [toastMessage, setToastMessage] = useState("");
  const [code, setCode] = useState(originalCode);
  const [sourceDirty, setSourceDirty] = useState(false);

  const toast = useCallback((message) => {
    setToastMessage(message);
    window.clearTimeout(window.__flowcordiaToast);
    window.__flowcordiaToast = window.setTimeout(() => setToastMessage(""), 2400);
  }, []);

  const switchView = useCallback((next) => {
    setView(next);
    const url = new URL(window.location.href);
    if (next === "source") url.searchParams.set("view", "source"); else url.searchParams.delete("view");
    window.history.replaceState({}, "", `${url.pathname}${url.search}`);
  }, []);

  useEffect(() => {
    if (!sourceDirty) setCode(workflowSource(nodes, edges, workflow));
  }, [nodes, edges, workflow, sourceDirty]);

  useEffect(() => {
    const openSource = () => switchView("source");
    window.addEventListener("flowcordia:source", openSource);
    return () => window.removeEventListener("flowcordia:source", openSource);
  }, [switchView]);

  return (
    <main className="workflow-editor n8n-studio-editor">
      <header className="workflow-editor-header">
        <div className="editor-title"><button onClick={onBack}><Icon name="ArrowLeft" size={16} /></button><span className="workflow-symbol"><Icon name="Workflow" size={17} /></span><div><small>Workflow</small><strong>{workflow.name}</strong></div></div>
        <nav className="view-switch"><button className={view === "canvas" ? "active" : ""} onClick={() => switchView("canvas")}><Icon name="Workflow" size={14} />Canvas</button><button className={view === "source" ? "active" : ""} onClick={() => switchView("source")}><Icon name="Code2" size={14} />Source</button></nav>
        <div className="editor-actions"><span className="saved-state"><Icon name="CloudCheck" size={14} />Saved</span><a href={sourceUrl(workflow)} target="_blank" rel="noreferrer"><Icon name="Github" size={14} />Source<Icon name="ExternalLink" size={12} /></a><button onClick={() => toast("Workflow test started")}><Icon name="Play" size={14} />Test workflow</button><button className="primary-button" onClick={() => toast("Draft saved")}>Save draft</button></div>
      </header>
      <LifecycleStatus stageIndex={stageIndex} onChange={(index) => { setStageIndex(index); toast(`Workflow moved to ${stages[index].label}`); }} />

      {view === "canvas" ? (
        <section className="canvas-workspace n8n-canvas-workspace">
          <ReactFlowProvider>
            <N8nCanvas
              nodes={nodes}
              setNodes={setNodes}
              onNodesChange={onNodesChange}
              edges={edges}
              setEdges={setEdges}
              onEdgesChange={onEdgesChange}
              catalog={catalog}
              toast={toast}
            />
          </ReactFlowProvider>
        </section>
      ) : (
        <CodeWorkbench
          workflow={workflow}
          profile={profile}
          code={code}
          originalCode={originalCode}
          setCode={setCode}
          dirty={sourceDirty}
          setDirty={setSourceDirty}
          onCanvas={() => switchView("canvas")}
          onReview={() => { setStageIndex(2); toast("Workflow moved to Review"); }}
          toast={toast}
          sourceUrl={sourceUrl(workflow)}
        />
      )}

      {toastMessage && <div className="studio-toast"><Icon name="CircleCheckBig" size={15} />{toastMessage}</div>}
    </main>
  );
}

function initialWorkflowId() {
  const [, id] = window.location.pathname.match(/^\/studio\/([^/]+)/) || [];
  return workflows.some((item) => item.id === id) ? id : null;
}

export default function Studio() {
  const [workflowId, setWorkflowId] = useState(initialWorkflowId);
  const openWorkflow = (id) => { window.history.pushState({}, "", `/studio/${id}`); setWorkflowId(id); };
  const back = () => { window.history.pushState({}, "", "/studio"); setWorkflowId(null); };

  useEffect(() => {
    const onPop = () => setWorkflowId(initialWorkflowId());
    const openSource = () => {
      if (!workflowId) {
        const id = workflows[0].id;
        window.history.pushState({}, "", `/studio/${id}?view=source`);
        setWorkflowId(id);
      }
    };
    window.addEventListener("popstate", onPop);
    window.addEventListener("flowcordia:source", openSource);
    return () => {
      window.removeEventListener("popstate", onPop);
      window.removeEventListener("flowcordia:source", openSource);
    };
  }, [workflowId]);

  const workflow = workflows.find((item) => item.id === workflowId);
  return workflow ? <WorkflowEditor key={workflow.id} workflow={workflow} onBack={back} /> : <WorkflowOverview onOpen={openWorkflow} />;
}
