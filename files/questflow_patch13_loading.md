# QuestFlow — Патч 13: Экран загрузки Dark Souls

## Проверка совместимости
- Добавляется новый div #loading-screen поверх всего — z-index:2000 ✓
- launchApp() из Патча 4 — заменяем, добавляем показ экрана загрузки ✓
- Оригинальный launchApp() тоже заменяем для совместимости ✓
- Патч 4 (onboarding) меняет obFinish() — там вызов launchApp(), совместимо ✓
- CSS классы .ls-* — уникальны ✓

---

## ИЗМЕНЕНИЕ 1: HTML экрана загрузки

**НАЙДИ:**
```html
<!-- ===== APP ===== -->
<div id="app">
```

**ДОБАВЬ ПЕРЕД НЕЙ:**
```html
<!-- ===== LOADING SCREEN ===== -->
<div id="loading-screen" style="display:none">
  <div class="ls-bg" id="ls-bg"></div>
  <div class="ls-vignette"></div>
  <div class="ls-content">
    <div class="ls-logo" id="ls-logo">Хроники<br><span>Судьбы</span></div>
    <div class="ls-ornament" id="ls-ornament">— ✦ —</div>
    <div class="ls-quote" id="ls-quote"></div>
    <div class="ls-author" id="ls-author"></div>
  </div>
  <div class="ls-bottom">
    <div class="ls-hint" id="ls-hint">
      <span class="ls-hint-key">НАЖМИ ЛЮБУЮ КЛАВИШУ</span>
      <span class="ls-hint-sub">чтобы продолжить</span>
    </div>
    <div class="ls-bar-wrap">
      <div class="ls-bar" id="ls-bar"></div>
    </div>
    <div class="ls-tip" id="ls-tip"></div>
  </div>
</div>
```

---

## ИЗМЕНЕНИЕ 2: CSS экрана загрузки

**ДОБАВИТЬ в конец CSS** (перед `</style>`):

```css
/* ===== LOADING SCREEN ===== */
#loading-screen{
  position:fixed;inset:0;z-index:2000;
  background:#000;
  display:flex;flex-direction:column;
  align-items:center;justify-content:center;
  cursor:pointer;
}
.ls-bg{
  position:absolute;inset:0;
  background-size:cover;background-position:center;
  filter:brightness(.35) saturate(.8);
  transition:opacity 1s ease;
  opacity:0;
}
.ls-vignette{
  position:absolute;inset:0;
  background:radial-gradient(ellipse at 50% 50%,transparent 20%,rgba(0,0,0,.7) 100%);
  pointer-events:none;
}
.ls-content{
  position:relative;z-index:1;
  text-align:center;padding:0 40px;
  max-width:600px;
}
.ls-logo{
  font-family:var(--ff-title);font-size:48px;
  color:#fff;letter-spacing:6px;
  line-height:1.15;margin-bottom:20px;
  opacity:0;
  text-shadow:0 0 40px rgba(212,168,74,.4),0 0 80px rgba(212,168,74,.1);
  transition:opacity 1.2s ease;
}
.ls-logo span{
  color:var(--gold);display:block;font-size:32px;
  letter-spacing:12px;margin-top:4px;
}
.ls-ornament{
  font-size:14px;letter-spacing:10px;
  color:rgba(212,168,74,.5);margin-bottom:28px;
  opacity:0;transition:opacity 1s ease .4s;
}
.ls-quote{
  font-family:var(--ff-body);font-style:italic;
  font-size:17px;color:rgba(220,210,190,.9);
  line-height:1.75;margin-bottom:12px;
  opacity:0;transition:opacity 1.2s ease .8s;
  text-shadow:0 1px 4px rgba(0,0,0,.8);
  min-height:60px;
}
.ls-author{
  font-family:var(--ff-title);font-size:10px;
  letter-spacing:3px;color:rgba(212,168,74,.6);
  text-transform:uppercase;
  opacity:0;transition:opacity 1s ease 1.2s;
}

/* Нижняя часть */
.ls-bottom{
  position:absolute;bottom:40px;left:0;right:0;
  text-align:center;z-index:1;
  padding:0 40px;
}
.ls-hint{
  margin-bottom:20px;
  opacity:0;transition:opacity .8s ease;
  animation:ls-blink 2.2s ease-in-out infinite;
}
@keyframes ls-blink{
  0%,100%{opacity:.8}50%{opacity:.2}
}
.ls-hint-key{
  font-family:var(--ff-title);font-size:11px;
  letter-spacing:4px;color:#fff;
  text-transform:uppercase;display:block;margin-bottom:4px;
}
.ls-hint-sub{
  font-family:var(--ff-body);font-style:italic;
  font-size:12px;color:rgba(255,255,255,.35);
}
.ls-bar-wrap{
  width:200px;height:2px;
  background:rgba(255,255,255,.08);
  border-radius:1px;margin:0 auto 16px;
  overflow:hidden;
}
.ls-bar{
  height:100%;width:0%;
  background:linear-gradient(90deg,var(--gold),var(--gold2));
  border-radius:1px;
  box-shadow:0 0 6px rgba(212,168,74,.5);
  transition:width .05s linear;
}
.ls-tip{
  font-family:var(--ff-body);font-style:italic;
  font-size:12px;color:rgba(255,255,255,.4);
  max-width:500px;margin:0 auto;
  opacity:0;transition:opacity .8s ease;
  line-height:1.6;
}

/* Переход при уходе */
#loading-screen.fade-out{
  animation:ls-fadeout .8s ease forwards;
}
@keyframes ls-fadeout{
  0%{opacity:1}
  100%{opacity:0;pointer-events:none}
}
```

