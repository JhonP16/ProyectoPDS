document.addEventListener("DOMContentLoaded", function() {
    const date = new Date();
    const eventsContainer = document.querySelector(".events");
    const eventDays = {};

    // Cargar eventos y actualizar el calendario
    fetch("/api/get-events")
        .then(response => response.json())
        .then(events => {
            events.forEach(event => {
                const eventElement = document.createElement("div");
                eventElement.className = "event";
                eventElement.innerHTML = `
                    <h3>${event.nombre}</h3>
                    <p>${new Date(event.fecha).toDateString()} a las ${event.hora}</p>
                `;
                eventsContainer.appendChild(eventElement);

                const eventDate = new Date(event.fecha).toDateString();
                if (!eventDays[eventDate]) {
                    eventDays[eventDate] = [];
                }
                eventDays[eventDate].push(event);
            });

            generateCalendar(date);
            highlightEventDays(eventDays);
        })
        .catch(error => console.error("Error al cargar los eventos:", error));

    // Función para generar el calendario
    function generateCalendar(date) {
        const monthElement = document.querySelector(".date");
        const daysContainer = document.querySelector(".days");

        const currentMonth = date.getMonth();
        const currentYear = date.getFullYear();
        const firstDay = new Date(currentYear, currentMonth, 1);
        const lastDay = new Date(currentYear, currentMonth + 1, 0);
        const totalDays = lastDay.getDate();
        const startingDay = firstDay.getDay();

        // Mostrar el mes y año
        monthElement.innerHTML = `${firstDay.toLocaleString('default', { month: 'long' })} ${currentYear}`;

        // Limpiar los días del mes anterior
        daysContainer.innerHTML = "";

        // Crear los días del calendario
        for (let i = 0; i < startingDay; i++) {
            const emptyDay = document.createElement("div");
            daysContainer.appendChild(emptyDay);
        }

        for (let day = 1; day <= totalDays; day++) {
            const dayElement = document.createElement("div");
            dayElement.classList.add("day");
            const dayDate = new Date(currentYear, currentMonth, day);
            dayElement.dataset.date = dayDate;

            // Mostrar el número del día
            dayElement.innerHTML = day;

            // Asignar eventos si hay
            const dateStr = dayDate.toDateString();
            if (eventDays[dateStr]) {
                dayElement.classList.add("event-day-highlight");
            }

            daysContainer.appendChild(dayElement);
        }
    }

    // Función para resaltar los días con eventos
    function highlightEventDays(eventDays) {
        const days = document.querySelectorAll(".days .day");

        days.forEach(day => {
            const dateStr = new Date(day.dataset.date).toDateString();
            if (eventDays[dateStr]) {
                day.classList.add("event-day-highlight");
            }
        });
    }

    // Lógica para cambiar de mes
    document.querySelector(".prev").addEventListener("click", function() {
        date.setMonth(date.getMonth() - 1);
        generateCalendar(date);
        highlightEventDays(eventDays);
    });

    document.querySelector(".next").addEventListener("click", function() {
        date.setMonth(date.getMonth() + 1);
        generateCalendar(date);
        highlightEventDays(eventDays);
    });

    // Lógica para ir al mes actual
    document.querySelector(".today-btn").addEventListener("click", function() {
        const today = new Date();
        generateCalendar(today);
        highlightEventDays(eventDays);
    });

    // Lógica para ir a un mes específico desde la entrada
    document.querySelector(".goto-btn").addEventListener("click", function() {
        const dateInput = document.querySelector(".date-input").value;
        const [month, year] = dateInput.split("/").map(num => parseInt(num));
        if (!isNaN(month) && !isNaN(year)) {
            date.setMonth(month - 1); // Ajuste para que enero sea 0
            date.setFullYear(year);
            generateCalendar(date);
            highlightEventDays(eventDays);
        }
    });
});
