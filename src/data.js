export const navGroups = [
  { items: [
    ["tasks", "Tasks", "Boxes"], ["runs", "Runs", "Activity"], ["sessions", "Sessions", "MessagesSquare", "New"]
  ]},
  { label: "Build", items: [
    ["studio", "Flowcordia Studio", "Workflow", "Beta"], ["proposals", "Proposals", "GitPullRequest"],
    ["prompts", "Prompts", "Sparkles", "New"], ["models", "Models", "Box"]
  ]},
  { label: "Observability", items: [
    ["logs", "Logs", "ScrollText", "Alpha"], ["errors", "Errors", "Bug"], ["query", "Query", "Code2"],
    ["queues", "Queues", "ListTree"], ["dashboards", "Dashboards", "ChartNoAxesCombined"]
  ]},
  { label: "Deployments", items: [
    ["deploys", "Deploys", "Rocket"], ["variables", "Environment variables", "KeyRound"],
    ["branches", "Preview branches", "GitFork"], ["regions", "Regions", "Globe2"]
  ]},
  { label: "Manage", items: [
    ["waitpoints", "Waitpoint tokens", "TimerReset"], ["alerts", "Alerts", "Bell"],
    ["api-keys", "API keys", "Key"], ["integrations", "Integrations", "Plug"],
    ["settings", "Project settings", "Settings2"]
  ]}
];

const badge = (label, tone = "neutral") => ({ label, tone });
const baseMetrics = (a, b, c, d) => [[a[0], a[1], a[2]], [b[0], b[1], b[2]], [c[0], c[1], c[2]], [d[0], d[1], d[2]]];
const page = (title, description, action, metrics, columns, rows) => ({ title, description, action, metrics, columns, rows });

