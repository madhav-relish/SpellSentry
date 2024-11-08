import { GoogleGenerativeAI } from "@google/generative-ai";
import { GrammarCheckResponse } from '../types/grammar';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash", generationConfig: {
    responseMimeType: "application/json"
} });

export async function checkGrammar(text: string): Promise<GrammarCheckResponse> {
  try {
    const prompt = `
      You are an editor. Analyze the following text (in markdown format) for spelling and grammatical errors, but only report actual mistakes.

      ### Instructions:
      1. Identify the language of the text. If there are multiple languages, analyze each separately in that language only and provide corrections in the same language as the error.
      2. Check for spelling and grammar errors in one pass.
      3. **Grammar Errors**:
         - Correct subject-verb agreement.
         - Fix verb tense errors.
         - Correct article usage.
         - Adjust word order.
         - Provide the corrected sentence if there are multiple mistakes.
      4. **Spelling Errors**:
         - Only report words that are misspelled or incorrect.
         - Check for the mistakes in that language only means if something is wrttien in spanish then test it in spanish.
         - Do not report words that are spelled correctly.
         - Ensure corrections make sense in context and maintain the original language.

      ### Important Notes:
      - Each error should be categorized as either spelling or grammar.
      - Provide explanations for grammar corrections in the same language as the error.
      - If an error is in a different language other than english then respond in that language without translating it to English.

      ### Text to Analyze:
      ${text}

      ### Expected JSON Format:
      {
        "languages": ["en", "es", ...],
        "spelling": [
          {
            "word": "misspelled word",
            "suggestion": "correct spelling",
            "correct_sentence": "Correct sentence with the correct spelling",
            "context": "... text before [error] text after ...",
            "position": number,
            "language": "language code"
          }
        ],
        "grammar": [
          {
            "phrase": "incorrect phrase",
            "suggestion": "correct phrase",
            "context": "... text before [error] text after ...",
            "position": number,
            "explanation": "Explanation in the same language as the error",
            "language": "language code"
          }
        ]
      }
    `;

    // Generate content using the AI model
    const result = await model.generateContent(prompt);
    const response = result.response;
    const textResponse = await response.text(); // Await the text response

    // Log the raw response for debugging
    console.log("Raw AI Response:", textResponse);

    // Parse the JSON response directly
    const parsedResponse = JSON.parse(textResponse) as GrammarCheckResponse;

    return parsedResponse;
  } catch (error) {
    console.error('Error checking grammar:', error);
    throw new Error('Failed to check grammar');
  }
} 