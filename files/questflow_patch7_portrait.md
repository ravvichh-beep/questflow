# QuestFlow — Патч 7: AI-портрет героя и экран персонажа

## Совместимость
- Опирается на CSS из Патча 2 (.char-panel, .portrait, .cname, .ccls)
- Не конфликтует с Патчами 3, 5, 6
- renderChar и portraitInner не трогались другими патчами — безопасно заменять

---

## ИЗМЕНЕНИЕ 1: HTML экрана персонажа — портрет

**НАЙДИ:**
```html
<svg class="portrait" id="portrait-svg" viewBox="0 0 110 140" fill="none"></svg>
```

**ЗАМЕНИ НА:**
```html
<div class="portrait-wrap" id="portrait-wrap">
  <!-- Shimmer пока грузится AI-картинка -->
  <div class="portrait-shimmer" id="portrait-shimmer"></div>
  <!-- AI-портрет -->
  <img class="portrait-img" id="portrait-img" src="" alt=""
    onload="this.style.opacity='1';document.getElementById('portrait-shimmer').style.display='none';"
    onerror="document.getElementById('portrait-svg-fallback').style.display='block';this.style.display='none';document.getElementById('portrait-shimmer').style.display='none';"
    style="opacity:0;transition:opacity .8s ease">
  <!-- SVG fallback если Pollinations недоступен -->
  <svg class="portrait-svg-fb" id="portrait-svg-fallback" viewBox="0 0 110 140" fill="none" style="display:none"></svg>
  <!-- Класс/уровень поверх портрета -->
  <div class="portrait-badge" id="portrait-badge">УР. 1</div>
</div>
```

---

## ИЗМЕНЕНИЕ 2: CSS для нового портрета

**НАЙДИ в CSS** (в Патче 2 или оригинале) блок:
```css
.portrait{
  width:110px;height:140px;
  margin:0 auto 16px;display:block;
  ...
}
```

**ЗАМЕНИ НА:**
```css
.portrait-wrap{
  width:120px;height:155px;
  margin:0 auto 16px;
  position:relative;border-radius:var(--r);
  overflow:hidden;
  box-shadow:0 0 0 1px var(--bdm), 0 8px 32px rgba(0,0,0,.6);
}
.portrait-wrap::before{
  content:'';position:absolute;inset:0;z-index:2;
  background:linear-gradient(to bottom,transparent 60%,rgba(4,9,15,.8) 100%);
  pointer-events:none;
}
.portrait-shimmer{
  position:absolute;inset:0;
  background:linear-gradient(90deg,#080f1a 25%,#0c1624 50%,#080f1a 75%);
  background-size:400px 100%;
  animation:shimmer 1.6s infinite;
}
.portrait-img{
  width:100%;height:100%;
  object-fit:cover;object-position:top center;
  display:block;
}
.portrait-svg-fb{
  width:100%;height:100%;display:block;
}
.portrait-badge{
  position:absolute;bottom:6px;left:0;right:0;
  text-align:center;z-index:3;
  font-family:var(--ff-title);font-size:9px;
  letter-spacing:2px;color:var(--gold);
  text-shadow:0 0 8px rgba(212,168,74,.6);
  text-transform:uppercase;
}
```

---

## ИЗМЕНЕНИЕ 3: JS — промпты для AI-портрета героя

**НАЙДИ** строку `function portraitInner()` и **ЗАМЕНИ всю функцию** вместе с добавлением новых:

```javascript
// Промпты для AI-портрета героя по классу
var HERO_PORTRAIT_PROMPTS = {
  keeper:   'dark fantasy scholar mage hero portrait, ancient robes, glowing blue runes, wise expression, candlelight, bookshelf background, Dragon Age Origins character art style, highly detailed, bust shot, dark moody lighting',
  warrior:  'dark fantasy warrior knight hero portrait, battle-worn armor, red cloak, determined expression, torchlight, stone wall background, Dragon Age Origins character art style, highly detailed, bust shot, cinematic lighting',
  druid:    'dark fantasy druid hero portrait, nature robes, green magical energy, calm expression, forest background, Dragon Age Origins character art style, highly detailed, bust shot, soft natural lighting',
  rogue:    'dark fantasy rogue ranger hero portrait, leather armor, hood, cunning expression, tavern background, Dragon Age Origins character art style, highly detailed, bust shot, dramatic shadows',
  wanderer: 'dark fantasy wanderer hero portrait, travel cloak, mystical staff, thoughtful expression, ancient ruins background, Dragon Age Origins character art style, highly detailed, bust shot, dusk lighting'
};

// Генерация URL для AI-портрета (привязан к имени — не меняется при перезагрузке)
function heroPortraitUrl() {
  var cls    = S.hero.cls || 'keeper';
  var prompt = HERO_PORTRAIT_PROMPTS[cls] || HERO_PORTRAIT_PROMPTS.keeper;
  // Seed из имени героя — один и тот же герой всегда одинаковый
  var nameSeed = (S.hero.name || 'hero').split('').reduce(function(a, c) {
    return a + c.charCodeAt(0);
  }, 0);
  var clsSeed = { keeper:1000, warrior:2000, druid:3000, rogue:4000, wanderer:5000 };
  var seed = nameSeed + (clsSeed[cls] || 1000);
  return 'https://image.pollinations.ai/prompt/'
    + encodeURIComponent(prompt + ', dark color palette, masterpiece, professional portrait')
    + '?width=240&height=320&seed=' + seed + '&nologo=true&model=flux';
}

// Оригинальный SVG fallback — используется если Pollinations недоступен
function portraitInner() {
  var colors = { keeper:'#3d7bc8', warrior:'#c83d3d', druid:'#28a058', rogue:'#c8883d', wanderer:'#7838b0' };
  var col = colors[S.hero.cls] || '#3d7bc8';
  return '<defs><linearGradient id="pg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="' + col + '" stop-opacity=".25"/><stop offset="100%" stop-color="' + col + '" stop-opacity=".05"/></linearGradient></defs>'
    + '<ellipse cx="55" cy="136" rx="38" ry="4" fill="' + col + '" opacity=".07"/>'
    + '<path d="M22 86 L11 132 L99 132 L88 86Z" fill="url(#pg)" stroke="' + col + '" stroke-width=".7" stroke-opacity=".4"/>'
    + '<path d="M24 84 L4 128 L22 128 L30 104Z" fill="' + col + '" opacity=".1"/>'
    + '<path d="M86 84 L106 128 L88 128 L80 104Z" fill="' + col + '" opacity=".1"/>'
    + '<path d="M33 70 L33 106 L77 106 L77 70Z" fill="' + col + '" opacity=".12" stroke="' + col + '" stroke-width=".4" stroke-opacity=".35"/>'
    + '<text x="55" y="94" text-anchor="middle" font-size="13" fill="' + col + '" opacity=".4">✦</text>'
    + '<rect x="35" y="106" width="40" height="5" rx="2" fill="#c8a84a" opacity=".6"/>'
    + '<line x1="96" y1="20" x2="88" y2="132" stroke="' + col + '" stroke-width="2.5" opacity=".5"/>'
    + '<circle cx="96" cy="17" r="7.5" fill="#060d18" stroke="' + col + '" stroke-width=".8"/>'
    + '<circle cx="96" cy="17" r="2.5" fill="' + col + '" opacity=".8"/>'
    + '<rect x="48" y="52" width="14" height="17" rx="4" fill="#c8a882"/>'
    + '<ellipse cx="55" cy="40" rx="18" ry="20" fill="#c8a882"/>'
    + '<path d="M36 35 Q55 13 74 35 L71 49 Q55 30 39 49Z" fill="' + col + '" opacity=".85"/>'
    + '<ellipse cx="48" cy="39" rx="2.8" ry="2.2" fill="' + col + '" opacity=".7"/>'
    + '<ellipse cx="62" cy="39" rx="2.8" ry="2.2" fill="' + col + '" opacity=".7"/>';
}
```

---

## ИЗМЕНЕНИЕ 4: JS — renderChar с AI-портретом

**НАЙДИ и ЗАМЕНИ** функцию `renderChar` целиком:

```javascript
function renderChar() {
  var h = S.hero;

  document.getElementById('c-name').textContent = h.name || '—';
  document.getElementById('c-cls').textContent  = h.clsName || '—';

  var p = Math.round(h.xp / h.xpMax * 100);
  document.getElementById('c-xp-bar').style.width = p + '%';
  document.getElementById('c-xp-lbl').textContent = h.xp + '/' + h.xpMax;

  document.getElementById('sv-hp').textContent  = h.hp;
  document.getElementById('sv-dmg').textContent = h.dmg;
  document.getElementById('sv-def').textContent = h.def;
  document.getElementById('sv-stm').textContent = h.stam;

  document.getElementById('s-hp').style.width  = Math.min(100, Math.round(h.hp / 3)) + '%';
  document.getElementById('s-dmg').style.width = Math.min(100, Math.round(h.dmg / 0.8)) + '%';
  document.getElementById('s-def').style.width = Math.min(100, h.def) + '%';
  document.getElementById('s-stm').style.width = Math.min(100, h.stam) + '%';

  document.getElementById('c-gold').textContent = '🪙 ' + h.gold;

  // Обновляем badge уровня поверх портрета
  var badge = document.getElementById('portrait-badge');
  if (badge) badge.textContent = 'УР. ' + h.lvl;

  // AI-портрет
  var img     = document.getElementById('portrait-img');
  var shimmer = document.getElementById('portrait-shimmer');
  var svgFb   = document.getElementById('portrait-svg-fallback');

  if (img) {
    var url = heroPortraitUrl();
    // Перегружаем только если класс изменился (чтобы не мигало при каждом открытии)
    if (img.dataset.loadedCls !== h.cls || img.dataset.loadedName !== h.name) {
      img.dataset.loadedCls  = h.cls;
      img.dataset.loadedName = h.name;
      img.style.opacity = '0';
      img.style.display = 'block';
      if (shimmer) shimmer.style.display = 'block';
      if (svgFb)   svgFb.style.display   = 'none';
      img.src = url;
    }
  }

  // SVG fallback — заполняем на случай ошибки загрузки
  if (svgFb) svgFb.innerHTML = portraitInner();

  renderAch();
}
```

