# QuestFlow — JS Патч 3: Боевые анимации

## Инструкция для Claude Code

Это замена JS-функций в `questflow.html`. Каждая функция помечена.
Применяй точечно — только замена указанных функций, не трогай остальное.

---

## ФУНКЦИЯ 1: showDmgNum — замени целиком

**НАЙДИ:**
```javascript
// Show floating damage number
function showDmgNum(val, type, x, y) {
  var scene = document.getElementById('d-scene');
  var num = document.createElement('div');
  num.className = 'dmg-num ' + (type || 'phys');
  num.textContent = (type === 'heal' ? '+' : '-') + val;
  num.style.left = (x || 150) + 'px';
  num.style.top  = (y || 120) + 'px';
  scene.appendChild(num);
  setTimeout(function() { num.remove(); }, 820);
}
```

**ЗАМЕНИ НА:**
```javascript
// Show floating damage number — enhanced
function showDmgNum(val, type, x, y) {
  var scene = document.getElementById('d-scene');
  if (!scene) return;
  var num = document.createElement('div');
  num.className = 'dmg-num ' + (type || 'phys');

  // Префикс и форматирование
  var prefix = type === 'heal' ? '+' : '-';
  num.textContent = prefix + val;

  // Критический урон — крупнее если > 50
  if (val > 50 && type !== 'heal') {
    num.style.fontSize = '28px';
    num.textContent = '⚡' + prefix + val;
  }

  // Случайный разброс позиции
  var rx = (Math.random() - 0.5) * 30;
  num.style.left = ((x || 150) + rx) + 'px';
  num.style.top  = (y || 120) + 'px';

  // Случайный наклон
  var angle = (Math.random() - 0.5) * 16;
  num.style.transform = 'rotate(' + angle + 'deg)';

  scene.appendChild(num);
  setTimeout(function() {
    if (num.parentNode) num.remove();
  }, 900);
}
```

---

## ФУНКЦИЯ 2: animHero — замени целиком

**НАЙДИ:**
```javascript
// Animate hero sprite
function animHero(cls) {
  var el = document.getElementById('hero-sprite');
  if (!el) return;
  el.classList.remove('attacking','casting','hit');
  el.style.animation = 'none';
  void el.offsetWidth; // reflow
  el.classList.add(cls);
  el.style.animation = '';
  setTimeout(function() { el.classList.remove(cls); }, 500);
}
```

**ЗАМЕНИ НА:**
```javascript
// Animate hero sprite — enhanced
function animHero(cls) {
  var el = document.getElementById('hero-sprite');
  if (!el) return;

  // Снимаем все классы и сбрасываем анимацию
  el.classList.remove('attacking','casting','hit');
  el.style.animation = 'none';
  void el.offsetWidth; // reflow
  el.classList.add(cls);
  el.style.animation = '';

  // Длительность зависит от типа действия
  var dur = cls === 'casting' ? 520 : cls === 'attacking' ? 440 : 400;
  setTimeout(function() { el.classList.remove(cls); }, dur);
}
```

---

## ФУНКЦИЯ 3: animEnemy — замени целиком

**НАЙДИ:**
```javascript
// Animate enemy sprite
function animEnemy(cls) {
  var wrap = document.getElementById('enemy-wrap');
  if (!wrap) return;
  var sp = wrap.querySelector('svg');
  if (!sp) return;
  if (!sp.classList.contains('enemy-sprite')) sp.classList.add('enemy-sprite');
  sp.classList.remove('hit','dying');
  void sp.offsetWidth;
  sp.classList.add(cls);
  if (cls !== 'dying') setTimeout(function() { sp.classList.remove(cls); }, 400);
}
```

