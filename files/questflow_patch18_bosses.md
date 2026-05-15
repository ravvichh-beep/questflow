# QuestFlow — Патч 18: Тематические боссы

## Архитектура
- Боссы появляются когда накапливается 5+ выполненных квестов одной категории
- Каждая категория = свой уникальный босс с промптом для AI-арта
- Босс появляется как отдельная запись в ENEMIES поверх стандартного списка
- После победы — уведомление и повышенная награда
- S.bossKills — счётчик побед над боссами категорий

## Проверка совместимости
- ENEMIES из Патча 6 — добавляем динамических боссов поверх ✓
- dAct() — добавляем обработку categoryBoss ✓
- doComplete() из Патча 5 — добавляем checkCategoryBoss() ✓
- refreshDungeonEnemy() из Патча 6 — совместимо ✓
- S.bossKills, S.pendingBoss — новые поля ✓

---

## ИЗМЕНЕНИЕ 1: JS — система категорийных боссов

**НАЙДИ** строку `// =============================================` с `// DAILY EVENTS`
и **ДОБАВЬ ПЕРЕД НЕЙ:**

```javascript
// =============================================
// CATEGORY BOSSES — ТЕМАТИЧЕСКИЕ БОССЫ
// =============================================

var CATEGORY_BOSSES = {
  study: {
    n:   'Архивариус Теней',
    t:   'Страж Знаний · Босс Учёбы',
    hp:  600, dmg: 45, xp: 600, g: 400,
    key: 'study_boss',
    isBoss: true,
    isCategoryBoss: true,
    prompt: 'dark fantasy ancient lich librarian guardian, surrounded by floating cursed books and scrolls, glowing eyes, dark library background, Dragon Age Origins concept art style, highly detailed',
    bgPrompt: 'dark fantasy massive underground library, infinite dark bookshelves, floating candles, ancient tomes, Dragon Age Origins environment concept art, atmospheric, no characters',
    killMsg: 'Архивариус пал! Знания — твои.',
  },
  work: {
    n:   'Железный Надсмотрщик',
    t:   'Страж Труда · Босс Работы',
    hp:  700, dmg: 55, xp: 700, g: 500,
    key: 'work_boss',
    isBoss: true,
    isCategoryBoss: true,
    prompt: 'dark fantasy massive iron golem overseer, industrial chains and gears, glowing forge eyes, dark factory background, Dragon Age Origins concept art style, highly detailed',
    bgPrompt: 'dark fantasy underground forge, molten metal, massive machinery, smoke and fire, Dragon Age Origins environment concept art, atmospheric, no characters',
    killMsg: 'Надсмотрщик сокрушён! Труд победил железо.',
  },
  health: {
    n:   'Чумной Жнец',
    t:   'Страж Здоровья · Босс Тела',
    hp:  550, dmg: 40, xp: 580, g: 420,
    key: 'health_boss',
    isBoss: true,
    isCategoryBoss: true,
    prompt: 'dark fantasy plague reaper wraith, tattered robes, scythe, green miasma, cursed forest background, Dragon Age Origins concept art style, highly detailed, menacing',
    bgPrompt: 'dark fantasy cursed swamp, dead trees, green fog, bioluminescent mushrooms, Dragon Age Origins environment concept art, atmospheric, no characters',
    killMsg: 'Жнец повержен! Тело закалено.',
  },
  hobby: {
    n:   'Похититель Грёз',
    t:   'Страж Творчества · Босс Хобби',
    hp:  500, dmg: 50, xp: 550, g: 380,
    key: 'hobby_boss',
    isBoss: true,
    isCategoryBoss: true,
    prompt: 'dark fantasy dream thief shadow entity, masks and illusions, reality distortion, artistic chaos, Dragon Age Origins concept art style, highly detailed, surreal',
    bgPrompt: 'dark fantasy surreal dream realm, floating islands, shattered mirrors, strange colors, Dragon Age Origins environment concept art, atmospheric, no characters',
    killMsg: 'Похититель грёз изгнан! Творчество свободно.',
  },
  life: {
    n:   'Хаотический Страж',
    t:   'Страж Судьбы · Босс Жизни',
    hp:  650, dmg: 48, xp: 620, g: 450,
    key: 'life_boss',
    isBoss: true,
    isCategoryBoss: true,
    prompt: 'dark fantasy chaos guardian entity, shifting forms, temporal distortion, ancient ruins background, Dragon Age Origins concept art style, highly detailed, cosmic horror',
    bgPrompt: 'dark fantasy collapsing reality ancient ruins, time distortion, fractured sky, Dragon Age Origins environment concept art, atmospheric, no characters',
    killMsg: 'Страж судьбы пал! Путь открыт.',
  },
};

// Порог квестов для появления босса категории
var BOSS_THRESHOLD = 5;

// Проверить появление категорийного босса после выполнения квеста
function checkCategoryBoss(quest) {
  var cat = quest.category;
  if (!CATEGORY_BOSSES[cat]) return;

  var catCount = (S.stats.cats[cat] || 0);

  // Босс появляется каждые BOSS_THRESHOLD квестов категории
  if (catCount > 0 && catCount % BOSS_THRESHOLD === 0) {
    // Проверяем что босс этой категории ещё не активен
    if (S.pendingBoss && S.pendingBoss.cat === cat) return;

    S.pendingBoss = {
      cat:       cat,
      threshold: catCount,
      created:   new Date().toISOString()
    };
    save();

    // Уведомление
    setTimeout(function() {
      showToast('⚠ ' + CATEGORY_BOSSES[cat].n + ' явился в подземелье!');
      if (typeof sndError === 'function') sndError();
    }, 1000);
  }
}

// Получить текущего босса если есть
function getPendingBoss() {
  if (!S.pendingBoss) return null;
  var boss = CATEGORY_BOSSES[S.pendingBoss.cat];
  if (!boss) return null;
  return boss;
}

// Вызывается после победы над категорийным боссом
function onCategoryBossKilled(cat) {
  if (!S.bossKills) S.bossKills = {};
  S.bossKills[cat] = (S.bossKills[cat] || 0) + 1;
  S.pendingBoss    = null;
  save();

  var boss = CATEGORY_BOSSES[cat];
  if (boss) {
    setTimeout(function() {
      showToast('🏆 ' + (boss.killMsg || 'Босс повержен!'));
    }, 500);
  }

  // Обновляем список врагов
  renderDungeonPanel();
}

// Добавить кнопку "Босс ждёт" на экране подземелья
function renderBossBanner() {
  var boss = getPendingBoss();
  var banner = document.getElementById('boss-banner');
  if (!banner) return;

  if (boss) {
    banner.style.display = 'block';
    banner.innerHTML = '<div class="boss-banner-content">'
      + '<div class="boss-banner-icon">⚠</div>'
      + '<div>'
      +   '<div class="boss-banner-title">' + boss.n + ' ждёт</div>'
      +   '<div class="boss-banner-sub">' + boss.t + '</div>'
      + '</div>'
      + '<button class="btn btn-r" onclick="fightCategoryBoss()" style="padding:6px 12px;font-size:8px;margin-left:auto">Сразиться</button>'
      + '</div>';
  } else {
    banner.style.display = 'none';
  }
}

// Начать бой с боссом категории
function fightCategoryBoss() {
  var boss = getPendingBoss();
  if (!boss) return;

  // Временно заменяем текущего врага на босса
  S._tempBoss = boss;
  S.dungeonEHP    = boss.hp;
  S.dungeonEHPMax = boss.hp;

  // Перерисовываем подземелье с боссом
  refreshDungeonEnemy();
  renderBossBanner();

  showToast('⚔ Бой с ' + boss.n + ' начался!');
  if (typeof sndSpell === 'function') sndSpell();
}
```

