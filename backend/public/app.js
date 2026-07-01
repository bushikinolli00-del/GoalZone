const socket = io();

socket.on("liveMatches", (data) => {
  let html = "";

  data.forEach(m => {
    html += `
      <div class="card">
        <div class="league">${m.league.name}</div>

        <div class="match">
          <div class="team">${m.teams.home.name}</div>
          <div class="score">${m.goals.home} - ${m.goals.away}</div>
          <div class="team">${m.teams.away.name}</div>
        </div>

        <div class="status">${m.fixture.status.long} ${m.fixture.status.elapsed || 0}'</div>
      </div>
    `;
  });

  document.getElementById("matches").innerHTML = html;
});

// GOAL ALERT
socket.on("goalEvent", (data) => {
  const popup = document.getElementById("popup");

  popup.classList.remove("hidden");
  popup.innerHTML = `⚽ GOAL!<br>${data.match}<br>${data.score}`;

  setTimeout(() => popup.classList.add("hidden"), 3000);

  const audio = new Audio("https://www.soundjay.com/buttons/sounds/button-3.mp3");
  audio.play();
});

// PWA
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/sw.js");
}
