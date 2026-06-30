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
      <h2>🔴 LIVE NOW</h2>

      {data.matches?.map((m: any) => (
        <div key={m.id} style={{
          background: "#15151c",
          padding: 15,
          marginTop: 10,
          borderRadius: 10
        }}>
          <b>{m.homeTeam.name} vs {m.awayTeam.name}</b>
          <p style={{ color: "#00ff88" }}>
            {m.score?.fullTime?.home ?? 0} - {m.score?.fullTime?.away ?? 0}
          </p>
        </div>
      ))}
    </div>
  );
}
