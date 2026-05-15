# QuestFlow — Патч 17: Случайные события (D&D)

## Проверка совместимости
- Новая модалка m-event — не конфликтует ✓
- S.lastEvent — новое поле в load() ✓
- initAll() — добавляем checkDailyEvent() ✓
- gainXP/gainGold из Патча 5 — вызываем напрямую ✓
- Звуки из Патча 9 — используем sndModal, sndSelect ✓
- CSS .ev-* — уникальны ✓

---

## ИЗМЕНЕНИЕ 1: HTML модалки события

**НАЙДИ:**
```html
<!-- WEATHER CANVAS -->
<canvas id="wx-canvas"
```

**ДОБАВЬ ПЕРЕД НЕЙ:**
```html
<!-- DAILY EVENT -->
<div class="m-overlay" id="m-event">
  <div class="modal modal-event">
    <div class="ev-header">
      <div class="ev-type-badge" id="ev-type-badge">Случайное событие</div>
      <div class="ev-title" id="ev-title">Таинственная встреча</div>
    </div>
    <div class="ev-illustration" id="ev-illustration"></div>
    <div class="ev-desc" id="ev-desc"></div>
    <div class="ev-choices" id="ev-choices"></div>
    <div class="ev-result" id="ev-result" style="display:none"></div>
  </div>
</div>
```

---

## ИЗМЕНЕНИЕ 2: CSS событий

**ДОБАВИТЬ в конец CSS** (перед `</style>`):

```css
/* ===== DAILY EVENTS ===== */
.modal-event{
  padding:0;overflow:hidden;
  max-width:480px;
}
.ev-header{
  padding:20px 24px 16px;
  background:linear-gradient(135deg,rgba(8,15,26,.95),rgba(12,22,36,.95));
  border-bottom:1px solid var(--bd);
  position:relative;
}
.ev-header::before{
  content:'';position:absolute;top:0;left:0;right:0;height:2px;
  background:linear-gradient(90deg,transparent,var(--gold),transparent);
}
.ev-type-badge{
  font-family:var(--ff-title);font-size:8px;
  letter-spacing:3px;color:var(--text3);
  text-transform:uppercase;margin-bottom:8px;
}
.ev-title{
  font-family:var(--ff-title);font-size:20px;
  color:var(--gold);letter-spacing:1px;
  text-shadow:0 0 16px rgba(212,168,74,.2);
  line-height:1.25;
}

.ev-illustration{
  height:130px;
  background:linear-gradient(90deg,#080f1a 25%,#0c1624 50%,#080f1a 75%);
  background-size:400px 100%;
  animation:shimmer 1.8s infinite;
  position:relative;overflow:hidden;
  flex-shrink:0;
}
.ev-illustration img{
  width:100%;height:100%;object-fit:cover;
  filter:brightness(.7) saturate(1.1);
  opacity:0;transition:opacity .8s ease;
}
.ev-illustration-overlay{
  position:absolute;inset:0;
  background:linear-gradient(to bottom,rgba(4,9,15,.1),rgba(4,9,15,.6));
}

.ev-desc{
  font-family:var(--ff-body);font-style:italic;
  font-size:14px;color:var(--text2);
  line-height:1.8;padding:18px 24px;
  border-bottom:1px solid var(--bd);
}

.ev-choices{
  padding:16px 24px;
  display:flex;flex-direction:column;gap:10px;
}
.ev-choice{
  background:rgba(255,255,255,.03);
  border:1px solid var(--bd);
  border-radius:var(--r);
  padding:12px 16px;
  cursor:pointer;
  transition:all .2s cubic-bezier(.4,0,.2,1);
  position:relative;overflow:hidden;
}
.ev-choice::before{
  content:'';position:absolute;left:0;top:0;bottom:0;width:3px;
  border-radius:0 2px 2px 0;
  background:var(--sap);opacity:0;transition:opacity .2s;
}
.ev-choice:hover{
  border-color:var(--bdm);
  background:rgba(64,136,216,.07);
  transform:translateX(4px);
}
.ev-choice:hover::before{opacity:1}
.ev-choice-label{
  font-family:var(--ff-title);font-size:11px;
  color:var(--text);margin-bottom:3px;letter-spacing:.5px;
}
.ev-choice-hint{
  font-size:11px;color:var(--text3);font-style:italic;
}
.ev-choice-reward{
  font-family:var(--ff-title);font-size:9px;
  margin-top:4px;letter-spacing:.5px;
}

.ev-result{
  padding:18px 24px;
  text-align:center;
  animation:fadeInScale .35s cubic-bezier(.34,1.2,.64,1) both;
}
.ev-result-icon{font-size:36px;margin-bottom:10px;display:block}
.ev-result-text{
  font-family:var(--ff-body);font-style:italic;
  font-size:14px;color:var(--text2);
  line-height:1.7;margin-bottom:14px;
}
.ev-result-rewards{
  display:flex;gap:16px;justify-content:center;
  font-family:var(--ff-title);font-size:12px;
  margin-bottom:16px;
}
```

