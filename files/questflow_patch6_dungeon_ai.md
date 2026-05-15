# QuestFlow — Патч 6: AI-картинки для подземелья (Pollinations)

## Инструкция для Claude Code

Три изменения: HTML сцены, JS врагов, JS фона сцены.
Применяй строго по порядку.

---

## ИЗМЕНЕНИЕ 1: HTML сцены подземелья

**НАЙДИ и ЗАМЕНИ** весь блок `<div class="dung-scene" id="d-scene">...</div>`:

**НА ЧТО ЗАМЕНИТЬ:**
```html
<div class="dung-scene" id="d-scene">

  <!-- AI фон подземелья -->
  <div class="dung-bg" id="dung-bg">
    <div class="dung-bg-shimmer" id="dung-bg-shimmer"></div>
    <img id="dung-bg-img" class="dung-bg-img" src="" alt=""
      onload="this.style.opacity='1';document.getElementById('dung-bg-shimmer').style.display='none';"
      onerror="this.style.display='none';"
      style="opacity:0;transition:opacity 1s ease">
    <div class="dung-bg-overlay"></div>
  </div>

  <!-- Факелы — декоративные, поверх фона -->
  <div class="dung-torch dung-torch-l">
    <div class="dung-torch-flame"></div>
  </div>
  <div class="dung-torch dung-torch-r">
    <div class="dung-torch-flame"></div>
  </div>

  <!-- Герой -->
  <div id="hero-sprite" class="hero-sprite"
    style="position:absolute;left:55px;bottom:36px;z-index:5">
    <img id="hero-img" src="" alt="" style="width:80px;height:120px;object-fit:contain;display:none;filter:drop-shadow(0 0 12px rgba(64,136,216,.5))">
    <!-- Fallback SVG если нет картинки -->
    <svg id="hero-svg" width="62" height="110" viewBox="0 0 62 110" fill="none">
      <ellipse cx="31" cy="107" rx="17" ry="3" fill="#3d7bc8" opacity=".07"/>
      <path d="M17 52 L9 100 L53 100 L45 52Z" fill="#1a3060" stroke="#3d7cc8" stroke-width=".5" stroke-opacity=".4"/>
      <path d="M17 52 L5 89 L17 92 L23 63Z" fill="#0c1e3a" opacity=".9"/>
      <path d="M45 52 L57 89 L45 92 L39 63Z" fill="#0c1e3a" opacity=".9"/>
      <path d="M23 49 L23 73 L39 73 L39 49Z" fill="#1a3060" stroke="#3d7cc8" stroke-width=".3" stroke-opacity=".35"/>
      <line x1="55" y1="13" x2="48" y2="100" stroke="#3a5472" stroke-width="2"/>
      <circle cx="55" cy="10" r="7" fill="#060d18" stroke="#3d7cc8" stroke-width=".7"/>
      <circle cx="55" cy="10" r="4" fill="#3d7cc8" opacity=".5"/>
      <circle cx="55" cy="10" r="2" fill="#5aaae6" opacity=".88"/>
      <rect x="26" y="36" width="10" height="13" rx="3.5" fill="#c8a882"/>
      <ellipse cx="31" cy="26" rx="12" ry="14" fill="#c8a882"/>
      <path d="M18 22 Q31 7 44 22 L41 34 Q31 19 21 34Z" fill="#1a3060" opacity=".9"/>
      <ellipse cx="25" cy="26" rx="2" ry="1.6" fill="#3d7cc8" opacity=".65"/>
      <ellipse cx="37" cy="26" rx="2" ry="1.6" fill="#3d7cc8" opacity=".65"/>
    </svg>
  </div>

  <!-- Враг — AI картинка -->
  <div id="enemy-wrap" style="position:absolute;right:65px;bottom:36px;z-index:5">
    <!-- заполняется через JS -->
  </div>

  <!-- Флеши при ударах -->
  <div id="hf1" style="position:absolute;inset:0;background:rgba(232,56,56,0);transition:background .12s;pointer-events:none;z-index:10"></div>
  <div id="hf2" style="position:absolute;inset:0;background:rgba(61,123,200,0);transition:background .12s;pointer-events:none;z-index:10"></div>
</div>
```

