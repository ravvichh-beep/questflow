# QuestFlow — Патч 23: Фокус-окно PWA

## Что делает
Отдельная HTML-страница focus.html — маленькое окно 340×220px.
Показывает только текущий главный квест и две кнопки.
Открывается через кнопку в топбаре как отдельное окно браузера.
Читает данные из того же localStorage что и основное приложение.

## Совместимость
- Отдельный файл focus.html — не трогает questflow.html ✓
- Читает SAVE_KEY из localStorage — только чтение, не пишет ✓
- Кнопка в topbar — добавляем рядом с mute и API ✓

---

## ИЗМЕНЕНИЕ 1: кнопка фокус-режима в topbar

**НАЙДИ в HTML** (после изменения из Патча 9):
```html
<button class="apibtn" id="mute-btn" onclick="toggleMute()" title="Звук">🔊</button>
```

**ЗАМЕНИ НА:**
```html
<button class="apibtn" id="mute-btn" onclick="toggleMute()" title="Звук">🔊</button>
<button class="apibtn" onclick="openFocusWindow()" title="Режим фокуса">🎯</button>
```

---

## ИЗМЕНЕНИЕ 2: JS — открытие фокус-окна

**НАЙДИ** строку `// =============================================` с `// LOADING SCREEN`
и **ДОБАВЬ ПЕРЕД НЕЙ:**

```javascript
// =============================================
// FOCUS WINDOW
// =============================================
function openFocusWindow() {
  var w = 360, h = 240;
  var left = window.screen.width  - w - 20;
  var top  = window.screen.height - h - 60;
  window.open(
    'focus.html',
    'questflow_focus',
    'width=' + w + ',height=' + h + ',left=' + left + ',top=' + top
    + ',resizable=no,scrollbars=no,toolbar=no,menubar=no,location=no,status=no'
  );
}
```

---

## ИЗМЕНЕНИЕ 3: создать файл focus.html

**Создай новый файл focus.html** рядом с questflow.html со следующим содержимым:

