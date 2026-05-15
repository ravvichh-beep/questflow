# QuestFlow — Патч 19: Письмо наставника + Патч 20: Заметки к квестам

---
---

# ПАТЧ 19: ЕЖЕНЕДЕЛЬНОЕ ПИСЬМО НАСТАВНИКА

## Проверка совместимости
- Claude API уже используется в приложении (ключ в S.apiKey) ✓
- Новая модалка m-mentor — не конфликтует ✓
- S.lastMentorLetter — новое поле ✓
- initAll() — добавляем checkMentorLetter() ✓

---

## ИЗМЕНЕНИЕ 1: HTML модалки письма

**НАЙДИ:**
```html
<!-- DAILY EVENT -->
<div class="m-overlay" id="m-event">
```

**ДОБАВЬ ПЕРЕД НЕЙ:**
```html
<!-- MENTOR LETTER -->
<div class="m-overlay" id="m-mentor">
  <div class="modal modal-mentor">
    <button class="m-close" onclick="closeM('m-mentor')">✕</button>
    <div class="mentor-header">
      <div class="mentor-seal">⚜</div>
      <div>
        <div class="mentor-from">Письмо от Наставника</div>
        <div class="mentor-date" id="mentor-date"></div>
      </div>
    </div>
    <div class="mentor-body" id="mentor-body">
      <div class="mentor-loading" id="mentor-loading">
        <div class="mentor-loading-dot"></div>
        <div class="mentor-loading-dot"></div>
        <div class="mentor-loading-dot"></div>
        <div style="font-size:11px;color:var(--text3);margin-top:8px;font-style:italic">Наставник пишет...</div>
      </div>
      <div class="mentor-letter" id="mentor-letter" style="display:none"></div>
    </div>
    <div class="mentor-footer">
      <div class="mentor-sig">— Твой Наставник</div>
      <button class="btn btn-g" onclick="closeM('m-mentor')">Принять к сведению</button>
    </div>
  </div>
</div>
```

---

## ИЗМЕНЕНИЕ 2: CSS письма наставника

**ДОБАВИТЬ в конец CSS** (перед `</style>`):

```css
/* ===== MENTOR LETTER ===== */
.modal-mentor{
  padding:0;overflow:hidden;
  max-width:500px;
  background:rgba(8,12,20,.97);
}
.mentor-header{
  display:flex;align-items:center;gap:14px;
  padding:20px 24px;
  background:linear-gradient(135deg,rgba(212,168,74,.08),transparent);
  border-bottom:1px solid var(--bdg2);
}
.mentor-seal{
  font-size:32px;
  filter:drop-shadow(0 0 8px rgba(212,168,74,.4));
  flex-shrink:0;
}
.mentor-from{
  font-family:var(--ff-title);font-size:13px;
  color:var(--gold);letter-spacing:1px;
  margin-bottom:3px;
}
.mentor-date{
  font-family:var(--ff-body);font-style:italic;
  font-size:11px;color:var(--text3);
}
.mentor-body{
  padding:24px;
  min-height:180px;
  display:flex;align-items:center;justify-content:center;
  position:relative;
}
.mentor-loading{
  display:flex;flex-direction:column;
  align-items:center;gap:4px;
}
.mentor-loading-dot{
  width:6px;height:6px;background:var(--gold);border-radius:50%;
  display:inline-block;margin:0 3px;
  animation:mentor-dot 1.4s ease-in-out infinite;
}
.mentor-loading-dot:nth-child(2){animation-delay:.2s}
.mentor-loading-dot:nth-child(3){animation-delay:.4s}
@keyframes mentor-dot{
  0%,80%,100%{transform:scale(0.6);opacity:.4}
  40%{transform:scale(1);opacity:1}
}
.mentor-letter{
  font-family:var(--ff-body);font-style:italic;
  font-size:14px;color:var(--text2);
  line-height:1.9;
  border-left:2px solid var(--bdg2);
  padding-left:16px;
  width:100%;
  animation:fadeInUp .5s ease both;
}
.mentor-letter p{margin-bottom:12px}
.mentor-letter p:last-child{margin-bottom:0}
.mentor-footer{
  display:flex;align-items:center;justify-content:space-between;
  padding:16px 24px;
  border-top:1px solid var(--bdg2);
  background:rgba(212,168,74,.03);
}
.mentor-sig{
  font-family:var(--ff-title);font-size:11px;
  color:var(--gold);font-style:italic;letter-spacing:.5px;
  opacity:.7;
}
```

