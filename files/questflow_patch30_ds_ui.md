# QuestFlow — Патч 30: Dark Souls UI — AI фоны, иконки-барельефы, Elden Ring инвентарь

## Что делает патч
1. Палитра — полностью Dark Souls 3 / Elden Ring
2. Фон каждой вьюхи — уникальная AI-картинка через Pollinations, затемнённая
3. Навигация — AI иконки-барельефы (золотые медальоны) вместо эмодзи
4. Лавка и инвентарь — сетка ячеек как в Elden Ring
5. Типографика — строже, меньше закруглений
6. Topbar — как в Dark Souls: HP и FP бары видны всегда

## Совместимость
- Патч 1/2 меняли CSS — этот патч их переопределяет через :root и точечные замены ✓
- Патч 6/7 (AI-картинки врагов/портрет) — не конфликтует, разные элементы ✓
- Патч 9 (звуки) — не трогаем ✓
- Патчи 11-29 — CSS-классы не пересекаются ✓

---

## ИЗМЕНЕНИЕ 1: Новые CSS-переменные — Dark Souls палитра

**НАЙДИ и ЗАМЕНИ весь блок `:root{...}`:**

```css
:root{
  --ff-title:"Palatino Linotype","Book Antiqua",Palatino,"Times New Roman",serif;
  --ff-body:Georgia,"Times New Roman",serif;
  --ff-ui:system-ui,-apple-system,sans-serif;

  /* Dark Souls / Elden Ring палитра */
  --bg:#080808;
  --bg2:#0c0c10;
  --bg3:#101014;
  --bg4:#141418;
  --bg5:#1a1a20;

  /* Золото — пепельное как в Dark Souls */
  --gold:#a08040;
  --gold2:#c8a050;
  --gold3:#604818;
  --gold-dim:#604818;
  --gold-glow:rgba(160,128,64,.15);

  /* Синий — сдержанный, для FP */
  --blue:#102040;
  --blue2:#1a3060;
  --sap:#2a5090;
  --sky:#4a80c0;

  /* Красный — для HP */
  --red:#6a0000;
  --red2:#c02020;

  /* Текст — пергаментный */
  --text:#c8bfa8;
  --text2:#807060;
  --text3:#3a3028;

  /* Границы — золотые, очень тонкие */
  --bd:rgba(160,128,64,.1);
  --bdm:rgba(160,128,64,.2);
  --bdg:rgba(160,128,64,.35);
  --bdg2:rgba(160,128,64,.08);

  /* Семантические */
  --green:#206040;
  --purple:#402060;

  /* Стекло */
  --glass:rgba(8,8,12,.88);
  --glass2:rgba(10,10,14,.95);

  /* Радиус — минимальный как в DS */
  --r:2px;
  --r2:3px;

  /* Тени */
  --shadow-card:0 4px 20px rgba(0,0,0,.8), 0 1px 0 rgba(160,128,64,.06) inset;
  --shadow-hover:0 8px 32px rgba(0,0,0,.9), 0 0 0 1px rgba(160,128,64,.2);
  --shadow-gold:0 0 16px rgba(160,128,64,.2), 0 2px 8px rgba(0,0,0,.8);
}
```

---

## ИЗМЕНЕНИЕ 2: body — тёмный фон

**НАЙДИ:**
```css
body{font-family:var(--ff-body);background:var(--bg);color:var(--text);min-height:100vh;overflow-x:hidden}
```

**ЗАМЕНИ НА:**
```css
body{
  font-family:var(--ff-body);
  background:var(--bg);
  color:var(--text);
  min-height:100vh;
  overflow-x:hidden;
}
/* Глобальный шум — текстура пергамента поверх всего */
body::before{
  content:'';
  position:fixed;inset:0;
  background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E");
  pointer-events:none;z-index:9999;opacity:.4;
}
```

---

## ИЗМЕНЕНИЕ 3: Topbar — Dark Souls стиль с HP/FP барами

**НАЙДИ и ЗАМЕНИ весь блок** от `.topbar{` до `.tright{`:

