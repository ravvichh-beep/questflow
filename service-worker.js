/* QuestFlow Service Worker — офлайн-кэш через cache-first стратегию */

const CACHE_NAME = 'questflow-v3.4.1';
const ASSETS = [
  './',
  './index.html',
  './privacy.html',
  './focus.html',
  './manifest.json',
  './icon.svg',
  './icon-maskable.svg',
  './icon-192.png',
  './icon-512.png',
  './icon-maskable.png',
  // Фоны
  './assets/web/bg-quests-board.jpg',
  './assets/web/bg-library.jpg',
  './assets/web/bg-dungeon.jpg',
  './assets/web/bg-shop.jpg',
  './assets/web/bg-hero-hall.jpg',
  './assets/web/bg-projects.jpg',
  './assets/web/bg-calendar.jpg',
  './assets/web/bg-routines.jpg',
  './assets/web/bg-archive.jpg',
  './assets/web/bg-stats.jpg',
  './assets/web/bg-bestiary.jpg',
  // Свиток и боковые заметки
  './assets/web/scroll-main.jpg',
  './assets/web/note-side.jpg',
  // Обложки квестов по категориям
  './assets/web/cover-study.jpg',
  './assets/web/cover-work.jpg',
  './assets/web/cover-health.jpg',
  './assets/web/cover-hobby.jpg',
  './assets/web/cover-life.jpg',
  // Портреты героя
  './assets/web/p01-warrior.jpg',
  './assets/web/p02-keeper.jpg',
  './assets/web/p03-druid.jpg',
  './assets/web/p04-rogue.jpg',
  './assets/web/p05-wanderer.jpg'
];

// Установка: складываем критичные ресурсы в кэш
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(ASSETS))
      .catch((err) => console.warn('[SW] precache failed:', err))
  );
  self.skipWaiting();
});

// Активация: удаляем старые версии кэша
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch стратегия:
// - HTML/JS/manifest → network-first (всегда свежее, fallback на кэш если оффлайн)
// - Иконки/SVG → cache-first (статика, меняется редко)
// - API запросы → не трогаем
self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);

  // Никогда не кэшируем запросы к Anthropic API и Pollinations.ai
  if (url.hostname === 'api.anthropic.com' || url.hostname.includes('pollinations.ai')) {
    return;
  }

  // Не наш домен — пропускаем
  if (url.origin !== self.location.origin) return;

  // Network-first для HTML и manifest (чтобы обновления применялись сразу)
  const isHTML = req.mode === 'navigate' || req.destination === 'document'
              || url.pathname === '/' || url.pathname.endsWith('.html')
              || url.pathname.endsWith('.json');

  if (isHTML) {
    event.respondWith(
      fetch(req)
        .then((resp) => {
          if (resp && resp.ok) {
            const clone = resp.clone();
            caches.open(CACHE_NAME).then((c) => c.put(req, clone));
          }
          return resp;
        })
        .catch(() => caches.match(req).then((c) => c || caches.match('./index.html')))
    );
    return;
  }

  // Cache-first для статики (иконки, SVG)
  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req)
        .then((resp) => {
          if (resp && resp.ok) {
            const clone = resp.clone();
            caches.open(CACHE_NAME).then((c) => c.put(req, clone));
          }
          return resp;
        })
        .catch(() => new Response('', { status: 503, statusText: 'Offline' }));
    })
  );
});

// Сообщение от страницы: можно вызвать обновление кэша
self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting();
});
