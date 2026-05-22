/**
 * QuestFlow API — Cloudflare Worker
 * Прокси к Claude API с rate limiting и хранением ключа в env.
 * Бесплатный tier: 100,000 запросов/день.
 *
 * Эндпоинты:
 *   POST /api/quest    — фэнтезийное название + lore квеста
 *   POST /api/text     — общий промпт (сага, наставник, поздравление)
 *   GET  /api/health   — проверка работоспособности
 */

const ANTHROPIC_API  = 'https://api.anthropic.com/v1/messages';
const DEFAULT_MODEL  = 'claude-3-5-haiku-20241022';
const RATE_LIMIT_DAY = 20;   // запросов на IP в сутки

// ─── CORS заголовки ─────────────────────────────────────────────────────────
const CORS = {
  'Access-Control-Allow-Origin' : '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

function cors(resp) {
  Object.entries(CORS).forEach(([k, v]) => resp.headers.set(k, v));
  return resp;
}

function json(data, status = 200) {
  return cors(new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  }));
}

// ─── Rate limiting через KV ──────────────────────────────────────────────────
async function checkRateLimit(request, env, ctx) {
  if (!env.RATE_KV) return false; // без KV — не ограничиваем
  const ip    = request.headers.get('CF-Connecting-IP') || 'unknown';
  const day   = new Date().toISOString().slice(0, 10);
  const key   = `rl:${ip}:${day}`;
  const count = parseInt((await env.RATE_KV.get(key)) || '0');
  if (count >= RATE_LIMIT_DAY) return true; // заблокировать
  ctx.waitUntil(env.RATE_KV.put(key, String(count + 1), { expirationTtl: 86400 }));
  return false;
}

// ─── Вызов Anthropic ─────────────────────────────────────────────────────────
async function callAnthropic(prompt, maxTokens, env) {
  if (!env.ANTHROPIC_API_KEY) {
    return json({ error: 'no_key', message: 'API key not configured' }, 503);
  }

  const resp = await fetch(ANTHROPIC_API, {
    method : 'POST',
    headers: {
      'Content-Type'    : 'application/json',
      'x-api-key'       : env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model     : DEFAULT_MODEL,
      max_tokens: maxTokens,
      system    : 'Ты — нарратор тёмного фэнтези в стиле Ведьмака и Dragon Age. Пишешь на русском. Стиль: атмосферный, мрачный, средневековый.',
      messages  : [{ role: 'user', content: prompt }],
    }),
  });

  if (!resp.ok) {
    const err = await resp.text();
    console.error('[Worker] Anthropic error', resp.status, err);
    return json({ error: 'upstream_error', status: resp.status }, 502);
  }

  const data = await resp.json();
  const text = (data.content?.[0]?.text) || '';
  return json({ ok: true, text });
}

// ─── Обработчики эндпоинтов ──────────────────────────────────────────────────
const CAT_LABELS = {
  work: 'Работа', study: 'Учёба', health: 'Здоровье',
  hobby: 'Хобби', life: 'Жизнь', personal: 'Личное',
};

async function handleQuest(body, env) {
  const { title = '', category = 'personal', difficulty = 3, description = '' } = body;
  const epicSuffix = difficulty >= 4
    ? ', очень эпично и драматично'
    : difficulty <= 2 ? ', коротко и ёмко' : '';

  const prompt =
    `Задача: "${title}"\n` +
    (description ? `Описание: "${description}"\n` : '') +
    `Категория: ${CAT_LABELS[category] || category}\n` +
    `Сложность: ${difficulty}/5\n\n` +
    `Ответь ТОЛЬКО валидным JSON без markdown-оберток:\n` +
    `{"title":"Фэнтезийное название 2-5 слов на русском","lore":"Описание 1-3 предложения${epicSuffix}"}\n` +
    `Запрещено: слова задача/задание/цель. Используй: квест/миссия/путь/испытание.`;

  return callAnthropic(prompt, 200, env);
}

async function handleText(body, env) {
  const { prompt = '', maxTokens = 400 } = body;
  if (!prompt) return json({ error: 'empty_prompt' }, 400);
  const capped = Math.min(Math.max(parseInt(maxTokens) || 400, 50), 800);
  return callAnthropic(prompt, capped, env);
}

// ─── Главный обработчик ───────────────────────────────────────────────────────
export default {
  async fetch(request, env, ctx) {
    // Preflight CORS
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS });
    }

    const url = new URL(request.url);

    // Health-check
    if (url.pathname === '/api/health') {
      return json({
        ok     : true,
        version: '1.0.0',
        hasKey : !!env.ANTHROPIC_API_KEY,
        hasKV  : !!env.RATE_KV,
      });
    }

    // Только POST для AI-эндпоинтов
    if (request.method !== 'POST') {
      return json({ error: 'method_not_allowed' }, 405);
    }

    // Rate limiting
    const limited = await checkRateLimit(request, env, ctx);
    if (limited) {
      return json({
        error  : 'rate_limit',
        message: 'Дневной лимит 20 запросов исчерпан. Возвращайся завтра, охотник.',
      }, 429);
    }

    // Парсим тело
    let body;
    try { body = await request.json(); }
    catch { return json({ error: 'invalid_json' }, 400); }

    // Маршрутизация
    if (url.pathname === '/api/quest') return handleQuest(body, env);
    if (url.pathname === '/api/text')  return handleText(body, env);

    return json({ error: 'not_found' }, 404);
  },
};