```html
<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Фокус — QuestFlow</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
:root{
  --bg:#04090f;--bg2:#080f1a;
  --gold:#d4a84a;--gold2:#f0d070;
  --sap:#4088d8;--sky:#66b2f0;
  --text:#ede4cc;--text2:#8aaccc;--text3:#3a5070;
  --bd:rgba(30,70,140,.2);--bdm:rgba(40,90,160,.38);
  --green:#28b060;--red2:#f04040;
  --glass:rgba(8,15,26,.9);
  --r:6px;--r2:10px;
  --ff-title:"Palatino Linotype","Book Antiqua",Palatino,serif;
  --ff-body:Georgia,"Times New Roman",serif;
}
html,body{
  width:360px;height:240px;overflow:hidden;
  background:var(--bg);color:var(--text);
  font-family:var(--ff-body);
  user-select:none;
}
body{
  display:flex;flex-direction:column;
  background:radial-gradient(ellipse at 50% 0%,#0c1e3a,#04090f);
  border:1px solid var(--bdm);
}

/* Шапка */
.f-header{
  display:flex;align-items:center;justify-content:space-between;
  padding:8px 12px;
  border-bottom:1px solid var(--bd);
  background:rgba(8,15,26,.8);
  flex-shrink:0;
}
.f-logo{
  font-family:var(--ff-title);font-size:11px;
  color:var(--gold);letter-spacing:2px;
}
.f-refresh{
  font-size:10px;color:var(--text3);cursor:pointer;
  background:transparent;border:none;padding:2px 6px;
  border-radius:4px;transition:color .15s;
}
.f-refresh:hover{color:var(--gold)}

/* Основной контент */
.f-body{flex:1;padding:12px;display:flex;flex-direction:column;gap:8px;overflow:hidden}

/* Нет квестов */
.f-empty{
  flex:1;display:flex;flex-direction:column;
  align-items:center;justify-content:center;
  font-style:italic;font-size:12px;color:var(--text3);
  gap:6px;text-align:center;
}
.f-empty-icon{font-size:24px;opacity:.4}

/* Квест */
.f-quest{flex:1;display:flex;flex-direction:column;gap:6px}
.f-cat{
  font-family:var(--ff-title);font-size:8px;letter-spacing:2px;
  color:var(--sky);text-transform:uppercase;
}
.f-title{
  font-family:var(--ff-title);font-size:15px;
  color:var(--gold);line-height:1.25;letter-spacing:.3px;
  flex:1;
}
.f-meta{
  display:flex;gap:8px;
  font-family:var(--ff-title);font-size:8px;color:var(--text3);
  letter-spacing:.5px;flex-wrap:wrap;
}
.f-meta span{display:flex;align-items:center;gap:3px}
.f-meta .urgent{color:var(--red2)}
.f-meta .ok{color:var(--green)}

/* Кнопки */
.f-actions{
  display:flex;gap:6px;flex-shrink:0;
}
.f-btn{
  flex:1;padding:8px;border-radius:var(--r);
  font-family:var(--ff-title);font-size:9px;
  letter-spacing:1.5px;cursor:pointer;
  border:1px solid;text-transform:uppercase;
  transition:all .15s;text-align:center;
}
.f-btn-done{
  background:linear-gradient(135deg,#c89030,#e8b040);
  color:#07101d;border-color:rgba(232,176,64,.6);
  font-weight:600;
}
.f-btn-done:hover{background:linear-gradient(135deg,#daa040,#f8c040)}
.f-btn-skip{
  background:rgba(255,255,255,.03);
  color:var(--text2);border-color:var(--bdm);
}
.f-btn-skip:hover{color:var(--text);background:rgba(255,255,255,.06)}

/* Подпись внизу */
.f-footer{
  padding:4px 12px 6px;
  font-size:9px;color:var(--text3);font-style:italic;
  letter-spacing:.5px;text-align:center;flex-shrink:0;
}

/* Анимация */
@keyframes fadein{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
.f-quest,.f-empty{animation:fadein .3s ease both}

/* Overdue pulse */
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}
.overdue{animation:pulse 1.5s ease-in-out infinite}
</style>
</head>
<body>

<div class="f-header">
  <div class="f-logo">⚔ Хроники Судьбы</div>
  <button class="f-refresh" onclick="load()" title="Обновить">↻ обновить</button>
</div>

<div class="f-body" id="body"></div>

<div class="f-footer" id="footer"></div>

<script>
var SAVE_KEY = 'qf5';
var CAT_ICONS  = {study:'📚',work:'⚔',health:'🌿',hobby:'🎨',life:'🌍'};
var CAT_LABELS = {study:'Учёба',work:'Работа',health:'Здоровье',hobby:'Хобби',life:'Жизнь'};

function getData() {
  try { return JSON.parse(localStorage.getItem(SAVE_KEY)) || null; }
  catch(e) { return null; }
}

function priority(q) {
  var s = 0;
  if (q.deadline) {
    var days = Math.ceil((new Date(q.deadline) - new Date()) / 86400000);
    if (days < 0)  s += 10000;
    else if (days === 0) s += 5000;
    else if (days <= 1)  s += 3000;
    else if (days <= 3)  s += 2000;
    else if (days <= 7)  s += 1000;
    else s += Math.max(0, 500 - days * 10);
  }
  s += (q.importance || 3) * 200;
  s += (q.difficulty || 3) * 50;
  return s;
}

function isOverdue(q) {
  if (!q.deadline) return false;
  var d = new Date(q.deadline);
  d.setHours(23,59,59,0);
  return d < new Date();
}

function daysLabel(deadline) {
  if (!deadline) return '';
  var days = Math.ceil((new Date(deadline) - new Date()) / 86400000);
  if (days < 0)  return 'просрочен';
  if (days === 0) return 'сегодня';
  if (days === 1) return 'завтра';
  return 'через ' + days + ' дн.';
}

function diffLabel(d) {
  return ['','★','★★','★★★','★★★★','★★★★★'][d] || '';
}

function load() {
  var body   = document.getElementById('body');
  var footer = document.getElementById('footer');
  var data   = getData();

  if (!data || !data.onboarded) {
    body.innerHTML = '<div class="f-empty"><div class="f-empty-icon">📜</div>Открой QuestFlow<br>и начни путь</div>';
    footer.textContent = '';
    return;
  }

  var quests = (data.quests || [])
    .filter(function(q){ return !q.done; })
    .sort(function(a,b){ return priority(b) - priority(a); });

  if (quests.length === 0) {
    body.innerHTML = '<div class="f-empty"><div class="f-empty-icon">✦</div>Все квесты выполнены!<br><span style="color:var(--gold)">Достойно, герой</span></div>';
    footer.textContent = '';
    return;
  }

  var q      = quests[0];
  var total  = quests.length;
  var overdue = isOverdue(q);
  var dlabel  = daysLabel(q.deadline);

  body.innerHTML = '<div class="f-quest">'
    + '<div class="f-cat">' + (CAT_ICONS[q.category]||'') + ' ' + (CAT_LABELS[q.category]||q.category) + '</div>'
    + '<div class="f-title' + (overdue ? ' overdue' : '') + '">' + (q.fantasyTitle || q.title) + '</div>'
    + '<div class="f-meta">'
    + (q.deadline ? '<span class="' + (overdue ? 'urgent' : dlabel === 'сегодня' ? 'urgent' : 'ok') + '">⏰ ' + dlabel + '</span>' : '')
    + '<span>' + diffLabel(q.difficulty) + '</span>'
    + (q.importance ? '<span>★ ' + q.importance + '</span>' : '')
    + '</div>'
    + '<div class="f-actions">'
    + '<div class="f-btn f-btn-done" onclick="completeQuest(\'' + q.id + '\')">✓ Выполнено</div>'
    + '<div class="f-btn f-btn-skip" onclick="load()">→ Следующий</div>'
    + '</div>'
    + '</div>';

  footer.textContent = 'Активных квестов: ' + total + (data.hero ? ' · ' + data.hero.name : '');
}

function completeQuest(id) {
  var data = getData();
  if (!data) return;
  var q = (data.quests || []).find(function(q){ return q.id === id; });
  if (!q) return;
  q.done = true;
  q.completedAt = new Date().toISOString();

  var xp   = (q.difficulty || 3) * (q.importance || 3) * 80;
  var gold = (q.difficulty || 3) * (q.importance || 3) * 60;
  data.hero.xp   = (data.hero.xp   || 0) + xp;
  data.hero.gold = (data.hero.gold || 0) + gold;
  data.stats.totalDone = (data.stats.totalDone || 0) + 1;

  var today = new Date().toISOString().slice(0,10);
  data.stats.daily[today] = (data.stats.daily[today] || 0) + 1;
  data.journal = data.journal || [];
  data.journal.unshift({ title: q.fantasyTitle || q.title, xp: xp, gold: gold, date: today });

  try { localStorage.setItem('qf5', JSON.stringify(data)); } catch(e) {}

  // Сообщение об успехе
  var body = document.getElementById('body');
  body.innerHTML = '<div class="f-empty">'
    + '<div class="f-empty-icon">✦</div>'
    + '<div style="color:var(--gold);font-family:var(--ff-title);font-size:12px;letter-spacing:1px">КВЕСТ ВЫПОЛНЕН</div>'
    + '<div style="font-size:11px;color:var(--text2);margin-top:4px">'
    +   '<span style="color:var(--sap)">+' + xp + ' ОП</span> · '
    +   '<span style="color:var(--gold)">🪙 +' + gold + '</span>'
    + '</div>'
    + '</div>';
  document.getElementById('footer').textContent = '';

  setTimeout(load, 1800);
}

// Авто-обновление каждые 30 секунд
load();
setInterval(load, 30000);
</script>
</body>
</html>
```