```css
.topbar{
  position:fixed;top:0;left:0;right:0;height:52px;
  background:rgba(6,6,8,.98);
  border-bottom:1px solid var(--bdm);
  display:flex;align-items:center;justify-content:space-between;
  padding:0 16px 0 76px;z-index:100;
  box-shadow:0 2px 20px rgba(0,0,0,.9);
}
/* Золотая черта поверх топбара */
.topbar::before{
  content:'';position:absolute;top:0;left:0;right:0;height:1px;
  background:linear-gradient(90deg,transparent,var(--gold),transparent);
  opacity:.4;
}
.logo{
  font-family:var(--ff-title);font-size:16px;
  color:var(--gold);letter-spacing:5px;
  text-transform:uppercase;
  text-shadow:0 0 16px rgba(160,128,64,.25);
}
.logo span{color:var(--text3);font-weight:normal;letter-spacing:3px}

.tmid{display:flex;align-items:center;gap:16px}
.lvlbadge{
  font-family:var(--ff-title);font-size:9px;
  color:var(--text2);
  background:transparent;
  border:none;
  letter-spacing:3px;
  padding:0;
  text-transform:uppercase;
}

/* HP/FP бары в топбаре — как в Dark Souls */
.ds-vitals{display:flex;flex-direction:column;gap:3px}
.ds-vital-row{display:flex;align-items:center;gap:6px}
.ds-vital-lbl{
  font-family:var(--ff-title);font-size:7px;
  letter-spacing:2px;color:var(--text3);
  width:18px;text-align:right;text-transform:uppercase;
}
.ds-vital-bar{width:90px;height:5px;background:rgba(0,0,0,.6);border:1px solid rgba(255,255,255,.06);border-radius:1px;overflow:hidden}
.ds-hp-fill{height:100%;background:linear-gradient(90deg,#5a0000,#b01818,#c82020);border-radius:1px;transition:width .4s;box-shadow:0 0 4px rgba(192,32,32,.4)}
.ds-fp-fill{height:100%;background:linear-gradient(90deg,#001030,#102060,#1a3090);border-radius:1px;transition:width .4s;box-shadow:0 0 4px rgba(26,48,144,.4)}
.ds-vital-val{font-family:var(--ff-title);font-size:8px;color:var(--text3);letter-spacing:.5px;min-width:36px}

.xprow{display:flex;align-items:center;gap:6px}
.xplbl{font-family:var(--ff-title);font-size:7px;letter-spacing:2px;color:var(--text3)}
.xpbar{width:80px;height:2px;background:rgba(255,255,255,.05);border-radius:1px;overflow:hidden}
.xpf{height:100%;background:linear-gradient(90deg,var(--blue2),var(--sap));border-radius:1px;transition:width .5s}
.xpn{font-size:9px;color:var(--text3)}
.goldrow{font-family:var(--ff-title);font-size:11px;color:var(--gold);letter-spacing:1px}
.tright{display:flex;gap:8px;align-items:center}
.rbtn,.apibtn{
  font-family:var(--ff-title);font-size:8px;letter-spacing:1.5px;
  padding:4px 9px;border-radius:var(--r);cursor:pointer;transition:all .15s;
  text-transform:uppercase;
}
.rbtn{color:var(--red2);background:rgba(106,0,0,.1);border:1px solid rgba(106,0,0,.3)}
.rbtn:hover{background:rgba(106,0,0,.2)}
.apibtn{color:var(--text3);background:transparent;border:1px solid var(--bd)}
.apibtn:hover{color:var(--gold);border-color:var(--bdm)}
.apibtn.set{color:#206040;border-color:rgba(32,96,64,.3)}
```

---

## ИЗМЕНЕНИЕ 4: Sidenav — AI медальоны

**НАЙДИ и ЗАМЕНИ** от `/* SIDENAV */` до `/* MAIN */`:

```css
/* SIDENAV */
.sidenav{
  position:fixed;top:52px;left:0;bottom:0;width:60px;
  background:rgba(6,6,8,.98);
  border-right:1px solid var(--bdm);
  display:flex;flex-direction:column;align-items:center;
  padding:8px 0;gap:2px;z-index:99;
  box-shadow:2px 0 16px rgba(0,0,0,.8);
}
.ni{
  width:44px;height:44px;
  display:flex;align-items:center;justify-content:center;
  border-radius:var(--r);cursor:pointer;
  border:1px solid transparent;
  position:relative;user-select:none;
  transition:all .2s;
  background:transparent;
  overflow:hidden;
}
/* Иконка — AI медальон через img */
.ni img{
  width:36px;height:36px;
  object-fit:cover;border-radius:1px;
  filter:brightness(.35) sepia(.3);
  transition:filter .2s;
  display:block;
}
.ni:hover img{filter:brightness(.6) sepia(.2)}
.ni.active img{filter:brightness(1) sepia(.1)}
.ni.active{
  border-color:rgba(160,128,64,.35);
  background:rgba(160,128,64,.05);
  box-shadow:0 0 10px rgba(160,128,64,.1);
}
/* Активный индикатор слева */
.ni.active::before{
  content:'';position:absolute;left:0;top:50%;transform:translateY(-50%);
  width:2px;height:20px;
  background:linear-gradient(180deg,var(--gold2),var(--gold));
  box-shadow:0 0 6px rgba(160,128,64,.6);
}
/* Tooltip */
.ni-tip{
  position:absolute;left:52px;
  background:rgba(8,8,12,.97);
  border:1px solid var(--bdm);
  color:var(--text);
  font-family:var(--ff-title);font-size:9px;letter-spacing:2px;
  padding:4px 10px;border-radius:var(--r);
  white-space:nowrap;opacity:0;pointer-events:none;
  transition:opacity .15s;z-index:200;
  text-transform:uppercase;
}
.ni:hover .ni-tip{opacity:1}
.nsep{width:28px;height:1px;background:var(--bd);margin:4px 0}
.nbadge{
  position:absolute;top:4px;right:4px;
  width:10px;height:10px;
  background:var(--red2);border-radius:50%;
  font-size:6px;display:flex;align-items:center;justify-content:center;color:#fff;
  box-shadow:0 0 5px rgba(192,32,32,.5);
}
```

---

## ИЗМЕНЕНИЕ 5: main-wrap с AI фонами

**НАЙДИ:**
```css
/* MAIN */
.main-wrap{margin-top:50px;margin-left:60px;height:calc(100vh - 50px);overflow-y:auto}
.view{display:none;min-height:100%}.view.active{display:block}
```

**ЗАМЕНИ НА:**
```css
/* MAIN */
.main-wrap{
  margin-top:52px;margin-left:60px;
  height:calc(100vh - 52px);overflow-y:auto;
  position:relative;
}
.view{display:none;min-height:100%;position:relative}.view.active{display:block}

/* Фоновая картинка вьюхи */
.view-bg{
  position:fixed;
  top:52px;left:60px;right:0;bottom:0;
  z-index:0;
  pointer-events:none;
  opacity:0;transition:opacity 1.2s ease;
}
.view-bg img{
  width:100%;height:100%;
  object-fit:cover;object-position:center;
  display:block;
  filter:brightness(.22) saturate(.7);
}
/* Поверх фона — виньетка */
.view-bg::after{
  content:'';position:absolute;inset:0;
  background:
    radial-gradient(ellipse at 50% 0%, rgba(8,8,8,.3) 0%, rgba(8,8,8,.85) 60%),
    linear-gradient(to bottom, rgba(8,8,8,.5) 0%, rgba(8,8,8,.2) 30%, rgba(8,8,8,.7) 100%);
}
.view-bg.loaded{opacity:1}

/* Контент поверх фона */
.view .pad{position:relative;z-index:1}
.view .dung-wrap{position:relative;z-index:1}
```

---

## ИЗМЕНЕНИЕ 6: JS — AI медальоны для навигации

**НАЙДИ** строку `// =============================================` с `// FOCUS WINDOW`
и **ДОБАВЬ ПЕРЕД НЕЙ:**

