# QuestFlow — Патч 9: Звуки (Web Audio API) и вибрация

## Проверка совместимости
- dAct: Патч 3 заменяет блоки attack/spell — звуки добавляем в те же блоки ✓
- doComplete: Патч 5 полностью заменяет функцию — звук добавляем внутрь ✓
- gainXP: Патч 5 заменяет — звук level up добавляем туда ✓
- enemyAtk: Патч 3 добавляет camera shake — звук добавляем совместимо ✓
- showLevelUp: новая функция из Патча 5 — добавляем звук напрямую ✓
- Патчи 1,2,4,6,7,8 — не пересекаются со звуком ✓
- Никаких внешних файлов — всё синтезируется через Web Audio API ✓
- Работает офлайн и онлайн ✓

---

## ИЗМЕНЕНИЕ 1: JS — движок звука

**НАЙДИ** строку `// =============================================` `// ONBOARDING`
и **ДОБАВЬ ПЕРЕД НЕЙ** весь блок:

```javascript
// =============================================
// AUDIO ENGINE
// =============================================

var _audioCtx = null;
var _audioMuted = false;

// Инициализация AudioContext — только после первого взаимодействия
function getAudioCtx() {
  if (!_audioCtx) {
    try {
      _audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    } catch(e) { return null; }
  }
  // Возобновляем если браузер приостановил
  if (_audioCtx.state === 'suspended') {
    _audioCtx.resume();
  }
  return _audioCtx;
}

// Инициализируем контекст при первом клике пользователя
document.addEventListener('click', function initAudio() {
  getAudioCtx();
  document.removeEventListener('click', initAudio);
}, { once: true });

// Переключатель звука (вызывается из настроек)
function toggleMute() {
  _audioMuted = !_audioMuted;
  var btn = document.getElementById('mute-btn');
  if (btn) btn.textContent = _audioMuted ? '🔇' : '🔊';
  showToast(_audioMuted ? 'Звук выключен' : 'Звук включён');
}

// ---- Низкоуровневые примитивы ----

// Воспроизвести тон с огибающей
function playTone(freq, type, attack, sustain, release, gainVal, delay) {
  var ctx = getAudioCtx();
  if (!ctx || _audioMuted) return;
  var t = ctx.currentTime + (delay || 0);
  var osc  = ctx.createOscillator();
  var gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.type = type || 'sine';
  osc.frequency.setValueAtTime(freq, t);
  gain.gain.setValueAtTime(0, t);
  gain.gain.linearRampToValueAtTime(gainVal || 0.3, t + (attack || 0.01));
  gain.gain.setValueAtTime(gainVal || 0.3, t + (attack || 0.01) + (sustain || 0.1));
  gain.gain.exponentialRampToValueAtTime(0.001, t + (attack || 0.01) + (sustain || 0.1) + (release || 0.1));
  osc.start(t);
  osc.stop(t + (attack || 0.01) + (sustain || 0.1) + (release || 0.1) + 0.01);
}

// Шум (для ударов и взрывов)
function playNoise(duration, gainVal, filterFreq, delay) {
  var ctx = getAudioCtx();
  if (!ctx || _audioMuted) return;
  var t = ctx.currentTime + (delay || 0);
  var bufSize = ctx.sampleRate * duration;
  var buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
  var data = buf.getChannelData(0);
  for (var i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1;
  var src    = ctx.createBufferSource();
  var filter = ctx.createBiquadFilter();
  var gain   = ctx.createGain();
  src.buffer = buf;
  filter.type = 'bandpass';
  filter.frequency.value = filterFreq || 800;
  filter.Q.value = 1.5;
  src.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);
  gain.gain.setValueAtTime(gainVal || 0.4, t);
  gain.gain.exponentialRampToValueAtTime(0.001, t + duration);
  src.start(t);
  src.stop(t + duration + 0.01);
}

// Вибрация (только мобильные)
function vibrate(pattern) {
  if ('vibrate' in navigator) {
    try { navigator.vibrate(pattern); } catch(e) {}
  }
}

// ---- Игровые звуки ----

// Удар мечом — металлический лязг + шум
function sndSword() {
  playTone(180, 'sawtooth', 0.005, 0.04, 0.18, 0.25);
  playTone(280, 'sawtooth', 0.005, 0.02, 0.12, 0.15, 0.01);
  playNoise(0.12, 0.35, 2000);
  vibrate([40]);
}

// Заклинание — мистический аккорд
function sndSpell() {
  playTone(440, 'sine', 0.02, 0.15, 0.4, 0.2);
  playTone(554, 'sine', 0.02, 0.12, 0.35, 0.15, 0.05);
  playTone(659, 'sine', 0.02, 0.10, 0.3,  0.12, 0.1);
  playTone(880, 'sine', 0.04, 0.08, 0.45, 0.08, 0.15);
  vibrate([20, 30, 20]);
}

// Получение урона героем — тупой удар
function sndHit() {
  playTone(80, 'sawtooth', 0.005, 0.06, 0.15, 0.4);
  playNoise(0.15, 0.3, 300);
  vibrate([60]);
}

// Смерть врага — победный звук
function sndEnemyDie() {
  playTone(330, 'square', 0.005, 0.05, 0.1, 0.2);
  playTone(440, 'square', 0.005, 0.05, 0.1, 0.2, 0.08);
  playTone(550, 'square', 0.005, 0.06, 0.15, 0.2, 0.16);
  playTone(660, 'sine',   0.01,  0.08, 0.25, 0.25, 0.24);
  vibrate([30, 20, 60]);
}

// Завершение квеста — торжественный аккорд
function sndQuestComplete() {
  // Нарастающий мажорный аккорд
  playTone(261, 'sine', 0.01, 0.1, 0.5, 0.2);        // C
  playTone(329, 'sine', 0.01, 0.1, 0.5, 0.18, 0.08); // E
  playTone(392, 'sine', 0.01, 0.1, 0.5, 0.16, 0.16); // G
  playTone(523, 'sine', 0.02, 0.12, 0.6, 0.22, 0.24); // C8va
  playNoise(0.06, 0.12, 5000, 0.02); // лёгкий блеск
  vibrate([40, 30, 80]);
}

// Level Up — эпический восходящий арпеджио
function sndLevelUp() {
  var notes = [261, 329, 392, 523, 659, 784, 1046];
  notes.forEach(function(freq, i) {
    playTone(freq, 'sine', 0.01, 0.08, 0.3, 0.25 - i * 0.02, i * 0.07);
  });
  // Финальный аккорд
  playTone(523, 'triangle', 0.02, 0.2, 0.8, 0.3, 0.56);
  playTone(659, 'triangle', 0.02, 0.2, 0.8, 0.25, 0.58);
  playTone(784, 'triangle', 0.02, 0.2, 0.8, 0.2,  0.60);
  vibrate([50, 30, 50, 30, 100]);
}

// Монеты — звон золота
function sndGold() {
  playTone(880,  'sine', 0.005, 0.03, 0.2, 0.18);
  playTone(1100, 'sine', 0.005, 0.02, 0.15, 0.14, 0.04);
  playTone(1320, 'sine', 0.005, 0.02, 0.12, 0.10, 0.08);
}

// Зелье — бульканье
function sndPotion() {
  playTone(440, 'sine', 0.01, 0.04, 0.12, 0.2);
  playTone(550, 'sine', 0.01, 0.03, 0.10, 0.15, 0.06);
  playTone(660, 'sine', 0.01, 0.03, 0.10, 0.12, 0.12);
  vibrate([15]);
}

// Навигация — мягкий тик
function sndNav() {
  playTone(600, 'sine', 0.005, 0.01, 0.06, 0.08);
}

// Открытие модалки — лёгкий whoosh
function sndModal() {
  playTone(300, 'sine', 0.01, 0.02, 0.12, 0.1);
  playTone(450, 'sine', 0.01, 0.01, 0.08, 0.07, 0.03);
}

// Ошибка — низкий дабл-бип
function sndError() {
  playTone(200, 'square', 0.005, 0.04, 0.08, 0.2);
  playTone(160, 'square', 0.005, 0.04, 0.08, 0.2, 0.12);
  vibrate([80]);
}

// Онбординг — выбор класса
function sndSelect() {
  playTone(500, 'sine', 0.005, 0.02, 0.1, 0.15);
  playTone(700, 'sine', 0.005, 0.02, 0.08, 0.1, 0.04);
}
```