---

## Что получится

| Элемент | Описание |
|---|---|
| Размер окна | 360×240px, фиксированный, без скроллбара |
| Позиция | Правый нижний угол экрана |
| Контент | Текущий главный квест: название, категория, дедлайн, сложность |
| Кнопки | ✓ Выполнено (пишет в localStorage) · → Следующий (показывает второй) |
| Обновление | Автоматически каждые 30 секунд |
| Без сети | Работает офлайн — читает localStorage |
| Выполнение | Засчитывает XP и золото напрямую, без открытия основного приложения |

---
---

# QuestFlow — Патч 24: Офлайн-заглушки для картинок

## Архитектура
Вместо бесконечного shimmer при отсутствии сети —
красивые тематические заглушки для каждой категории.
Фиксированные Pollinations URL с постоянным seed кэшируются браузером.
При первом запуске с сетью — загружаются и кэшируются навсегда.
При последующих открытиях — мгновенно из кэша браузера.
При полном офлайне (никогда не загружались) — CSS-заглушка с иконкой.

## Совместимость
- questArtHTML() из оригинала — добавляем onerror с fallback ✓
- CSS .qart-fallback — новый класс ✓
- Патч 6 (AI врагов) — добавляем аналогичный fallback ✓

---

## ИЗМЕНЕНИЕ 1: константы заглушек

