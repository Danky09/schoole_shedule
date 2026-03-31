document.addEventListener('DOMContentLoaded', () => {
    const classSelect = document.getElementById('classSelect');
    const weekdaySelect = document.getElementById('weekdaySelect');
    const scheduleContainer = document.getElementById('scheduleTable');

    // ---- РЕЗЕРВНЫЕ ДАННЫЕ (пример) ----
    const fallbackData = {
    "5А": {
    "monday": [
      { "num": 1, "name": "Русский язык", "room": "101" },
      { "num": 2, "name": "Математика", "room": "102" },
      { "num": 3, "name": "Английский язык", "room": "103" },
      { "num": 4, "name": "История", "room": "104" },
      { "num": 5, "name": "Физкультура", "room": "Спортзал" }
    ],
    "tuesday": [
      { "num": 1, "name": "Литература", "room": "101" },
      { "num": 2, "name": "Математика", "room": "102" },
      { "num": 3, "name": "Биология", "room": "105" },
      { "num": 4, "name": "География", "room": "106" },
      { "num": 5, "name": "ИЗО", "room": "107" }
    ],
    "wednesday": [
      { "num": 1, "name": "Русский язык", "room": "101" },
      { "num": 2, "name": "Математика", "room": "102" },
      { "num": 3, "name": "Английский язык", "room": "103" },
      { "num": 4, "name": "Музыка", "room": "108" },
      { "num": 5, "name": "Технология", "room": "Мастерская" }
    ],
    "thursday": [
      { "num": 1, "name": "Литература", "room": "101" },
      { "num": 2, "name": "Математика", "room": "102" },
      { "num": 3, "name": "Окружающий мир", "room": "109" },
      { "num": 4, "name": "Физкультура", "room": "Спортзал" },
      { "num": 5, "name": "Английский язык", "room": "103" }
    ],
    "friday": [
      { "num": 1, "name": "Русский язык", "room": "101" },
      { "num": 2, "name": "Математика", "room": "102" },
      { "num": 3, "name": "ИЗО", "room": "107" },
      { "num": 4, "name": "Литература", "room": "101" },
      { "num": 5, "name": "Классный час", "room": "101" }
    ],
    "saturday": [
      { "num": 1, "name": "Математика", "room": "102" },
      { "num": 2, "name": "Русский язык", "room": "101" },
      { "num": 3, "name": "Физкультура", "room": "Спортзал" }
    ]
  },
    "10М": {
    "monday": [
      { "num": 1, "name": "Информатика", "room": "207" },
      { "num": 2, "name": "Математика", "room": "201" },
      { "num": 3, "name": "Русский язык", "room": "202" },
      { "num": 4, "name": "Физика", "room": "203" },
      { "num": 5, "name": "Английский язык", "room": "204" },
      { "num": 6, "name": "Обществознание", "room": "205" }
    ],
    "tuesday": [
      { "num": 1, "name": "Математика", "room": "201" },
      { "num": 2, "name": "Информатика", "room": "207" },
      { "num": 3, "name": "Химия", "room": "206" },
      { "num": 4, "name": "Литература", "room": "202" },
      { "num": 5, "name": "История", "room": "205" },
      { "num": 6, "name": "Физкультура", "room": "Спортзал" }
    ],
    "wednesday": [
      { "num": 1, "name": "Астрономия", "room": "203" },
      { "num": 2, "name": "Алгебра", "room": "201" },
      { "num": 3, "name": "Русский язык", "room": "202" },
      { "num": 4, "name": "Физика", "room": "203" },
      { "num": 5, "name": "Английский язык", "room": "204" },
      { "num": 6, "name": "Биология", "room": "105" }
    ],
    "thursday": [
      { "num": 1, "name": "Геометрия", "room": "201" },
      { "num": 2, "name": "Информатика", "room": "207" },
      { "num": 3, "name": "Обществознание", "room": "205" },
      { "num": 4, "name": "Физика", "room": "203" },
      { "num": 5, "name": "Литература", "room": "202" },
      { "num": 6, "name": "Физкультура", "room": "Спортзал" }
    ],
    "friday": [
      { "num": 1, "name": "Математика", "room": "201" },
      { "num": 2, "name": "Русский язык", "room": "202" },
      { "num": 3, "name": "Химия", "room": "206" },
      { "num": 4, "name": "История", "room": "205" },
      { "num": 5, "name": "Английский язык", "room": "204" },
      { "num": 6, "name": "ОБЗР", "room": "108" }
    ],
    "saturday": [
      { "num": 1, "name": "Математика", "room": "201" },
      { "num": 2, "name": "Информатика", "room": "207" },
      { "num": 3, "name": "Русский язык", "room": "202" }
    ]
  }
}

    let scheduleData = null;

    // Пытаемся загрузить из JSON, если не получается — используем fallback
    fetch('schedule.json')
        .then(response => {
            if (!response.ok) throw new Error('Файл не найден');
            return response.json();
        })
        .then(data => {
            scheduleData = data;
            renderSchedule();
        })
        .catch(error => {
            console.warn('Не удалось загрузить schedule.json, использую встроенные данные', error);
            scheduleData = fallbackData;
            renderSchedule();
        });

    function renderSchedule() {
        if (!scheduleData) return;
        const selectedClass = classSelect.value;
        const selectedWeekday = weekdaySelect.value;

        if (!scheduleData[selectedClass] || !scheduleData[selectedClass][selectedWeekday]) {
            scheduleContainer.innerHTML = `<div class="loading">📭 Расписание для ${selectedClass} на этот день отсутствует.</div>`;
            return;
        }

        const lessons = scheduleData[selectedClass][selectedWeekday];
        let tableHTML = `
            <table>
                <thead>
                    <tr><th>№</th><th>Предмет</th><th>Кабинет</th></tr>
                </thead>
                <tbody>
        `;
        lessons.forEach(lesson => {
            tableHTML += `
                <tr>
                    <td>${lesson.num}</td>
                    <td><span class="lesson-name">${lesson.name}</span></td>
                    <td><span class="lesson-room">${lesson.room}</span></td>
                </tr>
            `;
        });
        tableHTML += `</tbody></table>`;
        scheduleContainer.innerHTML = tableHTML;
    }

    classSelect.addEventListener('change', renderSchedule);
    weekdaySelect.addEventListener('change', renderSchedule);

    // ----- (оставь код для модального окна с расписанием звонков без изменений) -----
    // ... тут был код для модалки, он не меняется ...
    // Если его нет, скопируй из предыдущего полного файла script.js
});