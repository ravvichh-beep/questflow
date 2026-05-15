# QuestFlow — CSS Патч 2: Модалки, Персонаж, Подземелье, Статистика, Журнал

## Инструкция для Claude Code

Применяй блоки по одному, строго в порядке. Перед началом убедись что `questflow_backup.html` уже создан (из Патча 1).

---

## БЛОК 1: Персонаж (CHARACTER)

**ЧТО ЗАМЕНИТЬ** (от `/* ===== CHARACTER =====` до `/* ===== STATS =====`):

**НА ЧТО ЗАМЕНИТЬ:**
```css
/* ===== CHARACTER ===== */
.char-layout{display:grid;grid-template-columns:240px 1fr;gap:20px}

.char-panel{
  background:var(--glass);
  border:1px solid var(--bdm);
  border-radius:var(--r2);
  padding:20px;
  position:relative;overflow:hidden;
  box-shadow:var(--shadow-card);
}
.char-panel::before{
  content:'';position:absolute;top:0;left:0;right:0;height:1px;
  background:linear-gradient(90deg,transparent,var(--sap),var(--gold),transparent);
  opacity:.5;
}
.char-panel::after{
  content:'';position:absolute;
  top:-60px;left:50%;transform:translateX(-50%);
  width:200px;height:200px;
  background:radial-gradient(circle,rgba(64,136,216,.06) 0%,transparent 70%);
  pointer-events:none;
}

.portrait{
  width:110px;height:140px;
  margin:0 auto 16px;display:block;
  filter:drop-shadow(0 0 16px rgba(64,136,216,.3));
  transition:filter .3s;
}
.portrait:hover{filter:drop-shadow(0 0 24px rgba(212,168,74,.4))}

.cname{
  font-family:var(--ff-title);font-size:16px;
  color:var(--text);text-align:center;
  margin-bottom:3px;letter-spacing:1px;
  text-shadow:0 0 20px rgba(255,255,255,.1);
}
.ccls{
  font-family:var(--ff-body);font-style:italic;
  color:var(--gold);font-size:13px;
  text-align:center;margin-bottom:14px;
  text-shadow:0 0 12px rgba(212,168,74,.3);
}

.xp-mini-bar{
  height:5px;
  background:rgba(255,255,255,.05);
  border-radius:3px;overflow:hidden;
  margin-top:4px;margin-bottom:14px;
  box-shadow:inset 0 1px 2px rgba(0,0,0,.4);
}
.xp-mini-fill{
  height:100%;
  background:linear-gradient(90deg,var(--blue2),var(--sap),var(--sky));
  border-radius:3px;
  box-shadow:0 0 6px rgba(64,136,216,.4);
}

.stat-row{display:flex;align-items:center;gap:8px;margin-bottom:8px}
.stat-name{
  font-family:var(--ff-title);font-size:8px;
  letter-spacing:1.5px;color:var(--text3);
  width:66px;flex-shrink:0;text-transform:uppercase;
}
.stat-bar{
  flex:1;height:5px;
  background:rgba(255,255,255,.04);
  border-radius:3px;overflow:hidden;
  box-shadow:inset 0 1px 2px rgba(0,0,0,.4);
}
.stat-fill{height:100%;border-radius:3px;transition:width .6s cubic-bezier(.4,0,.2,1)}
.stat-val{
  font-family:var(--ff-title);font-size:9px;
  color:var(--text2);width:28px;text-align:right;
}

.gold-box{
  margin-top:12px;padding:10px;
  background:rgba(212,168,74,.05);
  border:1px solid rgba(212,168,74,.2);
  border-radius:var(--r);text-align:center;
  box-shadow:0 0 16px rgba(212,168,74,.06);
}
.gold-lbl{
  font-family:var(--ff-title);font-size:8px;
  letter-spacing:2.5px;color:var(--text3);
  margin-bottom:4px;text-transform:uppercase;
}
.gold-val{
  font-family:var(--ff-title);font-size:20px;
  color:var(--gold);
  text-shadow:0 0 12px rgba(212,168,74,.3);
}

/* Снаряжение */
.equip-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:16px}
.eslot{
  background:rgba(255,255,255,.02);
  border:1px solid var(--bd);
  border-radius:var(--r);padding:11px;
  transition:border-color .2s;
}
.eslot:hover{border-color:var(--bdm)}
.eslbl{
  font-family:var(--ff-title);font-size:7px;
  letter-spacing:2px;color:var(--text3);
  margin-bottom:6px;text-transform:uppercase;
}
.eitem{display:flex;align-items:center;gap:8px}
.eico{
  width:30px;height:30px;border-radius:var(--r);
  display:flex;align-items:center;justify-content:center;
  font-size:15px;flex-shrink:0;
}
.eico.r{
  background:rgba(120,56,176,.18);
  border:1px solid rgba(120,56,176,.4);
  box-shadow:0 0 8px rgba(120,56,176,.15);
}
.eico.c{
  background:rgba(40,90,160,.13);
  border:1px solid rgba(64,136,216,.2);
}
.ename{font-family:var(--ff-title);font-size:10px;color:var(--text);letter-spacing:.3px}
.ebonus{font-size:10px;color:var(--green)}
.eempty{font-size:11px;color:var(--text3);font-style:italic}

/* Инвентарь */
.inv-list{display:flex;flex-direction:column;gap:6px;max-height:230px;overflow-y:auto}
.inv-item{
  display:flex;align-items:center;gap:10px;
  padding:9px 12px;
  background:rgba(255,255,255,.02);
  border:1px solid var(--bd);
  border-radius:var(--r);
  cursor:pointer;
  transition:all .2s cubic-bezier(.4,0,.2,1);
}
.inv-item:hover{
  border-color:rgba(212,168,74,.25);
  background:rgba(212,168,74,.04);
  transform:translateX(3px);
}
.inv-icon{
  width:30px;height:30px;border-radius:var(--r);
  display:flex;align-items:center;justify-content:center;
  font-size:15px;flex-shrink:0;
}
.inv-name{font-family:var(--ff-title);font-size:11px;color:var(--text);margin-bottom:1px;letter-spacing:.3px}
.inv-desc{font-size:10px;color:var(--text3);font-style:italic}
.inv-bonus{font-size:10px;color:var(--green);margin-top:1px}
.inv-rarity{
  font-family:var(--ff-title);font-size:8px;letter-spacing:1px;
  margin-left:auto;padding:2px 7px;border-radius:20px;flex-shrink:0;
  text-transform:uppercase;
}
.inv-rarity.r{
  color:#b070f0;
  background:rgba(120,56,176,.12);
  border:1px solid rgba(120,56,176,.3);
  box-shadow:0 0 6px rgba(120,56,176,.15);
}
.inv-rarity.c{color:var(--text2);background:rgba(40,90,160,.08);border:1px solid var(--bd)}

/* Лавка */
.shop-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px}
.shop-item{
  background:rgba(255,255,255,.02);
  border:1px solid var(--bd);
  border-radius:var(--r);padding:12px;
  text-align:center;cursor:pointer;
  transition:all .22s cubic-bezier(.4,0,.2,1);
  position:relative;overflow:hidden;
}
.shop-item::before{
  content:'';position:absolute;inset:0;
  background:linear-gradient(135deg,rgba(212,168,74,.04),transparent);
  opacity:0;transition:opacity .22s;
}
.shop-item:hover{
  border-color:rgba(212,168,74,.3);
  background:rgba(212,168,74,.05);
  transform:translateY(-3px);
  box-shadow:0 6px 20px rgba(0,0,0,.4), 0 0 12px rgba(212,168,74,.1);
}
.shop-item:hover::before{opacity:1}
.shop-icon{font-size:24px;margin-bottom:6px;display:block}
.shop-name{font-family:var(--ff-title);font-size:10px;color:var(--text);margin-bottom:3px;letter-spacing:.5px}
.shop-bonus{font-size:10px;color:var(--green);margin-bottom:6px}
.shop-price{font-family:var(--ff-title);font-size:11px;color:var(--gold);text-shadow:0 0 8px rgba(212,168,74,.3)}

/* Достижения */
.ach-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.ach{
  background:rgba(212,168,74,.05);
  border:1px solid rgba(212,168,74,.18);
  border-radius:var(--r);padding:10px;
  display:flex;align-items:center;gap:8px;
  transition:all .2s;
}
.ach:hover{
  border-color:rgba(212,168,74,.35);
  box-shadow:0 0 12px rgba(212,168,74,.08);
}
.ach.locked{
  opacity:.3;border-color:var(--bd);
  background:rgba(255,255,255,.01);
  filter:grayscale(.8);
}
.ach-icon{font-size:18px}
.ach-name{font-family:var(--ff-title);font-size:10px;color:var(--gold);letter-spacing:.5px}
.ach-desc{font-size:9px;color:var(--text3);margin-top:1px}
```