**НАЙДИ** строку `var CAT_LABELS = { ... };`
и **ДОБАВЬ ПОСЛЕ:**

```javascript
// Офлайн-заглушки: фиксированные URL с постоянным seed
// Кэшируются браузером после первой загрузки
var CAT_FALLBACK_URLS = {
  study:  'https://image.pollinations.ai/prompt/' + encodeURIComponent('dark fantasy ancient library scrolls candlelight Dragon Age concept art atmospheric no characters') + '?width=800&height=200&seed=1001&nologo=true&model=flux',
  work:   'https://image.pollinations.ai/prompt/' + encodeURIComponent('dark fantasy medieval forge workshop tools fire Dragon Age concept art atmospheric no characters') + '?width=800&height=200&seed=1002&nologo=true&model=flux',
  health: 'https://image.pollinations.ai/prompt/' + encodeURIComponent('dark fantasy forest path morning mist ancient trees Dragon Age concept art atmospheric no characters') + '?width=800&height=200&seed=1003&nologo=true&model=flux',
  hobby:  'https://image.pollinations.ai/prompt/' + encodeURIComponent('dark fantasy artists studio magical paintings glowing Dragon Age concept art atmospheric no characters') + '?width=800&height=200&seed=1004&nologo=true&model=flux',
  life:   'https://image.pollinations.ai/prompt/' + encodeURIComponent('dark fantasy ancient city streets night torchlight Dragon Age concept art atmospheric no characters') + '?width=800&height=200&seed=1005&nologo=true&model=flux',
};

// Мини-версии для побочных квестов
var CAT_FALLBACK_SIDE_URLS = {
  study:  'https://image.pollinations.ai/prompt/' + encodeURIComponent('dark fantasy ancient library scrolls candlelight Dragon Age concept art atmospheric no characters') + '?width=400&height=70&seed=2001&nologo=true&model=flux',
  work:   'https://image.pollinations.ai/prompt/' + encodeURIComponent('dark fantasy medieval forge workshop fire Dragon Age concept art atmospheric no characters') + '?width=400&height=70&seed=2002&nologo=true&model=flux',
  health: 'https://image.pollinations.ai/prompt/' + encodeURIComponent('dark fantasy forest path morning mist Dragon Age concept art atmospheric no characters') + '?width=400&height=70&seed=2003&nologo=true&model=flux',
  hobby:  'https://image.pollinations.ai/prompt/' + encodeURIComponent('dark fantasy artists studio magical paintings Dragon Age concept art atmospheric no characters') + '?width=400&height=70&seed=2004&nologo=true&model=flux',
  life:   'https://image.pollinations.ai/prompt/' + encodeURIComponent('dark fantasy ancient city streets night Dragon Age concept art atmospheric no characters') + '?width=400&height=70&seed=2005&nologo=true&model=flux',
};
```

---

## ИЗМЕНЕНИЕ 2: обновить questArtHTML — добавить fallback цепочку