---

## ИЗМЕНЕНИЕ 2: HTML — баннер босса в подземелье

**НАЙДИ в HTML view-dungeon:**
```html
<div class="dung-top">
```

**ДОБАВЬ ПЕРЕД НЕЙ:**
```html
<!-- Boss banner -->
<div id="boss-banner" style="display:none;margin-bottom:0"></div>
```

---

## ИЗМЕНЕНИЕ 3: CSS — баннер босса

**ДОБАВИТЬ в конец CSS** (перед `</style>`):

```css
/* ===== BOSS BANNER ===== */
#boss-banner{
  background:rgba(168,32,32,.1);
  border-bottom:1px solid rgba(168,32,32,.3);
  animation:overdue-pulse 2s ease infinite;
}
.boss-banner-content{
  display:flex;align-items:center;gap:12px;
  padding:10px 18px;
}
.boss-banner-icon{
  font-size:20px;
  animation:float 2s ease-in-out infinite;
}
.boss-banner-title{
  font-family:var(--ff-title);font-size:13px;
  color:var(--red2);letter-spacing:.5px;
}
.boss-banner-sub{
  font-family:var(--ff-title);font-size:8px;
  letter-spacing:2px;color:var(--text3);
  text-transform:uppercase;margin-top:2px;
}
```

