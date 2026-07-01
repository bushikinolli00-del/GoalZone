async function loadMatches() {
  const res = await fetch("/api/matches");
  const data = await res.json();

  let html = "";

  data.forEach(m => {
    html += `
      <div class="card">
        <div>${m.teams.home.name} vs ${m.teams.away.name}</div>
        <div class="score">⚽ ${m.goals.home} - ${m.goals.away}</div>
      </div>
    `;
  });

  document.getElementById("matches").innerHTML = html;
}

loadMatches();
setInterval(loadMatches, 5000);
