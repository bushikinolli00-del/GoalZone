const socket = io();

socket.on("liveMatches", (data) => {
  let html = "";

  data.forEach(m => {
    const home = m.teams.home.name;
    const away = m.teams.away.name;

    html += `
      <div class="card">
        <h3>${home} vs ${away}</h3>
        <div class="score">⚽ ${m.goals.home ?? 0} - ${m.goals.away ?? 0}</div>
      </div>
    `;
  });

  document.getElementById("matches").innerHTML = html;
});
