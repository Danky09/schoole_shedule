document.addEventListener('DOMContentLoaded', () => {
    const classSelect = document.getElementById('classSelect');
    const weekdaySelect = document.getElementById('weekdaySelect');
    const scheduleContainer = document.getElementById('scheduleTable');

    let scheduleData = null;

    // Загружаем данные из JSON
    fetch('schedule.json')
        .then(response => {
            if (!response.ok) throw new Error('Не удалось загрузить расписание');
            return response.json();
        })
        .then(data => {
            scheduleData = data;
            renderSchedule(); // отображаем расписание по умолчанию
        })
        .catch(error => {
            scheduleContainer.innerHTML = `<div class="loading">❌ Ошибка загрузки данных: ${error.message}</div>`;
        });

    // Функция отрисовки расписания
    function renderSchedule() {
        if (!scheduleData) return;

        const selectedClass = classSelect.value;
        const selectedWeekday = weekdaySelect.value;

        // Проверяем, есть ли данные для выбранного класса и дня
        if (!scheduleData[selectedClass] || !scheduleData[selectedClass][selectedWeekday]) {
            scheduleContainer.innerHTML = `<div class="loading">📭 Расписание для ${selectedClass} на этот день отсутствует.</div>`;
            return;
        }

        const lessons = scheduleData[selectedClass][selectedWeekday];

        // Создаём таблицу
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

    // Обновляем расписание при изменении выбора
    classSelect.addEventListener('change', renderSchedule);
    weekdaySelect.addEventListener('change', renderSchedule);
});