# QuestFlow — Блок 0 + Блок 1: AI-фоны и редизайн экранов

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Сгенерировать 4 недостающих AI-фона, улучшить параллакс-систему фонов, и переделать 9 экранов в стиле v3 «Кодекс Охотника» (пергамент + золото + сургуч).

**Architecture:** Всё в одном файле `files/questflow.html` (~11k строк). Фоны — JPEG в `assets/web/`. Система фонов уже есть (`.view-bg`, `initViewBg`, `VIEW_BG_FILES`). Добавляем параллакс через CSS custom property + JS scroll listener. Каждый экран — отдельная `<div class="view" id="view-X">` в HTML + соответствующие CSS-стили.

**Tech Stack:** Vanilla HTML/CSS/JS, один файл. MuAPI nano-banana-2 (curl). ImageMagick (convert) для оптимизации PNG→JPEG. Netlify deploy. Playwright для визуального теста.

**Версия:** v3.2.0 → v3.3.0 (после блока 0+1)

---

## Файлы

| Действие | Файл | Ответственность |
|---|---|---|
| Modify | `files/questflow.html` | Все CSS + HTML + JS изменения |
| Copy | `index.html` | Деплой-копия (cp после каждого экрана) |
| Create | `assets/bg/bg-routines.png` | Исходник AI-фона (2K PNG) |
| Create | `assets/bg/bg-archive.png` | Исходник AI-фона |
| Create | `assets/bg/bg-stats.png` | Исходник AI-фона |
| Create | `assets/bg/bg-bestiary.png` | Исходник AI-фона |
| Create | `assets/web/bg-routines.jpg` | Оптимизированный JPEG для прода |
| Create | `assets/web/bg-archive.jpg` | Оптимизированный JPEG для прода |
| Create | `assets/web/bg-stats.jpg` | Оптимизированный JPEG для прода |
| Create | `assets/web/bg-bestiary.jpg` | Оптимизированный JPEG для прода |
| Create | `tools/jobs-missing-bgs.txt` | Задания для batch-gen.sh |
| Modify | `service-worker.js` | Обновить CACHE_NAME на v3.3.0 |

---

## БЛОК 0 — Генерация AI-фонов

### Task 1: Сгенерировать 4 недостающих фона

**Files:**
- Create: `tools/jobs-missing-bgs.txt`
- Create: `assets/bg/bg-routines.png`, `bg-archive.png`, `bg-stats.png`, `bg-bestiary.png`

- [ ] **Шаг 1: Создать файл заданий**

```
assets/bg/bg-routines.png|16:9|medieval monastery courtyard at dusk, stone arches, rows of candles on wooden tables, monks robes hanging, misty courtyard, ritual atmosphere
assets/bg/bg-archive.png|16:9|ancient underground vault with dusty grimoires and scrolls, stone shelves carved into walls, flickering torches, parchment and wax seals, forgotten knowledge
assets/bg/bg-stats.png|16:9|wizard tower interior with brass astrolabes and star charts on walls, glowing crystal orbs, maps pinned with daggers, hourglass and quill, magical observatory at night
assets/bg/bg-bestiary.png|16:9|medieval scriptorium with illuminated manuscripts open on wooden desks, inkwells and quills, shelves of leather-bound monster tomes, candlelight and shadows
```
Сохранить как `tools/jobs-missing-bgs.txt` (без двойных кавычек и обратных слэшей в промптах).

- [ ] **Шаг 2: Запустить генерацию**

```bash
cd "/c/Users/danya/OneDrive/Документы/questflow"
bash tools/batch-gen.sh tools/jobs-missing-bgs.txt
```
Ожидаемый вывод: `QUEUED assets/bg/bg-routines.png -> <uuid>`, затем через ~2-4 мин `DONE assets/bg/bg-routines.png (Xbytes)` для всех четырёх.

- [ ] **Шаг 3: Проверить что файлы созданы**

```bash
ls -lh assets/bg/bg-routines.png assets/bg/bg-archive.png assets/bg/bg-stats.png assets/bg/bg-bestiary.png
```
Ожидаемый вывод: 4 файла, каждый 4-10MB (PNG 2K).

- [ ] **Шаг 4: Оптимизировать в JPEG для веба**

```bash
for name in routines archive stats bestiary; do
  convert "assets/bg/bg-${name}.png" \
    -resize 1600x \
    -quality 82 \
    -strip \
    "assets/web/bg-${name}.jpg"
  echo "Done: assets/web/bg-${name}.jpg ($(wc -c < "assets/web/bg-${name}.jpg") bytes)"
done
```
Ожидаемый вывод: 4 JPEG файла ~150-280KB каждый.

- [ ] **Шаг 5: Добавить новые фоны в VIEW_BG_FILES**

