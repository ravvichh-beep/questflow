# Настройка Firebase для синхронизации QuestFlow

Эта инструкция включит **синхронизацию данных между всеми твоими устройствами**: открыл квест на телефоне → он появился на компьютере через секунду.

**Без Firebase приложение тоже работает** — просто данные хранятся только на одном устройстве.

---

## Что получишь после настройки

- ☁ Кнопка "Войти через Google" в приложении
- Один Google-аккаунт = одни данные везде
- Автоматическая синхронизация (каждое действие → в облако через 1.5 сек)
- Realtime: изменил квест на ПК — увидел на телефоне сразу
- Офлайн режим: всё работает без интернета, синкается когда появится

---

## Пошагово (5–10 минут)

### Шаг 1: Создать Firebase проект

1. Открой **https://console.firebase.google.com**
2. Войди через Google (можно тот же что используешь обычно)
3. Нажми **"Add project"** / "Создать проект"
4. Имя: `questflow` (или любое)
5. **Google Analytics**: можно отключить (не нужно)
6. Жми "Create" → жди ~20 секунд

### Шаг 2: Включить Google Sign-In

1. Слева в меню → **"Build" → "Authentication"**
2. Нажми **"Get started"**
3. Вкладка **"Sign-in method"** → выбери **"Google"**
4. Включи переключатель **Enable**
5. **Project support email**: твой email
6. Жми **Save**

### Шаг 3: Включить Firestore Database

1. Слева в меню → **"Build" → "Firestore Database"**
2. Нажми **"Create database"**
3. **Location**: `eur3 (Europe)` (или ближайший к тебе)
4. **Mode**: выбери **"Start in production mode"** (потом откроем доступ для своих)
5. Жми **Create**

### Шаг 4: Открыть доступ к своим данным

1. В Firestore → вкладка **"Rules"**
2. Замени всё содержимое на:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

3. Жми **Publish**

Это правило: **каждый пользователь видит только свои данные**. Чужие — никто.

### Шаг 5: Получить конфиг

1. Слева в меню → **⚙ Project Settings** (шестерёнка)
2. Прокрути вниз до **"Your apps"**
3. Жми **`</>`** (Web app icon)
4. App nickname: `questflow-web` → **Register app**
5. Появится блок с кодом — найди объект `firebaseConfig`:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "questflow-XXXX.firebaseapp.com",
  projectId: "questflow-XXXX",
  storageBucket: "questflow-XXXX.appspot.com",
  messagingSenderId: "...",
  appId: "1:..."
};
```

6. **Скопируй весь объект** `firebaseConfig`

### Шаг 6: Вставить конфиг в QuestFlow

В файле `index.html` (или `files/questflow.html`) найди такой блок (в `<head>`, около строки 15):

```html
<script>
window.FIREBASE_CONFIG = null;
</script>
```

Замени `null` на свой config:

```html
<script>
window.FIREBASE_CONFIG = {
  apiKey: "AIzaSy...",
  authDomain: "questflow-XXXX.firebaseapp.com",
  projectId: "questflow-XXXX",
  storageBucket: "questflow-XXXX.appspot.com",
  messagingSenderId: "...",
  appId: "1:..."
};
</script>
```

### Шаг 7: Разрешить твой домен

1. Вернись в Firebase Console → **Authentication → Settings → Authorized domains**
2. Добавь:
   - `eloquent-pie-092094.netlify.app` (или твой Netlify URL)
   - `localhost` (для разработки)

### Шаг 8: Передеплоить

В терминале в папке проекта:

```bash
netlify deploy --prod --dir .
```

Готово! Открой сайт → нажми **☁** в правом верхнем углу → **"Войти через Google"**.

---

## Проверка что работает

1. Войди на компьютере → создай квест "Тест синка"
2. Открой ту же ссылку на телефоне → **войди тем же Google-аккаунтом**
3. Через 1-2 секунды квест должен появиться

---

## Безопасность

✅ **Только ты видишь свои данные** — правила Firestore это гарантируют
✅ **Пароль не используется** — только Google OAuth
✅ **Конфиг публичный** — это нормально, его можно показывать (API key для Web это идентификатор, не секрет)
✅ **Бесплатно** до 50К операций/день — для одного пользователя хватит на годы

---

## Если что-то пошло не так

| Проблема | Решение |
|---|---|
| "Войти через Google" → ошибка `auth/unauthorized-domain` | Добавь твой домен в Authorized domains (Шаг 7) |
| "Failed to get document because the client is offline" | Проверь Шаг 4 — правила Firestore |
| Кнопка ☁ не появляется | Проверь что вставил config правильно, перезагрузи страницу с Ctrl+Shift+R |
| Не видит данные с другого устройства | Зашёл ли там тем же Google-аккаунтом? |

---

## Стоимость

Firebase **бесплатен** для нашего объёма:
- Firestore Free tier: 50,000 чтений + 20,000 записей в день
- Authentication: бесплатно для Google Sign-In
- Один активный пользователь ≈ 100-300 операций в день
- Запас: на ~150 активных пользователей в день без платы
