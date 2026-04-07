import express from 'express';
import { processQuery } from '../controllers/geminiController.js';

const router = express.Router();

// Route to process queries through Gemini API
router.post('/query', processQuery);

export default router;