**ЗАМЕНИ НА:**
```javascript
// Animate enemy sprite — enhanced
function animEnemy(cls) {
  var wrap = document.getElementById('enemy-wrap');
  if (!wrap) return;
  var sp = wrap.querySelector('svg');
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

## ФУНКЦИЯ 4: dFlash — замени целиком

**НАЙДИ:**
```javascript
function dFlash(id, col) {
  var el = document.getElementById(id);
  el.style.background = col;
  setTimeout(function() { el.style.background = 'rgba(0,0,0,0)'; }, 140);
}
```

**ЗАМЕНИ НА:**
```javascript
function dFlash(id, col) {
  var el = document.getElementById(id);
  if (!el) return;
  // Flash + плавное затухание
  el.style.transition = 'background 0s';
  el.style.background = col;
  setTimeout(function() {
    el.style.transition = 'background 180ms ease';
    el.style.background = 'rgba(0,0,0,0)';
  }, 60);
}

// Camera shake — встряска сцены
function cameraShake(intensity) {
  var scene = document.querySelector('.dung-scene');
  if (!scene) return;
  // Снимаем и перезапускаем анимацию (для повторных ударов подряд)
  scene.classList.remove('shake');
  void scene.offsetWidth;
  scene.classList.add('shake');
  // Интенсивность через CSS-переменную
  scene.style.setProperty('--shake-intensity', (intensity || 1) + 'px');
  setTimeout(function() { scene.classList.remove('shake'); }, 380);
}

// Hit stop — мини-пауза в момент удара (ощущение импакта)
function hitStop(ms) {
  var btns = document.querySelectorAll('.act-btn');
  btns.forEach(function(b) { b.disabled = true; });
  setTimeout(function() {
    // Кнопки разблокирует основная логика dAct
  }, ms || 80);
}

