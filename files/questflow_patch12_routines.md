# QuestFlow — Патч 12: Регулярные задачи (Обряды Силы)

## Архитектура
- S.routines[] — отдельный массив, не смешивается с S.quests[]
- Каждый день при открытии приложения: checkRoutines() создаёт квесты-копии
  для рутин, активных сегодня, если они ещё не созданы сегодня
- Квест-копия помечается полем routine_id — при выполнении засчитывается в streak
- Отдельная вьюха view-routines, иконка 🔄 в sidenav
- Отдельная модалка m-routine для создания

## Проверка совместимости
- S.routines и S.routine_streaks — новые поля, load() безопасно добавляет через || [] ✓
- initAll() — добавляем вызов checkRoutines() и renderRoutines() ✓
- doComplete() из Патча 5 — добавляем обработку routine_id для streak ✓
- sw() из Патча 5/11 — добавляем case 'routines' ✓
- renderQuests() — добавляем секцию рутин сегодня ✓
- CSS классы .rtn-* — уникальны, нет пересечений ✓
- Звуки из Патча 9 — вызываем sndSelect/sndError где уместно ✓

---

## ИЗМЕНЕНИЕ 1: иконка рутин в sidenav

**НАЙДИ:**
```html
  <div class="ni" id="ni-calendar" onclick="sw('calendar',this)">📅<span class="ni-tip">Летопись</span></div>
```

**ЗАМЕНИ НА:**
```html
  <div class="ni" id="ni-calendar" onclick="sw('calendar',this)">📅<span class="ni-tip">Летопись</span></div>
  <div class="ni" id="ni-routines" onclick="sw('routines',this)">🔄<span class="ni-tip">Обряды</span></div>
```

---

## ИЗМЕНЕНИЕ 2: HTML вьюхи рутин

**НАЙДИ:**
```html
<!-- CALENDAR -->
<div class="view" id="view-calendar">
```

**ДОБАВЬ ПЕРЕД НЕЙ:**
```html
<!-- ROUTINES -->
<div class="view" id="view-routines">
  <div class="pad">

    <div class="shdr">Обряды Силы</div>

    <!-- Статистика рутин -->
    <div class="rtn-summary" id="rtn-summary"></div>

    <!-- Список рутин -->
    <div id="rtn-list"></div>

    <!-- Кнопка добавления -->
    <button class="add-q" onclick="openM('m-routine');if(typeof sndModal==='function')sndModal()">
      🔄 Новый обряд
    </button>

    <!-- Выполненные сегодня -->
    <div class="shdr" id="rtn-done-hdr" style="display:none;margin-top:8px">Выполнено сегодня</div>
    <div id="rtn-done-list"></div>

  </div>
</div>
```

---

## ИЗМЕНЕНИЕ 3: модалка создания рутины

**НАЙДИ:**
```html
<!-- CALENDAR — добавить событие -->
<div class="m-overlay" id="m-cal">
```

