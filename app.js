// 1. القائمة المسموحة وتحديد ترتيب وترجمة الدوريات
const ALLOWED_LEAGUES = [
  { name: "دوري أبطال أوروبا", keywords: ["champions league", "uefa champions league"] },
  { name: "الدوري الإسباني", keywords: ["la liga", "laliga", "primera division"] },
  { name: "الدوري الإنجليزي", keywords: ["premier league"] },
  { name: "الدوري الإيطالي", keywords: ["serie a"] },
  { name: "الدوري الألماني", keywords: ["bundesliga"] },
  { name: "الدوري الفرنسي", keywords: ["ligue 1"] },
  { name: "الدوري المغربي", keywords: ["botola", "botola pro"] },
  { name: "الدوري المصري", keywords: ["egyptian premier league", "egyptian league"] },
  { name: "الدوري البرازيلي", keywords: ["brasileirao", "serie a brazil"] }
];

// 2. دالة تصفية وترتيب وترجمة الدوريات
function processLeagues() {
  const leagueCards = document.querySelectorAll('.league-card, [class*="league"]');

  leagueCards.forEach(card => {
    const titleEl = card.querySelector('h2, h3, .league-title, .league-name') || card;
    const titleText = titleEl.textContent.toLowerCase().trim();

    let matchedIndex = -1;
    let matchedLeague = null;

    ALLOWED_LEAGUES.forEach((league, index) => {
      if (league.keywords.some(kw => titleText.includes(kw))) {
        matchedIndex = index;
        matchedLeague = league;
      }
    });

    if (matchedIndex !== -1) {
      titleEl.textContent = matchedLeague.name;
      card.style.order = matchedIndex + 1;
      card.style.display = 'block';
    } else {
      // إخفاء دوريات الدرجة الثانية والأخرى غير المحددة
      card.style.display = 'none';
    }
  });
}

// 3. دالة التنقل بين أزرار الأيام (أمس / اليوم / غداً)
function setupDateNavigation() {
  const dateButtons = document.querySelectorAll('.tabs button, .date-tab, nav a, [class*="tab"]');

  dateButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      dateButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const text = btn.textContent.trim();
      const targetDate = new Date();

      if (text.includes('أمس')) {
        targetDate.setDate(targetDate.getDate() - 1);
      } else if (text.includes('غداً') || text.includes('غدا')) {
        targetDate.setDate(targetDate.getDate() + 1);
      }

      fetchMatchesForDate(targetDate);
    });
  });
}

// 4. جلب مباريات اليوم المختار
function fetchMatchesForDate(date) {
  const formattedDate = date.toISOString().split('T')[0];
  
  if (typeof fetchMatchesByDate === 'function') {
    fetchMatchesByDate(formattedDate).then(() => processLeagues());
  } else {
    processLeagues();
  }
}

// 5. تهيئة التطبيق عند اكتمال التحميل
document.addEventListener('DOMContentLoaded', () => {
  setupDateNavigation();
  processLeagues();
});
