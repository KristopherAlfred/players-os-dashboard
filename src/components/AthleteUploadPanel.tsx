import {
  CloudUpload,
  Film,
  Image,
  Music,
  FileText,
  Sparkles,
  Upload,
} from "lucide-react";
import { Panel } from "./PageShell";

const fileTypes = [
  { label: "Video", icon: Film, ext: "MP4, MOV" },
  { label: "Image", icon: Image, ext: "JPG, PNG" },
  { label: "Audio", icon: Music, ext: "MP3, WAV" },
  { label: "Article", icon: FileText, ext: "DOC, TXT" },
];

export function AthleteUploadPanel() {
  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
      <div className="xl:col-span-8">
        <div className="overflow-hidden rounded-xl border border-dt-border bg-dt-card">
          <div className="border-b border-dt-border bg-gradient-to-r from-dt-red/15 via-transparent to-transparent px-4 py-3">
            <h2 className="font-display text-base font-semibold tracking-wide text-white">Upload Files</h2>
            <p className="mt-0.5 text-xs text-dt-muted">Drop assets for review — they go live after approval</p>
          </div>
          <div className="p-4">
            <div className="relative flex min-h-[300px] flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-dt-red/35 bg-gradient-to-b from-dt-red/[0.07] to-transparent px-6 py-10 text-center">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(229,9,20,0.12),transparent_55%)]" />
              <div className="relative mb-4 rounded-full border border-dt-red/30 bg-dt-red/10 p-5 text-dt-red shadow-[0_0_32px_rgba(229,9,20,0.2)]">
                <CloudUpload size={40} strokeWidth={1.25} />
              </div>
              <p className="relative text-base font-semibold text-white">Drag & drop or browse files</p>
              <p className="relative mt-1 text-sm text-dt-muted">MP4, MOV, JPG, PNG, MP3 — up to 5GB per file</p>
              <button
                type="button"
                className="relative mt-6 flex items-center gap-2 rounded-md bg-dt-red px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-dt-red/20 hover:bg-dt-red-hover"
              >
                <Upload size={16} />
                Select Files
              </button>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {fileTypes.map(({ label, icon: Icon, ext }) => (
                <div
                  key={label}
                  className="flex items-center gap-2 rounded-lg border border-dt-border bg-dt-bg/60 px-3 py-2.5"
                >
                  <div className="rounded-md bg-dt-red/10 p-1.5 text-dt-red">
                    <Icon size={14} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-white">{label}</p>
                    <p className="truncate text-[10px] text-dt-muted">{ext}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="xl:col-span-4">
        <Panel title="Publish Settings">
          <form className="space-y-3 text-sm">
            <label className="block">
              <span className="text-dt-muted">Title</span>
              <input
                className="mt-1 w-full rounded-md border border-dt-border bg-dt-bg px-3 py-2 text-white outline-none focus:border-dt-red/50"
                placeholder="Content title"
              />
            </label>
            <label className="block">
              <span className="text-dt-muted">Type</span>
              <select className="mt-1 w-full rounded-md border border-dt-border bg-dt-bg px-3 py-2 text-white">
                <option>Video</option>
                <option>Image</option>
                <option>Article</option>
                <option>Audio</option>
              </select>
            </label>
            <label className="block">
              <span className="text-dt-muted">Visibility</span>
              <select className="mt-1 w-full rounded-md border border-dt-border bg-dt-bg px-3 py-2 text-white">
                <option>Public</option>
                <option>Inner Circle</option>
                <option>Scheduled</option>
              </select>
            </label>
            <label className="block">
              <span className="text-dt-muted">Tags</span>
              <input
                className="mt-1 w-full rounded-md border border-dt-border bg-dt-bg px-3 py-2 text-white outline-none focus:border-dt-red/50"
                placeholder="tour, exclusive, bts"
              />
            </label>
            <button
              type="button"
              className="flex w-full items-center justify-center gap-2 rounded-md bg-dt-red py-2.5 font-semibold text-white hover:bg-dt-red-hover"
            >
              <Sparkles size={15} />
              Publish Now
            </button>
          </form>

          <div className="mt-4 rounded-lg border border-dt-border/80 bg-dt-bg/40 p-3">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-dt-muted">Pro tip</p>
            <p className="mt-1 text-xs leading-relaxed text-dt-muted">
              Vertical video (9:16) performs best on TikTok and Instagram. Add 2–3 tags so fans can find it faster.
            </p>
          </div>
        </Panel>
      </div>
    </div>
  );
}
