/* =========================================================
   KoraKoora
   نظام عرض مباريات احترافي

   المميزات:
   - أمس / اليوم / غدًا
   - توقيت الزائر تلقائيًا
   - تاريخ المباراة حسب توقيت الزائر
   - اكتشاف دوري بلد الزائر
   - دوري بلد الزائر يظهر أولًا
   - ترتيب البطولات
   - أسماء البطولات بالعربية
   - تحديث تلقائي
   - الضغط على المباراة لفتح صفحة التفاصيل
   - الضغط على البطولة لفتح صفحة الترتيب
   ========================================================= */

/* =========================================================
   الإعدادات
   ========================================================= */

const list = document.querySelector("#liveMatches");

const API_FILE = "data/matches.json";

let selectedDay = "today";

/* =========================================================
   أسماء البطولات
   ========================================================= */

const LEAGUE_NAMES = {

  "Premier League":
    "الدوري الإنجليزي",

  "English Premier League":
    "الدوري الإنجليزي",

  "Primera Division":
    "الدوري الإسباني",

  "La Liga":
    "الدوري الإسباني",

  "Serie A":
    "الدوري الإيطالي",

  "Bundesliga":
    "الدوري الألماني",

  "Ligue 1":
    "الدوري الفرنسي",

  "Primeira Liga":
    "الدوري البرتغالي",

  "Eredivisie":
    "الدوري الهولندي",

  "Jupiler Pro League":
    "الدوري البلجيكي",

  "Super Lig":
    "الدوري التركي",

  "Süper Lig":
    "الدوري التركي",

  "UEFA Champions League":
    "دوري أبطال أوروبا",

  "Champions League":
    "دوري أبطال أوروبا",

  "UEFA Europa League":
    "الدوري الأوروبي",

  "Europa League":
    "الدوري الأوروبي",

  "UEFA Conference League":
    "دوري المؤتمر الأوروبي",

  "Conference League":
    "دوري المؤتمر الأوروبي",

  "Copa Libertadores":
    "كوبا ليبرتادوريس",

  "Copa Sudamericana":
    "كوبا سودأمريكانا",

  "Brasileirão":
    "الدوري البرازيلي",

  "Brazilian Serie A":
    "الدوري البرازيلي",

  "Primera Division Argentina":
    "الدوري الأرجنتيني",

  "Argentine Primera Division":
    "الدوري الأرجنتيني",

  "Primera Division Chile":
    "الدوري التشيلي",

  "MLS":
    "الدوري الأمريكي",

  "Major League Soccer":
    "الدوري الأمريكي",

  "Liga MX":
    "الدوري المكسيكي",

  "Egyptian Premier League":
    "الدوري المصري",

  "Premier League Egypt":
    "الدوري المصري",

  "Botola Pro":
    "الدوري المغربي",

  "Botola":
    "الدوري المغربي",

  "Morocco Botola Pro":
    "الدوري المغربي",

  "Algerian Ligue 1":
    "الدوري الجزائري",

  "Tunisian Ligue Professionnelle 1":
    "الدوري التونسي",

  "South African Premier Division":
    "الدوري الجنوب أفريقي",

  "Saudi Pro League":
    "الدوري السعودي",

  "Saudi Professional League":
    "الدوري السعودي",

  "J1 League":
    "الدوري الياباني",

  "J.League":
    "الدوري الياباني",

  "K League 1":
    "الدوري الكوري",

  "UAE Pro League":
    "الدوري الإماراتي",

  "Qatar Stars League":
    "الدوري القطري",

  "A-League":
    "الدوري الأسترالي",

  "A-League Men":
    "الدوري الأسترالي"

};

/* =========================================================
   أكواد البطولات (لصفحة الترتيب)
   ========================================================= */

