# QuestFlow — Патч 14: Система динамических титулов

## Проверка совместимости
- refreshTopBar() — добавляем вывод титула ✓
- renderChar() из Патча 7 — добавляем титул под именем ✓
- doComplete() из Патча 5 — добавляем пересчёт титула ✓
- completeRoutineStreak() из Патча 12 — добавляем пересчёт ✓
- S.hero.title — новое поле, load() безопасно инициализирует ✓
- CSS .hero-title — уникальный класс ✓

---

## ИЗМЕНЕНИЕ 1: JS — система титулов

**НАЙДИ** строку `var CLS_NAMES = { ... };`
и **ДОБАВЬ ПОСЛЕ НЕЁ:**

```javascript
// =============================================
// TITLE SYSTEM — СИСТЕМА ТИТУЛОВ
// =============================================

// Титулы по уровню (база)
var TITLE_BY_LEVEL = [
  { min:1,  title:'Странник' },
  { min:3,  title:'Искатель' },
  { min:5,  title:'Ветеран' },
  { min:8,  title:'Мастер' },
  { min:12, title:'Легенда' },
  { min:18, title:'Избранный' },
  { min:25, title:'Бессмертный' },
];

// Префиксы — зависят от разных условий
var TITLE_PREFIXES = {
  // По преобладающей категории
  study:   ['Учёный','Хранитель Знаний','Мудрый','Искушённый','Просветлённый'],
  work:    ['Неутомимый','Железный','Несгибаемый','Непреклонный','Стальной'],
  health:  ['Закалённый','Выносливый','Несломленный','Крепкий','Стойкий'],
  hobby:   ['Свободный','Вольный','Творческий','Искусный','Вдохновлённый'],
  life:    ['Мудрый','Опытный','Бывалый','Зрелый','Познавший'],

  // Специальные условия
  streak3:    'Верный',
  streak7:    'Неистовый',
  streak14:   'Легендарный',
  streak30:   'Вечный',
  overdue:    'Падший',
  noQuests:   'Забытый',
  boss:       'Убийца Боссов',
  dungeon10:  'Опустошитель Подземелий',
  allCats:    'Всесторонний',
  level1:     'Восставший из Пепла',
};

// Суффиксы — зависят от класса и уровня
var TITLE_SUFFIXES = {
  keeper:   ['Знаний','Свитков','Тайн','Рун','Мудрости'],
  warrior:  ['Дел','Труда','Битв','Побед','Воли'],
  druid:    ['Тела','Духа','Природы','Жизни','Силы'],
  rogue:    ['Теней','Творчества','Свободы','Ветра','Грёз'],
  wanderer: ['Путей','Дорог','Странствий','Горизонтов','Судьбы'],
};

// Особые полные титулы (переопределяют всё)
var TITLE_SPECIAL = [
  { cond: function(S) { return S.hero.lvl >= 25 && S.stats.totalDone >= 200; },
    title: 'Бессмертный Покоритель Судьбы' },
  { cond: function(S) { return S.stats.totalDone >= 100 && S.killedBoss; },
    title: 'Легендарный Убийца Тьмы' },
  { cond: function(S) { return S.dungeonKills >= 50; },
    title: 'Опустошитель Подземелий' },
  { cond: function(S) {
      var cats = S.stats.cats || {};
      return Object.keys(cats).filter(function(k){ return (cats[k]||0) >= 5; }).length >= 4;
    }, title: 'Всесторонний Мастер' },
];

function calcHeroTitle() {
  var h     = S.hero;
  var stats = S.stats;
  var cats  = stats.cats || {};

  // Проверяем особые полные титулы
  for (var i = 0; i < TITLE_SPECIAL.length; i++) {
    if (TITLE_SPECIAL[i].cond(S)) return TITLE_SPECIAL[i].title;
  }

  // Определяем преобладающую категорию
  var maxCat = 'work'; var maxVal = 0;
  Object.keys(cats).forEach(function(k) {
    if ((cats[k] || 0) > maxVal) { maxVal = cats[k]; maxCat = k; }
  });

  // Базовый титул по уровню
  var baseTitle = 'Странник';
  for (var j = 0; j < TITLE_BY_LEVEL.length; j++) {
    if (h.lvl >= TITLE_BY_LEVEL[j].min) baseTitle = TITLE_BY_LEVEL[j].title;
  }

  // Определяем лучший streak среди рутин
  var bestStreak = 0;
  (S.routines || []).forEach(function(r) {
    if ((r.streak || 0) > bestStreak) bestStreak = r.streak;
  });

  // Специальные условия — переопределяют базовый
  var prefix = '';
  var hasOverdue = (S.quests || []).some(function(q){ return !q.done && isOverdue(q); });

  if (hasOverdue && (S.quests || []).filter(function(q){ return !q.done && isOverdue(q); }).length >= 3) {
    prefix = TITLE_PREFIXES.overdue;
  } else if (bestStreak >= 30) {
    prefix = TITLE_PREFIXES.streak30;
  } else if (bestStreak >= 14) {
    prefix = TITLE_PREFIXES.streak14;
  } else if (bestStreak >= 7) {
    prefix = TITLE_PREFIXES.streak7;
  } else if (bestStreak >= 3) {
    prefix = TITLE_PREFIXES.streak3;
  } else if (h.lvl === 1 && stats.totalDone >= 1) {
    prefix = TITLE_PREFIXES.level1;
    return prefix; // Полный особый титул
  } else if (maxVal >= 3) {
    // Префикс по категории — индекс зависит от уровня
    var catPrefixes = TITLE_PREFIXES[maxCat] || TITLE_PREFIXES.work;
    var pidx = Math.min(Math.floor(h.lvl / 5), catPrefixes.length - 1);
    prefix = catPrefixes[pidx];
  }

  // Суффикс по классу
  var clsSuffix = TITLE_SUFFIXES[h.cls] || TITLE_SUFFIXES.keeper;
  var sidx = Math.min(Math.floor(h.lvl / 5), clsSuffix.length - 1);
  var suffix = clsSuffix[sidx];

  // Сборка
  if (prefix) return prefix + ' ' + baseTitle + ' ' + suffix;
  return baseTitle + ' ' + suffix;
}

// Обновить и сохранить титул
function updateHeroTitle() {
  var title = calcHeroTitle();
  S.hero.title = title;
  // Обновляем в UI если открыт
  var titleEl = document.getElementById('hero-title-display');
  if (titleEl) titleEl.textContent = title;
  var topTitleEl = document.getElementById('t-hero-title');
  if (topTitleEl) topTitleEl.textContent = title;
}
```

