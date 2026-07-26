import React from "react";
import * as Icons from "lucide-react";

export function Icon({ name, size = 16, strokeWidth = 1.8, className = "" }) {
  const Component = Icons[name] || Icons.Circle;
  return <Component size={size} strokeWidth={strokeWidth} className={className} aria-hidden="true" />;
}

export function StatusPill({ value }) {
  if (!value || typeof value === "string") return <span>{value ?? "—"}</span>;
  return <span className={`status-pill ${value.tone}`}>{value.label}</span>;
}
