# QuestFlow — Патч 8: Живые графики статистики

## Проверка совместимости
- CSS .scard, .chart-wrap, .cbar, .ctab, .cat-bar — из Патча 2, не дублируем
- renderStats/renderChart/renderCatRows — не трогались другими патчами ✓
- sw() из Патча 5 вызывает renderStats() — имя функции сохраняется ✓
- HTML структура view-stats — не трогалась другими патчами ✓
- Нет конфликтов с Патчами 3, 4, 6, 7 ✓

---

## ИЗМЕНЕНИЕ 1: HTML экрана статистики

**НАЙДИ и ЗАМЕНИ** весь блок от `<!-- STATS -->` до закрывающего `</div>` перед `<!-- DUNGEON -->`:

```html
<!-- STATS -->
<div class="view" id="view-stats">
  <div class="pad">
    <div class="shdr">Хроники героя</div>

    <!-- Карточки-счётчики -->
    <div class="stat-cards">
      <div class="scard scard-anim" id="scard-total">
        <div class="scard-icon">⚔</div>
        <div class="scard-val" id="st-total">0</div>
        <div class="scard-lbl">ВЫПОЛНЕНО</div>
        <div class="scard-sub" id="st-total-sub"></div>
      </div>
      <div class="scard scard-anim" id="scard-xp">
        <div class="scard-icon">✨</div>
        <div class="scard-val" id="st-xp">0</div>
        <div class="scard-lbl">ОПЫТ</div>
        <div class="scard-sub" id="st-xp-sub"></div>
      </div>
      <div class="scard scard-anim" id="scard-gold">
        <div class="scard-icon">🪙</div>
        <div class="scard-val" id="st-gold">0</div>
        <div class="scard-lbl">ЗОЛОТО</div>
        <div class="scard-sub" id="st-gold-sub"></div>
      </div>
      <div class="scard scard-anim" id="scard-days">
        <div class="scard-icon">📅</div>
        <div class="scard-val" id="st-days">0</div>
        <div class="scard-lbl">АКТИВНЫХ ДН.</div>
        <div class="scard-sub" id="st-days-sub"></div>
      </div>
    </div>

    <!-- График продуктивности — canvas -->
    <div class="chart-wrap">
      <div class="chart-hdr">
        <div class="chart-title">Продуктивность</div>
        <div class="chart-tabs">
          <button class="ctab active" onclick="setChartMode('week',this)">Неделя</button>
          <button class="ctab" onclick="setChartMode('month',this)">Месяц</button>
        </div>
      </div>
      <div style="position:relative">
        <canvas id="chart-canvas" style="width:100%;display:block"></canvas>
        <div id="chart-empty" style="display:none;text-align:center;padding:30px;font-family:var(--ff-body);font-style:italic;font-size:13px;color:var(--text3)">
          Выполни первый квест — появится график
        </div>
      </div>
    </div>

    <!-- Стрик -->
    <div class="streak-wrap" id="streak-wrap" style="display:none">
      <div class="streak-icon">🔥</div>
      <div>
        <div class="streak-val" id="streak-val">0</div>
        <div class="streak-lbl">дней подряд</div>
      </div>
    </div>

    <!-- По категориям -->
    <div class="chart-wrap">
      <div class="chart-title" style="margin-bottom:16px">По категориям</div>
      <div class="cat-rows" id="cat-rows"></div>
      <div id="cat-empty" style="display:none;text-align:center;padding:20px;font-family:var(--ff-body);font-style:italic;font-size:13px;color:var(--text3)">
        Нет данных
      </div>
    </div>

    <!-- Лучший день -->
    <div class="chart-wrap" id="best-day-wrap" style="display:none">
      <div class="chart-title" style="margin-bottom:12px">Рекорды</div>
      <div id="best-day-content"></div>
    </div>

  </div>
</div>
```

---

## ИЗМЕНЕНИЕ 2: CSS для новых элементов статистики

**ДОБАВИТЬ в конец CSS** (перед `</style>`):