---

## ИЗМЕНЕНИЕ 3: JS — данные и логика экрана загрузки

**НАЙДИ** строку `// =============================================` с `// BOOT`
и **ДОБАВЬ ПЕРЕД НЕЙ:**

```javascript
// =============================================
// LOADING SCREEN
// =============================================

var LS_QUOTES = [
  { text: 'Не всякий путь, что уводит прочь, ведёт к потере.', author: '— Геральт из Ривии' },
  { text: 'Зло — это зло. Меньшее, большее, среднее — всё едино. Лучше уж совсем не марать руки.', author: '— Геральт из Ривии' },
  { text: 'Трудности закаляют тех, кого не ломают.', author: '— Летопись Гвинта' },
  { text: 'Смерть — это ещё не конец. Конец — это когда перестаёшь пробовать.', author: '— Летопись Тёмного Подземелья' },
  { text: 'Твоя судьба — не приговор. Это — испытание.', author: '— Хроники Судьбы' },
  { text: 'Прежде чем стать легендой, нужно пережить сегодняшний день.', author: '— Старый Охотник' },
  { text: 'Каждый выбор — это клинок. Вопрос лишь в том, кто его держит.', author: '— Геральт из Ривии' },
  { text: 'Огонь не заботится о том, что горит. Но ты — не огонь.', author: '— Послание у Костра' },
  { text: 'Мир полон очевидных вещей, которые никто не замечает.', author: '— Старый Мудрец' },
  { text: 'Побеждает не сильнейший. Побеждает тот, кто не останавливается.', author: '— Гравировка на щите' },
  { text: 'Страх — не враг. Страх — это компас. Иди туда, где страшно.', author: '— Хроники Судьбы' },
  { text: 'Ни одна победа не даётся без жертвы. Вопрос в том, чем ты готов пожертвовать.', author: '— Кодекс Искателя' },
  { text: 'Слабость — не порок. Слабость, которую не преодолевают — вот порок.', author: '— Наставник Гильдии' },
  { text: 'Некоторые двери открываются только изнутри.', author: '— Летопись Забытых Руин' },
  { text: 'Ты — сумма всех своих решений. Каждое задание меняет тебя.', author: '— Хроники Судьбы' },
];

var LS_TIPS = [
  'Совет: Выполняй квесты в срок — просроченные задания снижают репутацию героя',
  'Совет: Регулярные обряды дают серию. Не прерывай её.',
  'Совет: Подземелье открывается после выполнения первого квеста',
  'Совет: Приоритет квестов рассчитывается по дедлайну, важности и сложности',
  'Совет: Квесты с дедлайном "сегодня" всегда идут первыми',
  'Совет: Claude API генерирует фэнтезийные названия для твоих задач',
  'Совет: Победа над боссом в подземелье даёт редкое снаряжение',
  'Совет: Класс героя меняется автоматически — зависит от типа квестов',
  'Совет: Записывай события в Летопись — не пропустишь важные дедлайны',
  'Совет: Серия обрядов — лучший способ прокачать характеристики',
];

// AI-фоны загрузочного экрана через Pollinations
var LS_BACKGROUNDS = [
  'dark fantasy ancient castle ruins at night, moonlight, dramatic atmosphere, Dragon Age concept art, no characters, cinematic',
  'dark fantasy mystical forest path, ancient trees, blue fog, torchlight, Dragon Age environment art, no characters',
  'dark fantasy underground dungeon, stone pillars, torchlight, ancient ruins, Dragon Age concept art, atmospheric, no characters',
  'dark fantasy mountain fortress, stormy sky, lightning, dramatic lighting, Dragon Age environment art, no characters',
  'dark fantasy gothic cathedral interior, stained glass moonlight, candles, Dragon Age concept art, no characters',
  'dark fantasy swamp at night, bioluminescent plants, mist, Dragon Age environment art, atmospheric, no characters',
];

function showLoadingScreen(onComplete) {
  var screen = document.getElementById('loading-screen');
  screen.style.display = 'flex';
  screen.style.opacity = '1';

  // Случайная цитата
  var q = LS_QUOTES[Math.floor(Math.random() * LS_QUOTES.length)];
  document.getElementById('ls-quote').textContent  = '\u201c' + q.text + '\u201d';
  document.getElementById('ls-author').textContent = q.author;

  // Случайный совет
  var tip = LS_TIPS[Math.floor(Math.random() * LS_TIPS.length)];
  document.getElementById('ls-tip').textContent = tip;

  // Случайный AI-фон
  var bgPrompt = LS_BACKGROUNDS[Math.floor(Math.random() * LS_BACKGROUNDS.length)];
  var seed = Math.floor(Math.random() * 9000) + 1000;
  var bgUrl = 'https://image.pollinations.ai/prompt/'
    + encodeURIComponent(bgPrompt + ', dark color palette, masterpiece, highly detailed')
    + '?width=1200&height=700&seed=' + seed + '&nologo=true&model=flux';

  var bgEl = document.getElementById('ls-bg');
  var bgImg = new Image();
  bgImg.onload = function() {
    bgEl.style.backgroundImage = 'url(' + bgUrl + ')';
    bgEl.style.opacity = '1';
  };
  bgImg.src = bgUrl;

  // Плавное появление элементов
  setTimeout(function() {
    document.getElementById('ls-logo').style.opacity     = '1';
    document.getElementById('ls-ornament').style.opacity = '1';
    document.getElementById('ls-quote').style.opacity    = '1';
    document.getElementById('ls-author').style.opacity   = '1';
  }, 100);

  // Прогресс-бар
  var bar      = document.getElementById('ls-bar');
  var progress = 0;
  var duration = 2200; // мс до появления подсказки
  var interval = 40;
  var steps    = duration / interval;
  var barTimer = setInterval(function() {
    progress += (100 / steps);
    bar.style.width = Math.min(progress, 100) + '%';
    if (progress >= 100) {
      clearInterval(barTimer);
      // Показываем подсказку и совет
      document.getElementById('ls-hint').style.opacity = '1';
      document.getElementById('ls-tip').style.opacity  = '1';
    }
  }, interval);

  // Закрытие по клику или клавише
  var _closed = false;
  function closeScreen() {
    if (_closed) return;
    _closed = true;
    clearInterval(barTimer);
    screen.classList.add('fade-out');
    setTimeout(function() {
      screen.style.display = 'none';
      screen.classList.remove('fade-out');
      if (onComplete) onComplete();
    }, 800);
  }

  // Минимум 1.5 сек перед возможностью закрыть
  setTimeout(function() {
    screen.addEventListener('click',    closeScreen, { once: true });
    screen.addEventListener('keydown',  closeScreen, { once: true });
    document.addEventListener('keydown', closeScreen, { once: true });
  }, 1500);

  // Автозакрытие через 6 сек
  setTimeout(function() { closeScreen(); }, 6000);
}
```

