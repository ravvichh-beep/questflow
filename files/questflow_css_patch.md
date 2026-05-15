# QuestFlow — CSS Патч: Карточки, Кнопки, Навигация

## Инструкция для Claude Code

Открой `questflow.html` и замени указанные блоки CSS.
Каждый блок помечен: **ЧТО ЗАМЕНИТЬ** и **НА ЧТО ЗАМЕНИТЬ**.

---

## БЛОК 1: Корневые переменные (строка ~9)

**ЧТО ЗАМЕНИТЬ** (весь блок `:root{...}`):
```css
:root{
  --ff-title:"Palatino Linotype","Book Antiqua",Palatino,"Times New Roman",serif;
  ...все переменные до закрывающей скобки...
  --r:4px
}
```

**НА ЧТО ЗАМЕНИТЬ:**
```css
:root{
  --ff-title:"Palatino Linotype","Book Antiqua",Palatino,"Times New Roman",serif;
  --ff-body:Georgia,"Times New Roman",serif;
  --ff-ui:system-ui,-apple-system,sans-serif;

  /* Основная палитра */
  --bg:#04090f;
  --bg2:#080f1a;
  --bg3:#0c1624;
  --bg4:#111e30;
  --bg5:#162338;

  /* Синие */
  --blue:#1a3560;
  --blue2:#244a8a;
  --sap:#4088d8;
  --sky:#66b2f0;

  /* Золото */
  --gold:#d4a84a;
  --gold2:#f0d070;
  --gold3:#7a6030;
  --gold-glow:rgba(212,168,74,.18);

  /* Текст */
  --text:#ede4cc;
  --text2:#8aaccc;
  --text3:#3a5070;

  /* Границы */
  --bd:rgba(30,70,140,.2);
  --bdm:rgba(40,90,160,.38);
  --bdg:rgba(212,168,74,.3);
  --bdg2:rgba(212,168,74,.12);

  /* Семантические */
  --red:#a82020;
  --red2:#f04040;
  --green:#28b060;
  --purple:#8040c0;

  /* Стекло */
  --glass:rgba(8,15,26,.7);
  --glass2:rgba(12,22,36,.85);

  --r:6px;
  --r2:10px;
  --shadow-card:0 4px 24px rgba(0,0,0,.6), 0 1px 0 rgba(255,255,255,.03) inset;
  --shadow-hover:0 8px 40px rgba(0,0,0,.8), 0 0 0 1px rgba(212,168,74,.15), 0 1px 0 rgba(255,255,255,.05) inset;
  --shadow-btn:0 2px 12px rgba(0,0,0,.5);
  --shadow-gold:0 0 20px rgba(212,168,74,.25), 0 2px 8px rgba(0,0,0,.6);
}
```

---

## БЛОК 2: Кнопки (строка ~45)

**ЧТО ЗАМЕНИТЬ** (от `/* ===== BUTTONS =====` до `/* ===== LAYOUT =====`):

