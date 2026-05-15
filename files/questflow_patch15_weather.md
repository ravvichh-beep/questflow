# QuestFlow — Патч 15: Погодная атмосфера

## Проверка совместимости
- Canvas поверх .main-wrap — z-index:1, pointer-events:none, не мешает UI ✓
- Open-Meteo API — бесплатно, без ключа, без регистрации ✓
- initAll() — добавляем initWeather() ✓
- Патч 13 (loading screen) — погода инициализируется после закрытия экрана ✓
- CSS .wx-* — уникальны ✓

---

## ИЗМЕНЕНИЕ 1: canvas для частиц и HTML погодного HUD

**НАЙДИ:**
```html
<div class="toast" id="toast"></div>
```

**ДОБАВЬ ПЕРЕД НЕЙ:**
```html
<!-- WEATHER CANVAS -->
<canvas id="wx-canvas" style="
  position:fixed;top:54px;left:62px;right:0;bottom:0;
  width:calc(100% - 62px);height:calc(100% - 54px);
  pointer-events:none;z-index:1;
  opacity:0;transition:opacity 2s ease;
"></canvas>

<!-- WEATHER HUD -->
<div class="wx-hud" id="wx-hud" style="display:none">
  <div class="wx-icon" id="wx-icon">🌙</div>
  <div class="wx-info">
    <div class="wx-temp" id="wx-temp">—°</div>
    <div class="wx-desc" id="wx-desc">Ночь</div>
  </div>
</div>
```

---

## ИЗМЕНЕНИЕ 2: CSS для погоды

**ДОБАВИТЬ в конец CSS** (перед `</style>`):

```css
/* ===== WEATHER ===== */
.wx-hud{
  position:fixed;bottom:20px;left:72px;
  display:flex;align-items:center;gap:8px;
  background:var(--glass2);
  backdrop-filter:blur(8px);
  border:1px solid var(--bd);
  border-radius:var(--r);
  padding:6px 12px;z-index:50;
  opacity:.7;transition:opacity .3s;
  pointer-events:none;
}
.wx-hud:hover{opacity:1}
.wx-icon{font-size:18px;line-height:1}
.wx-temp{
  font-family:var(--ff-title);font-size:12px;
  color:var(--text);letter-spacing:1px;
}
.wx-desc{
  font-family:var(--ff-body);font-style:italic;
  font-size:10px;color:var(--text3);
}

/* Цветовой тинт фона под погоду — применяется к body через class */
body.wx-rain   { --wx-tint: rgba(20,40,80,.15); }
body.wx-snow   { --wx-tint: rgba(180,200,220,.06); }
body.wx-clear-day   { --wx-tint: rgba(200,160,40,.04); }
body.wx-clear-night { --wx-tint: rgba(20,20,60,.1); }
body.wx-fog    { --wx-tint: rgba(100,120,140,.1); }
body.wx-storm  { --wx-tint: rgba(40,20,80,.2); }
body.wx-cloudy { --wx-tint: rgba(30,40,60,.08); }

.main-wrap::before{
  content:'';position:fixed;
  top:54px;left:62px;right:0;bottom:0;
  background:var(--wx-tint, transparent);
  pointer-events:none;z-index:0;
  transition:background 3s ease;
}
```

---

## ИЗМЕНЕНИЕ 3: JS — погодный движок

**НАЙДИ** строку `// =============================================` с `// LOADING SCREEN`
и **ДОБАВЬ ПЕРЕД НЕЙ:**

