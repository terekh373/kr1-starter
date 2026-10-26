# Завдання 1. Три тикети

## Тикет 1
Скарга: «На сайті, відкритому за посиланням (Pages), кнопка „Додати“ у шапці веде на 404. У мене на ноутбуці все працює».
Шар: HTML
Інструмент: Зайшовши в HTML одразу побачив помилку
Винуватець: index.html:<li><a href="Add.html">Додати</a></li>
Причина: На серверах GitHub Pages (Linux) назви файлів строго чутливі до регістру літер, тоді як на моєму локальному комп'ютері (Windows/macOS) ця різниця ігнорується, тому виникає помилка 404.
Виправлення: index.html:<li><a href="add.html">Додати</a></li>

## Тикет 2
Скарга: «Термінові оголошення мають бути з червоною позначкою категорії — а вони сірі, як усі».
Шар: CSS
Інструмент: DevTools -> Elements -> элемент span з класами tag, urgent
Винуватець: style.css:.tag .urgent { background: #fee2e2; color: var(--urgent); font-weight: 600; }
Причина: Синтаксично все вірно, але ".tag .urgent" (з пробілом) шукає елемент із класом urgent, який знаходиться всередині елемента з класом tag (вкладеність), тому css робить не те, що очікував користувач.
Виправлення: style.css:.tag.urgent { background: #fee2e2; color: var(--urgent); font-weight: 600; }

## Тикет 3
Скарга: «Обираю категорію у фільтрі — показує „Нічого не знайдено“, хоча оголошення цієї категорії є. Працює тільки „усі“».
Шар: JS
Інструмент: DevTools -> Elements -> select#category, app.js -> find "select#category"
Винуватець: app.js:const filtered = value === "all" ? announcements : announcements.filter((a) => a.category === value);
Причина: Проблема полягає у чутливості до регістру між значеннями у масиві announcements та значеннями в атрибутах <option> у HTML.
Виправлення: Зробити порівняння незалежним від регістру - const filtered = value === "all" ? announcements : announcements.filter((a) => a.category.toLowerCase() === value.toLowerCase());