В `files/questflow.html` найти строку (≈5830):
```javascript
var VIEW_BG_FILES = {
  quests:    'assets/web/bg-quests-board.jpg',
  journal:   'assets/web/bg-library.jpg',
  archive:   'assets/web/bg-library.jpg',
  projects:  'assets/web/bg-projects.jpg',
  calendar:  'assets/web/bg-calendar.jpg',
  routines:  'assets/web/bg-hero-hall.jpg',
  character: 'assets/web/bg-hero-hall.jpg',
  stats:     'assets/web/bg-projects.jpg',
  dungeon:   'assets/web/bg-dungeon.jpg',
  shop:      'assets/web/bg-shop.jpg',
};
```
Заменить на:
```javascript
var VIEW_BG_FILES = {
  quests:    'assets/web/bg-quests-board.jpg',
  journal:   'assets/web/bg-library.jpg',
  archive:   'assets/web/bg-archive.jpg',
  projects:  'assets/web/bg-projects.jpg',
  calendar:  'assets/web/bg-calendar.jpg',
  routines:  'assets/web/bg-routines.jpg',
  character: 'assets/web/bg-hero-hall.jpg',
  stats:     'assets/web/bg-stats.jpg',
  dungeon:   'assets/web/bg-dungeon.jpg',
  shop:      'assets/web/bg-shop.jpg',
  bestiary:  'assets/web/bg-bestiary.jpg',
};
```

- [ ] **Шаг 6: Проверить синтаксис JS**

```bash
node --check files/questflow.html 2>&1 | head -20
```
Ожидаемый вывод: пустой (без ошибок).

- [ ] **Шаг 7: Коммит**

```bash
cd "/c/Users/danya/OneDrive/Документы/questflow"
git add assets/bg/bg-routines.png assets/bg/bg-archive.png assets/bg/bg-stats.png assets/bg/bg-bestiary.png
git add assets/web/bg-routines.jpg assets/web/bg-archive.jpg assets/web/bg-stats.jpg assets/web/bg-bestiary.jpg
git add tools/jobs-missing-bgs.txt files/questflow.html
git commit -m "feat: add 4 AI backgrounds for routines/archive/stats/bestiary screens"
```

---

### Task 2: Улучшить систему фонов — параллакс + оптимальный оверлей

Сейчас фоны статичные (`position:fixed`) и слишком тёмные (`brightness(.42)`). Добавляем мягкий параллакс-сдвиг при скролле и баланс яркости.

**Files:**
- Modify: `files/questflow.html` (CSS ~618-642, JS ~5854-5892)

- [ ] **Шаг 1: Обновить CSS `.view-bg`**

Найти и заменить блок CSS (≈618-642):
```css
/* Фоновая картинка вьюхи */
.view-bg{
  position:fixed;
  top:64px;left:72px;right:0;bottom:0;
  z-index:0;
  pointer-events:none;
  opacity:0;transition:opacity 1.2s ease;
}
.view-bg img{
  width:100%;height:100%;
  object-fit:cover;object-position:center;
  display:block;
  filter:brightness(.42) saturate(.85) contrast(1.05);
}
/* Поверх фона — виньетка (мягче, чтобы AI-арт был виден) */
.view-bg::after{
  content:'';position:absolute;inset:0;
  background:
    radial-gradient(ellipse at 50% 35%, rgba(10,7,6,.15) 0%, rgba(10,7,6,.62) 75%),
    linear-gradient(to bottom, rgba(10,7,6,.45) 0%, rgba(10,7,6,.15) 35%, rgba(10,7,6,.6) 100%);
}
.view-bg.loaded{opacity:1}
```
Заменить на:
```css
/* Фоновая картинка вьюхи */
.view-bg{
  position:fixed;
  top:64px;left:72px;right:0;bottom:0;
  z-index:0;
  pointer-events:none;
  opacity:0;transition:opacity 1.4s ease;
  overflow:hidden;
}
.view-bg img{
  width:100%;
  /* Чуть выше чем контейнер — для параллакс-сдвига */
  height:115%;
  object-fit:cover;object-position:center top;
  display:block;
  /* Мягкий blur + скромное затемнение — AI-арт виден */
  filter:brightness(.52) saturate(.9) contrast(1.05) blur(1.5px);
  transform:translateY(0);
  transition:transform .05s linear;
  will-change:transform;
}
/* Поверх фона — виньетка (зональная: верх темнее, середина светлее) */
.view-bg::after{
  content:'';position:absolute;inset:0;
  background:
    linear-gradient(to bottom,
      rgba(10,7,6,.65) 0%,
      rgba(10,7,6,.18) 30%,
      rgba(10,7,6,.22) 60%,
      rgba(10,7,6,.78) 100%);
}
.view-bg.loaded{opacity:1}
/* На мобиле отключаем blur и параллакс */
@media(max-width:640px){
  .view-bg img{
    filter:brightness(.48) saturate(.9) contrast(1.05);
    height:100%;
    transform:none !important;
  }
}
```

- [ ] **Шаг 2: Добавить JS параллакс**

В `files/questflow.html` найти функцию `initViewBg` (≈5854) и добавить параллакс-инициализацию. Найти строку после закрывающей `}` функции `preloadViewBgs` (≈5892):