**ДОБАВЬ ПЕРЕД НЕЙ:**
```html
<!-- ROUTINES — создать обряд -->
<div class="m-overlay" id="m-routine">
  <div class="modal">
    <button class="m-close" onclick="closeM('m-routine')">✕</button>
    <div class="m-title">🔄 Новый обряд силы</div>

    <div class="fg">
      <label class="flbl">Название</label>
      <input class="fi" id="rtn-title" type="text" placeholder="Например: Пробежка утром" maxlength="60">
    </div>

    <div class="fg">
      <label class="flbl">Категория</label>
      <select class="fsel" id="rtn-cat">
        <option value="health">🌿 Здоровье</option>
        <option value="study">📚 Учёба</option>
        <option value="work">⚔ Работа</option>
        <option value="hobby">🎨 Хобби</option>
        <option value="life">🌍 Жизнь</option>
      </select>
    </div>

    <div class="fg">
      <label class="flbl">Дни недели</label>
      <div class="rtn-days-sel" id="rtn-days-sel">
        <div class="rtn-day-btn" data-day="1">Пн</div>
        <div class="rtn-day-btn" data-day="2">Вт</div>
        <div class="rtn-day-btn" data-day="3">Ср</div>
        <div class="rtn-day-btn" data-day="4">Чт</div>
        <div class="rtn-day-btn" data-day="5">Пт</div>
        <div class="rtn-day-btn" data-day="6">Сб</div>
        <div class="rtn-day-btn" data-day="0">Вс</div>
      </div>
      <div style="display:flex;gap:8px;margin-top:8px">
        <button class="btn btn-o" onclick="rtnSelAll()" style="padding:5px 12px;font-size:8px">Каждый день</button>
        <button class="btn btn-o" onclick="rtnSelWeekdays()" style="padding:5px 12px;font-size:8px">Пн–Пт</button>
        <button class="btn btn-o" onclick="rtnSelWeekend()" style="padding:5px 12px;font-size:8px">Сб–Вс</button>
      </div>
    </div>

    <div class="frow">
      <div class="fg">
        <label class="flbl">Сложность</label>
        <select class="fsel" id="rtn-diff">
          <option value="1">★ Лёгкий</option>
          <option value="2">★★ Средний</option>
          <option value="3" selected>★★★ Сложный</option>
          <option value="4">★★★★ Тяжёлый</option>
          <option value="5">★★★★★ Эпический</option>
        </select>
      </div>
      <div class="fg">
        <label class="flbl">Продолжительность</label>
        <select class="fsel" id="rtn-duration">
          <option value="0">Бессрочно</option>
          <option value="7">1 неделя</option>
          <option value="14">2 недели</option>
          <option value="21">21 день</option>
          <option value="30">30 дней</option>
          <option value="60">60 дней</option>
          <option value="90">90 дней</option>
        </select>
      </div>
    </div>

    <div class="fg">
      <label class="flbl">Цель (необязательно)</label>
      <input class="fi" id="rtn-goal" type="text" placeholder="Для чего этот обряд?" maxlength="80">
    </div>

    <div class="m-actions">
      <button class="btn btn-g" onclick="addRoutine()">⚔ Принять обряд</button>
      <button class="btn btn-o" onclick="closeM('m-routine')">Отмена</button>
    </div>
  </div>
</div>
```

---

## ИЗМЕНЕНИЕ 4: CSS для рутин

**ДОБАВИТЬ в конец CSS** (перед `</style>`):

