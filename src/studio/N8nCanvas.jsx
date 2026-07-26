import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Background,
  BackgroundVariant,
  BaseEdge,
  ConnectionLineType,
  EdgeLabelRenderer,
  Handle,
  MarkerType,
  MiniMap,
  NodeToolbar,
  Panel,
  Position,
  ReactFlow,
  addEdge,
  getBezierPath,
  reconnectEdge,
  useReactFlow,
} from "@xyflow/react";
import { Icon } from "../ui";

const NODE_WIDTH = 96;
const NODE_HEIGHT = 96;
const GRID_SIZE = 16;

const toneColors = {
  emerald: "#2f9d75",
  blue: "#5b7fd6",
  amber: "#d29a3a",
  orange: "#d9824b",
  violet: "#8b6fd6",
  pink: "#ce6e9f",
  cyan: "#3c9daf",
};

function CanvasNode({ data, selected }) {
  const trigger = data.kind === "trigger";
  const configuration = data.kind === "subflow";

  return (
    <div className={`n8n-node-shell ${selected ? "is-selected" : ""}`}>
      <NodeToolbar
        className="n8n-node-toolbar"
        isVisible={selected}
        position={Position.Top}
        offset={12}
      >
        <button title="Test step" onClick={(event) => { event.stopPropagation(); data.onRun?.(); }}><Icon name="Play" size={14} /></button>
        <button title={data.disabled ? "Enable" : "Disable"} onClick={(event) => { event.stopPropagation(); data.onToggle?.(); }}><Icon name="Power" size={14} /></button>
        <button title="Delete" onClick={(event) => { event.stopPropagation(); data.onDelete?.(); }}><Icon name="Trash2" size={14} /></button>
        <button title="More actions" onClick={(event) => { event.stopPropagation(); data.onMenu?.(event); }}><Icon name="Ellipsis" size={15} /></button>
      </NodeToolbar>

      <Handle className="n8n-handle n8n-handle-target" type="target" position={Position.Left} />
      <div className={`n8n-node-body tone-${data.tone || "blue"} ${trigger ? "is-trigger" : ""} ${configuration ? "is-configuration" : ""} ${data.disabled ? "is-disabled" : ""} ${data.status || ""}`}>
        <span className="n8n-node-icon"><Icon name={data.icon || "Workflow"} size={31} strokeWidth={1.65} /></span>
        {data.status === "success" && <span className="n8n-node-status success"><Icon name="Check" size={11} /></span>}
        {data.status === "warning" && <span className="n8n-node-status warning"><Icon name="TriangleAlert" size={11} /></span>}
        {data.pinned && <span className="n8n-node-status pinned"><Icon name="Pin" size={11} /></span>}
      </div>
      <div className="n8n-node-description">
        <strong>{data.label}</strong>
        <small>{data.subtitle || data.operation}</small>
      </div>
      <Handle className="n8n-handle n8n-handle-source" type="source" position={Position.Right} />
    </div>
  );
}

const MemoCanvasNode = memo(CanvasNode);

