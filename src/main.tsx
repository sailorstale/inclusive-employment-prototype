import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";
import App from "./App";
import { EditorProvider } from "./editor/EditorProvider";
import { CommentsProvider } from "./editor/CommentsProvider";
import "./globals.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
      <EditorProvider>
        <CommentsProvider>
          <HashRouter>
            <App />
          </HashRouter>
        </CommentsProvider>
      </EditorProvider>
  </React.StrictMode>,
);
