# QuestFlow — Патч 11: Календарь (Летопись Времён)

## Проверка совместимости
- Новый view #view-calendar — не конфликтует ни с одним патчем ✓
- Новый .ni в sidenav — не конфликтует с Патчем 1 (там только стили) ✓
- S.events — новое поле в fresh(), load() обрабатывает отсутствие поля через || [] ✓
- sw() из Патча 5 — добавляем case 'calendar', совместимо ✓
- CSS классы .cal-* — уникальны, нет пересечений ✓
- Модалка m-cal — новая, не конфликтует с существующими ✓
- Патч 9 (звуки): sndModal() и sndSelect() — вызываем в нужных местах ✓

---

## ИЗМЕНЕНИЕ 1: добавить иконку календаря в sidenav

**НАЙДИ в HTML:**
```html
  <div class="ni" id="ni-projects" onclick="sw('projects',this)">🗺<span class="ni-tip">Проекты</span></div>
```

**ЗАМЕНИ НА:**
```html
  <div class="ni" id="ni-projects" onclick="sw('projects',this)">🗺<span class="ni-tip">Проекты</span></div>
  <div class="ni" id="ni-calendar" onclick="sw('calendar',this)">📅<span class="ni-tip">Летопись</span></div>
```

---

## ИЗМЕНЕНИЕ 2: добавить HTML вьюхи календаря

**НАЙДИ в HTML:**
```html
<!-- CHARACTER -->
<div class="view" id="view-character">
```

**ДОБАВЬ ПЕРЕД НЕЙ:**
```html
<!-- CALENDAR -->
<div class="view" id="view-calendar">
  <div class="pad">

    <!-- Заголовок с навигацией по месяцу -->
    <div class="cal-header">
      <button class="cal-nav-btn" id="cal-prev" onclick="calNav(-1)">&#8249;</button>
      <div class="cal-month-wrap">
        <div class="cal-month-name" id="cal-month-name">Май 2026</div>
        <div class="cal-month-sub" id="cal-month-sub">Луна Странника</div>
      </div>
      <button class="cal-nav-btn" id="cal-next" onclick="calNav(1)">&#8250;</button>
      <button class="btn btn-g" onclick="openCalAdd()" style="margin-left:12px;padding:7px 14px;font-size:9px">+ Событие</button>
    </div>

    <!-- Дни недели -->
    <div class="cal-weekdays">
      <div>Пн</div><div>Вт</div><div>Ср</div><div>Чт</div><div>Пт</div>
      <div style="color:var(--gold)">Сб</div><div style="color:var(--gold)">Вс</div>
    </div>

    <!-- Сетка дней -->
    <div class="cal-grid" id="cal-grid"></div>

    <!-- Список событий на выбранный день -->
    <div class="cal-day-panel" id="cal-day-panel" style="display:none">
      <div class="cal-day-title" id="cal-day-title"></div>
      <div class="cal-events-list" id="cal-events-list"></div>
    </div>

    <!-- Ближайшие события (следующие 7 дней) -->
    <div class="shdr" style="margin-top:20px" id="cal-upcoming-hdr">Ближайшие события</div>
    <div id="cal-upcoming"></div>

  </div>
</div>
```

---

## ИЗМЕНЕНИЕ 3: добавить модалку создания события

**НАЙДИ в HTML:**
```html
<div class="toast" id="toast"></div>
```

