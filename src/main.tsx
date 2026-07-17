import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";
import App from "./App";
import { ThemeProvider } from "./lib/theme";
import { EditorProvider } from "./editor/EditorProvider";
import { CommentsProvider } from "./editor/CommentsProvider";
import "./globals.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider>
      <EditorProvider>
        <CommentsProvider>
          <HashRouter>
            <App />
          </HashRouter>
        </CommentsProvider>
      </EditorProvider>
    </ThemeProvider>
  </React.StrictMode>,
);