```css
/* ===== ROUTINES — ОБРЯДЫ СИЛЫ ===== */

/* Выбор дней недели */
.rtn-days-sel{
  display:grid;grid-template-columns:repeat(7,1fr);
  gap:5px;
}
.rtn-day-btn{
  background:rgba(255,255,255,.03);
  border:1px solid var(--bd);
  border-radius:var(--r);
  padding:8px 4px;
  text-align:center;
  font-family:var(--ff-title);font-size:9px;
  letter-spacing:1px;color:var(--text3);
  cursor:pointer;
  transition:all .18s cubic-bezier(.34,1.26,.64,1);
  user-select:none;
}
.rtn-day-btn:hover{
  color:var(--text2);
  border-color:var(--bdm);
  background:rgba(255,255,255,.05);
}
.rtn-day-btn.sel{
  color:var(--gold);
  background:rgba(212,168,74,.1);
  border-color:rgba(212,168,74,.35);
  box-shadow:0 0 8px rgba(212,168,74,.12);
  transform:scale(1.06);
}

/* Сводка рутин */
.rtn-summary{
  display:grid;grid-template-columns:repeat(3,1fr);
  gap:10px;margin-bottom:20px;
}
.rtn-sum-card{
  background:var(--glass);
  border:1px solid var(--bd);
  border-radius:var(--r2);
  padding:14px;text-align:center;
  box-shadow:var(--shadow-card);
  position:relative;overflow:hidden;
}
.rtn-sum-card::before{
  content:'';position:absolute;top:0;left:0;right:0;height:1px;
  background:linear-gradient(90deg,transparent,rgba(212,168,74,.2),transparent);
}
.rtn-sum-icon{font-size:18px;margin-bottom:5px;display:block}
.rtn-sum-val{
  font-family:var(--ff-title);font-size:22px;
  color:var(--gold);line-height:1;margin-bottom:4px;
  text-shadow:0 0 12px rgba(212,168,74,.2);
}
.rtn-sum-lbl{
  font-family:var(--ff-title);font-size:7px;
  letter-spacing:2px;color:var(--text3);
  text-transform:uppercase;
}

/* Карточка рутины */
.rtn-card{
  background:var(--glass);
  border:1px solid var(--bd);
  border-radius:var(--r2);
  padding:16px 20px;
  margin-bottom:10px;
  box-shadow:var(--shadow-card);
  transition:all .22s cubic-bezier(.4,0,.2,1);
  position:relative;overflow:hidden;
  animation:fadeInUp .38s cubic-bezier(.34,1.2,.64,1) both;
}
.rtn-card::before{
  content:'';position:absolute;top:0;left:0;right:0;height:1px;
  background:linear-gradient(90deg,transparent,rgba(212,168,74,.2),transparent);
}
/* Левая полоска — цвет категории */
.rtn-card::after{
  content:'';position:absolute;left:0;top:0;bottom:0;width:3px;
  border-radius:0 2px 2px 0;
}
.rtn-card.cat-health::after{background:var(--green)}
.rtn-card.cat-study::after{background:var(--sap)}
.rtn-card.cat-work::after{background:var(--red2)}
.rtn-card.cat-hobby::after{background:#c8883d}
.rtn-card.cat-life::after{background:var(--purple)}

.rtn-card:hover{
  transform:translateY(-2px);
  box-shadow:var(--shadow-hover);
  border-color:rgba(212,168,74,.15);
}

/* Заголовок карточки рутины */
.rtn-card-top{
  display:flex;align-items:flex-start;
  justify-content:space-between;gap:12px;
  margin-bottom:10px;
}
.rtn-title{
  font-family:var(--ff-title);font-size:15px;
  color:var(--text);letter-spacing:.5px;flex:1;
}
.rtn-controls{display:flex;gap:6px;align-items:center;flex-shrink:0}
.rtn-del-btn{
  background:transparent;border:1px solid rgba(168,32,32,.2);
  border-radius:var(--r);color:var(--text3);cursor:pointer;
  font-size:11px;padding:4px 8px;
  transition:all .15s;
}
.rtn-del-btn:hover{
  color:var(--red2);
  border-color:rgba(240,64,64,.4);
  background:rgba(240,64,64,.06);
}
.rtn-pause-btn{
  background:transparent;border:1px solid var(--bd);
  border-radius:var(--r);color:var(--text3);cursor:pointer;
  font-size:11px;padding:4px 8px;
  transition:all .15s;
}
.rtn-pause-btn:hover{color:var(--gold);border-color:var(--bdg)}

/* Дни недели на карточке */
.rtn-days-row{
  display:flex;gap:4px;margin-bottom:10px;flex-wrap:wrap;
}
.rtn-day-pip{
  font-family:var(--ff-title);font-size:8px;letter-spacing:1px;
  padding:3px 7px;border-radius:20px;
  border:1px solid var(--bd);color:var(--text3);
  text-transform:uppercase;
}
.rtn-day-pip.active{
  color:var(--gold);
  background:rgba(212,168,74,.08);
  border-color:rgba(212,168,74,.3);
}
.rtn-day-pip.today{
  color:var(--bg);
  background:var(--gold);
  border-color:var(--gold);
  box-shadow:0 0 8px rgba(212,168,74,.3);
}

/* Streak (серия) */
.rtn-streak-row{
  display:flex;align-items:center;justify-content:space-between;
  margin-bottom:10px;
}
.rtn-streak{
  display:flex;align-items:center;gap:6px;
}
.rtn-streak-fire{font-size:16px;animation:float 2s ease-in-out infinite}
.rtn-streak-val{
  font-family:var(--ff-title);font-size:18px;
  color:#ff8040;line-height:1;
  text-shadow:0 0 8px rgba(255,100,0,.3);
}
.rtn-streak-lbl{
  font-family:var(--ff-title);font-size:8px;
  letter-spacing:1.5px;color:var(--text3);
  text-transform:uppercase;
}
.rtn-progress-wrap{flex:1;margin-left:14px}
.rtn-progress-lbl{
  display:flex;justify-content:space-between;
  font-family:var(--ff-title);font-size:8px;
  color:var(--text3);letter-spacing:.5px;margin-bottom:4px;
}
.rtn-progress-bar{
  height:5px;background:rgba(255,255,255,.05);
  border-radius:3px;overflow:hidden;
}
.rtn-progress-fill{
  height:100%;border-radius:3px;
  background:linear-gradient(90deg,#ff6020,#ff8040);
  box-shadow:0 0 6px rgba(255,100,0,.3);
  transition:width .7s cubic-bezier(.4,0,.2,1);
}

/* Мини-календарь выполнений (последние 14 дней) */
.rtn-heatmap{
  display:flex;gap:3px;margin-top:10px;
}
.rtn-hm-cell{
  width:14px;height:14px;border-radius:3px;
  border:1px solid var(--bd);
  background:rgba(255,255,255,.02);
  transition:all .15s;
  flex-shrink:0;
  position:relative;
}
.rtn-hm-cell.done{
  background:var(--green);
  border-color:rgba(40,176,96,.5);
  box-shadow:0 0 4px rgba(40,176,96,.3);
}
.rtn-hm-cell.skipped{
  background:rgba(240,64,64,.15);
  border-color:rgba(240,64,64,.2);
}
.rtn-hm-cell.future{opacity:.2}
.rtn-hm-cell.not-scheduled{opacity:.12}
.rtn-hm-lbl{
  font-family:var(--ff-title);font-size:8px;
  letter-spacing:1px;color:var(--text3);
  margin-right:4px;align-self:center;flex-shrink:0;
}

/* Статус рутины сегодня */
.rtn-today-status{
  display:flex;align-items:center;gap:8px;
  padding:8px 12px;
  border-radius:var(--r);
  font-family:var(--ff-title);font-size:9px;
  letter-spacing:1.5px;text-transform:uppercase;
}
.rtn-today-status.pending{
  background:rgba(64,136,216,.07);
  border:1px solid rgba(64,136,216,.2);
  color:var(--sky);
}
.rtn-today-status.done{
  background:rgba(40,176,96,.07);
  border:1px solid rgba(40,176,96,.2);
  color:var(--green);
}
.rtn-today-status.not-today{
  background:rgba(255,255,255,.02);
  border:1px solid var(--bd);
  color:var(--text3);
}

/* Паузированная рутина */
.rtn-card.paused{opacity:.5;filter:grayscale(.4)}
.rtn-card.paused .rtn-title::after{
  content:' · на паузе';
  font-size:11px;color:var(--text3);font-style:italic;letter-spacing:0;
}

/* Выполненные сегодня */
.rtn-done-item{
  display:flex;align-items:center;gap:10px;
  padding:10px 14px;
  background:rgba(40,176,96,.04);
  border:1px solid rgba(40,176,96,.15);
  border-radius:var(--r);
  margin-bottom:7px;
  font-family:var(--ff-title);font-size:11px;color:var(--text2);
}
.rtn-done-check{
  width:20px;height:20px;border-radius:50%;
  background:rgba(40,176,96,.15);
  border:1px solid rgba(40,176,96,.4);
  display:flex;align-items:center;justify-content:center;
  font-size:10px;color:var(--green);flex-shrink:0;
}
```

