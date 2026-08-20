/* =========================================================
   KoraKoora
   نظام عرض مباريات:
   - أمس
   - اليوم
   - غدًا
   - توقيت الزائر تلقائيًا
   - ترتيب البطولات
   - أسماء البطولات
   - أزرار التنقل بين الأيام
   ========================================================= */


/* =========================================================
   الإعدادات
   ========================================================= */

const list = document.querySelector("#liveMatches");

const API_FILE = "data/matches.json";


/*
   لا نحدد Time Zone هنا.

   المتصفح سيستخدم المنطقة الزمنية الموجودة
   في جهاز الزائر تلقائيًا.

   مثال:
   المغرب → Africa/Casablanca
   فرنسا → Europe/Paris
   أمريكا → America/New_York
   اليابان → Asia/Tokyo
*/


/* =========================================================
   اليوم الحالي المختار
   ========================================================= */

let selectedDay = "today";


/* =========================================================
   أسماء البطولات
   ========================================================= */

const LEAGUE_NAMES = {

  "Primera Division": "الدوري الإسباني",

  "La Liga": "الدوري الإسباني",

  "Premier League": "الدوري الإنجليزي",

  "Championship": "التشامبيونشيب",

  "Primeira Liga": "الدوري البرتغالي",

  "Serie A": "الدوري الإيطالي",

  "Bundesliga": "الدوري الألماني",

  "Ligue 1": "الدوري الفرنسي",

  "Copa Libertadores": "كوبا ليبرتادوريس",

  "UEFA Champions League": "دوري أبطال أوروبا",

  "Champions League": "دوري أبطال أوروبا",

  "Europa League": "الدوري الأوروبي",

  "Conference League": "دوري المؤتمر الأوروبي",

  "Primera Division Argentina": "الدوري الأرجنتيني",

  "Primera Division Chile": "الدوري التشيلي",

  "Brasileirão": "الدوري البرازيلي"

};


/* =========================================================
   ترتيب البطولات
   ========================================================= */

const LEAGUE_ORDER = [

  "الدوري الإنجليزي",

  "الدوري الإسباني",

  "الدوري الإيطالي",

  "الدوري الألماني",

  "الدوري الفرنسي",

  "الدوري البرتغالي",

  "دوري أبطال أوروبا",

  "الدوري الأوروبي",

  "دوري المؤتمر الأوروبي",

  "كوبا ليبرتادوريس",

  "الدوري البرازيلي",

  "الدوري الأرجنتيني",

  "الدوري التشيلي",

  "التشامبيونشيب"

];


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

    return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";

  } catch (error) {

    return "UTC";

  }

}


/* =========================================================
   تحويل الوقت إلى توقيت الزائر
   ========================================================= */

