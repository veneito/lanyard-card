// Music stats from the public Maloja API, cached so page visits don't hit Maloja each time.
const MALOJA = "https://maloja.veneito.dev/apis/mlj_1";

export const revalidate = 120;

type Track = { artists: string[]; title: string };

async function get<T>(path: string): Promise<T | null> {
  try {
    const r = await fetch(`${MALOJA}/${path}`, { next: { revalidate: 120 } });
    if (!r.ok) return null;
    return (await r.json()) as T;
  } catch {
    return null;
  }
}

export async function GET() {
  const d = new Date(Date.now() - 29 * 86400000);
  const since = `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}`;
  const [total, month, artists, tracks, recent, pulse] = await Promise.all([
    get<{ amount: number }>("numscrobbles?in=alltime"),
    get<{ amount: number }>("numscrobbles?in=thismonth"),
    get<{ list: { artist: string; scrobbles: number }[] }>("charts/artists?in=thismonth"),
    get<{ list: { track: Track; scrobbles: number }[] }>("charts/tracks?in=thismonth"),
    get<{ list: { time: number; track: Track }[] }>("scrobbles?perpage=6"),
    get<{ list: { range: { description: string }; scrobbles: number }[] }>(`pulse?step=day&since=${since}`),
  ]);

  return Response.json({
    total: total?.amount ?? null,
    month: month?.amount ?? null,
    artists: (artists?.list ?? []).slice(0, 5).map((a) => ({ name: a.artist, plays: a.scrobbles })),
    tracks: (tracks?.list ?? []).slice(0, 5).map((t) => ({
      title: t.track.title,
      artist: t.track.artists.join(", "),
      plays: t.scrobbles,
    })),
    recent: (recent?.list ?? []).map((s) => ({
      title: s.track.title,
      artist: s.track.artists.join(", "),
      time: s.time,
    })),
    days: (pulse?.list ?? []).map((p) => ({ day: p.range.description, plays: p.scrobbles })),
  });
}
