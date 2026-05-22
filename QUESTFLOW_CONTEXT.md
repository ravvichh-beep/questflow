# QUESTFLOW — Полный контекст проекта

> Этот файл — дамп всего контекста. Загрузи его в новом чате чтобы продолжить проект без потери информации.
> Дата обновления: 2026-05-21

---

## 1. ЧТО ЗА ПРОЕКТ

**QuestFlow «Хроники Судьбы»** — PWA-приложение-планировщик задач в стиле тёмного фэнтези
(Ведьмак / Dark Souls / Dragon Age). Каждая задача = RPG-квест охотника на чудовищ.

- **Владелец:** Даня — не программист, объяснять простыми словами
- **Стек:** vanilla HTML/CSS/JS, без фреймворков, без сборщика, всё в одном файле
- **Хранение:** localStorage, ключ `qf5`, глобальное состояние — объект `S`

---

## 2. ФАЙЛЫ И ПУТИ

| Что | Путь |
|---|---|
| Главный рабочий файл | `C:\Users\danya\OneDrive\Документы\questflow\files\questflow.html` (~8000 строк) |
| Деплой-копия | `C:\Users\danya\OneDrive\Документы\questflow\index.html` |
| Доп. окно фокуса | `C:\Users\danya\OneDrive\Документы\questflow\focus.html` |
| Service Worker | `C:\Users\danya\OneDrive\Документы\questflow\service-worker.js` |
| AI-ассеты (оригиналы) | `assets/bg/`, `assets/covers/`, `assets/portraits/` (PNG 6-8MB) |
| AI-ассеты (для веба) | `assets/web/` (JPEG, оптимизированы, 2.3MB всего) |
| Инструменты генерации | `tools/batch-gen.sh`, `tools/gen-image.sh`, `tools/jobs-*.txt` |
| Roadmap | `QUESTFLOW_ROADMAP_v2.md` |
| Этот контекст | `QUESTFLOW_CONTEXT.md` |

**Рабочий процесс:** правки в `files/questflow.html` → `node --check` синтаксиса →
`cp files/questflow.html index.html` → `netlify deploy --prod --dir .`

---

## 3. ДЕПЛОЙ И АККАУНТЫ

- **Прод URL:** https://eloquent-pie-092094.netlify.app
- **GitHub:** https://github.com/ravvichh-beep/questflow (владелец `ravvichh-beep`)
- **Netlify:** проект `eloquent-pie-092094`, siteId `df30e813-0c39-4c05-b138-b3c43203852b`
- **Команда деплоя:** `cd questflow && netlify deploy --prod --dir .`
- **Локальный сервер:** `npx serve -p 8766` в корне questflow
- **GitHub коммит:** детальное описание + `git push origin main`

---

## 4. ТЕКУЩАЯ ВЕРСИЯ

**v3.1.0 «Атмосфера Таверны»** (в проде)
Следующая будет **v3.2.0** — интеграция AI-фонов.

Версия меняется в 3 местах: `APP_VERSION` константа, `app-version-num` бейдж,
`vm-version-num` модалка + CACHE_NAME в service-worker.js (`questflow-vX.Y.Z`).

---

## 5. ЧТО УЖЕ РАБОТАЕТ (70+ фич за 5 фаз + 3 редизайна)

- **Phase 1 (v2.0):** PWA, Netlify деплой, Service Worker, офлайн
- **Phase 2 (v2.1):** Login Streak, анимация выполнения квеста, случайный лут,
  HP теряется ночью, Magic Moment в онбординге, ритуал конца дня, нарративные push
- **Phase 3 (v2.2):** World Mood System, Mood-Adaptive Difficulty, Berserk Mode,
  Mentor Trust (0-100), Voice TTS наставника, 6 случайных мини-событий