**ДОБАВЬ ПЕРЕД НЕЙ:**
```html
<!-- CALENDAR — добавить событие -->
<div class="m-overlay" id="m-cal">
  <div class="modal">
    <button class="m-close" onclick="closeM('m-cal')">✕</button>
    <div class="m-title">📅 Новое событие</div>

    <div class="fg">
      <label class="flbl">Название события</label>
      <input class="fi" id="cal-title" type="text" placeholder="Что произойдёт?" maxlength="60">
    </div>

    <div class="frow">
      <div class="fg">
        <label class="flbl">Дата</label>
        <input class="fi" id="cal-date" type="date">
      </div>
      <div class="fg">
        <label class="flbl">Время</label>
        <input class="fi" id="cal-time" type="time" value="10:00">
      </div>
    </div>

    <div class="fg">
      <label class="flbl">Категория</label>
      <select class="fsel" id="cal-cat">
        <option value="quest">⚔ Квестовое задание</option>
        <option value="meeting">🤝 Совет гильдии</option>
        <option value="deadline">💀 Крайний срок</option>
        <option value="personal">✨ Личное</option>
        <option value="health">🌿 Здоровье</option>
        <option value="study">📚 Учёба</option>
      </select>
    </div>

    <div class="fg">
      <label class="flbl">Описание (необязательно)</label>
      <textarea class="fi" id="cal-desc" placeholder="Детали события..." style="min-height:56px"></textarea>
    </div>

    <div class="fg">
      <label class="flbl">Напоминание</label>
      <select class="fsel" id="cal-remind">
        <option value="0">Без напоминания</option>
        <option value="15">За 15 минут</option>
        <option value="60">За 1 час</option>
        <option value="1440">За 1 день</option>
      </select>
    </div>

    <!-- Связать с квестом -->
    <div class="fg">
      <label class="flbl">Связать с квестом (необязательно)</label>
      <select class="fsel" id="cal-quest-link">
        <option value="">— Без привязки —</option>
      </select>
    </div>

    <div class="m-actions">
      <button class="btn btn-g" onclick="addCalEvent()">✦ Записать в летопись</button>
      <button class="btn btn-o" onclick="closeM('m-cal')">Отмена</button>
    </div>
  </div>
</div>
```

---

## ИЗМЕНЕНИЕ 4: CSS — стили календаря

**ДОБАВИТЬ в конец CSS** (перед `</style>`):

