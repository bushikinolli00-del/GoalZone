async function loadMatches() {
  try {
    const res = await fetch("/api/matches");
    const data = await res.json();

    let html = "";

    data.forEach(m => {
      const home = m.teams?.home?.name || "Home";
      const away = m.teams?.away?.name || "Away";
      const hg = m.goals?.home ?? 0;
      const ag = m.goals?.away ?? 0;
      const league = m.league?.name || "";

      html += `
        <div class="card">
          <div class="league">${league}</div>

          <div class="match">
            <div class="team">${home}</div>

            <div class="score">
              <span>${hg}</span>
              <span class="vs">-</span>
              <span>${ag}</span>
            </div>

            <div class="team">${away}</div>
          </div>
        </div>
      `;
    });

    document.getElementById("matches").innerHTML = html;

  } catch (err) {
    document.getElementById("matches").innerHTML =
      "⚠️ Error loading matches";
  }
}

// first load
loadMatches();

// refresh every 5 sec (LIVE FEEL)
setInterval(loadMatches, 5000);