```javascript
// =============================================
// DS UI — AI BACKGROUNDS & MEDALLION ICONS
// =============================================

// AI фоны для каждой вьюхи
var VIEW_BG_PROMPTS = {
  quests:    'dark fantasy ancient stone hall cathedral, torchlight flickering, deep shadows, empty throne, Dragon Age Origins environment, cinematic atmospheric, no characters, masterpiece',
  journal:   'dark fantasy ancient library underground, floating candles, dust motes, old tomes and scrolls, Dragon Age environment art, atmospheric dark, no characters',
  projects:  'dark fantasy world map on stone table, ancient cartography tools, candle light, Dragon Age Origins concept art, atmospheric, no characters',
  calendar:  'dark fantasy astronomical observatory, celestial maps stone, moonlight through window, Dragon Age Origins concept art, atmospheric, no characters',
  routines:  'dark fantasy monastery training hall, weapon racks stone floor, torchlight, Dragon Age Origins environment, atmospheric, no characters',
  archive:   'dark fantasy underground vault stone, sealed doors, ancient relics, torchlight, Dragon Age Origins concept art, atmospheric, no characters',
  character: 'dark fantasy armory stone hall, armour stands weapons displayed, torchlight, Dragon Age Origins environment concept art, atmospheric, no characters',
  stats:     'dark fantasy war room stone table, battle maps candles, Dragon Age Origins concept art, cinematic atmospheric, no characters',
  dungeon:   'dark fantasy dungeon entrance descent, ancient stone steps, darkness below, torchlight, Dragon Age Origins concept art, atmospheric, no characters',
};

// AI медальоны для навигации — барельефы Gold embossed
var NAV_MEDALLION_PROMPTS = {
  quests:    'gold bronze embossed medallion crossed swords shield, dark fantasy game icon, square flat relief, black background, highly detailed, Dark Souls style item icon',
  journal:   'gold bronze embossed medallion open book feather quill, dark fantasy game icon, square flat relief, black background, highly detailed, Dark Souls style item icon',
  projects:  'gold bronze embossed medallion ancient map compass, dark fantasy game icon, square flat relief, black background, highly detailed, Dark Souls style item icon',
  calendar:  'gold bronze embossed medallion sun moon celestial, dark fantasy game icon, square flat relief, black background, highly detailed, Dark Souls style item icon',
  routines:  'gold bronze embossed medallion infinity knot circle, dark fantasy game icon, square flat relief, black background, highly detailed, Dark Souls style item icon',
  archive:   'gold bronze embossed medallion chest treasure locked, dark fantasy game icon, square flat relief, black background, highly detailed, Dark Souls style item icon',
  character: 'gold bronze embossed medallion knight helmet armor, dark fantasy game icon, square flat relief, black background, highly detailed, Dark Souls style item icon',
  stats:     'gold bronze embossed medallion hourglass stars, dark fantasy game icon, square flat relief, black background, highly detailed, Dark Souls style item icon',
  dungeon:   'gold bronze embossed medallion skull gate entrance, dark fantasy game icon, square flat relief, black background, highly detailed, Dark Souls style item icon',
  add:       'gold bronze embossed medallion plus cross ornate, dark fantasy game icon, square flat relief, black background, highly detailed, Dark Souls style item icon',
};

function getDSIconUrl(key) {
  var prompt = NAV_MEDALLION_PROMPTS[key] || NAV_MEDALLION_PROMPTS.add;
  var seed = key.split('').reduce(function(a,c){ return a + c.charCodeAt(0); }, 0) * 137;
  return 'https://image.pollinations.ai/prompt/'
    + encodeURIComponent(prompt)
    + '?width=72&height=72&seed=' + seed + '&nologo=true&model=flux';
}

function getViewBgUrl(view) {
  var prompt = VIEW_BG_PROMPTS[view] || VIEW_BG_PROMPTS.quests;
  var seed = view.split('').reduce(function(a,c){ return a + c.charCodeAt(0); }, 0) * 251;
  return 'https://image.pollinations.ai/prompt/'
    + encodeURIComponent(prompt + ', dark color palette, ultra detailed, cinematic')
    + '?width=1200&height=800&seed=' + seed + '&nologo=true&model=flux';
}

// Инициализация иконок навигации
function initDSIcons() {
  var navMap = {
    'ni-quests':    'quests',
    'ni-journal':   'journal',
    'ni-projects':  'projects',
    'ni-calendar':  'calendar',
    'ni-routines':  'routines',
    'ni-archive':   'archive',
    'ni-character': 'character',
    'ni-stats':     'stats',
    'ni-dungeon':   'dungeon',
  };

  Object.keys(navMap).forEach(function(id) {
    var el = document.getElementById(id);
    if (!el) return;
    var key = navMap[id];
    var url = getDSIconUrl(key);

    // Убираем эмодзи текст, вставляем img
    el.innerHTML = (el.innerHTML.match(/<span class="ni-tip">.*?<\/span>/) || [''])[0];
    var img = document.createElement('img');
    img.src = url;
    img.alt = key;
    img.style.cssText = 'width:36px;height:36px;object-fit:cover;border-radius:1px;filter:brightness(.35) sepia(.3);transition:filter .2s;display:block';
    el.insertBefore(img, el.firstChild);

    // Hover через JS (CSS не работает на img внутри .ni без доп. классов)
    el.addEventListener('mouseenter', function() {
      if (!el.classList.contains('active')) img.style.filter = 'brightness(.6) sepia(.2)';
    });
    el.addEventListener('mouseleave', function() {
      if (!el.classList.contains('active')) img.style.filter = 'brightness(.35) sepia(.3)';
    });
  });

  // Кнопка добавления квеста
  var addBtn = document.querySelector('.ni[onclick*="m-add"]');
  if (addBtn) {
    var tipEl = addBtn.querySelector('.ni-tip');
    addBtn.innerHTML = tipEl ? tipEl.outerHTML : '';
    var addImg = document.createElement('img');
    addImg.src = getDSIconUrl('add');
    addImg.style.cssText = 'width:36px;height:36px;object-fit:cover;border-radius:1px;filter:brightness(.35) sepia(.3);transition:filter .2s;display:block';
    addBtn.insertBefore(addImg, addBtn.firstChild);
  }
}

// Фоновые картинки для вьюх
var _bgCache = {};

function initViewBg(viewName) {
  var viewEl = document.getElementById('view-' + viewName);
  if (!viewEl) return;

  // Уже есть фон — не создаём повторно
  if (viewEl.querySelector('.view-bg')) return;

  var bgDiv = document.createElement('div');
  bgDiv.className = 'view-bg';
  bgDiv.id = 'bg-' + viewName;

  var img = new Image();
  var url = _bgCache[viewName] || getViewBgUrl(viewName);
  _bgCache[viewName] = url;

  img.onload = function() {
    bgDiv.classList.add('loaded');
  };
  img.src = url;
  bgDiv.appendChild(img);

  // Вставляем первым дочерним элементом
  viewEl.insertBefore(bgDiv, viewEl.firstChild);
}

// Предзагрузка фонов основных вьюх
function preloadViewBgs() {
  var views = ['quests', 'journal', 'character', 'stats', 'dungeon'];
  views.forEach(function(v) {
    setTimeout(function() { initViewBg(v); }, 0);
  });
}

// Обновить HP/FP бары в топбаре
function refreshDSVitals() {
  var h   = S.hero;
  var hpPct = Math.round((h.chp || h.hp) / h.hp * 100);
  var mpPct = Math.round((h.cmp || h.mpMax) / (h.mpMax || 40) * 100);

  var hpBar = document.getElementById('ds-hp-bar');
  var fpBar = document.getElementById('ds-fp-bar');
  var hpVal = document.getElementById('ds-hp-val');
  var fpVal = document.getElementById('ds-fp-val');

  if (hpBar) hpBar.style.width = hpPct + '%';
  if (fpBar) fpBar.style.width = mpPct + '%';
  if (hpVal) hpVal.textContent = (h.chp || h.hp) + '/' + h.hp;
  if (fpVal) fpVal.textContent = (h.cmp || h.mpMax) + '/' + (h.mpMax || 40);
}
```

