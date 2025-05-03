import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import quizRoutes from './routes/quizRoutes.js';

// Cargar variables de entorno
dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: 'https://preguntados-front.vercel.app', // dominio exacto del frontend
  methods: ['GET', 'POST'],
  credentials: true
}));
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
const PORT = process.env.PORT || 5000;
// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
});