---

## ИЗМЕНЕНИЕ 2: показывать титул в топбаре

**НАЙДИ в HTML:**
```html
  <div class="lvlbadge" id="t-lvl">УР. 1</div>
```

**ЗАМЕНИ НА:**
```html
  <div class="lvlbadge" id="t-lvl">УР. 1</div>
  <div class="t-title" id="t-hero-title"></div>
```

**ДОБАВИТЬ CSS:**
```css
.t-title{
  font-family:var(--ff-body);font-style:italic;
  font-size:11px;color:var(--text3);
  letter-spacing:.5px;
  display:none; /* показываем только на широких экранах */
}
@media(min-width:900px){
  .t-title{display:block}
}
```

---

## ИЗМЕНЕНИЕ 3: показывать титул на экране персонажа

**НАЙДИ в renderChar()** (версия из Патча 7) строки:
```javascript
  document.getElementById('c-name').textContent = h.name || '—';
  document.getElementById('c-cls').textContent  = h.clsName || '—';
```

**ЗАМЕНИ НА:**
```javascript
  document.getElementById('c-name').textContent = h.name || '—';
  document.getElementById('c-cls').textContent  = h.clsName || '—';

  // Титул
  updateHeroTitle();
  var titleEl = document.getElementById('hero-title-display');
  if (titleEl) titleEl.textContent = S.hero.title || calcHeroTitle();
```

---

## ИЗМЕНЕНИЕ 4: добавить элемент титула в HTML персонажа

**НАЙДИ в HTML view-character:**
```html
<div class="ccls" id="c-cls"></div>
```

**ЗАМЕНИ НА:**
```html
<div class="ccls" id="c-cls"></div>
<div class="hero-title-display" id="hero-title-display"></div>
```

**ДОБАВИТЬ CSS:**
```css
.hero-title-display{
  font-family:var(--ff-body);font-style:italic;
  font-size:12px;color:rgba(212,168,74,.6);
  text-align:center;margin-bottom:10px;
  letter-spacing:.5px;
  text-shadow:0 0 8px rgba(212,168,74,.15);
  min-height:16px;
}
```

---

## ИЗМЕНЕНИЕ 5: обновлять титул при завершении квеста и level up

**НАЙДИ в `doComplete`** (Патч 5) строку:
```javascript
  updateHeroClass();
  checkAch();
```

**ЗАМЕНИ НА:**
```javascript
  updateHeroClass();
  updateHeroTitle();
  checkAch();
```

**НАЙДИ в `gainXP`** (Патч 5) внутри while-цикла строку:
```javascript
    S.hero.chp = S.hero.hp;
```

**ДОБАВЬ ПОСЛЕ:**
```javascript
    S.hero.chp = S.hero.hp;
    updateHeroTitle(); // Пересчитываем титул при level up
```

**НАЙДИ в `completeRoutineStreak`** (Патч 12) строку:
```javascript
  r.streak = streak;
  if (streak > (r.bestStreak || 0)) r.bestStreak = streak;
  save();
```

**ДОБАВЬ ПОСЛЕ:**
```javascript
  r.streak = streak;
  if (streak > (r.bestStreak || 0)) r.bestStreak = streak;
  save();
  updateHeroTitle(); // Серия меняет титул
```

---

## ИЗМЕНЕНИЕ 6: инициализация titula при запуске

**НАЙДИ в `initAll()`:**
```javascript
  refreshTopBar();
  checkRoutines();
```

**ЗАМЕНИ НА:**
```javascript
  refreshTopBar();
  updateHeroTitle();
  checkRoutines();
```

---

## Что получится

| Условие | Пример титула |
|---|---|
| Уровень 1, первый квест | Восставший из Пепла |
| Уровень 3, много работы | Неутомимый Искатель Дел |
| Уровень 5, streak 7 дней | Неистовый Ветеран Дел |
| Уровень 8, много учёбы | Мудрый Мастер Знаний |
| Уровень 12, streak 30 | Вечный Легенда Побед |
| 3+ просроченных квеста | Падший Искатель Тайн |
| 4 категории по 5+ квестов | Всесторонний Мастер |
| 50+ убийств в подземелье | Опустошитель Подземелий |
| Уровень 25, 200+ квестов | Бессмертный Покоритель Судьбы |
