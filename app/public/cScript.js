// AQUI VAMOS A REALIZAR LA CONFIGURACION DEL CALENDARIO
const ucalendar = document.querySelector(".ucalendar"),
    date = document.querySelector(".date"),
    daysContainer = document.querySelector(".days"),
    prev = document.querySelector(".prev"),
    next = document.querySelector(".next"),
    todayBtn = document.querySelector(".today-btn"),
    gotoBtn = document.querySelector(".goto-btn"),
    dateInput = document.querySelector(".date-input"),
    eventDay = document.querySelector(".event-day"),
    eventDate = document.querySelector(".event-date"),
    eventsContainer = document.querySelector(".events"),
    addEventSubmit = document.querySelector(".add-event-btn");

let today = new Date();
let activeDay;
let month = today.getMonth();
let year = today.getFullYear();

// ARREGLO DE MESES
const months = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre"
];

// ARREGLO DE EVENTOS
// POR EL MOMENTO SERA UNO DE DEFECTO
// const eventsArr = [
//     {
//         day: 14, month: 10, year: 2024,
//         events: [
//             {
//                 title: "Event 1 lorem ipsun dolar sit genfa tersd dsad",
//                 time: "10:00 AM",
//             },
//             
//             {
//                 title: "Event 2",
//                 time: "11:00 AM",
//             },
//         ]
//     },
// 
//     {
//         day: 18, month: 10, year: 2024,
//         events: [
//             {
//                 title: "Event 1 lorem ipsun dolar sit genfa tersd dsad",
//                 time: "15:00 AM",
//             },
//             
//             {
//                 title: "Event 2",
//                 time: "12:00 AM",
//             },
//         ]
//     }
// ];

// CREAR UN ARREGLO VACIO
let eventsArr = [];

getEvents();    // LLAMAR FUNCION getEvents


// FUNCION PARA AGREGAR LOS DIAS
function initCalendar() {
    // OBTENER LOS DIAS DEL MES ANTERIOR, EL ACTUAL Y EL SIGUIENTE
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const prevLastDay = new Date(year, month, 0);
    const prevDays = prevLastDay.getDate();
    const lastDate = lastDay.getDate();
    const day = firstDay.getDay();
    const nextDays = 7 - lastDay.getDay() - 1

    // ACTUALIZAR FECHA DE LA PARTE SUPERIOR DEL CALENDARIO
    date.innerHTML = months[month] + " " + year;

    // AGREGAR DIAS
    let days = "";

    // CONFIGURAR DIAS DEL MES ANTERIOR
    // PLANTEAR UNA ESTRUCTURA DE ITERACION | for
    for (let x = day; x > 0; x--) {
        days += `<div class="day prev-date">${prevDays - x + 1}</div>`
    }

    // CONFIGURAR DIAS DEL MES ACTUAL
    // PLANTEAR UNA ESTRUCTURA DE ITERACION | for
    for (let i = 1; i <= lastDate; i++) {
        // VALIDACION DE EVENTOS | CHEQUEAR SI HAY EVENTOS EN EL DIA
        let event = false; 

        eventsArr.forEach((eventObj) => {
            // PLANTEAR UNA ESTRUCTURA DE DESICION | CONDICIONAL
            if (
                eventObj.day == i &&
                eventObj.month == month + 1 &&
                eventObj.year == year
            ) {
                // PRIMER CASO | SE ENCUENTRA EL EVENTO
                event = true;
            }
        })


        // PLANTEAR UNA ESTRUCTURA DE DESICION | CONDICIONAL
        if(i == new Date().getDate() && year === new Date().getFullYear() && month == new Date().getMonth()) {
            // LLAMADO DE FUNCIONES
            activeDay = i;
            getActiveDay(i);
            updateEvents(i);

            // SI EL DIA ES HOY
            if (event) {
                // SI EL DIA TIENE EVENTOS
                days += `<div class="day today active event">${i}</div>`;
            } else {
                // SINO TIENE EVENTOS
                days += `<div class="day today">${i}</div>`
            }
        } else {
            // CONFIGURACION PARA EL RESTO DE DIAS
            if (event) {
                // SI EL DIA TIENE EVENTOS
                days += `<div class="day event">${i}</div>`;
            } else {
                // SINO TIENE EVENTOS
                days += `<div class="day">${i}</div>`
            }
        }
    }

    // CONFIGURAR DIAS DEL MES SIGUIENTE
    // PLANTEAR UNA ESTRUCTURA DE ITERACION | for
    for (let j = 1; j <= nextDays; j++) {
        days += `<div class="day next-date">${j}</div>`;
    }

    // MOSTRAR LOS DIAS EN EL CALENDARIO
    daysContainer.innerHTML = days;
    // AGREGAR EL listener LUEGO DE QUE EL CALENDARIO SE INICIALICE
    addLisntener();
}