**НА ЧТО ЗАМЕНИТЬ:**
```css
/* ===== BUTTONS ===== */
.btn{
  font-family:var(--ff-title);
  font-size:10px;
  letter-spacing:2px;
  border-radius:var(--r);
  transition:all .22s cubic-bezier(.4,0,.2,1), transform .15s cubic-bezier(.34,1.56,.64,1);
  display:inline-flex;
  align-items:center;
  gap:7px;
  padding:10px 20px;
  border:1px solid;
  cursor:pointer;
  position:relative;
  overflow:hidden;
  text-transform:uppercase;
}
.btn::after{
  content:'';
  position:absolute;
  inset:0;
  background:linear-gradient(135deg,rgba(255,255,255,.06) 0%,transparent 60%);
  pointer-events:none;
}
.btn-g{
  background:linear-gradient(135deg,#c89030,#e8b040,#c89030);
  color:#07101d;
  border-color:rgba(232,176,64,.6);
  font-weight:600;
  box-shadow:var(--shadow-gold);
  text-shadow:0 1px 2px rgba(0,0,0,.3);
}
.btn-g:hover{
  background:linear-gradient(135deg,#daa040,#f8c040,#daa040);
  box-shadow:0 0 30px rgba(212,168,74,.4), 0 4px 16px rgba(0,0,0,.6);
  border-color:rgba(248,192,64,.8);
}
.btn-o{
  background:rgba(255,255,255,.03);
  color:var(--text2);
  border-color:var(--bdm);
  backdrop-filter:blur(4px);
}
.btn-o:hover{
  color:var(--text);
  border-color:rgba(100,160,220,.5);
  background:rgba(40,90,160,.1);
}
.btn-b{
  background:rgba(40,88,180,.15);
  color:var(--sky);
  border-color:rgba(64,136,216,.3);
  backdrop-filter:blur(4px);
}
.btn-b:hover{
  background:rgba(40,88,180,.28);
  box-shadow:0 0 16px rgba(64,136,216,.2);
}
.btn-r{
  background:rgba(168,32,32,.12);
  color:var(--red2);
  border-color:rgba(168,32,32,.3);
}
.btn-r:hover{
  background:rgba(168,32,32,.22);
  box-shadow:0 0 16px rgba(240,64,64,.15);
}
.btn:disabled{opacity:.35;cursor:not-allowed;filter:grayscale(.4)}
.btn-wide{width:100%;justify-content:center;padding:14px 20px;margin-top:16px;font-size:11px;letter-spacing:3px}
.btn:not(:disabled):hover{transform:translateY(-2px)}
.btn:not(:disabled):active{transform:translateY(0) scale(.98);transition-duration:.08s}
```

---

## БЛОК 3: Навигация (строка ~74)

**ЧТО ЗАМЕНИТЬ** (от `/* SIDENAV */` до `/* MAIN */`):

**НА ЧТО ЗАМЕНИТЬ:**
```css
/* SIDENAV */
.sidenav{
  position:fixed;top:50px;left:0;bottom:0;width:62px;
  background:var(--bg2);
  border-right:1px solid var(--bd);
  display:flex;flex-direction:column;align-items:center;
  padding:12px 0;gap:3px;z-index:99;
  box-shadow:2px 0 20px rgba(0,0,0,.4);
}
.ni{
  width:44px;height:44px;
  display:flex;align-items:center;justify-content:center;
  border-radius:var(--r2);
  cursor:pointer;
  color:var(--text3);
  font-size:20px;
  transition:all .2s cubic-bezier(.4,0,.2,1);
  border:1px solid transparent;
  position:relative;user-select:none;
}
.ni:hover{
  color:var(--text2);
  background:rgba(255,255,255,.05);
  border-color:var(--bd);
  transform:scale(1.08);
}
.ni.active{
  color:var(--gold);
  background:rgba(212,168,74,.1);
  border-color:rgba(212,168,74,.25);
  box-shadow:0 0 16px rgba(212,168,74,.12), inset 0 1px 0 rgba(255,255,255,.05);
}
.ni.active::before{
  content:'';
  position:absolute;
  left:-1px;top:50%;transform:translateY(-50%);
  width:3px;height:22px;
  background:linear-gradient(180deg,var(--gold2),var(--gold));
  border-radius:0 3px 3px 0;
  box-shadow:0 0 8px rgba(212,168,74,.5);
}
.ni-tip{
  position:absolute;left:54px;
  background:var(--bg3);
  border:1px solid var(--bdm);
  color:var(--text);
  font-family:var(--ff-title);
  font-size:10px;letter-spacing:1.5px;
  padding:5px 10px;border-radius:var(--r);
  white-space:nowrap;
  opacity:0;pointer-events:none;
  transition:opacity .15s, transform .15s;
  transform:translateX(-4px);
  z-index:200;
  box-shadow:var(--shadow-card);
}
.ni:hover .ni-tip{opacity:1;transform:translateX(0)}
.nsep{width:28px;height:1px;background:var(--bd);margin:5px 0;opacity:.6}
.nbadge{
  position:absolute;top:6px;right:6px;
  width:12px;height:12px;
  background:var(--red);
  border-radius:50%;
  font-size:7px;
  display:flex;align-items:center;justify-content:center;color:#fff;
  box-shadow:0 0 6px rgba(240,64,64,.5);
  animation:badge-pulse 2s ease-in-out infinite;
}
@keyframes badge-pulse{0%,100%{box-shadow:0 0 6px rgba(240,64,64,.5)}50%{box-shadow:0 0 12px rgba(240,64,64,.8)}}
```