---

## ИЗМЕНЕНИЕ 2: CSS для новых элементов сцены

**ДОБАВИТЬ в конец CSS** (перед `</style>`):

```css
/* ===== DUNGEON SCENE — AI BG ===== */
.dung-bg{
  position:absolute;inset:0;z-index:0;overflow:hidden;
}
.dung-bg-shimmer{
  position:absolute;inset:0;
  background:linear-gradient(90deg,#040810 25%,#060e1e 50%,#040810 75%);
  background-size:600px 100%;
  animation:shimmer 2s infinite;
}
.dung-bg-img{
  position:absolute;inset:0;
  width:100%;height:100%;
  object-fit:cover;
  filter:brightness(.55) saturate(1.2);
}
.dung-bg-overlay{
  position:absolute;inset:0;
  background:
    linear-gradient(to bottom, rgba(4,8,16,.3) 0%, rgba(4,8,16,0) 40%, rgba(4,8,16,.7) 100%),
    linear-gradient(to right,  rgba(4,8,16,.5) 0%, rgba(4,8,16,0) 30%, rgba(4,8,16,0) 70%, rgba(4,8,16,.5) 100%);
  pointer-events:none;
}

/* Факелы */
.dung-torch{
  position:absolute;bottom:30%;z-index:2;
  display:flex;flex-direction:column;align-items:center;
}
.dung-torch-l{left:24px}
.dung-torch-r{right:24px}
.dung-torch::after{
  content:'';
  width:6px;height:40px;
  background:linear-gradient(180deg,#6a4a20,#3a2810);
  border-radius:3px;
  display:block;
}
.dung-torch-flame{
  width:12px;height:18px;
  background:radial-gradient(ellipse at 50% 80%,#f39c12,#e67e22,transparent);
  border-radius:50% 50% 30% 30%;
  animation:flame-flicker 1.2s ease-in-out infinite;
  margin-bottom:-2px;
  filter:blur(.5px);
  box-shadow:0 0 8px #f39c12, 0 0 20px rgba(243,156,18,.4);
}
@keyframes flame-flicker{
  0%,100%{transform:scaleX(1) scaleY(1) translateY(0);opacity:1}
  25%{transform:scaleX(.85) scaleY(1.1) translateY(-1px);opacity:.9}
  50%{transform:scaleX(1.1) scaleY(.95) translateY(1px);opacity:1}
  75%{transform:scaleX(.9) scaleY(1.08) translateY(-1px);opacity:.95}
}

/* AI враг в сцене */
.enemy-ai-wrap{
  position:relative;
  display:flex;flex-direction:column;align-items:center;
}
.enemy-ai-img{
  width:110px;height:150px;
  object-fit:contain;
  filter:drop-shadow(0 0 20px rgba(200,32,32,.4)) drop-shadow(0 8px 16px rgba(0,0,0,.8));
  display:block;
}
.enemy-ai-shimmer{
  width:110px;height:150px;
  background:linear-gradient(90deg,#080f1a 25%,#0c1624 50%,#080f1a 75%);
  background-size:400px 100%;
  animation:shimmer 1.5s infinite;
  border-radius:var(--r);
}
/* Тень врага на полу */
.enemy-shadow{
  width:70px;height:8px;
  background:radial-gradient(ellipse,rgba(0,0,0,.6) 0%,transparent 70%);
  margin-top:-4px;
}
```

---

## ИЗМЕНЕНИЕ 3: JS — промпты и URL для Pollinations

**НАЙДИ** строку `var ENEMIES = [` и **ВСЕ данные врагов** (весь массив до `];`)

