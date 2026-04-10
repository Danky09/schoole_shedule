document.addEventListener('DOMContentLoaded', () => {
    const classSelect = document.getElementById('classSelect');
    const weekdaySelect = document.getElementById('weekdaySelect');
    const scheduleContainer = document.getElementById('scheduleTable');
    const tomorrowBtn = document.getElementById('tomorrowBtn'); // добавим кнопку в HTML (см. ниже)

    // ---- РЕЗЕРВНЫЕ ДАННЫЕ (используются, если не загрузится schedule.json) ----
    const fallbackData = {
        "5А": {
            "monday": [{"num":1,"name":"ВД","room":"210"},
              {"num":2,"name":"Математика","room":"210"},
              {"num":3,"name":"Русский язык","room":"113"},
              {"num":4,"name":"Литература","room":"113"},
              {"num":5,"name":"Математика","room":"6"},
              {"num":6,"name":"Физкультура","room":"Спортзал"},
              {"num":7,"name":"Английский язык","room":"212/219"}],
            "tuesday": [{"num":1,"name":"Русский язык","room":"113"},
              {"num":2,"name":"Математика","room":"5"},
              {"num":3,"name":"Английский язык","room":"212/219"},
              {"num":4,"name":"ИЗО","room":"208"},
              {"num":5,"name":"Литература","room":"113"},
              {"num":6,"name":"История","room":"300"}],
            "wednesday": [{"num":1,"name":"Математика","room":"6"},
              {"num":2,"name":"История","room":"300"},
              {"num":3,"name":"Труд","room":"1/106"},
              {"num":4,"name":"Биология","room":"111"},
              {"num":5,"name":"Русский язык","room":"113"},
              {"num":6,"name":"Русский язык","room":"113"}],
            "thursday": [{"num":1,"name":"Математика","room":"5"},
              {"num":2,"name":"Русский язык","room":"113"},
              {"num":3,"name":"Физкультура","room":"Спортзал"},
              {"num":4,"name":"Физкультура","room":"Спортзал"},
              {"num":5,"name":"Английский язык","room":"212/219"},
              {"num":5,"name":"Литература","room":"113"}],
            "friday": [{"num":1,"name":"","room":""},
              {"num":2,"name":"География","room":"5"},
              {"num":3,"name":"Математика","room":"6"},
              {"num":4,"name":"История","room":"300"},
              {"num":5,"name":"Труд","room":"1/106"},
              {"num":5,"name":"Музыка","room":""}],
        },
        "10М": {
            "monday": [{"num":1,"name":"Информатика","room":"207"},
              {"num":2,"name":"Математика","room":"201"},
              {"num":3,"name":"Русский язык","room":"202"},
              {"num":4,"name":"Физика","room":"203"},
              {"num":5,"name":"Английский язык","room":"204"},
              {"num":6,"name":"Обществознание","room":"205"}],
            "tuesday": [{"num":1,"name":"Математика","room":"201"},
              {"num":2,"name":"Информатика","room":"207"},
              {"num":3,"name":"Химия","room":"206"},
              {"num":4,"name":"Литература","room":"202"},
              {"num":5,"name":"История","room":"205"},
              {"num":6,"name":"Физкультура","room":"Спортзал"}],
            "wednesday": [{"num":1,"name":"Астрономия","room":"203"},
              {"num":2,"name":"Алгебра","room":"201"},
              {"num":3,"name":"Русский язык","room":"202"},
              {"num":4,"name":"Физика","room":"203"},
              {"num":5,"name":"Английский язык","room":"204"},
              {"num":6,"name":"Биология","room":"105"}],
            "thursday": [{"num":1,"name":"Геометрия","room":"201"},
              {"num":2,"name":"Информатика","room":"207"},
              {"num":3,"name":"Обществознание","room":"205"},
              {"num":4,"name":"Физика","room":"203"},
              {"num":5,"name":"Литература","room":"202"},
              {"num":6,"name":"Физкультура","room":"Спортзал"}],
            "friday": [{"num":1,"name":"Математика","room":"201"},
              {"num":2,"name":"Русский язык","room":"202"},
              {"num":3,"name":"Химия","room":"206"},
              {"num":4,"name":"История","room":"205"},
              {"num":5,"name":"Английский язык","room":"204"},
              {"num":6,"name":"ОБЗР","room":"108"}],
            "saturday": [{"num":1,"name":"Математика","room":"201"},
              {"num":2,"name":"Информатика","room":"207"},
              {"num":3,"name":"Русский язык","room":"202"}]
        }
    };

    let scheduleData = null;
    let lessonsTimes = null; // будет загружено из bellSchedule

    // ---- Загрузка данных расписания ----
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

    // ---- Функция отрисовки расписания ----
    function renderSchedule() {
        if (!scheduleData) return;
        const selectedClass = classSelect.value;
        const selectedWeekday = weekdaySelect.value;

        if (!scheduleData[selectedClass] || !scheduleData[selectedClass][selectedWeekday]) {
            scheduleContainer.innerHTML = `<div class="loading">📭 Расписание для ${selectedClass} на этот день отсутствует.</div>`;
            return;
        }

        const lessons = scheduleData[selectedClass][selectedWeekday];
        // Получаем расписание звонков для выбранного дня, чтобы определить текущий урок
        let bellForDay = null;
        if (selectedWeekday === 'monday') bellForDay = bellSchedule.monday;
        else if (selectedWeekday === 'tuesday' || selectedWeekday === 'wednesday' || selectedWeekday === 'thursday' || selectedWeekday === 'friday') bellForDay = bellSchedule.tueFri;
        else if (selectedWeekday === 'saturday') bellForDay = bellSchedule.saturday;

        const now = new Date();
        const todayWeekday = getWeekdayKey(now);
        const isToday = (todayWeekday === selectedWeekday);
        let currentLessonNum = null;
        if (isToday && bellForDay) {
            const currentTime = now.getHours() * 60 + now.getMinutes();
            for (let lesson of bellForDay) {
                const [startH, startM] = lesson.start.split(':').map(Number);
                const [endH, endM] = lesson.end.split(':').map(Number);
                const startMinutes = startH * 60 + startM;
                const endMinutes = endH * 60 + endM;
                if (currentTime >= startMinutes && currentTime <= endMinutes) {
                    currentLessonNum = lesson.num;
                    break;
                }
            }
        }

        let tableHTML = `
            <table>
                <thead>
                    <tr><th>№</th><th>Предмет</th><th>Кабинет</th></tr>
                </thead>
                <tbody>
        `;
        lessons.forEach(lesson => {
            const isCurrent = (currentLessonNum === lesson.num);
            const rowClass = isCurrent ? 'current-lesson' : '';
            tableHTML += `
                <tr class="${rowClass}">
                    <td>${lesson.num}</td>
                    <td><span class="lesson-name">${lesson.name}</span></td>
                    <td><span class="lesson-room">${lesson.room}</span></td>
                </tr>
            `;
        });
        tableHTML += `</tbody></table>`;
        scheduleContainer.innerHTML = tableHTML;
    }

    // ---- Вспомогательная функция: ключ дня недели по объекту Date ----
    function getWeekdayKey(date) {
        const day = date.getDay();
        switch(day) {
            case 1: return 'monday';
            case 2: return 'tuesday';
            case 3: return 'wednesday';
            case 4: return 'thursday';
            case 5: return 'friday';
            case 6: return 'saturday';
            default: return 'monday';
        }
    }

    // ---- Установка текущего дня при загрузке ----
    function setCurrentDay() {
        const now = new Date();
        const dayKey = getWeekdayKey(now);
        if (dayKey) {
            weekdaySelect.value = dayKey;
        }
    }

    // ---- Кнопка "Завтра" ----
    function goToTomorrow() {
        const todayKey = getWeekdayKey(new Date());
        const daysOrder = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        let currentIndex = daysOrder.indexOf(todayKey);
        let tomorrowIndex = (currentIndex + 1) % daysOrder.length;
        // если сегодня суббота, то завтра понедельник
        if (todayKey === 'saturday') tomorrowIndex = 0;
        const tomorrowKey = daysOrder[tomorrowIndex];
        weekdaySelect.value = tomorrowKey;
        renderSchedule();
    }

    // ---- Обработчики событий ----
    classSelect.addEventListener('change', renderSchedule);
    weekdaySelect.addEventListener('change', renderSchedule);
    if (tomorrowBtn) tomorrowBtn.addEventListener('click', goToTomorrow);

    // ---- Установка текущего дня (если сегодня учебный день) ----
    setCurrentDay();
    renderSchedule(); // первая отрисовка после установки дня

    // --- Модальное окно с расписанием звонков (полностью рабочий код) ---
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

    if (btn) {
        btn.onclick = function() {
            modal.style.display = 'flex';
            renderBellSchedule('monday');
            tabBtns.forEach(btn => btn.classList.remove('active'));
            document.querySelector('.tab-btn[data-day="monday"]').classList.add('active');
        };
    }
    if (span) {
        span.onclick = function() {
            modal.style.display = 'none';
        };
    }
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    };
    if (tabBtns.length) {
        tabBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const day = this.getAttribute('data-day');
                renderBellSchedule(day);
                tabBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
            });
        });
    }
});