---

## БЛОК 4: Topbar (строка ~54)

**ЧТО ЗАМЕНИТЬ** строку:
```css
.topbar{position:fixed;top:0;left:0;right:0;height:50px;background:var(--bg2);border-bottom:1px solid var(--bdm);...}
```

**НА ЧТО ЗАМЕНИТЬ:**
```css
.topbar{
  position:fixed;top:0;left:0;right:0;height:54px;
  background:var(--glass2);
  backdrop-filter:blur(16px) saturate(1.4);
  -webkit-backdrop-filter:blur(16px) saturate(1.4);
  border-bottom:1px solid rgba(40,90,160,.25);
  display:flex;align-items:center;justify-content:space-between;
  padding:0 18px 0 80px;z-index:100;
  box-shadow:0 1px 0 rgba(255,255,255,.03), 0 4px 20px rgba(0,0,0,.5);
}
.logo{font-family:var(--ff-title);font-size:18px;color:var(--gold);letter-spacing:3px;text-shadow:0 0 20px rgba(212,168,74,.3)}
.logo span{color:var(--text3);font-weight:normal;letter-spacing:2px}
.lvlbadge{
  font-family:var(--ff-title);font-size:10px;font-weight:600;
  background:linear-gradient(135deg,rgba(26,53,96,.8),rgba(36,74,138,.8));
  border:1px solid rgba(64,136,216,.3);
  color:var(--sky);padding:4px 10px;border-radius:var(--r);
  letter-spacing:1.5px;
  box-shadow:0 0 10px rgba(64,136,216,.1);
}
.xpbar{width:130px;height:4px;background:rgba(255,255,255,.06);border-radius:3px;overflow:hidden}
.xpf{height:100%;background:linear-gradient(90deg,var(--blue2),var(--sap),var(--sky));border-radius:3px;transition:width .6s cubic-bezier(.4,0,.2,1)}
.goldrow{font-family:var(--ff-title);font-size:13px;color:var(--gold);text-shadow:0 0 10px rgba(212,168,74,.25)}
.apibtn{
  font-family:var(--ff-title);font-size:9px;letter-spacing:1.5px;
  padding:5px 11px;border-radius:var(--r);cursor:pointer;
  transition:all .2s;color:var(--text3);
  background:rgba(255,255,255,.03);
  border:1px solid var(--bd);
}
.apibtn:hover{color:var(--gold);border-color:var(--bdg);background:var(--gold-glow)}
.apibtn.set{color:var(--green);border-color:rgba(40,176,96,.3)}
.rbtn{
  font-family:var(--ff-title);font-size:9px;letter-spacing:1.5px;
  padding:5px 11px;border-radius:var(--r);cursor:pointer;
  transition:all .2s;
  color:var(--red2);background:rgba(168,32,32,.08);
  border:1px solid rgba(168,32,32,.2);
}
.rbtn:hover{background:rgba(168,32,32,.18);box-shadow:0 0 12px rgba(240,64,64,.15)}
```

---

## БЛОК 5: Карточки квестов (строка ~93)

**ЧТО ЗАМЕНИТЬ** (от `/* ===== QUEST VIEW =====` до `/* ===== CHARACTER =====`):