// EJECUTAR FUNCION
initCalendar();

// FUNCION PARA EL MES ANTERIOR
function prevMonth() {
    month--;    // REDUCIR EL VALOR DEL MES
    
    // PLANTEAR ESTRUCTURA DE DESICION | CONDICIONAL
    if (month < 0) {
        month = 11;
        year--;
    }
    initCalendar();     // LLAMAR FUNCION
}

// FUNCION PARA EL MES SIGUIENTE
function nextMonth() {
    month++;    // AUMENTAR EL VALOR DEL MES

    // PLANTEAR ESTRUCTURA DE DESICION | CONDICIONAL
    if (month > 11) {
        month = 0;
        year++;
    }

    initCalendar();     // LLAMAR FUNCION
}

// AÑADIR UN eventlistenner EN prev Y next
prev.addEventListener('click', prevMonth);      // CUANDO SE TOQUE prev SE ACTIVA LA FUNCION prevMonth
next.addEventListener('click', nextMonth);      // CUANDO SE TOQUE next SE ACTIVA LA FUNCION nextMonth


// CREAR FUNCIONALIDAD PARA LOS BOTONES goto date Y goto today
// FUNCIONALIDAD PARA REGRESAR A LA FECHA ACTUAL
todayBtn.addEventListener("click", () => {
    today = new Date();
    month = today.getMonth();
    year = today.getFullYear();
    initCalendar();     // LLAMAR FUNCION
})

// CONFIGURACION PARA EL FILTRO DE FECHA
dateInput.addEventListener("keyup", (e) => {
    // PERMITIR SOLO INGRESAR NUMEROS | REMUEVE TODO LO DEMAS
    dateInput.value = dateInput.value.replace(/[^0-9/]/g, "");

    // PLANTEAR UNA ESTRUCTURA DE DESICION | CONDICIONAL
    if (dateInput.value.length == 2) {
        dateInput.value += "/";     // AGREGAR UN slash
    }

    // PLANTEAR UNA ESTRUCTURA DE DESICION | CONDICIONAL
    if (dateInput.value.length > 7) {
        dateInput.value = dateInput.value.slice(0, 7);     // NO PERMITIR MAS DE 7 #'s
    }

    // PLANTEAR UNA ESTRUCTURA DE DESICION | CONDICIONAL | NO PERMITIR ESPACIOS
    if (e.inputType == "deleteContentBackward") {
        // PLANTEAR UNA ESTRUCTURA DE DESICION | CONDICIONAL
        if (dateInput.value.length == 3) {
            dateInput.value = dateInput.value.slice(0, 2);
        }
    }
})

// AÑADIR UN eventlistenner gotoBtn
gotoBtn.addEventListener('click', gotoDate);      // CUANDO SE TOQUE gotoBtn SE ACTIVA LA FUNCION gotoDate

// FUNCION DE BUSQUEDA DE FECHA ESPECIFICA | go to date
function gotoDate() {
    const dateArr = dateInput.value.split("/");
    // VALIDACION DE FECHA
    // PLANTEAR ESTRUCTURA DE DESICION | CONDICIONAL
    if (dateArr.length == 2) {
        if (dateArr[0] > 0 && dateArr[0] < 13 && dateArr[1].length == 4) {
            // CASO | FECHA VALIDA
            month = dateArr[0] - 1;
            year = dateArr[1];
            initCalendar();     // LLAMAR FUNCION
            return;
        }
    }
    alert("¡FECHA INVALIDA!");      // CASO | FECHA INVALIDA
}


// AQUI VAMOS A REALIZAR LA CONFIGURACION DEL SISTEMA DE EVENTOS
const addEventBtn = document.querySelector(".add-event"),
    addEventContainer = document.querySelector(".add-event-wrapper"),
    addEventClose = document.querySelector(".close"),
    addEventTitle = document.querySelector(".event-name"),
    addEventFrom = document.querySelector(".event-time-from"),
    addEventTo = document.querySelector(".event-time-to");
    