---

## ИЗМЕНЕНИЕ 3: JS — письмо наставника

**НАЙДИ** строку `// =============================================` с `// CATEGORY BOSSES`
и **ДОБАВЬ ПЕРЕД НЕЙ:**

```javascript
// =============================================
// MENTOR LETTER — ЕЖЕНЕДЕЛЬНОЕ ПИСЬМО
// =============================================

function checkMentorLetter() {
  if (!S.apiKey) return; // без ключа не работает

  var now  = new Date();
  var dow  = now.getDay(); // 0=вс, 1=пн
  if (dow !== 1) return;  // только по понедельникам

  var thisMonday = now.toISOString().slice(0, 10);
  if (S.lastMentorLetter === thisMonday) return; // уже было

  // Показываем с задержкой
  setTimeout(function() { showMentorLetter(); }, 3000);
}

function showMentorLetter() {
  var now = new Date();
  var months = ['января','февраля','марта','апреля','мая','июня',
                'июля','августа','сентября','октября','ноября','декабря'];
  var dateStr = now.getDate() + ' ' + months[now.getMonth()] + ' ' + now.getFullYear();
  document.getElementById('mentor-date').textContent = dateStr;

  document.getElementById('mentor-loading').style.display = 'flex';
  document.getElementById('mentor-letter').style.display  = 'none';

  openM('m-mentor');
  if (typeof sndModal === 'function') sndModal();

  // Собираем данные за неделю
  var h    = S.hero;
  var cats = S.stats.cats || {};
  var done = S.stats.totalDone || 0;

  // Квесты за последние 7 дней
  var weekDone = 0;
  var weekSkipped = 0;
  for (var i = 0; i < 7; i++) {
    var d = new Date(); d.setDate(d.getDate() - i);
    var key = d.toISOString().slice(0, 10);
    weekDone += (S.stats.daily[key] || 0);
  }

  // Лучшая серия рутин
  var bestStreak = 0;
  var bestRoutine = '';
  (S.routines || []).forEach(function(r) {
    if ((r.streak || 0) > bestStreak) {
      bestStreak  = r.streak;
      bestRoutine = r.title;
    }
  });

  // Просроченные квесты
  var overdueCount = (S.quests || []).filter(function(q){
    return !q.done && isOverdue(q);
  }).length;

  var prompt = 'Ты — мудрый наставник-волшебник в тёмном фэнтезийном мире в стиле Ведьмака и Dragon Age. '
    + 'Напиши личное письмо герою по имени ' + h.name + ', классу "' + h.clsName + '", уровень ' + h.lvl + '. '
    + 'Данные за прошлую неделю: '
    + 'выполнено квестов — ' + weekDone + ', '
    + 'всего выполнено за всё время — ' + done + ', '
    + (bestStreak > 0 ? 'лучшая серия обряда "' + bestRoutine + '" — ' + bestStreak + ' дней, ' : '')
    + (overdueCount > 0 ? 'просроченных квестов — ' + overdueCount + ', ' : 'просроченных нет, ')
    + 'уровень опыта: ' + h.xp + '/' + h.xpMax + '. '
    + 'Напиши 3-4 абзаца в стиле письма от мудрого наставника: '
    + '1) Обращение к герою, оценка прошлой недели — хвали за успехи или мягко критикуй за провалы. '
    + '2) Особый комментарий про серию обряда (если есть) или про просроченные квесты. '
    + '3) Наставление и мотивация на новую неделю в фэнтезийном стиле. '
    + '4) Загадочный намёк на то, что ждёт впереди. '
    + 'Стиль: мрачное фэнтези, мудрость, тепло, без пафоса. Только текст письма, без заголовков.';

  fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 600,
      messages: [{ role: 'user', content: prompt }]
    })
  })
  .then(function(r) { return r.json(); })
  .then(function(data) {
    var text = (data.content && data.content[0] && data.content[0].text) || '';
    if (!text) throw new Error('empty');

    // Разбиваем на абзацы
    var paras = text.split(/\n\n+/).filter(function(p){ return p.trim(); });
    var html  = paras.map(function(p){ return '<p>' + p.trim() + '</p>'; }).join('');

    document.getElementById('mentor-loading').style.display = 'none';
    var letterEl = document.getElementById('mentor-letter');
    letterEl.innerHTML  = html;
    letterEl.style.display = 'block';

    // Отмечаем что письмо показано
    S.lastMentorLetter = new Date().toISOString().slice(0, 10);
    save();
  })
  .catch(function() {
    // Fallback если нет ключа или ошибка
    document.getElementById('mentor-loading').style.display = 'none';
    var letterEl = document.getElementById('mentor-letter');
    letterEl.innerHTML = '<p>Дороги, ' + h.name + '.</p>'
      + '<p>Я следил за тобой из тени. Неделя была непростой, но ты продолжаешь идти — и это главное.</p>'
      + '<p>Помни: величие не в скорости, а в постоянстве. Каждый завершённый квест — камень в фундаменте легенды.</p>'
      + '<p>Тьма впереди гуще, чем кажется. Но и свет — ярче.</p>';
    letterEl.style.display = 'block';
  });
}
```

