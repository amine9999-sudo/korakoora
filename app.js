/* =========================================================
   KoraKoora - نظام عرض مباريات احترافي (معدل بالفلتر)
   ========================================================= */

const list = document.querySelector("#liveMatches");
const API_FILE = "data/matches.json";
let selectedDay = "today";
let currentFilter = "all";

/* =========================================================
   أسماء البطولات وترتيبها ومناطق زمنية
   ========================================================= */

const LEAGUE_NAMES = {
  "Premier League": "الدوري الإنجليزي",
  "English Premier League": "الدوري الإنجليزي",
  "Primera Division": "الدوري الإسباني",
  "La Liga": "الدوري الإسباني",
  "Serie A": "الدوري الإيطالي",
  "Bundesliga": "الدوري الألماني",
  "Ligue 1": "الدوري الفرنسي",
  "Primeira Liga": "الدوري البرتغالي",
  "Eredivisie": "الدوري الهولندي",
  "Jupiler Pro League": "الدوري البلجيكي",
  "Super Lig": "الدوري التركي",
  "Süper Lig": "الدوري التركي",
  "UEFA Champions League": "دوري أبطال أوروبا",
  "Champions League": "دوري أبطال أوروبا",
  "UEFA Europa League": "الدوري الأوروبي",
  "Europa League": "الدوري الأوروبي",
  "UEFA Conference League": "دوري المؤتمر الأوروبي",
  "Conference League": "دوري المؤتمر الأوروبي",
  "Copa Libertadores": "كوبا ليبرتادوريس",
  "Copa Sudamericana": "كوبا سودأمريكانا",
  "Brasileirão": "الدوري البرازيلي",
  "Brazilian Serie A": "الدوري البرازيلي",
  "Primera Division Argentina": "الدوري الأرجنتيني",
  "Argentine Primera Division": "الدوري الأرجنتيني",
  "Primera Division Chile": "الدوري التشيلي",
  "MLS": "الدوري الأمريكي",
  "Major League Soccer": "الدوري الأمريكي",
  "Liga MX": "الدوري المكسيكي",
  "Egyptian Premier League": "الدوري المصري",
  "Premier League Egypt": "الدوري المصري",
  "Botola Pro": "الدوري المغربي",
  "Botola": "الدوري المغربي",
  "Morocco Botola Pro": "الدوري المغربي",
  "Algerian Ligue 1": "الدوري الجزائري",
  "Tunisian Ligue Professionnelle 1": "الدوري التونسي",
  "South African Premier Division": "الدوري الجنوب أفريقي",
  "Saudi Pro League": "الدوري السعودي",
  "Saudi Professional League": "الدوري السعودي",
  "J1 League": "الدوري الياباني",
  "J.League": "الدوري الياباني",
  "K League 1": "الدوري الكوري",
  "UAE Pro League": "الدوري الإماراتي",
  "Qatar Stars League": "الدوري القطري",
  "A-League": "الدوري الأسترالي",
  "A-League Men": "الدوري الأسترالي"
};

const LEAGUE_ORDER = [
  "دوري أبطال أوروبا", "الدوري الإنجليزي", "الدوري الإسباني", "الدوري الإيطالي",
  "الدوري الألماني", "الدوري الفرنسي", "الدوري البرتغالي", "الدوري المغربي",
  "الدوري المصري", "الدوري السعودي", "الدوري الهولندي", "الدوري البلجيكي",
  "الدوري التركي", "الدوري البرازيلي", "الدوري الأرجنتيني", "الدوري التشيلي",
  "الدوري الأمريكي", "الدوري المكسيكي", "الدوري الجزائري", "الدوري التونسي",
  "الدوري الجنوب أفريقي", "الدوري الياباني", "الدوري الكوري", "الدوري الإماراتي",
  "الدوري القطري", "الدوري الأسترالي", "الدوري الأوروبي", "دوري المؤتمر الأوروبي",
  "دوري أبطال أفريقيا", "دوري أبطال آسيا", "كوبا ليبرتادوريس", "كوبا سودأمريكانا",
  "التشامبيونشيب"
];

