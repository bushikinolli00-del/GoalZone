async function loadMatches() {
  const res = await fetch("/api/matches");
  const data = await res.json();

  let html = "";

  data.forEach(m => {
    const home = m.teams.home.name;
    const away = m.teams.away.name;
    const score = `${m.goals.home ?? 0} - ${m.goals.away ?? 0}`;

    html += `
      <div class="card">
        <div class="live">🔴 LIVE</div>
        <div class="teams">${home} vs ${away}</div>
        <div class="score">⚽ ${score}</div>
      </div>
    `;
  });

  document.getElementById("matches").innerHTML = html;
}

loadMatches();
setInterval(loadMatches, 5000);