---

## БЛОК 2: Статистика (STATS)

**ЧТО ЗАМЕНИТЬ** (от `/* ===== STATS =====` до `/* ===== JOURNAL / PROJECTS =====`):

**НА ЧТО ЗАМЕНИТЬ:**
```css
/* ===== STATS ===== */
.stat-cards{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:22px}
.scard{
  background:var(--glass);
  border:1px solid var(--bd);
  border-radius:var(--r2);padding:18px;
  text-align:center;
  box-shadow:var(--shadow-card);
  transition:all .22s cubic-bezier(.4,0,.2,1);
  position:relative;overflow:hidden;
}
.scard::before{
  content:'';position:absolute;top:0;left:0;right:0;height:1px;
  background:linear-gradient(90deg,transparent,rgba(212,168,74,.2),transparent);
}
.scard:hover{
  transform:translateY(-4px);
  box-shadow:var(--shadow-hover);
  border-color:rgba(212,168,74,.2);
}
.scard-val{
  font-family:var(--ff-title);font-size:28px;
  color:var(--gold);margin-bottom:5px;
  text-shadow:0 0 16px rgba(212,168,74,.25);
  line-height:1;
}
.scard-lbl{
  font-family:var(--ff-title);font-size:8px;
  letter-spacing:2.5px;color:var(--text3);
  text-transform:uppercase;
}

.chart-wrap{
  background:var(--glass);
  border:1px solid var(--bd);
  border-radius:var(--r2);
  padding:18px;margin-bottom:18px;
  box-shadow:var(--shadow-card);
}
.chart-hdr{display:flex;align-items:center;justify-content:space-between;margin-bottom:16px}
.chart-title{font-family:var(--ff-title);font-size:10px;color:var(--text2);letter-spacing:1px}
.chart-tabs{display:flex;gap:6px}
.ctab{
  font-family:var(--ff-title);font-size:9px;letter-spacing:1.5px;
  padding:4px 11px;border-radius:20px;cursor:pointer;
  border:1px solid var(--bd);color:var(--text3);
  background:transparent;transition:all .18s;
  text-transform:uppercase;
}
.ctab:hover{color:var(--text2);border-color:var(--bdm)}
.ctab.active{
  color:var(--gold);
  border-color:rgba(212,168,74,.3);
  background:rgba(212,168,74,.08);
  box-shadow:0 0 8px rgba(212,168,74,.1);
}

.chart-bars{display:flex;align-items:flex-end;gap:6px;height:120px}
.cbar-wrap{flex:1;display:flex;flex-direction:column;align-items:center;gap:4px;height:100%;justify-content:flex-end}
.cbar{
  width:100%;border-radius:3px 3px 0 0;min-height:3px;
  background:rgba(64,136,216,.15);
  position:relative;transition:height .5s cubic-bezier(.4,0,.2,1);
}
.cbar.filled{
  background:linear-gradient(180deg,var(--sky),var(--sap),var(--blue2));
  box-shadow:0 0 8px rgba(64,136,216,.25);
}
.cbar-lbl{font-family:var(--ff-title);font-size:7px;color:var(--text3);letter-spacing:.5px}

.cat-rows{display:flex;flex-direction:column;gap:10px}
.cat-row{display:flex;align-items:center;gap:12px}
.cat-name{font-family:var(--ff-title);font-size:9px;color:var(--text2);width:62px;flex-shrink:0;letter-spacing:.5px}
.cat-bar{flex:1;height:7px;background:rgba(255,255,255,.04);border-radius:4px;overflow:hidden}
.cat-fill{height:100%;border-radius:4px;transition:width .7s cubic-bezier(.4,0,.2,1)}
.cat-count{font-family:var(--ff-title);font-size:9px;color:var(--text3);width:24px;text-align:right}
```