const TIMEZONE_LEAGUES = {
  "Africa/Casablanca": "الدوري المغربي",
  "Africa/Cairo": "الدوري المصري",
  "Asia/Riyadh": "الدوري السعودي",
  "Asia/Dubai": "الدوري الإماراتي",
  "Asia/Qatar": "الدوري القطري",
  "Asia/Tokyo": "الدوري الياباني",
  "Asia/Seoul": "الدوري الكوري",
  "Europe/London": "الدوري الإنجليزي",
  "Europe/Madrid": "الدوري الإسباني",
  "Europe/Rome": "الدوري الإيطالي",
  "Europe/Berlin": "الدوري الألماني",
  "Europe/Paris": "الدوري الفرنسي",
  "Europe/Lisbon": "الدوري البرتغالي",
  "Europe/Amsterdam": "الدوري الهولندي",
  "Europe/Brussels": "الدوري البلجيكي",
  "Europe/Istanbul": "الدوري التركي",
  "America/Sao_Paulo": "الدوري البرازيلي",
  "America/Argentina/Buenos_Aires": "الدوري الأرجنتيني",
  "America/Santiago": "الدوري التشيلي",
  "America/Mexico_City": "الدوري المكسيكي",
  "America/Toronto": "الدوري الأمريكي",
  "America/New_York": "الدوري الأمريكي",
  "Africa/Algiers": "الدوري الجزائري",
  "Africa/Tunis": "الدوري التونسي",
  "Africa/Johannesburg": "الدوري الجنوب أفريقي",
  "Australia/Sydney": "الدوري الأسترالي"
};

/* =========================================================
   دوال المساعدة
   ========================================================= */

const yesterdayBtn = document.querySelector("#yesterdayBtn");
const todayBtn = document.querySelector("#todayBtn");
const tomorrowBtn = document.querySelector("#tomorrowBtn");

function getUserTimeZone() {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  } catch (error) {
    return "UTC";
  }
}

function getVisitorLeague() {
  return TIMEZONE_LEAGUES[getUserTimeZone()] || null;
}

function getLocalDateKey(utc) {
  if (!utc) return null;
  try {
    const parts = new Intl.DateTimeFormat("en-CA", {
      timeZone: getUserTimeZone(),
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    }).formatToParts(new Date(utc));
    const year = parts.find(part => part.type === "year")?.value;
    const month = parts.find(part => part.type === "month")?.value;
    const day = parts.find(part => part.type === "day")?.value;
    if (!year || !month || !day) return null;
    return `${year}-${month}-${day}`;
  } catch (error) {
    return null;
  }
}

function getTodayKey() {
  return getLocalDateKey(new Date().toISOString());
}

function addDays(dateKey, amount) {
  if (!dateKey) return null;
  const parts = dateKey.split("-").map(Number);
  if (parts.length !== 3) return null;
  const date = new Date(parts[0], parts[1] - 1, parts[2], 12, 0, 0, 0);
  if (Number.isNaN(date.getTime())) return null;
  date.setDate(date.getDate() + amount);
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0")
  ].join("-");
}

function getSelectedDateKey() {
  const today = getTodayKey();
  if (!today) return null;
  if (selectedDay === "yesterday") return addDays(today, -1);
  if (selectedDay === "tomorrow") return addDays(today, 1);
  return today;
}

function safeText(value, fallback = "") {
  if (value === null || value === undefined) return fallback;
  if (typeof value === "object") return value.name || value.shortName || value.tla || fallback;
  return String(value);
}

function getTeam(team) {
  if (!team) return { name: "فريق", logo: "" };
  return {
    id: team.id || null,
    name: safeText(team.name || team.shortName || team.tla, "فريق"),
    shortName: safeText(team.shortName || team.name || team.tla, "فريق"),
    tla: safeText(team.tla, ""),
    logo: team.crest || team.logo || team.image || ""
  };
}

function teamLogo(team) {
  if (team.logo) {
    return `<img class="team-logo" src="${team.logo}" alt="شعار ${team.name}" loading="lazy" onerror="this.onerror=null;this.style.display='none';">`;
  }
  return `<div class="team-logo-placeholder">⚽</div>`;
}

function getStatus(match) {
  const status = String(match.status || "").toUpperCase();
  const liveStatuses = ["LIVE", "IN_PLAY", "PAUSED", "1H", "2H", "HT", "ET", "P"];
  if (liveStatuses.includes(status)) {
    return { className: "live", icon: "🔴", text: "مباشر" };
  }
  if (status === "FINISHED") {
    return { className: "finished", icon: "✓", text: "انتهت" };
  }
  if (status === "POSTPONED" || status === "CANCELLED" || status === "SUSPENDED") {
    return {
      className: "cancelled",
      icon: "⚠️",
      text: status === "POSTPONED" ? "تأجلت" : status === "CANCELLED" ? "ألغيت" : "متوقفة"
    };
  }
  return { className: "upcoming", icon: "🕐", text: "لم تبدأ" };
}

function getScore(match) {
  const score = match.score || {};
  const fullTime = score.fullTime || {};
  return {
    home: fullTime.home ?? match.homeScore ?? null,
    away: fullTime.away ?? match.awayScore ?? null
  };
}