---

## ИЗМЕНЕНИЕ 5: JS — вся логика рутин

**НАЙДИ** строку `// =============================================` с блоком `// CALENDAR` (добавлен в Патче 11)
и **ДОБАВЬ ПЕРЕД НЕЙ:**

```javascript
// =============================================
// ROUTINES — ОБРЯДЫ СИЛЫ
// =============================================

var RTN_DAY_NAMES = ['Вс','Пн','Вт','Ср','Чт','Пт','Сб'];
var RTN_DAY_NAMES_FULL = ['Воскресенье','Понедельник','Вторник','Среда','Четверг','Пятница','Суббота'];

// Выбор дней в модалке
var _rtnSelDays = [];

function rtnToggleDay(day) {
  var idx = _rtnSelDays.indexOf(day);
  if (idx === -1) _rtnSelDays.push(day);
  else _rtnSelDays.splice(idx, 1);
  document.querySelectorAll('.rtn-day-btn').forEach(function(btn) {
    btn.classList.toggle('sel', _rtnSelDays.indexOf(parseInt(btn.dataset.day)) !== -1);
  });
}
function rtnSelAll()      { _rtnSelDays=[0,1,2,3,4,5,6]; rtnSyncDayBtns(); }
function rtnSelWeekdays() { _rtnSelDays=[1,2,3,4,5];     rtnSyncDayBtns(); }
function rtnSelWeekend()  { _rtnSelDays=[6,0];            rtnSyncDayBtns(); }
function rtnSyncDayBtns() {
  document.querySelectorAll('.rtn-day-btn').forEach(function(btn) {
    btn.classList.toggle('sel', _rtnSelDays.indexOf(parseInt(btn.dataset.day)) !== -1);
  });
}

// Инициализация кнопок выбора дней
function initRtnDayBtns() {
  document.querySelectorAll('.rtn-day-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      rtnToggleDay(parseInt(btn.dataset.day));
      if (typeof sndSelect === 'function') sndSelect();
    });
  });
}

// Добавить рутину
function addRoutine() {
  var title    = (document.getElementById('rtn-title').value || '').trim();
  var cat      = document.getElementById('rtn-cat').value;
  var diff     = parseInt(document.getElementById('rtn-diff').value) || 3;
  var duration = parseInt(document.getElementById('rtn-duration').value) || 0;
  var goal     = (document.getElementById('rtn-goal').value || '').trim();

  if (!title) {
    showToast('Введи название обряда!');
    if (typeof sndError === 'function') sndError();
    return;
  }
  if (_rtnSelDays.length === 0) {
    showToast('Выбери хотя бы один день!');
    if (typeof sndError === 'function') sndError();
    return;
  }

  if (!S.routines) S.routines = [];

  var today = new Date().toISOString().slice(0, 10);
  var endDate = null;
  if (duration > 0) {
    var end = new Date();
    end.setDate(end.getDate() + duration);
    endDate = end.toISOString().slice(0, 10);
  }

  var routine = {
    id:        'rtn_' + Date.now(),
    title:     title,
    cat:       cat,
    diff:      diff,
    days:      _rtnSelDays.slice().sort(),  // дни недели [0-6]
    goal:      goal,
    startDate: today,
    endDate:   endDate,
    paused:    false,
    streak:    0,
    bestStreak:0,
    totalDone: 0,
    history:   {}  // { 'YYYY-MM-DD': true/false }
  };

  S.routines.push(routine);
  save();
  closeM('m-routine');

  // Сброс формы
  document.getElementById('rtn-title').value = '';
  document.getElementById('rtn-goal').value  = '';
  _rtnSelDays = [];
  rtnSyncDayBtns();

  // Сразу создать квест на сегодня если день подходит
  checkRoutines();
  renderRoutines();
  renderQuests();

  showToast('✦ Обряд принят! Начинается сегодня.');
  if (typeof sndQuestComplete === 'function') sndQuestComplete();
}

// Пауза/возобновление рутины
function toggleRoutinePause(id) {
  var r = (S.routines || []).find(function(r){ return r.id === id; });
  if (!r) return;
  r.paused = !r.paused;
  save();
  renderRoutines();
  showToast(r.paused ? 'Обряд на паузе' : 'Обряд возобновлён');
}

// Удалить рутину
function deleteRoutine(id) {
  if (!S.routines) return;
  S.routines = S.routines.filter(function(r){ return r.id !== id; });
  // Удаляем связанные квесты на сегодня
  var today = new Date().toISOString().slice(0, 10);
  S.quests = S.quests.filter(function(q){
    return !(q.routine_id === id && q.routine_date === today && !q.done);
  });
  save();
  renderRoutines();
  renderQuests();
  showToast('Обряд удалён');
}

// Проверяет активна ли рутина сегодня
function routineActiveToday(r) {
  if (r.paused) return false;
  var today = new Date();
  var todayStr = today.toISOString().slice(0, 10);
  // Проверка дат
  if (r.startDate && todayStr < r.startDate) return false;
  if (r.endDate   && todayStr > r.endDate)   return false;
  // Проверка дня недели (0=вс, 1=пн...)
  return r.days.indexOf(today.getDay()) !== -1;
}

// Создать квест-копию рутины на сегодня
function createRoutineQuest(r) {
  var today = new Date().toISOString().slice(0, 10);
  var xp    = r.diff * 3 * 60;  // немного меньше чем у обычных квестов
  var gold  = r.diff * 3 * 40;

  var q = {
    id:           'rq_' + r.id + '_' + Date.now(),
    title:        r.title,
    category:     r.cat,
    difficulty:   r.diff,
    importance:   3,
    deadline:     today,
    note:         r.goal || '',
    done:         false,
    createdAt:    new Date().toISOString(),
    routine_id:   r.id,
    routine_date: today,
    isRoutine:    true,
    fantasyTitle: null,
    fantasyDesc:  null
  };

  S.quests.push(q);
  return q;
}

// Главная функция: запускается при старте и раз в день
function checkRoutines() {
  if (!S.routines || S.routines.length === 0) return;
  var today = new Date().toISOString().slice(0, 10);

  S.routines.forEach(function(r) {
    if (!routineActiveToday(r)) return;

    // Проверяем — не создан ли уже квест на сегодня
    var alreadyExists = S.quests.some(function(q) {
      return q.routine_id === r.id && q.routine_date === today;
    });

    if (!alreadyExists) {
      createRoutineQuest(r);
    }
  });

  save();
}

// Засчитать выполнение рутины (вызывается из doComplete)
function completeRoutineStreak(routineId, date) {
  var r = (S.routines || []).find(function(r){ return r.id === routineId; });
  if (!r) return;

  r.history[date] = true;
  r.totalDone = (r.totalDone || 0) + 1;

  // Пересчёт streak
  var streak = 0;
  var d = new Date(date + 'T00:00:00');
  while (true) {
    var dStr = d.toISOString().slice(0, 10);
    // Засчитываем только дни когда рутина была запланирована
    var dayOfWeek = d.getDay();
    var wasScheduled = r.days.indexOf(dayOfWeek) !== -1;
    if (wasScheduled) {
      if (r.history[dStr]) {
        streak++;
      } else {
        break;
      }
    }
    d.setDate(d.getDate() - 1);
    // Стоп если ушли дальше даты начала
    if (r.startDate && dStr <= r.startDate) break;
    // Защита от бесконечного цикла
    if (streak > 1000) break;
  }

  r.streak = streak;
  if (streak > (r.bestStreak || 0)) r.bestStreak = streak;
  save();
}

// Рендер экрана рутин
function renderRoutines() {
  var list   = document.getElementById('rtn-list');
  var sumEl  = document.getElementById('rtn-summary');
  var doneEl = document.getElementById('rtn-done-list');
  var doneHdr= document.getElementById('rtn-done-hdr');
  if (!list) return;

  var routines = S.routines || [];
  var today    = new Date().toISOString().slice(0, 10);
  var todayDow = new Date().getDay();

  // Сводка
  var totalActive  = routines.filter(function(r){ return !r.paused && (!r.endDate || r.endDate >= today); }).length;
  var todayCount   = routines.filter(routineActiveToday).length;
  var totalDone    = routines.reduce(function(s, r){ return s + (r.totalDone || 0); }, 0);
  var bestStreak   = routines.reduce(function(s, r){ return Math.max(s, r.streak || 0); }, 0);

  if (sumEl) {
    sumEl.innerHTML = [
      '<div class="rtn-sum-card"><div class="rtn-sum-icon">🔄</div><div class="rtn-sum-val">' + totalActive + '</div><div class="rtn-sum-lbl">Активных</div></div>',
      '<div class="rtn-sum-card"><div class="rtn-sum-icon">📅</div><div class="rtn-sum-val">' + todayCount + '</div><div class="rtn-sum-lbl">Сегодня</div></div>',
      '<div class="rtn-sum-card"><div class="rtn-sum-icon">🔥</div><div class="rtn-sum-val">' + bestStreak + '</div><div class="rtn-sum-lbl">Лучшая серия</div></div>',
    ].join('');
  }

  if (routines.length === 0) {
    list.innerHTML = '<div class="empty-state"><span class="empty-icon">🔄</span>'
      + '<div class="empty-title">Нет активных обрядов</div>'
      + '<div class="empty-desc">Создай регулярную задачу — она будет появляться в Квестах в нужные дни</div></div>';
    if (doneEl)  doneEl.innerHTML = '';
    if (doneHdr) doneHdr.style.display = 'none';
    return;
  }

  // Активные рутины
  list.innerHTML = routines.map(function(r, idx) {
    var isToday      = routineActiveToday(r);
    var doneToday    = S.quests.some(function(q){ return q.routine_id === r.id && q.routine_date === today && q.done; });
    var pendingToday = S.quests.some(function(q){ return q.routine_id === r.id && q.routine_date === today && !q.done; });

    // Статус сегодня
    var statusHtml = '';
    if (isToday && doneToday) {
      statusHtml = '<div class="rtn-today-status done">✓ Выполнено сегодня</div>';
    } else if (isToday && pendingToday) {
      statusHtml = '<div class="rtn-today-status pending">⚔ Ожидает выполнения</div>';
    } else if (isToday) {
      statusHtml = '<div class="rtn-today-status pending">⚔ Активен сегодня</div>';
    } else {
      // Следующий день
      var nextDay = null;
      for (var i = 1; i <= 7; i++) {
        var nd = new Date();
        nd.setDate(nd.getDate() + i);
        if (r.days.indexOf(nd.getDay()) !== -1) {
          nextDay = RTN_DAY_NAMES[nd.getDay()];
          break;
        }
      }
      statusHtml = '<div class="rtn-today-status not-today">'
        + (nextDay ? '→ Следующий: ' + nextDay : 'На паузе')
        + '</div>';
    }

    // Дни недели
    var daysHtml = [0,1,2,3,4,5,6].map(function(d) {
      var inRtn   = r.days.indexOf(d) !== -1;
      var isToday2 = d === todayDow;
      var cls = 'rtn-day-pip' + (inRtn && isToday2 ? ' today' : inRtn ? ' active' : '');
      return '<div class="' + cls + '">' + RTN_DAY_NAMES[d] + '</div>';
    }).join('');

    // Прогресс-бар если есть дата окончания
    var progressHtml = '';
    if (r.endDate) {
      var start  = new Date(r.startDate + 'T00:00:00');
      var end    = new Date(r.endDate   + 'T00:00:00');
      var now2   = new Date();
      var total  = Math.max(1, Math.ceil((end - start) / 86400000));
      var passed = Math.min(total, Math.ceil((now2 - start) / 86400000));
      var pct    = Math.round(passed / total * 100);
      progressHtml = '<div class="rtn-progress-wrap">'
        + '<div class="rtn-progress-lbl"><span>Прогресс</span><span>' + passed + '/' + total + ' дн.</span></div>'
        + '<div class="rtn-progress-bar"><div class="rtn-progress-fill" style="width:' + pct + '%"></div></div>'
        + '</div>';
    }

    // Heatmap последних 14 дней
    var heatHtml = '<div class="rtn-heatmap"><span class="rtn-hm-lbl">14 дн.</span>';
    for (var i = 13; i >= 0; i--) {
      var hd  = new Date();
      hd.setDate(hd.getDate() - i);
      var hdStr    = hd.toISOString().slice(0, 10);
      var hdDow    = hd.getDay();
      var scheduled = r.days.indexOf(hdDow) !== -1;
      var isFuture  = hdStr > today;
      var done2     = r.history[hdStr];
      var cls2 = 'rtn-hm-cell';
      if (isFuture)      cls2 += ' future';
      else if (!scheduled) cls2 += ' not-scheduled';
      else if (done2)    cls2 += ' done';
      else               cls2 += ' skipped';
      heatHtml += '<div class="' + cls2 + '" title="' + hdStr + '"></div>';
    }
    heatHtml += '</div>';

    return '<div class="rtn-card cat-' + r.cat + (r.paused ? ' paused' : '') + '" style="animation-delay:' + (idx * 0.07) + 's">'
      + '<div class="rtn-card-top">'
      +   '<div>'
      +     '<div class="rtn-title">' + (CAT_ICONS[r.cat] || '') + ' ' + r.title + '</div>'
      +     (r.goal ? '<div style="font-size:11px;color:var(--text3);font-style:italic;margin-top:2px">' + r.goal + '</div>' : '')
      +   '</div>'
      +   '<div class="rtn-controls">'
      +     '<button class="rtn-pause-btn" onclick="toggleRoutinePause(\'' + r.id + '\')">'
      +       (r.paused ? '▶' : '⏸') + '</button>'
      +     '<button class="rtn-del-btn" onclick="deleteRoutine(\'' + r.id + '\')">✕</button>'
      +   '</div>'
      + '</div>'
      + '<div class="rtn-days-row">' + daysHtml + '</div>'
      + '<div class="rtn-streak-row">'
      +   '<div class="rtn-streak">'
      +     '<span class="rtn-streak-fire">🔥</span>'
      +     '<span class="rtn-streak-val">' + (r.streak || 0) + '</span>'
      +     '<span class="rtn-streak-lbl">серия</span>'
      +   '</div>'
      +   progressHtml
      + '</div>'
      + heatHtml
      + statusHtml
      + '</div>';
  }).join('');

  // Выполненные сегодня
  var doneToday2 = routines.filter(function(r) {
    return S.quests.some(function(q){ return q.routine_id === r.id && q.routine_date === today && q.done; });
  });
  if (doneToday2.length > 0) {
    if (doneHdr) doneHdr.style.display = 'flex';
    doneEl.innerHTML = doneToday2.map(function(r) {
      return '<div class="rtn-done-item">'
        + '<div class="rtn-done-check">✓</div>'
        + '<div>' + (CAT_ICONS[r.cat] || '') + ' ' + r.title
        +   ' <span style="font-size:9px;color:var(--green);letter-spacing:1px;margin-left:4px">+' + (r.streak || 1) + ' серия</span>'
        + '</div>'
        + '</div>';
    }).join('');
  } else {
    if (doneHdr) doneHdr.style.display = 'none';
    if (doneEl)  doneEl.innerHTML = '';
  }
}
```

