# QuestFlow — Патч 5: Завершение квеста, Level Up, Micro-interactions

## Инструкция для Claude Code

Точечные замены JS-функций и добавление нового CSS/HTML.

---

## ИЗМЕНЕНИЕ 1: doComplete — анимация завершения квеста

**НАЙДИ:**
```javascript
function doComplete(q) {
  q.done = true;
  q.completedAt = new Date().toISOString();
  var xp = (q.difficulty || 3) * (q.importance || 3) * 80;
  var gold = (q.difficulty || 3) * (q.importance || 3) * 60;

  gainXP(xp);
  gainGold(gold);

  S.stats.totalDone++;
  S.stats.totalXP += xp;
  S.stats.totalGold += gold;
  var today = new Date().toISOString().slice(0, 10);
  S.stats.daily[today] = (S.stats.daily[today] || 0) + 1;
  S.stats.cats[q.category] = (S.stats.cats[q.category] || 0) + 1;

  S.journal.unshift({ title: q.fantasyTitle || q.title, xp: xp, gold: gold, date: today, cat: q.category });

  updateHeroClass();
  checkAch();
  save();
  renderQuests();
  renderJournal();
  showToast('✓ Выполнено! +' + xp + ' ОП, +🪙' + gold);
  maybeAICongrats();
}
```

