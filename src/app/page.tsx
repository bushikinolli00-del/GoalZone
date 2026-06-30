export default function Home() {
  const matches = [
    { home: "Man United", away: "Chelsea", score: "1 - 0", minute: "67'", status: "LIVE" },
    { home: "Real Madrid", away: "Barcelona", score: "2 - 2", minute: "81'", status: "LIVE" },
  ];

  return (
    <div style={{ padding: 20 }}>
      <h2>🔴 Live Matches</h2>

      {matches.map((m, i) => (
        <div key={i} style={{
          background: "#15151c",
          padding: 15,
          marginTop: 10,
          borderRadius: 10
        }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>{m.minute}</span>
            <span style={{ color: "red" }}>{m.status}</span>
          </div>

          <h3>{m.home} vs {m.away}</h3>
          <b style={{ color: "#00ff88" }}>{m.score}</b>
        </div>
      ))}
    </div>
  );
}