function normalizeMatch(match) {
  const home = getTeam(typeof match.home === "object" ? match.home : { name: match.home, logo: match.homeLogo });
  const away = getTeam(typeof match.away === "object" ? match.away : { name: match.away, logo: match.awayLogo });
  let originalCompetition;
  if (typeof match.competition === "object") {
    originalCompetition = safeText(match.competition.name || match.competition.code, "بطولة");
  } else {
    originalCompetition = safeText(match.competition, "بطولات أخرى");
  }
  const competition = LEAGUE_NAMES[originalCompetition] || originalCompetition;
  return {
    ...match,
    home,
    away,
    competition,
    originalCompetition,
    leagueCode: match.competition?.code || null
  };
}

function formatTime(utc) {
  if (!utc) return "--:--";
  try {
    return new Intl.DateTimeFormat("ar-MA", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: getUserTimeZone()
    }).format(new Date(utc));
  } catch (error) {
    return "--:--";
  }
}

function openMatchDetails(matchId) {
  if (!matchId) return;
  window.location.href = `match.html?id=${encodeURIComponent(matchId)}`;
}

function matchCardAccessibility(matchId) {
  const safeId = String(matchId).replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  return `
    role="button"
    tabindex="0"
    data-match-id="${safeId}"
    onclick="openMatchDetails('${safeId}')"
    onkeydown="if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); openMatchDetails('${safeId}'); }"
    aria-label="عرض تفاصيل المباراة"
  `;
}

/* =========================================================
   عرض المباراة (بدون عداد تنازلي)
   ========================================================= */