После блока `preloadViewBgs` добавить новую функцию:
```javascript
// Параллакс-скролл для фонов вьюх
(function initParallax() {
  // Только десктоп (ширина > 640px)
  if (window.innerWidth <= 640) return;
  var _ticking = false;
  var _scrollEl = document.querySelector('.main-wrap') || document.documentElement;
  function onScroll() {
    if (_ticking) return;
    _ticking = true;
    requestAnimationFrame(function() {
      var scrollY = _scrollEl.scrollTop || window.scrollY || 0;
      // Сдвигаем активный фон на 30% от скролла (эффект глубины)
      var activeView = document.querySelector('.view.active');
      if (activeView) {
        var bg = activeView.querySelector('.view-bg img');
        if (bg) {
          var shift = Math.min(scrollY * 0.28, 80); // макс 80px
          bg.style.transform = 'translateY(' + shift + 'px)';
        }
      }
      _ticking = false;
    });
  }
  if (_scrollEl !== document.documentElement) {
    _scrollEl.addEventListener('scroll', onScroll, {passive:true});
  }
  window.addEventListener('scroll', onScroll, {passive:true});
})();
```

- [ ] **Шаг 3: Проверить синтаксис**

```bash
node --check files/questflow.html 2>&1 | head -5
```
Ожидаемый вывод: пустой.

- [ ] **Шаг 4: Скопировать в index.html**

```bash
cp files/questflow.html index.html
```

- [ ] **Шаг 5: Коммит**

```bash
git add files/questflow.html index.html
git commit -m "feat: parallax + optimized overlay for all view backgrounds"
```

---

## БЛОК 1 — Редизайн экранов

> **Принцип на каждый экран:** находим `<div class="view" id="view-X">`, обновляем HTML внутри + добавляем CSS. После — деплой. Один экран = один коммит.

**Общий CSS-компонент (добавляем один раз, перед Task 3):**

### Task 3: Общие v3-компоненты для экранов

- [ ] **Шаг 1: Добавить CSS компоненты**

В `files/questflow.html` найти `.pad{padding:22px 26px}` (≈647) и сразу после добавить:
```css
/* ===== V3 SCREEN COMPONENTS ===== */

/* Заголовок экрана */
.v3-screen-title{
  font-family:var(--ff-title);
  font-size:10px;letter-spacing:4px;
  color:var(--gold2);
  text-transform:uppercase;
  text-align:center;
  padding:18px 0 6px;
  position:relative;
}
.v3-screen-title::before{
  content:attr(data-chapter);
  display:block;font-size:8px;letter-spacing:3px;
  color:var(--text2);margin-bottom:4px;
}
.v3-screen-title::after{
  content:'';display:block;
  width:80px;height:1px;
  background:linear-gradient(90deg,transparent,var(--gold),transparent);
  margin:8px auto 0;
}

/* Пергаментная карточка (универсальная) */
.v3-parchment{
  background:
    linear-gradient(135deg,#f0e0b8 0%,#e8d4a0 40%,#dcc888 100%);
  border-radius:var(--r2);
  position:relative;
  color:#2a1a08;
  box-shadow:
    0 2px 12px rgba(0,0,0,.6),
    inset 0 1px 0 rgba(255,255,255,.15),
    inset 0 -1px 0 rgba(0,0,0,.1);
}
.v3-parchment::before{
  content:'';position:absolute;inset:0;
  border-radius:inherit;
  background:
    radial-gradient(ellipse 60% 40% at 20% 20%,rgba(139,106,58,.12),transparent),
    radial-gradient(ellipse 40% 30% at 80% 70%,rgba(80,50,20,.08),transparent);
  pointer-events:none;
}

/* Пергаментная строка списка */
.v3-row{
  display:flex;align-items:center;gap:10px;
  padding:10px 14px;
  border-bottom:1px solid rgba(139,106,58,.18);
  font-family:var(--ff-body);
  font-size:14px;color:#2a1a08;
}
.v3-row:last-child{border-bottom:none;}

/* Сургучная печать (маленькая, для строк) */
.v3-seal-sm{
  width:28px;height:28px;border-radius:50%;
  display:flex;align-items:center;justify-content:center;
  font-size:11px;font-weight:700;
  font-family:var(--ff-title);
  flex-shrink:0;
  box-shadow:0 1px 4px rgba(0,0,0,.4);
}
.v3-seal-sm.rank-S{background:radial-gradient(circle,#b22222,#7a0000);color:#ffd700;}
.v3-seal-sm.rank-A{background:radial-gradient(circle,#c8963a,#8a5a10);color:#fff8e0;}
.v3-seal-sm.rank-B{background:radial-gradient(circle,#2a5ab0,#0a2a70);color:#c0d8ff;}
.v3-seal-sm.rank-C{background:radial-gradient(circle,#2a7840,#0a4020);color:#c0ffd8;}
.v3-seal-sm.rank-D{background:radial-gradient(circle,#555,#222);color:#aaa;}

/* Золотой разделитель */
.v3-divider{
  height:1px;
  background:linear-gradient(90deg,transparent,var(--bdg),transparent);
  margin:14px 0;
}

/* Кнопка v3 */
.v3-btn{
  font-family:var(--ff-title);
  font-size:12px;letter-spacing:2px;text-transform:uppercase;
  color:var(--gold2);
  background:transparent;
  border:1px solid var(--bdg);
  border-radius:var(--r2);
  padding:10px 18px;
  cursor:pointer;
  transition:all .2s;
}
.v3-btn:hover{
  background:rgba(184,137,63,.12);
  border-color:var(--gold2);
  box-shadow:0 0 12px rgba(184,137,63,.15);
}
.v3-btn.v3-btn-primary{
  background:linear-gradient(135deg,#8a5a10,#c8963a);
  border-color:var(--gold2);
  color:#fff8e0;
}
.v3-btn.v3-btn-primary:hover{
  background:linear-gradient(135deg,#c8963a,#e0b25a);
  box-shadow:0 0 20px rgba(184,137,63,.3);
}
```