---

## ИЗМЕНЕНИЕ 4: обновить refreshDungeonEnemy — поддержка _tempBoss

**НАЙДИ в refreshDungeonEnemy()** (Патч 6) строку:
```javascript
function refreshDungeonEnemy() {
  var e = curEnemy();
```

**ЗАМЕНИ НА:**
```javascript
function refreshDungeonEnemy() {
  var e = (S._tempBoss) ? S._tempBoss : curEnemy();
```

---

## ИЗМЕНЕНИЕ 5: обновить dAct — обработка смерти категорийного босса

**НАЙДИ в dAct()** строку:
```javascript
  if (S.dungeonEHP <= 0) {
    animEnemy('dying');
    spawnDeathParticles();
    cameraShake(2.5);
    sndEnemyDie();
    if (e.isBoss) S.killedBoss = true;
```

**ЗАМЕНИ НА:**
```javascript
  if (S.dungeonEHP <= 0) {
    animEnemy('dying');
    spawnDeathParticles();
    cameraShake(2.5);
    sndEnemyDie();
    if (e.isCategoryBoss) {
      // Победа над боссом категории
      onCategoryBossKilled(S.pendingBoss ? S.pendingBoss.cat : '');
      S._tempBoss = null;
    }
    if (e.isBoss) S.killedBoss = true;
```

---

## ИЗМЕНЕНИЕ 6: вызов checkCategoryBoss в doComplete

**НАЙДИ в doComplete()** (Патч 5):
```javascript
  updateHeroClass();
  updateHeroTitle();
  checkAch();
```

**ЗАМЕНИ НА:**
```javascript
  updateHeroClass();
  updateHeroTitle();
  checkCategoryBoss(q);
  checkAch();
```

---

## ИЗМЕНЕНИЕ 7: обновить fresh() и load()

**НАЙДИ в fresh():**
```javascript
    events: [],
    routines: [],
    lastEvent: ''
```

**ЗАМЕНИ НА:**
```javascript
    events: [],
    routines: [],
    lastEvent: '',
    pendingBoss: null,
    bossKills: {}
```

**НАЙДИ в load():**
```javascript
    if (!d.lastEvent)  d.lastEvent  = '';
    return d;
```

**ЗАМЕНИ НА:**
```javascript
    if (!d.lastEvent)   d.lastEvent   = '';
    if (!d.bossKills)   d.bossKills   = {};
    if (d.pendingBoss === undefined) d.pendingBoss = null;
    return d;
```

---

## ИЗМЕНЕНИЕ 8: добавить renderBossBanner в initDungeon

**НАЙДИ функцию** `initDungeon` (или место где инициализируется подземелье) и добавь в конец:
```javascript
  renderBossBanner();
```

---

## Что получится

| Условие | Что происходит |
|---|---|
| 5 квестов "Учёба" выполнено | Появляется Архивариус Теней |
| 5 квестов "Работа" | Железный Надсмотрщик |
| 5 квестов "Здоровье" | Чумной Жнец |
| 5 квестов "Хобби" | Похититель Грёз |
| 5 квестов "Жизнь" | Хаотический Страж |
| Каждые след. 5 квестов | Новый босс той же категории |
| Баннер в подземелье | Красная плашка "⚠ Босс ждёт" с кнопкой |
| AI-арт босса | Уникальный портрет + фон через Pollinations |
| Победа | Расширенное уведомление + повышенная награда |