**НАЙДИ функцию** `questArtHTML`:
```javascript
function questArtHTML(q, w, h, isSide) {
  var url  = isSide ? sideArtUrl(q) : questArtUrl(q);
  var cls  = isSide ? 'sq-art-img' : 'qart-img';
  var ovl  = isSide ? 'sq-art-overlay' : 'qart-overlay';
  var uid  = 'img-' + (q.id || 'x') + (isSide ? '-s' : '');
  return '<div class="qart-loading" id="load-' + uid + '"></div>'
    + '<div class="qart-loading-text">' + (isSide ? '' : '✦ Генерация иллюстрации…') + '</div>'
    + '<img class="' + cls + '" id="' + uid + '" src="' + url + '" alt="" '
    + 'onload="this.style.opacity=1;var l=document.getElementById(\'load-' + uid + '\');if(l)l.style.display=\'none\';" '
    + 'onerror="this.style.display=\'none\';" '
    + 'style="opacity:0;transition:opacity .6s">'
    + '<div class="' + ovl + '"></div>';
}
```

**ЗАМЕНИ НА:**
```javascript
function questArtHTML(q, w, h, isSide) {
  var url      = isSide ? sideArtUrl(q) : questArtUrl(q);
  var fallback = isSide
    ? (CAT_FALLBACK_SIDE_URLS[q.category] || CAT_FALLBACK_SIDE_URLS.life)
    : (CAT_FALLBACK_URLS[q.category]      || CAT_FALLBACK_URLS.life);
  var cls  = isSide ? 'sq-art-img' : 'qart-img';
  var ovl  = isSide ? 'sq-art-overlay' : 'qart-overlay';
  var uid  = 'img-' + (q.id || 'x') + (isSide ? '-s' : '');
  var fbId = 'fb-' + uid;

  // onload: показываем картинку, скрываем shimmer
  // onerror основной: пробуем fallback URL
  // onerror fallback: показываем CSS-заглушку
  return '<div class="qart-loading" id="load-' + uid + '"></div>'
    + '<div class="qart-loading-text">' + (isSide ? '' : '✦ Генерация иллюстрации…') + '</div>'
    + '<img class="' + cls + '" id="' + uid + '" src="' + url + '" alt="" '
    + 'onload="this.style.opacity=1;var l=document.getElementById(\'load-' + uid + '\');if(l)l.style.display=\'none\';" '
    + 'onerror="'
    +   'this.onerror=function(){this.style.display=\'none\';var f=document.getElementById(\'' + fbId + '\');if(f)f.style.display=\'flex\';var l=document.getElementById(\'load-' + uid + '\');if(l)l.style.display=\'none\';}; '
    +   'this.src=\'' + fallback + '\';" '
    + 'style="opacity:0;transition:opacity .6s">'
    + '<div class="' + ovl + '"></div>'
    + '<div class="qart-fallback" id="' + fbId + '" style="display:none">'
    +   '<div class="qart-fallback-icon">' + (CAT_ICONS[q.category] || '⚔') + '</div>'
    +   '<div class="qart-fallback-lbl">' + (CAT_LABELS[q.category] || '') + '</div>'
    + '</div>';
}
```

---

## ИЗМЕНЕНИЕ 3: CSS заглушки

**ДОБАВИТЬ в конец CSS** (перед `</style>`):

```css
/* ===== OFFLINE FALLBACK ===== */
.qart-fallback{
  position:absolute;inset:0;
  background:linear-gradient(135deg,#060e1e 0%,#0c1e3a 50%,#060e1e 100%);
  display:flex;flex-direction:column;
  align-items:center;justify-content:center;
  gap:8px;pointer-events:none;
}
.qart-fallback-icon{
  font-size:32px;
  filter:drop-shadow(0 0 12px rgba(64,136,216,.3));
  opacity:.5;
}
.qart-fallback-lbl{
  font-family:var(--ff-title);font-size:9px;
  letter-spacing:3px;color:var(--text3);
  text-transform:uppercase;
}
```

---

## ИЗМЕНЕНИЕ 4: аналогичный fallback для портрета (Патч 7)