- **Phase 4 (v2.3):** Firebase Cloud Sync (опционально, Google auth, Last-Write-Wins merge)
- **Phase 5 (v2.4):** Personal Saga (еженедельная AI/локальная сага), sharing PNG 1080×1080
- **v2.5–v3.1:** редизайн «Кодекс Охотника» — пергаментные карточки, сургучные печати,
  ромбовидный sidebar, атмосферный 6-слойный фон, ember-glow

**Базовый геймплей:** квесты с категориями (study/work/health/hobby/life),
прокачка героя (XP/уровни/классы), подземелье с боёвкой (10 врагов), календарь,
архив, журнал, обряды (рутины), Mood Tracker, Battle Concentration (Pomodoro 25 мин),
достижения, инвентарь, лавка снаряжения.

**Генерация контента (без API ключа):**
- Локальный генератор названий квестов (80 готовых названий, 8 описаний на категорию)
- Canvas-генератор обложек квестов (процедурные арты по категориям)
- Если введён Claude API ключ — генерация через Claude улучшает текст

---

## 6. ДИЗАЙН-СИСТЕМА v3 «КОДЕКС ОХОТНИКА»

**Палитра:**
- Фон тёплый чёрный `#0a0706`, поверхности камень/дерево `#1a120a`–`#2e1c0e`
- Пергамент `#f4e8c8` → `#d8c498`, текст на пергаменте `#3a2010`
- Медное золото `#b8893f` / яркое `#e0b25a` / `#f4d572`
- Сургуч-красный `#8b1a1a`, ember-оранжевый `#d4621e`
- Текст кремовый `#ead5a4`, вторичный `#8b6a3a`

**Шрифты:** Cormorant Garamond → Palatino → Georgia fallback (только системные, без Google Fonts)

**Ключевые элементы:**
- Карточка квеста = пергамент с рваными краями (clip-path), сургучная печать
  с буквой класса (S/A/B/C/D) выпирает слева под углом -6°
- S = красный сургуч (легендарный), A = золото, B = синий, C = зелёный, D = серый
- Sidebar = ромбовидные медальоны (clip-path polygon)
- Топбар 64px, двойная золотая полоса снизу
- Дата в стиле «ТРАВЕНЬ MMXXVI» (славянский месяц + римский год)
- Терминология: квесты→заказы, неделя→седмица, рубрика «CAPITULUM N»,
  подзаголовок «ЗАДАЧА ОХОТНИКА»
- Атмосфера: 6-слойный фон (камень+виньетка+дымка+свечи+искры+grain),
  плавающие искры через CSS-анимацию emberFloat

---

## 7. MUAPI — ГЕНЕРАЦИЯ ИЗОБРАЖЕНИЙ

MuAPI (muapi.ai) — платный агрегатор AI-моделей. **Авторизован**, баланс был ~$29.89.

- **API ключ:** хранится в keychain через `muapi auth configure`
- **Бинарник CLI:** `C:\Users\danya\AppData\Roaming\npm\node_modules\muapi-cli\bin\muapi-windows-x86_64.exe`
- **Заголовок авторизации:** `x-api-key: <КЛЮЧ>` (НЕ `Bearer`!)
- **Лучшая модель для арта:** `nano-banana-2` (Gemini 3.1 Flash Image), $0.06-0.09/картинка
- **Endpoint:** `POST https://api.muapi.ai/api/v1/nano-banana-2`
  Тело: `{"prompt":"...","aspect_ratio":"16:9","resolution":"2k","output_format":"png"}`
- **Async:** возвращает `request_id` → поллить `GET /api/v1/predictions/{id}/result`
  до `"status":"completed"` → скачать URL из `outputs[]`
- **Готовый скрипт:** `tools/batch-gen.sh jobs.txt` (формат строки: `outpath|aspect|prompt`)
  ⚠ В промптах НЕ использовать двойные кавычки и обратный слэш (ломает JSON)
- `python` в bash-оболочке сломан — использовать `node` или прямой bash

**Промпт-стиль (зашит в batch-gen.sh):**
`painterly oil painting concept art, The Witcher 3 and Dark Souls atmosphere,
dramatic chiaroscuro lighting, warm candlelight, rich warm browns deep blacks
and amber gold highlights, ultra detailed masterpiece, no text, no UI, cinematic`

