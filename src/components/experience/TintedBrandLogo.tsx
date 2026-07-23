import type { CSSProperties } from "react";

type TintedBrandLogoProps = {
  src: string;
  color: string;
  size?: number | string;
  className?: string;
  /** When false, show the original image colors (for photo uploads). */
  tint?: boolean;
  style?: CSSProperties;
};

/**
 * Recolors illustrated / AI logos via CSS mask.
 * Best with marks on transparent or black backgrounds.
 */
export function TintedBrandLogo({
  src,
  color,
  size = 40,
  className = "",
  tint = true,
  style,
}: TintedBrandLogoProps) {
  const dim = typeof size === "number" ? `${size}px` : size;

  if (!tint) {
    return (
      <img
        src={src}
        alt=""
        className={className}
        draggable={false}
        style={{
          width: dim,
          height: dim,
          objectFit: "contain",
          boxShadow: `0 0 16px ${color}66`,
          ...style,
        }}
      />
    );
  }

  return (
    <span
      className={className}
      aria-hidden
      style={{
        display: "inline-block",
        width: dim,
        height: dim,
        flexShrink: 0,
        backgroundColor: color,
        WebkitMaskImage: `url(${src})`,
        WebkitMaskSize: "contain",
        WebkitMaskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
        maskImage: `url(${src})`,
        maskSize: "contain",
        maskRepeat: "no-repeat",
        maskPosition: "center",
        boxShadow: `0 0 16px ${color}88`,
        ...style,
      }}
    />
  );
}