**НАЙДИ в `renderChar()`** строку:
```javascript
      img.src = url;
```

**ДОБАВЬ ПОСЛЕ:**
```javascript
      img.src = url;
      // Fallback если портрет не загрузился
      img.onerror = function() {
        img.style.display = 'none';
        var shimmer = document.getElementById('portrait-shimmer');
        if (shimmer) shimmer.style.display = 'none';
        var fb = document.getElementById('portrait-svg-fallback');
        if (fb) {
          fb.style.display = 'block';
          fb.innerHTML = portraitInner();
        }
      };
```

---

## Что получится

| Ситуация | Поведение |
|---|---|
| Первый запуск, есть сеть | Уникальная AI-картинка для квеста |
| Повторный запуск | Картинка мгновенно из кэша браузера |
| Уникальная картинка не грузится | Автоматически пробует fallback категории |
| Fallback тоже не грузится | CSS-заглушка с иконкой категории |
| Портрет не грузится | SVG-силуэт героя |

---
---

# QuestFlow — Патч 25: Архив выполненных квестов

## Совместимость
- Новая вкладка view-archive — не конфликтует ✓
- sw() из Патча 5/11/12 — добавляем case 'archive' ✓
- S.quests с done:true — уже есть, просто рендерим ✓
- doComplete() — не трогаем, квесты уже остаются с done:true ✓

---

## ИЗМЕНЕНИЕ 1: иконка архива в sidenav

**НАЙДИ:**
```html
  <div class="ni" id="ni-journal" onclick="sw('journal',this)">📖<span class="ni-tip">Журнал</span></div>
```

**ЗАМЕНИ НА:**
```html
  <div class="ni" id="ni-journal" onclick="sw('journal',this)">📖<span class="ni-tip">Журнал</span></div>
  <div class="ni" id="ni-archive" onclick="sw('archive',this)">🏛<span class="ni-tip">Архив</span></div>
```

---

## ИЗМЕНЕНИЕ 2: HTML вьюхи архива

**НАЙДИ:**
```html
<!-- JOURNAL -->
<div class="view" id="view-journal">
```

**ДОБАВЬ ПЕРЕД НЕЙ:**
```html
<!-- ARCHIVE -->
<div class="view" id="view-archive">
  <div class="pad">
    <div class="shdr">Архив квестов</div>

    <!-- Фильтры -->
    <div class="arc-filters" id="arc-filters">
      <button class="arc-filter active" data-cat="" onclick="arcFilter('',this)">Все</button>
      <button class="arc-filter" data-cat="work"   onclick="arcFilter('work',this)">⚔ Работа</button>
      <button class="arc-filter" data-cat="study"  onclick="arcFilter('study',this)">📚 Учёба</button>
      <button class="arc-filter" data-cat="health" onclick="arcFilter('health',this)">🌿 Здоровье</button>
      <button class="arc-filter" data-cat="hobby"  onclick="arcFilter('hobby',this)">🎨 Хобби</button>
      <button class="arc-filter" data-cat="life"   onclick="arcFilter('life',this)">🌍 Жизнь</button>
    </div>

    <!-- Поиск -->
    <div style="margin-bottom:14px">
      <input class="fi" id="arc-search" type="text"
        placeholder="Поиск по названию..."
        oninput="renderArchive()"
        style="font-size:13px">
    </div>

    <!-- Счётчик -->
    <div class="arc-count" id="arc-count"></div>

    <!-- Список -->
    <div id="arc-list"></div>
  </div>
</div>
```

---

## ИЗМЕНЕНИЕ 3: CSS архива

**ДОБАВИТЬ в конец CSS** (перед `</style>`):

