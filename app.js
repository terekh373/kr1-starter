const announcements = [
  { title: "Консультація з веб-технологій", category: "Навчання", date: "2026-10-28", urgent: false, text: "Ауд. 305, 14:00. Приносьте питання по PR." },
  { title: "Зміна розкладу на п'ятницю", category: "Адмін", date: "2026-10-30", urgent: true, text: "Пари переносяться на годину раніше." },
  { title: "Хакатон кафедри", category: "Події", date: "2026-11-14", urgent: false, text: "Реєстрація до 10 листопада. Команди по 3." },
  { title: "Здати залікові книжки", category: "Адмін", date: "2026-11-03", urgent: true, text: "Деканат, до 16:00." },
  { title: "Лекція гостя з індустрії", category: "Події", date: "2026-11-06", urgent: false, text: "Про роботу з ШІ-агентами в команді." },
  { title: "Дедлайн по лабораторній 5", category: "Навчання", date: "2026-10-31", urgent: true, text: "PR має бути злитий до пари." },
];

const list = document.querySelector("#list");
const empty = document.querySelector("#empty");
const select = document.querySelector("#category");

function render(items) {
  list.textContent = "";
  for (const a of items) {
    const li = document.createElement("li");
    li.className = "card";
    const tag = document.createElement("span");
    tag.className = a.urgent ? "tag urgent" : "tag";
    tag.textContent = a.category;
    const h3 = document.createElement("h3");
    h3.textContent = a.title;
    const date = document.createElement("time");
    date.dateTime = a.date;
    date.textContent = a.date;
    const p = document.createElement("p");
    p.textContent = a.text;
    li.append(tag, h3, date, p);
    list.append(li);
  }
  empty.hidden = items.length > 0;
}

function applyFilter() {
  const value = select.value;
  const filtered = value === "all" ? announcements : announcements.filter((a) => a.category.toLowerCase() === value.toLowerCase());
  render(filtered);
}

select.addEventListener("change", applyFilter);
render(announcements);

// Блок «Найближчі вихідні»: державні свята України з https://date.nager.at
const holidaysBtn = document.querySelector("#holidays-btn");
const holidaysStatus = document.querySelector("#holidays-status");
const holidaysList = document.querySelector("#holidays-list");

if (holidaysBtn && holidaysStatus && holidaysList) {
  holidaysBtn.addEventListener("click", loadHolidays);
}

async function loadHolidays() {
  // Щоб повторне натискання не дублювало список
  holidaysList.textContent = "";
  // Стан 1: завантаження
  holidaysStatus.textContent = "Завантажую…";
  holidaysBtn.disabled = true;

  try {
    const year = new Date().getFullYear();
    const response = await fetch(`https://date.nager.at/api/v3/PublicHolidays/${year}/UA`);

    // Обов'язкова перевірка response.ok
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    // Брейкпоінт для перевірки: поставте breakpoint на наступному рядку
    // та подивіться значення змінної data у DevTools.
    const holidays = data;

    const now = new Date();
    const todayStr =
      `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

    const upcoming = holidays
      .filter((h) => typeof h.date === "string" && h.date > todayStr)
      .sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0))
      .slice(0, 3);

    for (const h of upcoming) {
      const li = document.createElement("li");
      li.className = "card";

      const date = document.createElement("time");
      date.dateTime = h.date;
      date.textContent = h.date;

      const name = document.createElement("p");
      name.textContent = h.localName;

      li.append(date, name);
      holidaysList.append(li);
    }

    // Стан 3: порожньо при успіху
    holidaysStatus.textContent = "";
  } catch (err) {
    // Стан 2: зрозуміла людині помилка
    holidaysStatus.textContent = "Не вдалося завантажити свята. Перевірте з’єднання з інтернетом і спробуйте ще раз.";
  } finally {
    // Після помилки кнопка знову активна; під час завантаження була disabled
    holidaysBtn.disabled = false;
  }
}
