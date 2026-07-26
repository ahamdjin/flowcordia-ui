import React, { useEffect, useState } from "react";
import { pages } from "./data";
import { Sidebar, Topbar } from "./Shell";
import DataPage from "./DataPage";
import Studio from "./Studio";

function routeFromPath() {
  const value = window.location.pathname.replace(/^\/+|\/+$/g, "");
  return value && (value === "studio" || pages[value]) ? value : "studio";
}

export default function App() {
  const [route, setRoute] = useState(routeFromPath);
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const navigate = (next) => {
    window.history.pushState({}, "", next === "studio" ? "/studio" : `/${next}`);
    setRoute(next);
    setMobileOpen(false);
  };

  useEffect(() => {
    const onPopState = () => setRoute(routeFromPath());
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  return <div className={`app-shell ${collapsed ? "sidebar-collapsed" : ""} ${mobileOpen ? "mobile-nav-open" : ""}`}>
    <Sidebar route={route} collapsed={collapsed} onToggle={() => setCollapsed((value) => !value)} onNavigate={navigate} />
    {mobileOpen && <button className="mobile-overlay" onClick={() => setMobileOpen(false)} aria-label="Close navigation" />}
    <div className="content-shell">
      <Topbar route={route} onNavigate={navigate} onMobileMenu={() => setMobileOpen(true)} />
      {route === "studio" ? <Studio /> : <DataPage page={pages[route]} />}
    </div>
  </div>;
}
