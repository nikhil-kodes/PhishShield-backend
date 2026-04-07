import { generateGeminiResponse } from '../utils/gemini.js';
import asyncHandler from '../middlewares/asyncHandler.js';

// Controller to handle Gemini API queries
export const processQuery = asyncHandler(async (req, res) => {
    const { query } = req.body;

    if (!query) {
        return res.status(400).json({
            success: false,
            error: 'Query is required',
        });
    }

    const response = await generateGeminiResponse(query);

    res.status(200).json({
        success: true,
        response,
    });
});