```javascript
// =============================================
// WEATHER SYSTEM
// =============================================

var _wxAnim = null;
var _wxState = null;

// WMO коды погоды → наш тип
function wmoToType(code, isDay) {
  if (code === 0 || code === 1) return isDay ? 'clear-day' : 'clear-night';
  if (code <= 3)  return 'cloudy';
  if (code <= 49) return 'fog';
  if (code <= 67) return 'rain';
  if (code <= 77) return 'snow';
  if (code <= 82) return 'rain';
  return 'storm';
}

// Иконки и RPG-описания погоды
var WX_DATA = {
  'clear-day':   { icon:'☀️',  rpg:'Ясный день',       bg:'rgba(200,160,40,.04)' },
  'clear-night': { icon:'🌙',  rpg:'Звёздная ночь',    bg:'rgba(20,20,60,.12)' },
  'cloudy':      { icon:'☁️',  rpg:'Облачно',          bg:'rgba(30,40,60,.1)' },
  'fog':         { icon:'🌫️', rpg:'Туман над руинами', bg:'rgba(100,120,140,.12)' },
  'rain':        { icon:'🌧️', rpg:'Дождь идёт',       bg:'rgba(20,40,80,.15)' },
  'snow':        { icon:'❄️',  rpg:'Снегопад',         bg:'rgba(180,200,220,.08)' },
  'storm':       { icon:'⛈️', rpg:'Буря',              bg:'rgba(40,20,80,.2)' },
};

function initWeather() {
  // Пробуем получить геолокацию
  if (!navigator.geolocation) { initWeatherFallback(); return; }
  navigator.geolocation.getCurrentPosition(
    function(pos) { fetchWeather(pos.coords.latitude, pos.coords.longitude); },
    function()    { initWeatherFallback(); },
    { timeout: 5000 }
  );
}

function initWeatherFallback() {
  // Без геолокации — определяем по времени суток
  var h = new Date().getHours();
  var type = (h >= 6 && h < 20) ? 'clear-day' : 'clear-night';
  applyWeather(type, null);
}

function fetchWeather(lat, lon) {
  var url = 'https://api.open-meteo.com/v1/forecast'
    + '?latitude=' + lat.toFixed(2)
    + '&longitude=' + lon.toFixed(2)
    + '&current=temperature_2m,weathercode,is_day'
    + '&wind_speed_unit=ms';

  fetch(url)
    .then(function(r) { return r.json(); })
    .then(function(data) {
      var cur  = data.current;
      var code = cur.weathercode;
      var isDay = cur.is_day === 1;
      var temp  = Math.round(cur.temperature_2m);
      var type  = wmoToType(code, isDay);
      applyWeather(type, temp);
    })
    .catch(function() { initWeatherFallback(); });
}

function applyWeather(type, temp) {
  _wxState = type;
  var wd = WX_DATA[type] || WX_DATA['clear-night'];

  // HUD
  var hud = document.getElementById('wx-hud');
  if (hud) {
    hud.style.display = 'flex';
    document.getElementById('wx-icon').textContent = wd.icon;
    document.getElementById('wx-temp').textContent = temp !== null ? temp + '°' : '';
    document.getElementById('wx-desc').textContent = wd.rpg;
  }

  // CSS класс на body
  document.body.className = document.body.className.replace(/wx-\S+/g, '').trim();
  document.body.classList.add('wx-' + type);

  // Запускаем частицы
  startParticles(type);
}

function startParticles(type) {
  var canvas = document.getElementById('wx-canvas');
  if (!canvas) return;
  if (_wxAnim) { cancelAnimationFrame(_wxAnim); _wxAnim = null; }

  var ctx = canvas.getContext('2d');
  var W = canvas.offsetWidth || window.innerWidth - 62;
  var H = canvas.offsetHeight || window.innerHeight - 54;
  canvas.width  = W;
  canvas.height = H;

  // Нет частиц — скрываем canvas
  if (type === 'clear-day' || type === 'cloudy') {
    canvas.style.opacity = '0';
    return;
  }

  canvas.style.opacity = '1';
  var particles = [];

  function makeParticle() {
    if (type === 'rain' || type === 'storm') {
      return {
        x: Math.random() * W,
        y: Math.random() * H - H,
        len:   8 + Math.random() * 12,
        speed: 12 + Math.random() * 10,
        angle: type === 'storm' ? 0.3 : 0.1,
        alpha: 0.15 + Math.random() * 0.35,
      };
    }
    if (type === 'snow') {
      return {
        x: Math.random() * W,
        y: Math.random() * H - H,
        r:     1.5 + Math.random() * 2.5,
        speed: 0.6 + Math.random() * 1.2,
        drift: (Math.random() - 0.5) * 0.4,
        alpha: 0.3 + Math.random() * 0.5,
        angle: Math.random() * Math.PI * 2,
      };
    }
    if (type === 'fog') {
      return {
        x: Math.random() * W,
        y: Math.random() * H,
        r:     60 + Math.random() * 120,
        speed: 0.08 + Math.random() * 0.12,
        alpha: 0.01 + Math.random() * 0.03,
        dir:   Math.random() > 0.5 ? 1 : -1,
      };
    }
    if (type === 'clear-night') {
      return {
        x: Math.random() * W,
        y: Math.random() * H * 0.7,
        r:     0.5 + Math.random() * 1.2,
        pulse: Math.random() * Math.PI * 2,
        speed: 0.01 + Math.random() * 0.02,
        alpha: 0.3 + Math.random() * 0.6,
      };
    }
    return null;
  }

  // Начальный пул частиц
  var count = type === 'rain' ? 120 :
              type === 'storm' ? 200 :
              type === 'snow' ? 80 :
              type === 'fog' ? 12 :
              type === 'clear-night' ? 60 : 0;

  for (var i = 0; i < count; i++) {
    var p = makeParticle();
    if (p) {
      if (type === 'rain' || type === 'storm' || type === 'snow') p.y = Math.random() * H;
      particles.push(p);
    }
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    particles.forEach(function(p, idx) {
      if (type === 'rain' || type === 'storm') {
        p.x += Math.sin(p.angle) * p.speed * 0.3;
        p.y += p.speed;
        if (p.y > H) { particles[idx] = makeParticle(); particles[idx].y = -10; return; }
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x + Math.sin(p.angle) * p.len * 0.3, p.y - p.len);
        ctx.strokeStyle = 'rgba(140,180,220,' + p.alpha + ')';
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }
      else if (type === 'snow') {
        p.x += p.drift + Math.sin(p.angle) * 0.3;
        p.y += p.speed;
        p.angle += 0.02;
        if (p.y > H) { particles[idx] = makeParticle(); return; }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(200,220,240,' + p.alpha + ')';
        ctx.fill();
      }
      else if (type === 'fog') {
        p.x += p.speed * p.dir;
        if (p.x > W + p.r) p.x = -p.r;
        if (p.x < -p.r)    p.x = W + p.r;
        var grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
        grad.addColorStop(0, 'rgba(140,160,180,' + p.alpha + ')');
        grad.addColorStop(1, 'rgba(140,160,180,0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      else if (type === 'clear-night') {
        p.pulse += p.speed;
        var a = p.alpha * (0.5 + 0.5 * Math.sin(p.pulse));
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(200,180,100,' + a + ')';
        ctx.fill();
      }
    });

    _wxAnim = requestAnimationFrame(draw);
  }

  draw();

  // Обновляем размер при resize
  window.addEventListener('resize', function() {
    W = canvas.offsetWidth || window.innerWidth - 62;
    H = canvas.offsetHeight || window.innerHeight - 54;
    canvas.width  = W;
    canvas.height = H;
  });
}
```

---

## ИЗМЕНЕНИЕ 4: добавить initWeather в initAll

**НАЙДИ в initAll():**
```javascript
  updateHeroTitle();
  checkRoutines();
```

**ЗАМЕНИ НА:**
```javascript
  updateHeroTitle();
  checkRoutines();
  initWeather();
```

---

## Что получится

| Погода | Иконка | RPG-название | Частицы |
|---|---|---|---|
| Ясно, день | ☀️ | Ясный день | Нет |
| Ясно, ночь | 🌙 | Звёздная ночь | Мерцающие звёзды |
| Облачно | ☁️ | Облачно | Нет |
| Туман | 🌫️ | Туман над руинами | Плывущие облака тумана |
| Дождь | 🌧️ | Дождь идёт | Косые линии дождя |
| Снег | ❄️ | Снегопад | Плавающие снежинки |
| Гроза | ⛈️ | Буря | Густой косой дождь |

**Технически:**
- Open-Meteo API — бесплатно, без ключа
- Запрашивает геолокацию у пользователя
- Если отказ — определяет время суток и ставит день/ночь
- canvas поверх интерфейса, pointer-events:none — не мешает кликам
- Цветовой тинт фона меняется под погоду
