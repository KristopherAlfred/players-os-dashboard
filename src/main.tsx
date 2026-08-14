import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { ThemeProvider } from "./theme/ThemeContext";
import { applyPalette, getPalette, isThemeTemplate, STORAGE_KEY } from "./theme/themes";

// The Google OAuth popup lands back here — tell the opener and close immediately.
{
  const params = new URLSearchParams(window.location.search);
  const youtube = params.get("youtube");
  if (youtube && window.opener) {
    try {
      window.opener.postMessage(
        { type: "youtube-auth", ok: youtube === "connected", message: params.get("youtube_message") },
        window.location.origin,
      );
    } catch {
      // opener may be gone
    }
    window.close();
  }
}

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