**ЗАМЕНИ весь массив ENEMIES НА:**
```javascript
// Промпты для AI-картинок врагов (Pollinations)
var ENEMY_PROMPTS = {
  'knight':   'dark fantasy undead black knight warrior, full plate armor, red glowing eyes, rotting flesh, skull motif, dramatic lighting, dark background, Dragon Age Origins concept art, highly detailed, masterpiece',
  'manticore':'dark fantasy manticore monster, lion body scorpion tail, crimson scales, fierce expression, fantasy creature, Dragon Age concept art style, dark dramatic lighting, detailed',
  'griffin':  'dark fantasy golden griffin boss monster, eagle head lion body, glowing eyes, massive wings spread, epic scale, Dragon Age Origins concept art, cinematic dramatic lighting',
  'mimic':    'dark fantasy treasure chest mimic monster, rows of sharp teeth, glowing eyes, cursed gold, dark slimy wood, Dragon Age concept art, dramatic horror lighting',
  'skeleton': 'dark fantasy skeleton warrior undead, ancient rusted armor, sword and shield, glowing eye sockets, cracked bones, Dragon Age Origins concept art style, dark atmosphere',
  'mage':     'dark fantasy evil sorcerer lich undead, dark robes, purple magical energy, glowing staff, skull ornaments, Dragon Age Origins concept art, cinematic dark lighting',
  'werewolf': 'dark fantasy werewolf monster, massive clawed beast, torn clothing, amber eyes, snarling, moonlight silhouette, Dragon Age Origins concept art style, dramatic lighting',
  'vampire':  'dark fantasy vampire lord, pale aristocratic face, red eyes, black cape, elongated fangs, gothic manor background, Dragon Age concept art, dramatic lighting',
  'gorgon':   'dark fantasy gorgon medusa monster, snake hair writhing, stone-turning gaze, green scales, ancient ruins, Dragon Age Origins concept art, dramatic lighting',
  'ogre':     'dark fantasy ogre giant monster, massive muscular body, crude club weapon, mossy skin, angry expression, swamp background, Dragon Age Origins concept art style'
};

// Фоны подземелья по типу врага
var DUNGEON_BG_PROMPTS = {
  'knight':   'dark fantasy dungeon crypt, stone walls, torchlight, ancient bones, gothic arches, Dragon Age Origins environment concept art, highly detailed, atmospheric, no characters',
  'manticore':'dark fantasy cave cavern, stalactites, bioluminescent fungi, dark pools, atmospheric mist, Dragon Age Origins environment art, detailed, no characters',
  'griffin':  'dark fantasy mountain ruins, crumbling fortress, stormy sky, lightning, epic vista, Dragon Age Origins environment concept art, atmospheric, no characters',
  'mimic':    'dark fantasy treasure vault dungeon, gold coins, cursed artifacts, dim torchlight, cobwebs, Dragon Age Origins environment art, detailed, no characters',
  'skeleton': 'dark fantasy ancient crypt, stone sarcophagi, cobwebs, dim torchlight, runic carvings on walls, Dragon Age Origins environment art, atmospheric, no characters',
  'mage':     'dark fantasy arcane tower interior, floating magical runes, purple energy, ancient tomes, Dragon Age Origins environment concept art, atmospheric, no characters',
  'werewolf': 'dark fantasy cursed forest at night, twisted trees, moonlight, fog, ancient stone ruins, Dragon Age Origins environment art, atmospheric, no characters',
  'vampire':  'dark fantasy gothic castle interior, ornate columns, moonlight through stained glass, candles, Dragon Age Origins environment concept art, atmospheric, no characters',
  'gorgon':   'dark fantasy ancient Greek ruins underground, stone statues, green mist, dim blue light, Dragon Age Origins environment art, atmospheric, no characters',
  'ogre':     'dark fantasy swamp dungeon, murky water, rotting wood, dim greenish light, Dragon Age Origins environment concept art, atmospheric, no characters'
};

// Ключи для привязки врага к промпту
var ENEMIES = [
  { n:'Чёрный Рыцарь',  t:'Нежить · Элита',     hp:350, dmg:35, xp:200, g:150, key:'knight'   },
  { n:'Мантикора',      t:'Зверь · Редкий',      hp:280, dmg:45, xp:250, g:200, key:'manticore'},
  { n:'Грифон',         t:'Мифический · Босс',   hp:500, dmg:55, xp:400, g:300, isBoss:true, key:'griffin'  },
  { n:'Мимик',          t:'Ловушка · Хитрый',    hp:200, dmg:60, xp:180, g:350, key:'mimic'    },
  { n:'Скелет-воин',    t:'Нежить · Обычный',    hp:180, dmg:28, xp:120, g:80,  key:'skeleton' },
  { n:'Тёмный маг',     t:'Нежить · Элита',      hp:240, dmg:50, xp:220, g:170, key:'mage'     },
  { n:'Вервольф',       t:'Зверь · Редкий',      hp:320, dmg:42, xp:260, g:190, key:'werewolf' },
  { n:'Вампир',         t:'Нежить · Редкий',     hp:290, dmg:44, xp:240, g:200, key:'vampire'  },
  { n:'Горгона',        t:'Мифический · Элита',  hp:380, dmg:48, xp:310, g:240, key:'gorgon'   },
  { n:'Огр',            t:'Зверь · Обычный',     hp:420, dmg:38, xp:280, g:150, key:'ogre'     },
];
```