**ЗАМЕНИ НА:**
```javascript
function doComplete(q) {
  q.done = true;
  q.completedAt = new Date().toISOString();
  var xp   = (q.difficulty || 3) * (q.importance || 3) * 80;
  var gold = (q.difficulty || 3) * (q.importance || 3) * 60;

  var prevLvl = S.hero.lvl;
  gainXP(xp);
  gainGold(gold);

  S.stats.totalDone++;
  S.stats.totalXP  += xp;
  S.stats.totalGold += gold;
  var today = new Date().toISOString().slice(0, 10);
  S.stats.daily[today] = (S.stats.daily[today] || 0) + 1;
  S.stats.cats[q.category] = (S.stats.cats[q.category] || 0) + 1;

  S.journal.unshift({
    title: q.fantasyTitle || q.title,
    xp: xp, gold: gold, date: today, cat: q.category
  });

  updateHeroClass();
  checkAch();
  save();

  // Анимация исчезновения карточки перед ре-рендером
  var card = document.querySelector('.qcard');
  if (card) {
    card.style.transition = 'all .35s cubic-bezier(.4,0,1,1)';
    card.style.opacity = '0';
    card.style.transform = 'translateY(-12px) scale(.97)';
    setTimeout(function() {
      renderQuests();
      renderJournal();
    }, 350);
  } else {
    renderQuests();
    renderJournal();
  }

  // Level up экран или обычный тост
  if (S.hero.lvl > prevLvl) {
    setTimeout(function() { showLevelUp(S.hero.lvl, xp, gold); }, 400);
  } else {
    showCompletionToast(q.fantasyTitle || q.title, xp, gold);
  }

  maybeAICongrats();
}

// Тост завершения квеста — более информативный
function showCompletionToast(title, xp, gold) {
  var el = document.getElementById('toast');
  el.innerHTML = '<div style="font-size:11px;letter-spacing:2px;color:var(--green);margin-bottom:4px;font-family:var(--ff-title)">✦ КВЕСТ ВЫПОЛНЕН ✦</div>'
    + '<div style="font-style:italic;color:var(--text2);font-size:13px;margin-bottom:6px">'
    + (title.length > 32 ? title.slice(0, 32) + '…' : title) + '</div>'
    + '<div style="display:flex;gap:14px;font-family:var(--ff-title);font-size:11px">'
    + '<span style="color:var(--sap)">✨ +' + xp + ' ОП</span>'
    + '<span style="color:var(--gold)">🪙 +' + gold + '</span>'
    + '</div>';
  el.classList.add('show');
  clearTimeout(el._t);
  el._t = setTimeout(function() {
    el.classList.remove('show');
    // Восстанавливаем обычный формат
    setTimeout(function() { el.innerHTML = ''; }, 300);
  }, 4000);
}

// Level Up экран — полноэкранное уведомление
function showLevelUp(lvl, xp, gold) {
  var overlay = document.createElement('div');
  overlay.id = 'levelup-overlay';
  overlay.style.cssText = [
    'position:fixed;inset:0;z-index:900',
    'background:rgba(4,9,15,.95)',
    'display:flex;align-items:center;justify-content:center',
    'flex-direction:column;text-align:center',
    'animation:overlay-in .3s ease both',
    'cursor:pointer'
  ].join(';');

  overlay.innerHTML = [
    '<div style="font-family:var(--ff-title);font-size:10px;letter-spacing:5px;color:var(--text3);margin-bottom:16px;text-transform:uppercase">Достижение разблокировано</div>',
    '<div style="font-family:var(--ff-title);font-size:64px;color:var(--gold);line-height:1;text-shadow:0 0 40px rgba(212,168,74,.6),0 0 80px rgba(212,168,74,.2);animation:xp-pop .5s cubic-bezier(.34,1.56,.64,1) both">' + lvl + '</div>',
    '<div style="font-family:var(--ff-title);font-size:13px;letter-spacing:4px;color:var(--gold2);margin-top:8px;margin-bottom:4px;text-transform:uppercase">Уровень</div>',
    '<div style="width:120px;height:1px;background:linear-gradient(90deg,transparent,var(--gold),transparent);margin:16px auto"></div>',
    '<div style="font-family:var(--ff-body);font-style:italic;color:var(--text2);font-size:15px;margin-bottom:20px">Характеристики героя улучшены</div>',
    '<div style="display:flex;gap:24px;font-family:var(--ff-title);font-size:12px">',
    '<div><div style="color:var(--text3);font-size:8px;letter-spacing:2px;margin-bottom:4px">ОП ПОЛУЧЕНО</div><div style="color:var(--sap)">+' + xp + '</div></div>',
    '<div><div style="color:var(--text3);font-size:8px;letter-spacing:2px;margin-bottom:4px">ЗОЛОТО</div><div style="color:var(--gold)">+' + gold + '</div></div>',
    '</div>',
    '<div style="margin-top:32px;font-family:var(--ff-title);font-size:9px;letter-spacing:2px;color:var(--text3)">Нажми чтобы продолжить</div>'
  ].join('');

  document.body.appendChild(overlay);

  // Частицы вокруг цифры уровня
  spawnLevelUpParticles(overlay);

  // Закрыть по клику
  overlay.addEventListener('click', function() {
    overlay.style.transition = 'opacity .3s ease';
    overlay.style.opacity = '0';
    setTimeout(function() { overlay.remove(); }, 320);
  });

  // Авто-закрытие через 5 сек
  setTimeout(function() {
    if (overlay.parentNode) {
      overlay.style.transition = 'opacity .4s ease';
      overlay.style.opacity = '0';
      setTimeout(function() { if (overlay.parentNode) overlay.remove(); }, 420);
    }
  }, 5000);
}

function spawnLevelUpParticles(container) {
  var colors = ['#d4a84a','#f0d070','#ffffff','#66b2f0','#a0d0ff'];
  for (var i = 0; i < 20; i++) {
    (function(i) {
      setTimeout(function() {
        var p = document.createElement('div');
        var color = colors[Math.floor(Math.random() * colors.length)];
        var size  = 2 + Math.random() * 5;
        var startX = window.innerWidth  * 0.3 + Math.random() * window.innerWidth  * 0.4;
        var startY = window.innerHeight * 0.3 + Math.random() * window.innerHeight * 0.2;
        var angle  = (Math.random() * 360) * Math.PI / 180;
        var dist   = 80 + Math.random() * 160;

        p.style.cssText = [
          'position:fixed',
          'width:' + size + 'px',
          'height:' + size + 'px',
          'background:' + color,
          'border-radius:50%',
          'left:' + startX + 'px',
          'top:'  + startY  + 'px',
          'pointer-events:none',
          'z-index:901',
          'box-shadow:0 0 ' + (size * 3) + 'px ' + color,
          'transition:all 1s cubic-bezier(.2,.8,.2,1)',
          'opacity:1'
        ].join(';');

        document.body.appendChild(p);
        void p.offsetWidth;
        p.style.transform = 'translate(' + (Math.cos(angle) * dist) + 'px,' + (Math.sin(angle) * dist - 60) + 'px)';
        p.style.opacity = '0';

        setTimeout(function() { if (p.parentNode) p.remove(); }, 1100);
      }, i * 50);
    })(i);
  }
}
```

---

## ИЗМЕНЕНИЕ 2: gainXP — level up toast убрать, теперь обрабатывает doComplete

**НАЙДИ:**
```javascript
function gainXP(v) {
  S.hero.xp += v;
  while (S.hero.xp >= S.hero.xpMax) {
    S.hero.xp -= S.hero.xpMax;
    S.hero.lvl++;
    S.hero.xpMax = Math.round(S.hero.xpMax * 1.35);
    S.hero.hp += 30; S.hero.dmg += 5; S.hero.def += 3; S.hero.stam += 5;
    S.hero.chp = S.hero.hp;
    showToast('✨ Уровень ' + S.hero.lvl + '! Характеристики улучшены.');
  }
  refreshTopBar();
}
```

