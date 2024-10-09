const express = require('express');
const axios = require('axios'); // Para hacer peticiones a Hugging Face
const bodyParser = require('body-parser');
const path = require('path');
const chrono = require('chrono-node');  // Para procesar fechas
require('dotenv').config();

const app = express();
const port = 3000;

// Servir archivos estáticos de la carpeta raíz
app.use(express.static(__dirname));
app.use(bodyParser.json()); // Parsear los datos como JSON


// Almacenar eventos en memoria (puedes usar una base de datos para producción)
let eventos = [];


// Función para manejar saludos y despedidas
const manejarSaludoODespedida = (mensaje) => {
    const saludoDespedida = mensaje.toLowerCase();
    if (saludoDespedida.includes('hola')) {
        return '¡Hola! ¿En qué puedo ayudarte hoy?';
    }
    if (saludoDespedida.includes('gracias')) {
        return '¡De nada! Siempre feliz de ayudar.';
    }
    if (saludoDespedida.includes('adiós') || saludoDespedida.includes('adios')) {
        return '¡Hasta luego! Que tengas un buen día.';
    }
    return null;  // No es saludo ni despedida
};


// Función para generar una sugerencia simple de horario
const generarSugerenciaHorario = (parsedDate) => {
    const hour = parsedDate.getHours();
    if (hour < 9) {
        return "El horario es bastante temprano, ¿podrías considerarlo más tarde?";
    } else if (hour >= 22) {
        return "El horario es muy tarde, quizás sería mejor programarlo más temprano.";
    } else {
        return "El horario parece adecuado para esta actividad.";
    }
};

// Función para reprogramar un evento
const reprogramarEvento = (titulo, nuevaFecha) => {
    const evento = eventos.find(e => e.title.includes(titulo)); // Busca eventos que contengan el título
    if (evento) {
        evento.start = nuevaFecha.toISOString(); // Actualiza la fecha del evento
        return evento;
    }
    return null; // Evento no encontrado
};


// Ruta para manejar el chat

app.post('./public/chat', async (req, res) => {
    const prompt = req.body.prompt;
    console.log('Mensaje recibido del usuario:', prompt);

    // Verificar si es un saludo o despedida
    const saludoRespuesta = manejarSaludoODespedida(prompt);
    if (saludoRespuesta) {
        return res.json({ reply: saludoRespuesta });
    }

    // Reprogramación de eventos
    if (prompt.toLowerCase().includes('reprogramar')) {
        const parsedResults = chrono.parse(prompt);
        if (parsedResults.length === 0) {
            return res.status(400).send('No se pudo encontrar una nueva fecha en el texto.');
        }
        const nuevaFecha = parsedResults[0].start.date();
        const tituloEvento = prompt.match(/reprogramar (.+?) a/i);
        
        if (!tituloEvento || tituloEvento.length < 2) {
            return res.status(400).send('Por favor proporciona el título del evento a reprogramar.');
        }

        const eventoReprogramado = reprogramarEvento(tituloEvento[1].trim(), nuevaFecha);

        if (eventoReprogramado) {
            // Generar sugerencia simple de mejora sobre el nuevo horario
            const suggestion = generarSugerenciaHorario(nuevaFecha);
            return res.json({ reply: `El evento "${tituloEvento[1].trim()}" ha sido reprogramado a ${nuevaFecha.toISOString()}. Sugerencia: ${suggestion}` });
        } else {
            return res.status(404).send('Evento no encontrado.');
        }
    }

    // Extraer fecha y hora del texto usando chrono-node
    const parsedResults = chrono.parse(prompt);
    if (parsedResults.length === 0) {
        return res.status(400).send('No se pudo encontrar una fecha en el texto.');
    }

    const parsedDate = parsedResults[0].start.date(); // Fecha extraída

    // Capturar el título del evento de la entrada del usuario
    const tituloEvento = prompt.match(/programa(?:r)? (.+?) a/i);
    if (!tituloEvento || tituloEvento.length < 2) {
        return res.status(400).send('Por favor proporciona el título del evento.');
    }

    // Generar evento en formato JSON para FullCalendar
    const event = {
        title: tituloEvento[1].trim(),  // Título del evento extraído de la entrada
        start: parsedDate.toISOString(),
        allDay: false
    };

    // Agregar evento a la lista
    eventos.push(event);

    // Generar sugerencia simple de mejora sobre el horario
    const suggestion = generarSugerenciaHorario(parsedDate);

    // Enviar respuesta con sugerencia y evento guardado
    console.log('Evento generado:', event);
    console.log('Sugerencia generada:', suggestion);
    res.json({ reply: `Evento guardado. Sugerencia: ${suggestion}`, event: event });
});

// Rutas
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/pages/index.html'));
});

app.get('/calendar', (req, res) => {
    res.sendFile(path.join(__dirname, '/pages/calendario.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '/pages/login.html'));
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
