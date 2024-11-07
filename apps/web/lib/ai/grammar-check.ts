import { GoogleGenerativeAI } from "@google/generative-ai";
import { GrammarCheckResponse } from '../types/grammar';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

export async function checkGrammar(text: string): Promise<GrammarCheckResponse> {
  try {
    const prompt = `
      You are a professional editor. Analyze the following text for both spelling and grammatical errors.
      
      Rules:
      1. Separate spelling errors from grammatical errors
      2. For spelling errors:
         - Identify misspelled words
         - Provide correct spelling
         - Show context
      3. For grammar errors:
         - Identify incorrect grammar
         - Provide correction
         - Explain the rule being violated
         - Show context
      4. Be thorough - catch ALL errors
      5. Include position numbers
      
      Text to analyze:
      ${text}
      
      Return ONLY a JSON response with this exact structure:
      {
        "spelling": [
          {
            "word": "misspelled word",
            "suggestion": "correct spelling",
            "context": "... text before [error] text after ...",
            "position": number
          }
        ],
        "grammar": [
          {
            "phrase": "incorrect grammar",
            "suggestion": "correct grammar",
            "context": "... text before [error] text after ...",
            "position": number,
            "explanation": "explanation of the grammar rule"
          }
        ]
      }`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const textResponse = response.text();
    
    console.log("AI Response:", textResponse);
    
    // Extract JSON from the response
    const jsonMatch = textResponse.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No valid JSON found in response');
    }
    
    const parsedResponse = JSON.parse(jsonMatch[0]) as GrammarCheckResponse;
    return parsedResponse;
  } catch (error) {
    console.error('Error checking grammar:', error);
    throw new Error('Failed to check grammar');
  }
} 