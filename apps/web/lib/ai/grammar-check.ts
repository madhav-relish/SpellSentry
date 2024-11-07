import { GoogleGenerativeAI } from "@google/generative-ai";
import { GrammarCheckResponse } from '../types/grammar';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

export async function checkGrammar(text: string): Promise<GrammarCheckResponse> {
  try {
    const prompt = `
      You are a professional editor. Analyze the following text (which is in markdown format) for both spelling and grammatical errors.
      
      Analysis Rules:
      1. Identify the language of the text. If the text contains multiple languages, analyze each language separately.
      2. For each language, check for both spelling and grammar in a single pass.
      3. Grammar errors include:
         - Subject-verb agreement (e.g., "they is" → "they are").
         - Verb tense errors (e.g., "I been" → "I have been").
         - Article usage (e.g., "I saw dog" → "I saw a dog").
         - Word order (e.g., "car red" → "red car").
         - If multiple mistakes are there in a sentence then just give the correct sentence with all the correct changes.
      4. Spelling errors include:
         - Wrong letters (e.g., "speeling" → "spelling").
         - Double/single letter errors (e.g., "grammer" → "grammar").
         - Missing letters (e.g., "spel" → "spell").
         - Check the correct spelling with the sentence where it is being used, add it only if it makes sense otherwise try again with the context of the sentence.
     
      
      Important:
      - Each error should only appear in either spelling OR grammar category.
      - Understand the correct answers with the context of the sentence first and check whether it makes sense or not before making any decision.
      - If an error is in a different language, the correct result and explanation should ONLY be provided in that language. For example, if the error is in Spanish, the suggestion and explanation should also be in Spanish.
      - Misspelled words go in "spelling".
      - Incorrect phrases/sentences go in "grammar".
      - Include clear explanations for grammar errors.
      - Double-check all suggestions.
      - Maintain the JSON Format
      

      ----------------------------------------------------
      Text to analyze:
      ${text}
      

      -----------------------------------------------------
      Return ONLY a JSON response with this exact structure:
      {
        "languages": ["en", "es", ...],
        "spelling": [
          {
            "word": "misspelled word",
            "suggestion": "correct spelling",
            "correct_sentence": "Add the correct sentence with the correct spelling"
            "context": "... text before [error] text after ..." || "",
            "position": number,
            "language": "language code"
          }
        ],
        "grammar": [
          {
            "phrase": "incorrect phrase",
            "suggestion": "correct phrase",
            "context": "... text before [error] text after ..." || "",
            "position": number,
            "explanation": "detailed explanation in the same language as the error",
            "language": "language code"
          }
        ]
      }`;

    // Generate content using the AI model
    const result = await model.generateContent(prompt);
    const response = result.response;
    const textResponse = await response.text(); // Await the text response

    console.log("AI Response:", textResponse);
    
    // Extract JSON from the response
    const jsonMatch = textResponse.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No valid JSON found in response');
    }
    
    // Parse the JSON response
    const parsedResponse = JSON.parse(jsonMatch[0]) as GrammarCheckResponse;
    return parsedResponse;
  } catch (error) {
    console.error('Error checking grammar:', error);
    throw new Error('Failed to check grammar');
  }
} 