---

## БЛОК 3: Журнал и проекты (JOURNAL / PROJECTS)

**ЧТО ЗАМЕНИТЬ** (от `/* ===== JOURNAL / PROJECTS =====` до `/* ===== DUNGEON =====`):

**НА ЧТО ЗАМЕНИТЬ:**
```css
/* ===== JOURNAL / PROJECTS ===== */
.j-item{
  background:var(--glass);
  border:1px solid var(--bd);
  border-radius:var(--r);
  padding:12px 16px;
  display:flex;align-items:center;gap:12px;
  margin-bottom:8px;
  transition:all .2s cubic-bezier(.4,0,.2,1);
  position:relative;overflow:hidden;
}
.j-item::before{
  content:'';position:absolute;left:0;top:0;bottom:0;width:2px;
  background:linear-gradient(180deg,var(--green),rgba(40,176,96,.2));
  border-radius:0 2px 2px 0;
}
.j-item:hover{
  border-color:rgba(40,176,96,.2);
  background:rgba(40,176,96,.04);
  transform:translateX(3px);
}
.j-chk{
  width:22px;height:22px;border-radius:50%;
  background:rgba(40,176,96,.12);
  border:1px solid rgba(40,176,96,.35);
  display:flex;align-items:center;justify-content:center;
  flex-shrink:0;font-size:10px;color:var(--green);
  box-shadow:0 0 8px rgba(40,176,96,.15);
}
.j-tit{flex:1;font-size:13px;color:var(--text2);font-style:italic;line-height:1.4}
.j-xp{font-family:var(--ff-title);font-size:9px;color:var(--sap);letter-spacing:.5px}
.j-gold{font-family:var(--ff-title);font-size:9px;color:var(--gold)}
.j-date{font-size:9px;color:var(--text3)}

.p-card{
  background:var(--glass);
  border:1px solid var(--bd);
  border-radius:var(--r2);padding:16px;
  margin-bottom:12px;
  box-shadow:var(--shadow-card);
  transition:all .2s cubic-bezier(.4,0,.2,1);
}
.p-card:hover{border-color:var(--bdm);box-shadow:var(--shadow-hover)}
.p-name{
  font-family:var(--ff-title);font-size:15px;
  color:var(--gold);margin-bottom:4px;letter-spacing:.5px;
  text-shadow:0 0 12px rgba(212,168,74,.15);
}
.p-desc{font-size:13px;color:var(--text3);font-style:italic;margin-bottom:12px;line-height:1.5}
.p-bar{
  height:4px;background:rgba(255,255,255,.05);
  border-radius:3px;overflow:hidden;
}
.p-fill{
  height:100%;
  background:linear-gradient(90deg,var(--blue2),var(--sap),var(--sky));
  border-radius:3px;
  box-shadow:0 0 6px rgba(64,136,216,.3);
}
.p-lbl{font-family:var(--ff-title);font-size:8px;color:var(--text3);margin-top:5px;letter-spacing:.5px}
```

