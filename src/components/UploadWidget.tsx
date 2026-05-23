import { CloudUpload, Upload } from "lucide-react";
import { Card } from "./ui/Card";

export function UploadWidget() {
  return (
    <Card className="col-span-1">
      <div className="flex h-full min-h-[320px] flex-col items-center justify-center border-2 border-dashed border-dt-border/80 m-4 rounded-lg px-6 py-8 text-center">
        <div className="mb-4 rounded-full border border-dt-red/30 bg-dt-red/10 p-4 text-dt-red">
          <CloudUpload size={36} strokeWidth={1.25} />
        </div>
        <p className="mb-1 text-sm font-medium text-white">
          Drag &amp; drop files here
        </p>
        <p className="mb-5 text-xs text-dt-muted">
          MP4, MOV, JPG, PNG, GIF, MP3, WAV — max 5GB
        </p>
        <button
          type="button"
          className="flex items-center gap-2 rounded-md bg-dt-red px-5 py-2 text-sm font-semibold text-white hover:bg-dt-red-hover"
        >
          <Upload size={16} />
          Upload Content
        </button>
      </div>
    </Card>
  );
}
