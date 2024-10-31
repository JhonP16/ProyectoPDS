import mongoose from "mongoose";

const actividadSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    fecha: { type: Date, required: true },
    usuario: { type: String, required: true },
});

const Actividad = mongoose.model("Actividad", actividadSchema);

export default Actividad;