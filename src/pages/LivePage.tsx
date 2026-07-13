import { useEffect, useRef, useState } from "react";
import {
  Camera,
  CameraOff,
  Circle,
  Mic,
  MicOff,
  MonitorUp,
  Radio,
  Settings2,
  Users,
  Video,
} from "lucide-react";
import { Panel, StatCard } from "../components/PageShell";

type StreamStatus = "idle" | "preview" | "live" | "ended";

type Destination = {
  id: string;
  label: string;
  hint: string;
};

const destinations: Destination[] = [
  { id: "instagram", label: "Instagram Live", hint: "@damianlillard" },
  { id: "facebook", label: "Facebook Live", hint: "Damian Lillard" },
  { id: "youtube", label: "YouTube Live", hint: "@DamianLillard" },
  { id: "x", label: "X Live", hint: "@Dame_Lillard" },
];

function formatDuration(seconds: number) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) {
    return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function LivePage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [status, setStatus] = useState<StreamStatus>("idle");
  const [title, setTitle] = useState("Dame Time Live");
  const [selected, setSelected] = useState<string[]>(["instagram", "facebook"]);
  const [cameraOn, setCameraOn] = useState(true);
  const [micOn, setMicOn] = useState(true);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [viewers, setViewers] = useState(0);

  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (status !== "live") return;

    setElapsed(0);
    setViewers(1284);
    const timer = window.setInterval(() => {
      setElapsed((value) => value + 1);
      setViewers((value) => value + Math.floor(Math.random() * 18));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [status]);

  async function startPreview() {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setCameraOn(true);
      setMicOn(true);
      setStatus("preview");
    } catch {
      setCameraError("Camera or mic access was blocked. You can still prep the stream and go live.");
      setStatus("preview");
    }
  }

  function toggleCamera() {
    const track = streamRef.current?.getVideoTracks()[0];
    if (!track) {
      setCameraOn((value) => !value);
      return;
    }
    track.enabled = !track.enabled;
    setCameraOn(track.enabled);
  }

  function toggleMic() {
    const track = streamRef.current?.getAudioTracks()[0];
    if (!track) {
      setMicOn((value) => !value);
      return;
    }
    track.enabled = !track.enabled;
    setMicOn(track.enabled);
  }

  function toggleDestination(id: string) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  }

  function goLive() {
    if (selected.length === 0) return;
    if (status === "idle") {
      void startPreview().then(() => setStatus("live"));
      return;
    }
    setStatus("live");
  }

  function endLive() {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    setStatus("ended");
    setCameraOn(false);
    setMicOn(false);
  }

  function resetStudio() {
    setStatus("idle");
    setElapsed(0);
    setViewers(0);
    setCameraError(null);
  }

  const isLive = status === "live";
  const canGoLive = selected.length > 0 && title.trim().length > 0;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Status"
          value={isLive ? "LIVE" : status === "preview" ? "Ready" : status === "ended" ? "Ended" : "Offline"}
          hint={isLive ? "Broadcasting now" : "Studio standby"}
        />
        <StatCard label="Duration" value={formatDuration(elapsed)} hint={isLive ? "Current stream" : "Last session"} />
        <StatCard
          label="Viewers"
          value={isLive ? viewers.toLocaleString() : "—"}
          hint={isLive ? "Across selected platforms" : "Appears when live"}
        />
        <StatCard
          label="Destinations"
          value={String(selected.length)}
          hint={selected.length ? destinations.filter((d) => selected.includes(d.id)).map((d) => d.label).join(" · ") : "Pick where to go live"}
        />
      </div>

      <div className="grid grid-cols-1 items-stretch gap-4 xl:grid-cols-12">
        <div className="xl:col-span-8">
          <Panel title="Live Studio">
            <div className="relative overflow-hidden rounded-xl border border-dt-border bg-black">
              <div className="aspect-video w-full">
                {(status === "preview" || status === "live") && !cameraError && cameraOn ? (
                  <video ref={videoRef} muted playsInline className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full flex-col items-center justify-center gap-3 bg-[radial-gradient(ellipse_at_center,rgba(229,9,20,0.18),transparent_55%),linear-gradient(180deg,#0a0a0a,#050505)] px-6 text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full border border-dt-red/40 bg-dt-red/10">
                      <Radio size={28} className="text-dt-red" />
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-white">Dame Live Studio</p>
                      <p className="mt-1 max-w-md text-sm text-dt-muted">
                        {cameraError ??
                          "Preview your camera, choose platforms, then hit Go Live when you’re ready."}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {isLive && (
                <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-black/70 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-white">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-dt-red" />
                  Live · {formatDuration(elapsed)}
                </div>
              )}

              <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full border border-white/10 bg-black/70 p-2 backdrop-blur">
                <button
                  type="button"
                  onClick={toggleCamera}
                  className={`rounded-full p-2.5 ${cameraOn ? "bg-white/10 text-white" : "bg-dt-red text-white"}`}
                  aria-label={cameraOn ? "Turn camera off" : "Turn camera on"}
                >
                  {cameraOn ? <Camera size={16} /> : <CameraOff size={16} />}
                </button>
                <button
                  type="button"
                  onClick={toggleMic}
                  className={`rounded-full p-2.5 ${micOn ? "bg-white/10 text-white" : "bg-dt-red text-white"}`}
                  aria-label={micOn ? "Mute mic" : "Unmute mic"}
                >
                  {micOn ? <Mic size={16} /> : <MicOff size={16} />}
                </button>
                <button
                  type="button"
                  onClick={() => void startPreview()}
                  disabled={status === "live"}
                  className="rounded-full bg-white/10 p-2.5 text-white disabled:opacity-40"
                  aria-label="Refresh camera preview"
                >
                  <MonitorUp size={16} />
                </button>
              </div>
            </div>
          </Panel>
        </div>

        <div className="space-y-4 xl:col-span-4">
          <Panel title="Go Live Setup">
            <div className="space-y-4">
              <label className="block">
                <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-dt-muted">
                  Stream title
                </span>
                <input
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  disabled={isLive}
                  className="w-full rounded-md border border-dt-border bg-dt-bg px-3 py-2.5 text-sm text-white outline-none focus:border-dt-red/50 disabled:opacity-60"
                  placeholder="What’s this live about?"
                />
              </label>

              <div>
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-dt-muted">
                  Destinations
                </p>
                <div className="space-y-2">
                  {destinations.map((destination) => {
                    const active = selected.includes(destination.id);
                    return (
                      <button
                        key={destination.id}
                        type="button"
                        disabled={isLive}
                        onClick={() => toggleDestination(destination.id)}
                        className={`flex w-full items-center justify-between rounded-lg border px-3 py-2.5 text-left transition-colors disabled:opacity-60 ${
                          active
                            ? "border-dt-red/50 bg-dt-red/10"
                            : "border-dt-border bg-dt-bg/50 hover:border-white/20"
                        }`}
                      >
                        <span>
                          <span className="block text-sm font-medium text-white">{destination.label}</span>
                          <span className="text-xs text-dt-muted">{destination.hint}</span>
                        </span>
                        <span
                          className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                            active ? "border-dt-red bg-dt-red text-white" : "border-dt-border text-transparent"
                          }`}
                        >
                          <Circle size={10} fill="currentColor" />
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {status === "idle" && (
                <button
                  type="button"
                  onClick={() => void startPreview()}
                  className="flex w-full items-center justify-center gap-2 rounded-md border border-dt-border px-4 py-2.5 text-sm font-medium text-white hover:bg-white/[0.04]"
                >
                  <Video size={16} />
                  Start camera preview
                </button>
              )}

              {status !== "live" && status !== "ended" && (
                <button
                  type="button"
                  disabled={!canGoLive}
                  onClick={goLive}
                  className="flex w-full items-center justify-center gap-2 rounded-md bg-dt-red px-4 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Radio size={16} />
                  Go Live
                </button>
              )}

              {isLive && (
                <button
                  type="button"
                  onClick={endLive}
                  className="flex w-full items-center justify-center gap-2 rounded-md border border-dt-red/50 bg-dt-red/15 px-4 py-3 text-sm font-semibold text-white hover:bg-dt-red/25"
                >
                  <Circle size={14} fill="currentColor" className="text-dt-red" />
                  End Live
                </button>
              )}

              {status === "ended" && (
                <button
                  type="button"
                  onClick={resetStudio}
                  className="flex w-full items-center justify-center gap-2 rounded-md bg-dt-red px-4 py-3 text-sm font-semibold text-white"
                >
                  Back to studio
                </button>
              )}
            </div>
          </Panel>

          <Panel title="Quick Tips">
            <ul className="space-y-3 text-sm text-dt-muted">
              <li className="flex gap-2">
                <Users size={15} className="mt-0.5 shrink-0 text-dt-red" />
                Go live to Instagram, Facebook, YouTube, and X from one studio.
              </li>
              <li className="flex gap-2">
                <Settings2 size={15} className="mt-0.5 shrink-0 text-dt-red" />
                Check lighting and mic levels in preview before you hit Go Live.
              </li>
              <li className="flex gap-2">
                <Radio size={15} className="mt-0.5 shrink-0 text-dt-red" />
                Keep the title short so it reads clean across every platform.
              </li>
            </ul>
          </Panel>
        </div>
      </div>
    </div>
  );
}
