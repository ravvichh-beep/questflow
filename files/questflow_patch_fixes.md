# QuestFlow — Патч ИСПРАВЛЕНИЯ

## Применять ПОСЛЕ всех остальных патчей (1–6), в самом конце.

---

## ИСПРАВЛЕНИЕ 1: main-wrap и sidenav высота (Патч 1)

Topbar стал 54px, но main-wrap и sidenav остались на 50px. Это создаст перекрытие на 4px.

**НАЙДИ в CSS:**
```css
.main-wrap{margin-top:50px;margin-left:60px;height:calc(100vh - 50px);overflow-y:auto}
```

**ЗАМЕНИ НА:**
```css
.main-wrap{margin-top:54px;margin-left:62px;height:calc(100vh - 54px);overflow-y:auto}
```

**НАЙДИ в CSS** (в новом блоке sidenav из Патча 1):
```css
.sidenav{
  position:fixed;top:50px;left:0;bottom:0;width:62px;
```

**ЗАМЕНИ** `top:50px` на `top:54px`:
```css
.sidenav{
  position:fixed;top:54px;left:0;bottom:0;width:62px;
```

---

## ИСПРАВЛЕНИЕ 2: удалить мёртвый код из Патча 1

В Патче 1, Блок 7 есть инструкция добавить в `animHero` такой код:
```javascript
el.classList.add(cls);
// Переименование классов под новые анимации
if (cls === 'attacking') el.classList.add('attacking');
if (cls === 'casting') el.classList.add('casting');
if (cls === 'hit') el.classList.add('hit');
```

**Этот код не нужен** — функция `animHero` полностью заменена в Патче 3.
Если Claude Code уже применил этот блок — найди в `animHero` эти три строки `if (cls === ...)` и удали их.

---

## ИСПРАВЛЕНИЕ 3: остановка canvas-анимации при выходе из онбординга (Патч 4)

**НАЙДИ в JS** функцию `initObCanvas`:
```javascript
function initObCanvas() {
  var canvas = document.getElementById('ob-canvas');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');
  ...
  var frame = 0;
  function draw() {
    ...
    requestAnimationFrame(draw);
  }
  draw();
```

**ЗАМЕНИ** строку `function draw() {` и добавь переменную для RAF-ID:
```javascript
function initObCanvas() {
  var canvas = document.getElementById('ob-canvas');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  var particles = [];
  var count = 80;

  for (var i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.4 + 0.3,
      speed: Math.random() * 0.25 + 0.05,
      opacity: Math.random() * 0.5 + 0.1,
      pulse: Math.random() * Math.PI * 2
    });
  }

  var frame = 0;
  var rafId = null; // ID для остановки анимации

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    frame += 0.012;

    particles.forEach(function(p) {
      p.pulse += 0.018;
      p.y -= p.speed;
      if (p.y < -5) {
        p.y = canvas.height + 5;
        p.x = Math.random() * canvas.width;
      }
      var op = p.opacity * (0.6 + 0.4 * Math.sin(p.pulse));
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(200,180,100,' + op + ')';
      ctx.fill();
    });

    var grd = ctx.createRadialGradient(
      canvas.width * (0.3 + 0.1 * Math.sin(frame * 0.3)),
      canvas.height * 0.4,
      0,
      canvas.width * 0.3,
      canvas.height * 0.4,
      canvas.width * 0.4
    );
    grd.addColorStop(0, 'rgba(40,80,160,0.04)');
    grd.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    rafId = requestAnimationFrame(draw);
  }
  draw();

  // Экспортируем функцию остановки глобально
  window._stopObCanvas = function() {
    if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
  };

  window.addEventListener('resize', function() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });
}
```

**ЗАТЕМ НАЙДИ** в функции `obFinish`:
```javascript
  setTimeout(function() {
    ob.style.display = 'none';
```

**ЗАМЕНИ НА:**
```javascript
  setTimeout(function() {
    ob.style.display = 'none';
    // Останавливаем canvas-анимацию — больше не нужна
    if (window._stopObCanvas) window._stopObCanvas();
```

---

## ИСПРАВЛЕНИЕ 4: порядок применения Патча 3 и Патча 6

**Важно для Claude Code:**

Патч 3 заменяет `animEnemy` — версия для SVG.
Патч 6 заменяет `animEnemy` снова — версия для AI-картинок.

Патч 6 должен применяться ПОСЛЕ Патча 3. Итоговая функция `animEnemy` должна выглядеть так (из Патча 6):

```javascript
function animEnemy(cls) {
  var wrap = document.getElementById('enemy-wrap');
  if (!wrap) return;
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

Если в файле осталась версия из Патча 3 (ищет только `svg`) — замени её на эту.

---

## ИСПРАВЛЕНИЕ 5: hitStop — удалить мёртвую функцию (Патч 3)

Функция `hitStop` объявлена в Патче 3 но нигде не вызывается. Найди и удали:

```javascript
// Hit stop — мини-пауза в момент удара (ощущение импакта)
function hitStop(ms) {
  var btns = document.querySelectorAll('.act-btn');
  btns.forEach(function(b) { b.disabled = true; });
  setTimeout(function() {
    // Кнопки разблокирует основная логика dAct
  }, ms || 80);
}
```

---

## Итоговый правильный порядок применения всех патчей

```
1. questflow_css_patch.md       — CSS карточки, кнопки, nav, topbar
2. questflow_css_patch2.md      — CSS персонаж, подземелье, модалки
3. questflow_js_patch3.md       — JS боевые анимации
4. questflow_patch4_onboarding.md — HTML+JS онбординг
5. questflow_patch5_completion.md — JS завершение квеста, level up
6. questflow_patch6_dungeon_ai.md — JS+HTML AI-картинки подземелья
7. questflow_patch_fixes.md     — ЭТОТ ФАЙЛ, исправления
```