---

## ИЗМЕНЕНИЕ 4: JS — функции генерации AI-картинок для подземелья

**НАЙДИ функцию** `function curEnemy()` и **ДОБАВЬ ПЕРЕД НЕЙ** новые функции:

```javascript
// Генерация URL для AI-картинки врага
function enemyImgUrl(enemy) {
  var prompt = ENEMY_PROMPTS[enemy.key] || 'dark fantasy monster, Dragon Age concept art style, dark background';
  var seed = enemy.key.split('').reduce(function(a, c) { return a + c.charCodeAt(0); }, 0);
  return 'https://image.pollinations.ai/prompt/'
    + encodeURIComponent(prompt + ', dark color palette, highly detailed, masterpiece')
    + '?width=300&height=400&seed=' + seed + '&nologo=true&model=flux';
}

// Генерация URL для AI-фона сцены
function dungeonBgUrl(enemy) {
  var prompt = DUNGEON_BG_PROMPTS[enemy.key] || 'dark fantasy dungeon, Dragon Age Origins concept art, atmospheric, no characters';
  var seed = (enemy.key.split('').reduce(function(a, c) { return a + c.charCodeAt(0); }, 0)) + 9000;
  return 'https://image.pollinations.ai/prompt/'
    + encodeURIComponent(prompt + ', dark color palette, cinematic, highly detailed')
    + '?width=800&height=320&seed=' + seed + '&nologo=true&model=flux';
}

// Обновить фон сцены при смене врага
function updateDungeonBg(enemy) {
  var shimmer = document.getElementById('dung-bg-shimmer');
  var img     = document.getElementById('dung-bg-img');
  if (!shimmer || !img) return;

  // Показываем shimmer пока грузится
  shimmer.style.display = 'block';
  img.style.opacity = '0';
  img.src = dungeonBgUrl(enemy);
}
```

---

## ИЗМЕНЕНИЕ 5: JS — функция refreshDungeonEnemy с AI-картинкой

**НАЙДИ и ЗАМЕНИ** функцию `refreshDungeonEnemy`:

```javascript
function refreshDungeonEnemy() {
  var e = curEnemy();
  var p = S.dungeonEHPMax > 0 ? Math.max(0, Math.round(S.dungeonEHP / S.dungeonEHPMax * 100)) : 100;

  document.getElementById('d-enemy-name').textContent = e.n;
  document.getElementById('d-enemy-type').textContent = e.t;
  document.getElementById('d-ehp-bar').style.width = p + '%';
  document.getElementById('d-ehp-val').textContent = S.dungeonEHP + '/' + S.dungeonEHPMax;
  document.getElementById('d-floor').textContent = 'Этаж ' + (S.dungeonIdx + 1);

  // AI-картинка врага вместо SVG
  var wrap = document.getElementById('enemy-wrap');
  var url  = enemyImgUrl(e);
  var seed = e.key;

  wrap.innerHTML =
    '<div class="enemy-ai-wrap enemy-sprite">'
    + '<div class="enemy-ai-shimmer" id="enemy-shimmer-' + seed + '"></div>'
    + '<img class="enemy-ai-img" id="enemy-img-' + seed + '" src="' + url + '" alt="' + e.n + '" '
    + 'onload="this.style.opacity=1;var s=document.getElementById(\'enemy-shimmer-' + seed + '\');if(s)s.style.display=\'none\';" '
    + 'onerror="this.style.display=\'none\';" '
    + 'style="opacity:0;transition:opacity .8s ease;display:block">'
    + '<div class="enemy-shadow"></div>'
    + '</div>';

  // Обновляем фон сцены
  updateDungeonBg(e);

  // Список врагов впереди
  var coming = document.getElementById('d-coming');
  coming.innerHTML = '';
  for (var i = 1; i <= Math.min(3, ENEMIES.length - 1); i++) {
    var ne = ENEMIES[(S.dungeonIdx + i) % ENEMIES.length];
    var div = document.createElement('div');
    div.style.cssText = 'display:flex;align-items:center;gap:8px;font-size:11px;color:var(--text2);padding:3px 0';
    div.innerHTML = '<span style="font-size:14px">⚔</span>'
      + '<span>' + ne.n + '</span>'
      + '<span style="margin-left:auto;font-family:var(--ff-title);font-size:8px;color:var(--text3);letter-spacing:1px">'
      + (ne.t.split(' · ')[1] || '') + '</span>';
    coming.appendChild(div);
  }
}
```

---

## ИЗМЕНЕНИЕ 6: animEnemy — обновить под новую структуру

**НАЙДИ и ЗАМЕНИ** функцию `animEnemy`:

```javascript
function animEnemy(cls) {
  var wrap = document.getElementById('enemy-wrap');
  if (!wrap) return;
  // Ищем .enemy-ai-wrap или svg — работает с обоими
  var sp = wrap.querySelector('.enemy-ai-wrap') || wrap.querySelector('svg');
  if (!sp) return;
  if (!sp.classList.contains('enemy-sprite')) sp.classList.add('enemy-sprite');
  sp.classList.remove('hit','dying');
  void sp.offsetWidth;
  sp.classList.add(cls);
  if (cls !== 'dying') {
    setTimeout(function() { sp.classList.remove(cls); }, 420);
  }
}
```

---

## ИЗМЕНЕНИЕ 7: CSS — анимации для AI-враага

**ДОБАВИТЬ в блок анимаций** (рядом с `.enemy-sprite`):

```css
/* AI враг — те же классы анимации, применяются к .enemy-ai-wrap */
.enemy-ai-wrap.hit{
  animation:enemy-hit .4s cubic-bezier(.36,.07,.19,.97) both;
}
.enemy-ai-wrap.dying{
  animation:enemy-die .7s cubic-bezier(.55,.055,.675,.19) forwards;
}
.enemy-ai-wrap{
  animation:enemy-idle 2.8s ease-in-out infinite;
}
/* Переопределяем idle для AI-картинки — мягче */
@keyframes enemy-idle-ai{
  0%,100%{transform:translateY(0) scale(1)}
  50%{transform:translateY(-6px) scale(1.01)}
}
.enemy-ai-wrap{
  animation:enemy-idle-ai 3s ease-in-out infinite;
}
```

---

## Что изменится

| Элемент | До | После |
|---|---|---|
| Фон сцены | Статичный SVG (полосы, факелы) | AI-картинка в стиле Dragon Age, уникальная для каждого врага |
| Враги | Примитивный SVG | AI-портрет монстра 300×400px с drop-shadow |
| Фон при смене врага | Не меняется | Загружается новая AI-картинка с shimmer-заглушкой |
| Факелы | SVG эллипсы | CSS-анимированное пламя с glow |
| Тень врага | Нет | Радиальный градиент под персонажем |
| Загрузка | Мгновенно (SVG) | Shimmer → плавный fade-in картинки за 0.8s |

**Важно:** первая загрузка каждого врага занимает 2-5 секунд (Pollinations генерирует).
Повторный вход в подземелье — картинки уже кэшированы браузером, загрузка мгновенная.