---

## ИЗМЕНЕНИЕ 2: Кнопка mute в topbar

**НАЙДИ в HTML** строку:
```html
<button class="apibtn" id="api-btn" onclick="openM('m-api')">⚙ Claude API</button>
```

**ЗАМЕНИ НА:**
```html
<button class="apibtn" id="mute-btn" onclick="toggleMute()" title="Звук">🔊</button>
<button class="apibtn" id="api-btn" onclick="openM('m-api')">⚙ Claude API</button>
```

---

## ИЗМЕНЕНИЕ 3: звуки в dAct (Патч 3 уже изменил эту функцию)

**В финальной версии `dAct` из Патча 3 найди блок `if (t === 'attack')`:**
```javascript
  if (t === 'attack') {
    var dmg = S.hero.dmg + Math.round((Math.random() - 0.3) * 12);
    S.dungeonEHP = Math.max(0, S.dungeonEHP - dmg);
    animHero('attacking');
    setTimeout(function() {
      animEnemy('hit');
      dFlash('hf1', 'rgba(232,56,56,.18)');
      showDmgNum(dmg, 'phys', 370 + Math.random()*30, 70 + Math.random() * 40);
      cameraShake(Math.min(dmg / 20, 3));
    }, 200);
    dLog('⚔ ' + dmg + ' урона → ' + e.n + '!');
```