const LEAGUE_CODES = {

  "Premier League": "PL",
  "English Premier League": "PL",

  "Primera Division": "PD",
  "La Liga": "PD",

  "Serie A": "SA",

  "Bundesliga": "BL1",

  "Ligue 1": "FL1",

  "Primeira Liga": "PPL",

  "Eredivisie": "DED",

  "Jupiler Pro League": "JPL",

  "Super Lig": "SL",
  "Süper Lig": "SL",

  "UEFA Champions League": "CL",
  "Champions League": "CL",

  "UEFA Europa League": "EL",
  "Europa League": "EL",

  "UEFA Conference League": "ECL",
  "Conference League": "ECL",

  "Copa Libertadores": "CLI",

  "Copa Sudamericana": "CSA",

  "Brasileirão": "BSA",
  "Brazilian Serie A": "BSA",

  "Primera Division Argentina": "APL",
  "Argentine Primera Division": "APL",

  "Primera Division Chile": "CPD",

  "MLS": "MLS",
  "Major League Soccer": "MLS",

  "Liga MX": "LMX",

  "Egyptian Premier League": "EPL",
  "Premier League Egypt": "EPL",

  "Botola Pro": "BP",
  "Botola": "BP",
  "Morocco Botola Pro": "BP",

  "Algerian Ligue 1": "AL1",

  "Tunisian Ligue Professionnelle 1": "TL1",

  "South African Premier Division": "SAPD",

  "Saudi Pro League": "SPL",
  "Saudi Professional League": "SPL",

  "J1 League": "J1",
  "J.League": "J1",

  "K League 1": "KL1",

  "UAE Pro League": "UPL",

  "Qatar Stars League": "QSL",

  "A-League": "AL",
  "A-League Men": "AL"

};

/* =========================================================
   ترتيب البطولات
   ========================================================= */

const LEAGUE_ORDER = [

  "دوري أبطال أوروبا",

  "الدوري الإنجليزي",

  "الدوري الإسباني",

  "الدوري الإيطالي",

  "الدوري الألماني",

  "الدوري الفرنسي",

  "الدوري البرتغالي",

  "الدوري المغربي",

  "الدوري المصري",

  "الدوري السعودي",

  "الدوري الهولندي",

  "الدوري البلجيكي",

  "الدوري التركي",

  "الدوري البرازيلي",

  "الدوري الأرجنتيني",

  "الدوري التشيلي",

  "الدوري الأمريكي",

  "الدوري المكسيكي",

  "الدوري الجزائري",

  "الدوري التونسي",

  "الدوري الجنوب أفريقي",

  "الدوري الياباني",

  "الدوري الكوري",

  "الدوري الإماراتي",

  "الدوري القطري",

  "الدوري الأسترالي",

  "الدوري الأوروبي",

  "دوري المؤتمر الأوروبي",

  "دوري أبطال أفريقيا",

  "دوري أبطال آسيا",

  "كوبا ليبرتادوريس",

  "كوبا سودأمريكانا",

  "التشامبيونشيب"

];

/* =========================================================
   ربط المنطقة الزمنية بدوري البلد
   ========================================================= */

const TIMEZONE_LEAGUES = {

  "Africa/Casablanca":
    "الدوري المغربي",

  "Africa/Cairo":
    "الدوري المصري",

  "Asia/Riyadh":
    "الدوري السعودي",

  "Asia/Dubai":
    "الدوري الإماراتي",

  "Asia/Qatar":
    "الدوري القطري",

  "Asia/Tokyo":
    "الدوري الياباني",

  "Asia/Seoul":
    "الدوري الكوري",

  "Europe/London":
    "الدوري الإنجليزي",

  "Europe/Madrid":
    "الدوري الإسباني",

  "Europe/Rome":
    "الدوري الإيطالي",

  "Europe/Berlin":
    "الدوري الألماني",

  "Europe/Paris":
    "الدوري الفرنسي",

  "Europe/Lisbon":
    "الدوري البرتغالي",

  "Europe/Amsterdam":
    "الدوري الهولندي",

  "Europe/Brussels":
    "الدوري البلجيكي",

  "Europe/Istanbul":
    "الدوري التركي",

  "America/Sao_Paulo":
    "الدوري البرازيلي",

  "America/Argentina/Buenos_Aires":
    "الدوري الأرجنتيني",

  "America/Santiago":
    "الدوري التشيلي",

  "America/Mexico_City":
    "الدوري المكسيكي",

  "America/Toronto":
    "الدوري الأمريكي",

  "America/New_York":
    "الدوري الأمريكي",

  "Africa/Algiers":
    "الدوري الجزائري",

  "Africa/Tunis":
    "الدوري التونسي",

  "Africa/Johannesburg":
    "الدوري الجنوب أفريقي",

  "Australia/Sydney":
    "الدوري الأسترالي"

};

/* =========================================================
   أزرار الأيام
   ========================================================= */

const yesterdayBtn =
  document.querySelector("#yesterdayBtn");

const todayBtn =
  document.querySelector("#todayBtn");

const tomorrowBtn =
  document.querySelector("#tomorrowBtn");

/* =========================================================
   المنطقة الزمنية للزائر
   ========================================================= */