```css
/* ===== CALENDAR ===== */

/* Заголовок */
.cal-header{
  display:flex;align-items:center;gap:0;margin-bottom:18px;
}
.cal-nav-btn{
  width:34px;height:34px;
  background:rgba(255,255,255,.03);
  border:1px solid var(--bd);
  border-radius:var(--r);
  color:var(--text2);font-size:20px;
  cursor:pointer;display:flex;align-items:center;justify-content:center;
  transition:all .18s;flex-shrink:0;
  font-family:var(--ff-title);line-height:1;
}
.cal-nav-btn:hover{
  color:var(--gold);
  border-color:var(--bdg);
  background:var(--gold-glow);
}
.cal-month-wrap{
  flex:1;text-align:center;
}
.cal-month-name{
  font-family:var(--ff-title);font-size:18px;
  color:var(--gold);letter-spacing:1.5px;
  text-shadow:0 0 16px rgba(212,168,74,.2);
}
.cal-month-sub{
  font-family:var(--ff-body);font-style:italic;
  font-size:11px;color:var(--text3);margin-top:2px;
}

/* Дни недели */
.cal-weekdays{
  display:grid;grid-template-columns:repeat(7,1fr);
  gap:4px;margin-bottom:6px;
}
.cal-weekdays div{
  font-family:var(--ff-title);font-size:8px;
  letter-spacing:2px;color:var(--text3);
  text-align:center;padding:4px 0;
  text-transform:uppercase;
}

/* Сетка дней */
.cal-grid{
  display:grid;grid-template-columns:repeat(7,1fr);
  gap:4px;margin-bottom:20px;
}
.cal-day{
  aspect-ratio:1;
  border-radius:var(--r);
  display:flex;flex-direction:column;align-items:center;justify-content:center;
  cursor:pointer;position:relative;
  border:1px solid transparent;
  transition:all .18s cubic-bezier(.4,0,.2,1);
  font-family:var(--ff-title);
  padding:2px;
}
.cal-day:hover{
  background:rgba(255,255,255,.04);
  border-color:var(--bd);
}
.cal-day.other-month{opacity:.22}
.cal-day.today{
  border-color:rgba(212,168,74,.4);
  background:rgba(212,168,74,.07);
  box-shadow:0 0 12px rgba(212,168,74,.1);
}
.cal-day.today .cal-day-num{
  color:var(--gold);
  text-shadow:0 0 8px rgba(212,168,74,.4);
}
.cal-day.selected{
  border-color:rgba(64,136,216,.5);
  background:rgba(64,136,216,.1);
}
.cal-day.has-events::after{
  content:'';
  position:absolute;bottom:3px;
  width:5px;height:5px;border-radius:50%;
  background:var(--sap);
  box-shadow:0 0 4px rgba(64,136,216,.5);
}
.cal-day.has-deadline::after{
  background:var(--red2);
  box-shadow:0 0 4px rgba(240,64,64,.5);
}
.cal-day-num{
  font-size:12px;color:var(--text2);line-height:1;
}
.cal-day.weekend .cal-day-num{color:var(--gold2);opacity:.7}

/* Панель дня */
.cal-day-panel{
  background:var(--glass);
  border:1px solid var(--bdm);
  border-radius:var(--r2);
  padding:16px;margin-bottom:20px;
  box-shadow:var(--shadow-card);
  animation:fadeInUp .28s cubic-bezier(.34,1.2,.64,1) both;
  position:relative;
}
.cal-day-panel::before{
  content:'';position:absolute;top:0;left:0;right:0;height:1px;
  background:linear-gradient(90deg,transparent,var(--sap),transparent);
  opacity:.5;border-radius:var(--r2) var(--r2) 0 0;
}
.cal-day-title{
  font-family:var(--ff-title);font-size:13px;
  color:var(--gold);margin-bottom:12px;letter-spacing:1px;
}

/* Список событий в панели дня */
.cal-events-list{display:flex;flex-direction:column;gap:8px}
.cal-event-item{
  display:flex;align-items:flex-start;gap:10px;
  padding:10px 14px;
  background:rgba(255,255,255,.02);
  border:1px solid var(--bd);
  border-radius:var(--r);
  position:relative;overflow:hidden;
  transition:all .2s;
}
.cal-event-item:hover{
  border-color:var(--bdm);
  background:rgba(255,255,255,.04);
}
.cal-event-item::before{
  content:'';position:absolute;left:0;top:0;bottom:0;width:3px;
  border-radius:0 2px 2px 0;
}
.cal-event-item.cat-quest::before{background:var(--sap)}
.cal-event-item.cat-meeting::before{background:var(--gold)}
.cal-event-item.cat-deadline::before{background:var(--red2)}
.cal-event-item.cat-personal::before{background:var(--purple)}
.cal-event-item.cat-health::before{background:var(--green)}
.cal-event-item.cat-study::before{background:#60a0e0}

.cal-event-time{
  font-family:var(--ff-title);font-size:10px;
  color:var(--text3);letter-spacing:1px;
  white-space:nowrap;flex-shrink:0;margin-top:1px;
}
.cal-event-body{flex:1}
.cal-event-title{
  font-family:var(--ff-title);font-size:12px;
  color:var(--text);margin-bottom:2px;letter-spacing:.3px;
}
.cal-event-desc{
  font-size:11px;color:var(--text3);
  font-style:italic;line-height:1.4;
}
.cal-event-cat{
  font-family:var(--ff-title);font-size:8px;letter-spacing:1.5px;
  color:var(--text3);margin-top:4px;text-transform:uppercase;
}
.cal-event-del{
  background:transparent;border:none;
  color:var(--text3);cursor:pointer;font-size:14px;
  padding:2px 4px;border-radius:var(--r);
  transition:all .15s;flex-shrink:0;
}
.cal-event-del:hover{color:var(--red2);background:rgba(240,64,64,.08)}

/* Ближайшие события */
.cal-upcoming-item{
  display:flex;align-items:center;gap:12px;
  padding:12px 16px;
  background:var(--glass);
  border:1px solid var(--bd);
  border-radius:var(--r);
  margin-bottom:8px;
  transition:all .2s cubic-bezier(.4,0,.2,1);
  position:relative;overflow:hidden;
  animation:fadeInUp .35s cubic-bezier(.34,1.2,.64,1) both;
}
.cal-upcoming-item::before{
  content:'';position:absolute;left:0;top:0;bottom:0;width:3px;
  border-radius:0 2px 2px 0;
}
.cal-upcoming-item.cat-quest::before{background:var(--sap)}
.cal-upcoming-item.cat-meeting::before{background:var(--gold)}
.cal-upcoming-item.cat-deadline::before{background:var(--red2);animation:overdue-pulse 2s ease infinite}
.cal-upcoming-item.cat-personal::before{background:var(--purple)}
.cal-upcoming-item.cat-health::before{background:var(--green)}
.cal-upcoming-item.cat-study::before{background:#60a0e0}
.cal-upcoming-item:hover{
  border-color:var(--bdm);
  transform:translateX(3px);
}

.cal-upcoming-date{
  text-align:center;flex-shrink:0;width:40px;
}
.cal-upcoming-day{
  font-family:var(--ff-title);font-size:18px;
  color:var(--text);line-height:1;
}
.cal-upcoming-weekday{
  font-family:var(--ff-title);font-size:8px;
  letter-spacing:1.5px;color:var(--text3);
  text-transform:uppercase;margin-top:2px;
}
.cal-upcoming-divider{
  width:1px;height:36px;
  background:linear-gradient(180deg,transparent,var(--bdm),transparent);
  flex-shrink:0;
}
.cal-upcoming-body{flex:1}
.cal-upcoming-title{
  font-family:var(--ff-title);font-size:13px;
  color:var(--text);margin-bottom:3px;letter-spacing:.3px;
}
.cal-upcoming-meta{
  display:flex;gap:10px;font-family:var(--ff-title);font-size:9px;color:var(--text3);
  flex-wrap:wrap;align-items:center;
}
.cal-upcoming-time{color:var(--sky);letter-spacing:.5px}
.cal-upcoming-badge{
  padding:2px 7px;border-radius:20px;font-size:8px;letter-spacing:1px;
  text-transform:uppercase;
}
.cal-upcoming-badge.cat-quest{color:var(--sky);background:rgba(64,136,216,.1);border:1px solid rgba(64,136,216,.2)}
.cal-upcoming-badge.cat-meeting{color:var(--gold);background:rgba(212,168,74,.1);border:1px solid rgba(212,168,74,.2)}
.cal-upcoming-badge.cat-deadline{color:var(--red2);background:rgba(240,64,64,.1);border:1px solid rgba(240,64,64,.2)}
.cal-upcoming-badge.cat-personal{color:#b080ff;background:rgba(120,56,176,.1);border:1px solid rgba(120,56,176,.2)}
.cal-upcoming-badge.cat-health{color:var(--green);background:rgba(40,176,96,.1);border:1px solid rgba(40,176,96,.2)}
.cal-upcoming-badge.cat-study{color:#60a0e0;background:rgba(96,160,224,.1);border:1px solid rgba(96,160,224,.2)}

/* "Сегодня" бейдж в ближайших событиях */
.cal-today-badge{
  font-family:var(--ff-title);font-size:8px;letter-spacing:1.5px;
  color:var(--gold);background:rgba(212,168,74,.1);
  border:1px solid rgba(212,168,74,.25);
  padding:2px 7px;border-radius:20px;text-transform:uppercase;
  box-shadow:0 0 8px rgba(212,168,74,.1);
}

/* Нет событий */
.cal-no-events{
  text-align:center;padding:24px 16px;
  font-family:var(--ff-body);font-style:italic;
  font-size:13px;color:var(--text3);
}
```