- [ ] **Шаг 2: Проверить синтаксис**

```bash
node --check files/questflow.html 2>&1 | head -5
```

- [ ] **Шаг 3: Коммит**

```bash
git add files/questflow.html
git commit -m "feat: add v3 shared CSS components (parchment, seal, divider, btn)"
```

---

### Task 4: Экран Подземелье (dungeon)

**Files:**
- Modify: `files/questflow.html` — `id="view-dungeon"` HTML + CSS секция dungeon

- [ ] **Шаг 1: Найти текущий HTML экрана Подземелье**

```bash
grep -n 'id="view-dungeon"\|<!-- DUNG\|dung-wrap\|dung-panel' files/questflow.html | head -20
```

- [ ] **Шаг 2: Обновить заголовок экрана**

Найти открывающий тег `<div class="view" id="view-dungeon">` (≈4079-4085) и добавить v3-заголовок первым элементом внутри `.dung-wrap`:

После `<div class="view" id="view-dungeon">` найти `<div class="dung-wrap">` и добавить сразу внутри:
```html
<div class="v3-screen-title" data-chapter="CAPITULUM IX">Подземелье охотника</div>
```

- [ ] **Шаг 3: Обновить CSS карточки врага в подземелье**

Найти `.dung-panel{` и добавить после него v3-стилизацию. Найти в CSS:
```css
.dung-panel{
```
Добавить перед этим блоком:
```css
/* v3 Dungeon screen overrides */
#view-dungeon .dung-wrap{
  padding:0 26px 22px;
}
#view-dungeon .dung-enemy-name{
  font-family:var(--ff-title);
  font-size:24px;
  color:var(--gold2);
  letter-spacing:2px;
  text-shadow:0 0 20px rgba(224,178,90,.3);
}
#view-dungeon .dung-hp-bar-outer{
  background:rgba(0,0,0,.5);
  border:1px solid var(--bdg);
  border-radius:1px;
  height:8px;
  overflow:hidden;
}
#view-dungeon .dung-hp-bar-fill{
  background:linear-gradient(90deg,#6b0000,#c44545);
  height:100%;
  transition:width .6s ease;
}
#view-dungeon .dung-action-btn{
  font-family:var(--ff-title);
  font-size:13px;letter-spacing:2px;
  text-transform:uppercase;
  background:linear-gradient(135deg,rgba(139,26,26,.6),rgba(100,10,10,.8));
  border:1px solid rgba(196,69,69,.4);
  color:var(--text);
  border-radius:var(--r2);
  padding:12px 20px;
  cursor:pointer;
  transition:all .2s;
}
#view-dungeon .dung-action-btn:hover{
  background:linear-gradient(135deg,rgba(196,69,69,.4),rgba(139,26,26,.8));
  border-color:rgba(196,69,69,.8);
  box-shadow:0 0 16px rgba(196,69,69,.25);
}
#view-dungeon .dung-log{
  font-family:var(--ff-body);
  font-size:12px;
  color:var(--text2);
  background:rgba(0,0,0,.4);
  border:1px solid var(--bdg2);
  border-radius:var(--r);
  padding:10px 14px;
  max-height:120px;
  overflow-y:auto;
  line-height:1.7;
}
```

- [ ] **Шаг 4: Проверить синтаксис**

```bash
node --check files/questflow.html 2>&1 | head -5
```

- [ ] **Шаг 5: Скопировать в index.html и деплой**

```bash
cp files/questflow.html index.html
cd "/c/Users/danya/OneDrive/Документы/questflow"
netlify deploy --prod --dir .
```

- [ ] **Шаг 6: Коммит**

```bash
git add files/questflow.html index.html
git commit -m "feat: v3 redesign — Dungeon screen"
```

---

### Task 5: Экран Персонаж (character)

**Files:**
- Modify: `files/questflow.html` — `id="view-character"` HTML + CSS

- [ ] **Шаг 1: Найти HTML экрана**

```bash
grep -n 'id="view-character"\|<!-- CHAR\|char-panel\|v-char' files/questflow.html | head -15
```

- [ ] **Шаг 2: Добавить v3-заголовок**

