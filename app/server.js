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

// Ruta para manejar el chat
app.post('./public/chat', async (req, res) => {
    const prompt = req.body.prompt;
    console.log('Mensaje recibido del usuario:', prompt);

    try {
        // Extraer fecha y hora del texto usando chrono-node
        const parsedResults = chrono.parse(prompt);
        if (parsedResults.length === 0) {
            throw new Error("No se pudo encontrar una fecha en el texto.");
        }

        const parsedDate = parsedResults[0].start.date(); // Fecha extraída

        // Generar evento en formato JSON para FullCalendar
        const event = {
            title: 'Entrenamiento',
            start: parsedDate.toISOString(),
            allDay: false
        };

        // Generar sugerencia de mejora usando Hugging Face (GPT-J o GPT-NeoX)
        const suggestionPrompt = `Tengo agendado un evento: " a las ${parsedDate.getHours()}:00". ¿Podrías sugerir alguna mejora sobre el horario o actividad?`;
        const huggingFaceResponse = await axios.post('https://api-inference.huggingface.co/models/EleutherAI/gpt-j-6B', 
            { inputs: suggestionPrompt }, 
            { headers: { Authorization: `Bearer ${process.env.HUGGING_FACE_API_KEY}` } }
        );

        const suggestion = huggingFaceResponse.data.generated_text;

        // Enviar respuesta con sugerencia y evento guardado
        console.log('Evento generado:', event);
        console.log('Sugerencia generada:', suggestion);
        res.json({ reply: `Evento guardado. Sugerencia: ${suggestion}`, event: event });

    } catch (error) {
        console.error('Error al procesar el mensaje:', error);
        res.status(500).send('Error al procesar el evento.');
    }
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