function renderMatch(match) {
  const status = getStatus(match);
  const score = getScore(match);

  let centerContent;
  if (status.className === "finished" || score.home !== null) {
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
    <article
      class="match-card"
      ${matchCardAccessibility(match.id)}
      data-league-code="${match.leagueCode || ''}"
      data-utc-date="${match.utcDate || ''}"
      data-status="${match.status || 'TIMED'}"
    >
      <div class="team-side home-team">
        ${teamLogo(match.home)}
        <span>${match.home.name}</span>
      </div>

      <div class="match-center">
        ${centerContent}

        <div class="match-status ${status.className}">
          <span>${status.icon}</span> ${status.text}
        </div>

        <div class="match-details-hint">اضغط للتفاصيل</div>
      </div>

      <div class="team-side away-team">
        ${teamLogo(match.away)}
        <span>${match.away.name}</span>
      </div>
    </article>
  `;
}

/* =========================================================
   تجميع وترتيب وعرض البطولات
   ========================================================= */

function groupByCompetition(matches) {
  const groups = {};
  matches.forEach(match => {
    const name = match.competition || "بطولات أخرى";
    if (!groups[name]) groups[name] = [];
    groups[name].push(match);
  });
  return groups;
}

function sortLeagues(entries) {
  const visitorLeague = getVisitorLeague();
  return entries.sort(([nameA], [nameB]) => {
    if (visitorLeague && nameA === visitorLeague) return -1;
    if (visitorLeague && nameB === visitorLeague) return 1;
    const indexA = LEAGUE_ORDER.indexOf(nameA);
    const indexB = LEAGUE_ORDER.indexOf(nameB);
    if (indexA !== -1 && indexB !== -1) return indexA - indexB;
    if (indexA !== -1) return -1;
    if (indexB !== -1) return 1;
    return nameA.localeCompare(nameB, "ar");
  });
}

function renderLeague(name, matches) {
  matches.sort((a, b) => new Date(a.utcDate || 0) - new Date(b.utcDate || 0));
  const visitorLeague = getVisitorLeague();
  const isVisitorLeague = visitorLeague && name === visitorLeague;
  return `
    <section class="league-section" data-league="${name}">
      <div class="league-header">
        <div class="league-title">
          <span class="league-icon">${isVisitorLeague ? "🌍" : "🏆"}</span>
          <div>
            <h3>${name}</h3>
            <small>${matches.length} ${matches.length === 1 ? "مباراة" : "مباريات"}</small>
          </div>
        </div>
      </div>
      <div class="league-matches">
        ${matches.map(renderMatch).join("")}
      </div>
    </section>
  `;
}

/* =========================================================
   أزرار الأيام
   ========================================================= */

function updateDayButtons() {
  const buttons = [
    { element: yesterdayBtn, value: "yesterday" },
    { element: todayBtn, value: "today" },
    { element: tomorrowBtn, value: "tomorrow" }
  ];
  buttons.forEach(({ element, value }) => {
    if (!element) return;
    element.classList.toggle("selected", selectedDay === value);
    element.setAttribute("aria-pressed", selectedDay === value ? "true" : "false");
  });
}

function changeDay(day) {
  if (day !== "yesterday" && day !== "today" && day !== "tomorrow") return;
  selectedDay = day;
  updateDayButtons();
  loadMatches();
}

function setupDayButtons() {
  if (yesterdayBtn) yesterdayBtn.addEventListener("click", () => changeDay("yesterday"));
  if (todayBtn) todayBtn.addEventListener("click", () => changeDay("today"));
  if (tomorrowBtn) tomorrowBtn.addEventListener("click", () => changeDay("tomorrow"));
  updateDayButtons();
}

/* =========================================================
   أزرار تصفية البطولات (NEW)
   ========================================================= */

function setupFilterButtons() {
  const filterBtns = document.querySelectorAll(".filter-btn");
  if (!filterBtns.length) {
    console.warn("⚠️ أزرار الفلتر غير موجودة في الـ HTML. تأكد من إضافتها.");
    return;
  }

  filterBtns.forEach(btn => {
    btn.addEventListener("click", function () {
      const filter = this.dataset.league || "all";
      currentFilter = filter;
      filterBtns.forEach(b => b.classList.remove("active"));
      this.classList.add("active");
      applyFilter(filter);
    });
  });

  // تفعيل زر "الكل" افتراضياً
  const allBtn = document.querySelector('.filter-btn[data-league="all"]');
  if (allBtn) allBtn.classList.add("active");
}

function applyFilter(filter) {
  const allCards = document.querySelectorAll(".match-card");
  const allSections = document.querySelectorAll(".league-section");

  if (filter === "all") {
    allSections.forEach(section => section.style.display = "");
    allCards.forEach(card => card.style.display = "");
    return;
  }

  // إخفاء الكل أولاً
  allSections.forEach(section => section.style.display = "none");
  allCards.forEach(card => card.style.display = "none");

  // إظهار البطاقات التي تطابق الفلتر
  let hasVisible = false;
  allCards.forEach(card => {
    const cardLeague = card.dataset.leagueCode || "";
    if (cardLeague === filter) {
      card.style.display = "";
      hasVisible = true;
      const parentSection = card.closest(".league-section");
      if (parentSection) parentSection.style.display = "";
    }
  });

  // إذا لم توجد أي مباراة، نعرض رسالة
  if (!hasVisible) {
    const emptyMessage = document.createElement("div");
    emptyMessage.className = "empty";
    emptyMessage.innerHTML = `<div class="empty-icon">⚽</div><h3>لا توجد مباريات</h3><p>لا توجد مباريات لهذه البطولة في هذا اليوم.</p>`;
    // نضيفها بعد آخر قسم
    const lastSection = allSections[allSections.length - 1];
    if (lastSection) {
      lastSection.after(emptyMessage);
    }
  } else {
    // حذف رسالة "لا توجد مباريات" إن وجدت
    document.querySelectorAll(".empty:not(.empty-initial)").forEach(el => el.remove());
  }
}

/* =========================================================
   رسالة عدم وجود مباريات
   ========================================================= */

function renderEmptyState() {
  const labels = { yesterday: "أمس", today: "اليوم", tomorrow: "غدًا" };
  const label = labels[selectedDay] || "اليوم";
  list.innerHTML = `
    <div class="empty empty-initial">
      <div class="empty-icon">⚽</div>
      <h3>لا توجد مباريات</h3>
      <p>لا توجد مباريات لـ ${label} حاليًا.</p>
    </div>
  `;
}

/* =========================================================
   تحميل المباريات
   ========================================================= */

async function loadMatches() {
  if (!list) return;
  list.innerHTML = `<div class="loading-box"><div class="loader"></div><span>جاري تحميل المباريات...</span></div>`;

  try {
    const response = await fetch(`${API_FILE}?v=${Date.now()}`, { cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const data = await response.json();
    let matches = Array.isArray(data.matches) ? data.matches : [];
    matches = matches.map(normalizeMatch);

    const targetDate = getSelectedDateKey();
    matches = matches.filter(match => {
      const matchDate = getLocalDateKey(match.utcDate);
      return matchDate === targetDate;
    });

    if (!matches.length) {
      renderEmptyState();
      return;
    }

    const groups = groupByCompetition(matches);
    const sortedGroups = sortLeagues(Object.entries(groups));

    list.innerHTML = sortedGroups
      .map(([name, leagueMatches]) => renderLeague(name, leagueMatches))
      .join("");

    // تطبيق الفلتر الحالي
    applyFilter(currentFilter);

  } catch (error) {
    console.error("KoraKoora error:", error);
    list.innerHTML = `
      <div class="empty error-box">
        <div class="empty-icon">⚠️</div>
        <h3>تعذر تحميل المباريات</h3>
        <p>حدث خطأ أثناء تحميل البيانات.</p>
        <button class="retry-btn" type="button" id="retryMatchesBtn">إعادة المحاولة</button>
      </div>
    `;
    const retryBtn = document.querySelector("#retryMatchesBtn");
    if (retryBtn) retryBtn.addEventListener("click", loadMatches);
  }
}

/* =========================================================
   التشغيل
   ========================================================= */

setupDayButtons();
setupFilterButtons(); // مهم جداً!
loadMatches();
setInterval(loadMatches, 5 * 60 * 1000);
