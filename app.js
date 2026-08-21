<!doctype html>
<html lang="ar" dir="rtl">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="KoraKoora منصة لمتابعة مباريات كرة القدم، المواعيد والنتائج بتوقيتك المحلي أينما كنت، مع معلومات عن أهم البطولات وأبرز المواجهات.">
  <meta name="robots" content="index, follow">
  <meta name="theme-color" content="#111111">
  <title>KoraKoora | مباريات اليوم بتوقيتك المحلي</title>
  <link rel="stylesheet" href="style.css">

  <style>
    /* ===== أزرار تصفية البطولات ===== */
    .filters-container {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
      margin: 20px 0 30px;
      padding: 15px 20px;
      background: #f5f5f5;
      border-radius: 12px;
      justify-content: center;
      border: 1px solid #eee;
    }

    .filter-btn {
      padding: 8px 18px;
      border: 2px solid #ddd;
      border-radius: 25px;
      background: white;
      cursor: pointer;
      font-weight: bold;
      transition: all 0.3s ease;
      color: #333;
      font-size: 14px;
      font-family: inherit;
    }

    .filter-btn:hover {
      background: #f0f0f0;
      border-color: #aaa;
      transform: scale(1.03);
    }

    .filter-btn.active {
      background: #19c37d;
      color: white;
      border-color: #19c37d;
      box-shadow: 0 4px 12px rgba(25, 195, 125, 0.3);
    }

    .filter-btn.active:hover {
      background: #16a96e;
      border-color: #16a96e;
    }

    @media (max-width: 600px) {
      .filters-container {
        gap: 8px;
        padding: 12px 10px;
      }
      .filter-btn {
        padding: 6px 12px;
        font-size: 12px;
      }
    }
  </style>

</head>


<body>


<!-- =========================
     HEADER
========================= -->

<header class="topbar">

  <div class="container nav">

    <a class="brand" href="index.html">
      Kora<span>Koora</span>
    </a>


    <nav aria-label="القائمة الرئيسية">

      <a class="active" href="index.html">
        الرئيسية
      </a>

      <a href="#matches">
        مباريات اليوم
      </a>

      <a href="#leagues">
        البطولات
      </a>

      <a href="#news">
        أخبار وتحليلات
      </a>

    </nav>


    <button class="search" aria-label="بحث" type="button">
      ⌕
    </button>

  </div>

</header>



<main>


<!-- =========================
     HERO
========================= -->

<section class="hero">

  <div class="container hero-inner">


    <div>

      <p class="eyebrow">
        ⚽ متابعة كرة القدم ببساطة
      </p>


      <h1>

        مباريات اليوم

        <br>

        <span>بتوقيتك المحلي</span>

      </h1>


      <p class="lead">

        تابع مواعيد مباريات كرة القدم ونتائجها
        بتوقيتك المحلي أينما كنت،
        مع عرض واضح ومناسب للهواتف.

      </p>


      <a href="#matches" style="display:inline-block;margin-top:20px;padding:12px 22px;border-radius:8px;text-decoration:none;background:#19c37d;color:#fff;font-weight:bold;">
        مشاهدة مباريات اليوم
      </a>

    </div>



    <div class="hero-card">

      <div class="live-dot">
        ● مباشر
      </div>


      <strong>
        ماذا تجد في KoraKoora؟
      </strong>


      <span>
        مواعيد المباريات والنتائج
        ومعلومات تساعدك على متابعة
        أهم مواجهات كرة القدم.
      </span>

    </div>


  </div>

</section>



<div class="container">


<!-- =========================
     INTRODUCTION
========================= -->

<section class="section">

  <div class="section-head">

    <div>

      <p class="eyebrow">
        عن KoraKoora
      </p>

      <h2>
        منصة بسيطة لعشاق كرة القدم
      </h2>

    </div>

  </div>


  <div style="max-width:850px;line-height:2;">

    <p>

      صُمم KoraKoora ليكون مكانًا بسيطًا
      وسهل الاستخدام للزائر الذي يريد معرفة
      مباريات كرة القدم دون الحاجة إلى البحث
      في عدة صفحات.

    </p>


    <p>

      نركز على تقديم المعلومات بطريقة واضحة،
      مع الاهتمام بالمواعيد والنتائج والبطولات
      التي تهم متابعي كرة القدم في مختلف أنحاء
      العالم.

    </p>


    <p>

      هدفنا هو تطوير الموقع تدريجيًا وإضافة
      معلومات مفيدة تساعد الزائر على معرفة
      ما يحدث في عالم كرة القدم بطريقة منظمة
      وسهلة القراءة.

    </p>

  </div>