---

## ИЗМЕНЕНИЕ 5: JS — RPG-названия месяцев и вся логика календаря

**НАЙДИ** строку `// =============================================` с блоком `// OVERDUE / PUSH` и **ДОБАВЬ ПЕРЕД НЕЙ** весь блок:

```javascript
// =============================================
// CALENDAR — ЛЕТОПИСЬ ВРЕМЁН
// =============================================

// RPG-названия месяцев
var CAL_MONTH_NAMES = [
  'Январь','Февраль','Март','Апрель','Май','Июнь',
  'Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'
];
var CAL_MONTH_RPG = [
  'Луна Льда','Луна Метели','Луна Пробуждения','Луна Цветов',
  'Луна Странника','Луна Огня','Луна Зноя','Луна Жатвы',
  'Луна Тумана','Луна Теней','Луна Ветра','Луна Тьмы'
];
var CAL_WEEKDAYS = ['Пн','Вт','Ср','Чт','Пт','Сб','Вс'];
var CAL_CAT_LABELS = {
  quest:'⚔ Квестовое задание', meeting:'🤝 Совет гильдии',
  deadline:'💀 Крайний срок', personal:'✨ Личное',
  health:'🌿 Здоровье', study:'📚 Учёба'
};

// Текущий отображаемый месяц
var calYear  = new Date().getFullYear();
var calMonth = new Date().getMonth(); // 0-11
var calSelectedDay = null; // 'YYYY-MM-DD'

// Навигация по месяцам
function calNav(dir) {
  calMonth += dir;
  if (calMonth > 11) { calMonth = 0;  calYear++; }
  if (calMonth < 0)  { calMonth = 11; calYear--; }
  renderCalendar();
}

// Открыть форму добавления события
function openCalAdd(dateStr) {
  var input = document.getElementById('cal-date');
  if (input) {
    input.value = dateStr || calSelectedDay || new Date().toISOString().slice(0,10);
  }
  // Заполнить список квестов
  var sel = document.getElementById('cal-quest-link');
  if (sel) {
    sel.innerHTML = '<option value="">— Без привязки —</option>';
    (S.quests || []).filter(function(q){ return !q.done; }).forEach(function(q) {
      var opt = document.createElement('option');
      opt.value = q.id;
      opt.textContent = (q.fantasyTitle || q.title || '').slice(0, 40);
      sel.appendChild(opt);
    });
  }
  openM('m-cal');
}

// Добавить событие
function addCalEvent() {
  var title = (document.getElementById('cal-title').value || '').trim();
  var date  = document.getElementById('cal-date').value;
  var time  = document.getElementById('cal-time').value || '00:00';
  var cat   = document.getElementById('cal-cat').value;
  var desc  = (document.getElementById('cal-desc').value || '').trim();
  var remind = parseInt(document.getElementById('cal-remind').value) || 0;
  var questId = document.getElementById('cal-quest-link').value || '';

  if (!title) { showToast('Введи название события'); if(typeof sndError==='function') sndError(); return; }
  if (!date)  { showToast('Выбери дату'); if(typeof sndError==='function') sndError(); return; }

  if (!S.events) S.events = [];

  var evt = {
    id:      Date.now(),
    title:   title,
    date:    date,
    time:    time,
    cat:     cat,
    desc:    desc,
    remind:  remind,
    questId: questId,
    created: new Date().toISOString()
  };

  S.events.push(evt);
  // Сортируем по дате+времени
  S.events.sort(function(a,b) {
    return (a.date + a.time).localeCompare(b.date + b.time);
  });

  save();
  closeM('m-cal');

  // Очищаем поля
  document.getElementById('cal-title').value = '';
  document.getElementById('cal-desc').value  = '';

  // Переходим к дате события и показываем
  calYear  = parseInt(date.slice(0,4));
  calMonth = parseInt(date.slice(5,7)) - 1;
  calSelectedDay = date;

  renderCalendar();
  showToast('✦ Событие записано в летопись!');
  if (typeof sndQuestComplete === 'function') sndQuestComplete();
}

// Удалить событие
function delCalEvent(id) {
  if (!S.events) return;
  S.events = S.events.filter(function(e){ return e.id !== id; });
  save();
  renderCalendar();
  if (calSelectedDay) showDayPanel(calSelectedDay);
}

// Показать панель дня
function showDayPanel(dateStr) {
  calSelectedDay = dateStr;
  var panel = document.getElementById('cal-day-panel');
  var title = document.getElementById('cal-day-title');
  var list  = document.getElementById('cal-events-list');
  if (!panel || !title || !list) return;

  var d = new Date(dateStr + 'T00:00:00');
  var dayNames = ['Воскресенье','Понедельник','Вторник','Среда','Четверг','Пятница','Суббота'];
  var isToday  = dateStr === new Date().toISOString().slice(0,10);

  title.textContent = dayNames[d.getDay()] + ', '
    + d.getDate() + ' ' + CAL_MONTH_NAMES[d.getMonth()].toLowerCase()
    + (isToday ? ' — Сегодня' : '');

  var events = (S.events || []).filter(function(e){ return e.date === dateStr; });

  if (events.length === 0) {
    list.innerHTML = '<div class="cal-no-events">Нет событий в этот день<br><span style="font-size:11px;opacity:.6">Нажми + Событие чтобы добавить</span></div>';
  } else {
    list.innerHTML = events.map(function(e) {
      return '<div class="cal-event-item cat-' + e.cat + '">'
        + '<div class="cal-event-time">' + e.time + '</div>'
        + '<div class="cal-event-body">'
        +   '<div class="cal-event-title">' + e.title + '</div>'
        +   (e.desc ? '<div class="cal-event-desc">' + e.desc + '</div>' : '')
        +   '<div class="cal-event-cat">' + (CAL_CAT_LABELS[e.cat] || e.cat) + '</div>'
        + '</div>'
        + '<button class="cal-event-del" onclick="delCalEvent(' + e.id + ')" title="Удалить">✕</button>'
        + '</div>';
    }).join('');
  }

  panel.style.display = 'block';

  // Обновляем выделение в сетке
  document.querySelectorAll('.cal-day').forEach(function(el) {
    el.classList.toggle('selected', el.dataset.date === dateStr);
  });
}

// Главный рендер календаря
function renderCalendar() {
  var nameEl = document.getElementById('cal-month-name');
  var subEl  = document.getElementById('cal-month-sub');
  var grid   = document.getElementById('cal-grid');
  if (!nameEl || !grid) return;

  nameEl.textContent = CAL_MONTH_NAMES[calMonth] + ' ' + calYear;
  subEl.textContent  = CAL_MONTH_RPG[calMonth];

  var today    = new Date().toISOString().slice(0,10);
  var events   = S.events || [];

  // Первый день месяца (0=вс, 1=пн...)
  var firstDay = new Date(calYear, calMonth, 1).getDay();
  // Сдвиг: у нас неделя с понедельника
  var offset   = (firstDay === 0) ? 6 : firstDay - 1;
  var daysInMonth     = new Date(calYear, calMonth + 1, 0).getDate();
  var daysInPrevMonth = new Date(calYear, calMonth, 0).getDate();

  var cells = [];

  // Дни предыдущего месяца
  for (var i = offset - 1; i >= 0; i--) {
    cells.push({ day: daysInPrevMonth - i, cur: false });
  }
  // Дни текущего месяца
  for (var d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, cur: true });
  }
  // Дни следующего месяца (до 42 ячеек = 6 недель)
  var nextDay = 1;
  while (cells.length < 42) {
    cells.push({ day: nextDay++, cur: false });
  }

  grid.innerHTML = cells.map(function(c, idx) {
    if (!c.cur) {
      return '<div class="cal-day other-month"><span class="cal-day-num">' + c.day + '</span></div>';
    }

    var mm    = String(calMonth + 1).padStart(2, '0');
    var dd    = String(c.day).padStart(2, '0');
    var dStr  = calYear + '-' + mm + '-' + dd;

    var dayEvents   = events.filter(function(e){ return e.date === dStr; });
    var hasDeadline = dayEvents.some(function(e){ return e.cat === 'deadline'; });
    var hasEvents   = dayEvents.length > 0;

    var isToday    = dStr === today;
    var isSelected = dStr === calSelectedDay;
    var isWeekend  = (idx % 7 === 5 || idx % 7 === 6);

    var cls = 'cal-day';
    if (isToday)    cls += ' today';
    if (isSelected) cls += ' selected';
    if (isWeekend)  cls += ' weekend';
    if (hasDeadline) cls += ' has-deadline';
    else if (hasEvents) cls += ' has-events';

    return '<div class="' + cls + '" data-date="' + dStr + '" onclick="showDayPanel(\'' + dStr + '\')">'
      + '<span class="cal-day-num">' + c.day + '</span>'
      + (hasEvents ? '<span style="font-size:8px;color:var(--text3);margin-top:1px">' + dayEvents.length + '</span>' : '')
      + '</div>';
  }).join('');

  // Обновляем ближайшие события
  renderUpcoming();

  // Если был выбран день — показываем его
  if (calSelectedDay) {
    var cur = (parseInt(calSelectedDay.slice(0,4)) === calYear &&
               parseInt(calSelectedDay.slice(5,7)) - 1 === calMonth);
    if (cur) showDayPanel(calSelectedDay);
    else {
      document.getElementById('cal-day-panel').style.display = 'none';
      calSelectedDay = null;
    }
  }
}

// Ближайшие 7 дней
function renderUpcoming() {
  var el = document.getElementById('cal-upcoming');
  var hdr = document.getElementById('cal-upcoming-hdr');
  if (!el) return;

  var today = new Date();
  today.setHours(0,0,0,0);

  var upcoming = (S.events || []).filter(function(e) {
    var d = new Date(e.date + 'T00:00:00');
    var diff = Math.floor((d - today) / 86400000);
    return diff >= 0 && diff <= 30;
  });

  upcoming.sort(function(a,b){
    return (a.date+a.time).localeCompare(b.date+b.time);
  });

  if (upcoming.length === 0) {
    if (hdr) hdr.style.display = 'none';
    el.innerHTML = '';
    return;
  }
  if (hdr) hdr.style.display = 'flex';

  var todayStr = today.toISOString().slice(0,10);
  var weekdays = ['Вс','Пн','Вт','Ср','Чт','Пт','Сб'];

  el.innerHTML = upcoming.slice(0, 8).map(function(e, i) {
    var d = new Date(e.date + 'T00:00:00');
    var isToday = e.date === todayStr;
    var diff = Math.floor((d - today) / 86400000);
    var diffLabel = isToday ? 'Сегодня' :
                   diff === 1 ? 'Завтра' :
                   'Через ' + diff + ' дн.';

    return '<div class="cal-upcoming-item cat-' + e.cat + '" style="animation-delay:' + (i * 0.06) + 's"'
      + ' onclick="calNav(0);calYear=' + d.getFullYear() + ';calMonth=' + d.getMonth() + ';renderCalendar();showDayPanel(\'' + e.date + '\')">'
      + '<div class="cal-upcoming-date">'
      +   '<div class="cal-upcoming-day">' + d.getDate() + '</div>'
      +   '<div class="cal-upcoming-weekday">' + weekdays[d.getDay()] + '</div>'
      + '</div>'
      + '<div class="cal-upcoming-divider"></div>'
      + '<div class="cal-upcoming-body">'
      +   '<div class="cal-upcoming-title">' + e.title + '</div>'
      +   '<div class="cal-upcoming-meta">'
      +     '<span class="cal-upcoming-time">⏰ ' + e.time + '</span>'
      +     '<span class="cal-upcoming-badge cat-' + e.cat + '">' + (CAL_CAT_LABELS[e.cat] || e.cat) + '</span>'
      +     (isToday ? '<span class="cal-today-badge">Сегодня</span>' : '<span style="color:var(--text3);font-size:9px">' + diffLabel + '</span>')
      +   '</div>'
      + '</div>'
      + '</div>';
  }).join('');
}
```

