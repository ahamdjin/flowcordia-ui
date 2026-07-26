import React from "react";
import { createRoot } from "react-dom/client";
import "@xyflow/react/dist/style.css";
import "./monaco-setup";
import App from "./App";
import "./styles.css";
import "./studio.css";
import "./fixes.css";
import "./reactflow-monaco.css";

createRoot(document.getElementById("root")).render(
  <React.StrictMode><App /></React.StrictMode>
);