---

## ИЗМЕНЕНИЕ 3: JS — система событий

**НАЙДИ** строку `// =============================================` с `// WEATHER SYSTEM`
и **ДОБАВЬ ПЕРЕД НЕЙ:**

```javascript
// =============================================
// DAILY EVENTS — СЛУЧАЙНЫЕ СОБЫТИЯ
// =============================================

var DAILY_EVENTS = [

  // === ТОРГОВЦЫ И СДЕЛКИ ===
  {
    id: 'merchant',
    type: 'Таинственный торговец',
    title: 'Странник с товаром',
    desc: 'На перекрёстке твоего пути появился сгорбленный торговец. Из-под плаща он достаёт нечто, завёрнутое в потёртую кожу. «Редкий товар, путник. Но цена справедлива».',
    prompt: 'dark fantasy mysterious traveling merchant at crossroads, cloaked figure, Dragon Age concept art style, atmospheric, no text',
    choices: [
      { text: 'Купить артефакт за 100 золота',    hint: 'Риск — возможно это ловушка',       type: 'buy',   cost: 100, reward: { xp: 200, gold: 0, item: true } },
      { text: 'Поторговаться — предложить 50',     hint: 'Может согласиться, может обидеться', type: 'trade', cost: 50,  reward: { xp: 80,  gold: 50 } },
      { text: 'Пройти мимо',                       hint: 'Ничего не теряешь',                 type: 'pass',  cost: 0,   reward: { xp: 30,  gold: 0 } },
    ]
  },

  // === ИСПЫТАНИЯ И ВЫЗОВЫ ===
  {
    id: 'challenge',
    type: 'Испытание силы',
    title: 'Вызов от незнакомца',
    desc: 'Закованный в броню воин преграждает путь. «Докажи, что ты достоин идти дальше. Только сильнейшие продолжают путь». В его глазах нет злобы — только испытание.',
    prompt: 'dark fantasy armored warrior challenging hero, arena stones, torchlight, Dragon Age concept art style, dramatic, no text',
    choices: [
      { text: 'Принять вызов — сразиться',         hint: 'Победа даст много опыта',           type: 'fight', cost: 0,   reward: { xp: 350, gold: 120 } },
      { text: 'Перехитрить — предложить загадку',   hint: 'Интеллект против силы',             type: 'trick', cost: 0,   reward: { xp: 180, gold: 60  } },
      { text: 'Уступить дорогу',                    hint: 'Потеряешь немного золота, зато цел', type: 'flee',  cost: 80,  reward: { xp: 20,  gold: 0   } },
    ]
  },

  // === НАХОДКИ ===
  {
    id: 'treasure',
    type: 'Случайная находка',
    title: 'Заброшенный тайник',
    desc: 'Среди замшелых камней ты замечаешь едва заметную щель. Внутри — следы чьего-то давно забытого укрытия. Часть содержимого ещё цела.',
    prompt: 'dark fantasy hidden treasure chest ancient ruins, moss, dim light, Dragon Age concept art style, atmospheric, no text',
    choices: [
      { text: 'Забрать всё',                        hint: '+золото, но может быть ловушка',    type: 'take',  cost: 0,   reward: { xp: 120, gold: 200 } },
      { text: 'Взять только ценное, остальное — нет', hint: 'Безопаснее, но меньше награды',  type: 'half',  cost: 0,   reward: { xp: 80,  gold: 100 } },
      { text: 'Оставить нетронутым',                 hint: '+опыт за мудрость',               type: 'leave', cost: 0,   reward: { xp: 150, gold: 0   } },
    ]
  },

  // === МИСТИКА И МАГИЯ ===
  {
    id: 'oracle',
    type: 'Мистическое явление',
    title: 'Голос из темноты',
    desc: 'В полночь ты слышишь голос, который знает твоё имя. Он говорит о выборе, который ты ещё не сделал. «Три пути перед тобой, странник. Каждый ведёт к разному концу».',
    prompt: 'dark fantasy mystical oracle glowing runes ancient altar, Dragon Age concept art, supernatural atmosphere, no text',
    choices: [
      { text: 'Спросить о своём предназначении',     hint: 'Мудрость приходит к ищущему',      type: 'wisdom', cost: 0,  reward: { xp: 250, gold: 0   } },
      { text: 'Попросить богатства',                  hint: 'Материальная выгода, но цена?',    type: 'greed',  cost: 0,  reward: { xp: 50,  gold: 180  } },
      { text: 'Уйти, не слушая',                      hint: 'Некоторые тайны лучше не знать',  type: 'ignore', cost: 0,  reward: { xp: 40,  gold: 0    } },
    ]
  },

  // === ПОМОЩЬ ДРУГИМ ===
  {
    id: 'rescue',
    type: 'Встреча на дороге',
    title: 'Путник в беде',
    desc: 'У обочины ты видишь немолодого человека с повреждённой ногой. Рядом — опрокинутая повозка. Он смотрит на тебя с надеждой, но ты спешишь.',
    prompt: 'dark fantasy injured traveler on road asking for help, medieval setting, Dragon Age concept art style, compassionate scene, no text',
    choices: [
      { text: 'Помочь — потратить время и ресурсы',  hint: 'Благородство не остаётся незамеченным', type: 'help',  cost: 60, reward: { xp: 300, gold: 80 } },
      { text: 'Дать золото и продолжить путь',       hint: 'Быстрая помощь, меньше участия',        type: 'coin',  cost: 40, reward: { xp: 120, gold: 0  } },
      { text: 'Пройти мимо — у тебя своих дел хватает', hint: 'Никаких потерь... или нет?',         type: 'pass',  cost: 0,  reward: { xp: 0,   gold: 0  } },
    ]
  },

  // === ДРАКОН / ЭПИК ===
  {
    id: 'dragon',
    type: 'Эпическое явление',
    title: 'Тень с небес',
    desc: 'Земля дрожит. Огромная тень закрывает солнце. Дракон кружит над равниной, его взгляд фиксирует тебя. Он явно что-то хочет... или проверяет.',
    prompt: 'dark fantasy dragon circling over ancient ruins, dramatic sky, Dragon Age concept art style, epic scale, no text',
    choices: [
      { text: 'Встать в полный рост и не двигаться', hint: 'Смелость иногда обезоруживает',    type: 'brave',  cost: 0,   reward: { xp: 500, gold: 0   } },
      { text: 'Предложить своё золото',               hint: 'Дорого, но безопасно',             type: 'bribe',  cost: 150, reward: { xp: 200, gold: 100 } },
      { text: 'Бежать со всех ног',                   hint: 'Спастись — тоже победа',           type: 'run',    cost: 0,   reward: { xp: 80,  gold: 0   } },
    ]
  },

  // === ЗАГАДКА ===
  {
    id: 'riddle',
    type: 'Испытание разума',
    title: 'Страж ворот',
    desc: 'У ворот стоит каменный страж, просыпающийся раз в столетие. «Ответь на мой вопрос — и путь открыт. Ошибись — заплатишь цену». Его глаза вспыхивают синим огнём.',
    prompt: 'dark fantasy stone golem guardian at ancient gate, glowing eyes, Dragon Age concept art style, mysterious, no text',
    choices: [
      { text: 'Попытаться разгадать загадку',         hint: 'Правильный ответ = большая награда', type: 'solve', cost: 0,  reward: { xp: 400, gold: 150 } },
      { text: 'Заплатить пошлину стражу',             hint: 'Дороже, зато надёжно',              type: 'pay',   cost: 100, reward: { xp: 80,  gold: 0   } },
      { text: 'Обойти стороной',                      hint: 'Дольше, но без риска',              type: 'go',    cost: 0,  reward: { xp: 40,  gold: 0   } },
    ]
  },
];

// Результаты выборов (тексты и исходы)
var EVENT_RESULTS = {
  merchant: {
    buy:   { icon:'📦', success: true,  text: 'Артефакт оказался настоящим! Древняя реликвия пополняет твою силу.' },
    trade: { icon:'🤝', success: true,  text: 'Торговец усмехнулся и принял условия. Выгодная сделка.' },
    pass:  { icon:'🚶', success: false, text: 'Ты прошёл мимо. Иногда лучшая сделка — та, что не заключена.' },
  },
  challenge: {
    fight: { icon:'⚔️', success: true,  text: 'Противник повержен! Он склоняет голову: «Достоин, странник».' },
    trick: { icon:'🎭', success: true,  text: 'Воин озадачен твоей загадкой. Победа разума над силой.' },
    flee:  { icon:'💨', success: false, text: 'Ты уступил дорогу. Но мудрость — знать, когда не стоит сражаться.' },
  },
  treasure: {
    take:  { icon:'💰', success: true,  text: 'Ловушки не было. Находка богатая — явно принадлежала опытному охотнику.' },
    half:  { icon:'📿', success: true,  text: 'Ты взял самое ценное. Разумный выбор странника.' },
    leave: { icon:'🌟', success: true,  text: 'Что-то подсказало тебе — это не твоё. Опыт мудреца дороже золота.' },
  },
  oracle: {
    wisdom: { icon:'🔮', success: true,  text: 'Голос говорит долго. Слова туманны, но одно ясно — путь верный.' },
    greed:  { icon:'🪙', success: false, text: 'Золото появилось. Но ощущение, что ты заплатил чем-то важным...' },
    ignore: { icon:'🚶', success: false, text: 'Ты ушёл. Голос не преследовал. Некоторые тайны закрываются навсегда.' },
  },
  rescue: {
    help:  { icon:'🙏', success: true,  text: 'Путник оказался знатным целителем. Он исцелил несколько твоих ран в знак благодарности.' },
    coin:  { icon:'🪙', success: true,  text: 'Путник принял помощь с достоинством. Судьба замечает щедрых.' },
    pass:  { icon:'😔', success: false, text: 'Ты прошёл мимо. Иногда самые тяжёлые вещи — те, которых не делаешь.' },
  },
  dragon: {
    brave:  { icon:'🐉', success: true,  text: 'Дракон сделал круг и улетел. Смелость — единственный язык, который он уважает.' },
    bribe:  { icon:'💎', success: true,  text: 'Дракон забрал золото и унёс что-то взамен. Непростое существо.' },
    run:    { icon:'💨', success: false, text: 'Ты бежал. Дракон даже не преследовал — видимо, не счёл тебя достойным.' },
  },
  riddle: {
    solve: { icon:'💡', success: true,  text: 'Ответ верный! Страж расступается: «Проходи, мудрец». Редкая победа.' },
    pay:   { icon:'🔑', success: true,  text: 'Ворота открылись. Деньги решают проблемы, которые не решает ум.' },
    go:    { icon:'🗺️', success: false, text: 'Обходной путь длиннее, но ты добрался. Иногда уклонение — стратегия.' },
  },
};

var _activeEvent = null;

function checkDailyEvent() {
  var today = new Date().toISOString().slice(0, 10);
  if (S.lastEvent === today) return; // уже было сегодня

  // 60% шанс события каждый день
  if (Math.random() > 0.6) { S.lastEvent = today; save(); return; }

  // Случайное событие
  var evt = DAILY_EVENTS[Math.floor(Math.random() * DAILY_EVENTS.length)];
  _activeEvent = evt;

  // Показываем с задержкой — чтобы интерфейс успел загрузиться
  setTimeout(function() { showEventModal(evt); }, 1800);
}

function showEventModal(evt) {
  // Заголовок
  document.getElementById('ev-type-badge').textContent = evt.type;
  document.getElementById('ev-title').textContent      = evt.title;
  document.getElementById('ev-desc').textContent       = evt.desc;

  // Сбрасываем результат
  var resultEl = document.getElementById('ev-result');
  resultEl.style.display = 'none';
  resultEl.innerHTML = '';

  // AI-иллюстрация
  var illEl = document.getElementById('ev-illustration');
  illEl.innerHTML = '<div class="ev-illustration-overlay"></div>';
  var seed = evt.id.split('').reduce(function(a,c){ return a+c.charCodeAt(0); }, 0) + new Date().getDate() * 100;
  var imgUrl = 'https://image.pollinations.ai/prompt/'
    + encodeURIComponent(evt.prompt + ', dark color palette, masterpiece, highly detailed')
    + '?width=700&height=260&seed=' + seed + '&nologo=true&model=flux';
  var img = document.createElement('img');
  img.onload = function() { img.style.opacity = '1'; illEl.style.animation = 'none'; };
  img.src = imgUrl;
  illEl.insertBefore(img, illEl.firstChild);

  // Варианты выбора
  var choicesEl = document.getElementById('ev-choices');
  choicesEl.innerHTML = evt.choices.map(function(c, i) {
    var rewardStr = '';
    if (c.reward.xp)   rewardStr += '<span style="color:var(--sap)">+' + c.reward.xp + ' ОП</span> ';
    if (c.reward.gold) rewardStr += '<span style="color:var(--gold)">+🪙' + c.reward.gold + '</span>';
    if (c.cost)        rewardStr += '<span style="color:var(--red2)">−🪙' + c.cost + '</span>';
    return '<div class="ev-choice" onclick="makeEventChoice(' + i + ')">'
      + '<div class="ev-choice-label">' + c.text + '</div>'
      + '<div class="ev-choice-hint">' + c.hint + '</div>'
      + (rewardStr ? '<div class="ev-choice-reward">' + rewardStr + '</div>' : '')
      + '</div>';
  }).join('');

  openM('m-event');
  if (typeof sndModal === 'function') sndModal();
}

function makeEventChoice(idx) {
  if (!_activeEvent) return;
  var evt    = _activeEvent;
  var choice = evt.choices[idx];
  var result = (EVENT_RESULTS[evt.id] || {})[choice.type] || {
    icon: '✦', success: true, text: 'Судьба благосклонна к принявшему решение.'
  };

  // Применяем стоимость
  if (choice.cost && choice.cost > 0) {
    S.hero.gold = Math.max(0, S.hero.gold - choice.cost);
  }

  // Применяем награду
  var xpGain   = choice.reward.xp   || 0;
  var goldGain = choice.reward.gold || 0;

  // Успех с небольшой случайностью (±20%)
  if (result.success) {
    xpGain   = Math.round(xpGain   * (0.8 + Math.random() * 0.4));
    goldGain = Math.round(goldGain * (0.8 + Math.random() * 0.4));
  } else {
    xpGain   = Math.round(xpGain   * 0.5);
    goldGain = 0;
  }

  if (xpGain)   gainXP(xpGain);
  if (goldGain) gainGold(goldGain);

  refreshTopBar();
  save();

  // Отмечаем что событие на сегодня использовано
  S.lastEvent = new Date().toISOString().slice(0, 10);
  save();

  // Показываем результат
  var choicesEl = document.getElementById('ev-choices');
  choicesEl.style.display = 'none';

  var resultEl = document.getElementById('ev-result');
  resultEl.style.display = 'block';
  resultEl.innerHTML = '<div class="ev-result-icon">' + result.icon + '</div>'
    + '<div class="ev-result-text">' + result.text + '</div>'
    + '<div class="ev-result-rewards">'
    + (xpGain   ? '<span style="color:var(--sap)">✨ +' + xpGain   + ' ОП</span>' : '')
    + (goldGain ? '<span style="color:var(--gold)">🪙 +' + goldGain + '</span>' : '')
    + (choice.cost ? '<span style="color:var(--red2)">💸 −' + choice.cost + '</span>' : '')
    + '</div>'
    + '<button class="btn btn-g btn-wide" onclick="closeM(\'m-event\');document.getElementById(\'ev-choices\').style.display=\'flex\'">Продолжить путь →</button>';

  if (result.success && typeof sndQuestComplete === 'function') sndQuestComplete();
  else if (!result.success && typeof sndError === 'function') sndError();
}
```

