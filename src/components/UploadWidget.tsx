import { Link } from "react-router-dom";
import { Trophy } from "lucide-react";
import { Card } from "./ui/Card";

export function UploadWidget() {
  return (
    <Card className="flex h-full w-full flex-col">
      <div className="dt-surface-inset m-4 flex flex-1 flex-col items-center justify-center rounded-lg border-2 border-dashed border-dt-border/80 px-6 py-8 text-center">
        <div className="mb-4 rounded-full border border-dt-red/30 bg-dt-red/10 p-4 text-dt-red">
          <Trophy size={36} strokeWidth={1.25} />
        </div>
        <p className="mb-1 text-sm font-medium text-white">Athlete uploads</p>
        <p className="mb-5 text-xs text-dt-muted">
          Content is uploaded through Athlete Hub by athletes and their representatives.
        </p>
        <Link
          to="/athletes/hub"
          className="flex items-center gap-2 rounded-md bg-dt-red px-5 py-2 text-sm font-semibold text-white hover:bg-dt-red-hover"
        >
          Go to Athlete Hub
        </Link>
      </div>
    </Card>
  );
}