// CREAR FUNCIONALIDAD PARA AÑADIR EVENTOS
// AÑADIR UN eventlistenner EN addEventBtn
addEventBtn.addEventListener("click", () => {
    addEventContainer.classList.toggle("active");
})

// CREAR FUNCIONALIDADES PARA CERRAR
// PRIMERA FUNCIONALIDAD | TOCAR EL BOTON close
addEventClose.addEventListener("click", () => {
    addEventContainer.classList.remove("active");
})

// SEGUNDA FUNCIONALIDAD | TOCAR POR FUERA DEL container or footer
document.addEventListener("click", (e) => {
    // PLANTEAR UNA ESTRUCTURA DE DESICION | CONDICIONAL
    if (e.target != addEventBtn && !addEventContainer.contains(e.target)) {
        addEventContainer.classList.remove("active");
    }
})


// CREAR CONFIGURACIONES PARA EL container or footer
// PRIMERA CONFIGURACION | title | PERMITIR max 50 CARACTERES
addEventTitle.addEventListener("input", (e) => {
    addEventTitle.value = addEventTitle.value.slice(0, 50);
})

// SEGUNDA CONFIGURACION | time from and to time | INCLUIR EL FORMATO DE TIEMPO PARA AMBOS CASOS
// PRIMER SUB SEGUNDA CONFIGURACION | time from
addEventFrom.addEventListener("input", (e) => {
    // PERMITIR SOLO INGRESAR NUMEROS | REMUEVE TODO LO DEMAS
    addEventFrom.value = addEventFrom.value.replace(/[^0-9:]/g, "");

    // PLANTEAR UNA ESTRUCTURA DE DESICION | CONDICIONAL
    if (addEventFrom.value.length == 2) {
        addEventFrom.value += ": ";     // AGREGAR ":"
    }

    // PLANTEAR UNA ESTRUCTURA DE DESICION | CONDICIONAL
    if (addEventFrom.value.length > 5) {
        addEventFrom.value = addEventFrom.value.slice(0, 5);     // NO PERMITIR MAS DE 5 #'s
    }
})

// SEGUNDA SUB SEGUNDA CONFIGURACION | time from
addEventTo.addEventListener("input", (e) => {
    // PERMITIR SOLO INGRESAR NUMEROS | REMUEVE TODO LO DEMAS
    addEventTo.value = addEventTo.value.replace(/[^0-9:]/g, "");

    // PLANTEAR UNA ESTRUCTURA DE DESICION | CONDICIONAL
    if (addEventTo.value.length == 2) {
        addEventTo.value += ": ";     // AGREGAR ":"
    }

    // PLANTEAR UNA ESTRUCTURA DE DESICION | CONDICIONAL
    if (addEventTo.value.length > 5) {
        addEventTo.value = addEventTo.value.slice(0, 5);     // NO PERMITIR MAS DE 5 #'s
    }
})


// CREAR FUNCION PARA AGREGAR UN listener EN LOS DIAS
function addLisntener() {
    const days = document.querySelectorAll(".day"); 
    days.forEach((day) => {
        day.addEventListener("click", (e) => {
            activeDay = Number(e.target.innerHTML);  // set EL DIA COMO UN DIA ACTIVO | QUE TIENE EVENTOS

            // LLAMADO DE FUNCIONES
            getActiveDay(e.target.innerHTML);     // LLAMAR FUNCION getActiveDay
            updateEvents(Number(e.target.innerHTML));     // LLAMAR FUNCION updateEvents

            days.forEach((day) => {
                day.classList.remove("active");     // QUITAR EL set
            });

            // PLANTEAR UNA ESTRUCTURA DE DESICION | CONDICIONAL
            // SI SE click EL prev DIA DEL MES ANTERIOR so goto AL MES ANTERIOR Y add UN active
            if(e.target.classList.contains("prev-date")) {
                prevMonth();

                setTimeout(() => {
                    const days = document.querySelectorAll(".day");    // SELECCIONAMOS TODOS LOS DIAS DEL MES

                    // LUEGO DE ESTAR EN EL MES ANTERIOR add UN active AL HACER click
                    days.forEach((day) => {
                        // PLANTEAR UNA ESTRUCTURA DE DESICION | CONDICIONAL
                        if (
                            !day.classList.contains("prev-date") &&
                            day.innerHTML === e.target.innerHTML
                        ) {
                            day.classList.add("active");
                        }
                    });
                }, 100);
            } else if(e.target.classList.contains("next-date")) {
                nextMonth();

                setTimeout(() => {
                    const days = document.querySelectorAll(".day");    // SELECCIONAMOS TODOS LOS DIAS DEL MES

                    // LUEGO DE ESTAR EN EL MES SIGUIENTE add UN active AL HACER click
                    days.forEach((day) => {
                        // PLANTEAR UNA ESTRUCTURA DE DESICION | CONDICIONAL
                        if (
                            !day.classList.contains("next-date") &&
                            day.innerHTML === e.target.innerHTML
                        ) {
                            day.classList.add("active");
                        }
                    });
                }, 100);
            } else {
                // SELECCIONAR LOS DIAS DEL MES ACTUAL
                e.target.classList.add("active");
            }
        });
    });
}