function getUserTimeZone() {

  try {

    return (
      Intl.DateTimeFormat()
        .resolvedOptions()
        .timeZone ||
      "UTC"
    );

  } catch (error) {

    console.warn(
      "Could not detect visitor timezone.",
      error
    );

    return "UTC";

  }

}

/* =========================================================
   دوري بلد الزائر
   ========================================================= */

function getVisitorLeague() {

  const timezone =
    getUserTimeZone();

  return (
    TIMEZONE_LEAGUES[timezone] ||
    null
  );

}

/* =========================================================
   معلومات الزائر
   ========================================================= */

function getVisitorInfo() {

  return {

    timezone:
      getUserTimeZone(),

    league:
      getVisitorLeague()

  };

}

/* =========================================================
   تحويل الوقت إلى توقيت الزائر
   ========================================================= */

function formatTime(utc) {

  if (!utc) {

    return "--:--";

  }

  try {

    return new Intl.DateTimeFormat(
      "ar-MA",
      {

        hour:
          "2-digit",

        minute:
          "2-digit",

        hour12:
          false,

        timeZone:
          getUserTimeZone()

      }
    ).format(
      new Date(utc)
    );

  } catch (error) {

    return "--:--";

  }

}

/* =========================================================
   تنسيق التاريخ
   ========================================================= */

function formatDate(utc) {

  if (!utc) {

    return "--";

  }

  try {

    return new Intl.DateTimeFormat(
      "ar-MA",
      {

        weekday:
          "long",

        year:
          "numeric",

        month:
          "long",

        day:
          "numeric",

        timeZone:
          getUserTimeZone()

      }
    ).format(
      new Date(utc)
    );

  } catch (error) {

    return "--";

  }

}

/* =========================================================
   الحصول على تاريخ المباراة محليًا
   ========================================================= */

function getLocalDateKey(utc) {

  if (!utc) {

    return null;

  }

  try {

    const parts =
      new Intl.DateTimeFormat(
        "en-CA",
        {

          timeZone:
            getUserTimeZone(),

          year:
            "numeric",

          month:
            "2-digit",

          day:
            "2-digit"

        }
      ).formatToParts(
        new Date(utc)
      );

    const year =
      parts.find(
        part =>
          part.type === "year"
      )?.value;

    const month =
      parts.find(
        part =>
          part.type === "month"
      )?.value;

    const day =
      parts.find(
        part =>
          part.type === "day"
      )?.value;

    if (
      !year ||
      !month ||
      !day
    ) {

      return null;

    }

    return `${year}-${month}-${day}`;

  } catch (error) {

    return null;

  }

}

/* =========================================================
   تاريخ اليوم
   ========================================================= */

function getTodayKey() {

  return getLocalDateKey(
    new Date().toISOString()
  );

}

/* =========================================================
   إضافة / طرح يوم
   ========================================================= */

function addDays(
  dateKey,
  amount
) {

  if (!dateKey) {

    return null;

  }

  const parts =
    dateKey
      .split("-")
      .map(Number);

  if (
    parts.length !== 3
  ) {

    return null;

  }

  const date =
    new Date(
      parts[0],
      parts[1] - 1,
      parts[2],
      12,
      0,
      0,
      0
    );

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {

    return null;

  }

  date.setDate(
    date.getDate() + amount
  );

  return [

    date.getFullYear(),

    String(
      date.getMonth() + 1
    ).padStart(2, "0"),

    String(
      date.getDate()
    ).padStart(2, "0")

  ].join("-");

}

/* =========================================================
   التاريخ المحدد
   ========================================================= */

function getSelectedDateKey() {

  const today =
    getTodayKey();

  if (!today) {

    return null;

  }

  if (
    selectedDay ===
    "yesterday"
  ) {

    return addDays(
      today,
      -1
    );

  }

  if (
    selectedDay ===
    "tomorrow"
  ) {

    return addDays(
      today,
      1
    );

  }

  return today;

}

/* =========================================================
   تنظيف النصوص
   ========================================================= */

function safeText(
  value,
  fallback = ""
) {

  if (
    value === null ||
    value === undefined
  ) {

    return fallback;

  }

  if (
    typeof value === "object"
  ) {

    return (

      value.name ||

      value.shortName ||

      value.tla ||

      fallback

    );

  }

  return String(value);

}

/* =========================================================
   معلومات الفريق
   ========================================================= */

