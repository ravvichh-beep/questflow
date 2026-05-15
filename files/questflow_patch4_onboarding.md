# QuestFlow — Патч 4: Онбординг — анимированный фон и переходы

## Инструкция для Claude Code

Два изменения: замена HTML онбординга и замена JS-функций онбординга.

---

## ИЗМЕНЕНИЕ 1: HTML онбординга

**НАЙДИ и ЗАМЕНИ весь блок** от `<!-- ===== ONBOARDING ===== -->` до закрывающего `</div>` перед `<!-- ===== APP ===== -->`:

**НА ЧТО ЗАМЕНИТЬ:**
```html
<!-- ===== ONBOARDING ===== -->
<div id="onboarding">

  <!-- Анимированные частицы фона -->
  <canvas id="ob-canvas" style="position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:0"></canvas>

  <!-- Декоративные линии -->
  <div class="ob-deco ob-deco-tl"></div>
  <div class="ob-deco ob-deco-br"></div>

  <div class="ob-wrap">
    <!-- Логотип -->
    <div class="ob-logo">Хроники <span>Судьбы</span></div>
    <div class="ob-sub">Твои задачи — это эпические квесты</div>

    <!-- Индикатор шагов -->
    <div class="ob-steps-indicator">
      <div class="ob-step-dot active" id="dot1"></div>
      <div class="ob-step-line"></div>
      <div class="ob-step-dot" id="dot2"></div>
    </div>

    <!-- Шаг 1: Имя -->
    <div class="ob-step active" id="ob1">
      <div class="ob-label">Как зовут твоего героя?</div>
      <input class="ob-input" id="ob-name" type="text" placeholder="Введи имя..." maxlength="24" autocomplete="off"
        onkeydown="if(event.key==='Enter')obNext()">
      <div class="ob-hint">Это имя появится в летописи побед</div>
      <button class="btn btn-g btn-wide" onclick="obNext()">Далее <span style="letter-spacing:0">→</span></button>
    </div>

    <!-- Шаг 2: Класс -->
    <div class="ob-step" id="ob2">
      <div class="ob-label">Выбери путь героя</div>
      <div class="ob-hint" style="margin-bottom:18px">Класс меняется автоматически по типу твоих квестов</div>
      <div class="ob-classes">
        <div class="ob-cls" onclick="obSelClass('keeper','Хранитель Знаний','study')" data-cls="keeper">
          <div class="ob-cls-icon">📚</div>
          <div class="ob-cls-name">Хранитель Знаний</div>
          <div class="ob-cls-desc">Учёба и саморазвитие</div>
          <div class="ob-cls-tag">INT · WIS</div>
        </div>
        <div class="ob-cls" onclick="obSelClass('warrior','Воин Дел','work')" data-cls="warrior">
          <div class="ob-cls-icon">⚔️</div>
          <div class="ob-cls-name">Воин Дел</div>
          <div class="ob-cls-desc">Работа и карьера</div>
          <div class="ob-cls-tag">STR · END</div>
        </div>
        <div class="ob-cls" onclick="obSelClass('druid','Друид Здоровья','health')" data-cls="druid">
          <div class="ob-cls-icon">🌿</div>
          <div class="ob-cls-name">Друид Здоровья</div>
          <div class="ob-cls-desc">Тело и дух</div>
          <div class="ob-cls-tag">VIT · AGI</div>
        </div>
        <div class="ob-cls" onclick="obSelClass('rogue','Вольный Странник','hobby')" data-cls="rogue">
          <div class="ob-cls-icon">🎨</div>
          <div class="ob-cls-name">Вольный Странник</div>
          <div class="ob-cls-desc">Творчество и хобби</div>
          <div class="ob-cls-tag">CHA · LCK</div>
        </div>
      </div>
      <button class="btn btn-g btn-wide" id="ob-finish" onclick="obFinish()" disabled style="opacity:.4">
        Начать путь ⚔
      </button>
    </div>
  </div>
</div>
```

---

## ИЗМЕНЕНИЕ 2: CSS для новых элементов онбординга

**НАЙДИ строку** `.ob-cls-desc{font-size:11px;color:var(--text3);line-height:1.5;font-style:italic}` в патче 2 (или в оригинале)
и **ДОБАВЬ ПОСЛЕ НЕЁ:**

