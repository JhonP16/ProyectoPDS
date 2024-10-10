const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const path = require('path');
const chrono = require('chrono-node');
require('dotenv').config();

const app = express();
const port = 4000;

app.use(express.static(__dirname));
app.use(bodyParser.json());

let eventos = [];

// Función para solicitar respuesta a Hugging Face con un modelo de lenguaje
const obtenerRespuestaIA = async (mensajeUsuario) => {
    const apiKey = process.env.HUGGING_FACE_API_KEY;
    console.log('Api',apiKey);
    const apiURL = 'https://api-inference.huggingface.co/models/gpt2';
    
    try {
        const response = await axios.post(apiURL, 
            {
                inputs: mensajeUsuario,
                parameters: {
                    max_length: 50, // Limitar la longitud de la respuesta para que sea corta
                    temperature: 0.7 // Controlar la creatividad del modelo (0.7 es un buen balance)
                }
            },
            {
                headers: { 'Authorization': `Bearer ${apiKey}` }
            }
        );

        return response.data[0].generated_text;
    } catch (error) {
        console.error('Error al obtener respuesta de Hugging Face:', error);
        return 'Lo siento, hubo un problema al procesar tu solicitud.';
    }
};

// Ruta para manejar el chat
app.post('/chat', async (req, res) => {
    const prompt = req.body.prompt;
    console.log('Mensaje recibido del usuario:', prompt);

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

    // Verificar si es un saludo o despedida
    const saludoRespuesta = manejarSaludoODespedida(prompt);
    if (saludoRespuesta) {
        return res.json({ reply: saludoRespuesta });
    }

    // Si no es un saludo, obtener respuesta generada por IA
    const respuestaIA = await obtenerRespuestaIA(prompt);

    // Responder con la salida generada
    res.json({ reply: respuestaIA });
});

// Rutas para la UI
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/pages/index.html'));
});

app.get('/calendar', (req, res) => {
    res.sendFile(path.join(__dirname, '/pages/calendario.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '/pages/login.html'));
});

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