**НА ЧТО ЗАМЕНИТЬ:**
```css
/* ===== QUEST VIEW ===== */
.qcard{
  background:var(--glass);
  border:1px solid var(--bdm);
  border-radius:var(--r2);
  overflow:hidden;
  margin-bottom:20px;
  box-shadow:var(--shadow-card);
  transition:all .28s cubic-bezier(.4,0,.2,1);
  position:relative;
}
.qcard::before{
  content:'';
  position:absolute;
  top:0;left:0;right:0;height:1px;
  background:linear-gradient(90deg,transparent,rgba(212,168,74,.3),transparent);
  pointer-events:none;z-index:1;
}
.qcard:hover{
  box-shadow:var(--shadow-hover);
  border-color:rgba(212,168,74,.2);
  transform:translateY(-2px);
}
.qart{height:190px;overflow:hidden;flex-shrink:0;display:block;position:relative}
.qart svg{display:block;width:100%;height:100%}
.qbody{padding:20px 24px;position:relative}
.ctag{
  font-family:var(--ff-title);font-size:9px;letter-spacing:2.5px;
  color:var(--sky);
  background:rgba(64,136,216,.12);
  border:1px solid rgba(64,136,216,.25);
  padding:3px 9px;border-radius:20px;
  display:inline-block;margin-bottom:10px;
  text-transform:uppercase;
  box-shadow:0 0 8px rgba(64,136,216,.1);
}
.qtit{
  font-family:var(--ff-title);font-size:22px;color:var(--gold);
  margin-bottom:5px;line-height:1.25;
  text-shadow:0 0 20px rgba(212,168,74,.2);
  letter-spacing:.5px;
}
.qsub{
  font-family:var(--ff-body);font-size:13px;
  color:var(--text3);font-style:italic;
  margin-bottom:12px;letter-spacing:.3px;
}
.orn{
  text-align:center;color:var(--gold3);
  font-size:11px;letter-spacing:10px;margin:12px 0;
  opacity:.7;
}
.lore{
  font-family:var(--ff-body);font-size:14px;
  font-style:italic;color:var(--text2);line-height:1.85;
  border-left:2px solid;
  border-image:linear-gradient(180deg,var(--gold),rgba(212,168,74,.1)) 1;
  padding-left:14px;margin-bottom:16px;
  position:relative;
}
.lore-loading{animation:pulse 1.5s infinite}
@keyframes pulse{0%,100%{opacity:.4}50%{opacity:.9}}

.qtags{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:16px}
.qt{
  font-family:var(--ff-title);font-size:9px;letter-spacing:1.5px;
  display:flex;align-items:center;gap:5px;
  color:var(--text2);
  background:rgba(255,255,255,.03);
  border:1px solid var(--bd);
  padding:5px 10px;border-radius:20px;
  transition:all .15s;
  text-transform:uppercase;
}
.qt:hover{border-color:var(--bdm);background:rgba(255,255,255,.05)}
.qt.g{
  color:var(--gold);border-color:rgba(212,168,74,.2);
  background:rgba(212,168,74,.06);
}
.qt.d{
  color:var(--red2);border-color:rgba(240,64,64,.25);
  background:rgba(240,64,64,.06);
  animation:overdue-pulse 2s ease infinite;
}
@keyframes overdue-pulse{0%,100%{box-shadow:none}50%{box-shadow:0 0 8px rgba(240,64,64,.2)}}

.qact{display:flex;gap:10px;flex-wrap:wrap}
.nhint{
  margin-top:12px;padding:10px 14px;
  background:rgba(64,136,216,.05);
  border:1px solid rgba(64,136,216,.15);
  border-radius:var(--r);font-size:12px;color:var(--text3);
  border-left:2px solid var(--sap);
}
.nhint b{color:var(--text2);font-style:italic;font-weight:normal}

/* Побочные квесты */
.sq-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:18px}
.sq{
  background:var(--glass);
  border:1px solid var(--bd);
  border-radius:var(--r2);overflow:hidden;
  cursor:pointer;
  transition:all .22s cubic-bezier(.4,0,.2,1);
  box-shadow:0 2px 12px rgba(0,0,0,.4);
  position:relative;
}
.sq::before{
  content:'';position:absolute;top:0;left:0;right:0;height:1px;
  background:linear-gradient(90deg,transparent,rgba(100,180,255,.15),transparent);
  pointer-events:none;
}
.sq:hover{
  border-color:rgba(212,168,74,.25);
  box-shadow:0 6px 24px rgba(0,0,0,.6), 0 0 0 1px rgba(212,168,74,.1);
  transform:translateY(-3px);
}
.sq:active{transform:translateY(-1px) scale(.99)}
.sq-art{height:70px;overflow:hidden;position:relative}
.sq-art svg{display:block;width:100%;height:100%}
.sq-body{padding:11px 14px}
.sq-lbl{
  font-family:var(--ff-title);font-size:8px;letter-spacing:2.5px;
  color:var(--sky);margin-bottom:5px;text-transform:uppercase;
}
.sq-tit{font-family:var(--ff-title);font-size:12px;color:var(--text);margin-bottom:3px;letter-spacing:.3px}
.sq-desc{font-size:11px;color:var(--text3);font-style:italic;line-height:1.4}
.sq-meta{display:flex;gap:8px;margin-top:7px;font-family:var(--ff-title);font-size:9px}

/* Добавить квест */
.add-q{
  width:100%;background:transparent;
  border:1px dashed rgba(40,90,160,.3);
  border-radius:var(--r2);
  padding:14px;color:var(--text3);
  font-family:var(--ff-title);font-size:10px;letter-spacing:2.5px;
  cursor:pointer;transition:all .22s;
  display:flex;align-items:center;justify-content:center;gap:8px;
  margin-bottom:24px;text-transform:uppercase;
  position:relative;overflow:hidden;
}
.add-q::before{
  content:'';position:absolute;inset:0;
  background:linear-gradient(135deg,rgba(64,136,216,.05),transparent);
  opacity:0;transition:opacity .22s;
}
.add-q:hover{
  border-color:rgba(64,136,216,.4);
  color:var(--sky);
  background:rgba(64,136,216,.05);
}
.add-q:hover::before{opacity:1}

/* Пустое состояние */
.empty-state{text-align:center;padding:60px 20px}
.empty-icon{font-size:48px;margin-bottom:16px;opacity:.3;display:block;filter:grayscale(.3)}
.empty-title{font-family:var(--ff-title);font-size:15px;color:var(--text2);margin-bottom:8px;letter-spacing:1px}
.empty-desc{font-size:13px;color:var(--text3);font-style:italic;line-height:1.6}

/* Просрочен баннер */
.overdue-banner{
  background:rgba(168,32,32,.12);
  border:1px solid rgba(168,32,32,.35);
  border-radius:var(--r);
  padding:11px 15px;margin-bottom:16px;
  font-family:var(--ff-title);font-size:10px;letter-spacing:1.5px;color:var(--red2);
  display:flex;align-items:center;gap:8px;
  text-transform:uppercase;
  box-shadow:0 0 16px rgba(240,64,64,.08);
}

/* AI бейдж */
.ai-badge{
  font-family:var(--ff-title);font-size:8px;letter-spacing:1.5px;
  color:var(--sap);
  background:rgba(64,136,216,.1);
  border:1px solid rgba(64,136,216,.2);
  padding:2px 6px;border-radius:20px;
  vertical-align:middle;margin-left:6px;
  text-transform:uppercase;
}

/* Секционный заголовок */
.shdr{
  font-family:var(--ff-title);font-size:9px;letter-spacing:4px;
  color:var(--text3);text-transform:uppercase;
  display:flex;align-items:center;gap:12px;margin-bottom:16px;
}
.shdr::after{content:'';flex:1;height:1px;background:linear-gradient(90deg,var(--bdm),transparent)}
```

