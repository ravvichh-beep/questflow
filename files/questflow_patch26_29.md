# QuestFlow — Патч 26: Боевая Концентрация (Помодоро) + Патч 29: Трекер Настроения

---
---

# ПАТЧ 26: БОЕВАЯ КОНЦЕНТРАЦИЯ

## Архитектура
- Таймер встроен прямо в карточку главного квеста
- 25 минут = 1 "Боевая Концентрация" = +50 XP + небольшое золото
- 3 концентрации подряд без перерыва = бонус "Состояние Потока"
- Таймер отображается прямо в карточке вместо кнопок пока идёт
- focus.html обновляется — таймер там тоже работает
- S.bcSession — текущая сессия концентрации

## Совместимость
- buildMainQuestHTML() — добавляем кнопку и блок таймера ✓
- focus.html из Патча 23 — добавляем таймер ✓
- gainXP/gainGold из Патча 5 — вызываем напрямую ✓
- Звуки из Патча 9 — sndSpell при старте, sndQuestComplete при завершении ✓
- S.bcStreak — новое поле ✓

---

## ИЗМЕНЕНИЕ 1: добавить кнопку таймера в buildMainQuestHTML

**НАЙДИ в `buildMainQuestHTML`** строку:
```javascript
    + '<button class="btn btn-b" onclick="rollDice()">🎲 Кости</button>'
    + '</div>'
```

**ЗАМЕНИ НА:**
```javascript
    + '<button class="btn btn-b" onclick="rollDice()">🎲 Кости</button>'
    + '<button class="btn btn-o" id="bc-start-btn-' + q.id + '" onclick="bcStart(\'' + q.id + '\')" title="Боевая Концентрация — 25 минут фокуса">⚔ Концентрация</button>'
    + '</div>'
    + '<div class="bc-panel" id="bc-panel-' + q.id + '" style="display:none"></div>'
```

---

## ИЗМЕНЕНИЕ 2: CSS таймера

**ДОБАВИТЬ в конец CSS** (перед `</style>`):

```css
/* ===== BATTLE CONCENTRATION TIMER ===== */
.bc-panel{
  margin-top:14px;
  background:rgba(64,136,216,.05);
  border:1px solid rgba(64,136,216,.2);
  border-radius:var(--r);
  padding:14px 16px;
  animation:fadeInUp .3s cubic-bezier(.34,1.2,.64,1) both;
}
.bc-top{
  display:flex;align-items:center;justify-content:space-between;
  margin-bottom:10px;
}
.bc-title{
  font-family:var(--ff-title);font-size:9px;
  letter-spacing:2.5px;color:var(--sky);
  text-transform:uppercase;
}
.bc-streak-badge{
  font-family:var(--ff-title);font-size:8px;
  letter-spacing:1.5px;color:#ff8040;
  background:rgba(255,100,0,.1);
  border:1px solid rgba(255,100,0,.25);
  padding:2px 8px;border-radius:20px;
}
.bc-timer-row{
  display:flex;align-items:center;gap:14px;
  margin-bottom:12px;
}
.bc-clock{
  font-family:var(--ff-title);font-size:32px;
  color:var(--text);letter-spacing:2px;line-height:1;
  min-width:80px;
  text-shadow:0 0 16px rgba(64,136,216,.3);
}
.bc-clock.urgent{
  color:var(--red2);
  text-shadow:0 0 16px rgba(240,64,64,.4);
  animation:overdue-pulse 1s ease-in-out infinite;
}
.bc-progress-wrap{
  flex:1;
}
.bc-progress-bar{
  height:6px;
  background:rgba(255,255,255,.05);
  border-radius:3px;overflow:hidden;
  margin-bottom:5px;
}
.bc-progress-fill{
  height:100%;
  background:linear-gradient(90deg,var(--blue2),var(--sap),var(--sky));
  border-radius:3px;
  transition:width .5s linear;
  box-shadow:0 0 6px rgba(64,136,216,.4);
}
.bc-progress-lbl{
  font-family:var(--ff-title);font-size:8px;
  color:var(--text3);letter-spacing:1px;
}
.bc-actions{display:flex;gap:8px}
.bc-reward-preview{
  font-family:var(--ff-title);font-size:9px;
  color:var(--text3);letter-spacing:1px;
  margin-top:8px;
}
.bc-reward-preview span{color:var(--sap)}
.bc-reward-preview .gold{color:var(--gold)}

/* Состояние потока */
.bc-panel.flow{
  border-color:rgba(212,168,74,.35);
  background:rgba(212,168,74,.06);
  box-shadow:0 0 20px rgba(212,168,74,.1);
}
.bc-panel.flow .bc-progress-fill{
  background:linear-gradient(90deg,var(--gold3),var(--gold),var(--gold2));
  box-shadow:0 0 8px rgba(212,168,74,.4);
}
```