---

## ИЗМЕНЕНИЕ 6: обновить fresh() — добавить S.events

**НАЙДИ:**
```javascript
function fresh() {
  return {
    onboarded: false,
    hero: { ... },
    quests: [],
    journal: [],
    projects: [],
    achievements: {},
    stats: { ... },
    dungeonIdx: 0, dungeonEHP: 0, dungeonEHPMax: 0, dungeonOn: true, dungeonKills: 0, killedBoss: false,
    apiKey: '', lastCongrats: 0, chartMode: 'week'
  };
}
```

**ЗАМЕНИ** строку `apiKey: '', lastCongrats: 0, chartMode: 'week'` НА:
```javascript
    apiKey: '', lastCongrats: 0, chartMode: 'week',
    events: []
```

---

## ИЗМЕНЕНИЕ 7: обновить sw() — добавить calendar

**НАЙДИ в sw()** (версия из Патча 5):
```javascript
    if (name === 'stats') renderStats();
    if (name === 'character') renderChar();
```

**ЗАМЕНИ НА:**
```javascript
    if (name === 'stats')     renderStats();
    if (name === 'character') renderChar();
    if (name === 'calendar')  renderCalendar();
```

---

## ИЗМЕНЕНИЕ 8: инициализировать S.events при загрузке

**НАЙДИ функцию** `load()`:
```javascript
function load() {
  try {
    var d = JSON.parse(localStorage.getItem(SAVE_KEY));
    return d || fresh();
  } catch(e) { return fresh(); }
}
```

