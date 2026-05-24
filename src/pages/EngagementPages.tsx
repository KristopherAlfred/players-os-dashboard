import { useState } from "react";
import { MessageSquare, Send, BarChart3 } from "lucide-react";
import { Panel, StatCard } from "../components/PageShell";
import { liveActivity } from "../data/mockData";

const comments = [
  { user: "Trey_503", text: "This drop is insane 🔥", post: "Inner Circle Exclusive", time: "3m", flagged: false },
  { user: "BallIsLife", text: "When's the next stream?", post: "Studio Session BTS", time: "8m", flagged: false },
  { user: "RipCityFan", text: "Portland forever", post: "Tour Announcement", time: "12m", flagged: false },
  { user: "spam_bot", text: "Click here for free...", post: "Fan Q&A", time: "15m", flagged: true },
];

const messages = [
  { from: "Jordan K.", preview: "Just joined Inner Circle — where do I start?", unread: true, tier: "Inner Circle" },
  { from: "Maya R.", preview: "Loved the acoustic version!", unread: true, tier: "Superfan" },
  { from: "Alex T.", preview: "Can I get tour presale access?", unread: false, tier: "VIP" },
  { from: "Sam P.", preview: "Shared your post with my group", unread: false, tier: "Fan" },
];

const polls = [
  { question: "Which city should we add to the tour?", votes: 12400, status: "Active", ends: "2 days" },
  { question: "Next exclusive drop format?", votes: 8920, status: "Active", ends: "5 days" },
  { question: "Favorite BTS moment?", votes: 24100, status: "Closed", ends: "Ended" },
];

export function EngagementOverviewPage() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Comments (7d)" value="18.4K" trend="+22%" />
        <StatCard label="Reactions" value="142K" trend="+15%" />
        <StatCard label="Shares" value="28.6K" trend="+31%" />
        <StatCard label="Poll Votes" value="45.4K" trend="+18%" />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Panel title="Engagement by Channel">
          {["Instagram", "TikTok", "YouTube", "Twitter/X"].map((ch, i) => (
            <div key={ch} className="mb-3">
              <div className="mb-1 flex justify-between text-sm">
                <span>{ch}</span>
                <span>{[42, 28, 18, 12][i]}%</span>
              </div>
              <div className="h-2 rounded-full bg-dt-border">
                <div className="h-full rounded-full bg-dt-red" style={{ width: `${[42, 28, 18, 12][i]}%` }} />
              </div>
            </div>
          ))}
        </Panel>
        <Panel title="Recent Activity">
          {liveActivity.slice(0, 4).map((a) => (
            <div key={a.user} className="flex gap-3 border-b border-dt-border/50 py-2 last:border-0">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-dt-red/20 text-[10px] font-bold text-dt-red">{a.avatar}</div>
              <div>
                <p className="text-sm"><span className="font-medium">{a.user}</span> — {a.action}</p>
                <p className="text-xs text-dt-muted">{a.time}</p>
              </div>
            </div>
          ))}
        </Panel>
      </div>
    </div>
  );
}

export function CommentsPage() {
  const [filter, setFilter] = useState<"all" | "flagged">("all");
  const list = filter === "flagged" ? comments.filter((c) => c.flagged) : comments;
  return (
    <Panel title="Comment Moderation">
      <div className="mb-4 flex gap-2">
        <button type="button" onClick={() => setFilter("all")} className={`rounded-md px-3 py-1.5 text-xs ${filter === "all" ? "bg-dt-red text-white" : "border border-dt-border"}`}>All</button>
        <button type="button" onClick={() => setFilter("flagged")} className={`rounded-md px-3 py-1.5 text-xs ${filter === "flagged" ? "bg-dt-red text-white" : "border border-dt-border"}`}>Flagged</button>
      </div>
      <div className="space-y-2">
        {list.map((c) => (
          <div key={c.user + c.time} className={`flex items-start justify-between rounded-lg border p-3 ${c.flagged ? "border-orange-500/40 bg-orange-500/5" : "border-dt-border bg-dt-bg/40"}`}>
            <div className="flex gap-3">
              <MessageSquare size={16} className="mt-0.5 text-dt-muted" />
              <div>
                <p className="text-sm font-medium">{c.user} <span className="font-normal text-dt-muted">on {c.post}</span></p>
                <p className="mt-1 text-sm">{c.text}</p>
                <p className="mt-1 text-xs text-dt-muted">{c.time} ago</p>
              </div>
            </div>
            <div className="flex gap-1">
              <button type="button" className="rounded border border-dt-border px-2 py-1 text-xs">Approve</button>
              {c.flagged && <button type="button" className="rounded bg-dt-red px-2 py-1 text-xs">Remove</button>}
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
}

export function MessagesPage() {
  const [selected, setSelected] = useState(0);
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <Panel title="Inbox">
        {messages.map((m, i) => (
          <button key={m.from} type="button" onClick={() => setSelected(i)} className={`mb-1 w-full rounded-md p-3 text-left ${selected === i ? "border border-dt-red/30 bg-dt-red/15" : "hover:bg-white/[0.03]"}`}>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{m.from}</span>
              {m.unread && <span className="h-2 w-2 rounded-full bg-dt-red" />}
            </div>
            <p className="mt-1 truncate text-xs text-dt-muted">{m.preview}</p>
            <span className="mt-1 inline-block rounded bg-dt-border/50 px-1.5 py-0.5 text-[10px]">{m.tier}</span>
          </button>
        ))}
      </Panel>
      <div className="col-span-2">
        <Panel title={messages[selected].from}>
          <div className="mb-4 space-y-3">
            <div className="ml-auto max-w-[80%] rounded-lg bg-dt-red/20 p-3 text-sm">Hey! Welcome to Inner Circle — check the Exclusives tab for your first drop.</div>
            <div className="max-w-[80%] rounded-lg border border-dt-border bg-dt-bg p-3 text-sm">{messages[selected].preview}</div>
          </div>
          <div className="flex gap-2">
            <input className="flex-1 rounded-md border border-dt-border bg-dt-bg px-3 py-2 text-sm" placeholder="Reply to fan..." />
            <button type="button" className="rounded-md bg-dt-red px-4"><Send size={16} /></button>
          </div>
        </Panel>
      </div>
    </div>
  );
}

export function PollsPage() {
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button type="button" className="rounded-md bg-dt-red px-4 py-2 text-sm font-semibold">+ Create Poll</button>
      </div>
      {polls.map((p) => (
        <div key={p.question} className="rounded-lg border border-dt-border bg-dt-card p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="font-medium">{p.question}</p>
              <p className="mt-1 text-sm text-dt-muted">{p.votes.toLocaleString()} votes · {p.ends}</p>
            </div>
            <span className={`rounded px-2 py-0.5 text-xs ${p.status === "Active" ? "bg-green-500/15 text-dt-green" : "bg-dt-border text-dt-muted"}`}>{p.status}</span>
          </div>
          <div className="mt-4 flex gap-4">
            <BarChart3 size={16} className="text-dt-red" />
            <div className="flex-1 space-y-2">
              {["Option A", "Option B", "Option C"].map((o, i) => (
                <div key={o}>
                  <div className="flex justify-between text-xs"><span>{o}</span><span>{[52, 31, 17][i]}%</span></div>
                  <div className="mt-1 h-1.5 rounded-full bg-dt-border">
                    <div className="h-full rounded-full bg-dt-red" style={{ width: `${[52, 31, 17][i]}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
