import mongoose from 'mongoose';

const preguntaSchema = new mongoose.Schema({
  pregunta: { type: String, required: true },
  respuesta_usuario: { type: String, required: true },
  respuesta_correcta: { type: String, required: true }
});

const gameSchema = new mongoose.Schema({
  tema: { type: String, required: true },
  fecha: { type: String, required: true },
  hora: { type: String, required: true },
  preguntas: [preguntaSchema],
  puntaje: { type: Number, required: true }
}, {
  timestamps: true
});

export default mongoose.model('Game', gameSchema);