</section>



<!-- =========================
     AD PLACEHOLDER
========================= -->

<div class="ad-slot">
  مساحة إعلانية
</div>



<!-- =========================
     MATCHES
========================= -->

<section id="matches" class="section">

  <div class="section-head">


    <div>

      <p class="eyebrow">
        المواعيد والنتائج
      </p>


      <h2>
        مباريات اليوم
      </h2>


      <p>

        تعرف على المباريات المجدولة
        وتابع النتائج عند توفرها،
        مع عرض وقت كل مباراة بتوقيتك المحلي.

      </p>

    </div>



    <div class="days">

      <button id="yesterdayBtn">
        أمس
      </button>


      <button id="todayBtn" class="selected">
        اليوم
      </button>


      <button id="tomorrowBtn">
        غدًا
      </button>

    </div>


  </div>


  <!-- ===== أزرار تصفية البطولات ===== -->
  <div class="filters-container">
    <button class="filter-btn active" data-league="all">🏆 الكل</button>
    <button class="filter-btn" data-league="PL">🇬🇧 الإنجليزي</button>
    <button class="filter-btn" data-league="PD">🇪🇸 الإسباني</button>
    <button class="filter-btn" data-league="SA">🇮🇹 الإيطالي</button>
    <button class="filter-btn" data-league="BL1">🇩🇪 الألماني</button>
    <button class="filter-btn" data-league="FL1">🇫🇷 الفرنسي</button>
    <button class="filter-btn" data-league="PPL">🇵🇹 البرتغالي</button>
    <button class="filter-btn" data-league="DED">🇳🇱 الهولندي</button>
  </div>


  <div id="liveMatches">

    <div class="empty">

      جاري تحميل المباريات...

    </div>

  </div>


</section>



<!-- =========================
     HOW IT WORKS
========================= -->

<section class="section">

  <div class="section-head">

    <div>

      <p class="eyebrow">
        طريقة الاستخدام
      </p>

      <h2>
        كيف تستفيد من KoraKoora؟
      </h2>

    </div>

  </div>



  <div class="league-grid">


    <div>

      <strong>
        01 — اختر اليوم
      </strong>

      <p>
        استخدم خيارات أمس واليوم وغدًا
        للوصول إلى المباريات المرتبطة
        بالتاريخ الذي تبحث عنه.
      </p>

    </div>



    <div>

      <strong>
        02 — تابع المباريات
      </strong>

      <p>
        تظهر معلومات المباريات في قسم
        مخصص حتى تستطيع الوصول إليها
        بسرعة من الصفحة الرئيسية.
      </p>

    </div>



    <div>

      <strong>
        03 — استكشف البطولات
      </strong>

      <p>
        يمكنك التعرف على مجموعة من أشهر
        البطولات الأوروبية والعالمية.
      </p>

    </div>



    <div>

      <strong>
        04 — اقرأ المحتوى
      </strong>

      <p>
        نعمل على تقديم محتوى ومعلومات
        كروية تساعد الزائر على فهم
        المباريات والبطولات بشكل أفضل.
      </p>

    </div>


  </div>

</section>



<!-- =========================
     TIMEZONE INFORMATION
========================= -->

<section class="section">

  <div class="section-head">

    <div>

      <p class="eyebrow">
        توقيت المباريات
      </p>

      <h2>
        المباريات بتوقيتك المحلي
      </h2>

    </div>

  </div>


  <div style="max-width:850px;line-height:2;">

    <p>

      يتم عرض موعد كل مباراة تلقائيًا
      وفق التوقيت المحلي لجهاز الزائر،
      حتى يظهر وقت المباراة بشكل مناسب
      لمكان وجوده.

    </p>


    <p>

      سواء كنت في المغرب أو أوروبا أو أمريكا
      أو أي مكان آخر، سيظهر لك موعد المباراة
      وفق توقيتك المحلي دون الحاجة إلى
      تحويل الوقت يدويًا.

    </p>

  </div>

</section>



<!-- =========================
     LEAGUES
========================= -->

