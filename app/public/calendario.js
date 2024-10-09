document.addEventListener('DOMContentLoaded', function() {
    var calendarEl = document.getElementById('calendar');

    var calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        events: [
            {
                title: 'Meeting',
                start: '2024-10-22T10:30:00',
                end: '2024-10-22T12:30:00'
            },
            {
                title: 'Lunch',
                start: '2024-10-24T12:00:00'
            }
        ],
        dateClick: function(info) {
            let title = prompt('Enter Event Title:');
            if (title) {
                calendar.addEvent({
                    title: title,
                    start: info.dateStr,
                    allDay: true
                });
                console.log('Evento guardado:', title);
            }
        }
    });

    calendar.render();
});