function CanvasEdge(props) {
  const {
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    markerEnd,
    selected,
    data,
    label,
  } = props;
  const [hovered, setHovered] = useState(false);
  const [path, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    curvature: 0.34,
  });
  const showToolbar = hovered || selected;

  return (
    <>
      <g onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
        <BaseEdge
          id={id}
          path={path}
          markerEnd={markerEnd}
          interactionWidth={40}
          className={`n8n-edge-path ${selected ? "is-selected" : ""}`}
        />
      </g>
      <EdgeLabelRenderer>
        <div
          className={`n8n-edge-label ${showToolbar ? "is-visible" : ""}`}
          style={{ transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)` }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          {showToolbar ? (
            <div className="n8n-edge-toolbar">
              <button title="Insert node" onClick={(event) => { event.stopPropagation(); data?.onInsert?.(id, { x: labelX, y: labelY }); }}><Icon name="Plus" size={14} /></button>
              <button title="Delete connection" onClick={(event) => { event.stopPropagation(); data?.onDelete?.(id); }}><Icon name="Trash2" size={14} /></button>
            </div>
          ) : label ? <span>{label}</span> : null}
        </div>
      </EdgeLabelRenderer>
    </>
  );
}

const MemoCanvasEdge = memo(CanvasEdge);
const nodeTypes = { flowcordia: MemoCanvasNode };
const edgeTypes = { flowcordia: MemoCanvasEdge };

function NodeCreator({ open, catalog, onClose, onAdd }) {
  const [query, setQuery] = useState("");
  const [mode, setMode] = useState("nodes");
  const [category, setCategory] = useState("All");
  const categories = ["All", ...new Set(catalog.map((item) => item.category))];
  const filtered = catalog.filter((item) => {
    const categoryMatch = category === "All" || item.category === category;
    const queryMatch = `${item.name} ${item.description} ${item.category}`.toLowerCase().includes(query.toLowerCase());
    return categoryMatch && queryMatch;
  });

  useEffect(() => {
    if (!open) return;
    const close = (event) => { if (event.key === "Escape") onClose(); };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) {
      setQuery("");
      setCategory("All");
    }
  }, [open]);

  return (
    <>
      <button className={`n8n-node-creator-scrim ${open ? "is-open" : ""}`} aria-label="Close node creator" onClick={onClose} />
      <aside className={`n8n-node-creator ${open ? "is-open" : ""}`} aria-hidden={!open}>
        <header>
          <div>
            <small>Add to workflow</small>
            <strong>What happens next?</strong>
          </div>
          <button onClick={onClose} aria-label="Close"><Icon name="X" size={18} /></button>
        </header>
        <nav className="n8n-creator-modes">
          <button className={mode === "nodes" ? "active" : ""} onClick={() => setMode("nodes")}><Icon name="Boxes" size={15} />Nodes</button>
          <button className={mode === "ai" ? "active" : ""} onClick={() => setMode("ai")}><Icon name="Sparkles" size={15} />AI</button>
        </nav>
        <label className="n8n-creator-search">
          <Icon name="Search" size={17} />
          <input autoFocus={open} value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search nodes..." />
          <kbd>esc</kbd>
        </label>
        {mode === "nodes" ? (
          <>
            <div className="n8n-creator-categories">
              {categories.map((item) => <button key={item} className={category === item ? "active" : ""} onClick={() => setCategory(item)}>{item}</button>)}
            </div>
            {!query && category === "All" && (
              <section className="n8n-quick-start">
                <span>Quick access</span>
                <div>
                  {catalog.slice(0, 4).map((item) => <button key={item.operation} onClick={() => onAdd(item)}><i className={`tone-${item.tone}`}><Icon name={item.icon} size={19} /></i><b>{item.name}</b></button>)}
                </div>
              </section>
            )}
            <section className="n8n-node-list">
              <span>{query ? "Search results" : category === "All" ? "All nodes" : category}</span>
              {filtered.map((item) => (
                <button key={item.operation} onClick={() => onAdd(item)}>
                  <i className={`tone-${item.tone}`}><Icon name={item.icon} size={20} /></i>
                  <b><strong>{item.name}</strong><small>{item.description}</small></b>
                  <Icon name="ChevronRight" size={15} />
                </button>
              ))}
              {!filtered.length && <div className="n8n-node-empty"><Icon name="SearchX" size={28} /><strong>No nodes found</strong><small>Try another search or category.</small></div>}
            </section>
          </>
        ) : (
          <section className="n8n-ai-creator">
            <span className="n8n-ai-orb"><Icon name="Sparkles" size={23} /></span>
            <strong>Build with Flowcordia AI</strong>
            <p>Describe the workflow and generate a governed visual draft you can inspect before review.</p>
            <textarea placeholder="When a new customer signs up, validate the account, request approval, and provision their workspace..." />
            <button className="primary-button"><Icon name="WandSparkles" size={15} />Generate workflow</button>
          </section>
        )}
      </aside>
    </>
  );
}

function NodeDetails({ node, catalog, onClose, onUpdate, onDelete, onRun }) {
  const [tab, setTab] = useState("parameters");
  if (!node) return null;

  return (
    <aside className="n8n-node-details">
      <header>
        <div><i className={`tone-${node.data.tone}`}><Icon name={node.data.icon || "Workflow"} size={22} /></i><span><strong>{node.data.label}</strong><small>{node.data.operation}</small></span></div>
        <button onClick={onClose}><Icon name="X" size={18} /></button>
      </header>
      <div className="n8n-ndv-testbar">
        <button className="primary-button" onClick={onRun}><Icon name="Play" size={15} />Test step</button>
        <span><Icon name="CircleCheckBig" size={14} />Last run succeeded · 842ms</span>
      </div>
      <nav>
        <button className={tab === "parameters" ? "active" : ""} onClick={() => setTab("parameters")}>Parameters</button>
        <button className={tab === "settings" ? "active" : ""} onClick={() => setTab("settings")}>Settings</button>
        <button className={tab === "output" ? "active" : ""} onClick={() => setTab("output")}>Output</button>
      </nav>
      <div className="n8n-ndv-body">
        {tab === "parameters" && (
          <>
            <label>Name<input value={node.data.label} onChange={(event) => onUpdate({ label: event.target.value })} /></label>
            <label>Operation<select value={node.data.operation} onChange={(event) => { const item = catalog.find((entry) => entry.operation === event.target.value); onUpdate({ operation: event.target.value, icon: item?.icon, tone: item?.tone, kind: item?.kind }); }}>{catalog.map((item) => <option value={item.operation} key={item.operation}>{item.name}</option>)}</select></label>
            <section className="n8n-field-card"><header><strong>Input</strong><span>Expression</span></header><textarea defaultValue={'{{ $json.customerId }}'} /></section>
            <section className="n8n-field-card"><header><strong>Credential</strong><span>Required</span></header><button><Icon name="KeyRound" size={15} />CRM production credential<Icon name="ChevronDown" size={14} /></button></section>
          </>
        )}
        {tab === "settings" && (
          <>
            <label>Retry on failure<select defaultValue="enabled"><option value="enabled">Enabled</option><option value="disabled">Disabled</option></select></label>
            <div className="n8n-two-fields"><label>Attempts<input defaultValue="3" /></label><label>Wait between tries<input defaultValue="2 seconds" /></label></div>
            <label>On error<select defaultValue="stop"><option value="stop">Stop workflow</option><option value="continue">Continue regular output</option><option value="error">Use error output</option></select></label>
            <label className="n8n-toggle-row"><span><strong>Always output data</strong><small>Return an empty item when no data exists.</small></span><input type="checkbox" /></label>
          </>
        )}
        {tab === "output" && (
          <section className="n8n-output-panel">
            <header><span><Icon name="Table2" size={14} />Table</span><button><Icon name="Pin" size={14} />Pin data</button></header>
            <div className="n8n-output-table"><div><b>customerId</b><b>status</b><b>plan</b></div><div><code>cus_1042</code><span>validated</span><span>enterprise</span></div></div>
            <footer>1 item · 3 fields</footer>
          </section>
        )}
      </div>
      <footer><button className="danger-button" onClick={onDelete}><Icon name="Trash2" size={14} />Delete node</button><button onClick={onClose}>Done</button></footer>
    </aside>
  );
}

function CanvasControls({ mode, setMode, onAdd }) {
  const { zoomIn, zoomOut, fitView } = useReactFlow();
  return (
    <Panel className="n8n-canvas-controls" position="bottom-left">
      <div>
        <button className={mode === "select" ? "active" : ""} title="Select" onClick={() => setMode("select")}><Icon name="MousePointer2" size={15} /></button>
        <button className={mode === "pan" ? "active" : ""} title="Pan" onClick={() => setMode("pan")}><Icon name="Hand" size={15} /></button>
      </div>
      <i />
      <div><button title="Undo"><Icon name="Undo2" size={15} /></button><button title="Redo"><Icon name="Redo2" size={15} /></button></div>
      <i />
      <div><button title="Zoom out" onClick={() => zoomOut({ duration: 180 })}><Icon name="Minus" size={15} /></button><button title="Zoom in" onClick={() => zoomIn({ duration: 180 })}><Icon name="Plus" size={15} /></button><button title="Fit workflow" onClick={() => fitView({ padding: 0.22, duration: 420 })}><Icon name="Scan" size={15} /></button></div>
      <i />
      <button className="n8n-control-add" onClick={onAdd}><Icon name="Plus" size={17} />Add node</button>
    </Panel>
  );
}

function CanvasContextMenu({ menu, onAction }) {
  if (!menu) return null;
  const items = menu.kind === "node"
    ? [["PanelRightOpen", "Open", "open"], ["Play", "Test step", "run"], ["CopyPlus", "Duplicate", "duplicate"], ["Unplug", "Disconnect", "disconnect"], ["Trash2", "Delete", "delete"]]
    : menu.kind === "edge"
      ? [["Plus", "Insert node", "insert"], ["Unplug", "Delete connection", "delete-edge"]]
      : [["Plus", "Add node", "add"], ["Clipboard", "Paste", "paste"], ["Scan", "Fit workflow", "fit"]];
  return <div className="n8n-canvas-context" style={{ left: menu.x, top: menu.y }}>{items.map(([icon, label, action], index) => <React.Fragment key={action}>{index === items.length - 1 && action.includes("delete") && <i />}<button className={action.includes("delete") ? "danger" : ""} onClick={() => onAction(action)}><Icon name={icon} size={14} />{label}</button></React.Fragment>)}</div>;
}

export default function N8nCanvas({
  nodes,
  setNodes,
  onNodesChange,
  edges,
  setEdges,
  onEdgesChange,
  catalog,
  toast,
}) {
  const { fitView, screenToFlowPosition } = useReactFlow();
  const [mode, setMode] = useState("select");
  const [creator, setCreator] = useState({ open: false, position: null, edgeId: null, sourceId: null });
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [panelNodeId, setPanelNodeId] = useState(null);
  const [menu, setMenu] = useState(null);
  const connectStart = useRef(null);

  const closeCreator = useCallback(() => setCreator({ open: false, position: null, edgeId: null, sourceId: null }), []);
  const openCreator = useCallback((context = {}) => setCreator({ open: true, position: context.position || null, edgeId: context.edgeId || null, sourceId: context.sourceId || null }), []);

  const removeNode = useCallback((id) => {
    setNodes((current) => current.filter((node) => node.id !== id));
    setEdges((current) => current.filter((edge) => edge.source !== id && edge.target !== id));
    if (panelNodeId === id) setPanelNodeId(null);
    setSelectedNodeId(null);
    toast("Node removed");
  }, [panelNodeId, setEdges, setNodes, toast]);

  const removeEdge = useCallback((id) => {
    setEdges((current) => current.filter((edge) => edge.id !== id));
    toast("Connection removed");
  }, [setEdges, toast]);

  const runNode = useCallback((id) => {
    setNodes((current) => current.map((node) => node.id === id ? { ...node, data: { ...node.data, status: "running" } } : node));
    toast("Testing step…");
    window.setTimeout(() => {
      setNodes((current) => current.map((node) => node.id === id ? { ...node, data: { ...node.data, status: "success" } } : node));
      toast("Step completed successfully");
    }, 900);
  }, [setNodes, toast]);

  const decoratedNodes = useMemo(() => nodes.map((node) => ({
    ...node,
    selected: node.id === selectedNodeId || node.selected,
    data: {
      ...node.data,
      onRun: () => runNode(node.id),
      onToggle: () => setNodes((current) => current.map((item) => item.id === node.id ? { ...item, data: { ...item.data, disabled: !item.data.disabled } } : item)),
      onDelete: () => removeNode(node.id),
      onMenu: (event) => setMenu({ kind: "node", id: node.id, x: event.clientX - 230, y: event.clientY - 96 }),
    },
  })), [nodes, removeNode, runNode, selectedNodeId, setNodes]);

  const decoratedEdges = useMemo(() => edges.map((edge) => ({
    ...edge,
    type: "flowcordia",
    markerEnd: edge.markerEnd || { type: MarkerType.ArrowClosed, width: 14, height: 14, color: "#8b8b95" },
    data: {
      ...edge.data,
      onInsert: (edgeId, position) => openCreator({ edgeId, position }),
      onDelete: removeEdge,
    },
  })), [edges, openCreator, removeEdge]);

  const addCatalogNode = useCallback((item) => {
    const fallback = screenToFlowPosition({ x: window.innerWidth * 0.55, y: window.innerHeight * 0.54 });
    const position = creator.position || fallback;
    const id = `${item.name.toLowerCase().replace(/[^a-z0-9]+/g, "_")}_${Date.now().toString().slice(-5)}`;
    const nextNode = {
      id,
      type: "flowcordia",
      position: { x: Math.round((position.x - NODE_WIDTH / 2) / GRID_SIZE) * GRID_SIZE, y: Math.round((position.y - NODE_HEIGHT / 2) / GRID_SIZE) * GRID_SIZE },
      data: { label: item.name, operation: item.operation, kind: item.kind, tone: item.tone, icon: item.icon, subtitle: item.description },
    };

    setNodes((current) => [...current, nextNode]);
    if (creator.edgeId) {
      setEdges((current) => {
        const replaced = current.find((edge) => edge.id === creator.edgeId);
        if (!replaced) return current;
        return [
          ...current.filter((edge) => edge.id !== creator.edgeId),
          { id: `edge-${Date.now()}-a`, source: replaced.source, target: id, type: "flowcordia" },
          { id: `edge-${Date.now()}-b`, source: id, target: replaced.target, type: "flowcordia" },
        ];
      });
    } else if (creator.sourceId) {
      setEdges((current) => addEdge({ id: `edge-${Date.now()}`, source: creator.sourceId, target: id, type: "flowcordia" }, current));
    }
    setSelectedNodeId(id);
    closeCreator();
    toast(`${item.name} added`);
  }, [closeCreator, creator, screenToFlowPosition, setEdges, setNodes, toast]);

  const onConnect = useCallback((connection) => {
    setEdges((current) => addEdge({ ...connection, id: `edge-${Date.now()}`, type: "flowcordia" }, current));
    toast("Nodes connected");
  }, [setEdges, toast]);

  const onReconnect = useCallback((oldEdge, connection) => {
    setEdges((current) => reconnectEdge(oldEdge, connection, current));
    toast("Connection updated");
  }, [setEdges, toast]);

  useEffect(() => {
    const keyboard = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "a" && !event.target.matches("input,textarea")) {
        event.preventDefault();
        openCreator();
      }
      if (event.key === "Escape") {
        setMenu(null);
        if (creator.open) closeCreator();
      }
    };
    window.addEventListener("keydown", keyboard);
    return () => window.removeEventListener("keydown", keyboard);
  }, [closeCreator, creator.open, openCreator]);

  const panelNode = nodes.find((node) => node.id === panelNodeId) || null;

  return (
    <section className="n8n-canvas-root">
      <ReactFlow
        nodes={decoratedNodes}
        edges={decoratedEdges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onReconnect={onReconnect}
        onNodeClick={(_event, node) => { setSelectedNodeId(node.id); setMenu(null); }}
        onNodeDoubleClick={(_event, node) => { setPanelNodeId(node.id); setSelectedNodeId(node.id); }}
        onNodeContextMenu={(event, node) => { event.preventDefault(); setSelectedNodeId(node.id); setMenu({ kind: "node", id: node.id, x: event.clientX - 230, y: event.clientY - 96 }); }}
        onEdgeContextMenu={(event, edge) => { event.preventDefault(); setMenu({ kind: "edge", id: edge.id, x: event.clientX - 230, y: event.clientY - 96 }); }}
        onPaneContextMenu={(event) => { event.preventDefault(); setMenu({ kind: "pane", x: event.clientX - 230, y: event.clientY - 96 }); }}
        onPaneDoubleClick={(event) => openCreator({ position: screenToFlowPosition({ x: event.clientX, y: event.clientY }) })}
        onPaneClick={() => { setSelectedNodeId(null); setMenu(null); }}
        onNodesDelete={(deleted) => { const ids = new Set(deleted.map((node) => node.id)); setEdges((current) => current.filter((edge) => !ids.has(edge.source) && !ids.has(edge.target))); toast("Node removed"); }}
        onEdgesDelete={() => toast("Connection removed")}
        onConnectStart={(_event, params) => { connectStart.current = params; }}
        onConnectEnd={(event, state) => {
          const sourceId = connectStart.current?.nodeId;
          connectStart.current = null;
          if (state?.isValid || !sourceId || !("clientX" in event)) return;
          openCreator({ sourceId, position: screenToFlowPosition({ x: event.clientX, y: event.clientY }) });
        }}
        fitView
        fitViewOptions={{ padding: 0.22, duration: 500 }}
        minZoom={0.22}
        maxZoom={1.8}
        snapToGrid
        snapGrid={[GRID_SIZE, GRID_SIZE]}
        deleteKeyCode={["Backspace", "Delete"]}
        selectionKeyCode="Shift"
        multiSelectionKeyCode={["Meta", "Control"]}
        connectionLineType={ConnectionLineType.Bezier}
        defaultEdgeOptions={{ type: "flowcordia", reconnectable: true }}
        edgesReconnectable
        panOnDrag={mode === "pan" ? true : [1, 2]}
        selectionOnDrag={mode === "select"}
        panOnScroll
        zoomOnPinch
        colorMode="dark"
        proOptions={{ hideAttribution: true }}
      >
        <Background variant={BackgroundVariant.Dots} gap={GRID_SIZE} size={1.25} color="#3a3a42" />
        <MiniMap
          position="bottom-right"
          pannable
          zoomable
          nodeColor={(node) => toneColors[node.data.tone] || toneColors.blue}
          maskColor="rgba(18,18,20,.72)"
        />
        <Panel className="n8n-canvas-topbar" position="top-left">
          <div className="n8n-canvas-breadcrumb"><Icon name="Workflow" size={14} /><span>Editor</span><Icon name="ChevronRight" size={12} /><strong>Customer onboarding</strong></div>
          <span className="n8n-canvas-save-state"><Icon name="CloudCheck" size={13} />All changes saved</span>
        </Panel>
        <Panel className="n8n-canvas-run" position="bottom-center"><button onClick={() => toast("Workflow test started")}><Icon name="Play" size={15} />Test workflow</button></Panel>
        <CanvasControls mode={mode} setMode={setMode} onAdd={() => openCreator()} />
      </ReactFlow>

      <NodeCreator open={creator.open} catalog={catalog} onClose={closeCreator} onAdd={addCatalogNode} />
      <NodeDetails
        node={panelNode}
        catalog={catalog}
        onClose={() => setPanelNodeId(null)}
        onRun={() => runNode(panelNodeId)}
        onUpdate={(patch) => setNodes((current) => current.map((node) => node.id === panelNodeId ? { ...node, data: { ...node.data, ...patch } } : node))}
        onDelete={() => removeNode(panelNodeId)}
      />
      <CanvasContextMenu menu={menu} onAction={(action) => {
        const target = menu;
        setMenu(null);
        if (action === "add") openCreator();
        if (action === "fit") fitView({ padding: 0.22, duration: 420 });
        if (action === "open" && target?.id) setPanelNodeId(target.id);
        if (action === "run" && target?.id) runNode(target.id);
        if (action === "delete" && target?.id) removeNode(target.id);
        if (action === "delete-edge" && target?.id) removeEdge(target.id);
        if (action === "insert" && target?.id) openCreator({ edgeId: target.id });
        if (action === "disconnect" && target?.id) { setEdges((current) => current.filter((edge) => edge.source !== target.id && edge.target !== target.id)); toast("Node disconnected"); }
        if (action === "duplicate" && target?.id) {
          const source = nodes.find((node) => node.id === target.id);
          if (source) {
            const copyId = `${source.id}_${Date.now().toString().slice(-4)}`;
            setNodes((current) => [...current, { ...source, id: copyId, position: { x: source.position.x + 128, y: source.position.y + 128 }, selected: false, data: { ...source.data, label: `${source.data.label} copy` } }]);
            toast("Node duplicated");
          }
        }
      }} />
    </section>
  );
}