```css
/* Новые элементы онбординга */
.ob-cls-tag{
  font-family:var(--ff-title);font-size:8px;letter-spacing:2px;
  color:var(--text3);margin-top:8px;
  background:rgba(255,255,255,.04);
  border:1px solid var(--bd);
  border-radius:20px;padding:2px 8px;
  display:inline-block;text-transform:uppercase;
}

/* Индикатор шагов */
.ob-steps-indicator{
  display:flex;align-items:center;justify-content:center;
  gap:0;margin-bottom:28px;
}
.ob-step-dot{
  width:8px;height:8px;border-radius:50%;
  background:var(--text3);
  transition:all .4s cubic-bezier(.34,1.26,.64,1);
  border:1px solid var(--bd);
}
.ob-step-dot.active{
  width:24px;border-radius:4px;
  background:var(--gold);
  border-color:rgba(212,168,74,.5);
  box-shadow:0 0 10px rgba(212,168,74,.4);
}
.ob-step-line{
  width:32px;height:1px;
  background:linear-gradient(90deg,var(--text3),var(--bd));
  margin:0 6px;
}

/* Декоративные угловые элементы */
.ob-deco{
  position:absolute;width:80px;height:80px;
  border-color:rgba(212,168,74,.12);border-style:solid;
  pointer-events:none;z-index:0;
}
.ob-deco-tl{top:20px;left:20px;border-width:1px 0 0 1px;border-radius:4px 0 0 0}
.ob-deco-br{bottom:20px;right:20px;border-width:0 1px 1px 0;border-radius:0 0 4px 0}
```

---

## ИЗМЕНЕНИЕ 3: JS функции онбординга

**НАЙДИ весь блок** от `// =============================================` до `// =============================================` (блок ONBOARDING):

```javascript
// =============================================
// ONBOARDING
// =============================================
var obClass = null;

function obNext() { ... }
function obSelClass(cls, name) { ... }
function obFinish() { ... }
```

**ЗАМЕНИ НА:**
```javascript
// =============================================
// ONBOARDING
// =============================================
var obClass = null;

// Анимированный фон — звёздное поле
function initObCanvas() {
  var canvas = document.getElementById('ob-canvas');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  var particles = [];
  var count = 80;

  for (var i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.4 + 0.3,
      speed: Math.random() * 0.25 + 0.05,
      opacity: Math.random() * 0.5 + 0.1,
      pulse: Math.random() * Math.PI * 2
    });
  }

  var frame = 0;
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    frame += 0.012;

    particles.forEach(function(p) {
      p.pulse += 0.018;
      p.y -= p.speed;
      if (p.y < -5) {
        p.y = canvas.height + 5;
        p.x = Math.random() * canvas.width;
      }

      var op = p.opacity * (0.6 + 0.4 * Math.sin(p.pulse));
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(200,180,100,' + op + ')';
      ctx.fill();
    });

    // Дрейфующие туманности
    var grd = ctx.createRadialGradient(
      canvas.width * (0.3 + 0.1 * Math.sin(frame * 0.3)),
      canvas.height * 0.4,
      0,
      canvas.width * 0.3,
      canvas.height * 0.4,
      canvas.width * 0.4
    );
    grd.addColorStop(0, 'rgba(40,80,160,0.04)');
    grd.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    requestAnimationFrame(draw);
  }
  draw();

  window.addEventListener('resize', function() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });
}

// Переход между шагами с анимацией
function obGoToStep(from, to, dotFrom, dotTo) {
  var fromEl = document.getElementById(from);
  var toEl   = document.getElementById(to);

  // Выход текущего шага
  fromEl.style.transition = 'all .25s cubic-bezier(.4,0,1,1)';
  fromEl.style.opacity = '0';
  fromEl.style.transform = 'translateX(-24px)';

  setTimeout(function() {
    fromEl.classList.remove('active');
    fromEl.style.transition = '';
    fromEl.style.opacity = '';
    fromEl.style.transform = '';

    // Вход нового шага
    toEl.style.opacity = '0';
    toEl.style.transform = 'translateX(24px)';
    toEl.classList.add('active');

    void toEl.offsetWidth; // reflow

    toEl.style.transition = 'all .32s cubic-bezier(.34,1.2,.64,1)';
    toEl.style.opacity = '1';
    toEl.style.transform = 'translateX(0)';

    setTimeout(function() {
      toEl.style.transition = '';
    }, 360);
  }, 240);

  // Обновляем индикатор
  if (dotFrom) document.getElementById(dotFrom).classList.remove('active');
  if (dotTo)   document.getElementById(dotTo).classList.add('active');
}

function obNext() {
  var n = document.getElementById('ob-name').value.trim();
  if (!n) {
    // Анимация ошибки на поле
    var input = document.getElementById('ob-name');
    input.style.transition = 'border-color .1s, box-shadow .1s';
    input.style.borderColor = 'rgba(240,64,64,.6)';
    input.style.boxShadow = '0 0 0 3px rgba(240,64,64,.1)';
    input.style.animation = 'ob-shake .35s ease';
    setTimeout(function() {
      input.style.borderColor = '';
      input.style.boxShadow = '';
      input.style.animation = '';
    }, 1000);
    showToast('Введи имя героя!');
    return;
  }
  S.hero.name = n;
  obGoToStep('ob1', 'ob2', 'dot1', 'dot2');
}

function obSelClass(cls, name, category) {
  obClass = { cls: cls, name: name, category: category };
  document.querySelectorAll('.ob-cls').forEach(function(el) {
    el.classList.remove('sel');
    el.style.transform = '';
  });
  var sel = document.querySelector('[data-cls="' + cls + '"]');
  sel.classList.add('sel');
  // Небольшой bounce при выборе
  sel.style.transform = 'scale(1.04)';
  setTimeout(function() { sel.style.transform = ''; }, 200);

  var btn = document.getElementById('ob-finish');
  btn.disabled = false;
  btn.style.opacity = '1';
  btn.style.animation = 'xp-pop .35s cubic-bezier(.34,1.56,.64,1)';
  setTimeout(function() { btn.style.animation = ''; }, 400);
}

function obFinish() {
  if (!obClass) return;
  S.hero.cls = obClass.cls;
  S.hero.clsName = obClass.name;
  S.onboarded = true;
  save();

  // Красивый переход в приложение
  var ob = document.getElementById('onboarding');
  ob.style.transition = 'opacity .5s ease, transform .5s ease';
  ob.style.opacity = '0';
  ob.style.transform = 'scale(1.04)';

  setTimeout(function() {
    ob.style.display = 'none';
    document.getElementById('app').style.opacity = '0';
    document.getElementById('app').style.display = 'block';
    document.getElementById('app').style.transition = 'opacity .4s ease';
    void document.getElementById('app').offsetWidth;
    document.getElementById('app').style.opacity = '1';
    setTimeout(function() {
      document.getElementById('app').style.transition = '';
      document.getElementById('app').style.opacity = '';
    }, 450);
    initAll();
  }, 520);
}
```

