const id = new URLSearchParams(location.search).get("id");

fetch(`/api/match/${id}`)
  .then(res => res.json())
  .then(match => {
    let html = `
      <div class="card">
        <h2>${match.teams.home.name} vs ${match.teams.away.name}</h2>
        <h1>${match.goals.home} - ${match.goals.away}</h1>
        <p>${match.fixture.status.long}</p>
      </div>
    `;

    if (match.events) {
      html += "<h3>Events</h3>";

      match.events.forEach(e => {
        let icon = "⚽";
        if (e.type === "Card" && e.detail === "Yellow Card") icon = "🟨";
        if (e.type === "Card" && e.detail === "Red Card") icon = "🟥";

        html += `<div class="card">${icon} ${e.player.name} - ${e.detail}</div>`;
      });
    }

    document.getElementById("match").innerHTML = html;
  });
