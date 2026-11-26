// GitHub (public no-token proxy) and GitLab (public calendar.json) contributions, cached an hour.
export const revalidate = 3600;

const WEEKS = 26; // half-width columns fit ~26 weeks

async function json<T>(url: string): Promise<T | null> {
  try {
    const r = await fetch(url, { next: { revalidate: 3600 } });
    return r.ok ? ((await r.json()) as T) : null;
  } catch {
    return null;
  }
}

function summarize(counts: Record<string, number>) {
  const days: { date: string; count: number }[] = [];
  const today = new Date();
  // start on a Sunday so the grid's rows are weekdays
  const start = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate() - (WEEKS - 1) * 7 - today.getUTCDay()));
  for (let d = start; d <= today; d = new Date(d.getTime() + 86400000)) {
    const k = d.toISOString().slice(0, 10);
    days.push({ date: k, count: counts[k] ?? 0 });
  }
  let streak = 0;
  for (let i = days.length - 1; i >= 0; i--) {
    if (days[i].count > 0) streak++;
    else if (i !== days.length - 1) break; // an empty today doesn't break it yet
  }
  const max = Math.max(1, ...days.map((d) => d.count));
  return {
    total: days.reduce((n, d) => n + d.count, 0),
    streak,
    active: days.filter((d) => d.count > 0).length,
    days: days.map((d) => (d.count ? Math.ceil((Math.sqrt(d.count / max)) * 4) : 0)),
    dates: days.map((d) => `${d.date} · ${d.count}`),
  };
}

export async function GET() {
  const [gh, gl, ghRepo, glRepo] = await Promise.all([
    json<{ contributions: { date: string; count: number }[] }>("https://github-contributions-api.jogruber.de/v4/veneito?y=last"),
    json<Record<string, number>>("https://gitlab.com/users/rjrussellh03/calendar.json"),
    json<{ stargazers_count: number }>("https://api.github.com/repos/sonorahq/sonora"),
    json<{ star_count: number }>("https://gitlab.com/api/v4/projects/engage-pc-recomp%2Fengage-pc-recomp"),
  ]);
  return Response.json({
    github: gh ? summarize(Object.fromEntries(gh.contributions.map((c) => [c.date, c.count]))) : null,
    gitlab: gl ? summarize(gl) : null,
    stars: { github: ghRepo?.stargazers_count ?? null, gitlab: glRepo?.star_count ?? null },
  });
}
