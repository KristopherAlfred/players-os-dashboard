import { useEffect, useRef, useState } from "react";
import {
  Camera,
  CameraOff,
  Circle,
  Mic,
  MicOff,
  Radio,
  Sparkles,
  Video,
} from "lucide-react";

type StreamStatus = "idle" | "preview" | "live" | "ended";

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
      setCameraError("Camera or mic access was blocked. You can still go live on DameTime.");
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

  async function goLive() {
    if (!title.trim()) return;
    if (status === "idle") {
      await startPreview();
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
  const showVideo = (status === "preview" || status === "live") && !cameraError && cameraOn;
  const canGoLive = title.trim().length > 0;

  return (
    <div className="space-y-5">
      <style>{`
        @keyframes go-live-pulse {
          0%, 100% {
            transform: scale(1);
            box-shadow: 0 0 0 0 rgba(229, 9, 20, 0.55), 0 0 28px rgba(229, 9, 20, 0.35);
          }
          50% {
            transform: scale(1.03);
            box-shadow: 0 0 0 14px rgba(229, 9, 20, 0), 0 0 40px rgba(229, 9, 20, 0.55);
          }
        }
        .go-live-pulse {
          animation: go-live-pulse 1.6s ease-in-out infinite;
        }
      `}</style>

      <div className="overflow-hidden rounded-2xl border border-dt-border bg-dt-card">
        <div className="relative border-b border-dt-border bg-gradient-to-br from-black via-[#0c0c0c] to-[#1a0505] px-5 py-5 sm:px-7 sm:py-6">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_15%_0%,rgba(229,9,20,0.22),transparent_50%)]" />
          <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-xl">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-dt-red/30 bg-dt-red/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-dt-red">
                <Sparkles size={12} />
                DameTime Live
              </div>
              <h2 className="font-display text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                Go live for the DameTime community
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-white/65">
                Broadcast straight to fans inside DameTime. One destination. One button.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <div className="min-w-[110px] rounded-xl border border-white/10 bg-black/40 px-4 py-3">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-white/45">Status</p>
                <p className={`mt-1 text-lg font-bold ${isLive ? "text-dt-red" : "text-white"}`}>
                  {isLive ? "LIVE" : status === "preview" ? "Ready" : status === "ended" ? "Ended" : "Offline"}
                </p>
              </div>
              <div className="min-w-[110px] rounded-xl border border-white/10 bg-black/40 px-4 py-3">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-white/45">Duration</p>
                <p className="mt-1 text-lg font-bold text-white">{formatDuration(elapsed)}</p>
              </div>
              <div className="min-w-[110px] rounded-xl border border-white/10 bg-black/40 px-4 py-3">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-white/45">Viewers</p>
                <p className="mt-1 text-lg font-bold text-white">{isLive ? viewers.toLocaleString() : "—"}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-0 xl:grid-cols-12">
          <div className="border-b border-dt-border p-4 sm:p-5 xl:col-span-8 xl:border-b-0 xl:border-r">
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black shadow-[0_0_40px_rgba(229,9,20,0.08)]">
              <div className="aspect-video w-full">
                {showVideo ? (
                  <video ref={videoRef} muted playsInline className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full flex-col items-center justify-center gap-4 bg-[radial-gradient(ellipse_at_center,rgba(229,9,20,0.2),transparent_55%),linear-gradient(180deg,#0a0a0a,#050505)] px-6 text-center">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full border border-dt-red/35 bg-dt-red/10 shadow-[0_0_30px_rgba(229,9,20,0.25)]">
                      <Radio size={32} className="text-dt-red" />
                    </div>
                    <div>
                      <p className="text-xl font-semibold text-white">You’re about to go live on DameTime</p>
                      <p className="mx-auto mt-2 max-w-md text-sm text-white/55">
                        {cameraError ??
                          "Set your title, open the camera, then hit the pulsing Go Live button."}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {isLive && (
                <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-black/75 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wide text-white shadow-lg">
                  <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-dt-red" />
                  Live on DameTime · {formatDuration(elapsed)}
                </div>
              )}

              {(status === "preview" || status === "live") && (
                <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full border border-white/10 bg-black/75 p-2 backdrop-blur">
                  <button
                    type="button"
                    onClick={toggleCamera}
                    className={`rounded-full p-3 ${cameraOn ? "bg-white/10 text-white" : "bg-dt-red text-white"}`}
                    aria-label={cameraOn ? "Turn camera off" : "Turn camera on"}
                  >
                    {cameraOn ? <Camera size={17} /> : <CameraOff size={17} />}
                  </button>
                  <button
                    type="button"
                    onClick={toggleMic}
                    className={`rounded-full p-3 ${micOn ? "bg-white/10 text-white" : "bg-dt-red text-white"}`}
                    aria-label={micOn ? "Mute mic" : "Unmute mic"}
                  >
                    {micOn ? <Mic size={17} /> : <MicOff size={17} />}
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col justify-between gap-6 p-5 sm:p-6 xl:col-span-4">
            <div className="space-y-5">
              <div>
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-white/45">
                  Destination
                </p>
                <div className="rounded-xl border border-dt-red/40 bg-gradient-to-br from-dt-red/15 to-transparent p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-dt-red text-white shadow-[0_0_20px_rgba(229,9,20,0.4)]">
                      <Radio size={20} />
                    </div>
                    <div>
                      <p className="text-base font-semibold text-white">Go Live on DameTime</p>
                      <p className="mt-1 text-sm leading-relaxed text-white/55">
                        Fans watching inside the DameTime app and site will see your stream.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <label className="block">
                <span className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.12em] text-white/45">
                  Stream title
                </span>
                <input
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  disabled={isLive}
                  className="w-full rounded-xl border border-dt-border bg-black/40 px-4 py-3 text-sm text-white outline-none transition focus:border-dt-red/60 focus:ring-1 focus:ring-dt-red/30 disabled:opacity-60"
                  placeholder="What’s this live about?"
                />
              </label>

              {status === "idle" && (
                <button
                  type="button"
                  onClick={() => void startPreview()}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.03] px-4 py-3 text-sm font-medium text-white transition hover:bg-white/[0.06]"
                >
                  <Video size={16} />
                  Open camera preview
                </button>
              )}
            </div>

            <div className="space-y-3">
              {status !== "live" && status !== "ended" && (
                <button
                  type="button"
                  disabled={!canGoLive}
                  onClick={() => void goLive()}
                  className={`go-live-pulse flex w-full items-center justify-center gap-3 rounded-2xl bg-dt-red px-5 py-5 text-lg font-bold tracking-wide text-white disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none disabled:[animation:none]`}
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
                    <Radio size={18} />
                  </span>
                  Go Live on DameTime
                </button>
              )}

              {isLive && (
                <button
                  type="button"
                  onClick={endLive}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dt-red/50 bg-dt-red/15 px-5 py-4 text-base font-semibold text-white transition hover:bg-dt-red/25"
                >
                  <Circle size={14} fill="currentColor" className="text-dt-red" />
                  End Live
                </button>
              )}

              {status === "ended" && (
                <button
                  type="button"
                  onClick={resetStudio}
                  className="go-live-pulse flex w-full items-center justify-center gap-2 rounded-2xl bg-dt-red px-5 py-4 text-base font-bold text-white"
                >
                  Start another live
                </button>
              )}

              <p className="text-center text-xs text-white/40">
                {isLive
                  ? "You’re broadcasting to DameTime fans right now."
                  : "The big red button starts your DameTime live."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