---

## ИЗМЕНЕНИЕ 6: обновить doComplete — засчитывать streak рутин

**НАЙДИ в `doComplete`** (версия из Патча 5) строку:
```javascript
  var prevLvl = S.hero.lvl;
  gainXP(xp);
  gainGold(gold);
```

**ЗАМЕНИ НА:**
```javascript
  var prevLvl = S.hero.lvl;
  gainXP(xp);
  gainGold(gold);

  // Засчитать в streak если это квест-рутина
  if (q.routine_id && q.routine_date) {
    completeRoutineStreak(q.routine_id, q.routine_date);
  }
```

---

## ИЗМЕНЕНИЕ 7: обновить fresh() — добавить S.routines

**НАЙДИ** строку (уже обновлённую в Патче 11):
```javascript
    apiKey: '', lastCongrats: 0, chartMode: 'week',
    events: []
```

**ЗАМЕНИ НА:**
```javascript
    apiKey: '', lastCongrats: 0, chartMode: 'week',
    events: [],
    routines: []
```

---

## ИЗМЕНЕНИЕ 8: обновить load() — добавить routines

**НАЙДИ** (версия из Патча 11):
```javascript
    if (!d.events) d.events = [];
    return d;
```

**ЗАМЕНИ НА:**
```javascript
    if (!d.events)   d.events   = [];
    if (!d.routines) d.routines = [];
    return d;
```