// CREAR UNA FUNCION PARA MOSTRAR LOS DIAS ACTIVOS Y LA FECHA EN LA PARTE SUPERIOR
function getActiveDay(date) {
    const day = new Date(year, month, date);
    const dayName = [
        "Domingo",
        "Lunes",
        "Martes",
        "Miércoles",
        "Jueves",
        "Viernes",
        "Sábado"
    ];

    eventDay.innerHTML = dayName[day.getDay()];
    eventDate.innerHTML = date + " " + months[month] + " " + year;
}


// CREAR FUNCION PARA VER LOS EVENTOS DE CADA DIA
function updateEvents(date) {
    let events = "";

    eventsArr.forEach((event) => {
        // OBTENER EVENTOS DE SOLO DIAS ACTIVOS | ES DECIR DE DIAS EN LOS QUE HAY EVENTOS
        // PLANTEAR ESTRUCTURA DE DESICION | CONDICIONAL
        if (
            date == event.day &&
            month + 1 == event.month &&
            year == event.year
        ) {
            // ESTO MOSTRARA EVENTOS EN UN DOCUMENTO
            event.events.forEach((event) => {
                events += `<div class="event">
                    <div class="title">
                        <i class="fas fa-circle"></i>
                        <h3 class="event-title">${event.title}</h3>
                    </div>
                    
                    <div class="event-time">
                        <span class="event-time">${event.time}</span>
                    </div>
                </div>`;
            });
        }
    });

    // EN CASO DE NO ENCONTRARLO
    if ((events == "")) {
        events = `
        <div class="no-event">
            <h3>Sin Eventos Programados</h3>
        </div>`;
    }

    console.log(events);
    eventsContainer.innerHTML = events;
    saveEvents();   // LLAMAR FUNCIOM saveEvents
}


// CREAR FUNCION PARA AGREGAR EVENTOS
addEventSubmit.addEventListener("click", () => {
    const eventTitle = addEventTitle.value;
    const eventTimeFrom = addEventFrom.value;
    const eventTimeTo = addEventTo.value;

    // REALIZAR ALGUNAS VALIDACIONES
    // PLANTEAR UNA ESTRUCTURA DE DESICION | CONDICIONAL
    if (
        // VALIDAR SI TODOS LOS CAMPOS ESTAN LLENOS
        eventTitle == "" ||
        eventTimeFrom == "" ||
        eventTimeTo == ""
    ) {
        alert("Por favor, complete todos los campos");
        return;
    }

    const timeFromArr = eventTimeFrom.split(":");
    const timeToArr = eventTimeTo.split(":");

    // PLANTEAR UNA ESTRUCTURA DE DESICION | CONDICIONAL
    if(
        // VALIDAR FORMATO DE TIEMPO
        timeFromArr.length != 2 ||
        timeToArr.length != 2 ||
        timeFromArr[0] > 23 ||
        timeFromArr[1] > 59 ||
        timeToArr[0] > 23 ||
        timeToArr[1] > 59
    ) {
        alert("¡Formato de Tiempo Invalido!")
    }

    const timeFrom = convertTime(eventTimeFrom);
    const timeTo = convertTime(eventTimeTo);

    const newEvent = {
        title: eventTitle,
        time: timeFrom + " - " + timeTo,
    };

    let eventAdded = false;

    //  VALIDAR SI eventArr NO ESTA VACIO
    // PLANTEAR UNA ESTRUCTURA DE DESICION | CONDICIONAL
    if (eventsArr.length > 0) {
        // VALIDAR SI EL DIA ACTUAL TIENE UN EVENTO | LUEGO AGREGAR OTRO
        eventsArr.forEach((item) => {
            // PLANTEAR UNA ESTRUCTURA DE DESICION | CONDICIONAL
            if (
                item.day == activeDay &&
                item.month == month + 1 &&
                item.year == year
            ) {
                item.events.push(newEvent);
                eventAdded = true;
            }
        });
    }

    // CASO CONTRARIO | SI eventArr ESTA VACIO or EL DIA ACTUAL NO TIENE UN EVENTO so CREAR UNO NUEVO
    // PLANTEAR UNA ESTRUCTURA DE DESICION | CONDICIONAL
    if (!eventAdded) {
        eventsArr.push({
            day: activeDay,
            month: month + 1,
            year: year,
            events: [newEvent]
        });
    }

    // QUITAR EL ESTADO activo DEL FORMULARIO DE EVENTOS
    addEventContainer.classList.remove("active");

    // LIMPIAR LOS CAMPOS
    eventTitle.value = "";
    eventTimeFrom.value = "";
    eventTimeTo.value = "";

    // MOSTRAR LOS EVENTOS AGREGADOS 
    updateEvents(activeDay);

    // AÑADIR LA CLASE DE EVENTO EN CASO DE NO HABERLO HECHO
    const activeDayElem = document.querySelector(".day.active");

    // PLANTEAR UNA ESTRUCTURA DE DESICION | CONDICIONAL
    if (!activeDayElem.classList.contains("event")) {
        activeDayElem.classList.add("event");
    }
});