Внутри `<div class="view" id="view-character">` добавить первым элементом:
```html
<div class="v3-screen-title" data-chapter="CAPITULUM VII">Лист охотника</div>
```

- [ ] **Шаг 3: Добавить CSS для экрана персонажа**

После `.v3-btn.v3-btn-primary:hover{...}` (конец Task 3 CSS) добавить:
```css
/* v3 Character screen */
#view-character .char-panel{
  background:
    linear-gradient(135deg,#1a0e06 0%,#2e1c0a 100%);
  border:1px solid var(--bdg);
  border-radius:var(--r2);
  padding:20px;
  display:grid;
  grid-template-columns:auto 1fr;
  gap:20px;
  align-items:start;
}
#view-character .char-portrait-wrap{
  width:100px;
  position:relative;
}
#view-character .char-portrait-wrap img{
  width:100px;height:130px;
  object-fit:cover;
  border-radius:var(--r);
  border:2px solid var(--bdg);
  filter:sepia(.2) contrast(1.05);
  box-shadow:0 4px 20px rgba(0,0,0,.7);
}
#view-character .char-name{
  font-family:var(--ff-title);
  font-size:22px;
  color:var(--gold2);
  letter-spacing:1px;
  margin-bottom:4px;
}
#view-character .char-class-badge{
  font-family:var(--ff-title);
  font-size:10px;letter-spacing:3px;
  color:var(--text2);
  text-transform:uppercase;
  margin-bottom:14px;
}
#view-character .stat-row{
  display:grid;
  grid-template-columns:90px 1fr 36px;
  align-items:center;
  gap:8px;
  margin-bottom:8px;
}
#view-character .stat-name{
  font-family:var(--ff-title);
  font-size:9px;letter-spacing:2px;
  color:var(--text2);text-transform:uppercase;
}
#view-character .stat-bar{
  height:5px;
  background:rgba(0,0,0,.4);
  border-radius:1px;
  overflow:hidden;
  border:1px solid var(--bdg2);
}
#view-character .stat-fill{
  height:100%;border-radius:1px;
  transition:width .8s cubic-bezier(.4,0,.2,1);
}
#view-character .stat-val{
  font-family:var(--ff-title);
  font-size:13px;color:var(--gold);
  text-align:right;
}
```

- [ ] **Шаг 4: Проверить синтаксис**

```bash
node --check files/questflow.html 2>&1 | head -5
```

- [ ] **Шаг 5: Деплой + коммит**

```bash
cp files/questflow.html index.html
netlify deploy --prod --dir .
git add files/questflow.html index.html
git commit -m "feat: v3 redesign — Character screen"
```

---

### Task 6: Экран Обряды (routines)

**Files:**
- Modify: `files/questflow.html` — `id="view-routines"` HTML + CSS

- [ ] **Шаг 1: Найти текущий HTML**

```bash
grep -n 'id="view-routines"\|<!-- ROUTINES\|routines-list\|routine-item\|rout-' files/questflow.html | head -20
```

- [ ] **Шаг 2: Добавить v3-заголовок**

Найти `<div class="view" id="view-routines">` и добавить первым элементом внутри `.pad`:
```html
<div class="v3-screen-title" data-chapter="CAPITULUM VI">Обряды охотника</div>
```

- [ ] **Шаг 3: Добавить CSS**

```css
/* v3 Routines screen */
#view-routines .routine-item{
  background:
    linear-gradient(135deg,#f0e0b8 0%,#e8d4a0 100%);
  border-radius:var(--r2);
  padding:12px 14px;
  margin-bottom:8px;
  display:flex;
  align-items:center;
  gap:12px;
  color:#2a1a08;
  box-shadow:0 2px 8px rgba(0,0,0,.5);
  position:relative;
  overflow:hidden;
}
#view-routines .routine-item::before{
  content:'';position:absolute;left:0;top:0;bottom:0;
  width:3px;
  background:linear-gradient(180deg,var(--gold2),var(--gold));
}
#view-routines .routine-check{
  width:24px;height:24px;border-radius:50%;
  border:2px solid rgba(139,106,58,.6);
  background:transparent;
  cursor:pointer;
  flex-shrink:0;
  display:flex;align-items:center;justify-content:center;
  transition:all .2s;
}
#view-routines .routine-check.done{
  background:radial-gradient(circle,#b8893f,#7a5018);
  border-color:var(--gold2);
}
#view-routines .routine-check.done::after{
  content:'✓';color:#fff8e0;font-size:13px;font-weight:700;
}
#view-routines .routine-title{
  font-family:var(--ff-title);
  font-size:16px;color:#2a1a08;flex:1;
}
#view-routines .routine-streak{
  font-family:var(--ff-title);
  font-size:11px;color:#8a5a10;letter-spacing:1px;
}
/* Heatmap дней недели */
#view-routines .routine-heatmap{
  display:flex;gap:3px;margin-top:6px;margin-left:36px;
}
#view-routines .routine-heatmap-day{
  width:14px;height:14px;border-radius:2px;
  background:rgba(139,106,58,.15);
  border:1px solid rgba(139,106,58,.2);
}
#view-routines .routine-heatmap-day.done{
  background:linear-gradient(135deg,var(--gold),var(--gold2));
  border-color:var(--gold2);
}
```