```css
/* ===== ARCHIVE ===== */
.arc-filters{
  display:flex;gap:6px;flex-wrap:wrap;margin-bottom:14px;
}
.arc-filter{
  font-family:var(--ff-title);font-size:8px;
  letter-spacing:1.5px;padding:5px 11px;
  border-radius:20px;cursor:pointer;
  border:1px solid var(--bd);color:var(--text3);
  background:transparent;transition:all .18s;
  text-transform:uppercase;
}
.arc-filter:hover{color:var(--text2);border-color:var(--bdm)}
.arc-filter.active{
  color:var(--gold);
  border-color:rgba(212,168,74,.35);
  background:rgba(212,168,74,.08);
}
.arc-count{
  font-family:var(--ff-title);font-size:9px;
  letter-spacing:1.5px;color:var(--text3);
  margin-bottom:12px;text-transform:uppercase;
}

/* Карточка архива */
.arc-item{
  background:var(--glass);
  border:1px solid var(--bd);
  border-radius:var(--r);
  padding:12px 16px;
  margin-bottom:8px;
  display:flex;align-items:flex-start;gap:12px;
  transition:all .2s cubic-bezier(.4,0,.2,1);
  position:relative;overflow:hidden;
  animation:fadeInUp .35s cubic-bezier(.34,1.2,.64,1) both;
}
.arc-item::before{
  content:'';position:absolute;left:0;top:0;bottom:0;width:3px;
  border-radius:0 2px 2px 0;
  background:var(--green);
}
.arc-item:hover{
  border-color:rgba(40,176,96,.2);
  background:rgba(40,176,96,.03);
  transform:translateX(3px);
}
.arc-check{
  width:24px;height:24px;border-radius:50%;
  background:rgba(40,176,96,.12);
  border:1px solid rgba(40,176,96,.35);
  display:flex;align-items:center;justify-content:center;
  font-size:11px;color:var(--green);
  flex-shrink:0;margin-top:1px;
  box-shadow:0 0 8px rgba(40,176,96,.15);
}
.arc-body{flex:1;min-width:0}
.arc-title{
  font-family:var(--ff-title);font-size:13px;
  color:var(--text);margin-bottom:3px;letter-spacing:.3px;
  white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
}
.arc-fantasy{
  font-family:var(--ff-body);font-style:italic;
  font-size:11px;color:var(--gold);margin-bottom:5px;
  opacity:.7;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;
}
.arc-meta{
  display:flex;gap:8px;flex-wrap:wrap;
  font-family:var(--ff-title);font-size:8px;color:var(--text3);
  letter-spacing:.5px;
}
.arc-meta span{display:flex;align-items:center;gap:3px}
.arc-rewards{
  display:flex;flex-direction:column;align-items:flex-end;gap:3px;
  flex-shrink:0;font-family:var(--ff-title);font-size:10px;
}
.arc-xp{color:var(--sap)}
.arc-gold{color:var(--gold)}
.arc-restore-btn{
  font-size:9px;color:var(--text3);
  background:transparent;border:1px solid var(--bd);
  border-radius:var(--r);padding:3px 7px;cursor:pointer;
  transition:all .15s;margin-top:4px;letter-spacing:.5px;
}
.arc-restore-btn:hover{
  color:var(--gold);border-color:var(--bdg);
  background:var(--gold-glow);
}
```

---

## ИЗМЕНЕНИЕ 4: JS — логика архива

**НАЙДИ** строку `// =============================================` с `// JOURNAL`
и **ДОБАВЬ ПЕРЕД НЕЙ:**

