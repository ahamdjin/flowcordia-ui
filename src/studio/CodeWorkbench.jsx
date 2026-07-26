import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Editor, { DiffEditor } from "@monaco-editor/react";
import { Icon } from "../ui";

const activities = [
  ["explorer", "Files", "Files"],
  ["search", "Search", "Search"],
  ["source", "Source control", "GitBranch"],
  ["run", "Run and debug", "PlayCircle"],
  ["extensions", "Extensions", "Blocks"],
];

function languageFor(path) {
  if (path.endsWith(".json")) return "json";
  if (path.endsWith(".env") || path.includes(".env")) return "plaintext";
  if (path.endsWith(".md")) return "markdown";
  return "typescript";
}

function fileIcon(path) {
  if (path.endsWith(".json")) return "Braces";
  if (path.endsWith(".md")) return "FileText";
  if (path.startsWith(".")) return "FileKey";
  return "FileCode2";
}

function Explorer({ files, activeFile, dirty, onOpen }) {
  return (
    <>
      <header className="wb-side-header"><span>EXPLORER</span><button><Icon name="Ellipsis" size={15} /></button></header>
      <div className="wb-side-title"><strong>FLOWCORDIA</strong><span><Icon name="FilePlus2" size={14} /><Icon name="FolderPlus" size={14} /><Icon name="RefreshCw" size={14} /></span></div>
      <div className="wb-tree">
        <button className="wb-tree-folder open"><Icon name="ChevronDown" size={13} /><Icon name="FolderOpen" size={15} /><span>workflows</span></button>
        <div className="wb-tree-children">
          {files.filter((file) => file.startsWith("workflows/")).map((file) => <button className={activeFile === file ? "active" : ""} key={file} onClick={() => onOpen(file)}><Icon name={fileIcon(file)} size={14} /><span>{file.split("/").pop()}</span>{dirty && activeFile === file && <i>M</i>}</button>)}
        </div>
        {files.filter((file) => !file.startsWith("workflows/")).map((file) => <button className={activeFile === file ? "active" : ""} key={file} onClick={() => onOpen(file)}><span className="wb-tree-indent" /><Icon name={fileIcon(file)} size={14} /><span>{file}</span></button>)}
      </div>
      <div className="wb-collapsed-sections"><button><Icon name="ChevronRight" size={13} />OUTLINE</button><button><Icon name="ChevronRight" size={13} />TIMELINE</button></div>
    </>
  );
}

function SearchPanel({ files, onOpen }) {
  const [query, setQuery] = useState("customer");
  return <><header className="wb-side-header"><span>SEARCH</span><button><Icon name="Ellipsis" size={15} /></button></header><div className="wb-search-box"><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search" /><span><Icon name="CaseSensitive" size={14} /><Icon name="WholeWord" size={14} /><Icon name="Regex" size={14} /></span></div><div className="wb-search-summary">3 results in 2 files</div><div className="wb-search-results">{files.slice(0, 2).map((file, index) => <section key={file}><button onClick={() => onOpen(file)}><Icon name="ChevronDown" size={12} /><Icon name={fileIcon(file)} size={14} /><strong>{file.split("/").pop()}</strong><small>{index + 1}</small></button><p><mark>{query}</mark>{index ? "Id" : " onboarding"}</p></section>)}</div></>;
}

function SourceControl({ dirty, onReview }) {
  return <><header className="wb-side-header"><span>SOURCE CONTROL</span><button><Icon name="Ellipsis" size={15} /></button></header><div className="wb-scm"><textarea placeholder="Message (Ctrl+Enter to commit)" defaultValue="Update customer onboarding workflow" /><button className="primary-button" onClick={onReview}><Icon name="GitPullRequest" size={14} />Review changes</button><section><header><Icon name="ChevronDown" size={13} /><strong>Changes</strong><small>{dirty ? 1 : 0}</small></header>{dirty && <button><Icon name="FileCode2" size={14} /><span>customer-onboarding.ts</span><i>M</i></button>}</section></div></>;
}