---

## БЛОК 4: Подземелье (DUNGEON)

**ЧТО ЗАМЕНИТЬ** (от `/* ===== DUNGEON =====` до `/* ===== MODAL =====`):

**НА ЧТО ЗАМЕНИТЬ:**
```css
/* ===== DUNGEON ===== */
.dung-wrap{display:grid;grid-template-columns:1fr 280px;min-height:calc(100vh - 54px)}
.dung-arena{display:flex;flex-direction:column;border-right:1px solid var(--bd)}

.dung-top{
  padding:12px 18px;
  border-bottom:1px solid var(--bd);
  display:flex;align-items:center;justify-content:space-between;
  background:var(--glass2);
  backdrop-filter:blur(8px);
  flex-shrink:0;
}
.dung-top-title{
  font-family:var(--ff-title);font-size:10px;
  letter-spacing:3px;color:var(--gold);
  text-transform:uppercase;
  text-shadow:0 0 10px rgba(212,168,74,.3);
}
.dung-top-floor{font-family:var(--ff-title);font-size:9px;color:var(--text3);letter-spacing:1px}

.dung-scene{
  flex:1;min-height:240px;
  position:relative;overflow:hidden;
  background:radial-gradient(ellipse at 50% 80%,#060e1e 0%,#020508 100%);
}
/* Атмосферный туман в подземелье */
.dung-scene::before{
  content:'';position:absolute;inset:0;
  background:
    radial-gradient(ellipse at 20% 90%,rgba(40,90,160,.08) 0%,transparent 50%),
    radial-gradient(ellipse at 80% 90%,rgba(120,40,180,.06) 0%,transparent 50%);
  pointer-events:none;z-index:0;
}
/* Линия пола */
.dung-scene::after{
  content:'';position:absolute;
  bottom:22%;left:0;right:0;height:1px;
  background:linear-gradient(90deg,transparent,rgba(40,90,160,.3),transparent);
  pointer-events:none;
}

.dung-log{
  padding:10px 16px;
  border-top:1px solid var(--bd);
  max-height:130px;overflow-y:auto;
  background:var(--glass2);
  flex-shrink:0;
}
.dl{
  font-family:var(--ff-body);font-size:12px;
  font-style:italic;padding:2px 0;
  line-height:1.5;
  animation:fadeInLeft .2s ease both;
}
.dl.dmg{color:var(--red2)}
.dl.heal{color:var(--green)}
.dl.gold{color:var(--gold)}
.dl.sys{color:var(--sky)}

.dung-panel{
  display:flex;flex-direction:column;gap:10px;
  padding:14px;
  background:var(--bg2);overflow-y:auto;
}
.d-card{
  background:var(--glass);
  border:1px solid var(--bd);
  border-radius:var(--r);padding:13px;
  box-shadow:0 2px 8px rgba(0,0,0,.3);
}
.d-card-title{
  font-family:var(--ff-title);font-size:8px;
  letter-spacing:2.5px;color:var(--text3);
  margin-bottom:10px;text-transform:uppercase;
}

/* HP/MP бары — толще и с glow */
.hp-row{margin-bottom:7px}
.hp-row-top{display:flex;justify-content:space-between;margin-bottom:3px}
.hp-lbl{font-family:var(--ff-title);font-size:8px;letter-spacing:1.5px;color:var(--text3);text-transform:uppercase}
.hp-val{font-family:var(--ff-title);font-size:9px;color:var(--text2)}
.hp-bar{
  height:8px;background:rgba(255,255,255,.04);
  border-radius:4px;overflow:hidden;
  box-shadow:inset 0 1px 3px rgba(0,0,0,.5);
}
.hp-fill{
  height:100%;
  background:linear-gradient(90deg,#7a0000,#c03030,#f04040);
  border-radius:4px;
  transition:width .4s cubic-bezier(.4,0,.2,1);
  box-shadow:0 0 8px rgba(240,64,64,.3);
  position:relative;
}
.hp-fill::after{
  content:'';position:absolute;top:0;left:0;right:0;height:40%;
  background:rgba(255,255,255,.15);border-radius:4px 4px 0 0;
}
.mp-fill{
  height:100%;
  background:linear-gradient(90deg,var(--blue),var(--sap),var(--sky));
  border-radius:4px;
  transition:width .4s cubic-bezier(.4,0,.2,1);
  box-shadow:0 0 8px rgba(64,136,216,.3);
  position:relative;
}
.mp-fill::after{
  content:'';position:absolute;top:0;left:0;right:0;height:40%;
  background:rgba(255,255,255,.15);border-radius:4px 4px 0 0;
}
.ehp-bar{
  height:8px;background:rgba(255,255,255,.04);
  border-radius:4px;overflow:hidden;margin:8px 0;
  box-shadow:inset 0 1px 3px rgba(0,0,0,.5);
}
.ehp-fill{
  height:100%;
  background:linear-gradient(90deg,#5b0000,#a02020,var(--red));
  border-radius:4px;
  transition:width .35s cubic-bezier(.4,0,.2,1);
  box-shadow:0 0 10px rgba(200,32,32,.35);
  position:relative;
}
.ehp-fill::after{
  content:'';position:absolute;top:0;left:0;right:0;height:40%;
  background:rgba(255,255,255,.12);border-radius:4px 4px 0 0;
}

/* Кнопки действий в бою */
.act-grid{display:grid;grid-template-columns:1fr 1fr;gap:7px}
.act-btn{
  background:rgba(255,255,255,.03);
  border:1px solid var(--bd);
  border-radius:var(--r);
  padding:11px 7px;cursor:pointer;
  transition:all .2s cubic-bezier(.4,0,.2,1);
  text-align:center;
  position:relative;overflow:hidden;
}
.act-btn::before{
  content:'';position:absolute;inset:0;
  background:linear-gradient(135deg,rgba(255,255,255,.04),transparent);
  opacity:0;transition:opacity .2s;
}
.act-btn:hover:not(:disabled){
  background:rgba(64,136,216,.1);
  border-color:rgba(64,136,216,.3);
  transform:translateY(-2px);
  box-shadow:0 4px 12px rgba(0,0,0,.4);
}
.act-btn:hover:not(:disabled)::before{opacity:1}
.act-btn:active:not(:disabled){transform:translateY(0) scale(.97)}
.act-btn:disabled{opacity:.3;cursor:not-allowed;filter:grayscale(.5)}
.act-name{
  font-family:var(--ff-title);font-size:9px;
  color:var(--text);margin-bottom:2px;letter-spacing:.5px;
}
.act-desc{font-size:9px;color:var(--text3);font-style:italic}
```