---

## 8. AI-АССЕТЫ (сгенерированы 2026-05-21)

В `assets/web/` лежат оптимизированные JPEG (готовы к интеграции):

**Фоны экранов (≈200-260KB, 1600px):**
- `bg-quests-board.jpg` — таверна с доской заказов → экран Квестов
- `bg-library.jpg` — древняя библиотека → Бестиарий/Журнал
- `bg-dungeon.jpg` — каземат с факелами → Подземелье
- `bg-shop.jpg` — лавка с зельями → Лавка
- `bg-hero-hall.jpg` — зал с доспехами → Персонаж
- `bg-projects.jpg` — стол с картой → Проекты
- `bg-calendar.jpg` — обсерватория → Календарь/Летопись

**Обложки категорий (≈50-90KB, 900px):**
- `cover-study.jpg`, `cover-work.jpg`, `cover-health.jpg`, `cover-hobby.jpg`, `cover-life.jpg`

**Портреты героев (≈58-96KB, 600px, для онбординга):**
- `p01-warrior.jpg` (Воин), `p02-keeper.jpg` (Хранитель/маг),
  `p03-druid.jpg` (Друид), `p04-rogue.jpg` (Странник/вор), `p05-wanderer.jpg` (Странник)

Оригиналы PNG 2k — в `assets/bg/`, `assets/covers/`, `assets/portraits/`.

---

## 9. ROADMAP (из QUESTFLOW_ROADMAP_v2.md)

- **Блок 1:** Design Foundation — дизайн-токены, design-system.md
- **Блок 2:** UI Редизайн — 11 экранов в пергаментном стиле (главный готов, остальные 10 — TODO)
- **Блок 3:** Контент — 40 врагов, 10 боссов, 12 предметов из v3-макета
- **Блок 4:** Quality Gates — WCAG, Mobile, Performance, Security
- **Блок 5:** Firebase + соцфичи — гильдии, лидерборды
- **Блок 6:** Валидация на 20-30 тестерах, запуск

**Сейчас:** интеграция AI-фонов (v3.2.0), затем продолжение Блока 2.

---

## 10. КРИТИЧЕСКИЕ КОНВЕНЦИИ

- НИКОГДА не использовать Google Fonts (PWA offline ломается)
- НИКОГДА внешние CSS/JS библиотеки — всё inline
- После КАЖДОГО изменения JS: `node --check` синтаксиса
- Изменения сначала в `files/questflow.html`, потом `cp` в `index.html`
- Бампить версию в 3 местах + SW CACHE_NAME при каждом релизе
- Магические числа → константы в начале `<script>`
- Перед тестом прода через Playwright: очистить SW + caches + localStorage
- AI-картинки квестов: при отсутствии — fallback на Canvas-генератор
- НЕ использовать Pollinations.ai (нестабилен, 402/timeout) — теперь MuAPI nano-banana-2

---

## 11. ДОСТУПНЫЕ ИНСТРУМЕНТЫ

- **MCP:** filesystem, memory, github, playwright, desktop-commander, figma, computer-use
- **Дизайн-команды:** /design-brief (мастер) + 40 спец-команд (/color-specialist,
  /motion-designer, /accessibility-specialist и т.д.)
- **Код-команды:** /plan, /tdd, /code-review, /security-review, /build-fix
- **memory MCP** хранит сущности: QuestFlow, Design System v3, Features, Roadmap, Conventions

---

## 12. КАК ПРОДОЛЖИТЬ В НОВОМ ЧАТЕ

Скажи: «Прочитай QUESTFLOW_CONTEXT.md и продолжаем проект QuestFlow».
Текущая задача: завершить интеграцию AI-фонов (v3.2.0) и двигаться по Блоку 2 —
переделать остальные 10 экранов в пергаментном стиле «Кодекс Охотника».