function RunPanel({ onCanvas }) {
  return <><header className="wb-side-header"><span>RUN AND DEBUG</span><button><Icon name="Ellipsis" size={15} /></button></header><div className="wb-run-panel"><span><Icon name="PlayCircle" size={28} /></span><strong>Run workflow source</strong><p>Return to the canvas or execute the generated workflow against demo data.</p><button className="primary-button" onClick={onCanvas}><Icon name="Workflow" size={14} />Open canvas</button><button><Icon name="Bug" size={14} />Start debugging</button></div></>;
}

function ExtensionsPanel() {
  return <><header className="wb-side-header"><span>EXTENSIONS</span><button><Icon name="Ellipsis" size={15} /></button></header><label className="wb-extension-search"><Icon name="Search" size={14} /><input placeholder="Search extensions" /></label><div className="wb-extensions">{[["ESLint","Microsoft","Braces"],["Prettier","Prettier","WandSparkles"],["GitLens","GitKraken","GitBranch"],["Flowcordia Tools","Flowcordia","Workflow"]].map(([name,publisher,icon]) => <button key={name}><i><Icon name={icon} size={20} /></i><span><strong>{name}</strong><small>{publisher}</small><p>Enabled for this workspace</p></span><Icon name="Settings2" size={13} /></button>)}</div></>;
}

function SidePanel({ activity, ...props }) {
  return <aside className="wb-sidebar">{activity === "explorer" && <Explorer {...props} />}{activity === "search" && <SearchPanel {...props} />}{activity === "source" && <SourceControl {...props} />}{activity === "run" && <RunPanel {...props} />}{activity === "extensions" && <ExtensionsPanel />}</aside>;
}

function BottomPanel({ open, tab, setTab, problems, onToggle }) {
  if (!open) return null;
  return <section className="wb-bottom-panel"><header><nav>{["problems","output","terminal"].map((item) => <button className={tab === item ? "active" : ""} key={item} onClick={() => setTab(item)}>{item}{item === "problems" && <span>{problems.length}</span>}</button>)}</nav><span><button><Icon name="PanelBottomOpen" size={14} /></button><button onClick={onToggle}><Icon name="X" size={14} /></button></span></header><div>{tab === "problems" && (problems.length ? <div className="wb-problems">{problems.map((problem, index) => <button key={index}><Icon name={problem.severity === 8 ? "CircleX" : "TriangleAlert"} size={14} /><span>{problem.message}</span><code>Ln {problem.startLineNumber}, Col {problem.startColumn}</code></button>)}</div> : <div className="wb-empty-panel"><Icon name="CircleCheckBig" size={18} />No problems detected in the workflow source.</div>)}{tab === "output" && <pre className="wb-output">[Flowcordia] workflow compiler ready{"\n"}[Source] customer-onboarding.ts synchronized with canvas{"\n"}[Types] @flowcordia/sdk declarations loaded{"\n"}[Preview] exact deployment v43-preview.2 available</pre>}{tab === "terminal" && <div className="wb-terminal"><p><span>ahmad@flowcordia</span>:<b>~/workflows</b>$ npm run workflow:check customer_onboarding</p><p className="success">✓ 8 nodes · 8 edges · schema 0.5 · no problems</p><p><span>ahmad@flowcordia</span>:<b>~/workflows</b>$ <i /></p></div>}</div></section>;
}

function CommandPalette({ open, onClose, commands }) {
  const [query, setQuery] = useState("");
  useEffect(() => { if (!open) setQuery(""); }, [open]);
  if (!open) return null;
  const filtered = commands.filter((command) => command.label.toLowerCase().includes(query.toLowerCase()));
  return <div className="wb-command-scrim" onMouseDown={onClose}><section className="wb-command-palette" onMouseDown={(event) => event.stopPropagation()}><label><Icon name="ChevronRight" size={16} /><input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Type the name of a command" /></label><div>{filtered.map((command, index) => <button className={index === 0 ? "active" : ""} key={command.label} onClick={() => { command.action(); onClose(); }}><Icon name={command.icon} size={15} /><span>{command.label}</span>{command.key && <kbd>{command.key}</kbd>}</button>)}</div></section></div>;
}

