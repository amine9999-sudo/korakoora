// 1. إعدادات الترجمة والترتيب للدوريات المطلوب عرضها فقط
const LEAGUE_ORDERS = {
  "UEFA Champions League": { name: "دوري أبطال أوروبا", order: 1 },
  "Champions League": { name: "دوري أبطال أوروبا", order: 1 },
  "La Liga": { name: "الدوري الإسباني", order: 2 },
  "LaLiga": { name: "الدوري الإسباني", order: 2 },
  "Premier League": { name: "الدوري الإنجليزي", order: 3 },
  "Serie A": { name: "الدوري الإيطالي", order: 4 },
  "Bundesliga": { name: "الدوري الألماني", order: 5 },
  "Ligue 1": { name: "الدوري الفرنسي", order: 6 },
  "Botola Pro": { name: "الدوري المغربي", order: 7 },
  "Egyptian Premier League": { name: "الدوري المصري", order: 8 },
  "Brasileirão": { name: "الدوري البرازيلي", order: 9 },
  "Serie A Brazil": { name: "الدوري البرازيلي", order: 9 }
};

// 2. دالة ترتيب وتصفية العناصر بدون تعطيل الـ API
function organizeLeagues() {
  const cards = document.querySelectorAll('.league-card, .league-container, [class*="league"]');

  cards.forEach(card => {
    const text = card.innerText || "";
    let matched = false;

    for (const [key, info] of Object.entries(LEAGUE_ORDERS)) {
      if (text.toLowerCase().includes(key.toLowerCase()) || text.includes(info.name)) {
        // تحديث العنوان إلى العربية
        const titleEl = card.querySelector('h1, h2, h3, h4, .league-title, .league-name') || card;
        if (titleEl && !titleEl.children.length) {
          titleEl.innerText = info.name;
        }

        // تطبيق الترتيب وتغيير العرض إلى flex/block
        card.style.order = info.order;
        card.style.display = "";
        matched = true;
        break;
      }
    }

    // إخفاء الدوريات التي ليست في القائمة (بما فيها دوريات الدرجة الثانية)
    if (!matched && card.children.length > 0) {
      card.style.display = "none";
    }
  });
}

// 3. مراقبة التغييرات لترتيب المباريات فور جلبها من الـ API
const observer = new MutationObserver(() => {
  organizeLeagues();
});

document.addEventListener("DOMContentLoaded", () => {
  observer.observe(document.body, { childList: true, subtree: true });
  organizeLeagues();
});

// 4. تفعيل أزرار الأيام (أمس / اليوم / غداً)
document.addEventListener("click", (e) => {
  const target = e.target.closest("button, .tab, a");
  if (!target) return;

  const btnText = target.innerText ? target.innerText.trim() : "";

  if (["أمس", "اليوم", "غداً", "غدا"].some(d => btnText.includes(d))) {
    // إعطاء مهلة قصيرة للـ API الأصلي ليعيد جلب المباريات ثم إعادة ترتيبها
    setTimeout(organizeLeagues, 600);
    setTimeout(organizeLeagues, 1500);
  }
});
