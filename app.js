const list = document.querySelector("#liveMatches");

function time(utc) {
  if (!utc) return "--:--";

  return new Intl.DateTimeFormat("ar-MA", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Africa/Casablanca"
  }).format(new Date(utc));
}

function teamLogo(team) {
  if (team.logo) {
    return `
      <img
        class="team-logo"
        src="${team.logo}"
        alt="${team.name || "شعار الفريق"}"
        loading="lazy"
        onerror="this.style.display='none'"
      >
    `;
  }

  return `<span class="team-logo-placeholder">⚽</span>`;
}

async function loadMatches() {
  try {
    const response = await fetch(
      "data/matches.json?time=" + Date.now()
    );

    if (!response.ok) {
      throw new Error("Failed to load matches");
    }

    const data = await response.json();
    const matches = data.matches || [];

    if (!matches.length) {
      list.innerHTML =
        '<div class="empty">لا توجد مباريات متاحة حاليًا.</div>';
      return;
    }

    list.innerHTML = matches
      .slice(0, 50)
      .map(match => {

        const home = {
          name: match.home,
          logo: match.homeLogo
        };

        const away = {
          name: match.away,
          logo: match.awayLogo
        };

        let matchTime;

        if (match.status === "FINISHED") {
          matchTime =
            `${match.homeScore ?? "-"} - ${match.awayScore ?? "-"}`;
        } else {
          matchTime = time(match.utcDate);
        }

        let statusText;

        if (match.status === "LIVE") {
          statusText = "🔴 مباشر";
        } else if (match.status === "FINISHED") {
          statusText = "انتهت";
        } else {
          statusText = "لم تبدأ";
        }

        return `
          <article class="match">

            <div class="team">

              <b>${home.name || "فريق"}</b>

              ${teamLogo(home)}

            </div>

            <div class="time">

              <strong>${matchTime}</strong>

              <small>${statusText}</small>

              <small>
                ${match.competition || "مباراة"}
              </small>

            </div>

            <div class="team">

              ${teamLogo(away)}

              <b>${away.name || "فريق"}</b>

            </div>

          </article>
        `;
      })
      .join("");

  } catch (error) {

    console.error(error);

    list.innerHTML =
      '<div class="empty">تعذر تحميل المباريات حاليًا.</div>';
  }
}

loadMatches();