**ЗАМЕНИ НА:**
```javascript
function load() {
  try {
    var d = JSON.parse(localStorage.getItem(SAVE_KEY));
    if (!d) return fresh();
    // Добавляем новые поля для старых сохранений
    if (!d.events) d.events = [];
    return d;
  } catch(e) { return fresh(); }
}
```

---

## Что получится

| Элемент | Описание |
|---|---|
| Иконка 📅 в навигации | Новая вкладка "Летопись" |
| Сетка-календарь | Текущий месяц, навигация по стрелкам |
| Сегодня | Выделен золотым с glow |
| Дни с событиями | Синяя точка внизу |
| Дни с дедлайном | Красная точка + пульсация |
| RPG-названия месяцев | "Луна Странника", "Луна Теней" и т.д. |
| Клик по дню | Открывает панель с событиями дня |
| Удаление события | Кнопка ✕ в каждом событии |
| Ближайшие события | Список следующих 30 дней с таймером |
| "Сегодня" / "Завтра" | Умный лейбл вместо даты |
| Форма добавления | 6 категорий, время, описание, напоминание |
| Связь с квестом | Можно привязать событие к существующему квесту |
| Категории | ⚔ Квестовое · 🤝 Совет гильдии · 💀 Дедлайн · ✨ Личное · 🌿 Здоровье · 📚 Учёба |
| Цветные полоски | Каждая категория имеет свой цвет на карточке |
| Данные | Хранятся в localStorage вместе с остальными данными |
| Совместимость с PWA | Полная — офлайн, никаких внешних зависимостей |
