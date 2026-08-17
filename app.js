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
  if (team && team.crest) {
    return `
      <img
        class="team-logo"
        src="${team.crest}"
        alt="${team.name || "شعار الفريق"}"
        loading="lazy"
        onerror="this.style.display='none'"
      >
    `;
  }

  return `<span class="team-logo-placeholder">⚽</span>`;
}

function teamName(team) {
  if (!team) return "فريق";
  return team.shortName || team.name || "فريق";
}

function getScore(match) {
  const score = match.score || {};
  const fullTime = score.fullTime || {};

  const home = fullTime.home;
  const away = fullTime.away;

  if (home !== null && home !== undefined &&
      away !== null && away !== undefined) {
    return `${home} - ${away}`;
  }

  return null;
}

function getStatus(match) {
  const status = match.status;

  if (
    status === "IN_PLAY" ||
    status === "PAUSED"
  ) {
    return "🔴 مباشر";
  }

  if (status === "FINISHED") {
    return "انتهت";
  }

  if (status === "POSTPONED") {
    return "مؤجلة";
  }

  if (status === "CANCELLED") {
    return "ملغاة";
  }

  return "لم تبدأ";
}

async function loadMatches() {
  try {
    const response = await fetch(
      "data/matches.json?time=" + Date.now(),
      { cache: "no-store" }
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

        const home = match.home || {};
        const away = match.away || {};
        const competition = match.competition || {};

        const score = getScore(match);

        let matchTime;

        if (score) {
          matchTime = score;
        } else {
          matchTime = time(match.utcDate);
        }

        const statusText = getStatus(match);

        return `
          <article class="match">

            <div class="team">

              <b>${teamName(home)}</b>

              ${teamLogo(home)}

            </div>

            <div class="time">

              <strong>${matchTime}</strong>

              <small>${statusText}</small>

              <small>
                ${competition.name || "مباراة"}
              </small>

            </div>

            <div class="team">

              ${teamLogo(away)}

              <b>${teamName(away)}</b>

            </div>

          </article>
        `;
      })
      .join("");

  } catch (error) {

    console.error("KoraKoora error:", error);

    list.innerHTML =
      '<div class="empty">تعذر تحميل المباريات حاليًا.</div>';
  }
}

loadMatches();

// تحديث المباريات كل 5 دقائق
setInterval(loadMatches, 5 * 60 * 1000);
