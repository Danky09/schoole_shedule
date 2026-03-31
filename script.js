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
            renderSchedule();
        })
        .catch(error => {
            scheduleContainer.innerHTML = `<div class="loading">❌ Ошибка загрузки данных: ${error.message}</div>`;
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

    // --- Модальное окно с расписанием звонков ---
    const modal = document.getElementById('scheduleModal');
    const btn = document.getElementById('showScheduleBtn');
    const span = document.getElementsByClassName('close')[0];
    const tabBtns = document.querySelectorAll('.tab-btn');
    const modalTableContainer = document.getElementById('scheduleTableModal');

    // Данные расписания звонков (из файла звонки.jpg)
    const bellSchedule = {
        monday: [
            { num: 1, start: '08:00', end: '08:40', break: '10 мин' },
            { num: 2, start: '08:50', end: '09:30', break: '20 мин' },
            { num: 3, start: '09:50', end: '10:30', break: '20 мин' },
            { num: 4, start: '10:50', end: '11:30', break: '20 мин' },
            { num: 5, start: '11:50', end: '12:30', break: '10 мин' },
            { num: 6, start: '12:40', end: '13:20', break: '10 мин' },
            { num: 7, start: '13:30', end: '14:10', break: '' }
        ],
        tueFri: [
            { num: 1, start: '08:00', end: '08:40', break: '10 мин' },
            { num: 2, start: '08:50', end: '09:30', break: '20 мин' },
            { num: 3, start: '09:50', end: '10:30', break: '20 мин' },
            { num: 4, start: '10:50', end: '11:30', break: '20 мин' },
            { num: 5, start: '11:50', end: '12:30', break: '15 мин' },
            { num: 6, start: '12:45', end: '13:25', break: '15 мин' },
            { num: 7, start: '13:40', end: '14:20', break: '15 мин' },
            { num: 8, start: '14:35', end: '15:15', break: '10 мин' },
            { num: 9, start: '15:25', end: '16:05', break: '10 мин' },
            { num: 10, start: '16:15', end: '16:55', break: '' }
        ],
        saturday: [
            { num: 1, start: '08:00', end: '08:40', break: '10 мин' },
            { num: 2, start: '08:50', end: '09:30', break: '20 мин' },
            { num: 3, start: '09:50', end: '10:30', break: '20 мин' },
            { num: 4, start: '10:50', end: '11:30', break: '10 мин' },
            { num: 5, start: '11:40', end: '12:20', break: '10 мин' },
            { num: 6, start: '12:30', end: '13:10', break: '10 мин' },
            { num: 7, start: '13:20', end: '14:00', break: '' }
        ]
    };

    function renderBellSchedule(dayType) {
        let schedule;
        let title = '';
        if (dayType === 'monday') {
            schedule = bellSchedule.monday;
            title = 'Понедельник';
        } else if (dayType === 'tue-fri') {
            schedule = bellSchedule.tueFri;
            title = 'Вторник – Пятница';
        } else {
            schedule = bellSchedule.saturday;
            title = 'Суббота';
        }

        let tableHTML = `<h3>${title}</h3><table><thead><tr><th>Урок</th><th>Начало</th><th>Окончание</th><th>Перемена</th></tr></thead><tbody>`;
        schedule.forEach(lesson => {
            tableHTML += `<tr>
                <td>${lesson.num}</td>
                <td>${lesson.start}</td>
                <td>${lesson.end}</td>
                <td>${lesson.break}</td>
            </tr>`;
        });
        tableHTML += `</tbody></table>`;
        modalTableContainer.innerHTML = tableHTML;
    }

    // Открыть модальное окно
    btn.onclick = function() {
        modal.style.display = 'flex';
        renderBellSchedule('monday'); // по умолчанию показываем понедельник
        // Активная вкладка
        tabBtns.forEach(btn => btn.classList.remove('active'));
        document.querySelector('.tab-btn[data-day="monday"]').classList.add('active');
    }

    // Закрыть по крестику
    span.onclick = function() {
        modal.style.display = 'none';
    }

    // Закрыть по клику вне окна
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    }

    // Переключение вкладок
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const day = this.getAttribute('data-day');
            renderBellSchedule(day);
            tabBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });
});