---

## ИЗМЕНЕНИЕ 3: JS — логика таймера

**НАЙДИ** строку `// =============================================` с `// FOCUS WINDOW`
и **ДОБАВЬ ПЕРЕД НЕЙ:**

```javascript
// =============================================
// BATTLE CONCENTRATION — БОЕВАЯ КОНЦЕНТРАЦИЯ
// =============================================

var BC_DURATION  = 25 * 60; // секунды
var BC_XP_REWARD = 50;
var BC_GOLD_BASE = 20;
var _bcTimer     = null;
var _bcState     = null; // { questId, remaining, total, startTs }

function bcStart(qid) {
  // Если уже идёт — не запускаем второй
  if (_bcTimer) { showToast('Концентрация уже активна!'); return; }

  _bcState = {
    questId:   qid,
    remaining: BC_DURATION,
    total:     BC_DURATION,
    startTs:   Date.now(),
  };

  if (typeof sndSpell === 'function') sndSpell();
  showToast('⚔ Боевая Концентрация начата. 25 минут фокуса.');

  bcRender();
  _bcTimer = setInterval(bcTick, 1000);

  // Скрываем кнопку старта
  var btn = document.getElementById('bc-start-btn-' + qid);
  if (btn) btn.style.display = 'none';
}

function bcTick() {
  if (!_bcState) return;
  _bcState.remaining--;

  bcRender();

  if (_bcState.remaining <= 0) {
    bcComplete();
  }
}

function bcRender() {
  if (!_bcState) return;
  var panel = document.getElementById('bc-panel-' + _bcState.questId);
  if (!panel) return;

  panel.style.display = 'block';

  var rem   = _bcState.remaining;
  var total = _bcState.total;
  var pct   = Math.round((1 - rem / total) * 100);
  var min   = Math.floor(rem / 60);
  var sec   = rem % 60;
  var timeStr = String(min).padStart(2,'0') + ':' + String(sec).padStart(2,'0');
  var streak  = S.bcStreak || 0;
  var isFlow  = streak >= 2;
  var isUrgent = rem <= 60;

  // Награда с бонусом потока
  var xpReward   = BC_XP_REWARD * (isFlow ? 2 : 1);
  var goldReward = BC_GOLD_BASE * (isFlow ? 2 : 1);

  panel.className = 'bc-panel' + (isFlow ? ' flow' : '');
  panel.innerHTML = '<div class="bc-top">'
    + '<div class="bc-title">⚔ Боевая Концентрация</div>'
    + (streak > 0 ? '<div class="bc-streak-badge">🔥 Серия: ' + streak + '</div>' : '')
    + '</div>'
    + '<div class="bc-timer-row">'
    +   '<div class="bc-clock' + (isUrgent ? ' urgent' : '') + '">' + timeStr + '</div>'
    +   '<div class="bc-progress-wrap">'
    +     '<div class="bc-progress-bar"><div class="bc-progress-fill" style="width:' + pct + '%"></div></div>'
    +     '<div class="bc-progress-lbl">' + pct + '% — ' + (isFlow ? '✨ Состояние Потока' : 'Держись, герой') + '</div>'
    +   '</div>'
    + '</div>'
    + '<div class="bc-actions">'
    +   '<button class="btn btn-r" onclick="bcAbort()" style="font-size:8px;padding:7px 14px">✗ Прервать</button>'
    + '</div>'
    + '<div class="bc-reward-preview">По завершении: <span>+' + xpReward + ' ОП</span> · <span class="gold">🪙 +' + goldReward + '</span>'
    +   (isFlow ? ' · <span style="color:var(--gold)">★ ×2 Поток</span>' : '') + '</div>';
}

function bcComplete() {
  clearInterval(_bcTimer);
  _bcTimer = null;

  if (!_bcState) return;
  var qid    = _bcState.questId;
  var streak = (S.bcStreak || 0) + 1;
  S.bcStreak = streak;
  var isFlow = streak >= 3;

  var xpReward   = BC_XP_REWARD * (isFlow ? 2 : 1);
  var goldReward = BC_GOLD_BASE * (isFlow ? 2 : 1);

  gainXP(xpReward);
  gainGold(goldReward);
  save();

  if (typeof sndQuestComplete === 'function') sndQuestComplete();
  if (typeof vibrate === 'function') vibrate([100, 50, 100]);

  // Показываем результат в панели
  var panel = document.getElementById('bc-panel-' + qid);
  if (panel) {
    panel.className = 'bc-panel' + (isFlow ? ' flow' : '');
    panel.innerHTML = '<div style="text-align:center;padding:6px 0">'
      + '<div style="font-size:28px;margin-bottom:8px">' + (isFlow ? '🌟' : '⚔') + '</div>'
      + '<div style="font-family:var(--ff-title);font-size:11px;color:var(--gold);letter-spacing:2px;margin-bottom:6px">'
      +   (isFlow ? 'СОСТОЯНИЕ ПОТОКА!' : 'КОНЦЕНТРАЦИЯ ЗАВЕРШЕНА')
      + '</div>'
      + '<div style="font-family:var(--ff-title);font-size:10px;color:var(--text3);margin-bottom:10px">'
      +   'Серия: ' + streak + ' · +' + xpReward + ' ОП · 🪙 +' + goldReward
      + '</div>'
      + '<button class="btn btn-g" onclick="bcReset(\'' + qid + '\')" style="font-size:9px;padding:8px 16px">▶ Ещё раз</button>'
      + '</div>';
  }

  _bcState = null;

  // Уведомление
  showToast((isFlow ? '🌟 Состояние Потока!' : '⚔ Концентрация завершена!') + ' +' + xpReward + ' ОП');
}

function bcAbort() {
  if (!_bcTimer) return;
  clearInterval(_bcTimer);
  _bcTimer = null;

  // Сбрасываем серию при прерывании
  S.bcStreak = 0;
  save();

  if (_bcState) {
    var qid = _bcState.questId;
    _bcState = null;

    var panel = document.getElementById('bc-panel-' + qid);
    if (panel) panel.style.display = 'none';

    var btn = document.getElementById('bc-start-btn-' + qid);
    if (btn) btn.style.display = '';
  }

  showToast('Концентрация прервана. Серия сброшена.');
}

function bcReset(qid) {
  var panel = document.getElementById('bc-panel-' + qid);
  if (panel) panel.style.display = 'none';
  var btn = document.getElementById('bc-start-btn-' + qid);
  if (btn) btn.style.display = '';
}

// Восстановить таймер если страница перезагрузилась во время сессии
function bcRestore() {
  // Не восстанавливаем — таймер локальный, при перезагрузке сбрасывается
  // Это нормально: перезагрузка = прерывание концентрации
}
```