export default function CodeWorkbench({
  workflow,
  profile,
  code,
  originalCode,
  setCode,
  dirty,
  setDirty,
  onCanvas,
  onReview,
  toast,
  sourceUrl,
}) {
  const editorRef = useRef(null);
  const [activity, setActivity] = useState("explorer");
  const [activeFile, setActiveFile] = useState(profile.source);
  const [openFiles, setOpenFiles] = useState([profile.source]);
  const [editorMode, setEditorMode] = useState("code");
  const [bottomOpen, setBottomOpen] = useState(true);
  const [bottomTab, setBottomTab] = useState("problems");
  const [problems, setProblems] = useState([]);
  const [commandOpen, setCommandOpen] = useState(false);
  const [cursor, setCursor] = useState({ lineNumber: 1, column: 1 });

  const staticFiles = useMemo(() => ({
    [`workflows/${workflow.id}.schema.json`]: JSON.stringify({ $schema: "https://flowcordia.dev/schema/workflow-0.5.json", id: workflow.id, version: "0.5", source: profile.source, governance: { reviewRequired: true, exactPreview: true } }, null, 2),
    "flowcordia.config.ts": `import { defineConfig } from "@flowcordia/sdk";\n\nexport default defineConfig({\n  project: "Flowcordia",\n  defaultQueue: "flowcordia-critical",\n  previewBranches: true,\n});\n`,
    ".env.example": "CRM_API_TOKEN=\nSLACK_BOT_TOKEN=\nAPP_BASE_URL=https://app.flowcordia.dev\n",
    "README.md": `# ${workflow.name}\n\nRepository-backed Flowcordia workflow. Edit visually or through the typed source file.\n`,
  }), [profile.source, workflow.id, workflow.name]);
  const files = [profile.source, `workflows/${workflow.id}.schema.json`, "flowcordia.config.ts", ".env.example", "README.md"];
  const value = activeFile === profile.source ? code : staticFiles[activeFile] || "";
  const editable = activeFile === profile.source;

  const openFile = useCallback((file) => {
    setActiveFile(file);
    setOpenFiles((current) => current.includes(file) ? current : [...current, file]);
  }, []);
  const closeFile = useCallback((file) => {
    setOpenFiles((current) => {
      const next = current.filter((item) => item !== file);
      if (activeFile === file) setActiveFile(next[next.length - 1] || profile.source);
      return next.length ? next : [profile.source];
    });
  }, [activeFile, profile.source]);

  const beforeMount = useCallback((monaco) => {
    monaco.editor.defineTheme("flowcordia-workbench", {
      base: "vs-dark",
      inherit: true,
      rules: [
        { token: "keyword", foreground: "C586C0" },
        { token: "string", foreground: "CE9178" },
        { token: "number", foreground: "B5CEA8" },
        { token: "type.identifier", foreground: "4EC9B0" },
        { token: "function", foreground: "DCDCAA" },
      ],
      colors: {
        "editor.background": "#1e1e1e",
        "editor.foreground": "#d4d4d4",
        "editorLineNumber.foreground": "#858585",
        "editorLineNumber.activeForeground": "#c6c6c6",
        "editorCursor.foreground": "#aeafad",
        "editor.selectionBackground": "#264f78",
        "editor.inactiveSelectionBackground": "#3a3d41",
        "editorIndentGuide.background1": "#404040",
        "editorIndentGuide.activeBackground1": "#707070",
        "editorBracketMatch.background": "#0064001a",
        "editorBracketMatch.border": "#888888",
        "editorGutter.background": "#1e1e1e",
        "editorWidget.background": "#252526",
        "editorSuggestWidget.background": "#252526",
        "editorSuggestWidget.border": "#454545",
      },
    });
    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({ target: monaco.languages.typescript.ScriptTarget.ES2022, allowNonTsExtensions: true, strict: true, noEmit: true, moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs, module: monaco.languages.typescript.ModuleKind.ESNext });
    monaco.languages.typescript.typescriptDefaults.addExtraLib(`declare module "@flowcordia/sdk" {\n  export interface WorkflowRuntime { queue: string; retries: number; timeout: string; }\n  export function defineWorkflow(input: { id: string; version: string; nodes: Record<string, unknown>; edges: unknown[]; runtime: WorkflowRuntime }): unknown;\n  export function node(operation: string, config: { name: string }): unknown;\n  export function connect(source: string, target: string, config?: { when?: string }): unknown;\n}`, "file:///node_modules/@flowcordia/sdk/index.d.ts");
  }, []);

  const onMount = useCallback((editor, monaco) => {
    editorRef.current = editor;
    editor.onDidChangeCursorPosition((event) => setCursor(event.position));
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyP, () => setCommandOpen(true));
  }, []);

  useEffect(() => {
    const shortcuts = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "p") { event.preventDefault(); setCommandOpen(true); }
      if (event.key === "Escape") setCommandOpen(false);
    };
    window.addEventListener("keydown", shortcuts);
    return () => window.removeEventListener("keydown", shortcuts);
  }, []);

  const commands = [
    { label: "Flowcordia: Open visual canvas", icon: "Workflow", key: "⌘1", action: onCanvas },
    { label: "Flowcordia: Review workflow changes", icon: "GitPullRequest", action: onReview },
    { label: "View: Toggle bottom panel", icon: "PanelBottom", key: "⌘J", action: () => setBottomOpen((current) => !current) },
    { label: "View: Show Explorer", icon: "Files", key: "⇧⌘E", action: () => setActivity("explorer") },
    { label: "Editor: Format document", icon: "AlignLeft", key: "⇧⌥F", action: () => editorRef.current?.getAction("editor.action.formatDocument")?.run() },
    { label: "Editor: Show source diff", icon: "GitCompare", action: () => setEditorMode("diff") },
  ];

  return (
    <section className="code-workbench">
      <div className="wb-titlebar">
        <nav><button><Icon name="Menu" size={14} /></button><button>File</button><button>Edit</button><button>Selection</button><button>View</button><button>Go</button><button>Run</button></nav>
        <button className="wb-command-trigger" onClick={() => setCommandOpen(true)}><Icon name="Search" size={13} /><span>{workflow.name} — Flowcordia</span><kbd>⌘P</kbd></button>
        <div><span className={`wb-sync ${dirty ? "dirty" : ""}`}><Icon name={dirty ? "CircleDot" : "CloudCheck"} size={13} />{dirty ? "Modified" : "Canvas synced"}</span><a href={sourceUrl} target="_blank" rel="noreferrer"><Icon name="Github" size={14} /></a></div>
      </div>

      <div className="wb-main">
        <aside className="wb-activitybar">
          <div>{activities.map(([id, label, icon]) => <button title={label} className={activity === id ? "active" : ""} key={id} onClick={() => setActivity(id)}><Icon name={icon} size={22} /></button>)}</div>
          <div><button title="Accounts"><Icon name="CircleUserRound" size={21} /></button><button title="Manage"><Icon name="Settings" size={21} /></button></div>
        </aside>
        <SidePanel activity={activity} files={files} activeFile={activeFile} dirty={dirty} onOpen={openFile} onReview={onReview} onCanvas={onCanvas} />

        <main className="wb-editor-group">
          <header className="wb-tabs">
            <div>{openFiles.map((file) => <button className={activeFile === file ? "active" : ""} key={file} onClick={() => setActiveFile(file)}><Icon name={fileIcon(file)} size={13} /><span>{file.split("/").pop()}</span>{file === profile.source && dirty && <i>●</i>}<b onClick={(event) => { event.stopPropagation(); closeFile(file); }}><Icon name="X" size={12} /></b></button>)}</div>
            <span><button className={editorMode === "code" ? "active" : ""} onClick={() => setEditorMode("code")}><Icon name="FileCode2" size={14} /></button><button className={editorMode === "diff" ? "active" : ""} onClick={() => setEditorMode("diff")} disabled={!editable}><Icon name="GitCompare" size={14} /></button><button onClick={() => setBottomOpen((current) => !current)}><Icon name="PanelBottom" size={14} /></button></span>
          </header>
          <div className="wb-breadcrumbs"><Icon name="FolderOpen" size={13} /><span>Flowcordia</span><Icon name="ChevronRight" size={12} />{activeFile.split("/").map((part, index) => <React.Fragment key={`${part}-${index}`}><span>{part}</span>{index < activeFile.split("/").length - 1 && <Icon name="ChevronRight" size={12} />}</React.Fragment>)}<Icon name="Braces" size={12} /><span>default</span></div>
          <section className={`wb-editor-area ${bottomOpen ? "with-panel" : ""}`}>
            <div className="wb-monaco">
              {editorMode === "diff" && editable ? (
                <DiffEditor
                  original={originalCode}
                  modified={code}
                  language="typescript"
                  theme="flowcordia-workbench"
                  beforeMount={beforeMount}
                  onMount={(editor) => { editorRef.current = editor.getModifiedEditor(); }}
                  options={{ automaticLayout: true, renderSideBySide: true, originalEditable: false, fontSize: 13, lineHeight: 21, minimap: { enabled: false }, scrollBeyondLastLine: false, padding: { top: 12 }, wordWrap: "off" }}
                />
              ) : (
                <Editor
                  path={`file:///workspace/${activeFile}`}
                  language={languageFor(activeFile)}
                  theme="flowcordia-workbench"
                  value={value}
                  beforeMount={beforeMount}
                  onMount={onMount}
                  onValidate={(markers) => { if (editable) setProblems(markers); }}
                  onChange={(next) => { if (editable) { setCode(next || ""); setDirty(true); } }}
                  loading={<div className="wb-editor-loading"><Icon name="LoaderCircle" size={18} />Starting Monaco language services…</div>}
                  options={{
                    automaticLayout: true,
                    readOnly: !editable,
                    fontSize: 13,
                    lineHeight: 21,
                    fontFamily: "SFMono-Regular, Consolas, Liberation Mono, Menlo, monospace",
                    fontLigatures: true,
                    minimap: { enabled: true, scale: 1, showSlider: "mouseover" },
                    padding: { top: 12, bottom: 12 },
                    smoothScrolling: true,
                    cursorSmoothCaretAnimation: "on",
                    bracketPairColorization: { enabled: true, independentColorPoolPerBracketType: true },
                    guides: { bracketPairs: true, bracketPairsHorizontal: true, indentation: true, highlightActiveIndentation: true },
                    scrollBeyondLastLine: false,
                    renderWhitespace: "selection",
                    renderLineHighlight: "all",
                    stickyScroll: { enabled: true },
                    tabSize: 2,
                    wordWrap: "off",
                    quickSuggestions: { other: true, comments: false, strings: true },
                  }}
                />
              )}
            </div>
            <BottomPanel open={bottomOpen} tab={bottomTab} setTab={setBottomTab} problems={problems} onToggle={() => setBottomOpen(false)} />
          </section>
        </main>

        <aside className="wb-outline">
          <header><span>OUTLINE</span><button><Icon name="Ellipsis" size={14} /></button></header>
          <label><Icon name="Search" size={13} /><input placeholder="Filter" /></label>
          <div>{[["default","Variable"],["nodes","Object"],["edges","Array"],["runtime","Object"],["queue","Property"],["retries","Property"],["timeout","Property"]].map(([name,type], index) => <button key={name} style={{ paddingLeft: `${10 + Math.min(index, 4) * 10}px` }}><Icon name={type === "Object" ? "Box" : type === "Array" ? "List" : type === "Property" ? "Wrench" : "Variable"} size={13} /><span>{name}</span></button>)}</div>
        </aside>
      </div>

      <footer className="wb-statusbar">
        <div><span><Icon name="GitBranch" size={12} />main*</span><span><Icon name="RefreshCw" size={12} /></span><span><Icon name="CircleX" size={12} />{problems.filter((problem) => problem.severity === 8).length}<Icon name="TriangleAlert" size={12} />{problems.filter((problem) => problem.severity !== 8).length}</span></div>
        <div><button onClick={onCanvas}><Icon name="Workflow" size={12} />Canvas</button><button onClick={() => { setDirty(false); toast("Source marked as synchronized"); }}><Icon name="RefreshCw" size={12} />Apply to canvas</button><button onClick={onReview}><Icon name="GitPullRequest" size={12} />Review</button><span>Ln {cursor.lineNumber}, Col {cursor.column}</span><span>Spaces: 2</span><span>UTF-8</span><span>{languageFor(activeFile) === "typescript" ? "TypeScript React" : languageFor(activeFile)}</span><span><Icon name="Bell" size={12} /></span></div>
      </footer>
      <CommandPalette open={commandOpen} onClose={() => setCommandOpen(false)} commands={commands} />
    </section>
  );
}
