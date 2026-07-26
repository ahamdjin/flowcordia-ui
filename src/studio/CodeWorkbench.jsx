import React, { useCallback, useMemo, useRef, useState } from "react";
import Editor, { DiffEditor } from "@monaco-editor/react";
import { Icon } from "../ui";

function languageFor(path) {
  if (path.endsWith(".json")) return "json";
  if (path.endsWith(".md")) return "markdown";
  if (path.includes(".env")) return "plaintext";
  return "typescript";
}

function fileIcon(path) {
  if (path.endsWith(".json")) return "Braces";
  if (path.endsWith(".md")) return "FileText";
  if (path.startsWith(".")) return "FileKey";
  return "FileCode2";
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
  const [activeFile, setActiveFile] = useState(profile.source);
  const [mode, setMode] = useState("code");
  const [problems, setProblems] = useState([]);
  const [cursor, setCursor] = useState({ lineNumber: 1, column: 1 });

  const staticFiles = useMemo(() => ({
    [`workflows/${workflow.id}.schema.json`]: JSON.stringify({
      $schema: "https://flowcordia.dev/schema/workflow-0.5.json",
      id: workflow.id,
      version: "0.5",
      source: profile.source,
      governance: { reviewRequired: true, exactPreview: true },
    }, null, 2),
    "flowcordia.config.ts": `import { defineConfig } from "@flowcordia/sdk";\n\nexport default defineConfig({\n  project: "Flowcordia",\n  defaultQueue: "flowcordia-critical",\n  previewBranches: true,\n});\n`,
    ".env.example": "CRM_API_TOKEN=\nSLACK_BOT_TOKEN=\nAPP_BASE_URL=https://app.flowcordia.dev\n",
    "README.md": `# ${workflow.name}\n\nRepository-backed Flowcordia workflow. Edit visually or through its typed source.\n`,
  }), [profile.source, workflow.id, workflow.name]);

  const files = [
    profile.source,
    `workflows/${workflow.id}.schema.json`,
    "flowcordia.config.ts",
    ".env.example",
    "README.md",
  ];

  const editable = activeFile === profile.source;
  const value = editable ? code : staticFiles[activeFile] || "";
  const errors = problems.filter((problem) => problem.severity === 8);
  const warnings = problems.filter((problem) => problem.severity !== 8);

  const beforeMount = useCallback((monaco) => {
    monaco.editor.defineTheme("flowcordia-source", {
      base: "vs-dark",
      inherit: true,
      rules: [
        { token: "keyword", foreground: "C4B5FD" },
        { token: "string", foreground: "86EFAC" },
        { token: "number", foreground: "7DD3FC" },
        { token: "type.identifier", foreground: "93C5FD" },
        { token: "function", foreground: "FDE68A" },
        { token: "comment", foreground: "73737D" },
      ],
      colors: {
        "editor.background": "#111113",
        "editor.foreground": "#D7D7DC",
        "editorLineNumber.foreground": "#505059",
        "editorLineNumber.activeForeground": "#A5A5AE",
        "editorCursor.foreground": "#A5B4FC",
        "editor.selectionBackground": "#37385F",
        "editor.inactiveSelectionBackground": "#292A45",
        "editorIndentGuide.background1": "#25252A",
        "editorIndentGuide.activeBackground1": "#44466B",
        "editorWidget.background": "#1B1B1F",
        "editorSuggestWidget.background": "#1B1B1F",
        "editorSuggestWidget.border": "#34343B",
        "editorGutter.background": "#111113",
      },
    });

    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
      target: monaco.languages.typescript.ScriptTarget.ES2022,
      allowNonTsExtensions: true,
      strict: true,
      noEmit: true,
      moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
      module: monaco.languages.typescript.ModuleKind.ESNext,
    });

    monaco.languages.typescript.typescriptDefaults.addExtraLib(`declare module "@flowcordia/sdk" {
  export interface WorkflowRuntime { queue: string; retries: number; timeout: string; }
  export function defineWorkflow(input: { id: string; version: string; nodes: Record<string, unknown>; edges: unknown[]; runtime: WorkflowRuntime }): unknown;
  export function node(operation: string, config: { name: string }): unknown;
  export function connect(source: string, target: string, config?: { when?: string }): unknown;
}`, "file:///node_modules/@flowcordia/sdk/index.d.ts");
  }, []);

  const onMount = useCallback((editor) => {
    editorRef.current = editor;
    editor.onDidChangeCursorPosition((event) => setCursor(event.position));
  }, []);

  const validate = () => {
    if (!editable) {
      toast("Reference file opened in read-only mode");
      return;
    }
    if (errors.length) toast(`${errors.length} source error${errors.length === 1 ? "" : "s"} found`);
    else if (warnings.length) toast(`${warnings.length} source warning${warnings.length === 1 ? "" : "s"} found`);
    else toast("Source validation passed");
  };

  const applyToCanvas = () => {
    setDirty(false);
    toast("Source marked as synchronized with canvas");
  };

  return (
    <section className="flow-source-editor">
      <header className="flow-source-header">
        <div className="flow-source-title">
          <span><Icon name="Code2" size={18} /></span>
          <div><small>Workflow source</small><strong>{workflow.name}</strong></div>
        </div>

        <div className={`flow-source-sync ${dirty ? "dirty" : ""}`}>
          <Icon name={dirty ? "CircleDot" : "CloudCheck"} size={14} />
          <span>{dirty ? "Unsaved source changes" : "Canvas and source are synced"}</span>
        </div>

        <div className="flow-source-actions">
          <button onClick={onCanvas}><Icon name="Workflow" size={14} />Canvas</button>
          <button onClick={validate}><Icon name="CircleCheckBig" size={14} />Validate</button>
          <button onClick={applyToCanvas} disabled={!editable || !dirty}><Icon name="RefreshCw" size={14} />Apply to canvas</button>
          <button className="primary-button" onClick={onReview}><Icon name="GitPullRequest" size={14} />Review changes</button>
        </div>
      </header>

      <div className="flow-source-body">
        <aside className="flow-source-files">
          <header><span>Files</span><small>{files.length}</small></header>
          <div>
            {files.map((file) => (
              <button className={activeFile === file ? "active" : ""} key={file} onClick={() => { setActiveFile(file); setMode("code"); }}>
                <Icon name={fileIcon(file)} size={15} />
                <span>{file}</span>
                {file === profile.source && dirty && <i>Modified</i>}
              </button>
            ))}
          </div>
          <footer>
            <div><Icon name="GitBranch" size={14} /><span><small>Repository</small><strong>main</strong></span></div>
            <a href={sourceUrl} target="_blank" rel="noreferrer"><Icon name="Github" size={14} />Open in GitHub<Icon name="ExternalLink" size={12} /></a>
          </footer>
        </aside>

        <main className="flow-source-main">
          <header className="flow-source-filebar">
            <div><Icon name={fileIcon(activeFile)} size={14} /><span>{activeFile}</span>{editable && dirty && <i>Modified</i>}</div>
            <nav>
              <button className={mode === "code" ? "active" : ""} onClick={() => setMode("code")}>Code</button>
              <button className={mode === "diff" ? "active" : ""} onClick={() => setMode("diff")} disabled={!editable}>Changes</button>
            </nav>
          </header>

          <div className="flow-source-canvas">
            {mode === "diff" && editable ? (
              <DiffEditor
                original={originalCode}
                modified={code}
                language="typescript"
                theme="flowcordia-source"
                beforeMount={beforeMount}
                onMount={(editor) => { editorRef.current = editor.getModifiedEditor(); }}
                options={{
                  automaticLayout: true,
                  renderSideBySide: true,
                  originalEditable: false,
                  fontSize: 13,
                  lineHeight: 22,
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  padding: { top: 18, bottom: 18 },
                }}
              />
            ) : (
              <Editor
                path={`file:///workspace/${activeFile}`}
                language={languageFor(activeFile)}
                theme="flowcordia-source"
                value={value}
                beforeMount={beforeMount}
                onMount={onMount}
                onValidate={(markers) => { if (editable) setProblems(markers); }}
                onChange={(next) => { if (editable) { setCode(next || ""); setDirty(true); } }}
                loading={<div className="flow-source-loading"><Icon name="LoaderCircle" size={18} />Loading source editor…</div>}
                options={{
                  automaticLayout: true,
                  readOnly: !editable,
                  fontSize: 13,
                  lineHeight: 22,
                  fontFamily: "SFMono-Regular, Consolas, Liberation Mono, Menlo, monospace",
                  fontLigatures: true,
                  minimap: { enabled: true, scale: 1, showSlider: "mouseover" },
                  padding: { top: 18, bottom: 18 },
                  smoothScrolling: true,
                  cursorSmoothCaretAnimation: "on",
                  bracketPairColorization: { enabled: true },
                  guides: { bracketPairs: true, indentation: true },
                  scrollBeyondLastLine: false,
                  renderWhitespace: "selection",
                  stickyScroll: { enabled: true },
                  tabSize: 2,
                  wordWrap: "off",
                }}
              />
            )}
          </div>

          <footer className="flow-source-footer">
            <div>
              <span className={errors.length ? "error" : ""}><Icon name={errors.length ? "CircleX" : "CircleCheckBig"} size={13} />{errors.length ? `${errors.length} errors` : "No errors"}</span>
              {!!warnings.length && <span className="warning"><Icon name="TriangleAlert" size={13} />{warnings.length} warnings</span>}
            </div>
            <div><span>Ln {cursor.lineNumber}, Col {cursor.column}</span><span>Spaces: 2</span><span>{languageFor(activeFile)}</span></div>
          </footer>
        </main>
      </div>
    </section>
  );
}