**ЗАМЕНИ НА:**
```javascript
  if (t === 'attack') {
    var dmg = S.hero.dmg + Math.round((Math.random() - 0.3) * 12);
    S.dungeonEHP = Math.max(0, S.dungeonEHP - dmg);
    animHero('attacking');
    sndSword(); // звук удара
    setTimeout(function() {
      animEnemy('hit');
      dFlash('hf1', 'rgba(232,56,56,.18)');
      showDmgNum(dmg, 'phys', 370 + Math.random()*30, 70 + Math.random() * 40);
      cameraShake(Math.min(dmg / 20, 3));
    }, 200);
    dLog('⚔ ' + dmg + ' урона → ' + e.n + '!');
```

**Найди блок `else if (t === 'spell')`:**
```javascript
    animHero('casting');
    setTimeout(function() {
      animEnemy('hit');
      dFlash('hf1', 'rgba(155,122,224,.25)');
      showDmgNum(sDmg, 'magic', 360 + Math.random()*20, 60 + Math.random() * 30);
      cameraShake(1.5);
    }, 220);
```

**ЗАМЕНИ НА:**
```javascript
    animHero('casting');
    sndSpell(); // звук заклинания
    setTimeout(function() {
      animEnemy('hit');
      dFlash('hf1', 'rgba(155,122,224,.25)');
      showDmgNum(sDmg, 'magic', 360 + Math.random()*20, 60 + Math.random() * 30);
      cameraShake(1.5);
    }, 220);
```

**Найди блок `else if (t === 'potion')`:**
```javascript
    S.hero.chp = Math.min(S.hero.hp, S.hero.chp + 80);
    showDmgNum(80, 'heal', 100, 100);
    dLog('⚗️ +80 HP!', 'heal'); refreshDungeonHero(); dSetBtns(false); return;
```

**ЗАМЕНИ НА:**
```javascript
    S.hero.chp = Math.min(S.hero.hp, S.hero.chp + 80);
    showDmgNum(80, 'heal', 100, 100);
    sndPotion(); // звук зелья
    dLog('⚗️ +80 HP!', 'heal'); refreshDungeonHero(); dSetBtns(false); return;
```

**Найди смерть врага в dAct:**
```javascript
  if (S.dungeonEHP <= 0) {
    animEnemy('dying');
    spawnDeathParticles();
    cameraShake(2.5);
    if (e.isBoss) S.killedBoss = true;
```

**ЗАМЕНИ НА:**
```javascript
  if (S.dungeonEHP <= 0) {
    animEnemy('dying');
    spawnDeathParticles();
    cameraShake(2.5);
    sndEnemyDie(); // звук победы над врагом
    if (e.isBoss) S.killedBoss = true;
```

---

## ИЗМЕНЕНИЕ 4: звук получения урона в enemyAtk (совместимо с Патчем 3)

**Найди в `enemyAtk`** (версия с Патча 3):
```javascript
  animHero('hit');
  dFlash('hf2', 'rgba(61,123,200,.22)');
  showDmgNum(dmg, 'phys', 70 + Math.random() * 40, 80 + Math.random() * 40);
  cameraShake(2);
```