---

## БЛОК 6: Анимации (строка ~278)

**ЧТО ЗАМЕНИТЬ** (от `/* ===== ANIMATIONS =====` до `</style>`):

**НА ЧТО ЗАМЕНИТЬ:**
```css
/* ===== ANIMATIONS ===== */
@keyframes fadeInUp{
  from{opacity:0;transform:translateY(24px) scale(.98)}
  to{opacity:1;transform:translateY(0) scale(1)}
}
@keyframes fadeInLeft{
  from{opacity:0;transform:translateX(-18px)}
  to{opacity:1;transform:translateX(0)}
}
@keyframes fadeInScale{
  from{opacity:0;transform:scale(.94) translateY(8px)}
  to{opacity:1;transform:scale(1) translateY(0)}
}
@keyframes shimmer{
  0%{background-position:-600px 0}
  100%{background-position:600px 0}
}
@keyframes float{
  0%,100%{transform:translateY(0)}
  50%{transform:translateY(-7px)}
}

/* Боевые анимации — переработанные */
@keyframes hero-idle{
  0%,100%{transform:translateY(0) rotate(0deg)}
  30%{transform:translateY(-4px) rotate(.5deg)}
  70%{transform:translateY(-2px) rotate(-.3deg)}
}
@keyframes enemy-idle{
  0%,100%{transform:translateY(0) scaleX(1)}
  40%{transform:translateY(-5px) scaleX(1.02)}
  80%{transform:translateY(-2px) scaleX(.99)}
}

/* Атака героя — мощный рывок вперёд */
@keyframes hero-attack{
  0%{transform:translateX(0) scaleX(1)}
  15%{transform:translateX(-8px) scaleX(.92)}
  35%{transform:translateX(30px) scaleX(1.08)}
  55%{transform:translateX(20px) scaleX(1.04)}
  75%{transform:translateX(4px) scaleX(1.01)}
  100%{transform:translateX(0) scaleX(1)}
}

/* Удар по врагу — отброс и дрожь */
@keyframes enemy-hit{
  0%{transform:translateX(0) scaleX(1) brightness(1)}
  10%{transform:translateX(18px) scaleX(.88);filter:brightness(2) saturate(0)}
  25%{transform:translateX(-8px) scaleX(1.06);filter:brightness(1.5)}
  45%{transform:translateX(5px) scaleX(.97);filter:brightness(1.2)}
  70%{transform:translateX(-2px) scaleX(1.01);filter:brightness(1)}
  100%{transform:translateX(0) scaleX(1);filter:brightness(1)}
}

/* Получение удара героем */
@keyframes hero-hit{
  0%{transform:translateX(0) scaleX(1);filter:brightness(1)}
  12%{transform:translateX(-16px) scaleX(.9);filter:brightness(2) hue-rotate(180deg)}
  30%{transform:translateX(6px) scaleX(1.04);filter:brightness(1.4)}
  55%{transform:translateX(-3px) scaleX(.98);filter:brightness(1)}
  100%{transform:translateX(0) scaleX(1);filter:brightness(1)}
}

/* Заклинание */
@keyframes hero-spell{
  0%{transform:scale(1) rotate(0deg);filter:brightness(1)}
  20%{transform:scale(1.06) rotate(-4deg);filter:brightness(1.3) hue-rotate(30deg)}
  50%{transform:scale(1.1) rotate(3deg);filter:brightness(1.8) hue-rotate(60deg) saturate(1.5)}
  75%{transform:scale(1.04) rotate(-1deg);filter:brightness(1.2) hue-rotate(20deg)}
  100%{transform:scale(1) rotate(0deg);filter:brightness(1)}
}

/* Смерть врага */
@keyframes enemy-die{
  0%{transform:scaleX(1) scaleY(1);filter:brightness(1);opacity:1}
  15%{transform:scaleX(1.15) scaleY(.85);filter:brightness(3) saturate(0)}
  35%{transform:scaleX(.85) scaleY(1.1) rotate(5deg);filter:brightness(1.5)}
  60%{transform:scaleX(1.05) scaleY(.92) rotate(-3deg);opacity:.8;filter:brightness(1.2)}
  85%{transform:scaleX(.95) scaleY(.5) rotate(8deg);opacity:.3;filter:brightness(.8)}
  100%{transform:scaleX(.9) scaleY(.1) rotate(12deg);opacity:0}
}

/* Camera shake — встряска экрана при ударе */
@keyframes cam-shake{
  0%,100%{transform:translate(0,0)}
  10%{transform:translate(-4px,-3px)}
  20%{transform:translate(5px,2px)}
  30%{transform:translate(-3px,4px)}
  40%{transform:translate(4px,-2px)}
  50%{transform:translate(-2px,3px)}
  60%{transform:translate(3px,-4px)}
  70%{transform:translate(-4px,1px)}
  80%{transform:translate(2px,3px)}
  90%{transform:translate(-1px,-2px)}
}

/* Частицы урона */
@keyframes dmg-fly{
  0%{opacity:1;transform:translateY(0) scale(1)}
  20%{opacity:1;transform:translateY(-15px) scale(1.15)}
  100%{opacity:0;transform:translateY(-65px) scale(.7)}
}

/* Лечение */
@keyframes heal-fly{
  0%{opacity:1;transform:translateY(0) scale(1)}
  100%{opacity:0;transform:translateY(-50px) scale(1.1)}
}

/* XP pop */
@keyframes xp-pop{
  0%{transform:scale(1)}
  35%{transform:scale(1.4)}
  65%{transform:scale(.92)}
  100%{transform:scale(1)}
}

/* Картинки квестов */
@keyframes img-reveal{
  from{opacity:0;filter:brightness(0) blur(4px)}
  to{opacity:1;filter:brightness(1) blur(0)}
}

/* Появление вьюх */
@keyframes slide-in-view{
  from{opacity:0;transform:translateY(12px)}
  to{opacity:1;transform:translateY(0)}
}

/* Входящие карточки — staggered */
.qcard{animation:fadeInUp .45s cubic-bezier(.34,1.26,.64,1) both}
.sq{animation:fadeInScale .38s cubic-bezier(.34,1.2,.64,1) both}
.sq:nth-child(2){animation-delay:.08s}
.view.active .pad > *{animation:fadeInUp .35s cubic-bezier(.34,1.2,.64,1) both}
.view.active .pad > *:nth-child(2){animation-delay:.06s}
.view.active .pad > *:nth-child(3){animation-delay:.12s}
.view.active .pad > *:nth-child(4){animation-delay:.18s}
.view.active .pad > *:nth-child(5){animation-delay:.22s}

/* Quest art */
.qart{position:relative;height:200px;overflow:hidden}
.qart-img{
  position:absolute;inset:0;width:100%;height:100%;object-fit:cover;
  display:block;
  animation:img-reveal .9s ease both;
  transition:transform 10s ease;
}
.qart-img:hover{transform:scale(1.06)}
.qart-overlay{
  position:absolute;inset:0;
  background:linear-gradient(to bottom,rgba(4,9,15,.05) 0%,rgba(4,9,15,.8) 100%);
  pointer-events:none;
}
.qart-placeholder{
  position:absolute;inset:0;
  background:linear-gradient(135deg,#04090f 0%,#0c1e3a 50%,#04090f 100%);
  display:flex;align-items:center;justify-content:center;
}
.qart-loading{
  background:linear-gradient(90deg,#080f1a 25%,#0c1624 50%,#080f1a 75%);
  background-size:600px 100%;
  animation:shimmer 1.8s infinite;
  position:absolute;inset:0;
}
.qart-loading-text{
  position:absolute;bottom:14px;left:18px;
  font-family:var(--ff-title);font-size:9px;letter-spacing:2.5px;
  color:rgba(212,168,74,.4);text-transform:uppercase;
}

/* Side quest art */
.sq-art{height:70px;overflow:hidden;position:relative}
.sq-art-img{
  width:100%;height:100%;object-fit:cover;
  display:block;
  animation:img-reveal .7s ease both;
  transition:transform 8s ease;
}
.sq-art:hover .sq-art-img{transform:scale(1.08)}
.sq-art-overlay{
  position:absolute;inset:0;
  background:linear-gradient(to bottom,rgba(4,9,15,.05) 0%,rgba(4,9,15,.65) 100%);
  pointer-events:none;
}

/* Боевые спрайты */
.hero-sprite{
  transition:filter .1s;
  animation:hero-idle 3s ease-in-out infinite;
}
.hero-sprite.attacking{
  animation:hero-attack .42s cubic-bezier(.36,.07,.19,.97) both;
}
.hero-sprite.casting{
  animation:hero-spell .5s ease both;
}
.hero-sprite.hit{
  animation:hero-hit .38s cubic-bezier(.36,.07,.19,.97) both;
}
.enemy-sprite{
  animation:enemy-idle 2.8s ease-in-out infinite;
}
.enemy-sprite.hit{
  animation:enemy-hit .4s cubic-bezier(.36,.07,.19,.97) both;
}
.enemy-sprite.dying{
  animation:enemy-die .7s cubic-bezier(.55,.055,.675,.19) forwards;
}

/* Camera shake — применяется к .dung-scene */
.dung-scene.shake{
  animation:cam-shake .35s cubic-bezier(.36,.07,.19,.97) both;
}

/* Числа урона */
.dmg-num{
  position:absolute;
  font-family:var(--ff-title);
  font-size:22px;font-weight:bold;
  pointer-events:none;
  animation:dmg-fly .85s cubic-bezier(.2,.8,.4,1) forwards;
  z-index:20;
  letter-spacing:1px;
  text-shadow:0 0 10px currentColor, 0 2px 6px rgba(0,0,0,.9);
}
.dmg-num.phys{color:#ff7070}
.dmg-num.magic{color:#b080ff}
.dmg-num.heal{color:#50e090;font-size:18px}

/* XP поп */
.xp-pop{animation:xp-pop .35s cubic-bezier(.34,1.56,.64,1)}

/* Переходы вьюх */
.view.active{animation:slide-in-view .28s cubic-bezier(.4,0,.2,1) both}

/* Плавные бары */
.stat-fill,.xp-mini-fill,.xpf,.p-fill,.cat-fill{
  transition:width .7s cubic-bezier(.4,0,.2,1);
}

/* Тост */
.toast{
  position:fixed;bottom:20px;right:20px;
  background:var(--glass2);
  backdrop-filter:blur(12px);
  border:1px solid var(--bdg);
  border-radius:var(--r2);
  padding:12px 18px;
  font-family:var(--ff-body);font-style:italic;font-size:13px;
  color:var(--gold);z-index:999;
  transform:translateY(16px) scale(.96);opacity:0;
  transition:all .32s cubic-bezier(.34,1.26,.64,1);
  max-width:290px;pointer-events:none;
  box-shadow:var(--shadow-gold), 0 8px 32px rgba(0,0,0,.6);
}
.toast.show{transform:translateY(0) scale(1);opacity:1}

/* Скроллбар */
::-webkit-scrollbar{width:3px}
::-webkit-scrollbar-track{background:var(--bg)}
::-webkit-scrollbar-thumb{background:var(--blue2);border-radius:2px}
::-webkit-scrollbar-thumb:hover{background:var(--sap)}
```

