"use client";

import { useEffect, useState } from "react";

const ID = "968673369077727262";
const NAME = "veneito";

const LINKS: [string, string, string][] = [
  ["GitHub", "https://github.com/veneito", "github"],
  ["Website", "https://www.veneito.dev", "googlechrome"],
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

export default function Home() {
  const [p, setP] = useState<Presence | null>(null);
  const [typed, setTyped] = useState(0);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const load = () =>
      fetch(`https://api.lanyard.rest/v1/users/${ID}`)
        .then((r) => r.json())
        .then((j) => j.success && setP(j.data))
        .catch(() => {});
    load();
    const poll = setInterval(load, 5000);
    const tick = setInterval(() => setNow(Date.now()), 1000);
    return () => (clearInterval(poll), clearInterval(tick));
  }, []);

  useEffect(() => {
    if (typed >= NAME.length) return;
    const t = setTimeout(() => setTyped(typed + 1), 160);
    return () => clearTimeout(t);
  }, [typed]);

  const act = p?.activities.find((a) => a.type !== 4);
  const avatar = p?.discord_user.avatar
    ? `https://cdn.discordapp.com/avatars/${ID}/${p.discord_user.avatar}.png?size=256`
    : null;
  const start = act?.timestamps?.start;
  const end = act?.timestamps?.end;
  const pct = start && end ? Math.min(100, ((now - start) / (end - start)) * 100) : null;
  const verb = act ? ["Playing", "Streaming", "Listening to", "Watching", "", "Competing in"][act.type] : "";

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-md flex flex-col items-center gap-8">
        <div className="relative">
          {avatar ? (
            <img src={avatar} alt="" className="w-28 h-28 rounded-full border border-white/10" />
          ) : (
            <div className="w-28 h-28 rounded-full bg-white/5" />
          )}
          <span
            className="absolute bottom-1 right-1 w-5 h-5 rounded-full border-4 border-black"
            style={{ background: STATUS[p?.discord_status ?? "offline"] }}
            title={p?.discord_status ?? "offline"}
          />
        </div>

        <h1 className="font-unbounded text-5xl font-medium tracking-wide h-14">
          {NAME.slice(0, typed)}
          <span className="inline-block w-[3px] h-10 bg-white ml-1 align-[-4px] animate-pulse" />
        </h1>

        <p className="text-sm text-white/50 text-center -mt-4">
          rust apps · homelab · roblox dev
        </p>

        <div className="w-full rounded-xl border border-white/10 bg-white/[0.03] p-4 min-h-[96px] flex items-center gap-4">
          {act ? (
            <>
              {art(act) && <img src={art(act)!} alt="" className="w-16 h-16 rounded-lg object-cover" />}
              <div className="min-w-0 flex-1">
                <p className="text-xs text-white/40 uppercase tracking-widest">
                  {verb} {act.name}
                </p>
                <p className="truncate font-medium">{act.details ?? act.name}</p>
                {act.state && <p className="truncate text-sm text-white/60">{act.state}</p>}
                {pct !== null && start && end && (
                  <div className="mt-2 flex items-center gap-2 text-[11px] text-white/40 font-mono">
                    <span>{clock(now - start)}</span>
                    <div className="flex-1 h-1 rounded bg-white/10">
                      <div className="h-1 rounded bg-white" style={{ width: `${pct}%` }} />
                    </div>
                    <span>{clock(end - start)}</span>
                  </div>
                )}
              </div>
            </>
          ) : (
            <p className="w-full text-center text-sm text-white/40">building something</p>
          )}
        </div>

        <nav className="flex flex-wrap justify-center gap-3">
          {LINKS.map(([label, href, icon]) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noreferrer noopener"
              aria-label={label}
              title={label}
              className="w-11 h-11 rounded-lg border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors"
            >
              {icon === "namemc" ? (
                <span className="font-unbounded text-xs">MC</span>
              ) : (
                <img src={`https://cdn.simpleicons.org/${icon}/ffffff`} alt="" className="w-5 h-5" />
              )}
            </a>
          ))}
        </nav>
      </div>
    </main>
  );
}