function formatTime(utc) {

  if (!utc) {

    return "--:--";

  }


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


/* =========================================================
   الحصول على تاريخ المباراة بتوقيت الزائر
   ---------------------------------------------------------
   النتيجة:
   2026-08-20
   ========================================================= */

function getLocalDateKey(utc) {

  if (!utc) {

    return null;

  }


  try {

    const parts =
      new Intl.DateTimeFormat("en-CA", {

        timeZone: getUserTimeZone(),

        year: "numeric",

        month: "2-digit",

        day: "2-digit"

      }).formatToParts(new Date(utc));


    const year =
      parts.find(
        part => part.type === "year"
      )?.value;


    const month =
      parts.find(
        part => part.type === "month"
      )?.value;


    const day =
      parts.find(
        part => part.type === "day"
      )?.value;


    if (!year || !month || !day) {

      return null;

    }


    return `${year}-${month}-${day}`;

  } catch (error) {

    return null;

  }

}


/* =========================================================
   الحصول على تاريخ اليوم حسب الزائر
   ========================================================= */

function getTodayKey() {

  return getLocalDateKey(
    new Date().toISOString()
  );

}


/* =========================================================
   إضافة / طرح يوم
   ========================================================= */

function addDays(dateKey, amount) {

  if (!dateKey) {

    return null;

  }


  const parts =
    dateKey.split("-").map(Number);


  if (parts.length !== 3) {

    return null;

  }


  const year = parts[0];

  const month = parts[1];

  const day = parts[2];


  const date =
    new Date(
      year,
      month - 1,
      day,
      12,
      0,
      0,
      0
    );


  if (Number.isNaN(date.getTime())) {

    return null;

  }


  date.setDate(
    date.getDate() + amount
  );


  const newYear =
    date.getFullYear();


  const newMonth =
    String(
      date.getMonth() + 1
    ).padStart(2, "0");


  const newDay =
    String(
      date.getDate()
    ).padStart(2, "0");


  return `${newYear}-${newMonth}-${newDay}`;

}


/* =========================================================
   تحديد التاريخ المطلوب
   ========================================================= */

function getSelectedDateKey() {

  const today =
    getTodayKey();


  if (!today) {

    return null;

  }


  if (
    selectedDay === "yesterday"
  ) {

    return addDays(
      today,
      -1
    );

  }


  if (
    selectedDay === "tomorrow"
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

        onerror="this.onerror=null;this.style.display='none';"

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
    liveStatuses.includes(status)
  ) {

    return {

      className: "live",

      icon: "🔴",

      text: "مباشر"

    };

  }


  if (
    status === "FINISHED"
  ) {

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

      icon: "⚠️",

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


/* =========================================================
   النتيجة
   ========================================================= */

function getScore(match) {

  const score =
    match.score || {};


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
   توحيد بيانات المباراة
   ========================================================= */

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


  let originalCompetition;


  if (
    typeof match.competition === "object"
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
   عرض المباراة
   ========================================================= */

function renderMatch(match) {

  const status =
    getStatus(match);


  const score =
    getScore(match);


  let centerContent;


  /*
     المباراة المنتهية:
     عرض النتيجة
  */

  if (
    status.className === "finished"
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

  }


  /*
     المباراة غير المنتهية:
     عرض وقت المباراة
  */

  else {

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

        <span>
          ${match.home.name}
        </span>

      </div>


      <div class="match-center">

        ${centerContent}


        <div class="match-status ${status.className}">

          <span>
            ${status.icon}
          </span>

          ${status.text}

        </div>

      </div>


      <div class="team-side away-team">

        ${teamLogo(match.away)}

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

function groupByCompetition(matches) {

  const groups = {};


  matches.forEach(match => {

    const name =
      match.competition ||
      "بطولات أخرى";


    if (!groups[name]) {

      groups[name] = [];

    }


    groups[name].push(match);

  });


  return groups;

}


/* =========================================================
   ترتيب البطولات
   ========================================================= */

function sortLeagues(entries) {

  return entries.sort(

    ([nameA], [nameB]) => {

      const indexA =
        LEAGUE_ORDER.indexOf(nameA);


      const indexB =
        LEAGUE_ORDER.indexOf(nameB);


      if (
        indexA !== -1 &&
        indexB !== -1
      ) {

        return indexA - indexB;

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


  return `

    <section class="league-section">


      <div class="league-header">


        <div class="league-title">

          <span class="league-icon">
            🏆
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


      </div>


      <div class="league-matches">

        ${

          matches
            .map(renderMatch)
            .join("")

        }

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
      element: yesterdayBtn,
      value: "yesterday"
    },

    {
      element: todayBtn,
      value: "today"
    },

    {
      element: tomorrowBtn,
      value: "tomorrow"
    }

  ];


  buttons.forEach(
    ({ element, value }) => {

      if (!element) {

        return;

      }


      element.classList.toggle(

        "selected",

        selectedDay === value

      );


      element.setAttribute(

        "aria-pressed",

        selectedDay === value
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

    day !== "yesterday" &&

    day !== "today" &&

    day !== "tomorrow"

  ) {

    return;

  }


  selectedDay = day;


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

    yesterday: "أمس",

    today: "اليوم",

    tomorrow: "غدًا"

  };


  const label =
    labels[selectedDay] ||
    "اليوم";


  const timezone =
    getUserTimeZone();


  list.innerHTML = `

    <div class="empty">

      <div class="empty-icon">
        ⚽
      </div>


      <h3>
        لا توجد مباريات
      </h3>


      <p>
        لا توجد مباريات لـ ${label}
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
       التاريخ المطلوب
       حسب توقيت الزائر
    */

    const targetDate =
      getSelectedDateKey();


    /*
       تصفية المباريات
       حسب اليوم المحلي للزائر
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
       تجميع المباريات
       حسب البطولات
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

      <div class="empty error-box">

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
