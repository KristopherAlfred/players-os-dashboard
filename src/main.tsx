import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { ThemeProvider } from "./theme/ThemeContext";
import { applyPalette, getPalette, STORAGE_KEY } from "./theme/themes";
import type { ThemeTemplate } from "./theme/themes";

const stored = localStorage.getItem(STORAGE_KEY);
const initialTemplate: ThemeTemplate =
  stored === "default" || stored === "team" || stored === "athlete"
    ? stored
    : "default";
applyPalette(getPalette(initialTemplate));

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>,
);