// Спавн частиц при смерти врага
function spawnDeathParticles() {
  var scene = document.getElementById('d-scene');
  if (!scene) return;
  var colors = ['#ff4040','#ff8040','#ffc040','#ffffff'];
  var centerX = scene.offsetWidth * 0.6;
  var centerY = scene.offsetHeight * 0.4;

  for (var i = 0; i < 12; i++) {
    (function(i) {
      setTimeout(function() {
        var p = document.createElement('div');
        var color = colors[Math.floor(Math.random() * colors.length)];
        var size = 3 + Math.random() * 5;
        var angle = (Math.random() * 360) * Math.PI / 180;
        var dist  = 30 + Math.random() * 80;
        var tx = Math.cos(angle) * dist;
        var ty = Math.sin(angle) * dist - 40;

        p.style.cssText = [
          'position:absolute',
          'width:' + size + 'px',
          'height:' + size + 'px',
          'background:' + color,
          'border-radius:50%',
          'left:' + (centerX + (Math.random()-0.5)*40) + 'px',
          'top:' + (centerY + (Math.random()-0.5)*20) + 'px',
          'pointer-events:none',
          'z-index:30',
          'box-shadow:0 0 ' + (size*2) + 'px ' + color,
          'transition:all 0.6s cubic-bezier(.2,.8,.4,1)',
          'opacity:1'
        ].join(';');

        scene.appendChild(p);

        // Запускаем движение через reflow
        void p.offsetWidth;
        p.style.transform = 'translate(' + tx + 'px,' + ty + 'px)';
        p.style.opacity = '0';

        setTimeout(function() {
          if (p.parentNode) p.remove();
        }, 700);
      }, i * 30);
    })(i);
  }
}
```

---

## ФУНКЦИЯ 5: dAct — замени блок `if (t === 'attack')`

**НАЙДИ внутри функции dAct:**
```javascript
  if (t === 'attack') {
    var dmg = S.hero.dmg + Math.round((Math.random() - 0.3) * 12);
    S.dungeonEHP = Math.max(0, S.dungeonEHP - dmg);
    animHero('attacking');
    setTimeout(function() { animEnemy('hit'); }, 180);
    dFlash('hf1', 'rgba(232,56,56,.15)');
    showDmgNum(dmg, 'phys', 380, 80 + Math.random() * 40);
    dLog('⚔ ' + dmg + ' урона → ' + e.n + '!');
  } else if (t === 'spell') {
    if (S.hero.cmp < 20) { dLog('❌ Мало маны!'); dSetBtns(false); return; }
    var sDmg = Math.round(S.hero.dmg * 1.8 + Math.random() * 20);
    S.dungeonEHP = Math.max(0, S.dungeonEHP - sDmg);
    S.hero.cmp = Math.max(0, S.hero.cmp - 20);
    animHero('casting');
    setTimeout(function() { animEnemy('hit'); dFlash('hf1', 'rgba(155,122,224,.2)'); }, 200);
    showDmgNum(sDmg, 'magic', 370, 70 + Math.random() * 30);
    dLog('✨ Заклятие! ' + sDmg + ' маг. урона!', 'sys');
    refreshDungeonHero();
  } else if (t === 'potion') {
```

**ЗАМЕНИ НА:**
```javascript
  if (t === 'attack') {
    var dmg = S.hero.dmg + Math.round((Math.random() - 0.3) * 12);
    S.dungeonEHP = Math.max(0, S.dungeonEHP - dmg);

    // Hero swing
    animHero('attacking');

    // Hit stop — мгновенная пауза на момент удара
    setTimeout(function() {
      animEnemy('hit');
      dFlash('hf1', 'rgba(232,56,56,.18)');
      showDmgNum(dmg, 'phys', 370 + Math.random()*30, 70 + Math.random() * 40);
      // Camera shake с интенсивностью от урона
      cameraShake(Math.min(dmg / 20, 3));
    }, 200);

    dLog('⚔ ' + dmg + ' урона → ' + e.n + '!');

  } else if (t === 'spell') {
    if (S.hero.cmp < 20) { dLog('❌ Мало маны!'); dSetBtns(false); return; }
    var sDmg = Math.round(S.hero.dmg * 1.8 + Math.random() * 20);
    S.dungeonEHP = Math.max(0, S.dungeonEHP - sDmg);
    S.hero.cmp = Math.max(0, S.hero.cmp - 20);

    animHero('casting');
    setTimeout(function() {
      animEnemy('hit');
      dFlash('hf1', 'rgba(155,122,224,.25)');
      showDmgNum(sDmg, 'magic', 360 + Math.random()*20, 60 + Math.random() * 30);
      cameraShake(1.5);
    }, 220);

    dLog('✨ Заклятие! ' + sDmg + ' маг. урона!', 'sys');
    refreshDungeonHero();
  } else if (t === 'potion') {
```

---

## ФУНКЦИЯ 6: enemyAtk — добавь camera shake

**НАЙДИ внутри функции enemyAtk:**
```javascript
  animHero('hit');
  dFlash('hf2', 'rgba(61,123,200,.18)');
  showDmgNum(dmg, 'phys', 80 + Math.random() * 30, 90 + Math.random() * 30);
```

**ЗАМЕНИ НА:**
```javascript
  animHero('hit');
  dFlash('hf2', 'rgba(61,123,200,.22)');
  showDmgNum(dmg, 'phys', 70 + Math.random() * 40, 80 + Math.random() * 40);
  cameraShake(2); // Удар по герою — встряска чуть сильнее
```

---

## ФУНКЦИЯ 7: добавь частицы смерти врага

**НАЙДИ:**
```javascript
  if (S.dungeonEHP <= 0) {
    animEnemy('dying');
    if (e.isBoss) S.killedBoss = true;
```

**ЗАМЕНИ НА:**
```javascript
  if (S.dungeonEHP <= 0) {
    animEnemy('dying');
    spawnDeathParticles(); // Частицы при гибели врага
    cameraShake(2.5);
    if (e.isBoss) S.killedBoss = true;
```

---

## Итог — что изменится в бою

| Момент | До | После |
|---|---|---|
| Удар героем | Простой translateX | Рывок вперёд → enemy отбрасывает → camera shake |
| Числа урона | Мелкие, прямые | Крупные с наклоном, критические с ⚡ и большим размером |
| Заклинание | Анимация + flash | То же + camera shake + фиолетовый flash |
| Удар по герою | Flash экрана | Flash + camera shake сильнее (2 единицы vs 1) |
| Смерть врага | Просто dying-класс | dying + 12 частиц разлетаются + camera shake |
| Flash экрана | Резкий on/off | Мгновенный on, плавный off за 180ms |