---

## ИЗМЕНЕНИЕ 7: HTML topbar — добавить DS-виталы

**НАЙДИ в HTML:**
```html
  <div class="tmid">
    <div class="lvlbadge" id="t-lvl">УР. 1</div>
    <div class="xprow">
      <span class="xplbl">ОП</span>
      <div class="xpbar"><div class="xpf" id="t-xp-bar" style="width:0%"></div></div>
      <span class="xpn" id="t-xp-lbl">0/1000</span>
    </div>
    <div class="goldrow">🪙 <span id="t-gold">0</span></div>
  </div>
```

**ЗАМЕНИ НА:**
```html
  <div class="tmid">
    <div class="lvlbadge" id="t-lvl">УР. 1</div>
    <div class="ds-vitals">
      <div class="ds-vital-row">
        <span class="ds-vital-lbl">HP</span>
        <div class="ds-vital-bar"><div class="ds-hp-fill" id="ds-hp-bar" style="width:100%"></div></div>
        <span class="ds-vital-val" id="ds-hp-val"></span>
      </div>
      <div class="ds-vital-row">
        <span class="ds-vital-lbl">FP</span>
        <div class="ds-vital-bar"><div class="ds-fp-fill" id="ds-fp-bar" style="width:100%"></div></div>
        <span class="ds-vital-val" id="ds-fp-val"></span>
      </div>
    </div>
    <div class="xprow">
      <span class="xplbl">ОП</span>
      <div class="xpbar"><div class="xpf" id="t-xp-bar" style="width:0%"></div></div>
      <span class="xpn" id="t-xp-lbl">0/1000</span>
    </div>
    <div class="goldrow">🪙 <span id="t-gold">0</span></div>
  </div>
```