```css
/* ===== STATS ENHANCED ===== */

/* Иконка на карточке */
.scard-icon{
  font-size:20px;margin-bottom:6px;display:block;
  filter:drop-shadow(0 0 6px rgba(212,168,74,.3));
}
/* Подпись под значением */
.scard-sub{
  font-family:var(--ff-title);font-size:8px;
  color:var(--green);letter-spacing:1px;
  margin-top:4px;min-height:12px;
}
/* Анимация появления карточек с задержкой */
.scard-anim{
  opacity:0;transform:translateY(16px);
  transition:opacity .4s ease, transform .4s cubic-bezier(.34,1.2,.64,1);
}
.scard-anim.visible{
  opacity:1;transform:translateY(0);
}

/* Стрик */
.streak-wrap{
  display:flex;align-items:center;gap:14px;
  background:rgba(255,100,0,.06);
  border:1px solid rgba(255,100,0,.2);
  border-radius:var(--r2);
  padding:14px 18px;
  margin-bottom:18px;
  box-shadow:0 0 20px rgba(255,100,0,.05);
}
.streak-icon{font-size:28px;filter:drop-shadow(0 0 8px rgba(255,100,0,.4))}
.streak-val{
  font-family:var(--ff-title);font-size:28px;
  color:#ff8040;
  text-shadow:0 0 12px rgba(255,100,0,.3);
  line-height:1;
}
.streak-lbl{
  font-family:var(--ff-title);font-size:9px;
  letter-spacing:2px;color:var(--text3);
  text-transform:uppercase;margin-top:2px;
}

/* Рекорды */
.record-row{
  display:flex;justify-content:space-between;align-items:center;
  padding:8px 0;
  border-bottom:1px solid var(--bd);
  font-family:var(--ff-title);font-size:10px;
}
.record-row:last-child{border-bottom:none}
.record-label{color:var(--text3);letter-spacing:1px}
.record-value{color:var(--gold)}

/* Tooltip на баре графика */
.chart-tooltip{
  position:absolute;
  background:var(--glass2);
  backdrop-filter:blur(8px);
  border:1px solid var(--bdm);
  border-radius:var(--r);
  padding:5px 10px;
  font-family:var(--ff-title);font-size:10px;
  color:var(--text);
  pointer-events:none;
  opacity:0;
  transition:opacity .15s;
  white-space:nowrap;
  z-index:10;
  box-shadow:var(--shadow-card);
}
.chart-tooltip.show{opacity:1}
```

---

## ИЗМЕНЕНИЕ 3: JS — полная замена блока статистики

**НАЙДИ и ЗАМЕНИ** весь блок от `// =============================================` `// STATS` до следующего блока `// OVERDUE / PUSH`:

```javascript
// =============================================
// STATS
// =============================================

var chartMode = 'week';
var _chartAnimId = null; // RAF для canvas-графика

function renderStats() {
  var h = S.hero;

  // Анимированный счётчик для каждой карточки
  animateCounter('st-total', S.stats.totalDone);
  animateCounter('st-xp',    S.stats.totalXP);
  animateCounter('st-gold',  S.stats.totalGold);

  var activeDays = Object.keys(S.stats.daily).filter(function(k) {
    return S.stats.daily[k] > 0;
  }).length;
  animateCounter('st-days', activeDays);

  // Подписи под карточками
  var totalDone = S.stats.totalDone;
  document.getElementById('st-total-sub').textContent =
    totalDone === 0 ? '' : totalDone >= 50 ? '🌟 Легенда' : totalDone >= 10 ? '⚡ Ветеран' : '✦ Новичок';
  document.getElementById('st-xp-sub').textContent =
    S.stats.totalXP > 0 ? 'УР. ' + h.lvl : '';
  document.getElementById('st-gold-sub').textContent =
    S.stats.totalGold >= 500 ? '💰 Богач' : '';
  document.getElementById('st-days-sub').textContent =
    activeDays >= 7 ? '🔥 Неделя' : '';

  // Анимация появления карточек
  document.querySelectorAll('.scard-anim').forEach(function(el, i) {
    el.classList.remove('visible');
    setTimeout(function() { el.classList.add('visible'); }, i * 80);
  });

  // Стрик
  var streak = calcStreak();
  var streakWrap = document.getElementById('streak-wrap');
  if (streak >= 2) {
    streakWrap.style.display = 'flex';
    document.getElementById('streak-val').textContent = streak;
  } else {
    streakWrap.style.display = 'none';
  }

  // Рекорды
  renderBestDay();

  // Графики
  renderChart();
  renderCatRows();
}

// Анимированный счётчик — число плавно растёт от 0 до target
function animateCounter(id, target) {
  var el = document.getElementById(id);
  if (!el) return;
  var start = 0;
  var duration = 700;
  var startTime = null;

  // Если уже показывает правильное число — не анимируем
  if (parseInt(el.textContent) === target) return;

  function step(ts) {
    if (!startTime) startTime = ts;
    var progress = Math.min((ts - startTime) / duration, 1);
    // easeOutQuart
    var ease = 1 - Math.pow(1 - progress, 4);
    el.textContent = Math.round(ease * target);
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

// Подсчёт текущего стрика (дней подряд)
function calcStreak() {
  var streak = 0;
  var today = new Date();
  for (var i = 0; i < 365; i++) {
    var d = new Date(today);
    d.setDate(d.getDate() - i);
    var key = d.toISOString().slice(0, 10);
    if (S.stats.daily[key] && S.stats.daily[key] > 0) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

// Лучший день и рекорды
function renderBestDay() {
  var wrap = document.getElementById('best-day-wrap');
  var content = document.getElementById('best-day-content');
  if (!wrap || !content) return;

  var daily = S.stats.daily;
  var keys = Object.keys(daily).filter(function(k) { return daily[k] > 0; });
  if (keys.length === 0) { wrap.style.display = 'none'; return; }

  var bestDay = keys.reduce(function(a, b) { return daily[a] > daily[b] ? a : b; });
  var bestVal = daily[bestDay];
  var total   = S.stats.totalDone;
  var avgPerDay = keys.length > 0 ? (total / keys.length).toFixed(1) : 0;

  wrap.style.display = 'block';
  content.innerHTML = [
    '<div class="record-row"><span class="record-label">ЛУЧШИЙ ДЕНЬ</span><span class="record-value">' + bestDay + ' · ' + bestVal + ' кв.</span></div>',
    '<div class="record-row"><span class="record-label">СРЕДНЕЕ В ДЕНЬ</span><span class="record-value">' + avgPerDay + ' квестов</span></div>',
    '<div class="record-row"><span class="record-label">ВСЕГО ДНЕЙ</span><span class="record-value">' + keys.length + '</span></div>',
  ].join('');
}

function setChartMode(mode, btn) {
  chartMode = mode;
  document.querySelectorAll('.ctab').forEach(function(b) { b.classList.remove('active'); });
  btn.classList.add('active');
  renderChart();
}

// Canvas-график продуктивности
function renderChart() {
  var canvas = document.getElementById('chart-canvas');
  var emptyEl = document.getElementById('chart-empty');
  if (!canvas) return;

  var days = chartMode === 'week' ? 7 : 30;
  var vals = [], labels = [], maxVal = 0;

  for (var i = days - 1; i >= 0; i--) {
    var d = new Date();
    d.setDate(d.getDate() - i);
    var key = d.toISOString().slice(0, 10);
    var v = S.stats.daily[key] || 0;
    vals.push(v);
    labels.push(chartMode === 'week'
      ? ['Вс','Пн','Вт','Ср','Чт','Пт','Сб'][d.getDay()]
      : (d.getDate() % 5 === 0 ? d.getDate() + '' : ''));
    if (v > maxVal) maxVal = v;
  }

  // Если нет данных — показываем заглушку
  if (maxVal === 0) {
    canvas.style.display = 'none';
    if (emptyEl) emptyEl.style.display = 'block';
    return;
  }
  canvas.style.display = 'block';
  if (emptyEl) emptyEl.style.display = 'none';

  // Размеры
  var dpr = window.devicePixelRatio || 1;
  var W   = canvas.parentElement.clientWidth || 600;
  var H   = 140;
  canvas.width  = W * dpr;
  canvas.height = H * dpr;
  canvas.style.width  = W + 'px';
  canvas.style.height = H + 'px';

  var ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);

  var padL = 10, padR = 10, padT = 24, padB = 24;
  var chartW = W - padL - padR;
  var chartH = H - padT - padB;
  var barW   = chartMode === 'week'
    ? Math.min(32, chartW / days * 0.6)
    : Math.min(14, chartW / days * 0.6);
  var step   = chartW / days;

  // Анимация роста баров
  if (_chartAnimId) cancelAnimationFrame(_chartAnimId);
  var startTime = null;
  var duration  = 600;

  // Стили из CSS-переменных — читаем из :root
  var style = getComputedStyle(document.documentElement);
  var colorFilled  = style.getPropertyValue('--sap').trim()  || '#4088d8';
  var colorEmpty   = 'rgba(64,136,216,0.12)';
  var colorText    = style.getPropertyValue('--text3').trim() || '#3a5070';
  var colorGold    = style.getPropertyValue('--gold').trim()  || '#d4a84a';
  var colorGrid    = 'rgba(40,90,160,0.15)';

  // Находим сегодняшний индекс
  var todayIdx = days - 1;

  function drawFrame(ts) {
    if (!startTime) startTime = ts;
    var progress = Math.min((ts - startTime) / duration, 1);
    var ease = 1 - Math.pow(1 - progress, 3); // easeOutCubic

    ctx.clearRect(0, 0, W, H);

    // Горизонтальные линии сетки
    ctx.strokeStyle = colorGrid;
    ctx.lineWidth = 1;
    for (var g = 0; g <= 4; g++) {
      var gy = padT + chartH - (g / 4) * chartH;
      ctx.beginPath();
      ctx.moveTo(padL, gy);
      ctx.lineTo(W - padR, gy);
      ctx.stroke();
    }

    // Линия-соединитель между барами (area chart сверху)
    var points = [];
    for (var i = 0; i < days; i++) {
      var x = padL + i * step + step / 2;
      var barH = vals[i] > 0
        ? Math.max(4, (vals[i] / maxVal) * chartH * ease)
        : 0;
      var y = padT + chartH - barH;
      points.push({ x: x, y: y, v: vals[i] });
    }

    // Заливка под линией
    if (points.some(function(p) { return p.v > 0; })) {
      ctx.beginPath();
      ctx.moveTo(points[0].x, padT + chartH);
      points.forEach(function(p) { ctx.lineTo(p.x, p.y); });
      ctx.lineTo(points[points.length - 1].x, padT + chartH);
      ctx.closePath();
      var grad = ctx.createLinearGradient(0, padT, 0, padT + chartH);
      grad.addColorStop(0, 'rgba(64,136,216,0.2)');
      grad.addColorStop(1, 'rgba(64,136,216,0.02)');
      ctx.fillStyle = grad;
      ctx.fill();

      // Линия поверх заливки
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].v > 0 ? points[0].y : padT + chartH);
      points.forEach(function(p) {
        ctx.lineTo(p.x, p.v > 0 ? p.y : padT + chartH);
      });
      ctx.strokeStyle = colorFilled;
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }

    // Бары
    for (var i = 0; i < days; i++) {
      var x  = padL + i * step + (step - barW) / 2;
      var bH = vals[i] > 0
        ? Math.max(4, (vals[i] / maxVal) * chartH * ease)
        : 2;
      var y  = padT + chartH - bH;

      var isToday = (i === todayIdx);

      if (vals[i] > 0) {
        // Градиент бара
        var barGrad = ctx.createLinearGradient(x, y, x, padT + chartH);
        if (isToday) {
          barGrad.addColorStop(0, colorGold);
          barGrad.addColorStop(1, 'rgba(212,168,74,0.3)');
        } else {
          barGrad.addColorStop(0, colorFilled);
          barGrad.addColorStop(1, 'rgba(64,136,216,0.3)');
        }
        ctx.fillStyle = barGrad;

        // Скруглённый бар
        var radius = Math.min(3, barW / 2);
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + barW - radius, y);
        ctx.quadraticCurveTo(x + barW, y, x + barW, y + radius);
        ctx.lineTo(x + barW, padT + chartH);
        ctx.lineTo(x, padT + chartH);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
        ctx.fill();

        // Значение над баром
        if (progress > 0.7) {
          ctx.fillStyle = isToday ? colorGold : colorFilled;
          ctx.font = '600 9px system-ui';
          ctx.textAlign = 'center';
          ctx.fillText(vals[i], x + barW / 2, y - 5);
        }
      } else {
        // Пустой бар
        ctx.fillStyle = colorEmpty;
        ctx.fillRect(x, padT + chartH - 2, barW, 2);
      }

      // Подпись дня
      if (labels[i]) {
        ctx.fillStyle = isToday ? colorGold : colorText;
        ctx.font = (isToday ? '600 ' : '') + '9px system-ui';
        ctx.textAlign = 'center';
        ctx.fillText(labels[i], x + barW / 2, H - 6);
      }
    }

    // Точки на линии
    points.forEach(function(p) {
      if (p.v > 0) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = '#fff';
        ctx.fill();
        ctx.strokeStyle = colorFilled;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
    });

    if (progress < 1) {
      _chartAnimId = requestAnimationFrame(drawFrame);
    }
  }

  _chartAnimId = requestAnimationFrame(drawFrame);
}

// Строки категорий — с анимацией
function renderCatRows() {
  var el = document.getElementById('cat-rows');
  var emptyEl = document.getElementById('cat-empty');
  if (!el) return;

  var cats = S.stats.cats;
  var keys = Object.keys(cats).filter(function(k) { return (cats[k] || 0) > 0; });

  if (keys.length === 0) {
    el.innerHTML = '';
    if (emptyEl) emptyEl.style.display = 'block';
    return;
  }
  if (emptyEl) emptyEl.style.display = 'none';

  var maxV = Math.max(1, Math.max.apply(null, keys.map(function(k) { return cats[k]; })));

  // Сортируем по убыванию
  keys.sort(function(a, b) { return (cats[b] || 0) - (cats[a] || 0); });

  el.innerHTML = keys.map(function(k) {
    var v   = cats[k] || 0;
    var pct = Math.round(v / maxV * 100);
    var col = CAT_COLORS[k] || '#888';
    return '<div class="cat-row">'
      + '<div class="cat-name">' + (CAT_ICONS[k] || '') + ' ' + (CAT_LABELS[k] || k) + '</div>'
      + '<div class="cat-bar"><div class="cat-fill" style="width:0%;background:' + col + '" data-pct="' + pct + '"></div></div>'
      + '<div class="cat-count">' + v + '</div>'
      + '</div>';
  }).join('');

  // Анимируем ширину баров после рендера
  requestAnimationFrame(function() {
    el.querySelectorAll('.cat-fill').forEach(function(fill) {
      fill.style.transition = 'width .7s cubic-bezier(.4,0,.2,1)';
      fill.style.width = fill.dataset.pct + '%';
    });
  });
}
```

---

## Что изменится

| Элемент | До | После |
|---|---|---|
| Счётчики карточек | Мгновенно | Плавно растут от 0 до значения за 700ms |
| Подписи карточек | Нет | Статус героя: Новичок / Ветеран / Легенда |
| График | HTML div-бары | Canvas: бары + area-линия + точки + анимация роста |
| Сегодняшний день | Не выделен | Золотой бар |
| Пустые дни | Не отображаются | Тонкая серая черта |
| Категории | Статичные бары | Анимируются при открытии, отсортированы по убыванию |
| Стрик | Нет | Оранжевый блок если 2+ дня подряд |
| Рекорды | Нет | Лучший день, среднее в день, всего активных дней |
| Пустое состояние | Нет | Текст-подсказка вместо пустого графика |
