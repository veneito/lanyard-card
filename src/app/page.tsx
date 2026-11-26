"use client";

import { useEffect, useState } from "react";
import { Globe } from "lucide-react";

const ID = "968673369077727262";
const NAME = "veneito";

const LINKS: [string, string, string][] = [
  ["GitHub", "https://github.com/veneito", "github"],
  ["Website", "https://www.veneito.dev", "globe"],
  ["Discord", "https://discord.com/invite/wZph7vyTRH", "discord"],
  ["Steam", "https://steamcommunity.com/id/veneito", "steam"],
  ["Twitch", "https://twitch.tv/veneitoo", "twitch"],
  ["TikTok", "https://tiktok.com/@veneitooo", "tiktok"],
  ["Instagram", "https://instagram.com/veneitooo", "instagram"],
  ["Roblox", "https://roblox.com/users/143054393/profile", "roblox"],
  ["NameMC", "https://namemc.com/profile/veneito.1", "namemc"],
];

type Activity = {
  type: number;
  name: string;
  details?: string;
  state?: string;
  application_id?: string;
  timestamps?: { start?: number; end?: number };
  assets?: { large_image?: string };
};
type Presence = {
  discord_status: string;
  discord_user: { id: string; avatar: string | null };
  activities: Activity[];
};
type Stats = {
  total: number | null;
  month: number | null;
  artists: { name: string; plays: number }[];
  tracks: { title: string; artist: string; plays: number }[];
  recent: { title: string; artist: string; time: number }[];
  days: { day: string; plays: number }[];
};

const PROJECTS: [string, string, string, string][] = [
  ["Sonora", "Native music streaming client", "Rust · GPUI", "https://github.com/veneito/sonora"],
  ["Homelab", "Two-node Proxmox lab, Tailscale, AD", "Infra", "https://github.com/veneito/homelab"],
  ["EmuHub", "Low-memory emulation hub", "Rust · GPUI", "https://github.com/veneito/EmuHub"],
  ["party-night", "Party games on your TV, phones as controllers", "Rust", "https://github.com/veneito/party-night"],
  ["engage-pc-recomp", "Native Windows port of Fire Emblem Engage", "GitLab", "https://gitlab.com/engage-pc-recomp/engage-pc-recomp"],
  ["pocket-mc", "Host Minecraft servers on Windows", "C#", "https://github.com/veneito/pocket-mc-windows"],
];

const STATUS: Record<string, string> = { online: "#23a55a", idle: "#f0b232", dnd: "#f23f43", offline: "#80848e" };

function art(a: Activity) {
  const img = a.assets?.large_image;
  if (!img) return null;
  if (img.startsWith("mp:")) return `https://media.discordapp.net/${img.slice(3)}`;
  return `https://cdn.discordapp.com/app-assets/${a.application_id}/${img}.png`;
}

const clock = (ms: number) => {
  const s = Math.max(0, Math.floor(ms / 1000));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
};

const ago = (unix: number, now: number) => {
  const m = Math.floor((now / 1000 - unix) / 60);
  if (m < 1) return "now";
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  return h < 24 ? `${h}h` : `${Math.floor(h / 24)}d`;
};

const fmt = (n: number | null | undefined) => (n == null ? "—" : n.toLocaleString("en-US"));

const Label = ({ children }: { children: React.ReactNode }) => (
  <p className="text-[11px] uppercase tracking-[0.2em] text-white/35 mb-3">{children}</p>
);

const Panel = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <section className={`rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5 ${className}`}>{children}</section>
);

