import OpenAI from 'openai';
import dotenv from 'dotenv';
import Game from '../models/Game.js';

dotenv.config();

let openai;
try {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('La variable OPENAI_API_KEY no está definida');
  }
  openai = new OpenAI({ apiKey });
  console.log('✅ OpenAI configurado correctamente');
} catch (error) {
  console.error('❌ Error al inicializar OpenAI:', error.message);
}

// Generar preguntas tipo "Preguntados"
export const getQuestions = async (req, res) => {
  const { tema } = req.params;

  if (!tema) {
    return res.status(400).json({ error: 'Se requiere un tema para generar preguntas' });
  }

  if (!openai) {
    return res.status(500).json({
      error: 'API de OpenAI no configurada correctamente',
    });
  }

  const prompt = `Genera 5 preguntas básicas de cultura general sobre el tema "${tema}". 
Cada pregunta debe tener 4 opciones (A, B, C, D) y debe indicar cuál es la opción correcta. 
El formato debe ser un arreglo JSON con este esquema:

[
  {
    "pregunta": "¿Cuál es la capital de Francia?",
    "opciones": {
      "A": "Madrid",
      "B": "París",
      "C": "Roma",
      "D": "Berlín"
    },
    "respuesta_correcta": "B"
  },
  ...
]`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "Eres un generador de preguntas para un juego educativo. Devuelve exactamente un JSON válido con el formato solicitado. No expliques nada."
        },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 800
    });

    const content = completion.choices[0].message.content;

    let preguntas;
    try {
      preguntas = JSON.parse(content);
    } catch (err) {
      console.error("❌ Error al parsear JSON:", err);
      return res.status(500).json({ error: "La IA no devolvió un JSON válido", raw: content });
    }

    res.json({ preguntas });

  } catch (error) {
    console.error('❌ Error al generar preguntas:', error);
    res.status(500).json({ error: 'Error al generar preguntas con IA', details: error.message });
  }
};

// Guardar juego en la base de datos
export const saveGame = async (req, res) => {
    try {
      const { tema, preguntas, puntaje } = req.body;
  
      if (!tema || !Array.isArray(preguntas) || typeof puntaje !== 'number') {
        return res.status(400).json({ error: 'Datos incompletos para guardar el juego' });
      }
  
      const preguntasValidas = preguntas.filter(p =>
        p.pregunta && p.respuesta_correcta && typeof p.respuesta_usuario === 'string'
      );
  
      if (preguntasValidas.length < preguntas.length) {
        console.warn(`⚠️ Se descartaron ${preguntas.length - preguntasValidas.length} preguntas incompletas`);
      }
  
      const now = new Date();
  
      const game = new Game({
        tema,
        preguntas: preguntasValidas, // ← 👈 AQUÍ ESTABA EL PROBLEMA
        puntaje,
        fecha: now.toISOString().split('T')[0],
        hora: now.toTimeString().split(':').slice(0, 2).join(':')
      });
  
      await game.save();
  
      console.log("✅ Juego guardado correctamente");
      res.json({ message: "✅ Juego guardado con éxito" });
    } catch (error) {
      console.error("❌ Error al guardar juego:", error);
      res.status(500).json({ error: "Error al guardar el juego", detalle: error.message });
    }
  };
  