---

## ИЗМЕНЕНИЕ 5: CSS — улучшенный char-panel с фоном по классу

**ДОБАВИТЬ в конец CSS** (перед `</style>`):

```css
/* ===== ПОРТРЕТ ГЕРОЯ ===== */

/* Цвет акцента char-panel меняется под класс — задаётся через JS */
.char-panel[data-cls="keeper"]  { --cls-color: #3d7bc8; --cls-glow: rgba(61,123,200,.15); }
.char-panel[data-cls="warrior"] { --cls-color: #c83d3d; --cls-glow: rgba(200,61,61,.15);  }
.char-panel[data-cls="druid"]   { --cls-color: #28a058; --cls-glow: rgba(40,160,88,.15);  }
.char-panel[data-cls="rogue"]   { --cls-color: #c8883d; --cls-glow: rgba(200,136,61,.15); }
.char-panel[data-cls="wanderer"]{ --cls-color: #7838b0; --cls-glow: rgba(120,56,176,.15); }

/* Полоска вверху панели — цвет класса */
.char-panel::before{
  background:linear-gradient(90deg,transparent,var(--cls-color,var(--sap)),transparent) !important;
  opacity:.7;
}
/* Фоновое свечение под класс */
.char-panel::after{
  background:radial-gradient(circle at 50% 0%,var(--cls-glow,rgba(64,136,216,.06)) 0%,transparent 70%) !important;
}

/* Имя героя — крупнее */
.cname{
  font-size:17px !important;
  letter-spacing:1.5px;
}
/* Класс героя — с цветом класса */
.ccls{
  color:var(--cls-color,var(--gold)) !important;
  font-size:13px;
}
```

---

## ИЗМЕНЕНИЕ 6: JS — применять data-cls к char-panel

**НАЙДИ внутри функции `renderChar`** строку:
```javascript
  document.getElementById('c-gold').textContent = '🪙 ' + h.gold;
```

**ДОБАВИТЬ ПОСЛЕ НЕЁ:**
```javascript
  // Обновляем класс панели для CSS-переменных цвета
  var panel = document.querySelector('.char-panel');
  if (panel) panel.setAttribute('data-cls', h.cls || 'keeper');
```

---

## Что изменится

| Элемент | До | После |
|---|---|---|
| Портрет | Простой SVG силуэт | AI-картинка в стиле Dragon Age, уникальная для имени+класса |
| Смена класса | Нет реакции | Портрет перегружается с новым промптом |
| Цвет панели | Всегда синий | Подстраивается под класс (синий/красный/зелёный/оранжевый/фиолетовый) |
| Полоска вверху | Синяя | Цвет текущего класса |
| Уровень | Только в topbar | Бейдж поверх портрета |
| Загрузка | Мгновенно (SVG) | Shimmer → fade-in за 0.8s; при ошибке — SVG fallback |
| Кэш | — | Портрет не перегружается при каждом открытии вкладки |

## Проверка совместимости с предыдущими патчами

| Патч | Конфликт | Статус |
|---|---|---|
| Патч 1 | Нет — не трогает portrait | ✓ |
| Патч 2 | Заменяет `.portrait` CSS → мы заменяем на `.portrait-wrap` | ✓ Совместимо |
| Патч 3 | Не трогает renderChar | ✓ |
| Патч 4 | Не трогает renderChar | ✓ |
| Патч 5 | showLevelUp вызывает renderChar через initAll — работает | ✓ |
| Патч 6 | AI-картинки врагов — отдельный элемент, нет пересечений | ✓ |
| Fixes | main-wrap/sidenav высота — не связано с portrait | ✓ |