<section id="leagues" class="section">


  <div class="section-head">

    <div>

      <p class="eyebrow">
        البطولات
      </p>


      <h2>
        أهم البطولات التي نتابعها
      </h2>


      <p>

        مجموعة من البطولات التي يهتم بها
        متابعو كرة القدم حول العالم.

      </p>

    </div>

  </div>



  <div class="league-grid">


    <div>
      🇪🇸
      <strong>
        الدوري الإسباني
      </strong>
    </div>


    <div>
      🏴
      <strong>
        الدوري الإنجليزي
      </strong>
    </div>


    <div>
      🇫🇷
      <strong>
        الدوري الفرنسي
      </strong>
    </div>


    <div>
      🇮🇹
      <strong>
        الدوري الإيطالي
      </strong>
    </div>


    <div>
      🇩🇪
      <strong>
        الدوري الألماني
      </strong>
    </div>


    <div>
      🏆
      <strong>
        دوري أبطال أوروبا
      </strong>
    </div>


  </div>


</section>



<!-- =========================
     ORIGINAL CONTENT
========================= -->

<section id="news" class="section">


  <div class="section-head">

    <div>

      <p class="eyebrow">
        محتوى KoraKoora
      </p>


      <h2>
        معلومات وتحليلات كرة القدم
      </h2>

    </div>

  </div>



  <div class="news-grid">


    <article>

      <div class="news-image">
        ⚽
      </div>


      <h3>
        كيف تتابع مباريات اليوم؟
      </h3>


      <p>

        يبدأ أفضل تنظيم لمتابعة مباريات
        كرة القدم بتحديد اليوم والبطولة
        التي تهمك، ثم مراجعة موعد المباراة
        قبل بدايتها.

      </p>

    </article>



    <article>

      <div class="news-image">
        🏆
      </div>


      <h3>
        لماذا تختلف مواعيد المباريات؟
      </h3>


      <p>

        قد تختلف مواعيد المباريات بسبب
        التوقيت المحلي أو التغييرات التي
        تطرأ على جدول المسابقة، لذلك من
        المفيد متابعة الجدول بشكل مستمر.

      </p>

    </article>



    <article>

      <div class="news-image">
        📊
      </div>


      <h3>
        أهمية متابعة الإحصائيات
      </h3>


      <p>

        تساعد الإحصائيات على تكوين صورة
        أوضح عن أداء الفرق، خصوصًا عند
        مقارنة النتائج والمواجهات السابقة.

      </p>

    </article>


  </div>


</section>



<!-- =========================
     USER EXPERIENCE
========================= -->

<section class="section">


  <div class="section-head">

    <div>

      <p class="eyebrow">
        تجربة الزائر
      </p>


      <h2>
        مصمم ليكون واضحًا وسهل الاستخدام
      </h2>

    </div>

  </div>



  <div style="max-width:850px;line-height:2;">

    <p>

      نحاول في KoraKoora إبقاء المعلومات
      الأساسية قريبة من المستخدم، لذلك
      توجد مباريات اليوم والبطولات والمحتوى
      في أقسام واضحة داخل الصفحة.

    </p>


    <p>

      كما نوفر صفحات مستقلة للتعريف بالموقع
      والتواصل معنا وسياسة الخصوصية وشروط
      الاستخدام، حتى يستطيع الزائر معرفة
      طبيعة الموقع وكيفية التواصل مع المسؤول
      عنه.

    </p>

  </div>

</section>



<!-- =========================
     FINAL AD PLACEHOLDER
========================= -->

<div class="ad-slot">
  مساحة إعلانية
</div>


</div>

</main>



<!-- =========================
     FOOTER
========================= -->

<footer>


  <div class="container footer">


    <div>

      <a class="brand" href="index.html">
        Kora<span>Koora</span>
      </a>


      <p>

        مباريات ونتائج ومعلومات
        كرة القدم بطريقة واضحة.

      </p>

    </div>



    <div class="footer-links">


      <a href="pages/about.html">
        من نحن
      </a>


      <a href="pages/contact.html">
        اتصل بنا
      </a>


      <a href="pages/privacy.html">
        سياسة الخصوصية
      </a>


      <a href="pages/terms.html">
        شروط الاستخدام
      </a>


    </div>


  </div>



  <div class="copyright">

    © 2026 KoraKoora — جميع الحقوق محفوظة

  </div>


</footer>



<!-- =========================
     JAVASCRIPT
========================= -->

<script src="app.js"></script>


</body>
</html>
