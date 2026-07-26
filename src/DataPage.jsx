import React, { useMemo, useState } from "react";
import { Icon, StatusPill } from "./ui";

function Metric({ item }) {
  return <div className="metric-card"><span>{item[0]}</span><strong>{item[1]}</strong><small>{item[2]}</small></div>;
}

function Dashboard() {
  const bars = [44,58,52,73,69,81,76,88,63,94,86,78,92,85,98,89,96,91,100,93,87,96,82,91];
  return <div className="dashboard-grid">
    <section className="chart-card wide"><header><div><strong>Runs and failures</strong><span>Past 24 hours</span></div><span className="trend">+12.4%</span></header>
      <div className="bar-chart">{bars.map((height, index) => <div key={index}><span style={{height:`${height}%`}} /><i style={{height:`${Math.max(3,height*.07)}%`}} /></div>)}</div>
      <div className="chart-axis"><span>09:00</span><span>13:00</span><span>17:00</span><span>21:00</span><span>Now</span></div>
    </section>
    <section className="chart-card"><header><div><strong>Success rate</strong><span>All environments</span></div></header><div className="donut-wrap"><div className="donut"><strong>97.9%</strong><span>Successful</span></div></div><div className="legend"><span><i className="green" />Succeeded 8,312</span><span><i className="red" />Failed 179</span></div></section>
    <section className="chart-card"><header><div><strong>Queue health</strong><span>Current</span></div></header><div className="queue-bars">
      {[['default','36%','18 / 50'],['ai-sessions','90%','18 / 20'],['critical','30%','6 / 20'],['reports','8%','0 / 5']].map(([name,width,value],index) => <label key={name}><span>{name}</span><b><i className={index===1?'warning':''} style={{width}} /></b><small>{value}</small></label>)}
    </div></section>
    <section className="chart-card wide"><header><div><strong>Recent workflow activity</strong><span>Exact production tasks</span></div><button>View runs</button></header><div className="activity-list">
      {[['Customer onboarding','Completed successfully','1.8s'],['Production webhook intake','Completed successfully','842ms'],['Lead qualification','Completed successfully','2.4s'],['Invoice approval','Waiting for approval','12m']].map(([name,state,time],index) => <div key={name}><i className={index===3?'waiting':'success'} /><strong>{name}</strong><span>{state}</span><code>{time}</code></div>)}
    </div></section>
  </div>;
}

export default function DataPage({ page }) {
  const [query, setQuery] = useState("");
  const [range, setRange] = useState("24 hours");
  const rows = useMemo(() => page.rows.filter((row) => row.some((cell) => String(cell?.label ?? cell).toLowerCase().includes(query.toLowerCase()))), [page.rows, query]);
  return <main className="page-scroll">
    <div className="page-heading"><div><h1>{page.title}</h1><p>{page.description}</p></div><button className="primary-button"><Icon name="Plus" size={15} />{page.action}</button></div>
    <div className="metrics-grid">{page.metrics.map((item) => <Metric key={item[0]} item={item} />)}</div>
    {page.title === "Dashboards" ? <Dashboard /> : <section className="data-panel">
      <div className="data-toolbar"><label className="search-field"><Icon name="Search" size={15} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={`Search ${page.title.toLowerCase()}`} /></label><span className="toolbar-spacer" /><button><Icon name="ListFilter" size={14} />Filter</button><select value={range} onChange={(event) => setRange(event.target.value)}><option>1 hour</option><option>24 hours</option><option>7 days</option><option>30 days</option></select><button className="icon-control"><Icon name="SlidersHorizontal" size={15} /></button></div>
      <div className="table-scroll"><div className="data-table" style={{"--columns":page.columns.length}}>
        <div className="table-row table-head">{page.columns.map((column) => <span key={column}>{column}</span>)}</div>
        {rows.map((row,rowIndex) => <button className="table-row" key={`${row[0]}-${rowIndex}`}>{row.map((cell,index) => <span key={index} className={index===0?'primary-cell':''}>{index===0 && <i className="row-icon"><Icon name={page.title==='Runs'?'Activity':page.title==='Deploys'?'Rocket':'Workflow'} size={14} /></i>}<StatusPill value={cell} /></span>)}</button>)}
        {!rows.length && <div className="empty-table"><Icon name="SearchX" size={28} /><strong>No matching results</strong><span>Try a different search.</span></div>}
      </div></div>
      <footer className="table-footer"><span>{rows.length} results</span><div><button disabled>Previous</button><button>Next</button></div></footer>
    </section>}
  </main>;
}