function getTeam(team) {

  if (!team) {

    return {

      name:
        "فريق",

      logo:
        ""

    };

  }

  return {

    id:
      team.id || null,

    name:
      safeText(
        team.name ||
        team.shortName ||
        team.tla,
        "فريق"
      ),

    shortName:
      safeText(
        team.shortName ||
        team.name ||
        team.tla,
        "فريق"
      ),

    tla:
      safeText(
        team.tla,
        ""
      ),

    logo:
      team.crest ||
      team.logo ||
      team.image ||
      ""

  };

}

/* =========================================================
   شعار الفريق
   ========================================================= */

function teamLogo(team) {

  if (team.logo) {

    return `

      <img

        class="team-logo"

        src="${team.logo}"

        alt="شعار ${team.name}"

        loading="lazy"

        onerror="
          this.onerror=null;
          this.style.display='none';
        "

      >

    `;

  }

  return `

    <div class="team-logo-placeholder">

      ⚽

    </div>

  `;

}

/* =========================================================
   حالة المباراة
   ========================================================= */

function getStatus(match) {

  const status =
    String(
      match.status || ""
    ).toUpperCase();

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

  if (
    liveStatuses.includes(
      status
    )
  ) {

    return {

      className:
        "live",

      icon:
        "🔴",

      text:
        "مباشر"

    };

  }

  if (
    status ===
    "FINISHED"
  ) {

    return {

      className:
        "finished",

      icon:
        "✓",

      text:
        "انتهت"

    };

  }

  if (

    status ===
      "POSTPONED" ||

    status ===
      "CANCELLED" ||

    status ===
      "SUSPENDED"

  ) {

    return {

      className:
        "cancelled",

      icon:
        "⚠️",

      text:

        status ===
        "POSTPONED"

          ? "تأجلت"

          :

        status ===
        "CANCELLED"

          ? "ألغيت"

          :

          "متوقفة"

    };

  }

  return {

    className:
      "upcoming",

    icon:
      "🕐",

    text:
      "لم تبدأ"

  };

}

/* =========================================================
   النتيجة
   ========================================================= */

function getScore(match) {

  const score =
    match.score || {};

  const fullTime =
    score.fullTime || {};

  return {

    home:
      fullTime.home ??
      match.homeScore ??
      null,

    away:
      fullTime.away ??
      match.awayScore ??
      null

  };

}

/* =========================================================
   توحيد بيانات المباراة
   ========================================================= */

function normalizeMatch(match) {

  const home =
    getTeam(

      typeof match.home ===
      "object"

        ? match.home

        : {

            name:
              match.home,

            logo:
              match.homeLogo

          }

    );

  const away =
    getTeam(

      typeof match.away ===
      "object"

        ? match.away

        : {

            name:
              match.away,

            logo:
              match.awayLogo

          }

    );

  let originalCompetition;

  if (
    typeof match.competition ===
    "object"
  ) {

    originalCompetition =
      safeText(

        match.competition.name ||
        match.competition.code,

        "بطولة"

      );

  } else {

    originalCompetition =
      safeText(

        match.competition,

        "بطولات أخرى"

      );

  }

  const competition =
    LEAGUE_NAMES[
      originalCompetition
    ] ||
    originalCompetition;

  return {

    ...match,

    home,

    away,

    competition,

    originalCompetition

  };

}

/* =========================================================
   فتح تفاصيل المباراة
   ========================================================= */

function openMatchDetails(matchId) {

  if (!matchId) {

    return;

  }

  window.location.href =
    `match.html?id=${encodeURIComponent(
      matchId
    )}`;

}

/* =========================================================
   جعل البطاقة قابلة للضغط
   ========================================================= */

function matchCardAccessibility(
  matchId
) {

  const safeId =
    String(matchId)
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");

  return `

    role="button"

    tabindex="0"

    data-match-id="${safeId}"

    onclick="
      openMatchDetails(
        '${safeId}'
      )
    "

    onkeydown="
      if (
        event.key === 'Enter' ||
        event.key === ' '
      ) {
        event.preventDefault();
        openMatchDetails(
          '${safeId}'
        );
      }
    "

    aria-label="عرض تفاصيل المباراة"

  `;

}

/* =========================================================
   عرض المباراة
   ========================================================= */