---

## ИЗМЕНЕНИЕ 4: добавить S.lastEvent в load() и fresh()

**НАЙДИ в load():**
```javascript
    if (!d.routines) d.routines = [];
    return d;
```

**ЗАМЕНИ НА:**
```javascript
    if (!d.routines)   d.routines   = [];
    if (!d.lastEvent)  d.lastEvent  = '';
    return d;
```

**НАЙДИ в fresh():**
```javascript
    events: [],
    routines: []
```

**ЗАМЕНИ НА:**
```javascript
    events: [],
    routines: [],
    lastEvent: ''
```

---

## ИЗМЕНЕНИЕ 5: вызов checkDailyEvent в initAll

**НАЙДИ в initAll():**
```javascript
  initWeather();
```

**ЗАМЕНИ НА:**
```javascript
  initWeather();
  checkDailyEvent();
```

---

## Что получится

| Элемент | Описание |
|---|---|
| Частота | 60% шанс события при открытии приложения раз в день |
| Событий | 7 уникальных сценариев (торговец, вызов, находка, оракул, спасение, дракон, загадка) |
| AI-иллюстрация | Уникальная картинка для каждого события через Pollinations |
| Выборы | 3 варианта у каждого события с разными рисками и наградами |
| Случайность | Награды варьируются ±20% от базы |
| Стоимость | Некоторые выборы требуют золото |
| Результат | Текст исхода + анимированная сводка наград |
| Звуки | sndModal при открытии, sndQuestComplete/sndError при результате |
