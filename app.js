"use strict";

/* =========================================================
   KoraKoora - Matches App
   ========================================================= */

const list = document.querySelector("#liveMatches");

const API_FILE = "data/matches.json";

const TIME_ZONE = "Africa/Casablanca";

const REFRESH_INTERVAL = 5 * 60 * 1000;


/* =========================================================
   1. إعداد أسماء وترتيب الدوريات
   ========================================================= */

/*
  غيّر الأسماء هنا فقط إذا أردت تغيير اسم أي دوري.

  "الاسم القادم من API" : "الاسم الذي سيظهر للمستخدم"
*/

const LEAGUE_NAMES = {
  "Premier League": "Premier League",
  "Championship": "Championship",
  "La Liga": "La Liga",
  "Primera Division": "La Liga",
  "Serie A": "Serie A",
  "Bundesliga": "Bundesliga",
  "Ligue 1": "Ligue 1",

  "Primeira Liga": "Primeira Liga",

  "Campeonato Brasileiro Série A":
    "Campeonato Brasileiro Série A",

  "Copa Libertadores":
    "Copa Libertadores",

  "UEFA Champions League":
    "UEFA Champions League",

  "UEFA Europa League":
    "UEFA Europa League",

  "UEFA Conference League":
    "UEFA Conference League"
};


/*
  ترتيب ظهور الدوريات.

  يمكنك تغيير الترتيب من هنا فقط.
*/

const LEAGUE_ORDER = [
  "Premier League",
  "La Liga",
  "Serie A",
  "Bundesliga",
  "Ligue 1",
  "Championship",
  "Primeira Liga",
  "Campeonato Brasileiro Série A",
  "Copa Libertadores",
  "UEFA Champions League",
  "UEFA Europa League",
  "UEFA Conference League"
];


/* =========================================================
   2. الحالة الحالية
   ========================================================= */

let allMatches = [];

let selectedDay = "today";


/* =========================================================
   3. أدوات عامة
   ========================================================= */