function renderMatch(match) {

  const status =
    getStatus(match);

  const score =
    getScore(match);

  let centerContent;

  if (
    status.className ===
    "finished"
  ) {

    centerContent = `

      <div class="match-score">

        <span>
          ${score.home ?? "-"}
        </span>

        <strong>-</strong>

        <span>
          ${score.away ?? "-"}
        </span>

      </div>

    `;

  } else {

    centerContent = `

      <div class="match-time">

        ${formatTime(
          match.utcDate
        )}

      </div>

    `;

  }

  return `

    <article

      class="match-card"

      ${matchCardAccessibility(
        match.id
      )}

    >

      <div class="team-side home-team">

        ${teamLogo(
          match.home
        )}

        <span>
          ${match.home.name}
        </span>

      </div>

      <div class="match-center">

        ${centerContent}

        <div
          class="
            match-status
            ${status.className}
          "
        >

          <span>
            ${status.icon}
          </span>

          ${status.text}

        </div>

        <div class="match-details-hint">

          اضغط للتفاصيل

        </div>

      </div>

      <div class="team-side away-team">

        ${teamLogo(
          match.away
        )}

        <span>
          ${match.away.name}
        </span>

      </div>

    </article>

  `;

}

/* =========================================================
   تجميع المباريات حسب البطولة
   ========================================================= */

function groupByCompetition(
  matches
) {

  const groups = {};

  matches.forEach(
    match => {

      const name =
        match.competition ||
        "بطولات أخرى";

      if (!groups[name]) {

        groups[name] = [];

      }

      groups[name].push(
        match
      );

    }
  );

  return groups;

}

/* =========================================================
   ترتيب البطولات
   ========================================================= */

function sortLeagues(entries) {

  const visitorLeague =
    getVisitorLeague();

  return entries.sort(

    ([nameA], [nameB]) => {

      /*
         دوري بلد الزائر أولًا
      */

      if (
        visitorLeague &&
        nameA ===
        visitorLeague
      ) {

        return -1;

      }

      if (
        visitorLeague &&
        nameB ===
        visitorLeague
      ) {

        return 1;

      }

      /*
         الترتيب المحدد
      */

      const indexA =
        LEAGUE_ORDER.indexOf(
          nameA
        );

      const indexB =
        LEAGUE_ORDER.indexOf(
          nameB
        );

      if (
        indexA !== -1 &&
        indexB !== -1
      ) {

        return (
          indexA - indexB
        );

      }

      if (
        indexA !== -1
      ) {

        return -1;

      }

      if (
        indexB !== -1
      ) {

        return 1;

      }

      return nameA.localeCompare(
        nameB,
        "ar"
      );

    }

  );

}

/* =========================================================
   عرض بطولة
   ========================================================= */

function renderLeague(
  name,
  matches
) {

  matches.sort(

    (a, b) => {

      return (

        new Date(
          a.utcDate || 0
        ) -

        new Date(
          b.utcDate || 0
        )

      );

    }

  );

  const visitorLeague =
    getVisitorLeague();

  const isVisitorLeague =
    visitorLeague &&
    name ===
    visitorLeague;

  /* ===== كود البطولة لصفحة الترتيب ===== */
  const firstMatch = matches[0];
  const originalName = firstMatch?.originalCompetition || "";
  const leagueCode = LEAGUE_CODES[originalName] || "";

  const leagueHeaderContent = `
    <div class="league-title">

      <span class="league-icon">

        ${
          isVisitorLeague
            ? "🌍"
            : "🏆"
        }

      </span>

      <div>

        <h3>
          ${name}
        </h3>

        <small>

          ${matches.length}

          ${
            matches.length === 1
              ? "مباراة"
              : "مباريات"
          }

        </small>

      </div>

    </div>
  `;

  /* إذا عندنا كود البطولة، نخلي الهيدر قابل للنقر */
  const leagueHeader = leagueCode
    ? `<a href="league.html?code=${leagueCode}" class="league-header" style="text-decoration:none;color:inherit;display:block;">${leagueHeaderContent}</a>`
    : `<div class="league-header">${leagueHeaderContent}</div>`;

  return `

    <section

      class="league-section"

      data-league="${name}"

    >

      ${leagueHeader}

      <div class="league-matches">

        ${matches
          .map(renderMatch)
          .join("")}

      </div>

    </section>

  `;

}

/* =========================================================
   تحديث أزرار الأيام
   ========================================================= */

function updateDayButtons() {

  const buttons = [

    {
      element:
        yesterdayBtn,

      value:
        "yesterday"

    },

    {
      element:
        todayBtn,

      value:
        "today"

    },

    {
      element:
        tomorrowBtn,

      value:
        "tomorrow"

    }

  ];

  buttons.forEach(
    ({ element, value }) => {

      if (!element) {

        return;

      }

      element.classList.toggle(

        "selected",

        selectedDay ===
        value

      );

      element.setAttribute(

        "aria-pressed",

        selectedDay ===
        value

          ? "true"

          : "false"

      );

    }

  );

}