---

## ИЗМЕНЕНИЕ 8: обновить sw() — инициализировать фон при переходе

**НАЙДИ в sw()** (финальная версия со всеми патчами):
```javascript
    if (name === 'archive')   renderArchive();
```

**ЗАМЕНИ НА:**
```javascript
    if (name === 'archive')   renderArchive();
    // Инициализируем фон новой вьюхи
    initViewBg(name);
```

---

## ИЗМЕНЕНИЕ 9: добавить вызовы в initAll()

**НАЙДИ в initAll():**
```javascript
  updateHeroTitle();
  checkRoutines();
```

**ЗАМЕНИ НА:**
```javascript
  updateHeroTitle();
  checkRoutines();
  initDSIcons();
  preloadViewBgs();
  refreshDSVitals();
```

---

## ИЗМЕНЕНИЕ 10: обновить refreshTopBar — добавить витали

**НАЙДИ функцию refreshTopBar():**
```javascript
function refreshTopBar() {
  var h = S.hero;
  document.getElementById('t-lvl').textContent = 'УР. ' + h.lvl;
  var p = Math.round(h.xp / h.xpMax * 100);
  document.getElementById('t-xp-bar').style.width = p + '%';
  document.getElementById('t-xp-lbl').textContent = h.xp + '/' + h.xpMax;
  document.getElementById('t-gold').textContent = h.gold;
}
```

**ЗАМЕНИ НА:**
```javascript
function refreshTopBar() {
  var h = S.hero;
  document.getElementById('t-lvl').textContent = 'УР. ' + h.lvl;
  var p = Math.round(h.xp / h.xpMax * 100);
  document.getElementById('t-xp-bar').style.width = p + '%';
  document.getElementById('t-xp-lbl').textContent = h.xp + '/' + h.xpMax;
  document.getElementById('t-gold').textContent = h.gold;
  refreshDSVitals();
}
```

---

## ИЗМЕНЕНИЕ 11: Лавка — сетка Elden Ring

**НАЙДИ CSS** блок `.shop-grid` и `.shop-item`:
```css
.shop-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}
.shop-item{...}
```

**ЗАМЕНИ НА:**
```css
/* Elden Ring инвентарь-сетка */
.shop-grid{
  display:grid;
  grid-template-columns:repeat(auto-fill, minmax(72px, 1fr));
  gap:3px;
  background:rgba(0,0,0,.6);
  border:1px solid var(--bdm);
  padding:3px;
  border-radius:var(--r);
}
.shop-item{
  background:rgba(20,20,24,.9);
  border:1px solid rgba(160,128,64,.12);
  border-radius:1px;
  padding:8px 4px 6px;
  text-align:center;cursor:pointer;
  transition:all .15s;
  position:relative;aspect-ratio:1;
  display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;
}
.shop-item:hover{
  border-color:rgba(160,128,64,.4);
  background:rgba(160,128,64,.08);
}
.shop-item.selected{
  border-color:var(--gold);
  background:rgba(160,128,64,.12);
  box-shadow:inset 0 0 0 1px rgba(160,128,64,.3);
}
.shop-icon{font-size:26px;display:block;line-height:1}
.shop-name{
  font-family:var(--ff-title);font-size:7px;
  color:var(--text2);letter-spacing:.5px;
  line-height:1.2;max-width:64px;
  display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;
}
.shop-bonus{display:none} /* В сетке не показываем */
.shop-price{
  font-family:var(--ff-title);font-size:8px;
  color:var(--gold);letter-spacing:.5px;
}
/* Количество (как в DS) */
.shop-qty{
  position:absolute;bottom:3px;right:4px;
  font-family:var(--ff-title);font-size:8px;color:var(--text2);
}
```