**ЗАМЕНИ НА:**
```javascript
function gainXP(v) {
  S.hero.xp += v;
  while (S.hero.xp >= S.hero.xpMax) {
    S.hero.xp -= S.hero.xpMax;
    S.hero.lvl++;
    S.hero.xpMax = Math.round(S.hero.xpMax * 1.35);
    S.hero.hp   += 30;
    S.hero.dmg  += 5;
    S.hero.def  += 3;
    S.hero.stam += 5;
    S.hero.chp   = S.hero.hp;
    // Тост level up убран — теперь обрабатывает showLevelUp в doComplete
  }
  refreshTopBar();
  // XP-бар pop анимация
  var bar = document.getElementById('t-xp-bar');
  if (bar) {
    bar.classList.remove('xp-pop');
    void bar.offsetWidth;
    bar.classList.add('xp-pop');
    setTimeout(function() { bar.classList.remove('xp-pop'); }, 400);
  }
}
```

---

## ИЗМЕНЕНИЕ 3: showToast — восстановить текстовый вариант

**НАЙДИ:**
```javascript
function showToast(msg) {
  var el = document.getElementById('toast');
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(el._t);
  el._t = setTimeout(function() { el.classList.remove('show'); }, 3400);
}
```

**ЗАМЕНИ НА:**
```javascript
function showToast(msg) {
  var el = document.getElementById('toast');
  // Если сейчас показан HTML-тост (completion), не перебиваем
  if (el.innerHTML && el.innerHTML.includes('КВЕСТ ВЫПОЛНЕН') && el.classList.contains('show')) return;
  el.innerHTML = '';
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(el._t);
  el._t = setTimeout(function() {
    el.classList.remove('show');
    setTimeout(function() { el.textContent = ''; }, 300);
  }, 3400);
}
```

---

## ИЗМЕНЕНИЕ 4: micro-interactions — hover на nav иконках

**НАЙДИ функцию** `sw` (переключение вьюх):

```javascript
function sw(name, el) {
  document.querySelectorAll('.view').forEach(function(v) { v.classList.remove('active'); });
  document.getElementById('view-' + name).classList.add('active');
  document.querySelectorAll('.ni').forEach(function(n) { n.classList.remove('active'); });
  if (el) el.classList.add('active');
  if (name === 'stats') renderStats();
  if (name === 'character') renderChar();
}
```

**ЗАМЕНИ НА:**
```javascript
function sw(name, el) {
  // Исходящая вьюха — быстрое fade out
  var current = document.querySelector('.view.active');
  if (current) {
    current.style.transition = 'opacity .15s ease';
    current.style.opacity = '0';
  }

  setTimeout(function() {
    document.querySelectorAll('.view').forEach(function(v) {
      v.classList.remove('active');
      v.style.opacity = '';
      v.style.transition = '';
    });
    var next = document.getElementById('view-' + name);
    next.classList.add('active');

    document.querySelectorAll('.ni').forEach(function(n) { n.classList.remove('active'); });
    if (el) el.classList.add('active');

    if (name === 'stats') renderStats();
    if (name === 'character') renderChar();
  }, current ? 140 : 0);
}
```

---

## ИЗМЕНЕНИЕ 5: CSS — level up overlay и completion toast

**ДОБАВИТЬ в конец CSS** (перед `</style>`):

```css
/* ===== LEVEL UP OVERLAY ===== */
#levelup-overlay{
  /* Базовые стили заданы inline в JS */
  /* Дополнительный glow-эффект снизу */
}
#levelup-overlay::before{
  content:'';
  position:absolute;bottom:0;left:0;right:0;height:200px;
  background:radial-gradient(ellipse at 50% 100%,rgba(212,168,74,.12) 0%,transparent 70%);
  pointer-events:none;
}

/* ===== COMPLETION TOAST — расширенный ===== */
#toast{
  /* Переопределяем: теперь может содержать HTML */
  white-space:normal;
  text-align:left;
  min-width:220px;
}
```

---

## Итог патча 5

| Момент | До | После |
|---|---|---|
| Завершение квеста | Стандартный тост | Карточка fade-out, богатый тост с названием/ОП/золотом |
| Level Up | Тост в строке | Полноэкранный overlay с цифрой, частицами, auto-close |
| Переключение вкладок | Мгновенное | Fade out текущей → fade in новой |
| XP бар | Просто растёт | Pop-анимация при получении опыта |
| Level up toast | Простая строка | Убран, заменён полноэкранным экраном |