- [ ] **Шаг 4: Проверить синтаксис**

```bash
node --check files/questflow.html 2>&1 | head -5
```

- [ ] **Шаг 5: Деплой + коммит**

```bash
cp files/questflow.html index.html
netlify deploy --prod --dir .
git add files/questflow.html index.html
git commit -m "feat: v3 redesign — Routines screen"
```

---

### Task 7: Экран Журнал (journal)

**Files:**
- Modify: `files/questflow.html` — `id="view-journal"` HTML + CSS

- [ ] **Шаг 1: Найти HTML**

```bash
grep -n 'id="view-journal"\|j-list\|j-item\|journal-' files/questflow.html | head -15
```

- [ ] **Шаг 2: Добавить v3-заголовок**

Внутри `<div class="view" id="view-journal">` → `.pad` первым элементом:
```html
<div class="v3-screen-title" data-chapter="CAPITULUM II">Хроники побед</div>
```

- [ ] **Шаг 3: Добавить CSS таймлайна**

```css
/* v3 Journal — таймлайн */
#view-journal #j-list{
  position:relative;
  padding-left:32px;
}
#view-journal #j-list::before{
  content:'';
  position:absolute;left:10px;top:0;bottom:0;
  width:1px;
  background:linear-gradient(180deg,var(--bdg) 0%,transparent 100%);
}
#view-journal .j-item{
  position:relative;
  margin-bottom:14px;
  background:
    linear-gradient(135deg,#f0e0b8 0%,#e8d4a0 100%);
  border-radius:var(--r2);
  padding:12px 14px;
  color:#2a1a08;
  box-shadow:0 2px 10px rgba(0,0,0,.5);
}
#view-journal .j-item::before{
  content:'';
  position:absolute;
  left:-26px;top:14px;
  width:10px;height:10px;
  border-radius:50%;
  background:var(--gold);
  border:2px solid var(--bg);
  box-shadow:0 0 8px rgba(184,137,63,.4);
}
#view-journal .j-item-title{
  font-family:var(--ff-title);font-size:17px;
  color:#2a1a08;margin-bottom:3px;
}
#view-journal .j-item-meta{
  font-family:var(--ff-title);font-size:10px;
  letter-spacing:2px;color:#8a5a10;text-transform:uppercase;
}
#view-journal .j-item-xp{
  font-family:var(--ff-title);font-size:13px;
  color:var(--gold);float:right;margin-top:-20px;
}
```

- [ ] **Шаг 4: Проверить синтаксис**

```bash
node --check files/questflow.html 2>&1 | head -5
```

- [ ] **Шаг 5: Деплой + коммит**

```bash
cp files/questflow.html index.html
netlify deploy --prod --dir .
git add files/questflow.html index.html
git commit -m "feat: v3 redesign — Journal timeline screen"
```

---

### Task 8: Экран Архив (archive)

**Files:**
- Modify: `files/questflow.html` — `id="view-archive"` HTML + CSS

- [ ] **Шаг 1: Найти HTML**

```bash
grep -n 'id="view-archive"\|arc-list\|arc-item\|arc-filter' files/questflow.html | head -15
```

- [ ] **Шаг 2: Добавить v3-заголовок**

Внутри `.view#view-archive → .pad` первым элементом:
```html
<div class="v3-screen-title" data-chapter="CAPITULUM III">Свод свершений</div>
```

- [ ] **Шаг 3: Добавить CSS**

```css
/* v3 Archive screen */
#view-archive .arc-filter{
  font-family:var(--ff-title);
  font-size:9px;letter-spacing:2px;text-transform:uppercase;
  background:transparent;
  border:1px solid var(--bdg);
  color:var(--text2);
  border-radius:var(--r2);
  padding:6px 12px;cursor:pointer;
  transition:all .2s;
}
#view-archive .arc-filter.active,
#view-archive .arc-filter:hover{
  border-color:var(--gold);
  color:var(--gold2);
  background:rgba(184,137,63,.1);
}
#view-archive .arc-item{
  background:linear-gradient(135deg,#f0e0b8,#e8d4a0);
  border-radius:var(--r2);
  padding:10px 14px;
  margin-bottom:6px;
  display:flex;align-items:center;gap:10px;
  color:#2a1a08;
  box-shadow:0 2px 8px rgba(0,0,0,.5);
}
#view-archive .arc-item-title{
  font-family:var(--ff-title);font-size:16px;flex:1;
  color:#2a1a08;
}
#view-archive .arc-item-date{
  font-family:var(--ff-title);font-size:10px;
  letter-spacing:1px;color:#8a5a10;
  white-space:nowrap;
}
/* Свод суждений — статистика по рангам */
.v3-rank-summary{
  display:flex;gap:6px;flex-wrap:wrap;
  margin-bottom:16px;
}
.v3-rank-count{
  display:flex;flex-direction:column;align-items:center;
  gap:3px;padding:8px 12px;
  background:rgba(0,0,0,.3);
  border:1px solid var(--bdg);
  border-radius:var(--r2);
  flex:1;min-width:44px;
}
.v3-rank-count .rank-letter{
  font-family:var(--ff-title);font-size:18px;font-weight:700;
}
.v3-rank-count .rank-num{
  font-family:var(--ff-title);font-size:13px;color:var(--text);
}
```