---

## БЛОК 5: Модальные окна (MODAL)

**ЧТО ЗАМЕНИТЬ** (от `/* ===== MODAL =====` до `/* ===== TOAST =====`):

**НА ЧТО ЗАМЕНИТЬ:**
```css
/* ===== MODAL ===== */
.m-overlay{
  display:none;position:fixed;inset:0;
  background:rgba(0,0,0,.88);
  backdrop-filter:blur(6px);
  -webkit-backdrop-filter:blur(6px);
  z-index:500;
  align-items:center;justify-content:center;
}
.m-overlay.open{
  display:flex;
  animation:overlay-in .25s ease both;
}
@keyframes overlay-in{
  from{opacity:0;backdrop-filter:blur(0)}
  to{opacity:1;backdrop-filter:blur(6px)}
}

.modal{
  background:var(--glass2);
  backdrop-filter:blur(20px) saturate(1.3);
  -webkit-backdrop-filter:blur(20px) saturate(1.3);
  border:1px solid var(--bdm);
  border-radius:var(--r2);
  padding:24px;
  width:460px;max-width:95vw;
  max-height:90vh;overflow-y:auto;
  position:relative;
  box-shadow:
    0 24px 80px rgba(0,0,0,.8),
    0 0 0 1px rgba(255,255,255,.04) inset,
    0 1px 0 rgba(255,255,255,.06) inset;
  animation:modal-in .3s cubic-bezier(.34,1.26,.64,1) both;
}
@keyframes modal-in{
  from{opacity:0;transform:translateY(20px) scale(.95)}
  to{opacity:1;transform:translateY(0) scale(1)}
}

.modal::before{
  content:'';position:absolute;top:0;left:0;right:0;height:1px;
  background:linear-gradient(90deg,transparent,var(--sap),var(--gold),transparent);
  border-radius:var(--r2) var(--r2) 0 0;
  opacity:.6;
}
.modal::after{
  content:'';position:absolute;
  top:-80px;left:50%;transform:translateX(-50%);
  width:300px;height:200px;
  background:radial-gradient(circle,rgba(64,136,216,.05) 0%,transparent 70%);
  pointer-events:none;
}

.m-title{
  font-family:var(--ff-title);font-size:15px;
  color:var(--gold);margin-bottom:18px;
  letter-spacing:1px;
  text-shadow:0 0 12px rgba(212,168,74,.2);
}
.m-close{
  position:absolute;top:14px;right:14px;
  background:rgba(255,255,255,.04);
  border:1px solid var(--bd);
  border-radius:var(--r);
  color:var(--text3);font-size:14px;
  cursor:pointer;line-height:1;
  width:28px;height:28px;
  display:flex;align-items:center;justify-content:center;
  transition:all .15s;
}
.m-close:hover{
  color:var(--text);
  background:rgba(255,255,255,.08);
  border-color:var(--bdm);
}

/* Поля форм */
.fg{margin-bottom:14px}
.flbl{
  font-family:var(--ff-title);font-size:8px;
  letter-spacing:2.5px;color:var(--text3);
  display:block;margin-bottom:7px;
  text-transform:uppercase;
}
.fi{
  width:100%;
  background:rgba(255,255,255,.04);
  border:1px solid var(--bd);
  border-radius:var(--r);
  padding:10px 14px;
  font-family:var(--ff-body);font-size:14px;
  color:var(--text);outline:none;
  transition:all .2s;
  box-shadow:inset 0 1px 3px rgba(0,0,0,.3);
}
.fi:focus{
  border-color:rgba(64,136,216,.5);
  background:rgba(64,136,216,.06);
  box-shadow:inset 0 1px 3px rgba(0,0,0,.3), 0 0 0 2px rgba(64,136,216,.1);
}
.fi::placeholder{color:var(--text3)}
textarea.fi{resize:vertical;min-height:64px;line-height:1.6}

.fsel{
  width:100%;
  background:rgba(255,255,255,.04);
  border:1px solid var(--bd);
  border-radius:var(--r);
  padding:10px 14px;
  font-family:var(--ff-title);font-size:9px;
  letter-spacing:1px;
  color:var(--text);outline:none;
  appearance:none;cursor:pointer;
  transition:border-color .2s;
  text-transform:uppercase;
}
.fsel:focus{border-color:rgba(64,136,216,.5)}

.frow{display:grid;grid-template-columns:1fr 1fr;gap:12px}

/* Звёзды */
.star-row{display:flex;gap:5px}
.star{
  font-size:22px;cursor:pointer;
  color:var(--text3);
  transition:all .15s cubic-bezier(.34,1.56,.64,1);
  line-height:1;user-select:none;
}
.star:hover{transform:scale(1.2)}
.star.on{
  color:var(--gold);
  text-shadow:0 0 8px rgba(212,168,74,.5);
}

.m-actions{display:flex;gap:10px;margin-top:16px}

/* Сброс */
.reset-list{
  background:rgba(168,32,32,.08);
  border:1px solid rgba(168,32,32,.25);
  border-radius:var(--r);padding:12px;
  margin-bottom:14px;
  display:flex;flex-direction:column;gap:6px;
}
.reset-row{display:flex;align-items:center;gap:8px;font-size:13px;color:var(--text2)}
.reset-confirm{
  width:100%;
  background:rgba(168,32,32,.08);
  border:1px solid rgba(168,32,32,.35);
  border-radius:var(--r);
  padding:9px 12px;
  font-family:var(--ff-title);font-size:12px;
  color:var(--red2);outline:none;
  text-align:center;letter-spacing:3px;
  transition:all .2s;
}
.reset-confirm:focus{
  border-color:rgba(240,64,64,.6);
  box-shadow:0 0 0 2px rgba(240,64,64,.1), 0 0 12px rgba(240,64,64,.1);
}
.reset-confirm::placeholder{color:rgba(240,64,64,.28)}
```

