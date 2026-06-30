const API = "https://api.football-data.org/v4";

async function getLive() {
  const res = await fetch(`${API}/matches?status=LIVE`, {
    headers: {
      "X-Auth-Token": process.env.FOOTBALL_API_KEY!,
    },
    cache: "no-store",
  });

  return res.json();
}

export default async function LivePage() {
  const data = await getLive();

  return (
    <div style={{ padding: 20 }}>
      <h1>🔴 LIVE MATCHES</h1>

      {data.matches?.map((m: any) => (
        <div key={m.id} style={{ background: "#111", padding: 10, marginTop: 10 }}>
          <b>{m.homeTeam.name} vs {m.awayTeam.name}</b>
          <p>{m.status}</p>
        </div>
      ))}
    </div>
  );
}
