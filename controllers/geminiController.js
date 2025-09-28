const { generateGeminiResponse } = require('../utils/gemini');
const asyncHandler = require('../middlewares/asyncHandler');

// Controller to handle Gemini API queries
exports.processQuery = asyncHandler(async (req, res) => {
    const { query } = req.body;

    if (!query) {
        return res.status(400).json({
            success: false,
            error: 'Query is required'
        });
    }

    const response = await generateGeminiResponse(query);
    
    res.status(200).json({
        success: true,
        response
    });
});