- [ ] **Шаг 4: Проверить синтаксис**

```bash
node --check files/questflow.html 2>&1 | head -5
```

- [ ] **Шаг 5: Деплой + коммит**

```bash
cp files/questflow.html index.html
netlify deploy --prod --dir .
git add files/questflow.html index.html
git commit -m "feat: v3 redesign — Archive screen with rank summary"
```

---

### Task 9: Экран Проекты (projects)

- [ ] **Шаг 1: Найти HTML**

```bash
grep -n 'id="view-projects"\|p-list\|proj-card\|proj-item' files/questflow.html | head -15
```

- [ ] **Шаг 2: Добавить заголовок + CSS**

Заголовок (первый в `.pad`):
```html
<div class="v3-screen-title" data-chapter="CAPITULUM IV">Великие походы</div>
```

CSS:
```css
/* v3 Projects screen */
#view-projects #p-list{
  display:grid;
  grid-template-columns:1fr 1fr;
  gap:12px;
}
@media(max-width:520px){
  #view-projects #p-list{grid-template-columns:1fr;}
}
#view-projects .proj-card{
  background:linear-gradient(135deg,#f0e0b8,#e0cc90);
  border-radius:var(--r2);
  padding:16px;
  color:#2a1a08;
  box-shadow:0 2px 12px rgba(0,0,0,.55);
  position:relative;overflow:hidden;
}
#view-projects .proj-card-title{
  font-family:var(--ff-title);font-size:18px;
  color:#2a1a08;margin-bottom:8px;
}
#view-projects .proj-progress-wrap{
  height:6px;
  background:rgba(0,0,0,.15);
  border-radius:1px;overflow:hidden;
  margin:8px 0 4px;
}
#view-projects .proj-progress-fill{
  height:100%;
  background:linear-gradient(90deg,#8a5a10,#c8963a);
  border-radius:1px;
  transition:width .8s ease;
}
#view-projects .proj-progress-label{
  font-family:var(--ff-title);font-size:10px;
  letter-spacing:1px;color:#8a5a10;
}
```

- [ ] **Шаг 3: Проверить синтаксис**

```bash
node --check files/questflow.html 2>&1 | head -5
```

- [ ] **Шаг 4: Деплой + коммит**

```bash
cp files/questflow.html index.html
netlify deploy --prod --dir .
git add files/questflow.html index.html
git commit -m "feat: v3 redesign — Projects screen grid layout"
```

---

### Task 10: Экран Статистика (stats)

- [ ] **Шаг 1: Найти HTML**

```bash
grep -n 'id="view-stats"\|stats-chart\|ctab\|chart-wrap' files/questflow.html | head -15
```

- [ ] **Шаг 2: Заголовок + CSS**

Заголовок:
```html
<div class="v3-screen-title" data-chapter="CAPITULUM VIII">Хроника силы</div>
```

CSS:
```css
/* v3 Stats screen */
#view-stats .stats-card{
  background:rgba(0,0,0,.4);
  border:1px solid var(--bdg);
  border-radius:var(--r2);
  padding:16px;
  margin-bottom:12px;
}
#view-stats .ctab{
  font-family:var(--ff-title);
  font-size:9px;letter-spacing:2px;text-transform:uppercase;
  background:transparent;border:1px solid var(--bdg);
  color:var(--text2);border-radius:var(--r2);
  padding:6px 12px;cursor:pointer;transition:all .2s;
}
#view-stats .ctab.active{
  border-color:var(--gold);color:var(--gold2);
  background:rgba(184,137,63,.1);
}
```

- [ ] **Шаг 3: Проверить синтаксис + деплой + коммит**

```bash
node --check files/questflow.html 2>&1 | head -5
cp files/questflow.html index.html
netlify deploy --prod --dir .
git add files/questflow.html index.html
git commit -m "feat: v3 redesign — Stats screen"
```

---

### Task 11: Экран Лавка (shop)

- [ ] **Шаг 1: Найти HTML**

```bash
grep -n 'id="view-shop"\|shop-item\|shop-grid\|shop-card' files/questflow.html | head -15
```

- [ ] **Шаг 2: Заголовок + CSS**

Заголовок:
```html
<div class="v3-screen-title" data-chapter="CAPITULUM X">Лавка Бенедикта</div>
```

