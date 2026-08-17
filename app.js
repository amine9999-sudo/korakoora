// 1. الترتيب والترجمة المطلوبة للدوريات المسموحة فقط
const LEAGUE_MAP = new Map([
  ["champions league", { name: "دوري أبطال أوروبا", order: 1 }],
  ["la liga", { name: "الدوري الإسباني", order: 2 }],
  ["laliga", { name: "الدوري الإسباني", order: 2 }],
  ["premier league", { name: "الدوري الإنجليزي", order: 3 }],
  ["serie a", { name: "الدوري الإيطالي", order: 4 }],
  ["bundesliga", { name: "الدوري الألماني", order: 5 }],
  ["ligue 1", { name: "الدوري الفرنسي", order: 6 }],
  ["botola", { name: "الدوري المغربي", order: 7 }],
  ["egyptian", { name: "الدوري المصري", order: 8 }],
  ["brasileirao", { name: "الدوري البرازيلي", order: 9 }]
]);

// 2. دالة إخفاء الدوريات غير المطلوبة وترتيب المسموح منها
function applyLeagueCustomization() {
  // البحث عن كافة الكروت المقابلة للدوريات
  const cards = document.querySelectorAll('div[class*="card"], div[class*="league"], div[class*="match"]');

  cards.forEach(card => {
    // التأكد أن العنصر يمثل كارت دوري
    const textContent = card.innerText || card.textContent;
    if (!textContent) return;

    const lowerText = textContent.toLowerCase();
    let isMatched = false;

    for (let [key, config] of LEAGUE_MAP.entries()) {
      if (lowerText.includes(key)) {
        // استهداف عنوان الدوري داخل الكارت لتغييره إلى العربية
        const header = card.querySelector('h1, h2, h3, h4, span, div') || card;
        if (header && !header.dataset.translated) {
          header.innerText = config.name;
          header.dataset.translated = "true";
        }
        
        card.style.order = config.order;
        card.style.display = ""; // إظهار الكارت
        isMatched = true;
        break;
      }
    }

    // إخفاء الكارت إذا كان دوري درجة ثانية أو غير محدد في القائمة
    if (!isMatched && card.children.length > 0) {
      card.style.display = "none";
    }
  });
}

// 3. مراقبة التغييرات في الصفحة (لتطبيق التعديل فور جلب المباريات من الـ API)
const observer = new MutationObserver(() => {
  applyLeagueCustomization();
});

observer.observe(document.body, { childList: true, subtree: true });

// 4. تفعيل أزرار الأيام (أمس / اليوم / غداً)
document.addEventListener("click", (e) => {
  const btnText = e.target.innerText ? e.target.innerText.trim() : "";

  if (["أمس", "اليوم", "غداً", "غدا"].some(day => btnText.includes(day))) {
    // تحديد التاريخ المطلوب
    const targetDate = new Date();
    if (btnText.includes("أمس")) targetDate.setDate(targetDate.getDate() - 1);
    if (btnText.includes("غداً") || btnText.includes("غدا")) targetDate.setDate(targetDate.getDate() + 1);

    const formattedDate = targetDate.toISOString().split("T")[0];
    
    // استدعاء دالة جلب البيانات إذا كانت معرفة في السكريبت الأصلي
    if (typeof fetchMatches === "function") fetchMatches(formattedDate);
    if (typeof getMatches === "function") getMatches(formattedDate);
    if (typeof loadData === "function") loadData(formattedDate);

    setTimeout(applyLeagueCustomization, 500);
  }
});

// تشغيل الأوامر فور تحميل الصفحة
document.addEventListener("DOMContentLoaded", applyLeagueCustomization);