---

## ИЗМЕНЕНИЕ 4: обновить fresh() и load() для lastMentorLetter

**НАЙДИ в fresh():**
```javascript
    pendingBoss: null,
    bossKills: {}
```

**ЗАМЕНИ НА:**
```javascript
    pendingBoss: null,
    bossKills: {},
    lastMentorLetter: ''
```

**НАЙДИ в load():**
```javascript
    if (d.pendingBoss === undefined) d.pendingBoss = null;
    return d;
```

**ЗАМЕНИ НА:**
```javascript
    if (d.pendingBoss === undefined)   d.pendingBoss = null;
    if (!d.lastMentorLetter)           d.lastMentorLetter = '';
    return d;
```

---

## ИЗМЕНЕНИЕ 5: вызов checkMentorLetter в initAll

**НАЙДИ в initAll():**
```javascript
  checkDailyEvent();
```

**ЗАМЕНИ НА:**
```javascript
  checkDailyEvent();
  checkMentorLetter();
```

---
---

# ПАТЧ 20: ЗАМЕТКИ К КВЕСТАМ

## Проверка совместимости
- q.notes — новое поле, не ломает существующие квесты ✓
- buildMainQuestHTML — добавляем вкладку "Свиток" ✓
- CSS .notes-* — уникальны ✓

---

## ИЗМЕНЕНИЕ 6: JS — заметки к квестам

**НАЙДИ** строку `// =============================================` с `// MENTOR LETTER`
и **ДОБАВЬ ПЕРЕД НЕЙ:**

