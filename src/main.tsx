import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";
import App from "./App";
import { ThemeProvider } from "./lib/theme";
import { AuthGate } from "./editor/AuthGate";
import { EditorProvider } from "./editor/EditorProvider";
import { CommentsProvider } from "./editor/CommentsProvider";
import "./globals.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider>
      <AuthGate>
        <EditorProvider>
          <CommentsProvider>
            <HashRouter>
              <App />
            </HashRouter>
          </CommentsProvider>
        </EditorProvider>
      </AuthGate>
    </ThemeProvider>
  </React.StrictMode>
);
