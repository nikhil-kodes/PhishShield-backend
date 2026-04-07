import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini API with your API key
const genAI = new GoogleGenerativeAI({ apiKey: process.env.GEMINI_API_KEY });

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

export async function generateGeminiResponse(query) {
  try {
    // Combine system prompt with user query
    const prompt = `${SYSTEM_PROMPT}\n\nUser Query: ${query}`;

    // Use the client's text generation method
    // Note: SDK method names may vary between versions; this matches common patterns
    const response = await genAI.responses.create({
      model: 'gemini-pro',
      input: prompt,
      maxOutputTokens: 512,
      temperature: 0.2,
    });

    // Extract plain text output
    const text = response.output?.[0]?.content?.[0]?.text || response.outputText || '';
    return text;
  } catch (error) {
    console.error('Error generating Gemini response:', error);
    throw new Error('Failed to generate AI response');
  }
}