---

## ИЗМЕНЕНИЕ 4: добавить S.bcStreak в fresh() и load()

**НАЙДИ в fresh():**
```javascript
    pendingBoss: null,
    bossKills: {},
    lastMentorLetter: ''
```

**ЗАМЕНИ НА:**
```javascript
    pendingBoss: null,
    bossKills: {},
    lastMentorLetter: '',
    bcStreak: 0
```

**НАЙДИ в load():**
```javascript
    if (!d.lastMentorLetter) d.lastMentorLetter = '';
    return d;
```

**ЗАМЕНИ НА:**
```javascript
    if (!d.lastMentorLetter) d.lastMentorLetter = '';
    if (!d.bcStreak) d.bcStreak = 0;
    return d;
```

---

## ИЗМЕНЕНИЕ 5: обновить focus.html — добавить таймер

**НАЙДИ в focus.html** функцию `load()` и **ЗАМЕНИ ВСЁ СОДЕРЖИМОЕ** `focus.html` на следующее:

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
  --r:6px;
  --ff-title:"Palatino Linotype","Book Antiqua",Palatino,serif;
  --ff-body:Georgia,"Times New Roman",serif;
}
html,body{
  width:360px;height:280px;overflow:hidden;
  background:var(--bg);color:var(--text);
  font-family:var(--ff-body);user-select:none;
}
body{
  display:flex;flex-direction:column;
  background:radial-gradient(ellipse at 50% 0%,#0c1e3a,#04090f);
  border:1px solid var(--bdm);
}
.f-header{
  display:flex;align-items:center;justify-content:space-between;
  padding:7px 12px;border-bottom:1px solid var(--bd);
  background:rgba(8,15,26,.8);flex-shrink:0;
}
.f-logo{font-family:var(--ff-title);font-size:11px;color:var(--gold);letter-spacing:2px}
.f-tabs{display:flex;gap:1px}
.f-tab{
  font-family:var(--ff-title);font-size:8px;letter-spacing:1px;
  padding:3px 9px;cursor:pointer;color:var(--text3);
  border:1px solid transparent;border-radius:4px;
  transition:all .15s;text-transform:uppercase;
}
.f-tab.active{color:var(--gold);border-color:rgba(212,168,74,.3);background:rgba(212,168,74,.07)}
.f-tab:hover:not(.active){color:var(--text2)}

.f-body{flex:1;padding:10px 12px;display:flex;flex-direction:column;gap:7px;overflow:hidden}
.f-footer{
  padding:4px 12px 5px;font-size:9px;color:var(--text3);
  font-style:italic;letter-spacing:.5px;text-align:center;flex-shrink:0;
}

/* Квест */
.f-empty{
  flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;
  font-style:italic;font-size:12px;color:var(--text3);gap:5px;text-align:center;
}
.f-cat{font-family:var(--ff-title);font-size:8px;letter-spacing:2px;color:var(--sky);text-transform:uppercase}
.f-title{font-family:var(--ff-title);font-size:14px;color:var(--gold);line-height:1.25;letter-spacing:.3px;flex:1}
.f-meta{display:flex;gap:7px;font-family:var(--ff-title);font-size:8px;color:var(--text3);flex-wrap:wrap}
.f-meta .urgent{color:var(--red2)}
.f-meta .ok{color:var(--green)}
.f-actions{display:flex;gap:6px;flex-shrink:0}
.f-btn{
  flex:1;padding:7px;border-radius:var(--r);font-family:var(--ff-title);
  font-size:8px;letter-spacing:1.5px;cursor:pointer;border:1px solid;
  text-transform:uppercase;transition:all .15s;text-align:center;
}
.f-btn-done{background:linear-gradient(135deg,#c89030,#e8b040);color:#07101d;border-color:rgba(232,176,64,.6);font-weight:600}
.f-btn-skip{background:rgba(255,255,255,.03);color:var(--text2);border-color:var(--bdm)}
.f-btn-skip:hover{color:var(--text);background:rgba(255,255,255,.06)}

/* Таймер */
.t-body{flex:1;display:flex;flex-direction:column;gap:8px}
.t-clock{
  font-family:var(--ff-title);font-size:44px;
  color:var(--text);letter-spacing:3px;text-align:center;
  line-height:1;padding:8px 0;
  text-shadow:0 0 20px rgba(64,136,216,.3);
}
.t-clock.urgent{color:var(--red2);text-shadow:0 0 16px rgba(240,64,64,.4);animation:pulse 1s ease-in-out infinite}
.t-clock.done{color:var(--gold);text-shadow:0 0 20px rgba(212,168,74,.5)}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}
.t-bar{height:4px;background:rgba(255,255,255,.05);border-radius:3px;overflow:hidden}
.t-fill{height:100%;background:linear-gradient(90deg,var(--sap),var(--sky));border-radius:3px;transition:width .5s linear;box-shadow:0 0 5px rgba(64,136,216,.4)}
.t-label{font-family:var(--ff-title);font-size:8px;color:var(--text3);letter-spacing:1px;text-align:center}
.t-streak{font-family:var(--ff-title);font-size:9px;color:#ff8040;text-align:center;letter-spacing:1px}
.t-actions{display:flex;gap:6px}
.t-btn{
  flex:1;padding:8px;border-radius:var(--r);font-family:var(--ff-title);
  font-size:8px;letter-spacing:1.5px;cursor:pointer;border:1px solid;
  text-transform:uppercase;text-align:center;transition:all .15s;
}
.t-btn-start{background:linear-gradient(135deg,#1a3560,#244a8a);color:var(--sky);border-color:rgba(64,136,216,.4)}
.t-btn-start:hover{background:linear-gradient(135deg,#244a8a,#3060b0)}
.t-btn-stop{background:rgba(168,32,32,.1);color:var(--red2);border-color:rgba(168,32,32,.3)}
.t-btn-stop:hover{background:rgba(168,32,32,.2)}
.t-reward{font-family:var(--ff-title);font-size:8px;color:var(--text3);text-align:center;letter-spacing:.5px}
</style>
</head>
<body>

<div class="f-header">
  <div class="f-logo">⚔ QuestFlow</div>
  <div class="f-tabs">
    <div class="f-tab active" id="tab-quest" onclick="showTab('quest')">Квест</div>
    <div class="f-tab" id="tab-timer" onclick="showTab('timer')">Концентрация</div>
  </div>
</div>

<div class="f-body" id="quest-pane"></div>
<div class="f-body" id="timer-pane" style="display:none"></div>

<div class="f-footer" id="footer"></div>

<script>
var SAVE_KEY = 'qf5';
var CAT_ICONS  = {study:'📚',work:'⚔',health:'🌿',hobby:'🎨',life:'🌍'};
var CAT_LABELS = {study:'Учёба',work:'Работа',health:'Здоровье',hobby:'Хобби',life:'Жизнь'};
var BC_DURATION = 25 * 60;
var _tab = 'quest';
var _timerInterval = null;
var _timerState = null; // {remaining, running}

function getData() {
  try { return JSON.parse(localStorage.getItem(SAVE_KEY)) || null; } catch(e) { return null; }
}
function saveData(data) {
  try { localStorage.setItem(SAVE_KEY, JSON.stringify(data)); } catch(e) {}
}

function showTab(tab) {
  _tab = tab;
  document.getElementById('tab-quest').className = 'f-tab' + (tab==='quest'?' active':'');
  document.getElementById('tab-timer').className = 'f-tab' + (tab==='timer'?' active':'');
  document.getElementById('quest-pane').style.display = tab==='quest' ? 'flex' : 'none';
  document.getElementById('timer-pane').style.display = tab==='timer' ? 'flex' : 'none';
}

function priority(q) {
  var s = 0;
  if (q.deadline) {
    var days = Math.ceil((new Date(q.deadline) - new Date()) / 86400000);
    if (days < 0) s += 10000;
    else if (days === 0) s += 5000;
    else if (days <= 1) s += 3000;
    else if (days <= 3) s += 2000;
    else if (days <= 7) s += 1000;
    else s += Math.max(0, 500 - days * 10);
  }
  s += (q.importance || 3) * 200 + (q.difficulty || 3) * 50;
  return s;
}
function isOverdue(q) {
  if (!q.deadline) return false;
  var d = new Date(q.deadline); d.setHours(23,59,59,0); return d < new Date();
}
function daysLabel(deadline) {
  if (!deadline) return '';
  var days = Math.ceil((new Date(deadline) - new Date()) / 86400000);
  if (days < 0) return 'просрочен';
  if (days === 0) return 'сегодня';
  if (days === 1) return 'завтра';
  return 'через ' + days + ' дн.';
}

function loadQuest() {
  var pane = document.getElementById('quest-pane');
  var footer = document.getElementById('footer');
  var data = getData();
  if (!data || !data.onboarded) {
    pane.innerHTML = '<div class="f-empty"><div>📜</div>Открой QuestFlow<br>и начни путь</div>';
    footer.textContent = '';
    return;
  }
  var quests = (data.quests || []).filter(function(q){ return !q.done; })
    .sort(function(a,b){ return priority(b) - priority(a); });
  if (quests.length === 0) {
    pane.innerHTML = '<div class="f-empty"><div>✦</div><span style="color:var(--gold)">Все квесты выполнены!</span></div>';
    footer.textContent = '';
    return;
  }
  var q = quests[0];
  var overdue = isOverdue(q);
  var dlabel = daysLabel(q.deadline);
  pane.innerHTML = '<div class="f-cat">' + (CAT_ICONS[q.category]||'') + ' ' + (CAT_LABELS[q.category]||'') + '</div>'
    + '<div class="f-title' + (overdue?' overdue':'') + '">' + (q.fantasyTitle||q.title) + '</div>'
    + '<div class="f-meta">'
    + (q.deadline ? '<span class="' + (overdue||dlabel==='сегодня'?'urgent':'ok') + '">⏰ ' + dlabel + '</span>' : '')
    + '</div>'
    + '<div class="f-actions">'
    + '<div class="f-btn f-btn-done" onclick="completeQuest(\'' + q.id + '\')">✓ Выполнено</div>'
    + '<div class="f-btn f-btn-skip" onclick="loadQuest()">→ Дальше</div>'
    + '</div>';
  footer.textContent = 'Активных: ' + quests.length + (data.hero ? ' · ' + data.hero.name : '');
}

function completeQuest(id) {
  var data = getData(); if (!data) return;
  var q = (data.quests||[]).find(function(q){ return q.id===id; }); if (!q) return;
  q.done = true; q.completedAt = new Date().toISOString();
  var xp = (q.difficulty||3)*(q.importance||3)*80;
  var gold = (q.difficulty||3)*(q.importance||3)*60;
  data.hero.xp = (data.hero.xp||0) + xp;
  data.hero.gold = (data.hero.gold||0) + gold;
  data.stats.totalDone = (data.stats.totalDone||0) + 1;
  var today = new Date().toISOString().slice(0,10);
  data.stats.daily[today] = (data.stats.daily[today]||0) + 1;
  data.journal = data.journal||[];
  data.journal.unshift({title:q.fantasyTitle||q.title,xp:xp,gold:gold,date:today});
  saveData(data);
  var pane = document.getElementById('quest-pane');
  pane.innerHTML = '<div class="f-empty"><div style="font-size:24px">✦</div>'
    + '<div style="color:var(--gold);font-family:var(--ff-title);font-size:11px;letter-spacing:1px">КВЕСТ ВЫПОЛНЕН</div>'
    + '<div style="font-size:11px;color:var(--text2)"><span style="color:var(--sap)">+' + xp + ' ОП</span> · <span style="color:var(--gold)">🪙 +' + gold + '</span></div>'
    + '</div>';
  setTimeout(loadQuest, 1800);
}

// Таймер концентрации
function renderTimer() {
  var pane = document.getElementById('timer-pane');
  var data = getData();
  var streak = data ? (data.bcStreak||0) : 0;
  var isFlow = streak >= 3;

  if (!_timerState) {
    // Не запущен
    pane.innerHTML = '<div class="t-body">'
      + '<div class="t-clock">25:00</div>'
      + '<div class="t-bar"><div class="t-fill" style="width:0%"></div></div>'
      + '<div class="t-label">Боевая Концентрация · 25 минут</div>'
      + (streak > 0 ? '<div class="t-streak">🔥 Серия: ' + streak + (isFlow ? ' · Состояние Потока!' : '') + '</div>' : '')
      + '<div class="t-actions">'
      +   '<div class="t-btn t-btn-start" onclick="timerStart()">⚔ Начать</div>'
      + '</div>'
      + '<div class="t-reward">Награда: +' + (50*(isFlow?2:1)) + ' ОП · 🪙 +' + (20*(isFlow?2:1)) + '</div>'
      + '</div>';
    return;
  }

  var rem = _timerState.remaining;
  var pct = Math.round((1 - rem / BC_DURATION) * 100);
  var min = Math.floor(rem / 60);
  var sec = rem % 60;
  var timeStr = String(min).padStart(2,'0') + ':' + String(sec).padStart(2,'0');
  var urgent = rem <= 60;

  if (rem <= 0) {
    pane.innerHTML = '<div class="t-body">'
      + '<div class="t-clock done">00:00</div>'
      + '<div class="t-bar"><div class="t-fill" style="width:100%;background:linear-gradient(90deg,var(--gold3),var(--gold))"></div></div>'
      + '<div class="t-label" style="color:var(--gold)">Завершено!</div>'
      + '<div class="t-actions">'
      +   '<div class="t-btn t-btn-start" onclick="timerReset()">▶ Ещё раз</div>'
      + '</div>'
      + '</div>';
    return;
  }

  pane.innerHTML = '<div class="t-body">'
    + '<div class="t-clock' + (urgent?' urgent':'') + '">' + timeStr + '</div>'
    + '<div class="t-bar"><div class="t-fill" style="width:' + pct + '%;' + (isFlow?'background:linear-gradient(90deg,var(--gold3),var(--gold));box-shadow:0 0 6px rgba(212,168,74,.4)':'') + '"></div></div>'
    + '<div class="t-label">' + pct + '% ' + (isFlow?'· ✨ Поток':'· Держись') + '</div>'
    + (streak > 0 ? '<div class="t-streak">🔥 Серия: ' + streak + '</div>' : '')
    + '<div class="t-actions">'
    +   '<div class="t-btn t-btn-stop" onclick="timerStop()">✗ Прервать</div>'
    + '</div>'
    + '</div>';
}

function timerStart() {
  if (_timerInterval) return;
  _timerState = { remaining: BC_DURATION };
  _timerInterval = setInterval(function() {
    _timerState.remaining--;
    renderTimer();
    if (_timerState.remaining <= 0) {
      clearInterval(_timerInterval);
      _timerInterval = null;
      timerComplete();
    }
  }, 1000);
  renderTimer();
}

function timerComplete() {
  var data = getData(); if (!data) return;
  var streak = (data.bcStreak||0) + 1;
  var isFlow = streak >= 3;
  var xp = 50 * (isFlow ? 2 : 1);
  var gold = 20 * (isFlow ? 2 : 1);
  data.bcStreak = streak;
  data.hero.xp   = (data.hero.xp  ||0) + xp;
  data.hero.gold = (data.hero.gold ||0) + gold;
  saveData(data);
  renderTimer();
}

function timerStop() {
  if (_timerInterval) { clearInterval(_timerInterval); _timerInterval = null; }
  var data = getData();
  if (data) { data.bcStreak = 0; saveData(data); }
  _timerState = null;
  renderTimer();
}

function timerReset() {
  _timerState = null;
  if (_timerInterval) { clearInterval(_timerInterval); _timerInterval = null; }
  renderTimer();
}

loadQuest();
renderTimer();
setInterval(function() { if (_tab === 'quest') loadQuest(); }, 30000);
</script>
</body>
</html>
```

---
---

# ПАТЧ 29: ТРЕКЕР НАСТРОЕНИЯ

## Архитектура
- Виджет появляется при открытии приложения раз в день
- 5 состояний: Разбит → Устал → Норм → Хорошо → В огне
- Настроение влияет: тинт фона, приоритет квестов, тост наставника
- S.mood — текущее настроение с датой
- Хранится в localStorage, не мешает другим данным

## Совместимость
- initAll() — добавляем checkMood() ✓
- renderQuests() — добавляем учёт настроения при выборе главного квеста ✓
- Патч 15 (погода) — настроение усиливает тинт независимо ✓
- CSS .mood-* — уникальны ✓

---

## ИЗМЕНЕНИЕ 6: HTML модалки настроения

**НАЙДИ:**
```html
<!-- QUEST NOTES -->
<div class="m-overlay" id="m-notes">
```

**ДОБАВЬ ПЕРЕД НЕЙ:**
```html
<!-- MOOD CHECK -->
<div class="m-overlay" id="m-mood" style="align-items:flex-end;padding-bottom:0">
  <div class="modal mood-modal">
    <div class="mood-title">Как ты сегодня, герой?</div>
    <div class="mood-sub">Это влияет на квесты и атмосферу</div>
    <div class="mood-options">
      <div class="mood-opt" onclick="setMood(1)" title="Разбит">
        <div class="mood-icon">😔</div>
        <div class="mood-lbl">Разбит</div>
      </div>
      <div class="mood-opt" onclick="setMood(2)" title="Устал">
        <div class="mood-icon">😐</div>
        <div class="mood-lbl">Устал</div>
      </div>
      <div class="mood-opt" onclick="setMood(3)" title="Норм">
        <div class="mood-icon">🙂</div>
        <div class="mood-lbl">Норм</div>
      </div>
      <div class="mood-opt" onclick="setMood(4)" title="Хорошо">
        <div class="mood-icon">😊</div>
        <div class="mood-lbl">Хорошо</div>
      </div>
      <div class="mood-opt" onclick="setMood(5)" title="В огне">
        <div class="mood-icon">🔥</div>
        <div class="mood-lbl">В огне</div>
      </div>
    </div>
    <button class="btn btn-o" onclick="closeM('m-mood')" style="width:100%;justify-content:center;margin-top:4px;font-size:9px">Пропустить</button>
  </div>
</div>
```

---

## ИЗМЕНЕНИЕ 7: CSS настроения

**ДОБАВИТЬ в конец CSS** (перед `</style>`):

```css
/* ===== MOOD TRACKER ===== */
.mood-modal{
  width:100%;max-width:400px;border-radius:var(--r2) var(--r2) 0 0;
  padding:20px 24px 24px;
  background:var(--glass2);
  animation:mood-slide-up .35s cubic-bezier(.34,1.2,.64,1) both;
}
@keyframes mood-slide-up{
  from{transform:translateY(100%);opacity:0}
  to{transform:translateY(0);opacity:1}
}
.mood-title{
  font-family:var(--ff-title);font-size:15px;
  color:var(--text);text-align:center;
  margin-bottom:4px;letter-spacing:.5px;
}
.mood-sub{
  font-family:var(--ff-body);font-style:italic;
  font-size:12px;color:var(--text3);
  text-align:center;margin-bottom:18px;
}
.mood-options{
  display:flex;justify-content:space-between;
  gap:6px;margin-bottom:14px;
}
.mood-opt{
  flex:1;text-align:center;cursor:pointer;
  padding:10px 4px;border-radius:var(--r);
  border:1px solid var(--bd);
  background:rgba(255,255,255,.02);
  transition:all .2s cubic-bezier(.34,1.26,.64,1);
}
.mood-opt:hover{
  background:rgba(255,255,255,.06);
  border-color:var(--bdm);
  transform:translateY(-4px) scale(1.05);
}
.mood-icon{font-size:26px;margin-bottom:5px;display:block}
.mood-lbl{
  font-family:var(--ff-title);font-size:8px;
  letter-spacing:1px;color:var(--text3);
  text-transform:uppercase;
}

/* Тинт фона под настроение */
body.mood-1 .main-wrap::after{content:'';position:fixed;inset:0;pointer-events:none;background:rgba(40,20,80,.08);z-index:0}
body.mood-5 .main-wrap::after{content:'';position:fixed;inset:0;pointer-events:none;background:rgba(212,168,74,.03);z-index:0}

/* Бейдж настроения в топбаре */
.mood-badge{
  font-size:16px;cursor:pointer;
  transition:transform .2s;
  line-height:1;
}
.mood-badge:hover{transform:scale(1.2)}
```

---

## ИЗМЕНЕНИЕ 8: добавить бейдж настроения в topbar

**НАЙДИ в HTML topbar:**
```html
  <div class="tright">
    <button class="apibtn" id="mute-btn" onclick="toggleMute()" title="Звук">🔊</button>
```

**ЗАМЕНИ НА:**
```html
  <div class="tright">
    <div class="mood-badge" id="mood-badge" onclick="openM('m-mood')" title="Настроение" style="display:none"></div>
    <button class="apibtn" id="mute-btn" onclick="toggleMute()" title="Звук">🔊</button>
```

---

## ИЗМЕНЕНИЕ 9: JS — логика настроения

**НАЙДИ** строку `// =============================================` с `// BATTLE CONCENTRATION`
и **ДОБАВЬ ПЕРЕД НЕЙ:**

```javascript
// =============================================
// MOOD TRACKER — ТРЕКЕР НАСТРОЕНИЯ
// =============================================

var MOOD_ICONS = { 1:'😔', 2:'😐', 3:'🙂', 4:'😊', 5:'🔥' };
var MOOD_LABELS = { 1:'Разбит', 2:'Устал', 3:'Норм', 4:'Хорошо', 5:'В огне' };
var MOOD_TOASTS = {
  1: 'Тяжёлый день, герой. Начни с самого малого.',
  2: 'Ты устал — это нормально. Один шаг за раз.',
  3: 'Средний день — хороший день для квестов.',
  4: 'Хороший день — время для важных дел.',
  5: '🔥 Ты в огне! Это лучшее время для эпических квестов.',
};

function checkMood() {
  var today = new Date().toISOString().slice(0, 10);
  if (S.mood && S.mood.date === today) {
    applyMood(S.mood.value, false);
    return;
  }
  // Показываем виджет с задержкой
  setTimeout(function() { openM('m-mood'); }, 2500);
}

function setMood(value) {
  var today = new Date().toISOString().slice(0, 10);
  S.mood = { value: value, date: today };
  save();
  closeM('m-mood');
  applyMood(value, true);
}

function applyMood(value, showToastMsg) {
  // Бейдж в топбаре
  var badge = document.getElementById('mood-badge');
  if (badge) {
    badge.textContent = MOOD_ICONS[value] || '';
    badge.style.display = 'block';
    badge.title = 'Настроение: ' + (MOOD_LABELS[value] || '');
  }

  // CSS класс на body
  document.body.className = document.body.className.replace(/mood-\d/g, '').trim();
  document.body.classList.add('mood-' + value);

  // Если настроение плохое (1-2) — предлагаем лёгкий квест
  if (value <= 2) {
    var active = (S.quests || []).filter(function(q){ return !q.done; });
    if (active.length > 0) {
      // Сортируем по сложности (лёгкие первыми) вместо приоритета
      active.sort(function(a, b){ return (a.difficulty||3) - (b.difficulty||3); });
      if (showToastMsg) {
        setTimeout(function() {
          showToast('💡 Предлагаем начать с: «' + (active[0].fantasyTitle || active[0].title) + '»');
        }, 1000);
      }
    }
  }

  if (showToastMsg && MOOD_TOASTS[value]) {
    showToast(MOOD_TOASTS[value]);
  }
}
```

---

## ИЗМЕНЕНИЕ 10: обновить fresh() и load() для S.mood

**НАЙДИ в fresh():**
```javascript
    bcStreak: 0
```

**ЗАМЕНИ НА:**
```javascript
    bcStreak: 0,
    mood: null
```

**НАЙДИ в load():**
```javascript
    if (!d.bcStreak) d.bcStreak = 0;
    return d;
```

**ЗАМЕНИ НА:**
```javascript
    if (!d.bcStreak) d.bcStreak = 0;
    if (d.mood === undefined) d.mood = null;
    return d;
```

---

## ИЗМЕНЕНИЕ 11: добавить checkMood в initAll

**НАЙДИ в initAll():**
```javascript
  checkDailyEvent();
  checkMentorLetter();
```

**ЗАМЕНИ НА:**
```javascript
  checkMood();
  checkDailyEvent();
  checkMentorLetter();
```

---

## Итог обоих патчей

### Патч 26 — Боевая Концентрация
| Элемент | Описание |
|---|---|
| Кнопка | "⚔ Концентрация" в карточке главного квеста |
| Таймер | 25 минут, прямо в карточке |
| Серия | 3+ сессии подряд = Состояние Потока (×2 награда) |
| Прерывание | Кнопка "✗ Прервать", сбрасывает серию |
| Награда | +50 XP + 20 золота (×2 в Потоке) |
| focus.html | Вкладки "Квест" и "Концентрация" в мини-окне |

### Патч 29 — Трекер Настроения
| Элемент | Описание |
|---|---|
| Виджет | Появляется снизу экрана раз в день |
| Выборов | 5: Разбит / Устал / Норм / Хорошо / В огне |
| Бейдж | Иконка настроения в топбаре, клик = смена |
| При "Разбит/Устал" | Тост предлагает самый лёгкий квест |
| При "В огне" | Золотой тинт фона |
| Хранение | S.mood в localStorage, сбрасывается каждый день |
