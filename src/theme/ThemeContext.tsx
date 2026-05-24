import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  applyPalette,
  getPalette,
  STORAGE_KEY,
  themeTemplates,
  type ThemePalette,
  type ThemeTemplate,
} from "./themes";

interface ThemeContextValue {
  template: ThemeTemplate;
  palette: ThemePalette;
  setTemplate: (template: ThemeTemplate) => void;
  templates: typeof themeTemplates;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function readStoredTemplate(): ThemeTemplate {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === "default" || stored === "team" || stored === "athlete") {
    return stored;
  }
  return "default";
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [template, setTemplateState] = useState<ThemeTemplate>(readStoredTemplate);
  const palette = useMemo(() => getPalette(template), [template]);

  useEffect(() => {
    applyPalette(palette);
  }, [palette]);

  const setTemplate = useCallback((next: ThemeTemplate) => {
    setTemplateState(next);
    localStorage.setItem(STORAGE_KEY, next);
  }, []);

  const value = useMemo(
    () => ({ template, palette, setTemplate, templates: themeTemplates }),
    [template, palette, setTemplate],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