```javascript
// =============================================
// ARCHIVE — АРХИВ КВЕСТОВ
// =============================================

var _arcFilter = '';

function arcFilter(cat, btn) {
  _arcFilter = cat;
  document.querySelectorAll('.arc-filter').forEach(function(b){
    b.classList.remove('active');
  });
  if (btn) btn.classList.add('active');
  renderArchive();
}

function renderArchive() {
  var el      = document.getElementById('arc-list');
  var countEl = document.getElementById('arc-count');
  if (!el) return;

  var search = (document.getElementById('arc-search') || {}).value || '';
  search = search.trim().toLowerCase();

  var done = (S.quests || []).filter(function(q) {
    if (!q.done) return false;
    if (_arcFilter && q.category !== _arcFilter) return false;
    if (search) {
      var haystack = (q.title + ' ' + (q.fantasyTitle || '')).toLowerCase();
      if (haystack.indexOf(search) === -1) return false;
    }
    return true;
  });

  // Сортировка — последние выполненные первыми
  done.sort(function(a, b) {
    return (b.completedAt || '').localeCompare(a.completedAt || '');
  });

  if (countEl) {
    countEl.textContent = done.length + ' квест' + (done.length === 1 ? '' : done.length < 5 ? 'а' : 'ов') + ' выполнено';
  }

  if (done.length === 0) {
    el.innerHTML = '<div class="empty-state"><span class="empty-icon">🏛</span>'
      + '<div class="empty-title">' + (search || _arcFilter ? 'Ничего не найдено' : 'Архив пуст') + '</div>'
      + '<div class="empty-desc">' + (search || _arcFilter ? 'Попробуй другой фильтр' : 'Выполненные квесты появятся здесь') + '</div></div>';
    return;
  }

  el.innerHTML = done.map(function(q, idx) {
    var xp   = (q.difficulty || 3) * (q.importance || 3) * 80;
    var gold = (q.difficulty || 3) * (q.importance || 3) * 60;
    var date = q.completedAt ? q.completedAt.slice(0, 10) : '—';
    var diff = ['','★','★★','★★★','★★★★','★★★★★'][q.difficulty || 3] || '';

    return '<div class="arc-item" style="animation-delay:' + Math.min(idx * 0.04, 0.4) + 's">'
      + '<div class="arc-check">✓</div>'
      + '<div class="arc-body">'
      +   '<div class="arc-title">' + esc(q.title) + '</div>'
      +   (q.fantasyTitle ? '<div class="arc-fantasy">' + esc(q.fantasyTitle) + '</div>' : '')
      +   '<div class="arc-meta">'
      +     '<span>' + (CAT_ICONS[q.category] || '') + ' ' + (CAT_LABELS[q.category] || '') + '</span>'
      +     '<span>📅 ' + date + '</span>'
      +     (diff ? '<span>' + diff + '</span>' : '')
      +     (q.isRoutine ? '<span style="color:#ff8040">🔄 Обряд</span>' : '')
      +   '</div>'
      + '</div>'
      + '<div class="arc-rewards">'
      +   '<span class="arc-xp">+' + xp + ' ОП</span>'
      +   '<span class="arc-gold">🪙 ' + gold + '</span>'
      +   '<button class="arc-restore-btn" onclick="restoreQuest(\'' + q.id + '\')">↩ Вернуть</button>'
      + '</div>'
      + '</div>';
  }).join('');
}

// Восстановить квест из архива
function restoreQuest(id) {
  var q = (S.quests || []).find(function(q){ return q.id === id; });
  if (!q) return;
  q.done        = false;
  q.completedAt = null;
  // Откатываем статистику
  S.stats.totalDone = Math.max(0, (S.stats.totalDone || 0) - 1);
  var today = new Date().toISOString().slice(0, 10);
  if (S.stats.daily[today]) S.stats.daily[today] = Math.max(0, S.stats.daily[today] - 1);
  save();
  renderArchive();
  renderQuests();
  showToast('↩ Квест возвращён в активные');
}
```

---

## ИЗМЕНЕНИЕ 5: добавить case archive в sw()

**НАЙДИ в sw():**
```javascript
    if (name === 'routines')  renderRoutines();
```

**ЗАМЕНИ НА:**
```javascript
    if (name === 'routines')  renderRoutines();
    if (name === 'archive')   renderArchive();
```

---

## Что получится (Патч 25)

| Элемент | Описание |
|---|---|
| Иконка 🏛 в навигации | Новая вкладка "Архив" |
| Фильтры по категории | Все / Работа / Учёба / Здоровье / Хобби / Жизнь |
| Поиск | По названию и фэнтезийному названию |
| Карточка квеста | Оригинальное название, фэнтезийное название, дата, сложность, XP, золото |
| Обряды | Помечены 🔄 |
| Сортировка | Последние выполненные — первые |
| Восстановление | Кнопка "↩ Вернуть" — квест снова активный |
| Пустое состояние | Отдельные сообщения для "нет данных" и "нет результатов поиска" |
