import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { ThemeProvider } from "./theme/ThemeContext";
import { applyPalette, getPalette, isThemeTemplate, STORAGE_KEY } from "./theme/themes";

const stored = localStorage.getItem(STORAGE_KEY);
const initialTemplate = isThemeTemplate(stored) ? stored : "default";
applyPalette(getPalette(initialTemplate));

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>,
);
