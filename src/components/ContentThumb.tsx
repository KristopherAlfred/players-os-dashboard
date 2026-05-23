const gradients: Record<string, string> = {
  studio: "from-red-900/80 to-zinc-900",
  drop: "from-red-700/80 to-black",
  tour: "from-orange-900/60 to-zinc-900",
  qa: "from-zinc-700 to-zinc-900",
  audio: "from-red-800/70 to-zinc-900",
};

export function ContentThumb({ id, size = "md" }: { id: string; size?: "sm" | "md" }) {
  const dim = size === "sm" ? "h-8 w-12" : "h-10 w-14";
  return (
    <div
      className={`${dim} shrink-0 rounded bg-gradient-to-br ${gradients[id] ?? "from-zinc-800 to-zinc-900"} border border-dt-border`}
    />
  );
}