---

## ИЗМЕНЕНИЕ 12: CSS — карточки квестов в DS-стиле

**НАЙДИ и ЗАМЕНИ** блок `.qcard{...}`:

```css
.qcard{
  background:rgba(10,10,14,.92);
  border:1px solid var(--bdm);
  border-radius:var(--r);
  overflow:hidden;margin-bottom:14px;
  box-shadow:var(--shadow-card);
  transition:border-color .2s;
  position:relative;
}
/* Золотая черта сверху */
.qcard::before{
  content:'';position:absolute;top:0;left:0;right:0;height:1px;
  background:linear-gradient(90deg,transparent,var(--gold),transparent);
  opacity:.3;pointer-events:none;z-index:1;
}
.qcard:hover{border-color:rgba(160,128,64,.3)}
```

---

## ИЗМЕНЕНИЕ 13: кнопки — DS минимализм

**НАЙДИ строку:**
```css
.btn{font-family:var(--ff-title);font-size:10px;letter-spacing:1.5px;border-radius:2px;transition:all .15s;display:inline-flex;align-items:center;gap:6px;padding:9px 18px;border:1px solid;cursor:pointer}
```

**ЗАМЕНИ НА:**
```css
.btn{
  font-family:var(--ff-title);font-size:9px;
  letter-spacing:2px;border-radius:1px;
  transition:all .15s;
  display:inline-flex;align-items:center;gap:6px;
  padding:8px 16px;border:1px solid;cursor:pointer;
  text-transform:uppercase;
  position:relative;
}
/* Золотая подсветка при hover */
.btn:not(:disabled):hover::after{
  content:'';position:absolute;inset:0;
  background:rgba(160,128,64,.04);
  pointer-events:none;
}
.btn-g{
  background:linear-gradient(135deg,#604010,#a08040,#604010);
  color:#080808;border-color:rgba(160,128,64,.5);
  font-weight:bold;
  box-shadow:0 0 10px rgba(160,128,64,.15);
}
.btn-g:hover{
  background:linear-gradient(135deg,#7a5018,#c0a050,#7a5018);
  box-shadow:0 0 16px rgba(160,128,64,.3);
}
.btn-o{
  background:rgba(255,255,255,.02);
  color:var(--text2);border-color:var(--bdm);
}
.btn-o:hover{color:var(--text);border-color:rgba(160,128,64,.25)}
.btn-b{
  background:rgba(26,48,96,.15);
  color:var(--sky);border-color:rgba(42,80,144,.3);
}
.btn-r{
  background:rgba(106,0,0,.12);
  color:var(--red2);border-color:rgba(106,0,0,.3);
}
.btn:disabled{opacity:.3;cursor:not-allowed}
.btn-wide{width:100%;justify-content:center;padding:12px 16px;margin-top:14px}
```

---

## Что изменится

| Элемент | До | После |
|---|---|---|
| Палитра | Тёмно-синяя | Почти чёрная DS3 — пепельное золото |
| Фон вьюх | Однотонный | AI-картинка dark fantasy, приглушённая, уникальная для каждой вкладки |
| Навигация | Эмодзи | AI барельефы — золотые медальоны в стиле DS3 |
| Topbar | Только XP-бар | HP (красный) + FP (синий) бары как в Dark Souls |
| Кнопки | Синие закруглённые | Тёмное золото, прямоугольные, uppercase |
| Лавка | Карточки 3 в ряд | Сетка Elden Ring — квадратные ячейки |
| Карточки | Тёмно-синие | Почти чёрные с золотой чертой сверху |
| Шрифт | Без изменений | Palatino — строже, больше letter-spacing |
| Текстура | Нет | Едва заметный шум поверх всего |

## Важно для Claude Code
- Медальоны загружаются при первом запуске (~2-5 сек). Потом кэшируются навсегда.
- Фоны вьюх загружаются в фоне, не блокируют UI.
- initDSIcons() заменяет эмодзи в навигации — должна вызываться ПОСЛЕ рендера DOM.
- refreshDSVitals() обновляет HP/FP при каждом изменении характеристик героя.