export const pages = {
  tasks: page("Tasks", "Registered tasks from the current project and exact deployment.", "Create task",
    baseMetrics(["Registered","18","+3 this month"],["Deployed","16","2 draft-only"],["Healthy","15","93.8%"],["Active runs","7","Across 4 queues"]),
    ["Task","Status","Latest deploy","Runs (24h)","Updated"], [
      ["Customer onboarding",badge("Healthy","success"),"v42 · 0311fa33","248","2m ago"],
      ["Invoice approval",badge("Running","info"),"v18 · 256e584a","64","6m ago"],
      ["Lead qualification",badge("Healthy","success"),"v27 · d64037e2","1,842","13m ago"],
      ["Weekly operations report",badge("Idle"),"v9 · 7b678839","12","1h ago"],
      ["Production webhook intake",badge("Healthy","success"),"v15 · 19b595f1","3,914","2h ago"]
    ]),
  runs: page("Runs", "Execution history with exact task, version, queue, and result evidence.", "Trigger run",
    baseMetrics(["Runs today","8,491","+12.4%"],["Succeeded","8,312","97.9%"],["P95 duration","2.8s","-340ms"],["In progress","23","7 waiting"]),
    ["Run","Task","Status","Duration","Started"], [
      ["run_vt8e42","Customer onboarding",badge("Completed","success"),"1.8s","12s ago"],
      ["run_h4t2q9","Lead qualification",badge("Completed","success"),"842ms","41s ago"],
      ["run_93mav2","Invoice approval",badge("Waiting","warning"),"12m 14s","12m ago"],
      ["run_e8w21s","Production webhook intake",badge("Running","info"),"4.3s","4s ago"],
      ["run_8fa7k1","Account enrichment",badge("Failed","danger"),"18.2s","9m ago"]
    ]),
  sessions: page("Sessions", "Long-running AI and workflow sessions with durable conversation state.", "New session",
    baseMetrics(["Open","14","3 active now"],["Resolved today","38","+9%"],["Avg. turns","11.4","Across sessions"],["Tokens today","1.28M","$5.72 estimated"]),
    ["Session","Model","State","Turns","Updated"], [
      ["Support triage · Acme","gpt-5.6",badge("Active","info"),"18","Now"],
      ["Contract extraction · Northstar","claude-sonnet",badge("Completed","success"),"7","8m ago"],
      ["Lead research · Quartz","gpt-5.6",badge("Paused","warning"),"26","31m ago"],
      ["Incident summary · API outage","gpt-5.6",badge("Completed","success"),"12","1h ago"]
    ]),
  proposals: page("Proposals", "Governed workflow changes bound to exact Git commits and GitHub review.", "Open GitHub",
    baseMetrics(["Open","3","2 ready to review"],["Checks passing","2","1 building"],["Merged this week","11","+4"],["Avg. review","38m","-12m"]),
    ["Proposal","Workflow","State","Changes","Updated"], [
      ["#117 Add CRM enrichment branch","Customer onboarding",badge("Checks passing","success"),"+2 / ~1 / -0","5m ago"],
      ["#118 Tighten invoice approval","Invoice approval",badge("Review required","warning"),"+1 / ~3 / -0","17m ago"],
      ["#119 Queue policy update","Lead qualification",badge("Building","info"),"+0 / ~2 / -0","29m ago"],
      ["#116 Bind Beta recovery chain","Release acceptance",badge("Merged"),"+14 / ~8 / -2","3h ago"]
    ]),
  prompts: page("Prompts", "Versioned prompt definitions used by AI steps and agents.", "Create prompt",
    baseMetrics(["Prompts","24","19 production"],["Versions","91","4 draft"],["Evaluated","82%","+6%"],["Avg. latency","1.9s","P50"]),
    ["Prompt","Used by","Version","Evaluation","Updated"], [
      ["Lead qualification rubric","Lead qualification","v12",badge("94.2%","success"),"14m ago"],
      ["Support intent classifier","Support triage","v8",badge("91.8%","success"),"1h ago"],
      ["Invoice anomaly explanation","Invoice approval","v4",badge("Draft","warning"),"3h ago"],
      ["Weekly executive summary","Operations report","v17",badge("88.1%","info"),"Yesterday"]
    ]),
  models: page("Models", "Connected model providers, aliases, limits, and health.", "Add model",
    baseMetrics(["Connected","6","3 providers"],["Healthy","6","100%"],["Requests today","12,842","+18%"],["Spend today","$42.18","Within budget"]),
    ["Model","Provider","Health","Requests","P95"], [
      ["gpt-5.6","OpenAI",badge("Healthy","success"),"6,104","2.4s"],
      ["claude-sonnet","Anthropic",badge("Healthy","success"),"3,891","2.1s"],
      ["gemini-pro","Google",badge("Healthy","success"),"1,227","2.8s"],
      ["text-embedding-3-large","OpenAI",badge("Healthy","success"),"1,620","312ms"]
    ]),
  logs: page("Logs", "Structured logs across runs, workers, providers, and Flowcordia operations.", "Live tail",
    baseMetrics(["Events (1h)","184K","+9%"],["Warnings","128","0.07%"],["Errors","19","0.01%"],["Ingest delay","0.4s","Healthy"]),
    ["Timestamp","Level","Service","Message","Run"], [
      ["09:18:42.128",badge("INFO","info"),"run-engine","Checkpoint persisted after node completion","run_vt8e42"],
      ["09:18:41.903",badge("INFO","info"),"flowcordia","Workflow edge resolved: validate → condition","run_vt8e42"],
      ["09:18:39.540",badge("WARN","warning"),"provider-http","Upstream returned 429; retry scheduled in 2s","run_8fa7k1"],
      ["09:18:31.884",badge("ERROR","danger"),"provider-http","Bounded provider request exhausted retries","run_8fa7k1"]
    ]),
  errors: page("Errors", "Grouped failures with bounded context and recurrence trends.", "Create alert",
    baseMetrics(["Open groups","7","2 new"],["Affected runs","23","Past 24h"],["Resolved","14","This week"],["Error rate","0.21%","-0.04%"]),
    ["Error group","Service","Occurrences","Last seen","State"], [
      ["HTTP_PROVIDER_RETRY_EXHAUSTED","Account enrichment","11","9m ago",badge("Open","danger")],
      ["APPROVAL_TIMEOUT","Invoice approval","5","2h ago",badge("Investigating","warning")],
      ["QUEUE_TTL_EXPIRED","Lead qualification","4","5h ago",badge("Expected")],
      ["MODEL_RATE_LIMIT","Support triage","3","Yesterday",badge("Resolved","success")]
    ]),
  query: page("Query", "Explore runs and operational data with Trigger Query Language.", "Run query",
    baseMetrics(["Saved queries","12","4 shared"],["Queries today","87","3 users"],["Median time","142ms","P50"],["Rows scanned","2.8M","Today"]),
    ["Saved query","Scope","Rows","Duration","Last run"], [
      ["Failed provider calls","Production · 24h","19","183ms","2m ago"],
      ["Approval wait time","All environments · 7d","84","211ms","18m ago"],
      ["Queue saturation windows","Production · 30d","12","421ms","Yesterday"],
      ["Longest successful runs","Development · 24h","50","96ms","Yesterday"]
    ]),
  queues: page("Queues", "Concurrency, backlog, age, and worker ownership by queue.", "Configure queue",
    baseMetrics(["Queues","7","4 active"],["Backlog","38","-12"],["Oldest item","21s","Within target"],["Workers","12","11 healthy"]),
    ["Queue","State","Running","Waiting","Oldest"], [
      ["default",badge("Healthy","success"),"18 / 50","12","4s"],
      ["flowcordia-critical",badge("Healthy","success"),"6 / 20","0","—"],
      ["ai-sessions",badge("Busy","warning"),"18 / 20","24","21s"],
      ["reports",badge("Idle"),"0 / 5","2","7s"]
    ]),
  dashboards: page("Dashboards", "Operational health, run volume, failures, queues, and workflow activity.", "Create dashboard",
    baseMetrics(["Runs today","8,491","+12.4%"],["Success rate","97.9%","+0.3%"],["P95 duration","2.8s","-340ms"],["Active workers","11","1 unavailable"]), [], []),
  deploys: page("Deploys", "Immutable deployment history for each environment and exact revision.", "Deploy",
    baseMetrics(["Current version","v42","Production"],["Deploys this week","18","+5"],["Success rate","100%","Past 30d"],["Median deploy","1m 42s","-18s"]),
    ["Version","Environment","State","Commit","Deployed"], [
      ["v42","Production",badge("Current","success"),"af674704","3h ago"],
      ["v43-preview.2","Preview / PR #119",badge("Ready","info"),"0311fa33","29m ago"],
      ["v41","Production",badge("Superseded"),"256e584a","Yesterday"],
      ["v40","Staging",badge("Archived"),"d64037e2","2d ago"]
    ]),
  variables: page("Environment variables", "Write-only configuration and credential references for Development.", "Add variable",
    baseMetrics(["Variables","31","18 secret"],["Inherited","9","From project"],["Used by workflows","14","6 credentials"],["Last changed","2h","By Ahmad"]),
    ["Key","Value","Scope","Used by","Updated"], [
      ["CRM_API_TOKEN","••••••••••••••••",badge("Secret","warning"),"Customer onboarding","2h ago"],
      ["SLACK_BOT_TOKEN","••••••••••••••••",badge("Secret","warning"),"Approval notifications","Yesterday"],
      ["APP_BASE_URL","https://app.flowcordia.dev",badge("Plain"),"3 workflows","2d ago"],
      ["DEFAULT_QUEUE","flowcordia-critical",badge("Plain"),"Runtime policy","6d ago"]
    ]),
  branches: page("Preview branches", "Ephemeral environments bound to exact proposal heads.", "Configure previews",
    baseMetrics(["Active","3","All healthy"],["Building","1","PR #119"],["Expired today","4","Auto-cleaned"],["Median lifetime","2.4h","Past 30d"]),
    ["Branch","Pull request","State","Deployment","Expires"], [
      ["flowcordia/proposal-119","#119 Queue policy update",badge("Building","info"),"v43-preview.2","23h"],
      ["flowcordia/proposal-118","#118 Tighten invoice approval",badge("Ready","success"),"v43-preview.1","19h"],
      ["flowcordia/proposal-117","#117 CRM enrichment branch",badge("Ready","success"),"v42-preview.8","17h"]
    ]),
  regions: page("Regions", "Execution regions, worker capacity, and placement policy.", "Add region",
    baseMetrics(["Regions","3","All online"],["Workers","12","11 healthy"],["Capacity","68%","Across fleet"],["Cross-region runs","0","Policy blocked"]),
    ["Region","Status","Workers","Capacity","Latency"], [
      ["us-east-1",badge("Primary","success"),"6 / 6","71%","24ms"],
      ["eu-west-1",badge("Healthy","success"),"4 / 4","62%","31ms"],
      ["ap-south-1",badge("Attention","warning"),"1 / 2","69%","46ms"]
    ]),
  waitpoints: page("Waitpoint tokens", "Durable external completion tokens and their bounded state.", "Create token",
    baseMetrics(["Waiting","9","1 approval due"],["Completed today","84","+12%"],["Expired","3","Past 24h"],["Oldest","18m","Invoice approval"]),
    ["Token","Run","Type","State","Created"], [
      ["wpt_8c2a…","run_93mav2","Human approval",badge("Waiting","warning"),"12m ago"],
      ["wpt_02de…","run_m4x82a","Callback",badge("Waiting","info"),"4m ago"],
      ["wpt_190f…","run_p1aa09","Delay",badge("Completed","success"),"19m ago"],
      ["wpt_7ea1…","run_x89ks2","Human approval",badge("Expired","danger"),"3h ago"]
    ]),
  alerts: page("Alerts", "Operational alert channels, policies, and recent delivery state.", "Create alert",
    baseMetrics(["Policies","8","7 enabled"],["Channels","3","Email · Slack · Webhook"],["Sent today","14","All delivered"],["Open incidents","1","Provider latency"]),
    ["Alert","Trigger","Channels","State","Last fired"], [
      ["Workflow failure","Any production failure","Slack, Email",badge("Enabled","success"),"9m ago"],
      ["Approval escalation","Escalation due","Slack, Webhook",badge("Enabled","success"),"12m ago"],
      ["Queue saturation",">85% for 5m","Slack",badge("Enabled","success"),"Yesterday"],
      ["Worker unavailable","No heartbeat for 60s","Email, Webhook",badge("Muted"),"3d ago"]
    ]),
  "api-keys": page("API keys", "Project access keys for authenticated task triggers and SDK access.", "Create API key",
    baseMetrics(["Active keys","5","2 production"],["Requests today","22.4K","+8%"],["Last rotated","12d","Production key"],["Denied requests","18","0.08%"]),
    ["Name","Prefix","Environment","Last used","Created"], [
      ["Production API","tr_prod_91…",badge("Production","warning"),"Now","12d ago"],
      ["Development SDK","tr_dev_72…",badge("Development","info"),"3m ago","28d ago"],
      ["CI acceptance","tr_dev_19…",badge("Development","info"),"3h ago","7d ago"],
      ["Legacy integration","tr_prod_03…",badge("Restricted"),"19d ago","90d ago"]
    ]),
  integrations: page("Integrations", "Connected providers and project-level application integrations.", "Add integration",
    baseMetrics(["Connected","9","All healthy"],["Credentials","14","Write-only"],["Calls today","18.9K","+11%"],["Provider errors","0.03%","Within target"]),
    ["Integration","Purpose","Status","Workflows","Updated"], [
      ["GitHub","Workflow source and proposals",badge("Connected","success"),"4","Now"],
      ["Slack","Operational and approval alerts",badge("Connected","success"),"3","Yesterday"],
      ["Resend","Product and alert email",badge("Connected","success"),"2","3d ago"],
      ["Salesforce","Customer enrichment",badge("Connected","success"),"1","6d ago"]
    ]),
  settings: page("Project settings", "Project identity, access, retention, and workflow governance.", "Save changes",
    baseMetrics(["Members","6","2 admins"],["Environments","3","Development selected"],["Retention","30d","Run data"],["Audit events","1,842","Past 30d"]),
    ["Setting","Current value","Policy","Changed by","Updated"], [
      ["Project name","Flowcordia",badge("Editable","info"),"Ahmad Yar","14d ago"],
      ["Workflow proposal review","Required",badge("Enforced","success"),"System","30d ago"],
      ["Production promotion","Exact merged head",badge("Enforced","success"),"System","30d ago"],
      ["Run retention","30 days",badge("Editable","info"),"Ahmad Yar","21d ago"]
    ])
};

