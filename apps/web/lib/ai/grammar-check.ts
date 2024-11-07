import { GoogleGenerativeAI } from "@google/generative-ai";
import { GrammarCheckResponse } from '../types/grammar';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

export async function checkGrammar(text: string): Promise<GrammarCheckResponse> {
  try {
    const prompt = `
      You are a professional multilingual editor. Analyze the following text for spelling and grammatical errors in any language present.
      
      Rules for Analysis:
      1. First, identify all languages present in the text
      2. For each language, analyze separately:
         - Spelling errors
         - Grammar errors
         - Language-specific rules
      
      Rules for Spelling Errors:
      - Only include actual misspelled words (e.g., "grammer" → "grammar")
      - Ignore technical terms, brand names, or intentional variations
      - Provide the correct spelling
      - Show context with [...] around the error
      
      Rules for Grammar Errors:
      - Focus on sentence structure and syntax
      - Common issues to check:
        * Subject-verb agreement (e.g., "you was" → "you were")
        * Tense consistency
        * Article usage
        * Word order
      - Provide a clear explanation of the grammar rule being violated
      - Show full context of the grammatical error
      
      Important:
      - DO NOT classify spelling errors as grammar errors
      - Each error should only appear in one category
      - Be thorough - check every word and sentence
      - Include language identification for each error
      - Maintain exact position numbers for reference
      
      Text to analyze:
      ${text}
      
      Return ONLY a JSON response with this exact structure:
      {
        "languages": ["en", "es", ...],
        "spelling": [
          {
            "word": "misspelled word",
            "suggestion": "correct spelling",
            "context": "... text before [error] text after ...",
            "position": number,
            "language": "language code"
          }
        ],
        "grammar": [
          {
            "phrase": "incorrect grammar phrase",
            "suggestion": "correct grammar",
            "context": "... text before [error] text after ...",
            "position": number,
            "explanation": "detailed explanation of the grammar rule",
            "language": "language code"
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
    return parsedResponse;
  } catch (error) {
    console.error('Error checking grammar:', error);
    throw new Error('Failed to check grammar');
  }
} 