---

## ИЗМЕНЕНИЕ 9: обновить initAll() — добавить checkRoutines и renderRoutines

**НАЙДИ:**
```javascript
function initAll() {
  refreshTopBar();
  renderQuests();
  renderJournal();
  renderProjects();
  renderChar();
  renderStats();
  renderAch();
  refreshApiBtn();
  fillProjSelect();
  initDungeon();
  checkOverdue();
  askPush();
}
```

**ЗАМЕНИ НА:**
```javascript
function initAll() {
  refreshTopBar();
  checkRoutines();      // создаём квесты-копии рутин на сегодня
  renderQuests();
  renderJournal();
  renderProjects();
  renderChar();
  renderStats();
  renderAch();
  refreshApiBtn();
  fillProjSelect();
  initDungeon();
  checkOverdue();
  askPush();
  initRtnDayBtns();    // кнопки выбора дней в модалке
}
```

---

## ИЗМЕНЕНИЕ 10: обновить sw() — добавить case routines

**НАЙДИ** (версия из Патча 11):
```javascript
    if (name === 'stats')     renderStats();
    if (name === 'character') renderChar();
    if (name === 'calendar')  renderCalendar();
```

**ЗАМЕНИ НА:**
```javascript
    if (name === 'stats')     renderStats();
    if (name === 'character') renderChar();
    if (name === 'calendar')  renderCalendar();
    if (name === 'routines')  renderRoutines();
```