export default function Home() {
  const [p, setP] = useState<Presence | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [typed, setTyped] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const load = () =>
      fetch(`https://api.lanyard.rest/v1/users/${ID}`)
        .then((r) => r.json() as Promise<{ success: boolean; data: Presence }>)
        .then((j) => j.success && setP(j.data))
        .catch(() => {});
    const loadStats = () =>
      fetch("/stats")
        .then((r) => r.json() as Promise<Stats>)
        .then(setStats)
        .catch(() => {});
    load();
    loadStats();
    const poll = setInterval(load, 5000);
    const pollStats = setInterval(loadStats, 120000);
    const tick = setInterval(() => setNow(Date.now()), 1000);
    return () => (clearInterval(poll), clearInterval(pollStats), clearInterval(tick));
  }, []);

  // Type out, hold, delete, pause, repeat (same timing as the Discord banner GIF).
  useEffect(() => {
    let delay = deleting ? 70 : 160;
    if (!deleting && typed === NAME.length) delay = 4000;
    if (deleting && typed === 0) delay = 1200;
    const t = setTimeout(() => {
      if (!deleting && typed === NAME.length) setDeleting(true);
      else if (deleting && typed === 0) setDeleting(false);
      else setTyped(typed + (deleting ? -1 : 1));
    }, delay);
    return () => clearTimeout(t);
  }, [typed, deleting]);

  const act = p?.activities.find((a) => a.type !== 4);
  const avatar = p?.discord_user.avatar
    ? `https://cdn.discordapp.com/avatars/${ID}/${p.discord_user.avatar}.png?size=256`
    : null;
  const start = act?.timestamps?.start;
  const end = act?.timestamps?.end;
  const pct = start && end ? Math.min(100, ((now - start) / (end - start)) * 100) : null;
  const verb = act ? ["Playing", "Streaming", "Listening to", "Watching", "", "Competing in"][act.type] : "";
  const status = p?.discord_status ?? "offline";
  const topPlays = stats?.artists[0]?.plays || 1;

  return (
    <main className="min-h-screen bg-black text-white px-5 py-16 sm:py-24">
      <div className="mx-auto w-full max-w-2xl flex flex-col gap-4 animate-[rise_.6s_ease-out]">
        {/* Header */}
        <header className="flex flex-col items-center text-center gap-5 mb-6">
          <div className="relative">
            {avatar ? (
              <img src={avatar} alt="" className="w-28 h-28 rounded-full ring-1 ring-white/10" />
            ) : (
              <div className="w-28 h-28 rounded-full bg-white/5" />
            )}
            <span
              className="absolute bottom-1.5 right-1.5 w-5 h-5 rounded-full ring-4 ring-black"
              style={{ background: STATUS[status] }}
              title={status}
            />
          </div>
          <h1 className="font-unbounded text-5xl sm:text-6xl font-medium tracking-wide h-16 sm:h-[4.5rem] flex items-center">
            {NAME.slice(0, typed)}
            <span className="inline-block w-[3px] h-[0.8em] bg-white ml-1.5 animate-pulse" />
          </h1>
          <p className="text-sm text-white/45 -mt-2">rust apps · homelab · roblox dev</p>
          <nav className="flex flex-wrap justify-center gap-2 mt-1">
            {LINKS.map(([label, href, icon]) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer noopener"
                aria-label={label}
                title={label}
                className="w-10 h-10 rounded-xl border border-white/[0.08] flex items-center justify-center opacity-70 hover:opacity-100 hover:bg-white/[0.06] hover:-translate-y-0.5 transition"
              >
                {icon === "globe" ? (
                  <Globe size={18} strokeWidth={1.75} />
                ) : (
                  <img src={`https://cdn.simpleicons.org/${icon}/ffffff`} alt="" className="w-[18px] h-[18px]" />
                )}
              </a>
            ))}
          </nav>
        </header>

        {/* Now playing */}
        <Panel className="relative overflow-hidden">
          {act && art(act) && (
            <img
              src={art(act)!}
              alt=""
              aria-hidden
              className="pointer-events-none absolute -inset-10 w-[calc(100%+5rem)] h-[calc(100%+5rem)] object-cover blur-3xl opacity-25 saturate-150"
            />
          )}
          <div className="relative">
          <Label>{act ? `${verb} ${act.name}` : "Now"}</Label>
          {act ? (
            <div className="flex items-center gap-4">
              {art(act) && <img src={art(act)!} alt="" className="w-20 h-20 rounded-xl object-cover ring-1 ring-white/10" />}
              <div className="min-w-0 flex-1">
                <p className="truncate text-lg font-medium">{act.details ?? act.name}</p>
                {act.state && <p className="truncate text-sm text-white/55">{act.state}</p>}
                {pct !== null && start && end && (
                  <div className="mt-3 flex items-center gap-3 text-[11px] text-white/40 font-mono">
                    <span>{clock(now - start)}</span>
                    <div className="flex-1 h-[3px] rounded-full bg-white/10 overflow-hidden">
                      <div className="h-full bg-white transition-[width] duration-1000 ease-linear" style={{ width: `${pct}%` }} />
                    </div>
                    <span>{clock(end - start)}</span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <p className="text-white/45">building something</p>
          )}
          </div>
        </Panel>

        {/* Numbers */}
        <div className="grid grid-cols-3 gap-4">
          {[
            ["All-time plays", fmt(stats?.total)],
            ["This month", fmt(stats?.month)],
            ["Top artist", stats?.artists[0]?.name ?? "—"],
          ].map(([k, v]) => (
            <Panel key={k} className="!p-4">
              <p className="text-[11px] uppercase tracking-[0.2em] text-white/35">{k}</p>
              <p className="mt-1.5 font-unbounded text-lg sm:text-xl truncate" title={v}>{v}</p>
            </Panel>
          ))}
        </div>

        {/* Last 30 days */}
        {stats && stats.days.length > 0 && (
          <Panel>
            <div className="flex items-baseline justify-between">
              <Label>Listening · last 30 days</Label>
              <span className="text-[11px] font-mono text-white/35 -mt-3">
                {fmt(stats.days.reduce((n, d) => n + d.plays, 0))} plays
              </span>
            </div>
            <div className="flex items-end gap-[3px] h-24">
              {stats.days.map((d) => (
                <div key={d.day} className="group relative flex-1 h-full flex items-end">
                  <div
                    className="w-full rounded-sm bg-white/25 group-hover:bg-white transition-colors"
                    // sqrt scale: one huge day (e.g. an import) shouldn't flatten the rest
                    style={{ height: `${Math.max(3, Math.sqrt(d.plays / Math.max(...stats.days.map((x) => x.plays), 1)) * 100)}%` }}
                  />
                  <span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 whitespace-nowrap rounded-md bg-white px-2 py-1 text-[11px] text-black opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    {d.day} · {d.plays}
                  </span>
                </div>
              ))}
            </div>
          </Panel>
        )}

        {/* Charts */}
        <div className="grid sm:grid-cols-2 gap-4">
          <Panel>
            <Label>Top artists · this month</Label>
            <ol className="flex flex-col gap-2.5">
              {(stats?.artists ?? []).map((a, i) => (
                <li key={a.name} className="text-sm">
                  <div className="flex justify-between gap-3">
                    <span className="truncate"><span className="text-white/30 font-mono mr-2">{i + 1}</span>{a.name}</span>
                    <span className="text-white/40 font-mono">{a.plays}</span>
                  </div>
                  <div className="mt-1 h-[2px] rounded-full bg-white/[0.06]">
                    <div className="h-full rounded-full bg-white/60" style={{ width: `${(a.plays / topPlays) * 100}%` }} />
                  </div>
                </li>
              ))}
            </ol>
          </Panel>
          <Panel>
            <Label>Top tracks · this month</Label>
            <ol className="flex flex-col gap-2">
              {(stats?.tracks ?? []).map((t, i) => (
                <li key={t.title + t.artist} className="flex items-baseline gap-2 text-sm min-w-0">
                  <span className="text-white/30 font-mono">{i + 1}</span>
                  <span className="min-w-0 flex-1 truncate">
                    {t.title} <span className="text-white/40">· {t.artist}</span>
                  </span>
                  <span className="text-white/40 font-mono">{t.plays}</span>
                </li>
              ))}
            </ol>
          </Panel>
        </div>

        {/* Recent */}
        <Panel>
          <Label>Recently played</Label>
          <ul className="divide-y divide-white/[0.05]">
            {(stats?.recent ?? []).map((s) => (
              <li key={s.time} className="flex items-baseline gap-3 py-2 text-sm min-w-0">
                <span className="min-w-0 flex-1 truncate">
                  {s.title} <span className="text-white/40">· {s.artist}</span>
                </span>
                <span className="text-white/30 font-mono text-xs">{ago(s.time, now)}</span>
              </li>
            ))}
          </ul>
        </Panel>

        {/* Projects */}
        <Panel>
          <Label>Projects</Label>
          <div className="grid sm:grid-cols-2 gap-2">
            {PROJECTS.map(([name, desc, tag, href]) => (
              <a
                key={name}
                href={href}
                target="_blank"
                rel="noreferrer noopener"
                className="group rounded-xl border border-white/[0.06] px-4 py-3 hover:bg-white/[0.04] hover:border-white/15 transition"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium truncate">{name}</span>
                  <span className="text-[10px] uppercase tracking-widest text-white/35 shrink-0">{tag}</span>
                </div>
                <p className="text-xs text-white/45 mt-0.5 truncate">{desc}</p>
              </a>
            ))}
          </div>
        </Panel>

        <footer className="text-center text-[11px] text-white/25 mt-4">
          presence via lanyard · scrobbles via maloja
        </footer>
      </div>
    </main>
  );
}