---

## БЛОК 6: Онбординг

**ЧТО ЗАМЕНИТЬ** (от `/* ===== ONBOARDING =====` до `/* ===== BUTTONS =====`):

**НА ЧТО ЗАМЕНИТЬ:**
```css
/* ===== ONBOARDING ===== */
#onboarding{
  position:fixed;inset:0;
  background:radial-gradient(ellipse at 50% 30%,#0c1e3a 0%,#04090f 60%);
  z-index:1000;
  display:flex;align-items:center;justify-content:center;
}
/* Декоративные частицы фона */
#onboarding::before{
  content:'';position:absolute;inset:0;
  background:
    radial-gradient(circle at 20% 20%,rgba(64,136,216,.06) 0%,transparent 40%),
    radial-gradient(circle at 80% 80%,rgba(120,40,180,.05) 0%,transparent 40%),
    radial-gradient(circle at 50% 0%,rgba(212,168,74,.04) 0%,transparent 50%);
  pointer-events:none;
}

.ob-wrap{
  width:520px;max-width:95vw;
  text-align:center;padding:24px;
  position:relative;z-index:1;
  animation:fadeInUp .6s cubic-bezier(.34,1.2,.64,1) both;
}
.ob-logo{
  font-family:var(--ff-title);font-size:38px;
  color:var(--gold);letter-spacing:4px;
  margin-bottom:8px;
  text-shadow:0 0 30px rgba(212,168,74,.4), 0 0 60px rgba(212,168,74,.15);
}
.ob-sub{
  font-family:var(--ff-body);font-style:italic;
  color:var(--text3);font-size:15px;
  margin-bottom:40px;letter-spacing:.5px;
}
.ob-step{display:none}.ob-step.active{display:block;animation:fadeInScale .35s cubic-bezier(.34,1.2,.64,1) both}
.ob-label{
  font-family:var(--ff-title);font-size:11px;
  letter-spacing:3px;color:var(--text3);
  text-transform:uppercase;margin-bottom:16px;
}
.ob-input{
  width:100%;
  background:rgba(255,255,255,.04);
  border:1px solid var(--bdm);
  border-radius:var(--r);
  padding:16px 20px;
  font-family:var(--ff-title);font-size:20px;
  color:var(--text);outline:none;
  text-align:center;letter-spacing:3px;
  transition:all .2s;
  backdrop-filter:blur(8px);
  box-shadow:inset 0 2px 6px rgba(0,0,0,.3);
}
.ob-input:focus{
  border-color:rgba(64,136,216,.6);
  background:rgba(64,136,216,.06);
  box-shadow:inset 0 2px 6px rgba(0,0,0,.3), 0 0 0 3px rgba(64,136,216,.1), 0 0 20px rgba(64,136,216,.1);
}
.ob-hint{font-size:13px;color:var(--text3);font-style:italic;margin-top:12px;line-height:1.5}

.ob-classes{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin:20px 0}
.ob-cls{
  background:rgba(255,255,255,.03);
  border:1px solid var(--bd);
  border-radius:var(--r2);
  padding:20px 16px;cursor:pointer;
  transition:all .22s cubic-bezier(.4,0,.2,1);
  text-align:center;
  position:relative;overflow:hidden;
}
.ob-cls::before{
  content:'';position:absolute;inset:0;
  background:linear-gradient(135deg,rgba(64,136,216,.05),transparent);
  opacity:0;transition:opacity .22s;
}
.ob-cls:hover{
  border-color:var(--bdm);
  background:rgba(255,255,255,.05);
  transform:translateY(-3px);
  box-shadow:0 8px 24px rgba(0,0,0,.4);
}
.ob-cls:hover::before{opacity:1}
.ob-cls.sel{
  border-color:rgba(64,136,216,.5);
  background:rgba(64,136,216,.1);
  box-shadow:0 0 0 1px rgba(64,136,216,.2), 0 0 20px rgba(64,136,216,.1);
}
.ob-cls.sel::before{opacity:1}
.ob-cls-icon{font-size:32px;margin-bottom:10px;display:block;filter:drop-shadow(0 0 8px rgba(255,255,255,.1))}
.ob-cls-name{font-family:var(--ff-title);font-size:13px;color:var(--text);margin-bottom:5px;letter-spacing:.5px}
.ob-cls-desc{font-size:11px;color:var(--text3);line-height:1.5;font-style:italic}
```

---

## Итого что изменится

| Экран | До | После |
|---|---|---|
| Онбординг | Плоский серый фон | Радиальный градиент, glow-заголовок, hover на карточках классов |
| Персонаж | Плоские бары, скучные слоты | Glow-бары, анимированный hover инвентаря, портрет с drop-shadow |
| Лавка | Простые карточки | Hover-подъём + gold glow |
| Статистика | Скучные цифры | Карточки с depth, glow-бары категорий |
| Журнал | Список без стиля | Левая цветная полоска, hover-сдвиг |
| Подземелье | Плоский чёрный фон | Атмосферный туман, glow HP-бары, кнопки атаки с hover |
| Модалки | Обычный div | Blur-стекло, анимация появления, glow-поля при фокусе |
| Форма добавления | Тусклые инпуты | Glassmorphism, focus-glow, star hover |
