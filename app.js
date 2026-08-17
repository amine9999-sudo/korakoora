const list = document.querySelector("#liveMatches");

const API_FILE = "data/matches.json";

function formatTime(utc) {
  if (!utc) return "--:--";

  try {
    return new Intl.DateTimeFormat("ar-MA", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "Africa/Casablanca"
    }).format(new Date(utc));
  } catch {
    return "--:--";
  }
}

function safeText(value, fallback = "") {
  if (value === null || value === undefined) return fallback;

  if (typeof value === "object") {
    return (
      value.name ||
      value.shortName ||
      value.tla ||
      fallback
    );
  }

  return String(value);
}

function getTeam(team) {
  if (!team) {
    return {
      name: "فريق",
      logo: ""
    };
  }

  return {
    name: safeText(
      team.name || team.shortName || team.tla,
      "فريق"
    ),
    logo: team.crest || team.logo || team.image || ""
  };
}

function teamLogo(team) {
  if (team.logo) {
    return `
      <img
        class="team-logo"
        src="${team.logo}"
        alt="شعار ${team.name}"
        loading="lazy"
        onerror="this.onerror=null; this.style.display='none';"
      >
    `;
  }

  return `
    <div class="team-logo-placeholder">
      ⚽
    </div>
  `;
}

function getStatus(match) {
  const status = match.status;

  const liveStatuses = [
    "LIVE",
    "IN_PLAY",
    "PAUSED",
    "1H",
    "2H",
    "HT",
    "ET",
    "P"
  ];

  if (liveStatuses.includes(status)) {
    return {
      className: "live",
      icon: "🔴",
      text: "مباشر"
    };
  }

  if (status === "FINISHED") {
    return {
      className: "finished",
      icon: "✓",
      text: "انتهت"
    };
  }

  if (
    status === "POSTPONED" ||
    status === "CANCELLED" ||
    status === "SUSPENDED"
  ) {
    return {
      className: "cancelled",
      icon: "⚠",
      text:
        status === "POSTPONED"
          ? "تأجلت"
          : status === "CANCELLED"
            ? "ألغيت"
            : "متوقفة"
    };
  }

  return {
    className: "upcoming",
    icon: "🕐",
    text: "لم تبدأ"
  };
}

function getScore(match) {
  const score = match.score || {};
  const fullTime = score.fullTime || {};

  const home =
    fullTime.home ??
    match.homeScore ??
    null;

  const away =
    fullTime.away ??
    match.awayScore ??
    null;

  return {
    home,
    away
  };
}

function normalizeMatch(match) {
  const home = getTeam(
    typeof match.home === "object"
      ? match.home
      : {
          name: match.home,
          logo: match.homeLogo
        }
  );

  const away = getTeam(
    typeof match.away === "object"
      ? match.away
      : {
          name: match.away,
          logo: match.awayLogo
        }
  );

  const competition =
    typeof match.competition === "object"
      ? safeText(
          match.competition.name ||
          match.competition.code,
          "بطولة"
        )
      : safeText(
          match.competition,
          "بطولة"
        );

  return {
    ...match,
    home,
    away,
    competition
  };
}

function renderMatch(match) {
  const status = getStatus(match);
  const score = getScore(match);

  let centerContent;

  if (status.className === "finished") {
    centerContent = `
      <div class="match-score">
        <span>${score.home ?? "-"}</span>
        <strong>-</strong>
        <span>${score.away ?? "-"}</span>
      </div>
    `;
  } else {
    centerContent = `
      <div class="match-time">
        ${formatTime(match.utcDate)}
      </div>
    `;
  }

  return `
    <article class="match-card">

      <div class="team-side home-team">
        ${teamLogo(match.home)}
        <span>${match.home.name}</span>
      </div>

      <div class="match-center">

        ${centerContent}

        <div class="match-status ${status.className}">
          <span>${status.icon}</span>
          ${status.text}
        </div>

      </div>

      <div class="team-side away-team">
        ${teamLogo(match.away)}
        <span>${match.away.name}</span>
      </div>

    </article>
  `;
}

function groupByCompetition(matches) {
  const groups = {};

  matches.forEach(match => {
    const name = match.competition || "بطولات أخرى";

    if (!groups[name]) {
      groups[name] = [];
    }

    groups[name].push(match);
  });

  return groups;
}

function renderLeague(name, matches) {
  matches.sort((a, b) => {
    return new Date(a.utcDate || 0) - new Date(b.utcDate || 0);
  });

  return `
    <section class="league-section">

      <div class="league-header">

        <div class="league-title">
          <span class="league-icon">🏆</span>

          <div>
            <h3>${name}</h3>
            <small>${matches.length} مباراة</small>
          </div>
        </div>

      </div>

      <div class="league-matches">
        ${matches.map(renderMatch).join("")}
      </div>

    </section>
  `;
}

async function loadMatches() {
  if (!list) return;

  list.innerHTML = `
    <div class="loading-box">
      <div class="loader"></div>
      <span>جاري تحميل المباريات...</span>
    </div>
  `;

  try {
    const response = await fetch(
      `${API_FILE}?v=${Date.now()}`,
      {
        cache: "no-store"
      }
    );

    if (!response.ok) {
      throw new Error(
        `HTTP ${response.status}`
      );
    }

    const data = await response.json();

    let matches = Array.isArray(data.matches)
      ? data.matches
      : [];

    matches = matches.map(normalizeMatch);

    if (!matches.length) {
      list.innerHTML = `
        <div class="empty">
          <div class="empty-icon">⚽</div>
          <h3>لا توجد مباريات</h3>
          <p>لا توجد مباريات متاحة حاليًا.</p>
        </div>
      `;
      return;
    }

    const groups = groupByCompetition(matches);

    list.innerHTML = Object.entries(groups)
      .map(([name, leagueMatches]) =>
        renderLeague(name, leagueMatches)
      )
      .join("");

  } catch (error) {
    console.error(
      "KoraKoora error:",
      error
    );

    list.innerHTML = `
      <div class="empty error-box">
        <div class="empty-icon">⚠️</div>
        <h3>تعذر تحميل المباريات</h3>
        <p>حاول تحديث الصفحة بعد قليل.</p>
        <button
          class="retry-btn"
          onclick="loadMatches()"
        >
          إعادة المحاولة
        </button>
      </div>
    `;
  }
}

loadMatches();

setInterval(loadMatches, 5 * 60 * 1000);
