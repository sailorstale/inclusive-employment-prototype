import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";
import App from "./App";
import { EditorProvider } from "./editor/EditorProvider";
import "./globals.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <EditorProvider>
      <HashRouter>
        <App />
      </HashRouter>
    </EditorProvider>
  </React.StrictMode>,
);