function safeText(value, fallback = "") {
  if (value === null || value === undefined) {
    return fallback;
  }

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


function escapeHTML(value) {
  return safeText(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}


/* =========================================================
   4. الوقت - توقيت المغرب
   ========================================================= */

function formatTime(utc) {
  if (!utc) {
    return "--:--";
  }

  const date = new Date(utc);

  if (Number.isNaN(date.getTime())) {
    return "--:--";
  }

  try {
    return new Intl.DateTimeFormat("ar-MA", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: TIME_ZONE
    }).format(date);
  } catch {
    return "--:--";
  }
}


/* =========================================================
   5. الحصول على تاريخ المباراة في المغرب
   ========================================================= */

function getCasablancaDateKey(dateInput) {
  if (!dateInput) {
    return null;
  }

  const date = new Date(dateInput);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  try {
    const parts = new Intl.DateTimeFormat("en-CA", {
      timeZone: TIME_ZONE,
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    }).formatToParts(date);

    const values = {};

    parts.forEach(part => {
      if (part.type !== "literal") {
        values[part.type] = part.value;
      }
    });

    if (
      !values.year ||
      !values.month ||
      !values.day
    ) {
      return null;
    }

    return `${values.year}-${values.month}-${values.day}`;

  } catch {
    return null;
  }
}


/* =========================================================
   6. تاريخ اليوم في المغرب
   ========================================================= */

function getTodayKey() {
  return getCasablancaDateKey(new Date());
}


/* =========================================================
   7. إضافة / طرح يوم
   ========================================================= */

function shiftDateKey(dateKey, amount) {
  if (!dateKey) {
    return null;
  }

  const parts = dateKey.split("-").map(Number);

  if (parts.length !== 3) {
    return null;
  }

  const [year, month, day] = parts;

  const date = new Date(
    Date.UTC(
      year,
      month - 1,
      day,
      12,
      0,
      0
    )
  );

  date.setUTCDate(
    date.getUTCDate() + amount
  );

  return date.toISOString().slice(0, 10);
}


/* =========================================================
   8. تواريخ أمس / اليوم / غدًا
   ========================================================= */

function getDayKey(type) {
  const today = getTodayKey();

  if (type === "yesterday") {
    return shiftDateKey(today, -1);
  }

  if (type === "tomorrow") {
    return shiftDateKey(today, 1);
  }

  return today;
}


/* =========================================================
   9. معلومات الفريق
   ========================================================= */

function getTeam(team) {
  if (!team) {
    return {
      name: "فريق",
      logo: ""
    };
  }

  return {
    name: safeText(
      team.name ||
      team.shortName ||
      team.tla,
      "فريق"
    ),

    logo:
      team.crest ||
      team.logo ||
      team.image ||
      ""
  };
}


/* =========================================================
   10. شعار الفريق
   ========================================================= */

function teamLogo(team) {
  const name = escapeHTML(team.name);

  const logo = safeText(team.logo);

  if (logo) {
    return `
      <img
        class="team-logo"
        src="${escapeHTML(logo)}"
        alt="شعار ${name}"
        loading="lazy"
        onerror="
          this.onerror=null;
          this.style.display='none';
        "
      >
    `;
  }

  return `
    <div
      class="team-logo-placeholder"
      aria-label="لا يوجد شعار"
    >
      ⚽
    </div>
  `;
}


/* =========================================================
   11. حالة المباراة
   ========================================================= */

function getStatus(match) {
  const status = String(
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

  if (status === "POSTPONED") {
    return {
      className: "cancelled",
      icon: "⚠",
      text: "تأجلت"
    };
  }

  if (status === "CANCELLED") {
    return {
      className: "cancelled",
      icon: "⚠",
      text: "ألغيت"
    };
  }

  if (status === "SUSPENDED") {
    return {
      className: "cancelled",
      icon: "⚠",
      text: "متوقفة"
    };
  }

  return {
    className: "upcoming",
    icon: "🕐",
    text: "لم تبدأ"
  };
}


/* =========================================================
   12. النتيجة
   ========================================================= */

function getScore(match) {
  const score = match.score || {};

  const fullTime =
    score.fullTime || {};

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


/* =========================================================
   13. توحيد بيانات المباراة
   ========================================================= */

function normalizeMatch(match) {
  if (!match || typeof match !== "object") {
    return null;
  }

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

  let competition;

  if (
    typeof match.competition === "object" &&
    match.competition !== null
  ) {
    competition = safeText(
      match.competition.name ||
      match.competition.code,
      "بطولات أخرى"
    );
  } else {
    competition = safeText(
      match.competition,
      "بطولات أخرى"
    );
  }

  return {
    ...match,

    home,

    away,

    competition,

    dateKey: getCasablancaDateKey(
      match.utcDate
    )
  };
}


/* =========================================================
   14. اسم الدوري المعروض
   ========================================================= */

function getLeagueDisplayName(name) {
  const cleanName = safeText(
    name,
    "بطولات أخرى"
  );

  return (
    LEAGUE_NAMES[cleanName] ||
    cleanName
  );
}


/* =========================================================
   15. ترتيب الدوريات
   ========================================================= */

function getLeagueOrder(name) {
  const index = LEAGUE_ORDER.indexOf(
    name
  );

  if (index === -1) {
    return 9999;
  }

  return index;
}


/* =========================================================
   16. رسم مباراة واحدة
   ========================================================= */

function renderMatch(match) {
  const status = getStatus(match);

  const score = getScore(match);

  let centerContent;

  if (status.className === "finished") {
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
        ${escapeHTML(
          formatTime(match.utcDate)
        )}
      </div>
    `;
  }

  return `
    <article class="match-card">

      <div class="team-side home-team">

        ${teamLogo(match.home)}

        <span>
          ${escapeHTML(match.home.name)}
        </span>

      </div>


      <div class="match-center">

        ${centerContent}

        <div
          class="match-status ${status.className}"
        >

          <span>
            ${status.icon}
          </span>

          ${escapeHTML(status.text)}

        </div>

      </div>


      <div class="team-side away-team">

        ${teamLogo(match.away)}

        <span>
          ${escapeHTML(match.away.name)}
        </span>

      </div>

    </article>
  `;
}


/* =========================================================
   17. تجميع المباريات حسب الدوري
   ========================================================= */

function groupByCompetition(matches) {
  const groups = {};

  matches.forEach(match => {
    const competition =
      safeText(
        match.competition,
        "بطولات أخرى"
      );

    if (!groups[competition]) {
      groups[competition] = [];
    }

    groups[competition].push(match);
  });

  return groups;
}


/* =========================================================
   18. رسم الدوري
   ========================================================= */

function renderLeague(
  name,
  matches
) {
  matches.sort((a, b) => {
    const dateA =
      new Date(a.utcDate || 0).getTime();

    const dateB =
      new Date(b.utcDate || 0).getTime();

    return dateA - dateB;
  });

  const displayName =
    getLeagueDisplayName(name);

  return `
    <section
      class="league-section"
      data-league="${escapeHTML(name)}"
    >

      <div class="league-header">

        <div class="league-title">

          <span
            class="league-icon"
            aria-hidden="true"
          >
            🏆
          </span>

          <div>

            <h3>
              ${escapeHTML(displayName)}
            </h3>

            <small>
              ${matches.length} مباراة
            </small>

          </div>

        </div>

      </div>


      <div class="league-matches">

        ${matches
          .map(renderMatch)
          .join("")}

      </div>

    </section>
  `;
}


/* =========================================================
   19. أزرار أمس / اليوم / غدًا
   ========================================================= */

function renderDayTabs() {
  return `
    <div
      class="matches-days"
      role="tablist"
      aria-label="أيام المباريات"
    >

      <button
        type="button"
        class="day-tab ${
          selectedDay === "yesterday"
            ? "active"
            : ""
        }"
        data-day="yesterday"
        role="tab"
        aria-selected="${
          selectedDay === "yesterday"
        }"
      >
        <span>أمس</span>
      </button>


      <button
        type="button"
        class="day-tab ${
          selectedDay === "today"
            ? "active"
            : ""
        }"
        data-day="today"
        role="tab"
        aria-selected="${
          selectedDay === "today"
        }"
      >
        <span>اليوم</span>
      </button>


      <button
        type="button"
        class="day-tab ${
          selectedDay === "tomorrow"
            ? "active"
            : ""
        }"
        data-day="tomorrow"
        role="tab"
        aria-selected="${
          selectedDay === "tomorrow"
        }"
      >
        <span>غدًا</span>
      </button>

    </div>
  `;
}


/* =========================================================
   20. ربط أزرار الأيام
   ========================================================= */

function attachDayEvents() {
  const buttons =
    document.querySelectorAll(
      ".day-tab"
    );

  buttons.forEach(button => {
    button.addEventListener(
      "click",
      () => {
        const day =
          button.dataset.day;

        if (
          ![
            "yesterday",
            "today",
            "tomorrow"
          ].includes(day)
        ) {
          return;
        }

        selectedDay = day;

        renderSelectedDay();
      }
    );
  });
}


/* =========================================================
   21. رسالة عدم وجود مباريات
   ========================================================= */

function renderEmptyDay(day) {
  const labels = {
    yesterday: "أمس",
    today: "اليوم",
    tomorrow: "غدًا"
  };

  const label =
    labels[day] || "هذا اليوم";

  return `
    <div class="empty">

      <div class="empty-icon">
        ⚽
      </div>

      <h3>
        لا توجد مباريات
      </h3>

      <p>
        لا توجد مباريات مسجلة لـ ${label}.
      </p>

    </div>
  `;
}


/* =========================================================
   22. رسم اليوم المحدد
   ========================================================= */

function renderSelectedDay() {
  if (!list) {
    return;
  }

  const targetDate =
    getDayKey(selectedDay);

  const dayMatches =
    allMatches.filter(match => {
      return (
        match &&
        match.dateKey === targetDate
      );
    });


  /*
    نحافظ على أزرار الأيام
    في أعلى الصفحة.
  */

  const tabs =
    renderDayTabs();


  if (!dayMatches.length) {
    list.innerHTML =
      tabs +
      renderEmptyDay(selectedDay);

    attachDayEvents();

    return;
  }


  const groups =
    groupByCompetition(dayMatches);


  /*
    ترتيب الدوريات حسب
    LEAGUE_ORDER
  */

  const sortedGroups =
    Object.entries(groups)
      .sort(([nameA], [nameB]) => {

        const orderA =
          getLeagueOrder(nameA);

        const orderB =
          getLeagueOrder(nameB);

        /*
          إذا كان الدوريان في القائمة،
          نستخدم ترتيبهما.

          وإذا كان أحدهما غير موجود،
          يوضع بعدهما.
        */

        if (orderA !== orderB) {
          return orderA - orderB;
        }

        /*
          البطولات غير الموجودة
          في القائمة ترتب أبجديًا.
        */

        return nameA.localeCompare(
          nameB,
          "en"
        );
      });


  const leagues =
    sortedGroups
      .map(
        ([name, matches]) =>
          renderLeague(
            name,
            matches
          )
      )
      .join("");


  list.innerHTML =
    tabs +
    leagues;


  attachDayEvents();
}


/* =========================================================
   23. تحميل البيانات
   ========================================================= */

async function loadMatches() {
  if (!list) {
    console.error(
      "KoraKoora: العنصر #liveMatches غير موجود."
    );

    return;
  }


  /*
    نعرض التحميل فقط عند
    أول تحميل للصفحة.
  */

  if (!allMatches.length) {
    list.innerHTML = `
      <div class="loading-box">

        <div class="loader"></div>

        <span>
          جاري تحميل المباريات...
        </span>

      </div>
    `;
  }


  try {
    const response =
      await fetch(
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


    const data =
      await response.json();


    if (
      !data ||
      !Array.isArray(data.matches)
    ) {
      throw new Error(
        "صيغة matches.json غير صحيحة."
      );
    }


    allMatches =
      data.matches
        .map(normalizeMatch)
        .filter(Boolean);


    /*
      رسم اليوم الحالي
      بعد تحميل البيانات.
    */

    renderSelectedDay();


  } catch (error) {

    console.error(
      "KoraKoora error:",
      error
    );


    /*
      إذا كانت لدينا بيانات قديمة،
      لا نمسحها بالكامل بسبب خطأ
      مؤقت في التحديث.
    */

    if (allMatches.length) {
      return;
    }


    list.innerHTML = `
      <div class="empty error-box">

        <div class="empty-icon">
          ⚠️
        </div>

        <h3>
          تعذر تحميل المباريات
        </h3>

        <p>
          تحقق من اتصال الإنترنت
          أو من ملف matches.json
          ثم حاول مرة أخرى.
        </p>

        <button
          type="button"
          class="retry-btn"
          id="retryMatches"
        >
          إعادة المحاولة
        </button>

      </div>
    `;


    const retryButton =
      document.querySelector(
        "#retryMatches"
      );


    if (retryButton) {
      retryButton.addEventListener(
        "click",
        loadMatches
      );
    }
  }
}


/* =========================================================
   24. التشغيل الأول
   ========================================================= */

loadMatches();


/* =========================================================
   25. التحديث التلقائي
   ========================================================= */

setInterval(
  loadMatches,
  REFRESH_INTERVAL
);
