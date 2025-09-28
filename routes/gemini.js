const express = require('express');
const { processQuery } = require('../controllers/geminiController');
const router = express.Router();

// Route to process queries through Gemini API
router.post('/query', processQuery);

module.exports = router;