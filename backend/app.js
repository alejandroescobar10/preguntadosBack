import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import quizRoutes from './routes/quizRoutes.js';

// Directorio actual (para .env checks)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cargar variables de entorno
dotenv.config();

// Verificar si existe la clave de OpenAI
if (!process.env.OPENAI_API_KEY) {
  console.warn('\x1b[33m%s\x1b[0m', '⚠️  ADVERTENCIA: Falta OPENAI_API_KEY');
  console.log('\x1b[36m%s\x1b[0m', 'Configura tu archivo .env así:');
  console.log('OPENAI_API_KEY=tu-clave\n');
  
  const envPath = path.join(__dirname, '.env');
  if (!fs.existsSync(envPath)) {
    console.log('\x1b[31m%s\x1b[0m', '❌ No se encontró el archivo .env');
  }
}

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Conexión a MongoDB
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/preguntados';

if (mongoose.connection.readyState === 0) {
  mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('✅ Conectado a MongoDB'))
  .catch(err => console.error('❌ Error conectando a MongoDB:', err));
}

// Rutas de la API
app.use('/api', quizRoutes);

// Ruta raíz para verificar estado
app.get('/', (req, res) => {
  res.json({
    message: '🎉 API de Preguntados funcionando correctamente en Vercel',
    status: '✅ Conectado a MongoDB y OpenAI'
  });
});
// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
});
// ⚠️ No usar app.listen() si despliegas en Vercel
// En local puedes habilitarlo así:
// if (process.env.NODE_ENV !== 'production') {
//   const PORT = process.env.PORT || 5000;
//   app.listen(PORT, () => console.log(`🚀 Servidor local en puerto ${PORT}`));
// }