```javascript
// =============================================
// QUEST NOTES — ЗАМЕТКИ К КВЕСТАМ
// =============================================

var _notesOpenId = null;

function openQuestNotes(qid) {
  var q = (S.quests || []).find(function(q){ return q.id === qid; });
  if (!q) return;
  _notesOpenId = qid;

  document.getElementById('notes-quest-title').textContent = q.fantasyTitle || q.title;
  document.getElementById('notes-textarea').value = q.notes || '';

  openM('m-notes');
  if (typeof sndModal === 'function') sndModal();
  setTimeout(function() { document.getElementById('notes-textarea').focus(); }, 300);
}

function saveQuestNotes() {
  if (!_notesOpenId) return;
  var q = (S.quests || []).find(function(q){ return q.id === _notesOpenId; });
  if (!q) return;
  q.notes = document.getElementById('notes-textarea').value || '';
  save();
  closeM('m-notes');
  showToast('✦ Свиток обновлён');
}
```

---

## ИЗМЕНЕНИЕ 7: HTML модалки заметок

**НАЙДИ:**
```html
<!-- MENTOR LETTER -->
<div class="m-overlay" id="m-mentor">
```

**ДОБАВЬ ПЕРЕД НЕЙ:**
```html
<!-- QUEST NOTES -->
<div class="m-overlay" id="m-notes">
  <div class="modal">
    <button class="m-close" onclick="closeM('m-notes')">✕</button>
    <div class="m-title">📜 Свиток квеста</div>
    <div class="notes-quest-name" id="notes-quest-title"></div>
    <div class="fg">
      <label class="flbl">Твои заметки</label>
      <textarea class="fi notes-textarea" id="notes-textarea"
        placeholder="Пиши мысли, планы, прогресс по квесту..."
        style="min-height:160px;resize:vertical"></textarea>
    </div>
    <div class="m-actions">
      <button class="btn btn-g" onclick="saveQuestNotes()">💾 Сохранить свиток</button>
      <button class="btn btn-o" onclick="closeM('m-notes')">Закрыть</button>
    </div>
  </div>
</div>
```

---

## ИЗМЕНЕНИЕ 8: CSS заметок

**ДОБАВИТЬ в конец CSS** (перед `</style>`):

```css
/* ===== QUEST NOTES ===== */
.notes-quest-name{
  font-family:var(--ff-title);font-size:13px;
  color:var(--gold);font-style:italic;
  margin-bottom:14px;letter-spacing:.5px;
  padding-bottom:10px;
  border-bottom:1px solid var(--bdg2);
}
.notes-textarea{
  font-family:var(--ff-body);
  font-style:normal;
  line-height:1.7;
}
.notes-indicator{
  width:8px;height:8px;border-radius:50%;
  background:var(--sap);
  box-shadow:0 0 4px rgba(64,136,216,.5);
  display:inline-block;margin-left:6px;
  vertical-align:middle;
}
```

---

## ИЗМЕНЕНИЕ 9: кнопка "Свиток" в карточке квеста

**НАЙДИ в HTML карточки или в функции buildMainQuestHTML** строку с кнопками:
```javascript
'<button class="btn btn-o" onclick="postponeQ(\'' + q.id + '\')">⏸ Отложить</button>'
```

**ДОБАВЬ ПОСЛЕ:**
```javascript
+ '<button class="btn btn-o" onclick="openQuestNotes(\'' + q.id + '\')">'
+ '📜 Свиток'
+ (q.notes ? '<span class="notes-indicator"></span>' : '')
+ '</button>'
```

---

## Итог обоих патчей

### Патч 19 — Письмо наставника
| Элемент | Описание |
|---|---|
| Когда | Каждый понедельник при открытии |
| Требует | Claude API ключ в настройках |
| Содержание | AI анализирует прошлую неделю: квесты, серии, просрочки |
| Стиль | Мрачное фэнтези — тёплый мудрый наставник |
| Fallback | Если нет ключа — показывает заготовленный текст |
| Визуал | Модалка с печатью ⚜, анимация "пишет..." |

### Патч 20 — Заметки
| Элемент | Описание |
|---|---|
| Доступ | Кнопка "📜 Свиток" на каждой карточке квеста |
| Хранение | q.notes в localStorage |
| Индикатор | Синяя точка на кнопке если есть заметки |
| Формат | Свободный текст, textarea с resize |
