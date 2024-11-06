import express from "express";
import bodyParser from "body-parser";
import path from "path";
import mongoose from "mongoose";
import Groq from "groq-sdk";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

// Obtener __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cargar variables de entorno
dotenv.config();

// Configuración de Express y MongoDB
const app = express();
const port = 4000;
const mongoUri = 'mongodb://localhost:27017/calendario';

// Servir archivos estáticos desde la carpeta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Middleware para procesar el cuerpo de las solicitudes
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Conexión a MongoDB
mongoose.set('strictQuery', true);
mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Conectado a MongoDB'))
    .catch((err) => console.error('Error al conectar a MongoDB:', err));

// Inicializar Groq Cloud SDK
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Función para obtener respuesta desde Groq Cloud
async function obtenerRespuestaGroq(mensajeUsuario) {
    try {
        const response = await groq.chat.completions.create({
            messages: [
                {
                    role: "user",
                    content: mensajeUsuario,
                },
            ],
            model: "llama3-8b-8192", // Ajusta el modelo si es necesario
        });
        
        return response.choices[0]?.message?.content || "No se obtuvo respuesta.";
    } catch (error) {
        console.error('Error al obtener respuesta de Groq Cloud:', error);
        return 'Lo siento, hubo un problema al procesar tu solicitud con Groq Cloud.';
    }
}

import Actividad from './models/actividad.js'; //Ruta para almacenar en Mongo
// Interacción con el chat
app.post('/chat', async (req, res) => {
    const prompt = req.body.prompt;
    console.log('Mensaje recibido del usuario:', prompt);

    // Verifica si el mensaje del usuario contiene una solicitud de agendar una actividad
    const actividadRegex = /agendar una actividad: (.+?) el (\d{4}-\d{2}-\d{2}) a las (\d{1,2}:\d{2} [ap]\.m\.)/;
    const matchAgendar = prompt.match(actividadRegex);

    if (matchAgendar) {
        const nombre = matchAgendar[1];
        const fecha = new Date(matchAgendar[2]);
        const hora = matchAgendar[3]; // Hora capturada
        const usuario = 'Usuario'; // Esto se cambia si deseas identificar un usuario específico

        const nuevaActividad = new Actividad({ nombre, fecha, hora, usuario });

        try {
            await nuevaActividad.save();
            res.json({ reply: `Actividad "${nombre}" agendada para el ${fecha.toDateString()} a las ${hora}.` });
        } catch (error) {
            console.error('Error al guardar la actividad:', error);
            res.json({ reply: 'Lo siento, hubo un problema al agendar la actividad.' });
        }
    } else {
        // Verifica si el mensaje contiene una solicitud de borrar una actividad
        const borrarRegex = /borrar (.+)/;
        const matchBorrar = prompt.match(borrarRegex);

        if (matchBorrar) {
            const nombreActividad = matchBorrar[1].trim();

            try {
                const actividadEliminada = await Actividad.findOneAndDelete({ nombre: nombreActividad });

                if (actividadEliminada) {
                    res.json({ reply: `La actividad "${nombreActividad}" ha sido eliminada con éxito.` });
                } else {
                    res.json({ reply: `No se encontró ninguna actividad con el nombre "${nombreActividad}".` });
                }
            } catch (error) {
                console.error('Error al borrar la actividad:', error);
                res.json({ reply: 'Hubo un problema al intentar borrar la actividad.' });
            }
        } else {
            // Si no es una solicitud de agendar o borrar, usa la función de Groq para otras respuestas
            const respuestaGroq = await obtenerRespuestaGroq(prompt);
            res.json({ reply: respuestaGroq });
        }
    }
});

//Ruta para el calendario
app.get("/api/get-events", async (req, res) => {
    try {
        const events = await Actividad.find({}); 
        res.json(events);
    } catch (error) {
        res.status(500).send("Error al obtener eventos");
    }
});

// Ruta para borrar una actividad por su nombre
app.delete('/api/delete-activity', async (req, res) => {
    const nombre = req.body.nombre; // Nombre de la actividad que se desea borrar

    try {
        const actividadEliminada = await Actividad.findOneAndDelete({ nombre });

        if (actividadEliminada) {
            res.json({ reply: `La actividad "${nombre}" ha sido eliminada con éxito.` });
        } else {
            res.json({ reply: `No se encontró ninguna actividad con el nombre "${nombre}".` });
        }
    } catch (error) {
        console.error('Error al borrar la actividad:', error);
        res.status(500).json({ reply: 'Hubo un problema al intentar borrar la actividad.' });
    }
});

// Rutas para la UI
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages/index.html'));
});

app.get('/calendario.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages/calendario.html'));
});

app.get('/login.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages/login.html'));
});

app.get('/signup.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'pages/signup.html'));
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