export const workflows = [
  ["customer_onboarding","Customer onboarding",8,8], ["lead_qualification","Lead qualification",7,7],
  ["invoice_approval","Invoice approval",9,9], ["weekly_operations_report","Weekly operations report",6,5],
  ["production_webhook_intake","Production webhook intake",5,4]
].map(([id,name,nodes,edges]) => ({ id, name, nodes, edges, sha: "af674704" }));

export const studioNodes = [
  ["trigger","trigger","API trigger","trigger.api",70,220,"emerald"],
  ["validate","action","Validate payload","data.map",365,220,"blue"],
  ["condition","control","Enterprise plan?","control.condition",660,220,"amber"],
  ["enrich","action","Enrich account","action.http",955,90,"blue"],
  ["approval","approval","Manager approval","approval.human",955,355,"orange"],
  ["subflow","subflow","Provision workspace","subflow.invoke",1240,90,"cyan"],
  ["notify","action","Send welcome email","action.email",1240,355,"violet"],
  ["output","output","Return onboarding state","output.return",1535,220,"pink"]
].map(([id,kind,name,operation,x,y,tone], index) => ({ id,kind,name,operation,x,y,tone,settings: index % 4 + 1,credentials:[3,6].includes(index)?1:0 }));

export const studioEdges = [
  ["trigger","validate"],["validate","condition"],["condition","enrich","true"],["condition","approval","false"],
  ["enrich","subflow"],["approval","notify"],["subflow","output"],["notify","output"]
];