CSS:
```css
/* v3 Shop screen */
#view-shop .shop-grid{
  display:grid;
  grid-template-columns:repeat(auto-fill,minmax(140px,1fr));
  gap:10px;
}
#view-shop .shop-item{
  background:linear-gradient(135deg,#f0e0b8,#e0cc90);
  border-radius:var(--r2);
  padding:14px 10px;text-align:center;
  color:#2a1a08;
  box-shadow:0 2px 10px rgba(0,0,0,.5);
  cursor:pointer;transition:transform .15s;
}
#view-shop .shop-item:hover{transform:translateY(-2px);}
#view-shop .shop-item-icon{font-size:28px;margin-bottom:6px;}
#view-shop .shop-item-name{
  font-family:var(--ff-title);font-size:13px;
  color:#2a1a08;margin-bottom:6px;
}
#view-shop .shop-item-price{
  font-family:var(--ff-title);font-size:12px;
  color:#8a5a10;letter-spacing:1px;
}
```

- [ ] **Шаг 3: Проверить синтаксис + деплой + коммит**

```bash
node --check files/questflow.html 2>&1 | head -5
cp files/questflow.html index.html
netlify deploy --prod --dir .
git add files/questflow.html index.html
git commit -m "feat: v3 redesign — Shop screen"
```

---

### Task 12: Экран Бестиарий (bestiary)

- [ ] **Шаг 1: Найти HTML**

```bash
grep -n 'id="view-bestiary"\|bestiary\|monster-card\|beast-' files/questflow.html | head -15
```
> Если экрана bestiary нет — проверить нет ли его под другим именем (`dungeon2`, `monsters`, etc.)

- [ ] **Шаг 2: Заголовок + CSS**

Заголовок:
```html
<div class="v3-screen-title" data-chapter="CAPITULUM XI">Бестиарий охотника</div>
```

CSS:
```css
/* v3 Bestiary screen */
#view-bestiary .bestiary-grid{
  display:grid;
  grid-template-columns:repeat(auto-fill,minmax(160px,1fr));
  gap:12px;
}
#view-bestiary .beast-card{
  background:linear-gradient(135deg,#f0e0b8,#e0cc90);
  border-radius:var(--r2);
  overflow:hidden;
  color:#2a1a08;
  box-shadow:0 2px 12px rgba(0,0,0,.55);
  cursor:pointer;transition:transform .15s;
}
#view-bestiary .beast-card:hover{transform:translateY(-2px);}
#view-bestiary .beast-card-img{
  width:100%;height:100px;
  object-fit:cover;
  filter:sepia(.2) contrast(1.05);
}
#view-bestiary .beast-card-body{padding:10px 10px 12px;}
#view-bestiary .beast-name{
  font-family:var(--ff-title);font-size:16px;
  color:#2a1a08;margin-bottom:4px;
}
#view-bestiary .beast-type{
  font-family:var(--ff-title);font-size:9px;
  letter-spacing:2px;color:#8a5a10;text-transform:uppercase;
}
```

- [ ] **Шаг 3: Проверить синтаксис + деплой + коммит**

```bash
node --check files/questflow.html 2>&1 | head -5
cp files/questflow.html index.html
netlify deploy --prod --dir .
git add files/questflow.html index.html
git commit -m "feat: v3 redesign — Bestiary screen"
```

---

### Task 13: Финальный бамп версии

- [ ] **Шаг 1: Обновить версию в 3 местах**

В `files/questflow.html` заменить все `3.2.0` → `3.3.0`:
```bash
grep -n "3\.2\.0\|APP_VERSION\|CACHE_NAME" files/questflow.html | head -10
```
Затем в файле:
- `var APP_VERSION = '3.2.0'` → `'3.3.0'`
- `<span id="app-version-num">3.2.0</span>` → `3.3.0`
- `<span id="vm-version-num">2.5.0</span>` → `3.3.0`

В `service-worker.js`:
```bash
grep -n "CACHE_NAME\|questflow-v" service-worker.js
```
Заменить `questflow-vX.Y.Z` → `questflow-v3.3.0`

- [ ] **Шаг 2: Синтаксис + деплой финальный**

```bash
node --check files/questflow.html 2>&1 | head -5
cp files/questflow.html index.html
netlify deploy --prod --dir .
```

- [ ] **Шаг 3: Коммит + тег**

```bash
git add files/questflow.html index.html service-worker.js
git commit -m "chore: bump version to v3.3.0 — full v3 redesign complete"
git tag v3.3.0
git push origin main --tags
```

---

## Self-Review

**Spec coverage:**
- ✅ Блок 0: 4 фона сгенерированы и оптимизированы (Task 1)
- ✅ Параллакс + blur (Task 2)
- ✅ Общие компоненты v3 (Task 3)
- ✅ 9 экранов переделаны (Tasks 4-12)
- ✅ Версия забампана (Task 13)

**Placeholder scan:** Нет TBD/TODO — все шаги содержат конкретный код.

**Type consistency:** CSS-классы используются единообразно. `v3-parchment`, `v3-row`, `v3-seal-sm`, `v3-divider`, `v3-btn` — определены в Task 3, используются в последующих.

**Важное замечание:** Task 4-12 содержат CSS-переопределения через `#view-X .class`. Некоторые классы (`.routine-item`, `.j-item`, `.arc-item` и др.) могут называться иначе в реальном HTML — шаги включают `grep` для проверки перед правкой.
