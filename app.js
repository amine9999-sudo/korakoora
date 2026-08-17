// 1. مصفوفة الترتيب والترجمة المطلوبة
const TARGET_LEAGUES = [
  { keywords: ["champions league", "دوري أبطال أوروبا"], name: "دوري أبطال أوروبا" },
  { keywords: ["la liga", "laliga", "الدوري الاسباني", "الدوري الإسباني"], name: "الدوري الإسباني" },
  { keywords: ["premier league", "الدوري الانجليزي", "الدوري الإنجليزي"], name: "الدوري الإنجليزي" },
  { keywords: ["serie a", "الدوري الايطالي", "الدوري الإيطالي"], name: "الدوري الإيطالي" },
  { keywords: ["bundesliga", "الدوري الالماني", "الدوري الألماني"], name: "الدوري الألماني" },
  { keywords: ["ligue 1", "الدوري الفرنسي"], name: "الدوري الفرنسي" },
  { keywords: ["botola", "الدوري المغربي"], name: "الدوري المغربي" },
  { keywords: ["egyptian", "الدوري المصري"], name: "الدوري المصري" },
  { keywords: ["brasileirao", "الدوري البرازيلي"], name: "الدوري البرازيلي" }
];

// 2. دالة التعديل القسري للعناصر
function forceUpdateLeagues() {
  // تجميع كل الحاويات المحتملة لكروت الدوريات
  const allElements = document.querySelectorAll('div, section, article');

  allElements.forEach(el => {
    // التأكد من أن العنصر يمثل حاوية دوري مباشرة (يحتوي على اسم دوري ومباريات)
    const text = el.innerText ? el.innerText.toLowerCase() : '';
    
    // فحص ما إذا كان العنصر يحتوي على أي من كلمات الدوريات المسموحة
    let matchedIndex = -1;
    let matchedName = '';

    TARGET_LEAGUES.forEach((league, index) => {
      if (league.keywords.some(kw => text.includes(kw.toLowerCase()))) {
        matchedIndex = index;
        matchedName = league.name;
      }
    });

    // إذا كان كارت دوري مسموح
    if (matchedIndex !== -1 && el.children.length > 0) {
      // البحث عن العنوان لتحديثه
      const titleNode = el.querySelector('h1, h2, h3, h4, .title, [class*="title"]') || el.firstChild;
      if (titleNode && titleNode.nodeType === 1) {
        titleNode.textContent = matchedName;
      }
      
      // تطبيق ترتيب CSS Flex Grid
      el.style.order = matchedIndex + 1;
      el.style.display = '';
    } 
    // إذا كان يحتوي على دوري درجة ثانية (مثل Championship)
    else if (text.includes('championship') || text.includes('primeira liga')) {
      el.style.display = 'none';
    }
  });
}

// 3. تشغيل الدالة بانتظام للتعامل مع جلب البيانات الديناميكي
setInterval(forceUpdateLeagues, 1000);
