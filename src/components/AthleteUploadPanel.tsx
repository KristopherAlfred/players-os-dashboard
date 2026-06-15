import { CloudUpload, Upload } from "lucide-react";
import { Panel } from "./PageShell";

export function AthleteUploadPanel() {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <Panel title="Upload Files">
          <div className="flex min-h-[280px] flex-col items-center justify-center rounded-lg border-2 border-dashed border-dt-border py-12">
            <CloudUpload size={48} className="text-dt-red" />
            <p className="mt-4 font-medium text-white">Drag & drop or browse files</p>
            <p className="mt-1 text-sm text-dt-muted">MP4, MOV, JPG, PNG, MP3 — up to 5GB</p>
            <button
              type="button"
              className="mt-6 flex items-center gap-2 rounded-md bg-dt-red px-5 py-2 text-sm font-semibold text-white hover:bg-dt-red-hover"
            >
              <Upload size={16} />
              Select Files
            </button>
          </div>
        </Panel>
      </div>
      <Panel title="Publish Settings">
        <form className="space-y-3 text-sm">
          <label className="block">
            <span className="text-dt-muted">Title</span>
            <input
              className="mt-1 w-full rounded-md border border-dt-border bg-dt-bg px-3 py-2 text-white outline-none"
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
              className="mt-1 w-full rounded-md border border-dt-border bg-dt-bg px-3 py-2 text-white outline-none"
              placeholder="tour, exclusive, bts"
            />
          </label>
          <button type="button" className="w-full rounded-md bg-dt-red py-2 font-semibold text-white hover:bg-dt-red-hover">
            Publish Now
          </button>
        </form>
      </Panel>
    </div>
  );
}
