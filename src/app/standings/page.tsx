const API = "https://api.football-data.org/v4";

async function getStandings() {
  const res = await fetch(`${API}/competitions/PL/standings`, {
    headers: {
      "X-Auth-Token": process.env.FOOTBALL_API_KEY!,
    },
    cache: "no-store",
  });

  return res.json();
}

export default async function StandingsPage() {
  const data = await getStandings();

  return (
    <div style={{ padding: 20 }}>
      <h2>🏆 Standings</h2>

      {data.standings?.[0]?.table?.map((t: any) => (
        <div key={t.team.id} style={{
          padding: 8,
          borderBottom: "1px solid #222"
        }}>
          {t.position}. {t.team.name} — {t.points} pts
        </div>
      ))}
    </div>
  );
}
