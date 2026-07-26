import React, { useState } from "react";
import { navGroups, pages } from "./data";
import { Icon } from "./ui";

const environments = [
  ["Development", "DEV", "development"],
  ["Staging", "STG", "staging"],
  ["Production", "PRD", "production"]
];

export function Sidebar({ route, collapsed, onToggle, onNavigate }) {
  const [environment, setEnvironment] = useState(environments[0]);
  const [environmentOpen, setEnvironmentOpen] = useState(false);
  const [openGroups, setOpenGroups] = useState(() => Object.fromEntries(navGroups.map((group, index) => [group.label ?? `root-${index}`, true])));

  return (
    <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <button className="collapse-button" onClick={onToggle} aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}>
        <Icon name={collapsed ? "PanelLeftOpen" : "PanelLeftClose"} size={15} />
      </button>
      <button className="project-switcher">
        <span className="project-avatar">F</span>
        <span className="project-copy"><strong>Flowcordia</strong><small>ahamdjin / Flowcordia</small></span>
        <Icon name="ChevronsUpDown" size={14} />
      </button>
      <div className="sidebar-scroll">
        <div className="environment-block">
          <span className="sidebar-kicker">Environment</span>
          <button className="environment-button" onClick={() => setEnvironmentOpen((value) => !value)}>
            <i className={`environment-dot ${environment[2]}`} />
            <span className="environment-name">{environment[0]}</span>
            <small>{environment[1]}</small>
            <Icon name="ChevronDown" size={14} />
          </button>
          {environmentOpen && <div className="environment-menu">
            {environments.map((item) => <button key={item[0]} onClick={() => { setEnvironment(item); setEnvironmentOpen(false); }}>
              <i className={`environment-dot ${item[2]}`} /><span>{item[0]}</span><small>{item[1]}</small>
            </button>)}
          </div>}
        </div>
        <nav className="navigation">
          {navGroups.map((group, index) => {
            const key = group.label ?? `root-${index}`;
            const open = openGroups[key];
            return <section className="nav-group" key={key}>
              {group.label && <button className="nav-group-title" onClick={() => setOpenGroups((current) => ({ ...current, [key]: !open }))}>
                <span>{group.label}</span><Icon name={open ? "ChevronDown" : "ChevronRight"} size={13} />
              </button>}
              {(open || !group.label) && <div className="nav-group-items">
                {group.items.map(([id, label, icon, badge]) => <button key={id} className={`nav-item ${route === id ? "active" : ""}`} onClick={() => onNavigate(id)} title={collapsed ? label : undefined}>
                  <Icon name={icon} size={17} /><span className="nav-label">{label}</span>{badge && <span className="nav-badge">{badge}</span>}
                </button>)}
              </div>}
            </section>;
          })}
        </nav>
      </div>
      <footer className="sidebar-footer">
        <button><Icon name="CircleHelp" size={17} /><span>Help & feedback</span></button>
        <button className="account-button"><i>AY</i><span><strong>Ahmad Yar</strong><small>Personal workspace</small></span><Icon name="Ellipsis" size={15} /></button>
      </footer>
    </aside>
  );
}

export function Topbar({ route, onNavigate, onMobileMenu }) {
  const title = route === "studio" ? "Flowcordia Studio" : pages[route]?.title ?? "Flowcordia";
  return <header className="topbar">
    <div className="topbar-left">
      <button className="mobile-menu" onClick={onMobileMenu}><Icon name="Menu" size={18} /></button>
      <strong>{title}</strong><button className="topbar-help" title="Repository-backed workflows with durable visual drafts before Git review.">?</button>
    </div>
    <div className="topbar-actions">
      <span className="repository-badge"><Icon name="GitBranch" size={13} />Repository workflows</span>
      {route === "studio" && <><button onClick={() => window.dispatchEvent(new CustomEvent("flowcordia:source"))}><Icon name="Code2" size={14} />Source</button><button onClick={() => onNavigate("proposals")}>Proposals</button></>}
      <button onClick={() => window.location.reload()}><Icon name="RefreshCw" size={14} />Refresh</button>
      <button className="agent-launcher"><Icon name="Sparkles" size={15} /></button>
    </div>
  </header>;
}
