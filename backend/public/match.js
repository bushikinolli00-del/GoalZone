const id = new URLSearchParams(location.search).get("id");

async function load() {
  const match = await fetch(`/api/match/${id}`).then(r => r.json());
  const lineups = await fetch(`/api/lineups/${id}`).then(r => r.json());

  let html = "";

  // MATCH
  html += `
    <div class="card">
      <h2>${match.teams?.home?.name || ""} vs ${match.teams?.away?.name || ""}</h2>
      <h1>${match.goals?.home ?? 0} - ${match.goals?.away ?? 0}</h1>
      <p>${match.fixture?.status?.long || ""} ${match.fixture?.status?.elapsed || 0}'</p>
    </div>
  `;

  // LINEUPS
  if (lineups.length > 0) {
    html += `<h3>👥 Lineups</h3>`;

    for (let t of lineups) {
      html += `<div class="card">
        <h4>${t.team?.name || ""}</h4>`;

      if (t.startXI) {
        for (let p of t.startXI) {
          html += `<p>🧑 ${p.player?.name || ""}</p>`;
        }
      }

      html += `</div>`;
    }
  } else {
    html += `<p style="color:gray">No lineups yet</p>`;
  }

  // EVENTS
  if (match.events?.length > 0) {
    html += `<h3>📊 Events</h3>`;

    for (let e of match.events) {
      let icon = "⚽";

      if (e.type === "Card" && e.detail === "Yellow Card") icon = "🟨";
      if (e.type === "Card" && e.detail === "Red Card") icon = "🟥";

      html += `
        <div class="card">
          ${icon} ${e.player?.name || "Unknown"} - ${e.detail}
        </div>
      `;
    }
  }

  document.getElementById("match").innerHTML = html;
}

load();
