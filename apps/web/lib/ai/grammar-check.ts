import { GoogleGenerativeAI } from "@google/generative-ai";
import { GrammarError, GrammarCheckResponse } from '../types/grammar';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

export async function checkGrammar(text: string): Promise<GrammarError[]> {
  try {
    const prompt = `
      You are a professional editor. Your task is to analyze the following text for grammar and spelling errors.
      
      Rules:
      1. Focus on grammar, spelling, and punctuation errors
      2. Provide clear, actionable suggestions for improvements
      3. Include context around each error
      4. Be precise with error positions
      
      Text to analyze:
      ${text}
      
      Return ONLY a JSON response with this exact structure:
      {
        "errors": [
          {
            "word": "incorrect word or phrase",
            "suggestion": "corrected version",
            "context": "... text before [error] text after ...",
            "position": number
          }
        ]
      }`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const textResponse = response.text();
    
    // Extract JSON from the response
    const jsonMatch = textResponse.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No valid JSON found in response');
    }
    
    const parsedResponse = JSON.parse(jsonMatch[0]) as GrammarCheckResponse;
    return parsedResponse.errors;
  } catch (error) {
    console.error('Error checking grammar:', error);
    throw new Error('Failed to check grammar');
  }
} 