// CREAR FUNCION PARA FORMATEAR EL TIEMPO
function convertTime(time) {
    let timeArr = time.split(":");
    let timeHour = timeArr[0];
    let timeMin = timeArr[1];
    let timeFormat = timeHour >= 12 ? "PM" : "AM" ;

    timeHour = timeHour % 12 || 12;
    time = timeHour + ":" + timeMin + " " + timeFormat;
    return time;
}

// CREAR UNA FUNCION PARA BORRAR EVENTOS CON UN CLICK
eventsContainer.addEventListener("click", (e) => {
    // PLANTEAR UNA ESTRUCTURA DE DESICION | CONDICIONAL
    if (e.target.classList.contains("event")) {
        // OBTENER EL TITULO DEL EVENTO PARA BUSCARLO EN eventsArr POR TITULO Y BORRARLO
        const eventTitle = e.target.children[0].children[1].innerHTML;

        eventsArr.forEach((event) => {
            // PLANTEAR UNA ESTRUCTURA DE DESICION | CONDICIONAL
            if (
                event.day == activeDay &&
                event.month == month + 1 &&
                event.year == year
            ) {
                event.events.forEach((item, index) => {
                    // PLANTEAR UNA ESTRUCTURA DE DESICION | CONDICIONAL
                    if (item.title == eventTitle) {
                        event.events.splice(index, 1);
                    }
                });

                // SINO HAY EVENTOS POR REMOVER SE REMUEVE EL DIA COMPLETO
                // PLANTEAR UNA ESTRUCTURA DE DESICION | CONDICIONAL
                if (event.events.length == 0) {
                    eventsArr.splice(eventsArr.indexOf(event), 1);

                    // LUEGO SE REMUEVE LA active class DEL DIA
                    const activeDayElem = document.querySelector(".day.active");

                    // PLANTEAR UNA ESTRUCTURA DE DESICION | CONDICIONAL
                    if (activeDayElem.classList.contains("event")) {
                        activeDayElem.classList.remove("event");
                    }
                }
            }
        });

        // LUEGO DE REMOVER EL EVENTO ACTUALIZAMOS EL form DE EVENTOS
        updateEvents(activeDay);
    }
});

// CREAR UNA FUNCION PARA GUARDAR LOS EVENTOS EN MEMORIA LOCAL
function saveEvents() {
    localStorage.setItem("events" , JSON.stringify(eventsArr));
}

// CREAR UNA FUNCION PARA CARGAR LOS EVENTOS DE MEMORIA LOCAL
function getEvents() {
  // PLANTEAR UNA ESTRUCTURA DE DESICION | CONDICIONAL
    if (localStorage.getItem("events") === null) {
    return;
    }
    eventsArr.push(...JSON.parse(localStorage.getItem("events")));
}