---

## ИЗМЕНЕНИЕ 11: пометка рутинных квестов в renderQuests

**НАЙДИ функцию** `buildMainQuestHTML` или место где рендерится `.ctag`:

В функции `buildQCardHTML` (или аналогичной) найди строку где рендерится категория:
```javascript
'<span class="ctag">' + (CAT_ICONS[q.category]||'') + ' ' + (CAT_LABELS[q.category]||q.category).toUpperCase() + '</span>'
```

**ЗАМЕНИ НА:**
```javascript
'<span class="ctag">' + (CAT_ICONS[q.category]||'') + ' ' + (CAT_LABELS[q.category]||q.category).toUpperCase() + '</span>'
+ (q.isRoutine ? '<span style="font-family:var(--ff-title);font-size:8px;letter-spacing:1.5px;color:#ff8040;background:rgba(255,100,0,.1);border:1px solid rgba(255,100,0,.25);padding:2px 7px;border-radius:20px;margin-left:6px;vertical-align:middle">🔄 ОБРЯД</span>' : '')
```

---

## Что получится

| Элемент | Описание |
|---|---|
| Иконка 🔄 в навигации | Новая вкладка "Обряды" |
| Создание рутины | Название, категория, дни недели, сложность, срок, цель |
| Быстрый выбор дней | Кнопки: Каждый день / Пн–Пт / Сб–Вс |
| Автоматические квесты | Каждое утро при открытии — рутина появляется в Квестах |
| Бейдж "🔄 ОБРЯД" | Квесты-рутины помечены в карточке |
| Streak (серия) | Считается только за дни когда рутина была запланирована |
| Heatmap | Мини-календарь последних 14 дней: зелёный=выполнено, красный=пропущено |
| Прогресс-бар | Если задан срок — показывает сколько дней прошло |
| Пауза | Можно поставить рутину на паузу — квесты не создаются |
| Статус сегодня | "⚔ Ожидает" / "✓ Выполнено" / "→ Следующий: Пт" |
| Сводка | Активных обрядов / Сегодня / Лучшая серия |
| Данные | В localStorage, совместимо со старыми сохранениями |
