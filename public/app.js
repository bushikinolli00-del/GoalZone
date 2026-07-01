const API_URL = "https://goalzone-2.onrender.com/api/matches";

async function loadMatches() {
  try {
    const res = await fetch(API_URL);
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
          <h3>${home} vs ${away}</h3>
          <div class="score">⚽ ${hg} - ${ag}</div>
        </div>
      `;
    });

    document.getElementById("matches").innerHTML = html;

  } catch (err) {
    document.getElementById("matches").innerHTML =
      "<p>⚠️ Error loading matches</p>";
    console.log(err);
  }
}

loadMatches();
setInterval(loadMatches, 7000);