---

## БЛОК 7: Добавить в JS — camera shake при ударе

**Найди функцию** `dAct` (около строки 1631) и добавь в блок `if (t === 'attack')` после `animEnemy('hit')`:

```javascript
// Camera shake при ударе
var scene = document.querySelector('.dung-scene');
if (scene) {
  scene.classList.remove('shake');
  void scene.offsetWidth; // reflow
  scene.classList.add('shake');
  setTimeout(function(){ scene.classList.remove('shake'); }, 360);
}
```

**Найди функцию** `animHero` и замени строку:
```javascript
el.classList.add(cls);
```
на:
```javascript
el.classList.add(cls);
// Переименование классов под новые анимации
if (cls === 'attacking') el.classList.add('attacking');
if (cls === 'casting') el.classList.add('casting');
if (cls === 'hit') el.classList.add('hit');
```

*(Это уже совместимо, просто убедись что классы `.hero-sprite.attacking` и `.enemy-sprite.hit` применяются корректно — они уже есть в коде)*

---

## Что изменится после патча

| Элемент | До | После |
|---|---|---|
| Карточки квестов | Плоские, серые | Glassmorphism, свечение при hover, gold border |
| Кнопки | Квадратные, тусклые | Pill-shaped, gradient gold, spring-эффект |
| Навигация | Простые иконки | Active indicator, hover scale, badge pulse |
| Topbar | Статичный | Blur backdrop, gradient XP bar |
| Атака в бою | Простой translateX | Рывок вперёд + enemy hit-stop + camera shake |
| Числа урона | Мелкие | Крупные с glow, физичный полёт вверх |
| Анимации появления | fadeIn | Spring easing с overshoot |