---

## ИЗМЕНЕНИЕ 4: обновить launchApp — показывать экран загрузки

**НАЙДИ:**
```javascript
function launchApp() {
  document.getElementById('onboarding').style.display = 'none';
  document.getElementById('app').style.display = 'block';
  initAll();
}
```

**ЗАМЕНИ НА:**
```javascript
function launchApp() {
  document.getElementById('onboarding').style.display = 'none';

  showLoadingScreen(function() {
    document.getElementById('app').style.display = 'block';
    // Плавное появление приложения
    document.getElementById('app').style.opacity = '0';
    document.getElementById('app').style.transition = 'opacity .5s ease';
    requestAnimationFrame(function() {
      document.getElementById('app').style.opacity = '1';
      setTimeout(function() {
        document.getElementById('app').style.transition = '';
      }, 600);
    });
    initAll();
  });
}
```

---

## Что получится

| Элемент | Описание |
|---|---|
| Запуск | Чёрный экран → плавное появление логотипа |
| AI-фон | Случайный dark fantasy пейзаж через Pollinations, 6 вариантов |
| Цитата | 15 цитат в стиле Ведьмак/Dark Souls, каждый раз другая |
| Прогресс-бар | Золотая полоска внизу, заполняется за 2.2 сек |
| Подсказка | "НАЖМИ ЛЮБУЮ КЛАВИШУ" с мерцанием как в Dark Souls |
| Совет | Случайная подсказка по игре внизу экрана |
| Закрытие | Клик, любая клавиша, или автоматически через 6 сек |
| Переход | Fade out экрана загрузки → fade in приложения |
