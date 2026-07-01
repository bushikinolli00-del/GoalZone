async function loadMatches() {
  try {
    const res = await fetch("/api/matches");
    const data = await res.json();

    let html = "";

    data.forEach(m => {
      const home = m.teams?.home?.name;
      const away = m.teams?.away?.name;
      const hg = m.goals?.home ?? 0;
      const ag = m.goals?.away ?? 0;
      const league = m.league?.name;

      html += `
        <div class="card">
          <div class="teams">${home} vs ${away}</div>
          <div class="score">⚽ ${hg} - ${ag}</div>
          <small>${league}</small>
        </div>
      `;
    });

    document.getElementById("matches").innerHTML = html;

  } catch (err) {
    document.getElementById("matches").innerHTML =
      "⚠️ Error loading matches";
  }
}

loadMatches();
setInterval(loadMatches, 5000);