---

## ИЗМЕНЕНИЕ 4: boot — добавить инициализацию canvas

**НАЙДИ:**
```javascript
window.addEventListener('load', function() {
  S = load();
  if (S.onboarded) {
    launchApp();
  } else {
    document.getElementById('onboarding').style.display = 'flex';
  }
});
```

**ЗАМЕНИ НА:**
```javascript
window.addEventListener('load', function() {
  S = load();
  if (S.onboarded) {
    launchApp();
  } else {
    document.getElementById('onboarding').style.display = 'flex';
    initObCanvas(); // Запускаем анимацию фона
  }
});
```

---

## ИЗМЕНЕНИЕ 5: добавить @keyframes для ошибки ввода

**В блоке анимаций** (рядом с другими @keyframes) добавить:

```css
@keyframes ob-shake{
  0%,100%{transform:translateX(0)}
  15%{transform:translateX(-8px)}
  35%{transform:translateX(7px)}
  55%{transform:translateX(-5px)}
  75%{transform:translateX(4px)}
  90%{transform:translateX(-2px)}
}
```

---

## Что изменится

| Элемент | До | После |
|---|---|---|
| Фон онбординга | Статичный градиент | 80 плавающих частиц-звёзд + дрейфующие туманности на canvas |
| Переход шаг 1 → 2 | Мгновенный | Текущий шаг уходит влево, новый приезжает справа |
| Индикатор шагов | Нет | Два дота, активный растягивается в pill с gold glow |
| Ошибка (пустое имя) | Только тост | Поле краснеет + shake-анимация + тост |
| Выбор класса | Просто border | Border + bounce-эффект на карточке + кнопка pop |
| Переход в приложение | Резкий | Онбординг fade+scale out, приложение fade in |
| Декор | Нет | Угловые рамки в стиле Dragon Age |
| Enter в поле имени | Не работает | Нажатие Enter = переход к шагу 2 |
