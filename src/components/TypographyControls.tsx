import type { TitleFontFamily, TitleFontSize } from "../lib/typography";
import { TITLE_FONT_OPTIONS, TITLE_SIZE_OPTIONS } from "../lib/typography";

type TypographyControlsProps = {
  fontFamily?: TitleFontFamily | string;
  fontSize?: TitleFontSize | string;
  onFontFamilyChange: (value: TitleFontFamily) => void;
  onFontSizeChange: (value: TitleFontSize) => void;
  label?: string;
  className?: string;
};

export function TypographyControls({
  fontFamily = "default",
  fontSize = "md",
  onFontFamilyChange,
  onFontSizeChange,
  label = "Title typography",
  className = "",
}: TypographyControlsProps) {
  return (
    <div className={`space-y-3 ${className}`}>
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/45">{label}</p>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <label className="block space-y-1.5">
          <span className="text-[11px] font-medium uppercase tracking-wide text-white/40">Font</span>
          <select
            value={fontFamily || "default"}
            onChange={(e) => onFontFamilyChange(e.target.value as TitleFontFamily)}
            className="dt-select w-full"
          >
            {TITLE_FONT_OPTIONS.map((option) => (
              <option key={option.id} value={option.id} style={{ fontFamily: option.css }}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <label className="block space-y-1.5">
          <span className="text-[11px] font-medium uppercase tracking-wide text-white/40">Size</span>
          <select
            value={fontSize || "md"}
            onChange={(e) => onFontSizeChange(e.target.value as TitleFontSize)}
            className="dt-select w-full"
          >
            {TITLE_SIZE_OPTIONS.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );
}
