import express from 'express';
import { getQuestions, saveGame } from '../controllers/quizController.js';

const router = express.Router();

// Ruta para generar preguntas según el tema
router.get('/preguntas/:tema', getQuestions);

// Ruta para guardar partida jugada
router.post('/guardar', saveGame);

export default router;
