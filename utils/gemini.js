const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize Gemini API with your API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Prepare prompt with rules and guidelines
const SYSTEM_PROMPT = `You are a cyber security expert focused on helping users identify phishing attempts.
Rules:
1. Keep responses concise and focused
2. Use simple, clear language
3. Highlight specific security concerns
4. Provide actionable advice
5. Don't include technical jargon unless necessary
6. Be definitive in assessments when possible
7. Don't include external links or references
8. Format response in plain text only`;

async function generateGeminiResponse(query) {
  try {
    // Get the generative model
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // Combine system prompt with user query
    const prompt = SYSTEM_PROMPT + "\n\nUser Query: " + query;

    // Generate response
    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    // Get the text content and return
    return response.text();
  } catch (error) {
    console.error('Error generating Gemini response:', error);
    throw new Error('Failed to generate AI response');
  }
}

module.exports = { generateGeminiResponse };