**ЗАМЕНИ НА:**
```javascript
  animHero('hit');
  dFlash('hf2', 'rgba(61,123,200,.22)');
  showDmgNum(dmg, 'phys', 70 + Math.random() * 40, 80 + Math.random() * 40);
  cameraShake(2);
  sndHit(); // звук удара по герою
```

---

## ИЗМЕНЕНИЕ 5: звук завершения квеста в doComplete (совместимо с Патчем 5)

**Найди в `doComplete`** (версия из Патча 5) строку:
```javascript
  showCompletionToast(q.fantasyTitle || q.title, xp, gold);
```

**ЗАМЕНИ НА:**
```javascript
  sndQuestComplete(); // звук завершения квеста
  showCompletionToast(q.fantasyTitle || q.title, xp, gold);
```

---

## ИЗМЕНЕНИЕ 6: звук level up в showLevelUp (функция из Патча 5)

**Найди в `showLevelUp`** строку:
```javascript
  document.body.appendChild(overlay);
  spawnLevelUpParticles(overlay);
```

**ЗАМЕНИ НА:**
```javascript
  document.body.appendChild(overlay);
  spawnLevelUpParticles(overlay);
  sndLevelUp(); // эпический звук повышения уровня
```

---

## ИЗМЕНЕНИЕ 7: звук получения золота в gainGold

**Найди:**
```javascript
function gainGold(v) { S.hero.gold += v; refreshTopBar(); }
```

**ЗАМЕНИ НА:**
```javascript
function gainGold(v) {
  S.hero.gold += v;
  refreshTopBar();
  if (v > 0) sndGold(); // звон монет
}
```

---

## ИЗМЕНЕНИЕ 8: звук навигации и модалок

**Найди функцию `sw`** (версия из Патча 5):
```javascript
function sw(name, el) {
  var current = document.querySelector('.view.active');
```

**ДОБАВЬ** `sndNav();` первой строкой внутри функции:
```javascript
function sw(name, el) {
  sndNav(); // тик при смене вкладки
  var current = document.querySelector('.view.active');
```

**Найди функцию `openM`:**
```javascript
function openM(id) { document.getElementById(id).classList.add('open'); }
```

**ЗАМЕНИ НА:**
```javascript
function openM(id) {
  document.getElementById(id).classList.add('open');
  sndModal(); // whoosh при открытии модалки
}
```

---

## ИЗМЕНЕНИЕ 9: звук ошибки в онбординге (совместимо с Патчем 4)

**Найди в `obNext`** (версия из Патча 4):
```javascript
    showToast('Введи имя героя!');
    return;
```

**ЗАМЕНИ НА:**
```javascript
    sndError(); // звук ошибки
    showToast('Введи имя героя!');
    return;
```

**Найди в `obSelClass`** (версия из Патча 4):
```javascript
  sel.classList.add('sel');
  sel.style.transform = 'scale(1.04)';
```

**ДОБАВЬ** `sndSelect();` после:
```javascript
  sel.classList.add('sel');
  sel.style.transform = 'scale(1.04)';
  sndSelect(); // звук выбора класса
```

---

## Итог

| Действие | Звук | Вибрация |
|---|---|---|
| Удар мечом | Металлический лязг + шум | 40ms |
| Заклинание | Мистический аккорд (3 тона) | 20-30-20ms |
| Получить урон | Тупой удар + низкий шум | 60ms |
| Победа над врагом | Восходящий победный мотив | 30-20-60ms |
| Завершение квеста | Торжественный мажорный аккорд | 40-30-80ms |
| Level Up | Арпеджио + финальный аккорд | 50-30-50-30-100ms |
| Монеты | Лёгкий звон (3 тона) | — |
| Зелье | Бульканье | 15ms |
| Навигация | Мягкий тик | — |
| Модалка | Лёгкий whoosh | — |
| Ошибка | Дабл-бип вниз | 80ms |
| Выбор класса | Двойной тон вверх | — |
| Кнопка mute | Топбар 🔊/🔇 | — |

**Технические детали:**
- Никаких внешних файлов — всё синтезируется через Web Audio API
- AudioContext создаётся при первом клике (требование браузеров)
- Вибрация только на мобильных, на десктопе игнорируется
- Мут сохраняется только в сессии (не в localStorage — не критично)