/* =========================================================
   تغيير اليوم
   ========================================================= */

function changeDay(day) {

  if (

    day !==
      "yesterday" &&

    day !==
      "today" &&

    day !==
      "tomorrow"

  ) {

    return;

  }

  selectedDay =
    day;

  updateDayButtons();

  loadMatches();

}

/* =========================================================
   ربط الأزرار
   ========================================================= */

function setupDayButtons() {

  if (yesterdayBtn) {

    yesterdayBtn.addEventListener(
      "click",
      () =>
        changeDay(
          "yesterday"
        )
    );

  }

  if (todayBtn) {

    todayBtn.addEventListener(
      "click",
      () =>
        changeDay(
          "today"
        )
    );

  }

  if (tomorrowBtn) {

    tomorrowBtn.addEventListener(
      "click",
      () =>
        changeDay(
          "tomorrow"
        )
    );

  }

  updateDayButtons();

}

/* =========================================================
   رسالة عدم وجود مباريات
   ========================================================= */

function renderEmptyState() {

  const labels = {

    yesterday:
      "أمس",

    today:
      "اليوم",

    tomorrow:
      "غدًا"

  };

  const label =
    labels[selectedDay] ||
    "اليوم";

  list.innerHTML = `

    <div class="empty">

      <div class="empty-icon">
        ⚽
      </div>

      <h3>
        لا توجد مباريات
      </h3>

      <p>

        لا توجد مباريات لـ
        ${label}
        حاليًا.

      </p>

    </div>

  `;

}

/* =========================================================
   تحميل المباريات
   ========================================================= */

async function loadMatches() {

  if (!list) {

    return;

  }

  list.innerHTML = `

    <div class="loading-box">

      <div class="loader"></div>

      <span>
        جاري تحميل المباريات...
      </span>

    </div>

  `;

  try {

    const response =
      await fetch(

        `${API_FILE}?v=${Date.now()}`,

        {

          cache:
            "no-store"

        }

      );

    if (!response.ok) {

      throw new Error(
        `HTTP ${response.status}`
      );

    }

    const data =
      await response.json();

    let matches =

      Array.isArray(
        data.matches
      )

        ? data.matches

        : [];

    /*
       توحيد البيانات
    */

    matches =
      matches.map(
        normalizeMatch
      );

    /*
       تاريخ الزائر
    */

    const targetDate =
      getSelectedDateKey();

    /*
       تصفية المباريات
    */

    matches =
      matches.filter(
        match => {

          const matchDate =
            getLocalDateKey(
              match.utcDate
            );

          return (
            matchDate ===
            targetDate
          );

        }
      );

    /*
       لا توجد مباريات
    */

    if (!matches.length) {

      renderEmptyState();

      return;

    }

    /*
       تجميع حسب البطولة
    */

    const groups =
      groupByCompetition(
        matches
      );

    /*
       ترتيب البطولات
    */

    const sortedGroups =
      sortLeagues(
        Object.entries(
          groups
        )
      );

    /*
       رسم الصفحة
    */

    list.innerHTML =

      sortedGroups

        .map(
          ([name, leagueMatches]) =>
            renderLeague(
              name,
              leagueMatches
            )
        )

        .join("");

  } catch (error) {

    console.error(
      "KoraKoora error:",
      error
    );

    list.innerHTML = `

      <div
        class="empty error-box"
      >

        <div class="empty-icon">
          ⚠️
        </div>

        <h3>
          تعذر تحميل المباريات
        </h3>

        <p>
          حدث خطأ أثناء تحميل البيانات.
        </p>

        <button

          class="retry-btn"

          type="button"

          id="retryMatchesBtn"

        >

          إعادة المحاولة

        </button>

      </div>

    `;

    const retryBtn =
      document.querySelector(
        "#retryMatchesBtn"
      );

    if (retryBtn) {

      retryBtn.addEventListener(
        "click",
        loadMatches
      );

    }

  }

}

/* =========================================================
   التشغيل
   ========================================================= */

setupDayButtons();

loadMatches();

/* =========================================================
   تحديث تلقائي كل 5 دقائق
   ========================================================= */

setInterval(

  loadMatches,

  5 * 60 * 1000

);
